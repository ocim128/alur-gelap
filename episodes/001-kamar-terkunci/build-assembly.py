import json, pathlib, re
p=pathlib.Path('episodes/001-kamar-terkunci'); a=pathlib.Path('public/assets/001-kamar-terkunci'); ts=json.loads((p/'narration-timestamps.json').read_text(encoding='utf-8'))
# Extend measured existing speech-free gaps without changing playback speed.
# Each insertion is frame-aligned; total added time is 524 / 30 seconds.
insertions=[(round(t*30),n) for t,n in zip([69.7,81.33,83.8,86.85,91.4,95.8,98.1,101.95],[66,66,66,66,65,65,65,65])]
def mapframe(f): return f+sum(n for at,n in insertions if f>=at)
def mapsec(t): return (t*30+sum(n for at,n in insertions if t*30>=at))/30
# Times on the measured narration timeline; all boundaries rounded to frames.
starts=[0,5.48,7.08,11.24,18.52,24.74,29.02,42.91,44.85,50.47,54.79,60.61,65.57,74.45,84.342,92.606,96.006,102.346,104.226,113.226,121.257,124.797,129.575,131.735]
starts=[mapframe(round(x*30)) for x in starts]; duration=4703
scenes=[]
visible={1,2,7,8,10,11,12,13,14,16,17,18,19,21,22,23,24}
for i,at in enumerate(starts):
 n=i+1; plate=f'assets/001-kamar-terkunci/p{n:02}.webp'; end=starts[i+1] if i<23 else duration
 scenes.append({'id':f'P{n:02}', 'name':f'Panel {n:02}', 'at':at,'plate':plate,'camera':{'from':{'scale':1,'x':0,'y':0},'to':{'scale':1.015,'x':0,'y':0}},'characters':{'mode':'baked'},'hud':[],'editorial':{'protagonist':'reaction' if n==23 else ('visible' if n in visible else 'absent'),'purpose':'threat-proximity','evidence':f'Locked panel P{n:02}.'}, 'reframes': [{'at':j,'duration':min(30,end-at-j),'scale':1.01,'x':0,'y':0} for j in range(0,end-at,70) if end-at-j>=1]})
# Proposed cues are assembled from the licensed shared library, not new recordings.
cues=[('first hatch open','sfx/prepared/ep007-gate-open.wav',5.5,.12),('first hatch close','sfx/prepared/ep007-gate-open.wav',6.6,.12),('hatch open','sfx/prepared/ep007-gate-open.wav',6.95,.16),('hatch close','sfx/prepared/ep007-gate-open.wav',10.65,.13),('ceramic scrape','sfx/prepared/ep007-stone-scrape.wav',35.67,.27),('running step','sfx/prepared/shoe-left.wav',43.6,.22),('running step','sfx/prepared/shoe-right.wav',43.95,.22),('keys / deadbolt','sfx/prepared/door-lock.wav',44.85,.28),('door swing','sfx/prepared/minimarket-door-creak-outside.wav',46.2,.15),('fall','sfx/prepared/body-fall.wav',51.87,.2),('rewind','sfx/prepared/tension-rise.wav',54.79,.15),('towel unfold','sfx/prepared/coat-shift.wav',63.85,.15),('chair placement','sfx/prepared/body-fall.wav',68.17,.09),('latch','sfx/prepared/door-lock.wav',76,.12),('approach left','sfx/prepared/shoe-left.wav',89.36,.18),('keys','sfx/prepared/door-lock.wav',90.26,.12),('return step','sfx/prepared/shoe-right.wav',97,.15),('return step','sfx/prepared/shoe-left.wav',98,.15),('return step','sfx/prepared/shoe-right.wav',99,.15),('hatch open','sfx/prepared/ep007-gate-open.wav',107.73,.16),('hatch close','sfx/prepared/ep007-gate-open.wav',112.65,.14),('departure step','sfx/prepared/shoe-left.wav',113.75,.12),('towel unfold','sfx/prepared/coat-shift.wav',121.8,.12),('chair placement','sfx/prepared/body-fall.wav',123.6,.1),('window swing','sfx/prepared/minimarket-door-creak-outside.wav',127.1,.12),('drum contact','sfx/prepared/metal-resonance.wav',130.85,.1),('escape step','sfx/prepared/shoe-right.wav',132.05,.14),('blackout sub','assets/001-kamar-terkunci/blackout-sub.wav',135.8,.15)]
m={'schemaVersion':2,'pipelineVersion':2,'id':'Skenario01KamarTerkunci','fps':30,'duration':duration,'captions':'captions.json','openingTitle':'KAMAR INI TERKUNCI','narration':{'asset':'assets/001-kamar-terkunci/narration-prepared.mp3','at':0,'duration':4627,'gain':1},'art':{'styleId':'urban-silhouette-noir','rasterAssets':{s['plate']:'urban-silhouette-noir' for s in scenes}},'script':{'format':'decision-consequence','engine':'branch-rewind','wordCount':248,'hook':{'at':0,'line':'Kamu dikunci di kamar. Salah gerak, tamat.'},'ending':{'at':starts[22],'twistAt':starts[23],'payoff':'Kabur melalui tong dan gang.'}},'tensionRamp':{'startSec':mapsec(133),'endSec':mapsec(135.8),'extraScale':.01,'vignetteStrength':.1},'beds':[{'name':n,'asset':'sfx/prepared/night-air.wav','at':mapframe(round(t*30)),'duration':mapframe(round((t+d)*30))-mapframe(round(t*30)),'gain':0.035,'fadeIn':6,'fadeOut':6,'loop':True} for n,t,d in [('room tone before reset',0,58.5),('room tone after reset',60.7,45),('room tone after hatch silence',107.8,27.8)]],'scenes':scenes,'soundCues':[{'name':n,'asset':asset,'at':mapframe(round(t*30)),'gain':g,'maxSeconds':.4 if n=='rewind' else None} for n,asset,t,g in cues],'blackoutFrame':mapframe(4074),'rewindFrame':1644,'timingInsertions':[{'atFrame':at,'durationFrames':n} for at,n in insertions],'notes':'ASR word timings approximate; locked image defects and static action limitations remain open.'}
m['audioPolish']={'roomToneDuck':{'bedName':'room tone after reset','startSec':70,'endSec':118,'gainDb':-5,'fadeSec':0.25}}
m['soundMix']={'asset':'assets/001-kamar-terkunci/mix-master.wav'}
(p/'manifest.json').write_text(json.dumps(m,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
w=ts['words']; merged=[]
for x in w:
 if merged and ((merged[-1]['word'].lower()=='di' and x['word'].lower()=='kunci') or x['word'].startswith('-')):
  merged[-1]['word']+=x['word']; merged[-1]['end']=x['end']
 else: merged.append(x.copy())
w=merged
fixes={'Diangintip.':'Dia ngintip.','serat.':'seret.','ramik,':'keramik,','cendela,':'jendela,','mirunya':'birunya','kota':'kotak','ketong,':'ke tong,'}
for x in w: x['word']=fixes.get(x['word'],x['word'])
beats=[]; group=[]
def flush():
 global group
 if not group:return
 pieces=[]
 for x in group:
  for v in x['word'].split(): pieces.append({'text':v.upper(),'color':'white'})
 beats.append({'startMs':round(group[0]['start']*1000),'endMs':round(group[-1]['end']*1000),'timestampMs':None,'confidence':None,'words':pieces})
 group=[]
for x in w:
 cnt=sum(len(y['word'].split()) for y in group)
 if group and (cnt+len(x['word'].split())>4 or x['start']-group[-1]['end']>.2 or x['chunk']!=group[-1]['chunk']): flush()
 group.append(x)
flush(); beats.append({'startMs':8500,'endMs':10400,'timestampMs':None,'confidence':None,'speaker':'PENCULIK','words':[{'text':x,'color':'yellow'} for x in ['JANGAN','GESER','APA','PUN.']]}); beats.sort(key=lambda x:x['startMs'])
for beat in beats:
 beat['startMs']=round(mapsec(beat['startMs']/1000)*1000); beat['endMs']=round(mapsec(beat['endMs']/1000)*1000)
(p/'captions.json').write_text(json.dumps(beats,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
