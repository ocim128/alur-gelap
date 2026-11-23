import argparse
import json
from pathlib import Path
import struct
import subprocess
from tempfile import TemporaryDirectory
import wave

parser = argparse.ArgumentParser(description='Build the Scenario 006 scratch narration and storyboard timing.')
parser.add_argument('--espeak', default='espeak-ng', help='eSpeak NG executable with the Indonesian voice installed')
parser.add_argument('--output-dir', default='public/assets/006-bioskop-rough-cut')
parser.add_argument('--timing-output', default='episodes/006-bioskop-tanpa-pintu/rough-cut.json')
args = parser.parse_args()
scratch_dir = TemporaryDirectory(prefix='bioskop-rough-')
root = Path(__file__).resolve().parents[1]
episode = root / 'episodes/006-bioskop-tanpa-pintu'
public = root / args.output_dir
temp = Path(scratch_dir.name)
public.mkdir(exist_ok=True)
lines = iter((episode / 'narasi.txt').read_text(encoding='utf-8').strip().split('\n\n'))
fps = 30
hz = 48000
frame_samples = hz // fps
parts = []
shots = []
rewinds = []
cursor = 0

def append(pcm, frames):
    global cursor
    size = frames * frame_samples * 2
    parts.append(pcm[:size].ljust(size, bytes(1)))
    cursor += frames

def synthesize(line, panel, speech_frames):
    wav = temp / f'panel{panel}.wav'
    subprocess.run([args.espeak, '-v', 'id', '-s', '105', '-w', wav, line], check=True)
    with wave.open(str(wav), 'rb') as f:
        rate = f.getframerate()
        samples = struct.unpack('<' + 'h' * f.getnframes(), f.readframes(f.getnframes()))
    voiced = [i for i, sample in enumerate(samples) if abs(sample) >= 120]
    start, end = max(0, voiced[0] - int(rate * .025)), min(len(samples), voiced[-1] + int(rate * .05))
    tempo = ((end - start) / rate) / (speech_frames / fps)
    return subprocess.check_output([
        'ffmpeg', '-nostdin', '-v', 'error', '-i', str(wav), '-af',
        f'atrim=start_sample={start}:end_sample={end},asetpts=PTS-STARTPTS,atempo={tempo:.7f}',
        '-ar', str(hz), '-ac', '1', '-f', 's16le', '-',
    ])

for panel in range(1, 25):
    line = '' if panel in (22, 24) else next(lines)
    tokens = line.split()
    start = cursor
    captions = []
    if tokens:
        speech_frames = 78 if panel == 1 else round(len(tokens) * fps / 1.61)
        pcm = synthesize(line, panel, speech_frames)
        group_size = 5 if panel == 1 else 4
        for i in range(0, len(tokens), group_size):
            limit = min(len(tokens), i + group_size)
            captions.append({
                'from': start + round(i * speech_frames / len(tokens)),
                'to': start + round(limit * speech_frames / len(tokens)),
                'text': ' '.join(tokens[i:limit]),
            })
        append(pcm, speech_frames)
        if panel not in (1, 7, 9, 11, 23):
            append(b'', 29 if panel == 8 else 9)
    else:
        append(b'', 60 if panel == 22 else 45)
    shots.append({'panel': panel, 'start': start, 'end': cursor, 'captions': captions})
    if panel in (7, 9, 11):
        rewinds.append(cursor)
        append(b'', 54 if panel == 11 else 12)

assert next(lines, None) is None
out = temp / 'scratch.wav'
with wave.open(str(out), 'wb') as f:
    f.setparams((1, 2, hz, 0, 'NONE', 'not compressed'))
    f.writeframes(b''.join(parts))
subprocess.run([
    'ffmpeg', '-nostdin', '-y', '-v', 'error', '-i', str(out),
    '-af', 'loudnorm=I=-21:TP=-3:LRA=7', '-ar', str(hz),
    '-codec:a', 'libmp3lame', '-b:a', '56k', str(public / 'scratch.mp3'),
], check=True)
(root / args.timing_output).write_text(
    '{\n  "duration": ' + str(cursor) + ',\n  "rewinds": ' + json.dumps(rewinds) + ',\n  "shots": [\n' +
    ',\n'.join('    ' + json.dumps(shot, ensure_ascii=False) for shot in shots) + '\n  ]\n}\n',
    encoding='utf-8',
)
print(f'{cursor} frames ({cursor/fps:.2f}s), snaps at {[v/fps for v in rewinds]}')
