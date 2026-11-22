"""Verify the actual encoded forest export against manifest cue frames."""
import argparse
import json
import math
import subprocess
import sys
from pathlib import Path
import numpy as np

EPISODE = Path(__file__).resolve().parent
DEFAULT_VIDEO = Path('out/002-rumah-tengah-hutan/Skenario02RumahTengahHutan-polish-v2-lossless.mp4')

def verify(video, manifest):
    fps, sr, timing = manifest['fps'], manifest['soundMix']['sampleRate'], manifest['timing']
    if not isinstance(fps, int) or fps <= 0 or not isinstance(sr, int) or sr <= 0:
        raise ValueError('Invalid manifest fps or sample rate')
    def seconds(key):
        frame, offset = timing[key + 'Frame'], timing.get(key + 'SampleOffset', 0)
        if not isinstance(frame, int) or not isinstance(offset, int):
            raise ValueError(f'{key}: expected integer frame and sample offset')
        return frame / fps + offset / sr
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

    results = {'visualFlashes': {}, 'errors': []}
    for label, key in [('setup', 'setupFlashFrame'), ('climax', 'climaxFlashFrame'), ('impact', 'climaxThunderFrame')]:
        first = timing[key]
        if not isinstance(first, int) or first < 3:
            raise ValueError(f'{key} must be an integer at least 3')
        data = subprocess.check_output(['ffmpeg', '-v', 'error', '-ss', str((first - 3) / fps),
            '-i', str(video), '-frames:v', '7', '-an', '-vf', 'scale=24:42', '-pix_fmt', 'gray', '-f', 'rawvideo', '-'])
        if len(data) != 7 * 42 * 24:
            results['errors'].append(f'{label}: missing frames near expected flash')
            continue
        means = np.frombuffer(data, dtype=np.uint8).reshape(-1, 42, 24).mean(axis=(1, 2))
        if not np.all(np.isfinite(means)):
            results['errors'].append(f'{label}: non-finite flash measurements')
            continue
        bright = [first - 3 + i for i, value in enumerate(means) if value > 190]
        onsets = [i for i in range(1, len(means)) if means[i] > 190 and means[i - 1] <= 190]
        close = [first - 3 + i for i in onsets if abs(first - 3 + i - first) <= 1]
        results['visualFlashes'][label] = {'expectedFrame': first, 'brightFrames': bright, 'onsetFrame': close[0] if close else None, 'meanLuma': [round(float(x), 1) for x in means]}
        if not close:
            results['errors'].append(f'{label}: expected flash onset missing within one frame')

    for name, key, seed in [('setup', 'setupThunder', 9), ('climax', 'climaxThunder', 18)]:
        expected = seconds(key)
        start = expected - .12
        signal = decode(start, .4)[::8]
        reference = thunder(seed)[:round(.14 * sr):8]
        if len(signal) < len(reference) or not np.all(np.isfinite(signal)):
            results['errors'].append(f'{name}: missing or non-finite audio samples')
            continue
        correlations = np.correlate(signal, reference, mode='valid')
        index = int(np.argmax(np.abs(correlations)))
        denominator = float(np.linalg.norm(signal[index:index + len(reference)]) * np.linalg.norm(reference))
        found = start + index / (sr / 8)
        corr = float(abs(correlations[index]) / denominator) if denominator > 0 and math.isfinite(denominator) else float('nan')
        offset = (found - expected) * 1000
        if not all(math.isfinite(value) for value in [expected, found, offset, corr]):
            results['errors'].append(f'{name}: non-finite correlation or cue timing')
            continue
        results[name] = {'expectedSec': expected, 'detectedSec': round(found, 6), 'offsetMs': round(offset, 3), 'normalizedCorrelation': round(corr, 4)}
        if corr < .3:
            results['errors'].append(f'{name}: expected thunder cue not detected (correlation {corr:.4f})')
        if abs(offset) > 1000 / fps:
            results['errors'].append(f'{name}: cue offset {offset:.3f} ms exceeds one frame')
        if name == 'climax':
            flash = results['visualFlashes'].get('impact', {}).get('onsetFrame')
            if flash is not None and abs(found - flash / fps) > 1 / fps:
                results['errors'].append('climax: audio and visual onset differ by more than one frame')

    results['silence'] = {}
    windows = [('postRewind', *timing['postRewindSilenceFrames']), ('postThunder', *timing['postThunderSilenceFrames'])]
    for label, left, right in windows:
        samples = decode(left / fps, (right - left) / fps)
        if not len(samples) or not np.all(np.isfinite(samples)):
            results['errors'].append(f'{label}: missing or non-finite silence samples')
            continue
        results['silence'][label] = {'startSec': left / fps, 'durationSec': (right - left) / fps,
            'peak': round(float(np.max(np.abs(samples))), 8), 'rms': round(float(np.sqrt(np.mean(samples * samples))), 8)}
    start = timing['blackoutFrame'] / fps
    length = seconds('blackoutSub') - start
    samples = decode(start, length)
    if length <= 0 or not len(samples) or not np.all(np.isfinite(samples)):
        results['errors'].append('blackoutLead: missing or non-finite silence samples')
    else:
        results['silence']['blackoutLead'] = {'startSec': start, 'durationSec': length,
            'peak': round(float(np.max(np.abs(samples))), 8), 'rms': round(float(np.sqrt(np.mean(samples * samples))), 8)}
    return results

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('video', nargs='?', type=Path, default=DEFAULT_VIDEO)
    parser.add_argument('output', nargs='?', type=Path, help='Optional report path; omitted to avoid overwriting prior evidence')
    args = parser.parse_args()
    try:
        manifest = json.loads((EPISODE / 'manifest.json').read_text(encoding='utf-8'))
        result = verify(args.video, manifest)
        report = json.dumps(result, indent=2, allow_nan=False) + '\n'
        if args.output:
            args.output.write_text(report, encoding='utf-8')
        print(report, end='')
        return 1 if result['errors'] else 0
    except (OSError, ValueError, KeyError, TypeError, ArithmeticError, IndexError, subprocess.SubprocessError) as error:
        print(f'Export verification failed: {error}', file=sys.stderr)
        return 1

if __name__ == '__main__':
    sys.exit(main())
