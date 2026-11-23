"""Compare the owner-listened ending with the new PCM and encoded delivery."""
import json, math, subprocess, sys, wave
from pathlib import Path
import numpy as np
p=Path(__file__).resolve().parent;root=p.parents[1];sr=48000;start=151.0
with wave.open(str(p/'pre-owner-polish/assembly-mix.wav'),'rb') as before, wave.open(str(root/'public/assets/005-sabuk-ketiga/assembly-mix.wav'),'rb') as after:
 assert before.getparams()==after.getparams() and before.getframerate()==sr
 before.setpos(round(start*sr));after.setpos(round(start*sr))
 pcm_equal=before.readframes(before.getnframes()-before.tell())==after.readframes(after.getnframes()-after.tell())
def decode(path):
 return np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-ss',str(start),'-i',str(path),'-ac','1','-ar',str(sr),'-f','f32le','-']),dtype='<f4')
old=decode(root/'out/005-sabuk-ketiga/Skenario05SabukKetiga-audit-rework-v2-master_compressed.mp4');new=decode(sys.argv[1]);n=min(len(old),len(new));old=old[:n];new=new[:n]
error=new-old;rms=float(np.sqrt(np.mean(error.astype(np.float64)**2)));peak=float(np.max(np.abs(error)));corr=float(np.corrcoef(old,new)[0,1])
report={'newVideo':sys.argv[1],'ownerListenedVideo':'out/005-sabuk-ketiga/Skenario05SabukKetiga-audit-rework-v2-master_compressed.mp4',
 'comparisonStartSec':start,'pcmBytesIdentical':pcm_equal,'decodedCorrelation':corr,'decodedDifferenceRmsDbfs':20*math.log10(max(rms,1e-15)),'decodedDifferencePeakDbfs':20*math.log10(max(peak,1e-15)),
 'note':'The owner’s listening decision applies to the earlier review copy; this reports technical comparison for the new encoding.'}
path=Path(sys.argv[2]);
if path.exists():raise FileExistsError(path)
path.write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8');print(json.dumps(report,indent=2));sys.exit(not pcm_equal or corr<.99)
