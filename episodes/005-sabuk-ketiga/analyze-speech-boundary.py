"""Measure accepted narration tail and decoded delivery; this is not listening."""
import json, math, subprocess, sys, wave
from pathlib import Path
import numpy as np
p=Path(__file__).resolve().parent; root=p.parents[1]; sr=48000
def dec(path):
 return np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-ac','1','-ar',str(sr),'-f','f32le','-']),dtype='<f4')
stem=dec(root/'public/assets/005-sabuk-ketiga/narration-assembly-padded.wav'); mix=dec(root/'public/assets/005-sabuk-ketiga/assembly-mix.wav'); audio=dec(sys.argv[1])
manifest=json.loads((p/'manifest.json').read_text(encoding='utf-8')); jolt=manifest['timing']['joltFrame']/manifest['fps']; vacuum=jolt-.15
def db(x):return round(20*math.log10(max(float(x),1e-15)),2)
def stats(x):return {'rmsDbfs':db(np.sqrt(np.mean(x.astype(np.float64)**2))),'peakDbfs':db(np.max(np.abs(x)))}
last=np.flatnonzero(stem[round(154.9*sr):]); last_sec=154.9+int(last[-1])/sr if len(last) else None
windows=[]
for t in np.arange(154.9,155.111,.01):
 a=round(t*sr); b=round((t+.01)*sr)
 corr=lambda x,y:float(np.corrcoef(x,y)[0,1]) if np.std(x)>1e-10 and np.std(y)>1e-10 else None
 windows.append({'startSec':round(float(t),3),'source':stats(stem[a:b]),'assemblyPcm':stats(mix[a:b]),'delivery':stats(audio[a:b]),'sourceToPcmCorrelation':corr(stem[a:b],mix[a:b]),'sourceToDeliveryCorrelation':corr(stem[a:b],audio[a:b])})
a,b=round(154.55*sr),round(154.90*sr)
result={'video':sys.argv[1],'estimatedSidecarEndSec':154.94,'lastNonzeroSourceSampleSec':last_sec,'vacuumStartSec':vacuum,'joltSec':jolt,
 'sourceZeroFromVacuum':bool(not np.any(stem[round(vacuum*sr):round(jolt*sr)])),
 'sourceToDeliveryCorrelation':float(np.corrcoef(stem[a:b],audio[a:b])[0,1]),'windows10ms':windows,
 'interpretation':'The final phoneme and audible truncation cannot be established by energy or correlation alone; listening remains required.'}
out=Path(sys.argv[2]);out.write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8');print(json.dumps(result,indent=2))
