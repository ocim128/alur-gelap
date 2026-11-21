import {AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {SilhouetteAtmosphereLayer, LiveDigitalClockHUD, SlidingHatchOverlay, UnderDoorShoeShadow, ImpactMicroShake, BranchRewindTransition} from './components/StudioV2';
import {SpeakerCaption} from './components/SpeakerCaption';
import manifest from '../episodes/001-kamar-terkunci/manifest.json';
import captions from '../episodes/001-kamar-terkunci/captions.json';

export const Skenario01KamarTerkunci = () => {
 const frame=useCurrentFrame();
 const scenes=manifest.scenes; const index=scenes.reduce((last,s,i)=>s.at<=frame?i:last,0); const scene=scenes[Math.max(index,0)]; const next=scenes[index+1]?.at ?? manifest.duration; const seconds=frame/30;
 const mapFrame=(f:number)=>f+manifest.timingInsertions.reduce((sum,gap)=>sum+(f>=gap.atFrame?gap.durationFrames:0),0);
 const caption=captions.find(c=>seconds*1000>=c.startMs && seconds*1000<c.endMs);
 const plate=<AbsoluteFill style={{overflow:'hidden'}}><Img src={staticFile(scene.plate)} style={{width:'100%',height:'100%',objectFit:'fill'}} /></AbsoluteFill>;
 const hatch=scene.id==='P02'?{x:.19,y:.416,width:.155,height:.035}:scene.id==='P03'?{x:.242,y:.447,width:.222,height:.052}:scene.id==='P19'?{x:.16,y:.407,width:.20,height:.047}:null;
 return <AbsoluteFill style={{backgroundColor:'#000'}}>
 <Audio src={staticFile('assets/001-kamar-terkunci/mix-master.wav')} />
 {frame<manifest.blackoutFrame && <>
 <AbsoluteFill style={{transform:`scale(${interpolate(frame,[scene.at,next],[1,1.015],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})})`}}>{scene.id==='P07'?<ImpactMicroShake contactFrame={Math.round(35.67*30)} jitterPx={5} pushPx={8}>{plate}</ImpactMicroShake>:plate}
 {hatch && <SlidingHatchOverlay box={hatch} initialOpen={0} transitions={scene.id==='P02'?[{at:165,duration:6,from:0,to:1},{at:198,duration:6,from:1,to:0}]:scene.id==='P03'?[{at:Math.round(6.95*30),duration:8,from:0,to:1},{at:Math.round(10.65*30),duration:8,from:1,to:0}]:[{at:mapFrame(Math.round(107.73*30)),duration:8,from:0,to:1},{at:mapFrame(Math.round(112.65*30)),duration:8,from:1,to:0}]} />}
 {scene.id==='P17' && <UnderDoorShoeShadow box={{x:195/936,y:1136/1664,width:173/936,height:4/1664}} startFrame={mapFrame(2910)} stopFrame={mapFrame(3000)} />}</AbsoluteFill>
 {['P02','P03','P07','P10','P11','P19'].includes(scene.id) && <LiveDigitalClockHUD initialSeconds={8*3600+57*60} jumps={[{atFrame:212,seconds:9*3600},{atFrame:871,seconds:9*3600+110}]} rewind={{startFrame:1644,durationFrames:12,fromSeconds:9*3600+136,toSeconds:9*3600+110}} warning={scene.id==='P07'||scene.id==='P10'} showSeconds={['P07','P10','P11'].includes(scene.id)} box={{x:.06,y:.16,width:.4,height:.05}} fontSize={48} />}
 <SilhouetteAtmosphereLayer grainOpacity={.025} grainSeed="kamar-pilot" />
 <BranchRewindTransition startFrame={1644} durationFrames={12} intensity={.8} />
 {frame<54 && <div style={{position:'absolute',top:'19%',width:'100%',textAlign:'center',font:'bold 72px Arial',color:'white',textShadow:'0 3px 8px black'}}>KAMAR INI TERKUNCI</div>}
 {caption && <SpeakerCaption speaker={caption.speaker} text={caption.words.map(w=>w.text).join(' ')} />}
 </>}
 </AbsoluteFill>;
};
