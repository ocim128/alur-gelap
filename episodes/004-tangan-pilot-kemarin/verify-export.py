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
stem=decode(root/'public'/m['narration']['asset']); speech_search_start=jolt/sr-1.7; search=stem[round(speech_search_start*sr):jolt]
last=speech_search_start+int(np.flatnonzero(np.abs(search)>10**(-60/20))[-1])/sr
reference_start=last-.594937; reference_end=last-.044937
refword=stem[round(reference_start*sr):round(reference_end*sr):8]; search_start=round((reference_start-.1)*sr); signal=audio[search_start:round((reference_end+.15)*sr):8]
correlation=np.correlate(signal,refword,'valid'); index=int(np.argmax(np.abs(correlation))); lag=search_start/sr+index*8/sr-reference_start
match=signal[index:index+len(refword)]; denom=float(np.linalg.norm(match)*np.linalg.norm(refword)); strength=float(abs(correlation[index])/denom) if denom else 0
report['finalSpeechEvidence']={'lastStemSampleAboveMinus60DbfsSec':round(last,6),'sourceToDecodedMixLagMs':round(lag*1000,3),'lastSignalOnExportSec':round(last+lag,6),
 'finalWordCorrelation':round(strength,4),'lastSignalToStingerMs':round((onset-last-lag)*1000,3) if len(hit) else None,
 'limitation':'Energy threshold and alignment evidence only; final phoneme requires listening.'}
if strength<.5:errors.append('could not align final narration to decoded export')
if len(hit) and not .12 <= onset-last-lag <= .18:errors.append('last significant narration signal to stinger is outside 120-180 ms')
voice=decode(root/'public/assets/004-tangan-pilot-kemarin/sfx/voice-copilot-gantian.wav')
voice_start=round(t['copilotVoiceFrame']*sr/fps); voice_end=voice_start+len(voice)
voice_rms=rms(stem[voice_start:voice_end]); sample=voice[:round(.30*sr):8]; low=voice_start-round(.05*sr); clip=audio[low:voice_start+round(.40*sr):8]
cross=np.correlate(clip,sample,'valid'); ix=int(np.argmax(np.abs(cross))); match=clip[ix:ix+len(sample)]; den=float(np.linalg.norm(sample)*np.linalg.norm(match)); strength=float(abs(cross[ix])/den) if den else 0
delta=(low/sr+ix*8/sr-t['copilotVoiceFrame']/fps)*1000
report['copilotBeat']={'voiceStartSec':voice_start/sr,'voiceEndSec':voice_end/sr,'voiceOnsetOffsetMs':round(delta,3),'voiceCorrelation':round(strength,4),'narrationStemRmsDbfs':db(voice_rms)}
if voice_rms>10**(-45/20) or strength<.1 or abs(delta)>1000/fps:errors.append('copilot line overlaps narration or is not detected on its cue')
captions=json.loads((p/'captions.json').read_text(encoding='utf-8'))
caption_words=[w['text'] for item in captions for w in item['words']]
report['captionSpelling']={'copilot':any(' '.join(w['text'] for w in c['words']).find('COPILOT NANGKEP.')>=0 for c in captions),'jadiin':'JADIIN' in caption_words}
if not all(report['captionSpelling'].values()):errors.append('requested caption spelling missing')
flash_frames=[f+i for f,length in [(28,8),(m['scenes'][2]['at']+18,8),(t['impact2Frame'],8),(t['joltFrame'],2)] for i in range(length)]
rewind_frames=[x['startFrame']+offset for x in t['branchRewinds'] for offset in (0,6,11)]
shake_frames=[t['joltFrame']+i for i in (2,3,4,5,6,7,8,9)]
frames=sorted(set([6,t['joltFrame']-1,t['blackoutFrame']-1,t['blackoutFrame']]+flash_frames+rewind_frames+shake_frames))
expr='+'.join(f'eq(n,{f})' for f in frames)
raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(vpath),'-vf',f"select='{expr}',scale=108:192,format=gray",'-fps_mode','vfr','-f','rawvideo','-'])
if len(raw)!=len(frames)*108*192:errors.append('missing verification frames')
else:
 images=np.frombuffer(raw,dtype=np.uint8).reshape(len(frames),192,108); means=images.mean(axis=(1,2)); report['frames']=[{'frame':f,'meanLuma':round(float(y),2)} for f,y in zip(frames,means)]
 before=images[frames.index(t['joltFrame']-1)].astype(np.int16); after=images[frames.index(t['joltFrame'])].astype(np.int16)
 change=float(np.mean(np.abs(after-before))); report['jolt']['visualFrameChangeMean']=round(change,2)
 if change<2:errors.append('jolt picture transition not independently detected')
 # Find translation in a central crop of the jolt plate after its two-frame flash.
 shifts=[]
 for a,b in zip(shake_frames,shake_frames[1:]):
  previous=images[frames.index(a)].astype(np.float32); current=images[frames.index(b)].astype(np.float32)
  differences=[(float(np.mean((previous[15:175,10:98]-current[15:175,10+dx:98+dx])**2)),dx) for dx in range(-3,4)]
  shifts.append(min(differences)[1])
 report['jolt']['measuredShakeFrameTranslationsAt108px']=shifts
 if not any(shifts):errors.append('jolt shake not independently detected')
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
