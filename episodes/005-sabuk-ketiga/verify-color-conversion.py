"""Bind a JPEG-source → Rec.709 conversion to encoded MP4 pixels and hashes."""
import hashlib, json, math, subprocess, sys
from pathlib import Path
import numpy as np
from PIL import Image
p=Path(__file__).resolve().parent; root=p.parents[1];sys.path.insert(0,str(root/'scripts'))
from verify_export_common import write_report, sha256_file
source_dir=Path(sys.argv[1]); video=Path(sys.argv[2]); master=Path(sys.argv[3]); out=Path(sys.argv[4])
if out.exists():raise FileExistsError(out)
frames=[6,3470,3646,3832,3893,4658]; w,h=1080,1920; frame_bytes=w*h*3//2
filter_string='zscale=matrixin=bt470bg:rangein=full:primariesin=bt709:transferin=iec61966-2-1:matrix=bt709:range=limited:primaries=bt709:transfer=bt709,format=yuv420p'
expr='+'.join(f'eq(n,{f})' for f in frames)
raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(video),'-vf',f"select='{expr}'",'-fps_mode','vfr','-pix_fmt','yuv420p','-f','rawvideo','-'])
if len(raw)!=frame_bytes*len(frames):raise RuntimeError('Unexpected decoded delivery frame count')
results=[]
def block8(a):return a.reshape(h//8,8,w//8,8).mean(axis=(1,3))
for i,frame in enumerate(frames):
 path=source_dir/f'element-{frame:04d}.jpeg'
 rgb=np.asarray(Image.open(path).convert('RGB'),dtype=np.float32)/255
 linear=np.where(rgb<=.04045,rgb/12.92,((rgb+.055)/1.055)**2.4)
 # zimg's default display-referred REC_709 path uses inverse BT.1886
 # (power 1/2.4), not the scene-referred BT.709 camera OETF.
 bt=np.power(linear,1/2.4)
 expected=16+219*(.2126*bt[:,:,0]+.7152*bt[:,:,1]+.0722*bt[:,:,2])
 naive=16+219*(.2126*rgb[:,:,0]+.7152*rgb[:,:,1]+.0722*rgb[:,:,2])
 y=np.frombuffer(raw,dtype=np.uint8,count=w*h,offset=i*frame_bytes).reshape(h,w).astype(np.float32)
 diff=block8(y)-block8(expected); wrong=block8(y)-block8(naive)
 # Re-run the documented conversion on this source frame and compare all three
 # YUV planes against the encoded video after 8x8/4x4 block averaging.
 ref=subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-vf',filter_string,'-frames:v','1','-pix_fmt','yuv420p','-f','rawvideo','-'])
 if len(ref)!=frame_bytes:raise RuntimeError('Unexpected reference frame size')
 got=np.frombuffer(raw,dtype=np.uint8,count=frame_bytes,offset=i*frame_bytes).astype(np.int16)
 ref_arr=np.frombuffer(ref,dtype=np.uint8).astype(np.int16)
 planes=[]; offsets=[0,w*h,w*h+w*h//4,frame_bytes]
 for j,(pw,ph) in enumerate(((w,h),(w//2,h//2),(w//2,h//2))):
  a=got[offsets[j]:offsets[j+1]].reshape(ph,pw).astype(np.float32);b=ref_arr[offsets[j]:offsets[j+1]].reshape(ph,pw).astype(np.float32)
  block=8 if j==0 else 4
  avg=lambda z:z.reshape(ph//block,block,pw//block,block).mean(axis=(1,3))
  planes.append(round(float(np.mean(np.abs(avg(a)-avg(b)))),4))
 results.append({'frame':frame,'sourceSha256':sha256_file(path),'blockMeanAbsErrorY_Cb_Cr':planes,
  'independentBt709LumaMae':round(float(np.mean(np.abs(diff))),4),'naiveNoTransferConversionLumaMae':round(float(np.mean(np.abs(wrong))),4)})
valid=all(max(x['blockMeanAbsErrorY_Cb_Cr'])<4 and x['independentBt709LumaMae']<4 for x in results)
report={'video':str(video),'master':{'path':str(master),'sha256':sha256_file(master)},
 'source':{'directory':str(source_dir),'format':'JPEG/JFIF yuvj420p','range':'full / pc','matrix':'bt470bg / BT.601 coefficients',
  'primaries':'BT.709 / sRGB','transfer':'sRGB (Chromium is launched with --force-color-profile=srgb)'},
 'filter':filter_string,'frames':results,'pass':valid,
 'method':'8x8 luma and 4x4 chroma block means of decoded delivery versus independently re-run source conversion; independent luma model uses the sRGB EOTF, the display-referred BT.1886 inverse EOTF (power 1/2.4) and BT.709 matrix. zimg selects this display-referred path for REC_709: https://github.com/sekrit-twc/zimg/blob/master/src/zimg/colorspace/gamma.cpp. Lossy encoding allows small differences.'}
write_report(report,out,video);print(json.dumps(report,indent=2));sys.exit(not valid)
