"""Track the approved P18 plate and key regions through the compressed roll."""
import json, math, subprocess, sys
from pathlib import Path
import cv2
import numpy as np
p=Path(__file__).resolve().parent;root=p.parents[1];sys.path.insert(0,str(root/'scripts'))
from verify_export_common import write_report
m=json.loads((p/'manifest.json').read_text(encoding='utf-8'));t=m['timing'];start=t['p18StartFrame'];end=t['p19StartFrame']
frames=sorted(set(list(range(start,end,6))+[t['bankRollStartFrame'],t['bankRollPeakFrame'],end-1]))
expr='+'.join(f'eq(n,{f})' for f in frames);w,h=540,960
raw=subprocess.check_output(['ffmpeg','-v','error','-i',sys.argv[1],'-vf',f"select='{expr}',scale={w}:{h},format=gray",'-fps_mode','vfr','-f','rawvideo','-'])
if len(raw)!=len(frames)*w*h:raise RuntimeError('Missing P18 motion frames')
images=np.frombuffer(raw,dtype=np.uint8).reshape(len(frames),h,w)
source=cv2.imread(str(root/'public/assets/005-sabuk-ketiga/selected-owner-approved/p18.webp'),cv2.IMREAD_GRAYSCALE)
source=cv2.resize(source,(w,h));orb=cv2.ORB_create(nfeatures=3500,fastThreshold=5)
kp0,d0=orb.detectAndCompute(source,None);matcher=cv2.BFMatcher(cv2.NORM_HAMMING)
screen=np.float32([[0,0],[w,0],[w,h],[0,h]])
boxes={'pilot':(790,480,1079,1050),'controls':(680,630,920,1050),'leftExit':(125,275,325,1225)}
records=[]
for frame,image in zip(frames,images):
 kp1,d1=orb.detectAndCompute(image,None)
 if d1 is None:raise RuntimeError(f'No P18 features at frame {frame}')
 pairs=matcher.knnMatch(d0,d1,k=2);good=[pair[0] for pair in pairs if len(pair)==2 and pair[0].distance<.72*pair[1].distance]
 if len(good)<12:raise RuntimeError(f'Insufficient P18 matches at {frame}: {len(good)}')
 a=np.float32([kp0[x.queryIdx].pt for x in good]);b=np.float32([kp1[x.trainIdx].pt for x in good]);affine,inliers=cv2.estimateAffinePartial2D(a,b,method=cv2.RANSAC,ransacReprojThreshold=3)
 if affine is None:raise RuntimeError(f'No P18 transform at {frame}')
 regions={}
 for name,(x0,y0,x1,y1) in boxes.items():
  corners=np.float32([[[x0/2,y0/2],[x1/2,y0/2],[x1/2,y1/2],[x0/2,y1/2]]]);projected=cv2.transform(corners,affine)[0]
  total=abs(cv2.contourArea(projected));inside,_=cv2.intersectConvexConvex(projected,screen)
  regions[name]=round(float(inside/total),4) if total else 0
 records.append({'frame':frame,'sec':round(frame/m['fps'],4),'angleDegrees':round(math.degrees(math.atan2(affine[1,0],affine[0,0])),3),'geometricVisibleFraction':regions,'inliers':int(inliers.sum())})
roll=[r for r in records if t['bankRollStartFrame']<=r['frame']<=t['bankRollPeakFrame']]
minimum={name:round(min(r['geometricVisibleFraction'][name] for r in records),4) for name in boxes}
monotonic=all(b['angleDegrees']>=a['angleDegrees']-1.0 for a,b in zip(roll,roll[1:]))
ok=monotonic and 12.5<=roll[-1]['angleDegrees']<=15.5 and minimum['pilot']>=.65 and minimum['controls']>=.85 and minimum['leftExit']>=.75
report={'video':sys.argv[1],'sampleStrideFrames':6,'frames':records,'minimumGeometricVisibleFraction':minimum,'rollMonotonicWithinOneDegree':monotonic,'pass':ok,
 'limitations':'Registration samples the whole P18 motion every 0.2 s plus key frames; geometric visibility does not measure opacity, subjective identification, comprehension or real-time human playback.'}
write_report(report,Path(sys.argv[2]),sys.argv[1]);print(json.dumps({'minimumGeometricVisibleFraction':minimum,'rollMonotonicWithinOneDegree':monotonic,'lastRoll':roll[-1],'pass':ok},indent=2));sys.exit(not ok)
