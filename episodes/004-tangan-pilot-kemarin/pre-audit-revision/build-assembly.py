"""Build the Scenario 04 assembly using frame-aligned, non-destructive gap inserts."""
import json, math, sys, wave
from pathlib import Path
import numpy as np
sys.dont_write_bytecode=True
sys.path.insert(0,str(Path(__file__).resolve().parents[2]/'scripts'))
from caption_helpers import assign_word_to_scene, semantic_color

p=Path(__file__).resolve().parent; root=p.parents[1]; fps=30; sr=48000
base=root/'public/assets/004-tangan-pilot-kemarin'
with wave.open(str(p/'narration-prepared.wav'),'rb') as f:
 assert f.getframerate()==sr and f.getnchannels()==1 and f.getsampwidth()==2
 source=np.frombuffer(f.readframes(f.getnframes()),dtype='<i2').copy()
# These insert points lie strictly inside the producer's digital-zero samples.
# No original sample is deleted or modified. Each insert adds a breathing margin.
inserts=[(43.50,.04),(58.60,.20),(74.20,.80)]
pieces=[]; cursor=0
for at,seconds in inserts:
 s=round(at*sr); assert np.all(source[s-100:s+100]==0)
 pieces.extend([source[cursor:s],np.zeros(round(seconds*sr),dtype='<i2')]); cursor=s
pieces.append(source[cursor:]); shifted=np.concatenate(pieces)
def shift(t):return t+sum(d for at,d in inserts if t>=at)
def frm(t):return math.floor(t*fps+.5)
rewinds=[{'startFrame':1298,'endFrame':1310}, {'startFrame':1755,'endFrame':1767}, {'startFrame':2214,'endFrame':2226}]
silence=[2226,2274]
for a,b in [(x['startFrame'],x['endFrame']) for x in rewinds]+[tuple(silence)]:
 assert not np.any(shifted[round(a*sr/fps):round(b*sr/fps)]), (a,b)
out=base/'narration-assembly-padded.wav'
with wave.open(str(out),'wb') as f:
 f.setnchannels(1);f.setsampwidth(2);f.setframerate(sr);f.writeframes(shifted.tobytes())

# Original scene anchors correspond to the relevant spoken line, not brief timings.
orig=[0,2.70,11.0,15.2,21.02,28.72,36.70,43.84,50.46,58.90,66.22,75.30,80.86,86.22,91.46,97.48,103.02,107.90,114.90,122.26,129.10,135.84,139.76,148.22]
starts=[frm(shift(x)) for x in orig]
starts[7]=rewinds[0]['endFrame']; starts[9]=rewinds[1]['endFrame']; starts[11]=rewinds[2]['endFrame']
duration=frm(shift(152)+1.5); jolt=frm(shift(152)+.16); black=duration-8
timing={f'p{i+1:02}StartFrame':v for i,v in enumerate(starts)}
timing.update({'branchRewinds':rewinds,'dreadSilenceFrames':silence,'joltFrame':jolt,'blackoutFrame':black,
 'impact1Frame':frm(shift(42.08)),'impact2Frame':frm(shift(56.48)), 'impact3Frame':frm(shift(72.02))})
scenes=[]; visible={1,2,3,5,6,8,9,10,12,13,14,15,16,18,20,21,23}
for i,at in enumerate(starts):
 n=i+1; end=starts[i+1] if i<23 else duration; length=end-at; a=-6 if i%2==0 else 6
 plate=f'assets/004-tangan-pilot-kemarin/owner-approved-exception/panel-{n:02}.webp'
 reframes=[{'at':j,'duration':min(30,length-j),'scale':round(1.025+.04*min(j+30,length)/length,5),'x':round(a-2*a*min(j+30,length)/length,3),'y':0} for j in range(0,length,70)]
 scenes.append({'id':f'P{n:02}','name':f'Panel {n:02}','at':at,'atCue':f'p{n:02}StartFrame','plate':plate,
 'camera':{'from':{'scale':1.025,'x':a,'y':0},'to':{'scale':1.065,'x':-a,'y':0}},
 'characters':{'mode':'baked'},'hud':[],'editorial':{'protagonist':'reaction' if n==23 else ('visible' if n in visible else 'absent'),'purpose':'threat-proximity','evidence':'Approved exception plate; see image audit for limitations.'},'reframes':reframes})
manifest={'schemaVersion':2,'pipelineVersion':2,'id':'Skenario04TanganPilotKemarin','fps':fps,'duration':duration,'captions':'captions.json','openingTitle':'TANGAN PILOT KEMARIN',
 'narration':{'asset':'assets/004-tangan-pilot-kemarin/narration-assembly-padded.wav','at':0,'duration':len(shifted)//1600,'gain':1},
 'art':{'styleId':'urban-silhouette-noir','rasterAssets':{s['plate']:'urban-silhouette-noir' for s in scenes}},
 'script':{'format':'decision-consequence','engine':'triple-branch-rewind','wordCount':262,'hook':{'at':0,'line':'Tangan di tuas bukan tanganmu.'},'ending':{'at':starts[22],'twistAt':starts[23],'payoff':'The checked map marks the completed route.'}},
 'beds':[],'tensionRamp':{'startSec':shift(148.22),'endSec':shift(152),'extraScale':.01,'vignetteStrength':.1},'scenes':scenes,
 'soundMix':{'asset':'assets/004-tangan-pilot-kemarin/assembly-mix.wav','gain':1,'sampleRate':sr},'timing':timing,
 'notes':'Approved image exceptions retained; see sources/prompts.md and assembly handoff.'}
(p/'manifest.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
side=json.loads((p/'narration-timestamps.json').read_text(encoding='utf-8'))
for w in side['words']:
 w['start']=round(shift(w['start']),5); w['end']=round(shift(w['end']),5)
for c in side['chunks']:
 for key in ('start','end'):
  if key in c:c[key]=round(shift(c[key]),5)
side['master']='narration-assembly-padded.wav';side['durationSec']=len(shifted)/sr
side['note']='Assembly derivative only; source unchanged. Word times inherit approximate producer alignment plus exact insertion deltas.'
(p/'assembly-timestamps.json').write_text(json.dumps(side,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
(p/'assembly-edit-map.json').write_text(json.dumps({'sampleRate':sr,'source':'narration-prepared.wav','output':str(out.relative_to(root)),
 'insertions':[{'sourceSec':a,'durationSec':d,'samples':round(d*sr)} for a,d in inserts], 'cumulativeShiftSec':sum(d for _,d in inserts),
 'branchRewinds':rewinds,'dreadSilenceFrames':silence,'noOriginalSamplesRemoved':True,'zeroNarrationWindowsChecked':True},indent=2)+'\n',encoding='utf-8')
# Keep timing estimated, normalize known ASR spelling and join divided words.
corrections={'dituas':'di tuas','dituas,':'di tuas,','bertulin':'betulin','status,':'statis.','center.':'senter.','gunuh.':'gunung.','Arh':'Arah','benar':'bener','-benar':'-bener','Didalam':'Di dalam','natural':'netral','napa':'napas','selega.':'lega.','pertanya,':'petanya,','ali,':'alih,','begu':'beku'}
words=[]
for w in side['words']:
 w=dict(w); w['word']=corrections.get(w['word'],w['word'])
 if words and words[-1]['word'].lower()=='co' and w['word'].lower()=='pilot':
  words[-1]['word']='copilot';words[-1]['end']=w['end']
 elif words and words[-1]['word'].lower()=='tangan' and w['word'].lower()=='mau' and 97 < w['start']-1.04 < 99:
  words[-1]['word']='tanganmu';words[-1]['end']=w['end']
 elif words and w['word'].startswith('-'):
  words[-1]['word']+=w['word'];words[-1]['end']=w['end']
 else:words.append(w)
segments=[assign_word_to_scene(w,starts+[duration],fps) for w in words]
beats=[];group=[]
def flush():
 if not group:return
 parts=[{'text':token.upper(),'color':semantic_color(token,{'celah':'yellow','tuas':'yellow','tamat':'red','gunung':'red'}),'startMs':w['startFrame']*1000/fps,'endMs':w['endFrame']*1000/fps} for w in group for token in w['word'].split()]
 beats.append({'startMs':group[0]['startFrame']*1000/fps,'endMs':group[-1]['endFrame']*1000/fps,'speaker':'NARATOR','words':parts}); group.clear()
for w in segments:
 if group and (sum(len(x['word'].split()) for x in group)+len(w['word'].split())>4 or w['startFrame']-group[-1]['endFrame']>6 or w['sceneFrame']!=group[-1]['sceneFrame'] or group[-1]['word'].endswith(('.', '!', '?')) or w['chunk']!=group[-1]['chunk']):flush()
 group.append(w)
flush();(p/'captions.json').write_text(json.dumps(beats,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
print('duration',duration/fps,'rewinds',rewinds,'silence',silence,'inserted',sum(d for _,d in inserts))
