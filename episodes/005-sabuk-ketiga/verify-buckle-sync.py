"""Find the generated clicks in the AAC; this does not prove visual belt states."""
import json, subprocess, sys
from pathlib import Path
import numpy as np
p=Path(__file__).resolve().parent;sys.path.insert(0,str(p.parents[1]/'scripts'))
from verify_export_common import write_report
m=json.loads((p/'manifest.json').read_text(encoding='utf-8')); sr=48000; fps=m['fps']
audio=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',sys.argv[1],'-ac','1','-ar',str(sr),'-f','f32le','-']),dtype='<f4')
items=[]
for name in ('firstClickFrame','secondClickFrame','fakeClickFrame','releaseClickFrame'):
 frame=m['timing'][name]; n=round(.3*sr); x=np.arange(n)/sr; rng=np.random.default_rng(frame)
 ref=((rng.normal(0,1,n)*.12+np.sin(2*np.pi*1300*x)*.12)*np.exp(-18*x)).astype('float32')
 expected=round(frame*sr/fps); low=expected-round(.08*sr); high=expected+round(.16*sr)
 template=np.diff(ref[:round(.06*sr):4]); segment=np.diff(audio[low:high:4]); corr=np.correlate(segment,template,'valid'); idx=int(np.argmax(np.abs(corr)))
 coefficient=float(abs(corr[idx])/(np.linalg.norm(segment[idx:idx+len(template)])*np.linalg.norm(template)+1e-12)); detected=low+idx*4
 items.append({'event':name,'frame':frame,'expectedSec':frame/fps,'detectedSec':detected/sr,'offsetMs':(detected-expected)/sr*1000,'correlation':coefficient})
ok=all(abs(i['offsetMs'])<=1000/fps and i['correlation']>.025 for i in items)
result={'video':sys.argv[1],'clicks':items,'pass':ok,'limitation':'Synchronization to generated cues does not establish belt-state visibility or narration alignment.'}
target=Path(sys.argv[2]) if len(sys.argv)>2 else p/'verification/buckle-sync-audit-rework.json'
if target.exists(): raise FileExistsError(f'Refusing to overwrite {target}; pass a fresh output path')
write_report(result,target,sys.argv[1]);print(json.dumps(result,indent=2));sys.exit(not ok)
