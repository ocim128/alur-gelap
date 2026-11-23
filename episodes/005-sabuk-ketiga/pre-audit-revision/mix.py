"""Mix accepted narration, the separate tower voice and deterministic local foley."""
import json, subprocess, wave
from pathlib import Path
import numpy as np
p=Path(__file__).resolve().parent; root=p.parents[1]; base=root/'public/assets/005-sabuk-ketiga'
m=json.loads((p/'manifest.json').read_text(encoding='utf-8')); t=m['timing']; fps=m['fps']; sr=48000; n=round(m['duration']*sr/fps)
def dec(path):return np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-ac','1','-ar',str(sr),'-f','f32le','-']),dtype='<f4')
def sample(f):return round(f*sr/fps)
def sec(x):return round(x*sr)
def shifted(x):return x+(1/30 if x>=72.6 else 0)+(2/30 if x>=90.8 else 0)
narr=dec(base/'narration-assembly-padded.wav').copy()
# Non-destructive composition mute for the narrator's quoted tower line.
narr[sec(43.4):sec(46.94)]=0
mix=np.zeros(n,dtype=np.float32);mix[:min(n,len(narr))]=narr[:n]*.75
time=np.arange(n,dtype=np.float32)/sr
bed=(.012*np.sin(2*np.pi*49*time)+.006*np.sin(2*np.pi*73.5*time))*(.65+.35*np.sin(2*np.pi*3.7*time)**2)
bed*=.8+.2*np.sin(2*np.pi*.045*time)
mix+=bed.astype(np.float32)
def place(data,pos,gain=1):
 b=min(n,pos+len(data))
 if b>pos:mix[pos:b]+=data[:b-pos]*gain
def burst(duration,kind,seed):
 rng=np.random.default_rng(seed); x=np.arange(round(duration*sr))/sr; env=np.exp(-x*(18 if kind=='click' else 5))
 noise=rng.normal(0,1,len(x))
 if kind=='click': y=(noise*.12+np.sin(2*np.pi*1300*x)*.12)*env
 elif kind=='impact': y=(np.sin(2*np.pi*(75*x-16*x*x))*.55+noise*.09)*env
 else:y=noise*.12*env
 return y.astype(np.float32)
def cue(frame,kind,gain=.2):place(burst(.65 if kind=='impact' else .3,kind,frame),sample(frame),gain)
for name,kind,gain in [('gripFrame','noise',.15),('buckleTickFrame','click',.22),('firstClickFrame','click',.25),('secondClickFrame','click',.18),('impact11Frame','impact',.3),('fakeClickFrame','click',.23),('releaseClickFrame','click',.25),('impact19Frame','impact',.22)]:cue(t[name],kind,gain)
for x,kind,gain in [(22.24,'noise',.12),(31.32,'impact',.14),(51.3,'impact',.23),(60.0,'click',.2),(66.3,'noise',.09),(106.3,'noise',.12),(109.44,'noise',.18),(125.56,'impact',.16),(146.5,'impact',.12)]:cue(round(shifted(x)*fps),kind,gain)
snap=dec(root/'public/assets/004-tangan-pilot-kemarin/sfx/tape-snap-rewind.wav')
for item in t['branchRewinds']:place(snap,sample(item['startFrame']),.28)
voice=dec(root/'public/sfx/prepared/scenario05-tower-pa-mixready.wav');place(voice,sec(42.74),.40)
# Behind-wall echo stutter is a quiet filtered derivative of the narrator's copilot line.
copy=narr[sec(65.2):sec(67.7)]; echo=np.convolve(copy,np.ones(32,dtype=np.float32)/32,mode='same')
place(echo,sec(65.6),.12)
# Intermittent radio hiss drops completely for the clear voice.
rng=np.random.default_rng(50); hiss=rng.normal(0,.006,sec(42.74-40.0)).astype(np.float32);place(hiss,sec(40),1)
jolt=sample(t['joltFrame']); vacuum=jolt-sec(.15);mix[vacuum:jolt]=0;mix[jolt:]=0
place(burst(.8,'impact',999),jolt,.26);place(burst(.6,'noise',998),jolt,.11)
left,right=(sample(x) for x in t['dreadSilenceFrames']);mix[left:right]=0
def write(path,x):
 with wave.open(str(path),'wb') as f:f.setnchannels(1);f.setsampwidth(4);f.setframerate(sr);f.writeframes((np.clip(x,-.999,.999)*2147483647).astype('<i4').tobytes())
raw=p/'assembly-mix-raw.wav';write(raw,mix);out=base/'assembly-mix.wav'
subprocess.run(['ffmpeg','-y','-v','error','-i',str(raw),'-af','acompressor=threshold=0.05:ratio=4:attack=5:release=100:makeup=3,loudnorm=I=-14:TP=-2.3:LRA=11,volume=3.6dB,alimiter=limit=0.72:level=false:latency=1,aresample=48000','-c:a','pcm_s24le',str(out)],check=True)
master=dec(out).copy();master[left:right]=0;master[vacuum:jolt]=0;master[jolt:]*=.6;write(out,master)
assert not np.any(master[left:right]) and not np.any(master[vacuum:jolt])
print('mix',out,'dread',left/sr,right/sr,'vacuum',vacuum/sr,jolt/sr)
