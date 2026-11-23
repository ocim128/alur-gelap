import {AbsoluteFill, Img, interpolate, staticFile} from 'remotion';
import {StudioV2Player, type StudioV2OverlayContext} from './StudioV2Player';
import {ImpactMicroShake, SilhouetteAtmosphereLayer} from './components/StudioV2';
import manifest from '../episodes/004-tangan-pilot-kemarin/manifest.json';
import captions from '../episodes/004-tangan-pilot-kemarin/captions.json';

const path = 'assets/004-tangan-pilot-kemarin/owner-approved-exception/';
const Plate = ({frame, scene}: StudioV2OverlayContext) => <>
  {scene.id === 'P09' && frame >= manifest.timing.impact2Frame && <AbsoluteFill style={{filter:'brightness(.70)'}}>
    <Img src={staticFile(path + 'panel-09-reaction.webp')} style={{width:'100%',height:'100%',objectFit:'cover'}} />
  </AbsoluteFill>}
  {frame >= manifest.timing.joltFrame && <AbsoluteFill>
    <Img src={staticFile(path + 'panel-final-jolt.webp')} style={{width:'100%',height:'100%',objectFit:'cover'}} />
  </AbsoluteFill>}
</>;

const Atmosphere = ({frame, fps, scene}: StudioV2OverlayContext) => {
  const events = [28, manifest.scenes[2].at+18, manifest.timing.impact2Frame, manifest.timing.joltFrame];
  const starts = events.filter(x => frame >= x && frame < x+((x === manifest.timing.joltFrame) ? 2 : 8));
  const flicker = scene.id === 'P06' && [0,1,5,12].includes((frame - scene.at) % 41);
  const ramp = interpolate(frame,[Math.round(149.26*fps),manifest.timing.joltFrame],[0,.30],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <>
    <SilhouetteAtmosphereLayer grainOpacity={.014} grainSeed="pilot-kemarin" />
    {flicker && <AbsoluteFill style={{backgroundColor:'#000',opacity:.28}} />}
    {ramp > 0 && <AbsoluteFill style={{boxShadow:`inset 0 0 250px 90px rgba(0,0,0,${ramp})`}} />}
    {starts.map(start => <AbsoluteFill key={start} style={{opacity:start===manifest.timing.joltFrame?.52:.46,
      background:`linear-gradient(105deg, transparent ${Math.max(-30,(frame-start)*18-35)}%, #df132b ${(frame-start)*18}%, transparent ${(frame-start)*18+28}%)`}} />)}
    {frame < Math.round(1.8*fps) && <div style={{position:'absolute',top:'19%',left:'10%',width:'80%',textAlign:'center',font:'900 54px Arial, sans-serif',color:'white',textShadow:'0 4px 9px black'}}>TANGAN PILOT KEMARIN</div>}
    {frame >= Math.round(24.9*fps) && frame < Math.round(25.615*fps) && <div style={{position:'absolute',top:'65%',width:'100%',textAlign:'center',font:'900 44px Arial, sans-serif',color:'#ffd842',textShadow:'0 3px 8px black'}}>COPILOT<br/>GANTIAN, BANG?</div>}
  </>;
};

export const Skenario04TanganPilotKemarin = () => <ImpactMicroShake contactFrame={manifest.timing.impact1Frame}>
  <ImpactMicroShake contactFrame={manifest.timing.impact2Frame}><ImpactMicroShake contactFrame={manifest.timing.impact3Frame}>
    <StudioV2Player manifest={manifest} captions={captions} plateOverlay={Plate} overlay={Atmosphere} />
  </ImpactMicroShake></ImpactMicroShake>
</ImpactMicroShake>;
