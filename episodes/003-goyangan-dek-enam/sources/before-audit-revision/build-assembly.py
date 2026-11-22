"""Build Scenario 03 manifest and captions from the owner-accepted source timings."""
import json, math, sys
from pathlib import Path
sys.dont_write_bytecode=True
sys.path.insert(0,str(Path(__file__).resolve().parents[2]/'scripts'))
from caption_helpers import assign_word_to_scene, semantic_color
p=Path(__file__).parent
fps=30; sr=48000; duration=4740
# Scene cuts follow the locked sidecar, rounded to the nearest frame.
starts=[0,5.54,11.86,16.34,25.78,31.42,40.28,49.38,57.38,64.66,70.8,77.4,87.32,91.4,96.22,100.38,107.6,111.24,113.52,121.1,125.32,134.5,142.76,148.2]
starts=[round(v*fps) for v in starts]
timing={f'p{i+1:02}StartFrame':v for i,v in enumerate(starts)}
timing.update({'rewindFrame':2112,'rewindFrames':12,'postRewindSilenceFrames':[2274,2322],'postPinSilenceFrames':[4064,4124], 'blackoutSilenceStartFrame':4615,'blackoutSilenceStartSampleOffset':800,'postPinSilenceStartFrame':4064,'postPinSilenceStartSampleOffset':-320,'postPinSilenceEndFrame':4124,'postPinSilenceEndSampleOffset':-320, 'blackoutFrame':4620, 'blackoutSubFrame':4620})
# Event sample offsets make source onsets match the measured word timings even when a word is between frames.
def cue(name,sec):
 f=round(sec*fps); timing[name+'Frame']=f; timing[name+'SampleOffset']=round(sec*sr)-round(f*sr/fps)
for name,sec in [('shipGroan',7.38),('vestSway',22.92),('entityChoke',130.58),('chain',13.4),('waterSetup',16.34),('pulleySetup',28.86),('approachStep1',41.7),('approachStep2',42.4),('vest',51.32),('splash',58.5),('vortex',60.36),('cableSwing',85.84),('waterReturn',104.3),('lever',111.24),('cableRelease',113.52),('impact',117.28),('pinInsert',123.28),('pinLock',125.32),('survivorBreath',138.12),('sit',144.54)]:cue(name,sec)
scenes=[]; visible={1,7,8,9,10,11,15,16,17,18,20,22,23}
for i,at in enumerate(starts):
 n=i+1; end=starts[i+1] if i<23 else duration; plate=f'assets/003-goyangan-dek-enam/master-batch-01/p{n:02}.webp'
 a=-6 if i%2==0 else 6; length=end-at
 # Reframe metadata samples the same continuous linear camera move used by the player.
 reframes=[{'at':j,'duration':min(30,length-j),'scale':round(1.12+.04*min(j+30,length)/length,5),'x':round(a-2*a*min(j+30,length)/length,3),'y':0} for j in range(0,length,70)]
 scenes.append({'id':f'P{n:02}','name':f'Panel {n:02}','at':at,'atCue':f'p{n:02}StartFrame','plate':plate,'camera':{'from':{'scale':1.12,'x':a,'y':0},'to':{'scale':1.16,'x':-a,'y':0}},'characters':{'mode':'baked'},'hud':[],'editorial':{'protagonist':'reaction' if n==23 else ('visible' if n in visible else 'absent'),'purpose':'threat-proximity','evidence':f'Owner-approved selected P{n:02}; see image audit for caveats.'},'reframes':reframes})
manifest={'schemaVersion':2,'pipelineVersion':2,'id':'Skenario03GoyanganDekEnam','fps':fps,'duration':duration,'captions':'captions.json','openingTitle':'GOYANGAN DEK ENAM','narration':{'asset':'assets/003-goyangan-dek-enam/narration-prepared.mp3','at':0,'duration':math.ceil(151.035*fps),'gain':1},'art':{'styleId':'urban-silhouette-noir','rasterAssets':{s['plate']:'urban-silhouette-noir' for s in scenes}},'script':{'format':'decision-consequence','engine':'branch-rewind','wordCount':263,'hook':{'at':0,'line':'Kapalnya terus oleng, tapi bayangan di depanmu berdiri tegak.'},'ending':{'at':starts[22],'twistAt':starts[23],'payoff':'Survivor waits for dawn after trapping the entity.'}},'tensionRamp':{'startSec':151,'endSec':153.85,'extraScale':.01,'vignetteStrength':.1},'beds':[],'scenes':scenes,'soundMix':{'asset':'assets/003-goyangan-dek-enam/assembly-mix.wav','gain':1,'sampleRate':sr},'timing':timing,'notes':'Current selected plates approved for assembly by owner after image-stage fail; physical-contact, cable and pin continuity findings remain documented.'}
(p/'manifest.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
# Correct only tokenization and punctuation, without altering accepted audio or timestamps.
source=json.loads((p/'narration-timestamps.json').read_text(encoding='utf-8')); words=[]
for original in source['words']:
 item=dict(original); token=item['word']
 if words and words[-1]['word'].endswith('-'):
  words[-1]['word']+=token; words[-1]['end']=item['end']
 elif words and words[-1]['word'].lower()=='di' and token.lower() in ('gembok','telan'):
  words[-1]['word']+=token; words[-1]['end']=item['end']
 else: words.append(item)
cuts=starts+[duration]; segments=[assign_word_to_scene(w,cuts,fps) for w in words]
overrides={'sekoci':'yellow','tuas':'yellow','rem':'yellow','pengunci':'yellow','genangan':'yellow','berayun':'yellow','puncak':'yellow','brak':'red','pusaran':'red','tamat':'red','sosok':'red','rantai':'yellow','klik':'yellow','lompat':'red'}
beats=[];group=[]
def flush():
 if not group:return
 parts=[]
 for w in group:
  for token in w['word'].split():
   parts.append({'text':token.upper(),'color':semantic_color(token,overrides),'startMs':w['startFrame']*1000/fps,'endMs':w['endFrame']*1000/fps})
 beats.append({'startMs':group[0]['startFrame']*1000/fps,'endMs':group[-1]['endFrame']*1000/fps,'speaker':'NARATOR','words':parts})
 group.clear()
for w in segments:
 length=sum(len(x['word'].split()) for x in group)
 if group and (length+len(w['word'].split())>4 or w['startFrame']-group[-1]['endFrame']>6 or w['sceneFrame']!=group[-1]['sceneFrame'] or group[-1]['word'].endswith(('.', '!', '?')) or w['chunk']!=group[-1]['chunk']):flush()
 group.append(w)
flush();(p/'captions.json').write_text(json.dumps(beats,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
print(f'{len(scenes)} selected panels; {len(beats)} caption beats; {duration/fps:.3f} seconds')
