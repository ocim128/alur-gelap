"""Check P16/P17 cut and word-associated cue schedule against encoded frames."""
import json, subprocess, sys
from pathlib import Path
import cv2
import numpy as np
p=Path(__file__).resolve().parent;root=p.parents[1];sys.path.insert(0,str(root/'scripts'))
from verify_export_common import write_report
m=json.loads((p/'manifest.json').read_text(encoding='utf-8')); captions=json.loads((p/'captions.json').read_text(encoding='utf-8'));t=m['timing'];fps=m['fps'];cut=t['p17StartFrame'];fake=t['fakeClickFrame'];release=t['releaseClickFrame']
frames=[fake,cut-1,cut];w,h=540,960;expr='+'.join(f'eq(n,{f})' for f in frames)
raw=subprocess.check_output(['ffmpeg','-v','error','-i',sys.argv[1],'-vf',f"select='{expr}',scale={w}:{h},format=gray",'-fps_mode','vfr','-f','rawvideo','-'])
if len(raw)!=len(frames)*w*h:raise RuntimeError('Missing reveal frames')
images=np.frombuffer(raw,dtype=np.uint8).reshape(len(frames),h,w);orb=cv2.ORB_create(nfeatures=4000,fastThreshold=5);matcher=cv2.BFMatcher(cv2.NORM_HAMMING)
refs=[]
for n in (16,17):
 img=cv2.imread(str(root/f'public/assets/005-sabuk-ketiga/selected-owner-approved/p{n:02}.webp'),cv2.IMREAD_GRAYSCALE);img=cv2.resize(img,(w,h));refs.append(orb.detectAndCompute(img,None))
records=[]
for frame,img in zip(frames,images):
 kp,desc=orb.detectAndCompute(img,None);scores=[]
 for rk,rd in refs:
  pairs=matcher.knnMatch(rd,desc,k=2);good=[pair[0] for pair in pairs if len(pair)==2 and pair[0].distance<.72*pair[1].distance]
  if len(good)<8:scores.append(0);continue
  a=np.float32([rk[x.queryIdx].pt for x in good]);b=np.float32([kp[x.trainIdx].pt for x in good]);_,mask=cv2.estimateAffinePartial2D(a,b,method=cv2.RANSAC,ransacReprojThreshold=3)
  scores.append(int(mask.sum()) if mask is not None else 0)
 text=' '.join(wd['text'] for c in captions if c['startMs']<=frame*1000/fps<c['endMs'] for wd in c['words'])
 records.append({'frame':frame,'sec':frame/fps,'sourcePlateInliers':{'P16':scores[0],'P17':scores[1]},'timedCaption':text})
ok=(cut==release and all(r['sourcePlateInliers']['P16']>r['sourcePlateInliers']['P17'] for r in records[:2]) and records[2]['sourcePlateInliers']['P17']>records[2]['sourcePlateInliers']['P16'] and 'BUNYI' in records[0]['timedCaption'] and 'SABUK' in records[2]['timedCaption'])
report={'frames':records,'fakeClickFrame':fake,'releaseClickFrame':release,'pass':ok,'limitation':'Plate registration and caption data do not establish subjective listening or caption OCR; see the exported phone-size frames.'}
write_report(report,Path(sys.argv[2]),sys.argv[1]);print(json.dumps(report,indent=2));sys.exit(not ok)
