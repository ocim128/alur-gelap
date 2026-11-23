"""Reproduce source-bound sampled pixel and rewind evidence for the v4 review copy."""
import hashlib
import json
import subprocess
import sys
from pathlib import Path

import numpy as np

source = Path(sys.argv[1])
delivery = Path(sys.argv[2])
output = Path(sys.argv[3])
if output.exists():
    raise SystemExit(f"Refusing to overwrite {output}")

def digest(path):
    h = hashlib.sha256()
    with path.open('rb') as f:
        for block in iter(lambda: f.read(1024 * 1024), b''):
            h.update(block)
    return h.hexdigest()

def run(args):
    return subprocess.check_output(args)

def pixels(path, time, pix_fmt, vf=None):
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(time), '-i', str(path), '-map', '0:v:0', '-frames:v', '1']
    if vf:
        cmd += ['-vf', vf]
    return np.frombuffer(run(cmd + ['-pix_fmt', pix_fmt, '-f', 'rawvideo', '-']), dtype=np.uint8).astype(np.int16)

def audio(path, start, duration):
    return np.frombuffer(run(['ffmpeg', '-v', 'error', '-ss', str(start), '-t', str(duration), '-i', str(path), '-map', '0:a:0', '-ac', '1', '-ar', '48000', '-f', 'f32le', '-']), dtype='<f4')

filter_chain = 'scale=in_range=full:in_color_matrix=bt470:out_range=limited:out_color_matrix=bt709,format=yuv420p'
samples = []
for sec in (20, 85, 105, 117.3):
    unconverted = pixels(source, sec, 'yuvj420p')
    converted = pixels(source, sec, 'yuv420p', filter_chain)
    encoded = pixels(delivery, sec, 'yuv420p')
    if len(unconverted) != len(converted) or len(encoded) != len(converted):
        raise SystemExit('Unexpected decoded frame size')
    y = encoded[:1080*1920]
    samples.append({'sec': sec, 'deliveryEncodedYMin': int(y.min()), 'deliveryEncodedYMax': int(y.max()),
                    'deliveryYBelow16Percent': round(float(np.mean(y < 16)*100), 4),
                    'deliveryYAbove235Percent': round(float(np.mean(y > 235)*100), 4),
                    'meanAbsSourceConversionDeltaAllPlanes': round(float(np.mean(np.abs(converted - unconverted))), 4),
                    'meanAbsDeliveryVsConvertedAllPlanes': round(float(np.mean(np.abs(encoded - converted))), 4),
                    'meanAbsDeliveryVsUnconvertedAllPlanes': round(float(np.mean(np.abs(encoded - unconverted))), 4)})

ref = audio(Path('public/assets/003-goyangan-dek-enam/sfx/rewind-whoosh.wav'), 0, .4)[::8]
clip = audio(delivery, 70.2, .8)[::8]
corr = np.correlate(clip, ref, mode='valid')
index = int(np.argmax(np.abs(corr)))
part = clip[index:index+len(ref)]
strength = float(abs(corr[index])/(np.linalg.norm(part)*np.linalg.norm(ref)))
result = {'source': str(source), 'sourceSha256': digest(source), 'delivery': str(delivery),
          'deliverySha256': digest(delivery), 'filter': filter_chain, 'samples': samples,
          'rewind': {'scheduledSec': 70.4, 'detectedSec': round(70.2+index/6000, 6), 'correlation': round(strength, 4)},
          'limitations': 'Four sampled decoded frames only; lossy re-encoding changes pixels. Source primaries and transfer are unspecified, so 709 tags assume their compatibility rather than demonstrating a primaries/transfer conversion.'}
output.write_text(json.dumps(result, indent=2) + '\n', encoding='utf-8')
print(json.dumps(result, indent=2))
