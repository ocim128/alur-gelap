"""Build and pixel-check a new Scenario 04 delivery; never overwrite artifacts.

The source is the separately retained Remotion render. The lossless master makes
the range/matrix transformation testable byte for byte at sampled frames. The
review copy is encoded from that master and checked separately.
"""
import hashlib, json, math, subprocess, sys
from pathlib import Path
import numpy as np

episode=Path(__file__).resolve().parent; root=episode.parents[1]
out=root/'out/004-tangan-pilot-kemarin'
source=out/'skenario04-rec709-proof-source.mp4'
audio=root/'public/assets/004-tangan-pilot-kemarin/assembly-mix-polish.wav'
master=out/'skenario04-rec709-proof-master.mp4'
delivery=out/'skenario04-rec709-proof-review.mp4'
report=episode/'verification/rec709-pixel-proof.json'
frames=[6,28,348,750,773,1280,1316,1714,1773,2232,2475,3922,4242,4610,4642]
fps=30; width=1080; height=1920; frame_bytes=width*height*3//2
conversion='scale=in_range=full:in_color_matrix=bt601:out_range=limited:out_color_matrix=bt709,format=yuv420p'

def sha(path):
 h=hashlib.sha256()
 with path.open('rb') as f:
  for data in iter(lambda:f.read(1024*1024),b''):h.update(data)
 return h.hexdigest()
def probe(path):
 return json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration:stream=codec_type,width,height,pix_fmt,color_range,color_space,color_primaries,color_transfer,r_frame_rate,channels,sample_rate','-of','json',str(path)],text=True))
def video(path):return next(x for x in probe(path)['streams'] if x['codec_type']=='video')
def run(args):
 print(subprocess.list2cmdline(args),flush=True);subprocess.run(args,check=True)
def decode_frames(path, filters, pix_fmt):
 select="select='"+'+'.join(f'eq(n,{x})' for x in frames)+"'"
 vf=select+(','+filters if filters else '')
 cmd=['ffmpeg','-v','error','-i',str(path),'-map','0:v:0','-vf',vf,'-fps_mode','vfr','-frames:v',str(len(frames)),'-pix_fmt',pix_fmt,'-f','rawvideo','-']
 data=subprocess.check_output(cmd)
 if len(data)!=len(frames)*frame_bytes:raise ValueError(f'Unexpected decoded frame bytes for {path}: {len(data)}')
 return np.frombuffer(data,dtype=np.uint8).reshape(len(frames),frame_bytes)
def stats(a,b):
 d=a.astype(np.int16)-b.astype(np.int16); sq=np.mean(d.astype(np.float64)**2)
 return {'meanAbsoluteCodeDifference':round(float(np.mean(np.abs(d))),6),'maxAbsoluteCodeDifference':int(np.max(np.abs(d))),
         'differentCodeValues':int(np.count_nonzero(d)), 'psnrDb':None if sq==0 else round(float(10*math.log10(255*255/sq)),4)}

if any(x.exists() for x in (master,delivery,report)):
 raise FileExistsError('Output or proof report exists; choose new names rather than overwrite')
if not source.is_file() or not audio.is_file():raise FileNotFoundError('Retained source picture or accepted mix missing')
sv=video(source)
expected={'width':width,'height':height,'pix_fmt':'yuvj420p','color_range':'pc','color_space':'bt470bg','r_frame_rate':'30/1'}
if any(sv.get(k)!=v for k,v in expected.items()):raise ValueError(f'Source assumptions do not match ffprobe: {sv}')

encode=['ffmpeg','-n','-hide_banner','-loglevel','error','-i',str(source),'-i',str(audio),'-map','0:v:0','-map','1:a:0',
 '-vf',conversion,'-c:v','libx264','-preset','ultrafast','-crf','0','-c:a','aac','-b:a','192k','-ac','1',
 '-color_range','tv','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709',
 '-bsf:v','h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1:video_full_range_flag=0',
 '-movflags','+faststart','-shortest',str(master)]
run(encode)
compressed=['ffmpeg','-n','-hide_banner','-loglevel','error','-i',str(master),'-map','0:v:0','-map','0:a:0',
 '-c:v','libx264','-preset','medium','-crf','28','-pix_fmt','yuv420p',
 '-color_range','tv','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709',
 '-bsf:v','h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1:video_full_range_flag=0',
 '-c:a','aac','-b:a','128k','-ac','1','-movflags','+faststart',str(delivery)]
run(compressed)
for path in (master,delivery):
 v=video(path)
 for key,val in {'width':width,'height':height,'pix_fmt':'yuv420p','color_range':'tv','color_space':'bt709','color_primaries':'bt709','color_transfer':'bt709','r_frame_rate':'30/1'}.items():
  if v.get(key)!=val:raise ValueError(f'{path.name}: {key}: {v.get(key)} != {val}')

print('Decoding selected source, explicitly converted reference, master and delivery frames...',flush=True)
original=decode_frames(source,'','yuvj420p')
reference=decode_frames(source,conversion,'yuv420p')
master_pixels=decode_frames(master,'','yuv420p')
review_pixels=decode_frames(delivery,'','yuv420p')
comparisons=[]; ysize=width*height;usize=ysize//4
for i,frame in enumerate(frames):
 converted_vs_master=stats(reference[i],master_pixels[i]); original_vs_converted=stats(original[i],reference[i]); delivery_vs_master=stats(master_pixels[i],review_pixels[i])
 planes={}
 for label,a,b in [('Y',0,ysize),('U',ysize,ysize+usize),('V',ysize+usize,frame_bytes)]:
  planes[label]={'convertedReferenceVsLosslessMaster':stats(reference[i,a:b],master_pixels[i,a:b]),
                 'sourceVsConvertedReference':stats(original[i,a:b],reference[i,a:b]),
                 'deliveryVsMaster':stats(master_pixels[i,a:b],review_pixels[i,a:b])}
 comparisons.append({'frame':frame,'timeSec':frame/fps,'sourceVsConvertedReference':original_vs_converted,
                     'convertedReferenceVsLosslessMaster':converted_vs_master,'deliveryVsMaster':delivery_vs_master,'planes':planes})
 if converted_vs_master['differentCodeValues']!=0:raise ValueError(f'Frame {frame} lossless master differs from explicit conversion')
if not any(c['sourceVsConvertedReference']['differentCodeValues'] for c in comparisons):raise ValueError('Conversion did not change any sampled pixel codes')
ffmpeg_version=subprocess.check_output(['ffmpeg','-version'],text=True).splitlines()[0]
payload={'schemaVersion':1,'result':'pass','scope':'Sampled decoded YUV code comparison; source-to-master exact for every sampled code, not an exhaustive comparison of all frames.',
 'source':{'path':str(source.relative_to(root)),'sha256':sha(source),'video':sv},
 'audioMix':{'path':str(audio.relative_to(root)),'sha256':sha(audio)},
 'master':{'path':str(master.relative_to(root)),'sha256':sha(master),'video':video(master)},
 'delivery':{'path':str(delivery.relative_to(root)),'sha256':sha(delivery),'video':video(delivery)},
 'renderCommand':['npx','remotion','render','src/index.ts','Skenario04TanganPilotKemarin',str(source.relative_to(root)),'--concurrency=6'],
 'masterCommand':encode,'deliveryCommand':compressed,'ffmpegVersion':ffmpeg_version,
 'interpretation':'The fresh source explicitly reports full-range yuvj420p and bt470bg matrix; bt601 is the compatible swscale input matrix. Source primaries and transfer were untagged, so BT.709 SDR primaries/transfer are an output interpretation assumption, not a measured transform of source primaries or transfer. This record does not prove which pixels were used for the prior audited export.',
 'frameIndices':frames,'comparisons':comparisons}
with report.open('x',encoding='utf-8') as f:json.dump(payload,f,indent=2,allow_nan=False);f.write('\n')
print(json.dumps({'result':'pass','report':str(report),'sourceSha256':payload['source']['sha256'],'masterSha256':payload['master']['sha256'],'deliverySha256':payload['delivery']['sha256'],'sampledFrames':len(frames)},indent=2),flush=True)
