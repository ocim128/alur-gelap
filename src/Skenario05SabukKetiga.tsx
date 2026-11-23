import {AbsoluteFill, Easing, Img, interpolate, staticFile} from 'remotion';
import {StudioV2Player, type StudioV2OverlayContext} from './StudioV2Player';
import {ImpactMicroShake, SilhouetteAtmosphereLayer} from './components/StudioV2';
import manifest from '../episodes/005-sabuk-ketiga/manifest.json';
import captions from '../episodes/005-sabuk-ketiga/captions.json';

const t = manifest.timing;
const Plate = ({frame, scene}: StudioV2OverlayContext) => frame >= t.joltFrame ? <AbsoluteFill style={{transform:`scale(${interpolate(frame,[t.joltFrame,t.joltFrame+3],[1,1.12],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}) translateX(${frame<t.joltFrame+9?14*Math.sin((frame-t.joltFrame)*2.6)*(1-(frame-t.joltFrame)/9):0}px)`}}><Img src={staticFile(scene.plate)} style={{width:'100%',height:'100%',objectFit:'cover'}} /></AbsoluteFill> : null;
const Overlay = ({frame, fps, scene}: StudioV2OverlayContext) => {
 const beacon=.08+.06*(1+Math.sin(frame/fps*2*Math.PI/2.8))/2;
 const glow=.025+.025*(1+Math.sin(frame*.23))/2;
 const callout=scene.id==='P05' && frame>=t.buckleTickFrame ? 'TELAT 1 KETUKAN' : scene.id==='P06' ? 'RADIO DESIS' : scene.id==='P17' && frame>=t.releaseClickFrame ? 'SABUK KETIGA: TERBUKA' : scene.id==='P19' && frame>=t.impact19Frame ? 'SABUK KETIGA: KOSONG' : '';
 const ramp=interpolate(frame,[Math.round(manifest.tensionRamp.startSec*fps),t.joltFrame],[0,.30],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 return <>
  <SilhouetteAtmosphereLayer grainOpacity={.012} grainSeed="sabuk-ketiga" />
  {frame<t.joltFrame && <AbsoluteFill style={{background:'radial-gradient(ellipse at 90% 20%, #d52b36, transparent 32%)',opacity:beacon,pointerEvents:'none'}} />}
  {scene.id<'P20' && <AbsoluteFill style={{background:'radial-gradient(ellipse at 50% 76%, #56c9e6, transparent 40%)',opacity:glow,pointerEvents:'none'}} />}
  {['P02','P07','P19','P22','P24'].includes(scene.id) && <AbsoluteFill style={{background:`radial-gradient(ellipse at ${50+10*Math.sin(frame/fps*.12)}% 35%, rgba(175,200,205,.08), transparent 55%)`,pointerEvents:'none'}} />}
  {ramp>0 && <AbsoluteFill style={{boxShadow:`inset 0 0 250px 90px rgba(0,0,0,${ramp})`}} />}
  {frame>=t.joltFrame && frame<t.joltFrame+2 && <AbsoluteFill style={{background:'#fff',opacity:.45}} />}
  {frame<Math.round(1.8*fps) && <div style={{position:'absolute',top:'19%',left:'10%',width:'80%',textAlign:'center',font:'900 54px Arial, sans-serif',color:'white',textShadow:'0 4px 9px black'}}>TIGA SABUK TERPASANG</div>}
  {callout && <div style={{position:'absolute',top:'63%',left:'10%',width:'80%',textAlign:'center',font:'900 45px Arial, sans-serif',color:'#ffdb51',textShadow:'0 3px 8px black'}}>{callout}</div>}
  {scene.id==='P09' && frame>=Math.round(65.6*fps) && frame<Math.round(68.1*fps) && <div style={{position:'absolute',top:'69%',left:'10%',width:'80%',textAlign:'center',font:'900 38px Arial, sans-serif',color:'#ffdb51',textShadow:'0 3px 8px black'}}>COPILOT</div>}
 </>;
};
const plateMotion = ({frame, fps, scene}: StudioV2OverlayContext) => {
 if (scene.id === 'P18') {
  const progress = interpolate(frame, [t.bankRollStartFrame, t.bankRollPeakFrame], [0, 1], {extrapolateLeft:'clamp', extrapolateRight:'clamp', easing:Easing.inOut(Easing.cubic)});
  const angle = 14 * progress;
  // Let the approved plate rotate without the earlier severe overscan crop.
  // Its soft backing uses the same plate and fills the exposed corners.
  return `scale(${1 - .12 * progress}) rotate(${angle}deg) translateX(${-40 * progress}px)`;
 }
 return scene.id < 'P20' ? `rotate(${1.4 * Math.sin(frame / fps * .6)}deg)` : '';
};
const Backdrop = ({scene}: StudioV2OverlayContext) => scene.id === 'P18' ? <AbsoluteFill style={{overflow:'hidden'}}>
  <Img src={staticFile(scene.plate)} style={{width:'100%',height:'100%',objectFit:'cover',transform:'scale(1.12)',filter:'blur(48px) brightness(.55)'}} />
</AbsoluteFill> : null;
const featherPlate = ({frame,scene}: StudioV2OverlayContext) => {
 if (scene.id !== 'P18' || frame <= t.bankRollStartFrame) return {};
 const progress=interpolate(frame,[t.bankRollStartFrame,t.bankRollPeakFrame],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const edge=10*progress;
 return {maskImage:`linear-gradient(to right, transparent, black ${edge}%, black ${100-edge}%, transparent), linear-gradient(to bottom, transparent, black ${edge}%, black ${100-edge}%, transparent)`, maskComposite:'intersect' as const};
};
export const Skenario05SabukKetiga = () => <ImpactMicroShake contactFrame={t.impact11Frame}><ImpactMicroShake contactFrame={t.impact19Frame}><StudioV2Player manifest={manifest} captions={captions} plateBackdrop={Backdrop} plateOverlay={Plate} overlay={Overlay} plateTransform={plateMotion} plateStyle={featherPlate} /></ImpactMicroShake></ImpactMicroShake>;
