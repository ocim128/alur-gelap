"""Mix the accepted speech derivative, separate voices and local procedural foley."""
import json, math, subprocess, wave
from pathlib import Path
import numpy as np
p=Path(__file__).resolve().parent; root=p.parents[1]; base=root/'public/assets/004-tangan-pilot-kemarin'
m=json.loads((p/'manifest.json').read_text(encoding='utf-8')); t=m['timing']; sr=48000; fps=m['fps']; n=round(m['duration']*sr/fps)
edits=json.loads((p/'assembly-edit-map.json').read_text(encoding='utf-8'))['insertions']
def dec(path):return np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-ac','1','-ar',str(sr),'-f','f32le','-']),dtype='<f4')
def shift(x):return x+sum(e['durationSec'] for e in edits if x>=e['sourceSec'])
def smp(x):return round(x*sr)
def atframe(f):return round(f*sr/fps)
narr=dec(root/'public'/m['narration']['asset']); mix=np.zeros(n,dtype=np.float32); mix[:min(n,len(narr))]=narr[:n]*.62
time=np.arange(n,dtype=np.float32)/sr
# Synthesized rotor/panel drone: deterministic, dry-weather, slow variation.
bed=(.011*np.sin(2*np.pi*52*time)+.006*np.sin(2*np.pi*78*time))*(.65+.35*np.sin(2*np.pi*3.6*time)**2)
bed*=.75+.15*np.sin(2*np.pi*.07*time)
rise=(time>=shift(148.22))&(time<shift(152)); bed[rise]*=np.linspace(1,1.6,rise.sum())
for left,right in [(t['dreadSilenceFrames'][0]/fps,t['dreadSilenceFrames'][1]/fps)]:
 bed[smp(left):smp(right)]=0
jolt=atframe(t['joltFrame']); vacuum=jolt-round(.15*sr); bed[vacuum:jolt]=0; bed[jolt:]=0
mix+=bed.astype(np.float32)
def place(data,position,gain=1):
 a=round(position*sr) if isinstance(position,float) else position
 b=min(n,a+len(data));
 if b>a:mix[a:b]+=data[:b-a]*gain
def burst(seconds,kind,seed):
 rng=np.random.default_rng(seed); x=np.arange(round(seconds*sr))/sr; env=np.exp(-x*(18 if kind=='click' else 5))
 if kind=='click': y=(rng.normal(0,1,len(x))*.12+np.sin(2*np.pi*1300*x)*.12)*env
 elif kind=='impact': y=(np.sin(2*np.pi*(75*x-16*x*x))*.55+rng.normal(0,1,len(x))*.09)*env
 elif kind=='paper': y=rng.normal(0,.13,len(x))*np.exp(-x*9)*(.5+.5*np.sin(2*np.pi*14*x))
 else: y=rng.normal(0,.11,len(x))*env
 return y.astype(np.float32)
def cue(sec,kind,amp=.22):place(burst(.65 if kind=='impact' else .3,kind,round(sec*100)),float(shift(sec)),amp)
for sec,kind,amp in [(18,'paper',.18),(30.78,'noise',.12),(49.56,'click',.16),(53.28,'impact',.17),
 (60,'click',.14),(62.92,'click',.18),(87.3,'paper',.1),(95.6,'paper',.08),(118.14,'noise',.11),
 (135.84,'impact',.11),(141.38,'click',.15),(144.32,'paper',.14),(146.64,'click',.10)]:cue(sec,kind,amp)
for i,name in enumerate(['impact1Frame','impact2Frame','impact3Frame']):place(burst(.72,'impact',900+i),atframe(t[name]),.25)
for interval in t['branchRewinds']:
 snap=dec(base/'sfx/tape-snap-rewind.wav');place(snap,atframe(interval['startFrame']),.23)
voice=dec(base/'sfx/voice-copilot-gantian.wav');place(voice,atframe(t['copilotVoiceFrame']),.38)
groan=dec(base/'sfx/voice-copilot-groan.wav')[:round(.69*sr)];place(groan,float(shift(57)),.20)
# Silent vacuum and restrained sub-hit follow the final spoken release.
mix[vacuum:jolt]=0; place(burst(.65,'impact',1002),jolt,.20)
left,right=(atframe(x) for x in t['dreadSilenceFrames']);mix[left:right]=0
raw=p/'assembly-mix-polish-raw.wav'
def write(path,x):
 with wave.open(str(path),'wb') as f:f.setnchannels(1);f.setsampwidth(4);f.setframerate(sr);f.writeframes((np.clip(x,-.999,.999)*2147483647).astype('<i4').tobytes())
write(raw,mix)
out=root/'public'/m['soundMix']['asset']
subprocess.run(['ffmpeg','-y','-v','error','-i',str(raw),'-af','acompressor=threshold=0.05:ratio=4:attack=5:release=100:makeup=3,loudnorm=I=-14:TP=-2.0:LRA=11,volume=3.6dB,alimiter=limit=0.74:level=false:latency=1,aresample=48000','-c:a','pcm_s24le',str(out)],check=True)
master=dec(out).copy();master*=10**(-.45/20);master[left:right]=0;master[vacuum:jolt]=0;write(out,master)
print('mix:',out,'duration',len(master)/sr,'vacuum',vacuum/sr,jolt/sr)
