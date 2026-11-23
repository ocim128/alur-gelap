"""Shared verifier helpers for per-episode export audits.

Extracts the hardening requested from the Episode 004/005 post-mortems:

- verification reports are bound to the target MP4 filename plus its SHA-256 and
  are never silently overwritten (`write_report` refuses existing paths),
- flash/jolt/luma checks scan a surrounding frame interval instead of trusting a
  single scheduled frame (`first_exceeding`, `scan_flash_window`),
- silent intervals on a decoded AAC delivery report RMS *and* edge peaks and carry
  a measured `isDigitalZero` flag, so a report never claims digital zero on AAC
  without evidence,
- short listening-check clips are auto-exported around splices, dialogue
  overlaps, rewinds and the final word-to-stinger tail (`export_listening_clips`).

Standard library only; the ffmpeg/ffprobe helpers degrade to explicit errors when
the binaries are unavailable.
"""

import hashlib
import json
import math
import os
import re
import shutil
import subprocess
import sys
from array import array
from pathlib import Path


def sha256_file(path, chunk_size=1 << 20):
    digest = hashlib.sha256()
    with open(path, "rb") as handle:
        for chunk in iter(lambda: handle.read(chunk_size), b""):
            digest.update(chunk)
    return digest.hexdigest()


def bind_target(report, mp4_path):
    """Bind a report to the delivered MP4: filename, SHA-256 and size."""
    mp4_path = Path(mp4_path)
    report["target"] = {
        "filename": mp4_path.name,
        "sha256": sha256_file(mp4_path),
        "sizeBytes": mp4_path.stat().st_size,
    }
    return report


def write_report(report, out_path, mp4_path, overwrite=False):
    """Write a JSON report bound to the target MP4. Refuses to overwrite by default."""
    out_path = Path(out_path)
    if out_path.exists() and not overwrite:
        raise FileExistsError(
            f"verification report already exists: {out_path}; write to a new name "
            "(see next_report_path) or pass overwrite=True deliberately"
        )
    out_path.parent.mkdir(parents=True, exist_ok=True)
    bound = bind_target(report, mp4_path)
    out_path.write_text(json.dumps(bound, indent=2) + "\n", encoding="utf-8")
    return out_path


def next_report_path(directory, stem):
    """First free verification-report path: stem.json, stem-2.json, stem-3.json, ..."""
    directory = Path(directory)
    candidate = directory / f"{stem}.json"
    suffix = 2
    while candidate.exists():
        candidate = directory / f"{stem}-{suffix}.json"
        suffix += 1
    return candidate


def dbfs(amplitude):
    return 20.0 * math.log10(max(amplitude, 1e-10))


def rms_dbfs(samples):
    if not samples:
        return -200.0
    total = 0.0
    for value in samples:
        total += float(value) * float(value)
    return dbfs(math.sqrt(total / len(samples)))


def peak_dbfs(samples):
    return dbfs(max((abs(float(value)) for value in samples), default=0.0))


def find_silence_intervals(samples, sample_rate, threshold_dbfs=-60.0,
                           min_interval_sec=0.08, hop_sec=0.02, edge_sec=0.02):
    """Detect silent stretches with measured RMS and edge peaks.

    `samples` is a float iterable in [-1, 1] (a decoded AAC mix). Each interval
    reports its RMS, the peak amplitude near both edges (where codec residue
    appears first) and a measured `isDigitalZero` flag. AAC decoders essentially
    never produce exact zeros; never claim digital zero on AAC unless this flag
    is true for the whole interval.
    """
    hop = max(1, round(hop_sec * sample_rate))
    min_interval = max(1, round(min_interval_sec * sample_rate))
    edge = max(1, round(edge_sec * sample_rate))
    samples = list(samples)
    intervals = []
    current = None
    for start in range(0, len(samples), hop):
        end = min(len(samples), start + hop)
        quiet = rms_dbfs(samples[start:end]) < threshold_dbfs
        if quiet:
            if current is None:
                current = [start, end]
            else:
                current[1] = end
        elif current is not None:
            intervals.append(current)
            current = None
    if current is not None:
        intervals.append(current)

    report = []
    for start, end in intervals:
        if end - start < min_interval:
            continue
        section = samples[start:end]
        digital_zero = all(value == 0 for value in section)
        edge_peak = 0.0
        for i in list(range(start, min(end, start + edge))) + list(range(max(start, end - edge), end)):
            edge_peak = max(edge_peak, abs(float(samples[i])))
        report.append({
            "startSec": round(start / sample_rate, 6),
            "endSec": round(end / sample_rate, 6),
            "durationSec": round((end - start) / sample_rate, 6),
            "rmsDbfs": round(rms_dbfs(section), 2),
            "edgePeakDbfs": round(dbfs(edge_peak), 2),
            "isDigitalZero": digital_zero,
            "sampleCount": end - start,
        })
    return report


def first_exceeding(values, start, end, threshold):
    """First index in [start, end) whose value exceeds threshold, or None.

    Audits scan a surrounding interval instead of trusting one scheduled frame:
    an earlier flash or jolt inside the window must be found, not missed.
    """
    start = max(0, start)
    end = min(len(values), end)
    for index in range(start, end):
        if values[index] > threshold:
            return index
    return None


def scan_flash_window(lumas, scheduled_frame, radius_frames, threshold):
    """Scan `radius_frames` around a scheduled flash/jolt frame for the real transition."""
    window_start = max(0, scheduled_frame - radius_frames)
    window_end = min(len(lumas), scheduled_frame + radius_frames + 1)
    index = first_exceeding(lumas, window_start, window_end, threshold)
    return {
        "scheduledFrame": scheduled_frame,
        "scannedWindow": [window_start, window_end],
        "firstExceedingFrame": index,
        "offsetFrames": None if index is None else index - scheduled_frame,
        "maxLuma": max(lumas[window_start:window_end], default=0.0),
        "threshold": threshold,
    }


def ffmpeg_available():
    return shutil.which("ffmpeg") is not None


def _run_ffmpeg(args, stdout_pipe=True):
    return subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", *args],
                          stdout=subprocess.PIPE if stdout_pipe else subprocess.DEVNULL,
                          stderr=subprocess.PIPE, check=False)


def decode_mono_f32(path, sample_rate):
    """Decode a file's first audio stream to mono f32le PCM samples."""
    result = _run_ffmpeg(["-i", str(path), "-map", "0:a:0", "-ac", "1",
                          "-ar", str(sample_rate), "-f", "f32le", "pipe:1"])
    if result.returncode != 0 or not result.stdout:
        raise RuntimeError(f"failed to decode audio from {path}: {result.stderr.decode(errors='replace')}")
    samples = array("f")
    samples.frombytes(result.stdout)
    if sys.byteorder == "big":
        samples.byteswap()
    return samples


def measure_loudness(path):
    """Integrated LUFS and true peak (dBFS) via the ebur128 filter."""
    null_target = "NUL" if os.name == "nt" else "-"
    result = subprocess.run(
        ["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-af", "ebur128=peak=true",
         "-f", "null", null_target],
        stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, check=False)
    if result.returncode != 0:
        raise RuntimeError(f"loudness measurement failed for {path}: {result.stderr.decode(errors='replace')}")
    summary = result.stderr.decode(errors="replace").rsplit("Summary:", 1)[-1]
    integrated = re.search(r"I:\s*(-?[\d.]+)\s*LUFS", summary)
    peak = re.search(r"Peak:\s*(-?[\d.]+)\s*dBFS", summary)
    if not integrated or not peak:
        raise RuntimeError(f"loudness summary not parseable for {path}")
    return {"integratedLufs": float(integrated.group(1)), "truePeakDbfs": float(peak.group(1))}


def frame_lumas(path, frames, width=64, height=360):
    """Mean luma for the given 0-based frame indices, decoded at a small size."""
    frames = sorted(set(frames))
    if not frames:
        return []
    expression = "+".join(f"eq(n,{frame})" for frame in frames)
    result = _run_ffmpeg(["-i", str(path), "-vf",
                          f"select='{expression}',scale={width}:{height}:flags=neighbor,format=gray",
                          "-fps_mode", "vfr", "-f", "rawvideo", "pipe:1"])
    if result.returncode != 0:
        raise RuntimeError(f"frame decode failed for {path}: {result.stderr.decode(errors='replace')}")
    frame_bytes = width * height
    if len(result.stdout) % frame_bytes:
        raise RuntimeError(f"unexpected raw luma payload size {len(result.stdout)} for {len(frames)} frames")
    lumas = []
    for offset in range(0, len(result.stdout), frame_bytes):
        total = sum(result.stdout[offset:offset + frame_bytes])
        lumas.append(round(total / frame_bytes, 2))
    return lumas


def export_listening_clips(path, events, out_dir, before_sec=1.0, after_sec=1.0,
                           sample_rate=48000, overwrite=False):
    """Auto-export short listening-check WAV clips around audit events.

    `events` are dicts with `name`, `startSec` and optional `endSec` (splices,
    dialogue overlaps, rewinds, the final word-to-stinger tail). Existing clips
    are never overwritten unless overwrite=True.
    """
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    written = []
    for event in events:
        name = re.sub(r"[^a-zA-Z0-9_.-]+", "-", event["name"]).strip("-")
        start = max(0.0, float(event["startSec"]) - before_sec)
        end = float(event.get("endSec", event["startSec"])) + after_sec
        duration = max(0.05, end - start)
        clip = out_dir / f"listen-{name}-{start:.2f}s.wav"
        if clip.exists() and not overwrite:
            raise FileExistsError(f"listening clip already exists: {clip}; choose a fresh directory or overwrite=True")
        result = _run_ffmpeg(["-ss", f"{start:.3f}", "-i", str(path), "-t", f"{duration:.3f}",
                              "-map", "0:a:0", "-ac", "1", "-ar", str(sample_rate), str(clip)])
        if result.returncode != 0:
            raise RuntimeError(f"clip export failed for {event['name']}: {result.stderr.decode(errors='replace')}")
        written.append(str(clip))
    return written
