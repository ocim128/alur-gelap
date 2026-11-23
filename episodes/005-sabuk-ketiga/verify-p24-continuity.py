"""Check encoded P24 frames on both sides of the flash against the approved plate."""
import json, subprocess, sys
from pathlib import Path
import cv2
import numpy as np
p=Path(__file__).resolve().parent;root=p.parents[1];sys.path.insert(0,str(root/'scripts'))
from verify_export_common import write_report
m=json.loads((p/'manifest.json').read_text(encoding='utf-8'));t=m['timing'];frames=[t['joltFrame']-1,t['joltFrame']+2,t['joltFrame']+9]
expr='+'.join(f'eq(n,{f})' for f in frames);w,h=540,960
raw=subprocess.check_output(['ffmpeg','-v','error','-i',sys.argv[1],'-vf',f"select='{expr}',scale={w}:{h},format=gray",'-fps_mode','vfr','-f','rawvideo','-'])
if len(raw)!=len(frames)*w*h:raise RuntimeError('Missing ending frames')
images=np.frombuffer(raw,dtype=np.uint8).reshape(len(frames),h,w)
src=cv2.imread(str(root/'public/assets/005-sabuk-ketiga/selected-owner-approved/p24.webp'),cv2.IMREAD_GRAYSCALE)
src=cv2.resize(src,(w,h));orb=cv2.ORB_create(nfeatures=4000,fastThreshold=5);kp0,d0=orb.detectAndCompute(src,None);matcher=cv2.BFMatcher(cv2.NORM_HAMMING)
result=[]
for frame,img in zip(frames,images):
 kp1,d1=orb.detectAndCompute(img,None)
 if d1 is None:raise RuntimeError(f'No image features at {frame}')
 matches=matcher.knnMatch(d0,d1,k=2);good=[pair[0] for pair in matches if len(pair)==2 and pair[0].distance<.72*pair[1].distance]
 if len(good)<12:raise RuntimeError(f'Insufficient P24 matches at {frame}')
 a=np.float32([kp0[x.queryIdx].pt for x in good]);b=np.float32([kp1[x.trainIdx].pt for x in good]);matrix,inliers=cv2.estimateAffinePartial2D(a,b,method=cv2.RANSAC,ransacReprojThreshold=3)
 if matrix is None:raise RuntimeError(f'No P24 transform at {frame}')
 result.append({'frame':frame,'inlierCount':int(inliers.sum()),'inlierRatio':round(float(inliers.mean()),4)})
ok=all(x['inlierCount']>=50 and x['inlierRatio']>.4 for x in result)
report={'frames':result,'pass':ok,'limitation':'Feature correspondence supports common approved plate; it does not establish subjective transition quality.'}
write_report(report,Path(sys.argv[2]),sys.argv[1]);print(json.dumps(report,indent=2));sys.exit(not ok)
