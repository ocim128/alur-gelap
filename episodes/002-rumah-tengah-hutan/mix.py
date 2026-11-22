"""Deterministic local mix; the accepted prepared narration is never overwritten."""
import json
import subprocess
import wave
from pathlib import Path
import numpy as np

ep = Path(__file__).parent
assets = Path('public/assets/002-rumah-tengah-hutan')
sr = 48000
duration = 154
count = sr * duration
rng = np.random.default_rng(20402)

def decode(path):
    return np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', str(path), '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-']), dtype='<f4')

mix = np.zeros(count, dtype=np.float32)
narr = decode(assets / 'narration-prepared.mp3')
mix[:min(len(narr), count)] += narr[:count] * .72

def put(samples, at, gain):
    pos = round(at * sr)
    size = min(len(samples), count - pos)
    mix[pos:pos + size] += samples[:size] * gain

# Fresh deterministic broadband rain and a slower wind component, continuous
# rather than repetitions of a short breath or exhale recording.
noise = rng.standard_normal(count).astype(np.float32)
wind = np.cumsum(noise, dtype=np.float64)
wind[1024:] -= wind[:-1024].copy()
wind[:1024] = 0
wind = (wind / 1024).astype(np.float32)
# Evolving rain and gusts, with smoothed ducking around measured voice chunks.
time = np.arange(count, dtype=np.float32) / sr
weather = noise * .011 + wind * (.075 + .022 * np.sin(2 * np.pi * time / 21))
duck = np.ones(count, dtype=np.float32)
timings = json.loads((ep / 'narration-timestamps.json').read_text(encoding='utf-8'))
for chunk in timings['chunks']:
    start, end = round(chunk['start'] * sr), min(count, round(chunk['end'] * sr))
    lo, hi = max(0, start - round(.18 * sr)), min(count, end + round(.30 * sr))
    duck[start:end] = np.minimum(duck[start:end], .46)
    if start > lo:
        duck[lo:start] = np.minimum(duck[lo:start], np.linspace(1, .46, start - lo, endpoint=False))
    if hi > end:
        duck[end:hi] = np.minimum(duck[end:hi], np.linspace(.46, 1, hi - end, endpoint=False))
mix += weather * duck
del noise, wind, weather, time, duck

def thunder(seed, length=2.8):
    r = np.random.default_rng(seed)
    n = int(sr * length)
    x = r.standard_normal(n).astype(np.float32)
    low = np.cumsum(x, dtype=np.float64)
    low[90:] -= low[:-90].copy()
    low[:90] = 0
    low = (low / 20).astype(np.float32)
    t = np.arange(n) / sr
    return (x * .22 * np.exp(-t * 18) + low * .8 * np.exp(-t * 1.8)).astype(np.float32)

def shared(name, at, gain):
    put(decode(Path('public/sfx/prepared') / name), at, gain)

# Low-frequency thunder transients and isolated versus masked wooden impact.
put(thunder(9), 32.7, .32)
climax = 3718 / 30
put(thunder(18), climax, .33)
wood = decode(assets / 'wood-hit.ogg')
put(wood, 62.2333333333, .35)
shared('body-fall.wav', 62.2333333333, .36)
# The wood hit peaks 12.23 ms after its start; the thunder peaks 24.81 ms
# after its start. Align their peaks without placing wood before the clap.
put(wood, climax + .01258, .12)
put(decode(assets / 'wood-break.ogg'), climax + .01258, .035)
shared('body-fall.wav', climax, .08)
shared('metal-resonance.wav', climax, .035)
shared('body-fall.wav', 9.1, .16)
put(decode(assets / 'wood-break.ogg'), 9.1, .12)
shared('coat-shift.wav', 18.9, .10)
shared('coat-shift.wav', 50.4, .12)
shared('shoe-left.wav', 48.85, .10)
shared('shoe-right.wav', 49.2, .10)
shared('coat-shift.wav', 70.7, .12)
shared('body-fall.wav', 77.66, .18)
shared('body-fall.wav', 80.06, .15)
rewind = decode(Path('public/sfx/prepared/tension-rise.wav'))
put(rewind[:int(.4 * sr)], 84.6, .16)
shared('coat-shift.wav', 106.76, .07)
shared('shoe-left.wav', 109.2, .07)
shared('shoe-right.wav', 109.7, .07)
shared('minimarket-door-creak-outside.wav', 143.34, .10)
shared('shoe-left.wav', 145.3, .10)
shared('shoe-right.wav', 145.75, .09)
shared('shoe-left.wav', 146.2, .08)

# Absolute dread vacuums and the first 150 ms of black, where the narration
# sidecar also has no speech. SFX tails do not leak into these intervals.
for start, end in [(88.6, 90.2), (139., 141.), (152.5, 154.)]:
    mix[round(start * sr):round(end * sr)] = 0
t = np.arange(int(sr * .8)) / sr
sub = (.12 * np.sin(2 * np.pi * 53 * t) * np.exp(-5 * t)).astype(np.float32)
put(sub, 152.65, 1)

raw = ep / 'mix-polish-raw.wav'
with wave.open(str(raw), 'wb') as f:
    f.setnchannels(1)
    f.setsampwidth(2)
    f.setframerate(sr)
    f.writeframes((np.clip(mix, -.999, .999) * 32767).astype('<i2').tobytes())

# Keep enough AAC true-peak headroom while reaching approximately -14 LUFS.
filt = ('volume=11dB,alimiter=limit=0.68:level=disabled:attack=2:release=80:latency=1,'
        'loudnorm=I=-13.7:TP=-1.8:LRA=11,aresample=48000')
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(raw), '-af', filt, '-c:a', 'pcm_s24le', str(assets / 'mix-polish.wav')], check=True)
# Make the prescribed vacuums sample-exact after mastering. Lossless ALAC can
# preserve these zero samples in the delivered MP4; AAC may add pre-echo.
master = decode(assets / 'mix-polish.wav').copy()
for start, end in [(88.6, 90.2), (139., 141.), (152.5, 152.65)]:
    master[round(start * sr):round(end * sr)] = 0
with wave.open(str(assets / 'mix-polish-zero.wav'), 'wb') as f:
    f.setnchannels(1)
    f.setsampwidth(4)
    f.setframerate(sr)
    f.writeframes((np.clip(master, -1, 1 - 1 / 2**31) * (2**31 - 1)).astype('<i4').tobytes())
print('Mixed 154 seconds; measure the final AAC separately.')
