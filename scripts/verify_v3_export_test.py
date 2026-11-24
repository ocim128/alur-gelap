import importlib.util
import json
import math
import subprocess
import sys
import tempfile
import unittest
import wave
from array import array
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPTS_DIR))
import verify_export_common as common  # noqa: E402

SPEC = importlib.util.spec_from_file_location("verify_v3_export", SCRIPTS_DIR / "verify-v3-export.py")
verify_v3 = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(verify_v3)


def make_stereo_sine(duration_sec, rms_dbfs, freq=440.0, sample_rate=48000):
    """Interleaved 2-channel float32 stereo sine with target stereo RMS in dBFS."""
    n_frames = round(duration_sec * sample_rate)
    amp = (10.0 ** (rms_dbfs / 20.0)) * math.sqrt(2.0)
    out = array("f")
    for i in range(n_frames):
        val = amp * math.sin(2.0 * math.pi * freq * (i / sample_rate))
        out.append(val)
        out.append(val)
    return out


def write_stereo_wav(path, stereo_samples, sample_rate=48000):
    pcm = array("h", (max(-32768, min(32767, round(v * 32767.0))) for v in stereo_samples))
    if sys.byteorder == "big":
        pcm.byteswap()
    with wave.open(str(path), "wb") as handle:
        handle.setnchannels(2)
        handle.setsampwidth(2)
        handle.setframerate(sample_rate)
        handle.writeframes(pcm.tobytes())


class VerifyV3ExportTests(unittest.TestCase):
    def test_compliant_stereo_pcm_passes_and_counts_exact_zeros(self):
        # 4.0 s stereo clip: 0-2.0 s active (-32 dBFS), 2.0-3.0 s listed silence (-58 dBFS), 3.0-4.0 s active (-32 dBFS)
        samples = array("f")
        samples.extend(make_stereo_sine(2.0, -32.0))
        samples.extend(make_stereo_sine(1.0, -58.0))
        samples.extend(make_stereo_sine(1.0, -32.0))

        drops = [{"startFrame": 60, "endFrame": 90, "startSec": 2.0, "endSec": 3.0, "reason": "reveal"}]
        res = verify_v3.analyze_stereo_windows(samples, silence_drops=drops)

        self.assertTrue(res["activeAudio"]["passed"])
        self.assertGreaterEqual(res["activeAudio"]["minRmsDbfs"], -50.0)
        self.assertEqual(res["activeAudio"]["belowFloorWindows"], [])
        self.assertEqual(len(res["silenceDrops"]), 1)
        self.assertTrue(res["silenceDrops"][0]["passed"])
        self.assertLess(res["silenceDrops"][0]["interiorRmsDbfs"], -50.0)
        self.assertFalse(res["silenceDrops"][0]["isDigitalZero"])
        # 50 ms edge exclusion on each side of [2.0, 3.0] excludes [1.9,2.0], [2.0,2.1], [2.9,3.0], [3.0,3.1] = 4 windows
        self.assertEqual(res["windowSpec"]["excludedTransitionWindows"], 4)
        self.assertIn("exact value == 0.0", res["exactZeroSamples"]["definition"])

    def test_unlisted_silence_dip_fails_active_floor(self):
        # Active range has an UNLISTED 0.4 s dip at -62 dBFS between 1.0 s and 1.4 s.
        samples = array("f")
        samples.extend(make_stereo_sine(1.0, -32.0))
        samples.extend(make_stereo_sine(0.4, -62.0))
        samples.extend(make_stereo_sine(1.6, -32.0))

        res = verify_v3.analyze_stereo_windows(samples, silence_drops=[])
        self.assertFalse(res["activeAudio"]["passed"])
        self.assertLess(res["activeAudio"]["minRmsDbfs"], -50.0)
        self.assertEqual(len(res["activeAudio"]["belowFloorWindows"]), 4)

    def test_exact_digital_zero_silence_counted_accurately(self):
        samples = array("f")
        samples.extend(make_stereo_sine(1.0, -30.0))
        samples.extend(array("f", [0.0] * (48000 * 2)))  # 1.0 s exact zeros
        samples.extend(make_stereo_sine(1.0, -30.0))

        drops = [{"startFrame": 30, "endFrame": 60, "startSec": 1.0, "endSec": 2.0, "reason": "zeros"}]
        res = verify_v3.analyze_stereo_windows(samples, silence_drops=drops)
        drop = res["silenceDrops"][0]
        self.assertTrue(drop["passed"])
        self.assertTrue(drop["isDigitalZero"])
        # Interior is 0.9 s (1.05 -> 1.95 s) * 48000 * 2 channels = 86,400 exact zero samples
        self.assertEqual(drop["exactZeroSampleCount"], 86400)
        self.assertEqual(drop["totalStereoSamples"], 86400)

    def test_end_to_end_cli_on_synthetic_mp4_pass_and_fail(self):
        if not common.ffmpeg_available():
            self.fail("ffmpeg must be available on PATH for verify-v3-export end-to-end test")

        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            script_path = root / "chat-script.json"
            script_path.write_text(
                json.dumps({
                    "id": "synthetic-v3-check",
                    "fps": 30,
                    "durationInFrames": 120,
                    "audio": {
                        "silenceDrops": [
                            {"startFrame": 60, "endFrame": 90, "reason": "listed drop"}
                        ]
                    },
                }),
                encoding="utf-8",
            )

            # 1) Compliant synthetic MP4: -15.5 dBFS active speech-level tone + -58 dBFS listed silence drop
            ok_wav = root / "ok.wav"
            ok_mp4 = root / "ok.mp4"
            ok_samples = array("f")
            ok_samples.extend(make_stereo_sine(2.0, -16.0, freq=260.0))
            ok_samples.extend(make_stereo_sine(1.0, -58.0, freq=260.0))
            ok_samples.extend(make_stereo_sine(1.0, -16.0, freq=260.0))
            write_stereo_wav(ok_wav, ok_samples)
            subprocess.run(
                [
                    "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
                    "-f", "lavfi", "-i", "color=c=black:s=160x160:r=30:d=4",
                    "-i", str(ok_wav),
                    "-c:v", "libx264", "-pix_fmt", "yuv420p",
                    "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2",
                    "-shortest", str(ok_mp4),
                ],
                check=True,
            )

            ok_report = verify_v3.verify_v3_export(ok_mp4, script_path)
            self.assertTrue(ok_report["passed"], msg=f"expected pass, got failures: {ok_report['failures']}")
            self.assertEqual(ok_report["target"]["sha256"], common.sha256_file(ok_mp4))
            self.assertEqual(ok_report["script"]["sha256"], common.sha256_file(script_path))
            self.assertGreaterEqual(ok_report["activeAudio"]["minRmsDbfs"], -50.0)
            self.assertLess(ok_report["silenceDrops"][0]["interiorRmsDbfs"], -50.0)

            # 2) Failing synthetic MP4: unlisted -65 dBFS dip at 0.5-1.1 s
            bad_wav = root / "bad.wav"
            bad_mp4 = root / "bad.mp4"
            bad_samples = array("f")
            bad_samples.extend(make_stereo_sine(0.5, -16.0, freq=260.0))
            bad_samples.extend(make_stereo_sine(0.6, -65.0, freq=260.0))
            bad_samples.extend(make_stereo_sine(0.9, -16.0, freq=260.0))
            bad_samples.extend(make_stereo_sine(1.0, -58.0, freq=260.0))
            bad_samples.extend(make_stereo_sine(1.0, -16.0, freq=260.0))
            write_stereo_wav(bad_wav, bad_samples)
            subprocess.run(
                [
                    "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
                    "-f", "lavfi", "-i", "color=c=black:s=160x160:r=30:d=4",
                    "-i", str(bad_wav),
                    "-c:v", "libx264", "-pix_fmt", "yuv420p",
                    "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2",
                    "-shortest", str(bad_mp4),
                ],
                check=True,
            )

            bad_report = verify_v3.verify_v3_export(bad_mp4, script_path)
            self.assertFalse(bad_report["passed"])
            self.assertFalse(bad_report["activeAudio"]["passed"])
            self.assertGreater(len(bad_report["activeAudio"]["belowFloorWindows"]), 0)


if __name__ == "__main__":
    unittest.main()
