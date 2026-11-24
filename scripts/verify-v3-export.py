#!/usr/bin/env python3
"""Reproducible Studio v3 compressed-MP4 audio/bed/silence verifier.

Operational definition (locked for Studio v3 / Arsip Terakhir):
- Decode the delivered MP4's first audio stream as 48 kHz, 2-channel stereo f32le PCM.
- Partition into non-overlapping 100 ms stereo RMS windows (4,800 stereo frames =
  9,600 interleaved L/R float32 samples per window; RMS computed over all L/R samples).
- Exclude 50 ms transition edges on both sides of every listed `audio.silenceDrops`
  boundary (`[start - 0.050, start + 0.050]` and `[end - 0.050, end + 0.050]`).
- Active windows (outside all silenceDrops + 50 ms edge buffers): minimum 100 ms
  stereo RMS must be >= -50.0 dBFS.
- Listed silenceDrop interiors (`[start + 0.050, end - 0.050]`): interior stereo RMS
  must be < -50.0 dBFS.
- Exact zero-sample count: count of individual decoded 48 kHz 2-channel float32 stereo
  PCM samples equal to exact 0.0 (L and R counted separately).
- Loudness targets: integrated target -16.0 to -15.0 LUFS; recommended true peak
  <= -2.0 dBTP headroom; hard true-peak ceiling <= -1.5 dBTP.

Standard library only + ffmpeg on PATH.
"""

import argparse
import json
import statistics
import subprocess
import sys
from array import array
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
if str(SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_DIR))

import verify_export_common as common  # noqa: E402

SAMPLE_RATE = 48000
CHANNELS = 2
WINDOW_MS = 100
EDGE_EXCLUSION_MS = 50
ACTIVE_FLOOR_DBFS = -50.0
SILENCE_CEILING_DBFS = -50.0
TARGET_LUFS_BAND = (-16.0, -15.0)
RECOMMENDED_MAX_TP_DBFS = -2.0
HARD_MAX_TP_DBFS = -1.5

ZERO_SAMPLE_DEFINITION = (
    "Count of individual decoded 48 kHz 2-channel float32 stereo PCM samples "
    "with exact value == 0.0 (L and R channels counted separately)."
)


def decode_stereo_f32(path, sample_rate=SAMPLE_RATE):
    """Decode a file's first audio stream to interleaved 2-channel f32le PCM."""
    result = subprocess.run(
        [
            "ffmpeg",
            "-hide_banner",
            "-loglevel",
            "error",
            "-i",
            str(path),
            "-map",
            "0:a:0",
            "-ac",
            str(CHANNELS),
            "-ar",
            str(sample_rate),
            "-f",
            "f32le",
            "pipe:1",
        ],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )
    if result.returncode != 0 or not result.stdout:
        raise RuntimeError(
            f"failed to decode stereo audio from {path}: "
            f"{result.stderr.decode(errors='replace')}"
        )
    samples = array("f")
    samples.frombytes(result.stdout)
    if sys.byteorder == "big":
        samples.byteswap()
    usable = (len(samples) // CHANNELS) * CHANNELS
    return samples[:usable]


def analyze_stereo_windows(
    stereo_samples,
    silence_drops=None,
    sample_rate=SAMPLE_RATE,
    window_ms=WINDOW_MS,
    edge_exclusion_ms=EDGE_EXCLUSION_MS,
    active_floor_dbfs=ACTIVE_FLOOR_DBFS,
    silence_ceiling_dbfs=SILENCE_CEILING_DBFS,
):
    """Analyze non-overlapping 100 ms stereo RMS windows and listed silenceDrops.

    `stereo_samples` is an interleaved 2-channel float sequence `[L0, R0, L1, R1, ...]`.
    `silence_drops` is a list of dicts with `startSec`, `endSec` (and optional `startFrame`,
    `endFrame`, `reason`).
    """
    drops = list(silence_drops or [])
    total_stereo_samples = (len(stereo_samples) // CHANNELS) * CHANNELS
    total_frames = total_stereo_samples // CHANNELS
    win_frames = max(1, round((window_ms / 1000.0) * sample_rate))
    edge_sec = edge_exclusion_ms / 1000.0

    # Global exact zero-sample count across all decoded L/R samples.
    global_zero_count = sum(1 for i in range(total_stereo_samples) if stereo_samples[i] == 0.0)

    # Pre-partition non-overlapping 100 ms windows across full frames.
    num_windows = total_frames // win_frames
    windows = []
    for idx in range(num_windows):
        f_start = idx * win_frames
        f_end = f_start + win_frames
        s_start = f_start * CHANNELS
        s_end = f_end * CHANNELS
        chunk = stereo_samples[s_start:s_end]
        w_start_sec = f_start / sample_rate
        w_end_sec = f_end / sample_rate
        windows.append({
            "index": idx,
            "startSec": round(w_start_sec, 6),
            "endSec": round(w_end_sec, 6),
            "rmsDbfs": round(common.rms_dbfs(chunk), 2),
        })

    # Active windows: strictly outside every [drop.startSec - edge, drop.endSec + edge].
    active_windows = []
    excluded_transition_windows = 0
    for w in windows:
        overlaps_drop_or_edge = False
        for drop in drops:
            if w["endSec"] > (drop["startSec"] - edge_sec) and w["startSec"] < (drop["endSec"] + edge_sec):
                overlaps_drop_or_edge = True
                break
        if overlaps_drop_or_edge:
            # Check if it's purely in an interior or straddles an edge
            inside_any_interior = any(
                w["startSec"] >= (d["startSec"] + edge_sec) - 1e-9
                and w["endSec"] <= (d["endSec"] - edge_sec) + 1e-9
                for d in drops
            )
            if not inside_any_interior:
                excluded_transition_windows += 1
            continue
        active_windows.append(w)

    active_rms_values = [w["rmsDbfs"] for w in active_windows]
    below_floor = [w for w in active_windows if w["rmsDbfs"] < active_floor_dbfs]
    active_passed = len(active_windows) > 0 and len(below_floor) == 0

    drop_reports = []
    for drop in drops:
        d_start = float(drop["startSec"])
        d_end = float(drop["endSec"])
        int_start = d_start + edge_sec
        int_end = d_end - edge_sec

        interior_windows = [
            w for w in windows
            if w["startSec"] >= int_start - 1e-9 and w["endSec"] <= int_end + 1e-9
        ]

        f_int_start = max(0, min(total_frames, round(int_start * sample_rate)))
        f_int_end = max(f_int_start, min(total_frames, round(int_end * sample_rate)))
        interior_slice = stereo_samples[f_int_start * CHANNELS : f_int_end * CHANNELS]
        interior_total_samples = len(interior_slice)
        interior_zero_count = sum(1 for v in interior_slice if v == 0.0)
        interior_rms = round(common.rms_dbfs(interior_slice), 2) if interior_total_samples > 0 else None

        drop_passed = (
            len(interior_windows) > 0
            and interior_rms is not None
            and interior_rms < silence_ceiling_dbfs
        )
        drop_reports.append({
            "startFrame": drop.get("startFrame"),
            "endFrame": drop.get("endFrame"),
            "startSec": round(d_start, 6),
            "endSec": round(d_end, 6),
            "interiorStartSec": round(int_start, 6),
            "interiorEndSec": round(int_end, 6),
            "reason": drop.get("reason", ""),
            "interiorWindowCount": len(interior_windows),
            "interiorRmsDbfs": interior_rms,
            "interiorMinRmsDbfs": min((w["rmsDbfs"] for w in interior_windows), default=None),
            "interiorMaxRmsDbfs": max((w["rmsDbfs"] for w in interior_windows), default=None),
            "exactZeroSampleCount": interior_zero_count,
            "totalStereoSamples": interior_total_samples,
            "isDigitalZero": interior_total_samples > 0 and interior_zero_count == interior_total_samples,
            "passed": drop_passed,
        })

    return {
        "windowSpec": {
            "sampleRateHz": sample_rate,
            "channels": CHANNELS,
            "windowMs": window_ms,
            "edgeExclusionMs": edge_exclusion_ms,
            "nonOverlapping": True,
            "totalWindows": len(windows),
            "excludedTransitionWindows": excluded_transition_windows,
        },
        "activeAudio": {
            "windowCount": len(active_windows),
            "floorDbfs": active_floor_dbfs,
            "minRmsDbfs": min(active_rms_values) if active_rms_values else None,
            "maxRmsDbfs": max(active_rms_values) if active_rms_values else None,
            "medianRmsDbfs": round(statistics.median(active_rms_values), 2) if active_rms_values else None,
            "belowFloorWindows": below_floor,
            "passed": active_passed,
        },
        "silenceDrops": drop_reports,
        "exactZeroSamples": {
            "definition": ZERO_SAMPLE_DEFINITION,
            "globalZeroSampleCount": global_zero_count,
            "globalTotalStereoSamples": total_stereo_samples,
            "isGlobalDigitalZero": total_stereo_samples > 0 and global_zero_count == total_stereo_samples,
        },
    }


def verify_v3_export(mp4_path, script_path):
    """Run full hash-bound v3 compressed-MP4 audio/bed/silence verification."""
    mp4_path = Path(mp4_path)
    script_path = Path(script_path)
    script = json.loads(script_path.read_text(encoding="utf-8"))
    fps = int(script.get("fps", 30))
    duration_frames = int(script.get("durationInFrames", 0))

    raw_drops = script.get("audio", {}).get("silenceDrops", []) or []
    silence_drops = [
        {
            "startFrame": int(d["startFrame"]),
            "endFrame": int(d["endFrame"]),
            "startSec": int(d["startFrame"]) / fps,
            "endSec": int(d["endFrame"]) / fps,
            "reason": d.get("reason", ""),
        }
        for d in raw_drops
    ]

    loudness = common.measure_loudness(mp4_path)
    stereo_samples = decode_stereo_f32(mp4_path, SAMPLE_RATE)
    analysis = analyze_stereo_windows(stereo_samples, silence_drops=silence_drops, sample_rate=SAMPLE_RATE)

    integrated = loudness["integratedLufs"]
    true_peak = loudness["truePeakDbfs"]
    true_peak_pass = true_peak <= HARD_MAX_TP_DBFS
    true_peak_recommended = true_peak <= RECOMMENDED_MAX_TP_DBFS
    within_target_lufs = TARGET_LUFS_BAND[0] <= integrated <= TARGET_LUFS_BAND[1]

    failures = []
    if not true_peak_pass:
        failures.append(
            f"true peak {true_peak:.2f} dBTP exceeds hard ceiling {HARD_MAX_TP_DBFS:.1f} dBTP"
        )
    if not analysis["activeAudio"]["passed"]:
        count = len(analysis["activeAudio"]["belowFloorWindows"])
        worst = analysis["activeAudio"]["minRmsDbfs"]
        failures.append(
            f"{count} active 100 ms stereo window(s) dipped below {ACTIVE_FLOOR_DBFS:.1f} dBFS (min {worst} dBFS)"
        )
    for idx, drop in enumerate(analysis["silenceDrops"]):
        if not drop["passed"]:
            failures.append(
                f"listed silenceDrop[{idx}] ({drop['startSec']:.2f}-{drop['endSec']:.2f}s) "
                f"interior RMS {drop['interiorRmsDbfs']} dBFS did not drop below {SILENCE_CEILING_DBFS:.1f} dBFS"
            )

    report = {
        "schema": "studio-v3-export-verification-v1",
        "script": {
            "path": str(script_path),
            "id": script.get("id"),
            "sha256": common.sha256_file(script_path),
            "fps": fps,
            "durationInFrames": duration_frames,
            "durationSec": round(duration_frames / fps, 3) if fps > 0 else None,
        },
        "loudness": {
            "integratedLufs": integrated,
            "truePeakDbfs": true_peak,
            "targetLufsBand": list(TARGET_LUFS_BAND),
            "withinTargetLufsBand": within_target_lufs,
            "recommendedMaxTruePeakDbfs": RECOMMENDED_MAX_TP_DBFS,
            "withinRecommendedTruePeak": true_peak_recommended,
            "hardMaxTruePeakDbfs": HARD_MAX_TP_DBFS,
            "truePeakPass": true_peak_pass,
        },
        **analysis,
        "passed": len(failures) == 0,
        "failures": failures,
    }
    return common.bind_target(report, mp4_path)


def main(argv=None):
    parser = argparse.ArgumentParser(
        description="Verify Studio v3 compressed MP4 loudness, 100 ms stereo bed floor, and listed silenceDrops."
    )
    parser.add_argument("mp4", help="Path to the compressed delivery MP4")
    parser.add_argument("script", help="Path to the episode chat-script.json")
    parser.add_argument("--out", help="Optional path to write hash-bound JSON report (refuses overwrite)")
    args = parser.parse_args(argv)

    report = verify_v3_export(args.mp4, args.script)
    if args.out:
        common.write_report(report, args.out, args.mp4, overwrite=False)
    print(json.dumps(report, indent=2))
    return 0 if report["passed"] else 1


if __name__ == "__main__":
    sys.exit(main())
