"""Detect the procedural P11/P19 transients independently in the delivered AAC."""
import json, subprocess, sys
from pathlib import Path
import numpy as np
p=Path(__file__).resolve().parent
m=json.loads((p/'manifest.json').read_text(encoding='utf-8')); sr=48000; fps=m['fps']
audio=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',sys.argv[1],'-ac','1','-ar',str(sr),'-f','f32le','-']),dtype='<f4')
results=[]
for name in ('impact11Frame','impact19Frame'):
 f=m['timing'][name]; rng=np.random.default_rng(f); x=np.arange(round(.65*sr))/sr
 reference=((np.sin(2*np.pi*(75*x-16*x*x))*.55+rng.normal(0,1,len(x))*.09)*np.exp(-5*x)).astype('float32')
 expected=round(f*sr/fps); low=expected-round(.08*sr); high=expected+round(.16*sr)
 # A high-passed match reduces contamination from the rotor and voice.
 template=np.diff(reference[:round(.08*sr):4]); section=np.diff(audio[low:high:4]); corr=np.correlate(section,template,mode='valid')
 idx=int(np.argmax(np.abs(corr))); found=low+4*idx; offset=(found-expected)/sr*1000
 coefficient=float(abs(corr[idx])/(np.linalg.norm(section[idx:idx+len(template)])*np.linalg.norm(template)+1e-12))
 results.append({'event':name,'frame':f,'expectedSec':f/fps,'detectedSec':found/sr,'offsetMs':offset,'correlation':coefficient})
ok=all(abs(r['offsetMs'])<=1000/fps and r['correlation']>.04 for r in results)
out={'video':sys.argv[1],'impacts':results,'pass':ok};target=Path(sys.argv[2]) if len(sys.argv)>2 else p/'verification/impact-sync.json'
if target.exists(): raise FileExistsError(f'Refusing to overwrite {target}; pass a fresh output path')
target.write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2));sys.exit(not ok)
