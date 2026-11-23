"""Verify the Scenario 04 compressed MP4 against the assembly timeline."""
import json, math, re, subprocess, sys
from pathlib import Path
import numpy as np
p=Path(__file__).resolve().parent; root=p.parents[1]; m=json.loads((p/'manifest.json').read_text(encoding='utf-8')); t=m['timing']; fps=m['fps']; sr=m['soundMix']['sampleRate']; vpath=Path(sys.argv[1]); errors=[]
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration:stream=codec_type,width,height,r_frame_rate,pix_fmt,color_range,color_space,color_primaries,color_transfer,start_time','-of','json',str(vpath)],text=True))
v=next(x for x in probe['streams'] if x['codec_type']=='video'); a=next(x for x in probe['streams'] if x['codec_type']=='audio')
for k,val in {'width':1080,'height':1920,'r_frame_rate':'30/1','pix_fmt':'yuv420p','color_range':'tv','color_space':'bt709','color_primaries':'bt709','color_transfer':'bt709'}.items():
 if v.get(k)!=val:errors.append(f'{k}: {v.get(k)} != {val}')
if abs(float(probe['format']['duration'])-m['duration']/fps)>.04:errors.append('wrong duration')
if any(abs(float(s.get('start_time',0)))>.001 for s in (v,a)):errors.append('unexpected stream offset')
def decode(path):return np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-map','0:a:0','-ac','1','-ar',str(sr),'-f','f32le','-']),dtype='<f4')
audio=decode(vpath); ref=decode(root/'public/assets/004-tangan-pilot-kemarin/sfx/tape-snap-rewind.wav')
report={'video':str(vpath),'durationSec':float(probe['format']['duration']),'rewinds':[],'errors':errors}
if not np.all(np.isfinite(audio)):errors.append('non-finite audio')
# Match actual encoded snap waveform independently within ±100 ms of every frame.
reference=ref[:round(.14*sr):8]
for item in t['branchRewinds']:
 frame=item['startFrame']; expected=round(frame*sr/fps); low=max(0,expected-round(.10*sr)); high=expected+round(.25*sr)
 x=audio[low:high:8]; c=np.correlate(x,reference,mode='valid'); i=int(np.argmax(np.abs(c))); segment=x[i:i+len(reference)]; denom=float(np.linalg.norm(segment)*np.linalg.norm(reference)); corr=float(abs(c[i])/denom) if denom else 0
 found=low/sr+i/(sr/8); delta=1000*(found-frame/fps)
 report['rewinds'].append({'startFrame':frame,'endFrame':item['endFrame'],'expectedSec':frame/fps,'detectedSec':round(found,6),'offsetMs':round(delta,3),'correlation':round(corr,4)})
 if corr<.1 or abs(delta)>1000/fps:errors.append(f'rewind {frame}: snap not detected within one frame')
def rms(x):return float(np.sqrt(np.mean(x.astype(np.float64)**2)))
def db(x):return round(20*math.log10(max(x,1e-15)),2)
lo,hi=(round(f*sr/fps) for f in t['dreadSilenceFrames']); section=audio[lo:hi]
report['dreadSilence']={'startSec':lo/sr,'endSec':hi/sr,'rmsDbfs':db(rms(section)),'peakDbfs':db(float(np.max(np.abs(section)))),'innerRmsDbfs':db(rms(section[480:-480]))}
if rms(section)>10**(-52/20):errors.append('dread silence exceeds -52 dBFS RMS after AAC')
jolt=round(t['joltFrame']*sr/fps); section=audio[jolt-round(.15*sr):jolt]
report['vacuum']={'startSec':(jolt-round(.15*sr))/sr,'endSec':jolt/sr,'rmsDbfs':db(rms(section)),'peakDbfs':db(float(np.max(np.abs(section))))}
if rms(section)>10**(-45/20):errors.append('jolt vacuum exceeds -45 dBFS RMS after AAC')
window=audio[jolt-round(.025*sr):jolt+round(.05*sr)]; hit=np.flatnonzero(np.abs(window)>.001)
if len(hit):
 onset=(jolt-round(.025*sr)+int(hit[0]))/sr; diff=(onset-t['joltFrame']/fps)*1000
 report['jolt']={'frame':t['joltFrame'],'visualSec':t['joltFrame']/fps,'audioOnsetSec':round(onset,6),'offsetMs':round(diff,3)}
 if abs(diff)>1000/fps:errors.append('jolt audio offset exceeds one frame')
else:errors.append('jolt audio onset not detected')
flash_frames=[f+i for f,length in [(28,8),(m['scenes'][2]['at']+18,8),(t['impact2Frame'],8),(t['joltFrame'],2)] for i in range(length)]
rewind_frames=[x['startFrame']+offset for x in t['branchRewinds'] for offset in (0,6,11)]
frames=sorted(set([6,t['joltFrame']-1,t['blackoutFrame']-1,t['blackoutFrame']]+flash_frames+rewind_frames))
expr='+'.join(f'eq(n,{f})' for f in frames)
raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(vpath),'-vf',f"select='{expr}',scale=108:192,format=gray",'-fps_mode','vfr','-f','rawvideo','-'])
if len(raw)!=len(frames)*108*192:errors.append('missing verification frames')
else:
 images=np.frombuffer(raw,dtype=np.uint8).reshape(len(frames),192,108); means=images.mean(axis=(1,2)); report['frames']=[{'frame':f,'meanLuma':round(float(y),2)} for f,y in zip(frames,means)]
 before=images[frames.index(t['joltFrame']-1)].astype(np.int16); after=images[frames.index(t['joltFrame'])].astype(np.int16)
 change=float(np.mean(np.abs(after-before))); report['jolt']['visualFrameChangeMean']=round(change,2)
 if change<2:errors.append('jolt picture transition not independently detected')
 report['maxFlashMeanLuma']=round(max(float(means[frames.index(f)]) for f in flash_frames),2)
 for item in report['rewinds']:
  start=images[frames.index(item['startFrame'])].astype(np.int16); middle=images[frames.index(item['startFrame']+6)].astype(np.int16)
  item['visualMidpointChangeMean']=round(float(np.mean(np.abs(middle-start))),2)
  if item['visualMidpointChangeMean']<1:errors.append(f"rewind {item['startFrame']}: visual transition not detectable")
 if max(means)>=190:errors.append('sampled frame luma exceeds 190')
 if means[frames.index(t['blackoutFrame'])]>3:errors.append('blackout not black')
measure=subprocess.run(['ffmpeg','-hide_banner','-nostats','-i',str(vpath),'-filter_complex','ebur128=peak=true','-f','null','NUL'],capture_output=True,text=True).stderr
summary=measure.rsplit('Summary:',1)[-1]; loud=re.search(r'I:\s*(-?[\d.]+) LUFS',summary); peak=re.search(r'Peak:\s*(-?[\d.]+) dBFS',summary)
if not loud or not peak:errors.append('loudness measurement missing')
else:
 report['loudness']={'integratedLufs':float(loud.group(1)),'truePeakDbtp':float(peak.group(1))}
 if abs(float(loud.group(1))+14)>.5:errors.append('integrated loudness outside -14 ±0.5 LUFS')
 if float(peak.group(1))>-1.5:errors.append('true peak exceeds -1.5 dBTP')
out=Path(sys.argv[2]) if len(sys.argv)>2 else p/'verification/export-report.json';out.parent.mkdir(exist_ok=True,parents=True)
text=json.dumps(report,indent=2,allow_nan=False)+'\n';out.write_text(text,encoding='utf-8');print(text);sys.exit(bool(errors))
