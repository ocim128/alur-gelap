"""Tests for the shared verifier helpers (Episode 004/005 post-mortem hardening)."""
import json
import math
import shutil
import struct
import subprocess
import tempfile
import unittest
from pathlib import Path

from verify_export_common import (
    bind_target,
    decode_mono_f32,
    export_listening_clips,
    find_silence_intervals,
    first_exceeding,
    frame_lumas,
    measure_loudness,
    next_report_path,
    rms_dbfs,
    scan_flash_window,
    sha256_file,
    write_report,
)

FFMPEG = shutil.which("ffmpeg") is not None


def write_wav(path, samples, sample_rate=48000):
    """Minimal 16-bit mono PCM WAV writer for ffmpeg-gated tests."""
    data = b"".join(struct.pack("<h", max(-32768, min(32767, int(sample * 32767)))) for sample in samples)
    header = b"RIFF" + struct.pack("<I", 36 + len(data)) + b"WAVEfmt " + struct.pack(
        "<IHHIIHH", 16, 1, 1, sample_rate, sample_rate * 2, 2, 16) + b"data" + struct.pack("<I", len(data))
    Path(path).write_bytes(header + data)


class ReportBindingTest(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        self.target = self.tmp / "delivery.mp4"
        self.target.write_bytes(b"fake mp4 bytes")

    def test_report_refuses_overwrite_and_binds_filename_and_sha256(self):
        out = self.tmp / "export-report.json"
        write_report({"verdict": "fail"}, out, self.target)
        first = json.loads(out.read_text(encoding="utf-8"))
        self.assertEqual(first["target"]["filename"], "delivery.mp4")
        self.assertEqual(first["target"]["sha256"], sha256_file(self.target))
        self.assertEqual(first["target"]["sizeBytes"], len(b"fake mp4 bytes"))
        with self.assertRaises(FileExistsError):
            write_report({"verdict": "pass"}, out, self.target)
        write_report({"verdict": "pass"}, out, self.target, overwrite=True)
        self.assertEqual(json.loads(out.read_text(encoding="utf-8"))["verdict"], "pass")

    def test_next_report_path_finds_free_names(self):
        stem = self.tmp / "export-report"
        self.assertEqual(next_report_path(self.tmp, "export-report"), stem.with_suffix(".json"))
        stem.with_suffix(".json").write_text("{}")
        second = next_report_path(self.tmp, "export-report")
        self.assertEqual(second.name, "export-report-2.json")
        second.write_text("{}")
        self.assertEqual(next_report_path(self.tmp, "export-report").name, "export-report-3.json")
        bind_target({}, self.target)  # smoke: binding without writing


class IntervalScanTest(unittest.TestCase):
    def test_first_exceeding_scans_the_surrounding_interval(self):
        lumas = [10.0] * 40 + [180.0] + [10.0] * 20
        # A flash two frames BEFORE the scheduled frame must be found inside the window.
        self.assertEqual(first_exceeding(lumas, 35, 45, 100), 40)
        self.assertIsNone(first_exceeding(lumas, 41, 60, 100))

    def test_scan_flash_window_reports_first_transition_not_just_the_scheduled_frame(self):
        lumas = [10.0] * 10 + [200.0] * 5 + [10.0] * 10
        result = scan_flash_window(lumas, scheduled_frame=13, radius_frames=5, threshold=100)
        self.assertEqual(result["scannedWindow"], [8, 19])
        self.assertEqual(result["firstExceedingFrame"], 10)
        self.assertEqual(result["offsetFrames"], -3)
        self.assertEqual(result["maxLuma"], 200.0)
        missed = scan_flash_window([10.0] * 25, scheduled_frame=12, radius_frames=5, threshold=100)
        self.assertIsNone(missed["firstExceedingFrame"])


class SilenceIntervalTest(unittest.TestCase):
    def test_intervals_measure_rms_and_edge_peaks_and_flag_digital_zero(self):
        rate = 48000
        samples = [math.sin(2 * math.pi * 220 * i / rate) * 0.4 for i in range(rate)]
        samples += [0.0] * rate  # 1 s claimed silence with codec-style edge residue
        silence_start = len(samples) - rate
        samples[silence_start + 5] = 0.001
        samples[-10] = 0.0008
        report = find_silence_intervals(samples, rate)
        self.assertEqual(len(report), 1)
        interval = report[0]
        self.assertFalse(interval["isDigitalZero"], "edge residue means the AAC silence is not digital zero")
        self.assertLess(interval["rmsDbfs"], -60.0)
        self.assertGreater(interval["edgePeakDbfs"], -80.0, "edge peak must capture the residue")
        exact = find_silence_intervals([0.0] * rate, rate)
        self.assertEqual(len(exact), 1)
        self.assertTrue(exact[0]["isDigitalZero"])

    def test_short_noise_bursts_split_intervals(self):
        rate = 48000
        samples = [0.0] * rate + [0.5] * (rate // 10) + [0.0] * rate
        report = find_silence_intervals(samples, rate)
        self.assertEqual(len(report), 2)
        self.assertTrue(report[0]["isDigitalZero"], "exact-zero runs are flagged digital zero")
        self.assertFalse(report[1]["isDigitalZero"] and report[1]["durationSec"] > 1.5)


@unittest.skipUnless(FFMPEG, "ffmpeg not available")
class FfmpegHelpersTest(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        rate = 48000
        samples = [math.sin(2 * math.pi * 440 * i / rate) * 0.5 for i in range(rate)] + [0.0] * (rate // 2)
        self.wav = self.tmp / "tone.wav"
        write_wav(self.wav, samples, rate)

    def test_decode_mono_f32_returns_matching_amplitude(self):
        samples = decode_mono_f32(self.wav, 48000)
        self.assertGreater(len(samples), 40000)
        self.assertAlmostEqual(max(abs(float(value)) for value in samples), 0.5, delta=0.05)

    def test_measure_loudness_reports_finite_values(self):
        loudness = measure_loudness(self.wav)
        self.assertTrue(-60.0 <= loudness["integratedLufs"] <= 0.0)
        self.assertTrue(-60.0 <= loudness["truePeakDbfs"] <= 0.0)

    def test_listening_clips_export_and_refuse_overwrite(self):
        events = [
            {"name": "rewind-1", "startSec": 0.2, "endSec": 0.6},
            {"name": "final word to stinger tail", "startSec": 1.0},
        ]
        out_dir = self.tmp / "listening"
        written = export_listening_clips(self.wav, events, out_dir)
        self.assertEqual(len(written), 2)
        for clip in written:
            self.assertGreater(Path(clip).stat().st_size, 44)
        with self.assertRaises(FileExistsError):
            export_listening_clips(self.wav, events[:1], out_dir)
        again = export_listening_clips(self.wav, events[:1], out_dir, overwrite=True)
        self.assertEqual(len(again), 1)

    def test_frame_lumas_reads_selected_frames(self):
        video = self.tmp / "tiny.mp4"
        result = subprocess.run(
            ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-f", "lavfi", "-i",
             "testsrc2=size=96x160:rate=30:duration=1", "-c:v", "libx264", "-pix_fmt", "yuv420p", str(video)],
            stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, check=False)
        self.assertEqual(result.returncode, 0, result.stderr)
        lumas = frame_lumas(video, [5, 15, 15])
        self.assertEqual(len(lumas), 2, "duplicate frames collapse")
        self.assertTrue(all(0.0 <= luma <= 255.0 for luma in lumas))


if __name__ == "__main__":
    unittest.main()
