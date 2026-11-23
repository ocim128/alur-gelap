"""Report last-word source/mix alignment; energy thresholds are not a phonetic review."""
import json, math, subprocess, sys
from pathlib import Path
import numpy as np
p=Path(__file__).resolve().parent; root=p.parents[1]; sr=48000
manifest=json.loads((p/'manifest.json').read_text(encoding='utf-8')); jolt=manifest['timing']['joltFrame']/manifest['fps']
video=Path(sys.argv[1]); output=Path(sys.argv[2]) if len(sys.argv)>2 else p/'verification/speech-boundary.json'
def decode(path):
 return np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-map','0:a:0','-ac','1','-ar',str(sr),'-f','f32le','-']),dtype='<f4')
stem=decode(root/'public'/manifest['narration']['asset']); audio=decode(video)
def db(x):return round(20*math.log10(max(float(x),1e-15)),2)
def stats(x):return {'rmsDbfs':db(np.sqrt(np.mean(x.astype(np.float64)**2))),'peakDbfs':db(np.max(np.abs(x)))}
segments=[]
for t in np.arange(jolt-.45,jolt+.001,.01):
 a=round(t*sr);b=round((t+.01)*sr)
 segments.append({'startSec':round(t,3),'stem':stats(stem[a:b]),'export':stats(audio[a:b])})
origin=jolt-1.7;search=stem[round(origin*sr):round(jolt*sr)]
thresholds={}
for level in (-40,-50,-60,-70,-80):
 ix=np.flatnonzero(np.abs(search)>10**(level/20)); thresholds[str(level)]=round(origin+int(ix[-1])/sr,6) if len(ix) else None
# Compare the final word's source and decoded mix at the actual MP4 presentation
# time; correlation verifies alignment, not the identity of the final phoneme.
last=thresholds['-60'];a=round((last-.214937)*sr);b=round((last-.004937)*sr); x=stem[a:b];y=audio[a:b];c=float(np.corrcoef(x,y)[0,1])
ref_start=last-.594937;ref_end=last-.044937
ref=stem[round(ref_start*sr):round(ref_end*sr):8]; start=round((ref_start-.1)*sr); mix=audio[start:round((ref_end+.2)*sr):8]
correlations=np.correlate(mix,ref,'valid'); index=int(np.argmax(np.abs(correlations)))
match_sec=start/sr+index*8/sr; lag_ms=(match_sec-ref_start)*1000
report={'video':str(video),'stemLastSampleAboveThresholdDbfs':thresholds,'finalWordWindowSec':[a/sr,b/sr],
 'stemToExportCorrelation':round(c,5),'finalWordCorrelationLagMs':round(lag_ms,3),'windows10ms':segments,
 'interpretation':'Energy and correlation bound signal, not an independently heard phoneme. Human listening remains required.'}
output.write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8');print(json.dumps(report,indent=2))
