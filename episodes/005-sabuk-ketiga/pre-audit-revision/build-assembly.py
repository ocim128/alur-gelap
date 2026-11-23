"""Build the Scenario 05 timeline and preserve source PCM when aligning rewinds."""
import json, math, sys, wave
from pathlib import Path
import numpy as np
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'scripts'))
from caption_helpers import assign_word_to_scene, semantic_color
p=Path(__file__).resolve().parent; root=p.parents[1]; base=root/'public/assets/005-sabuk-ketiga'; fps=30; sr=48000
with wave.open(str(p/'narration-prepared.wav'),'rb') as f:
 assert (f.getnchannels(),f.getsampwidth(),f.getframerate())==(1,2,sr)
 source=np.frombuffer(f.readframes(f.getnframes()),dtype='<i2').copy()
inserts=[(72.6,1600),(90.8,3200)]
pieces=[]; cursor=0
for sec,count in inserts:
 point=round(sec*sr); assert np.all(source[point-100:point+100]==0)
 pieces.extend([source[cursor:point],np.zeros(count,dtype='<i2')]);cursor=point
pieces.append(source[cursor:]); audio=np.concatenate(pieces)
def shift(t): return t+sum(n/sr for sec,n in inserts if t>=sec)
def frame(t): return math.floor(t*fps+.5)
rewinds=[{'startFrame':1734,'endFrame':1746},{'startFrame':2174,'endFrame':2186},{'startFrame':2721,'endFrame':2733}]
silence=[2733,2778]
windows=[(x['startFrame'],x['endFrame']) for x in rewinds]+[tuple(silence)]
checks=[]
for a,b in windows:
 block=audio[round(a*sr/fps):round(b*sr/fps)]
 checks.append({'frames':[a,b],'nonzeroSamples':int(np.count_nonzero(block)),'peak':int(np.max(np.abs(block.astype('int32'))))})
 assert not np.any(block), (a,b)
out=base/'narration-assembly-padded.wav'
with wave.open(str(out),'wb') as f:f.setnchannels(1);f.setsampwidth(2);f.setframerate(sr);f.writeframes(audio.tobytes())
side=json.loads((p/'narration-timestamps.json').read_text(encoding='utf-8'))
for item in side['words']+side['chunks']:
 for key in ('start','end'): item[key]=round(shift(item[key]),6)
side['master']='narration-assembly-padded.wav'; side['durationSec']=len(audio)/sr
(p/'assembly-timestamps.json').write_text(json.dumps(side,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
(p/'assembly-edit-map.json').write_text(json.dumps({'sampleRate':sr,'source':'narration-prepared.wav','sourcePreserved':True,'insertions':[{'sourceSec':x,'samples':n,'durationSec':n/sr} for x,n in inserts],'windows':checks,'branchRewinds':rewinds,'dreadSilenceFrames':silence},indent=2)+'\n',encoding='utf-8')
# Scene starts are anchored to the associated measured word or a rewind ending.
orig=[0,8.04,15.6,23.5,32.4,39.0,46.94,58.2,65.2,72.86,83.28,92.54,95.0,102.5,106.3,112.1,121.0,124.32,130.54,136.1,139.74,145.94,148.02,152.54]
starts=[frame(shift(x)) for x in orig]; starts[7]=1746; starts[9]=2186; starts[11]=2733
starts[16]=frame(shift(120.58))+12
last=shift(154.84); duration=frame(last+1.5); jolt=math.ceil((last+.15)*fps); black=duration-10
timing={f'p{i+1:02}StartFrame':v for i,v in enumerate(starts)}
timing.update({'branchRewinds':rewinds,'dreadSilenceFrames':silence,'joltFrame':jolt,'blackoutFrame':black,'impact11Frame':frame(shift(88.7)),'impact19Frame':frame(shift(131.64)),'gripFrame':frame(shift(34.36)),'buckleTickFrame':frame(shift(34.36)) +12,'fakeClickFrame':frame(shift(120.58)),'releaseClickFrame':frame(shift(120.58))+12,'firstClickFrame':frame(shift(77.56)),'secondClickFrame':frame(shift(77.56))+12})
scenes=[]
for i,at in enumerate(starts):
 n=i+1; length=(starts[i+1] if i<23 else duration)-at; a=-6 if i%2==0 else 6
 plate=f'assets/005-sabuk-ketiga/selected-owner-approved/p{n:02}.webp'
 scenes.append({'id':f'P{n:02}','name':f'Panel {n:02}','at':at,'atCue':f'p{n:02}StartFrame','plate':plate,'camera':{'from':{'scale':1.02 if n<22 else 1,'x':a if n<22 else 0,'y':0},'to':{'scale':1.06 if n<22 else 1.04,'x':-a if n<22 else 0,'y':0}},'characters':{'mode':'baked'},'hud':[],'editorial':{'protagonist':'reaction' if n==23 else ('absent' if n in (2,3,6,9,22,24) else 'visible'),'purpose':'threat-proximity','evidence':'Owner-approved plate; image exceptions remain open.'},'reframes':[{'at':j,'duration':min(30,length-j),'scale':round(1.02+.04*min(j+30,length)/length,5),'x':0,'y':0} for j in range(0,length,70)]})
m={'schemaVersion':2,'pipelineVersion':2,'id':'Skenario05SabukKetiga','fps':fps,'duration':duration,'captions':'captions.json','openingTitle':'TIGA SABUK TERPASANG','narration':{'asset':'assets/005-sabuk-ketiga/narration-assembly-padded.wav','at':0,'duration':math.ceil(len(audio)/1600),'gain':1},'art':{'styleId':'urban-silhouette-noir','rasterAssets':{s['plate']:'urban-silhouette-noir' for s in scenes}},'script':{'format':'decision-consequence','engine':'triple-branch-rewind','wordCount':259,'hook':{'at':0,'line':'Tiga sabuk terpasang. Penumpangnya cuma dua.'},'ending':{'at':starts[22],'twistAt':starts[23],'payoff':'A final jolt after the landing.'}},'beds':[],'tensionRamp':{'startSec':shift(151.22),'endSec':last,'extraScale':.01,'vignetteStrength':.1},'scenes':scenes,'soundMix':{'asset':'assets/005-sabuk-ketiga/assembly-mix.wav','gain':1,'sampleRate':sr},'timing':timing,'notes':'Image-stage technical failures remain owner-accepted exceptions.'}
(p/'manifest.json').write_text(json.dumps(m,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
words=[]
for w in side['words']:
 if 77<=w['rawIdx']<=81:continue
 w=dict(w)
 if words and w['word'].startswith('-'):
  words[-1]['word']+=w['word'];words[-1]['end']=w['end']
 else: words.append(w)
segments=[assign_word_to_scene(w,starts+[duration],fps) for w in words]; beats=[];group=[]
def flush():
 if not group:return
 parts=[{'text':token.upper(),'color':semantic_color(token,{'tamat':'red','ketiga':'yellow','telat':'yellow'}),'startMs':w['startFrame']*1000/fps,'endMs':w['endFrame']*1000/fps} for w in group for token in w['word'].split()]
 beats.append({'startMs':group[0]['startFrame']*1000/fps,'endMs':group[-1]['endFrame']*1000/fps,'speaker':'NARATOR','words':parts});group.clear()
for w in segments:
 if group and (len(group)>=4 or w['startFrame']-group[-1]['endFrame']>6 or w['sceneFrame']!=group[-1]['sceneFrame'] or group[-1]['word'].endswith(('.', '!', '?')) or w['chunk']!=group[-1]['chunk']):flush()
 group.append(w)
flush()
# The replacement radio voice has its own measured clip window and speaker identity.
beats += [{'startMs':42800,'endMs':45420,'speaker':'MENARA RADIO','words':[{'text':'TURUN,','color':'yellow'},{'text':'LEWATIN','color':'yellow'},{'text':'AWAN,','color':'yellow'}]}, {'startMs':45720,'endMs':46780,'speaker':'MENARA RADIO','words':[{'text':'IZIN','color':'yellow'},{'text':'DARURAT.','color':'yellow'}]}]
beats.sort(key=lambda x:x['startMs'])
(p/'captions.json').write_text(json.dumps(beats,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
print(json.dumps({'windows':checks,'durationSec':duration/fps,'joltFrame':jolt,'lastWordSec':last},indent=2))
