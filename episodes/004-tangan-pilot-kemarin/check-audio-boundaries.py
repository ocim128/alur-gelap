"""Measure the accepted PCM around the producer's proposed rewind windows."""
import json
import math
import wave
from pathlib import Path
import sys

import numpy as np

episode = Path(__file__).resolve().parent
with wave.open(str(episode / "narration-prepared.wav"), "rb") as source:
    assert source.getnchannels() == 1 and source.getsampwidth() == 2
    rate = source.getframerate()
    samples = np.frombuffer(source.readframes(source.getnframes()), dtype="<i2")

def measure(start, end):
    section = samples[round(start * rate):round(end * rate)].astype(np.float64) / 32768
    rms = float(np.sqrt(np.mean(section * section)))
    return {"startSec": start, "endSec": end, "rmsDbfs": round(20 * math.log10(rms), 2) if rms else None,
            "peakDbfs": round(20 * math.log10(float(np.max(np.abs(section)))), 2) if np.any(section) else None,
            "nonzeroSamples": int(np.count_nonzero(section))}

print(json.dumps({"source": "narration-prepared.wav", "sampleRate": rate,
                  "windows": [measure(*x) for x in [(58.70, 58.90), (73.70, 75.30),
                                                       (74.75, 75.05), (75.05, 75.20),
                                                       (75.20, 75.30)]]}, indent=2))

manifest_path = episode / 'manifest.json'
if manifest_path.exists():
    manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
    root = episode.parents[1]
    stem = root / 'public' / manifest['narration']['asset']
    with wave.open(str(stem), 'rb') as f:
        assert f.getframerate() == rate and f.getsampwidth() == 2
        padded = np.frombuffer(f.readframes(f.getnframes()), dtype='<i2')
    edit_map = json.loads((episode/'assembly-edit-map.json').read_text(encoding='utf-8'))
    chunks=[]; previous=0; delta=0
    for edit in edit_map['insertions']:
        pos=round(edit['sourceSec']*rate)+delta
        chunks.append(padded[previous:pos])
        assert not np.any(padded[pos:pos+edit['samples']])
        previous=pos+edit['samples'];delta+=edit['samples']
    chunks.append(padded[previous:])
    assert np.array_equal(np.concatenate(chunks), samples), 'padded stem changed source samples'
    intervals = [(f'rewind-{i+1}', x['startFrame'], x['endFrame']) for i,x in enumerate(manifest['timing']['branchRewinds'])]
    intervals.append(('dread', *manifest['timing']['dreadSilenceFrames']))
    checks = []
    for name, start, end in intervals:
        section = padded[round(start*rate/manifest['fps']):round(end*rate/manifest['fps'])]
        checks.append({'name':name, 'startFrame':start, 'endFrame':end, 'nonzeroSamples':int(np.count_nonzero(section))})
    voice_path=root/'public/assets/004-tangan-pilot-kemarin/sfx/voice-copilot-gantian.wav'
    with wave.open(str(voice_path),'rb') as voice:
        voice_duration=voice.getnframes()/voice.getframerate()
    voice_start=manifest['timing']['copilotVoiceFrame']/manifest['fps']
    overlap=padded[round(voice_start*rate):round((voice_start+voice_duration)*rate)].astype(np.float64)/32768
    rms=float(np.sqrt(np.mean(overlap**2)))
    voice_check={'voiceStartSec':voice_start,'voiceEndSec':voice_start+voice_duration,
                 'narrationRmsDbfs':round(20*math.log10(max(rms,1e-15)),2),
                 'note':'Quiet source noise is preserved; this verifies low narration-stem energy, not a listening judgment.'}
    assert rms < 10**(-45/20), 'narration overlaps the COPILOT line'
    assert .5 <= edit_map['insertions'][0]['durationSec'] <= .7
    print(json.dumps({'assemblyStem':str(stem), 'sourceSamplesPreserved':True, 'checks':checks, 'copilotBeat':voice_check}, indent=2))
    if any(c['nonzeroSamples'] for c in checks): sys.exit(1)
