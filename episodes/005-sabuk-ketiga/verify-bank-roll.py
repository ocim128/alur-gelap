"""Estimate P18 roll in the encoded video against its approved source plate."""
import json, math, subprocess, sys
from pathlib import Path
import cv2
import numpy as np
p=Path(__file__).resolve().parent; root=p.parents[1]
m=json.loads((p/'manifest.json').read_text(encoding='utf-8'));t=m['timing']
frames=[t['bankRollStartFrame'],round((t['bankRollStartFrame']+t['bankRollPeakFrame'])/2),t['bankRollPeakFrame']]
expr='+'.join(f'eq(n,{f})' for f in frames)
raw=subprocess.check_output(['ffmpeg','-v','error','-i',sys.argv[1],'-vf',f"select='{expr}',scale=540:960,format=gray",'-fps_mode','vfr','-f','rawvideo','-'])
assert len(raw)==len(frames)*540*960,'missing sampled frames'
video=np.frombuffer(raw,dtype=np.uint8).reshape(len(frames),960,540)
source=cv2.imread(str(root/'public/assets/005-sabuk-ketiga/selected-owner-approved/p18.webp'),cv2.IMREAD_GRAYSCALE)
source=cv2.resize(source,(540,960));orb=cv2.ORB_create(nfeatures=4000,fastThreshold=5)
kp1,des1=orb.detectAndCompute(source,None); output=[]
for frame,img in zip(frames,video):
 kp2,des2=orb.detectAndCompute(img,None)
 if des1 is None or des2 is None:raise RuntimeError(f'No image features at frame {frame}')
 pairs=cv2.BFMatcher(cv2.NORM_HAMMING).knnMatch(des1,des2,k=2)
 good=[a for a,b in pairs if a.distance<.72*b.distance]
 if len(good)<10:raise RuntimeError(f'Insufficient image matches at frame {frame}: {len(good)}')
 x=np.float32([kp1[v.queryIdx].pt for v in good]);y=np.float32([kp2[v.trainIdx].pt for v in good])
 matrix,inliers=cv2.estimateAffinePartial2D(x,y,method=cv2.RANSAC,ransacReprojThreshold=3)
 if matrix is None:raise RuntimeError(f'Cannot estimate frame {frame}')
 angle=math.degrees(math.atan2(matrix[1,0],matrix[0,0]));scale=math.hypot(matrix[0,0],matrix[1,0])
 output.append({'frame':frame,'sec':frame/m['fps'],'angleDegrees':round(angle,3),'scale':round(scale,4),'inlierCount':int(inliers.sum())})
ok=abs(output[0]['angleDegrees'])<1 and 12.5<=output[-1]['angleDegrees']<=15.5 and output[1]['angleDegrees']>output[0]['angleDegrees']
report={'video':sys.argv[1],'frames':output,'pass':ok,'limitation':'Frame registration measures plate rotation, not independent horizon movement or viewer comprehension.'}
out=Path(sys.argv[2]);
if out.exists():raise FileExistsError(out)
out.write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8');print(json.dumps(report,indent=2));sys.exit(not ok)
