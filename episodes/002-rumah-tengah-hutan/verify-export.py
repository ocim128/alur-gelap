"""Measure encoded audio sync against the deterministic thunder source."""
import json
import subprocess
import sys
from pathlib import Path
import numpy as np

video = Path(sys.argv[1] if len(sys.argv) > 1 else 'out/002-rumah-tengah-hutan/Skenario02RumahTengahHutan-polish-v2-lossless.mp4')
sr = 48000

def decode(start, duration):
    data = subprocess.check_output(['ffmpeg', '-v', 'error', '-ss', str(start), '-i', str(video),
        '-t', str(duration), '-map', '0:a:0', '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'])
    return np.frombuffer(data, dtype='<f4')

def thunder(seed):
    rng = np.random.default_rng(seed)
    x = rng.standard_normal(int(sr * 2.8)).astype(np.float32)
    low = np.cumsum(x, dtype=np.float64)
    low[90:] -= low[:-90].copy()
    low[:90] = 0
    t = np.arange(len(x)) / sr
    return (x * .22 * np.exp(-t * 18) + (low / 20) * .8 * np.exp(-t * 1.8)).astype(np.float32)

results = {}
results['visualFlashes'] = {}
for label, first_frame in [('setup', 891), ('climax', 3628), ('impact', 3718)]:
    # Seek exactly three frames before each cue and inspect seven grayscale frames.
    data = subprocess.check_output(['ffmpeg', '-v', 'error', '-ss', str((first_frame - 3) / 30),
        '-i', str(video), '-frames:v', '7', '-an', '-vf', 'scale=24:42',
        '-pix_fmt', 'gray', '-f', 'rawvideo', '-'])
    frames = np.frombuffer(data, dtype=np.uint8).reshape(-1, 42, 24)
    means = frames.mean(axis=(1, 2))
    bright = [first_frame - 3 + i for i, mean in enumerate(means) if mean > 190]
    results['visualFlashes'][label] = {'expectedFrame': first_frame,
        'brightFrames': bright, 'meanLuma': [round(float(x), 1) for x in means]}
for name, expected, seed in [('setup', 32.7, 9), ('climax', 3718 / 30, 18)]:
    window_start = expected - .12
    signal = decode(window_start, .4)[::8]
    reference = thunder(seed)[:round(.14 * sr):8]
    correlations = np.correlate(signal, reference, mode='valid')
    index = int(np.argmax(np.abs(correlations)))
    found = window_start + index / (sr / 8)
    results[name] = {'expectedSec': expected, 'detectedSec': round(found, 6),
                     'offsetMs': round((found - expected) * 1000, 3),
                     'normalizedCorrelation': round(float(abs(correlations[index]) /
                         (np.linalg.norm(signal[index:index + len(reference)]) * np.linalg.norm(reference))), 4)}

results['silence'] = {}
for label, start, duration in [('postRewind', 88.6, 1.6), ('postThunder', 139, 2), ('blackoutLead', 152.5, .15)]:
    samples = decode(start, duration)
    results['silence'][label] = {'startSec': start, 'durationSec': duration,
        'peak': round(float(np.max(np.abs(samples))), 8),
        'rms': round(float(np.sqrt(np.mean(samples * samples))), 8)}

out = Path(sys.argv[2] if len(sys.argv) > 2 else 'episodes/002-rumah-tengah-hutan/export-sync-polish-v2.json')
out.write_text(json.dumps(results, indent=2) + '\n', encoding='utf-8')
print(json.dumps(results, indent=2))
