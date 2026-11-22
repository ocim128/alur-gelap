"""Measure timing, silence, flash luma and color on the compressed Scenario 03 MP4."""
import json, math, subprocess, sys
from pathlib import Path
import numpy as np
p=Path(__file__).parent
video=Path(sys.argv[1]); m=json.loads((p/'manifest.json').read_text(encoding='utf-8')); t=m['timing']; sr=m['soundMix']['sampleRate']; fps=m['fps']; errors=[]
def sample(frame):return round(frame*sr/fps)
def cue(name):return sample(t[name+'Frame'])+t.get(name+'SampleOffset',0)
def db(x):return 20*math.log10(max(float(x),1e-15))
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration:stream=codec_type,width,height,r_frame_rate,pix_fmt,color_range,color_space,color_primaries,color_transfer,start_time,duration','-of','json',str(video)],text=True))
v=next(x for x in probe['streams'] if x['codec_type']=='video'); a=next(x for x in probe['streams'] if x['codec_type']=='audio')
expected={'width':1080,'height':1920,'r_frame_rate':'30/1','pix_fmt':'yuv420p','color_range':'tv','color_space':'bt709','color_primaries':'bt709','color_transfer':'bt709'}
for k,value in expected.items():
 if v.get(k)!=value:errors.append(f'{k}: expected {value}, got {v.get(k)}')
if abs(float(probe['format']['duration'])-m['duration']/fps)>.04:errors.append('duration differs from manifest')
for stream in (v,a):
 if abs(float(stream.get('start_time','0')))>.001:errors.append('unexpected stream start offset')
audio=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(video),'-map','0:a:0','-ac','1','-ar',str(sr),'-f','f32le','-']),dtype='<f4')
if len(audio)<sample(m['duration'])-2048 or not np.all(np.isfinite(audio)):errors.append('decoded audio missing samples or is non-finite')
report={'video':str(video),'durationSec':float(probe['format']['duration']),'silences':{},'errors':errors}
# Check that the pre-gap word release is present in the encoded mix. The
# accepted PCM places this material immediately after its original inserted gap.
source=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i','public/assets/003-goyangan-dek-enam/narration-prepared.wav','-ac','1','-ar',str(sr),'-f','f32le','-']),dtype='<f4')
source_start=cue('postPinOriginalGapEnd'); restored_start=cue('postPinOriginalGapStart'); length=round(.26*sr)
reference=source[source_start:source_start+length]; actual=audio[restored_start:restored_start+length]
if len(reference)!=length or len(actual)!=length:errors.append('missing restored word-release audio')
else:
 correlation=float(np.corrcoef(reference,actual)[0,1])
 report['restoredWordRelease']={'originalSourceSec':source_start/sr,'restoredSec':restored_start/sr,'durationSec':length/sr,'encodedCorrelation':round(correlation,4) if math.isfinite(correlation) else None}
 if not math.isfinite(correlation) or correlation<.6:errors.append('restored word release is missing or misaligned')
captions=json.loads((p/'captions.json').read_text(encoding='utf-8'))
lines=[' '.join(w['text'] for w in c['words']) for c in captions]
report['captionText']={'doorPhrasePresent':any('PINTU MASUK KE LORONG' in line for line in lines),'tamatPeriodPresent':'TAMAT.' in lines}
if not all(report['captionText'].values()):errors.append('requested caption correction missing')
if m['scenes'][18]['at']!=t['impactFrame']:errors.append('P19 cut is not on the impact frame')
for label,left,right in [('postRewind',sample(t['postRewindSilenceFrames'][0]),sample(t['postRewindSilenceFrames'][1])),('postPin',cue('postPinSilenceStart'),cue('postPinSilenceEnd')),('blackoutLead',cue('blackoutSilenceStart'),sample(t['blackoutFrame']))]:
 x=audio[left:right]; inner=x[min(len(x)//4,480):max(min(len(x)//4,480),len(x)-min(len(x)//4,480))]
 if not len(inner):errors.append(f'{label}: no audio samples');continue
 peak=float(np.max(np.abs(x))); rms=float(np.sqrt(np.mean(x.astype(np.float64)**2))); inner_peak=float(np.max(np.abs(inner)))
 report['silences'][label]={'startSec':left/sr,'endSec':right/sr,'peakDbfs':round(db(peak),2),'rmsDbfs':round(db(rms),2),'interiorPeakDbfs':round(db(inner_peak),2),'interiorEdgeTrimMs':round(min(len(x)//4,480)*1000/sr,3)}
 if rms>10**(-52/20):errors.append(f'{label}: audible residual exceeds -52 dBFS RMS')
black=cue('blackoutSub'); lo=black-round(.03*sr); hi=black+round(.05*sr); crossing=np.flatnonzero(np.abs(audio[lo:hi])>.001)
if not len(crossing):errors.append('blackout hit onset missing')
else:
 onset=(lo+int(crossing[0]))/sr; offset=(onset-t['blackoutFrame']/fps)*1000
 report['blackoutAudio']={'frame':t['blackoutFrame'],'visualSec':t['blackoutFrame']/fps,'onsetSec':round(onset,6),'offsetMs':round(offset,3),'threshold':.001}
 if abs(offset)>1000/fps:errors.append('blackout audio and visual differ by more than one frame')
# Correlate the supplied impact's first 150 ms with the decoded mix around its independent word anchor.
refpath=Path('public/assets/003-goyangan-dek-enam/sfx/lifeboat-impact.wav')
ref=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(refpath),'-ac','1','-ar',str(sr),'-f','f32le','-']),dtype='<f4')[:round(.15*sr):8]
expected_sample=cue('impact'); lo=expected_sample-round(.1*sr); hi=expected_sample+round(.3*sr); x=audio[lo:hi:8]; corr=np.correlate(x,ref,mode='valid'); ix=int(np.argmax(np.abs(corr))); portion=x[ix:ix+len(ref)]; den=float(np.linalg.norm(ref)*np.linalg.norm(portion)); strength=float(abs(corr[ix])/den) if den else 0; found=lo/sr+ix/(sr/8); diff=(found-expected_sample/sr)*1000
report['impactAudio']={'anchorSec':expected_sample/sr,'detectedSec':round(found,6),'offsetMs':round(diff,3),'normalizedCorrelation':round(strength,4)}
if strength<.12 or abs(diff)>1000/fps:errors.append('impact sound not independently detected within one frame of the word anchor')
frames=[t['impactFrame']-1,t['impactFrame'],t['impactFrame']+1,t['impactFrame']+2,t['impactFrame']+3,t['blackoutFrame']-1,t['blackoutFrame']]
expr='+'.join(f'eq(n,{f})' for f in frames)
raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(video),'-vf',f"select='{expr}',scale=108:192,format=gray",'-fps_mode','vfr','-f','rawvideo','-'])
if len(raw)!=len(frames)*108*192:errors.append('verification frames missing')
else:
 means=np.frombuffer(raw,dtype=np.uint8).reshape(len(frames),192,108).mean(axis=(1,2));report['visualFrames']=[{'frame':f,'meanLuma':round(float(y),2)} for f,y in zip(frames,means)]
 if means[1]-means[0]<35:errors.append('impact flash onset not visible at expected frame')
 if max(means[1:4])>=190:errors.append('impact flash mean luma exceeds limit')
 if means[-1]>3 or means[-2]<4:errors.append('blackout onset not found at expected frame')
text=json.dumps(report,indent=2,allow_nan=False)+'\n'; out=Path(sys.argv[2]) if len(sys.argv)>2 else p/'verification/export-report.json'; out.write_text(text,encoding='utf-8');print(text)
sys.exit(1 if errors else 0)
