"""Build a continuous-sample mix without overwriting accepted narration or SFX."""
import json, math, subprocess, wave
from pathlib import Path
import numpy as np
p=Path(__file__).parent; public=Path('public'); base=public/'assets/003-goyangan-dek-enam'; m=json.loads((p/'manifest.json').read_text(encoding='utf-8')); t=m['timing']; fps=m['fps']; sr=m['soundMix']['sampleRate']; n=round(m['duration']*sr/fps)
def sample(frame): return round(frame*sr/fps)
def cue(name): return sample(t[name+'Frame'])+t.get(name+'SampleOffset',0)
def decode(path): return np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-ac','1','-ar',str(sr),'-f','f32le','-']),dtype='<f4')
narr=decode(base/'narration-prepared.wav').copy(); bed=decode(base/'sfx/ship-ambience-bed.wav')
# Restore the split final consonant from after the producer's original zero splice,
# then insert the same 2.0 s gap after the release. Later audio stays sample-aligned.
old_start=cue('postPinOriginalGapStart'); old_end=cue('postPinOriginalGapEnd'); new_end=cue('postPinSilenceEnd')
assert old_end-old_start==2*sr and np.max(np.abs(narr[old_start:old_end]))==0
release=narr[old_end:new_end].copy(); narr[old_start:old_start+len(release)]=release
narr[old_start+len(release):new_end]=0
assert old_start+len(release)==cue('postPinSilenceStart')
if len(narr)<sr*150 or len(bed)<sr*153: raise ValueError('Prepared audio shorter than expected')
mix=np.zeros(n,dtype=np.float32); mix[:len(narr)]+=narr*.80
# The supplied bed is continuous. Duck smoothly under measured speech chunks.
env=np.full(min(len(bed),n),.42,dtype=np.float32)
sidecar=json.loads((p/'narration-timestamps.json').read_text(encoding='utf-8'))
for c in sidecar['chunks']:
 start=round(c['start']*sr); end=min(len(env),round(c['end']*sr)); lo=max(0,start-round(.2*sr)); hi=min(len(env),end+round(.25*sr))
 env[start:end]=np.minimum(env[start:end],.25)
 if start>lo:env[lo:start]=np.minimum(env[lo:start],np.linspace(.42,.25,start-lo,endpoint=False))
 if hi>end:env[end:hi]=np.minimum(env[end:hi],np.linspace(.25,.42,hi-end,endpoint=False))
# Small evolving lift followed by a true 150 ms vacuum before the black cut.
lift_start=round(150.85*sr); lift_end=round(153.65*sr); env[lift_start:lift_end]*=np.linspace(1,1.45,lift_end-lift_start)
fade_end=cue('blackoutSilenceStart'); fade_start=round(153.65*sr); env[fade_start:fade_end]*=np.linspace(1,0,fade_end-fade_start)
# Fade only the bed into and out of the two exact silence windows.
for left,right in [(sample(t['postRewindSilenceFrames'][0]),sample(t['postRewindSilenceFrames'][1])),(cue('postPinSilenceStart'),cue('postPinSilenceEnd'))]:
 fade=round(.05*sr); env[left-fade:left]*=np.linspace(1,0,fade,endpoint=False); env[right:right+fade]*=np.linspace(0,1,fade,endpoint=False)
mix[:len(env)]+=bed[:len(env)]*env
def put(path,name,gain,limit=None):
 data=decode(path); pos=cue(name); size=min(len(data),n-pos,round(limit*sr) if limit else n)
 if pos<0 or size<=0:raise ValueError(f'Invalid cue {name}')
 mix[pos:pos+size]+=data[:size]*gain
sfx=base/'sfx'; shared=public/'sfx/prepared'
for filename,name,gain in [('chain-padlock.wav','chain',.20),('deck-water-flow.wav','waterSetup',.13),('pulley-whirr.wav','pulleySetup',.12),('pulley-whirr.wav','cableSwing',.10),('ocean-vortex-suction.wav','vortex',.19),('deck-water-flow.wav','waterReturn',.15),('brake-lever-pull.wav','lever',.25),('pulley-whirr.wav','cableRelease',.16),('lifeboat-impact.wav','impact',.40),('lock-pin.wav','pinInsert',.15),('lock-pin.wav','pinLock',.22),('blackout-hit.wav','blackoutSub',.15),('entity-choke-proxy.wav','entityChoke',.07)]: put(sfx/filename,name,gain)
put(sfx/'rewind-whoosh.wav','rewind',.22,limit=.4)
for filename,name,gain in [('minimarket-door-creak-outside.wav','shipGroan',.09),('coat-shift.wav','vestSway',.08),('shoe-left.wav','approachStep1',.11),('shoe-right.wav','approachStep2',.11),('coat-shift.wav','vest',.13),('body-fall.wav','splash',.10),('ep004-survivor-breath.wav','survivorBreath',.10),('coat-shift.wav','sit',.09)]:put(shared/filename,name,gain)
# The accepted voice source must itself be silent here; fail instead of deleting speech.
windows=[(sample(t['postRewindSilenceFrames'][0]),sample(t['postRewindSilenceFrames'][1])),(cue('postPinSilenceStart'),cue('postPinSilenceEnd'))]
for left,right in windows:
 if np.max(np.abs(narr[left:right]))>10**(-42/20):raise ValueError('Narration overlaps a mandatory silence; inspect source before mixing')
 mix[left:right]=0
mix[cue('blackoutSilenceStart'):sample(t['blackoutFrame'])]=0
raw=p/'assembly-mix-raw.wav'
with wave.open(str(raw),'wb') as f:
 f.setnchannels(1); f.setsampwidth(4); f.setframerate(sr); f.writeframes((np.clip(mix,-1,1-1/2**31)*(2**31-1)).astype('<i4').tobytes())
out=public/m['soundMix']['asset']
filt='acompressor=threshold=0.05:ratio=4:attack=5:release=100:makeup=3,loudnorm=I=-14:TP=-2:LRA=11,volume=4.0dB,alimiter=limit=0.74:level=false:latency=1,aresample=48000'
subprocess.run(['ffmpeg','-y','-v','error','-i',str(raw),'-af',filt,'-c:a','pcm_s24le',str(out)],check=True)
# Re-zero required vacuums after mastering; only the dedicated sub begins at black.
master=decode(out).copy()
for left,right in windows:master[left:right]=0
master[cue('blackoutSilenceStart'):sample(t['blackoutFrame'])]=0
with wave.open(str(out),'wb') as f:
 f.setnchannels(1);f.setsampwidth(4);f.setframerate(sr);f.writeframes((np.clip(master,-1,1-1/2**31)*(2**31-1)).astype('<i4').tobytes())
print(f'Mixed {n/sr:.3f} s; the narration source and ten supplied cue files are retained.')
