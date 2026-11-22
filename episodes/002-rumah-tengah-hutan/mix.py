"""Deterministic local mix; the accepted prepared narration is never overwritten."""
import json
import subprocess
import wave
from pathlib import Path
import numpy as np

ep = Path(__file__).parent
assets = Path('public/assets/002-rumah-tengah-hutan')
manifest = json.loads((ep / 'manifest.json').read_text(encoding='utf-8'))
fps, sr, timing = manifest['fps'], manifest['soundMix']['sampleRate'], manifest['timing']
def sample(frame):
    return round(frame * sr / fps)
def cue(name):
    return sample(timing[name + 'Frame']) + timing.get(name + 'SampleOffset', 0)
count = sample(manifest['duration'])
rng = np.random.default_rng(20402)

def decode(path):
    return np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', str(path), '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-']), dtype='<f4')

mix = np.zeros(count, dtype=np.float32)
narr = decode(assets / 'narration-prepared.mp3')
mix[:min(len(narr), count)] += narr[:count] * .72

def put(samples, pos, gain):
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

def shared(name, position, gain):
    put(decode(Path('public/sfx/prepared') / name), position, gain)

# Low-frequency thunder transients and isolated versus masked wooden impact.
put(thunder(9), cue('setupThunder'), .32)
climax = cue('climaxThunder')
put(thunder(18), climax, .33)
wood = decode(assets / 'wood-hit.ogg')
put(wood, cue('exposedStrike'), .35)
shared('body-fall.wav', cue('exposedStrike'), .36)
# The wood hit peaks 12.23 ms after its start; the thunder peaks 24.81 ms
# after its start. Align their peaks without placing wood before the clap.
put(wood, climax + timing['maskedWoodSampleOffset'], .12)
put(decode(assets / 'wood-break.ogg'), climax + timing['maskedWoodSampleOffset'], .035)
shared('body-fall.wav', climax, .08)
shared('metal-resonance.wav', climax, .035)
shared('body-fall.wav', cue('fallingPine'), .16)
put(decode(assets / 'wood-break.ogg'), cue('fallingPine'), .12)
shared('coat-shift.wav', cue('branches'), .10)
shared('coat-shift.wav', cue('clothesFirst'), .12)
shared('shoe-left.wav', cue('firstStepLeft'), .10)
shared('shoe-right.wav', cue('firstStepRight'), .10)
shared('coat-shift.wav', cue('clothesLater'), .12)
shared('body-fall.wav', cue('fallFirst'), .18)
shared('body-fall.wav', cue('fallSecond'), .15)
rewind = decode(Path('public/sfx/prepared/tension-rise.wav'))
put(rewind[:sample(timing['rewindFrames'])], cue('rewind'), .16)
shared('coat-shift.wav', cue('clothesAfterRewind'), .07)
shared('shoe-left.wav', cue('stepAfterRewindLeft'), .07)
shared('shoe-right.wav', cue('stepAfterRewindRight'), .07)
shared('minimarket-door-creak-outside.wav', cue('doorCreak'), .10)
shared('shoe-left.wav', cue('escapeStepOne'), .10)
shared('shoe-right.wav', cue('escapeStepTwo'), .09)
shared('shoe-left.wav', cue('escapeStepThree'), .08)

# Absolute dread vacuums and the first 150 ms of black, where the narration
# sidecar also has no speech. SFX tails do not leak into these intervals.
for start, end in [timing['postRewindSilenceFrames'], timing['postThunderSilenceFrames'], [timing['blackoutFrame'], manifest['duration']]]:
    mix[sample(start):sample(end)] = 0
t = np.arange(int(sr * .8)) / sr
sub = (.12 * np.sin(2 * np.pi * 53 * t) * np.exp(-5 * t)).astype(np.float32)
put(sub, cue('blackoutSub'), 1)

raw = ep / 'mix-polish-raw.wav'
with wave.open(str(raw), 'wb') as f:
    f.setnchannels(1)
    f.setsampwidth(2)
    f.setframerate(sr)
    f.writeframes((np.clip(mix, -.999, .999) * 32767).astype('<i2').tobytes())

# Keep enough AAC true-peak headroom while reaching approximately -14 LUFS.
filt = ('volume=11dB,alimiter=limit=0.68:level=disabled:attack=2:release=80:latency=1,'
        'loudnorm=I=-13.7:TP=-1.8:LRA=11,aresample=48000')
mix_path = Path('public') / manifest['soundMix']['asset']
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(raw), '-af', filt, '-c:a', 'pcm_s24le', str(mix_path)], check=True)
# Make the prescribed vacuums sample-exact after mastering. Lossless ALAC can
# preserve these zero samples in the delivered MP4; AAC may add pre-echo.
master = decode(mix_path).copy()
for start, end in [timing['postRewindSilenceFrames'], timing['postThunderSilenceFrames']]:
    master[sample(start):sample(end)] = 0
master[sample(timing['blackoutFrame']):cue('blackoutSub')] = 0
with wave.open(str(assets / 'mix-polish-zero.wav'), 'wb') as f:
    f.setnchannels(1)
    f.setsampwidth(4)
    f.setframerate(sr)
    f.writeframes((np.clip(master, -1, 1 - 1 / 2**31) * (2**31 - 1)).astype('<i4').tobytes())
print(f"Mixed {manifest['duration'] / fps:.3f} seconds; measure the final AAC separately.")
