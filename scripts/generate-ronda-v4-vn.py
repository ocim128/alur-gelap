"""Build m6 v4 from retained speech and laugh masters without overwriting v3."""
import json
import math
import subprocess
import wave
from pathlib import Path

import numpy as np

RATE = 48000
ROOT = Path('episodes/007-grup-ronda-rt07/sources')
DEST = Path('public/assets/007-grup-ronda-rt07/vn-02-hendra-odd-v4.mp3')

def decode(path, filters):
    data = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', str(path), '-af', filters,
                                    '-ar', str(RATE), '-ac', '1', '-f', 'f32le', '-'])
    return np.frombuffer(data, dtype='<f4').astype(np.float64)

def rms(x):
    return math.sqrt(float(np.mean(x * x)))

if DEST.exists():
    raise SystemExit(f'Refusing to overwrite {DEST}')

voice_path = ROOT / 'vn-02-hendra-src.mp3'
voice = decode(voice_path, 'highpass=f=140,lowpass=f=6200') * 1.10
voice_band = decode(voice_path, 'highpass=f=140,lowpass=f=6200,highpass=f=300,lowpass=f=2500') * 1.10
laugh = decode(ROOT / 'sfx-m6-laugh-src.mp3', 'highpass=f=300,lowpass=f=2500')
laugh = laugh[round(1.38 * RATE):round(1.80 * RATE)].copy()
fade = round(.025 * RATE)
laugh[:fade] *= np.linspace(0, 1, fade)
laugh[-fade:] *= np.linspace(1, 0, fade)
voice_rms = rms(voice_band[round(.88 * RATE):round(1.6 * RATE)])
laugh *= voice_rms * 10 ** (-7 / 20) / rms(laugh)
start = round(1.63 * RATE)
room = decode('public/sfx/night-air.wav', 'highpass=f=180,lowpass=f=3500')
room = np.resize(room, len(voice)) * .035
mix = voice + room
mix[start:start + len(laugh)] += laugh
peak = float(np.max(np.abs(mix)))
gain = min(1.0, .70 / peak)
mix *= gain
pcm = np.round(np.clip(mix, -1, 1) * 32767).astype('<i2')
temp = ROOT / 'vn-02-hendra-v4-build.wav'
with wave.open(str(temp), 'wb') as f:
    f.setnchannels(1)
    f.setsampwidth(2)
    f.setframerate(RATE)
    f.writeframes(pcm.tobytes())
try:
    subprocess.run(['ffmpeg', '-v', 'error', '-n', '-i', str(temp), '-c:a', 'libmp3lame',
                    '-b:a', '192k', str(DEST)], check=True)
finally:
    temp.unlink(missing_ok=True)
print(json.dumps({'durationSec': len(voice) / RATE, 'laughStartSec': start / RATE,
                  'laughEndSec': (start + len(laugh)) / RATE,
                  'bandLimitedLaughRelativeToVoiceDb': 20 * math.log10(rms(laugh) / voice_rms),
                  'mixPeakBeforeGain': peak, 'outputGain': gain}, indent=2))
