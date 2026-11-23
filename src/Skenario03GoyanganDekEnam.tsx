import {AbsoluteFill, staticFile} from 'remotion';
import {StudioV2Player, type StudioV2OverlayContext} from './StudioV2Player';
import {FlashOverlay, ImpactMicroShake, SilhouetteAtmosphereLayer} from './components/StudioV2';
import {DeckGravityClues} from './components/DeckGravityClues';
import manifest from '../episodes/003-goyangan-dek-enam/manifest.json';
import captions from '../episodes/003-goyangan-dek-enam/captions.json';

const UnderwayAtmosphere = ({frame, fps, scene}: StudioV2OverlayContext) => {
  const outdoor = scene.id !== 'P09' && scene.id !== 'P10';
  return <>
    {outdoor && <AbsoluteFill style={{pointerEvents:'none', overflow:'hidden'}}>
      <div style={{position:'absolute', inset:'-20%', opacity:.12, transform:`translateY(${(frame * 16) % 140}px)`,
        background:'repeating-linear-gradient(103deg, transparent 0px, transparent 37px, rgba(213,230,239,.72) 38px, transparent 40px)'}} />
      <div style={{position:'absolute', inset:'-15%', opacity:.10, transform:`translateX(${Math.sin(frame / 67) * 32}px)`,
        background:'radial-gradient(ellipse at 30% 85%, #9cb3c0 0%, transparent 55%), radial-gradient(ellipse at 78% 65%, #728c9e 0%, transparent 48%)'}} />
    </AbsoluteFill>}
    <SilhouetteAtmosphereLayer grainOpacity={.018} grainSeed="dek-enam" />
    <FlashOverlay startFrame={manifest.timing.impactFrame} durationFrames={3} opacity={.55} />
    {frame < Math.round(1.8 * fps) && <div style={{position:'absolute', top:'19%', left:'12.5%', width:'75%', textAlign:'center',
      font:'900 54px Arial, sans-serif', color:'white', textShadow:'0 4px 9px black'}}>GOYANGAN DEK ENAM</div>}
  </>;
};

export const Skenario03GoyanganDekEnam = () => <ImpactMicroShake contactFrame={manifest.timing.impactFrame} durationFrames={10} jitterPx={5} pushPx={8}>
  <StudioV2Player manifest={manifest} captions={captions} plateTransform={({frame, fps, scene}) => scene.id === 'P13' ? '' : `rotate(${2.4 * Math.sin(2 * Math.PI * frame / (fps * 5))}deg)`} plateOverlay={DeckGravityClues} overlay={UnderwayAtmosphere} />
</ImpactMicroShake>;

// Non-final inspection cut using Agent 03's incomplete motion candidates. The
// original composition and selected plates stay intact; these candidates must
// not be represented as a passed image handoff or a continuous boat swing.
const coverage = 'assets/003-goyangan-dek-enam/motion-coverage-attempt-01/';
const testManifest = {...manifest, scenes: manifest.scenes.map(scene => ({...scene,
  plate: scene.id === 'P12' ? `${coverage}p12-clean.png` : scene.id === 'P13' ? `${coverage}p13-clean.png` : scene.plate,
}))};
const MotionCandidateOverlay = (context: StudioV2OverlayContext) => {
  const {scene, frame, fps} = context;
  const roll = 2.4 * Math.sin(2 * Math.PI * frame / (fps * 5));
  if (scene.id === 'P12') return <svg viewBox="0 0 941 1672" preserveAspectRatio="none" style={{position:'absolute',width:'100%',height:'100%'}}>
    {/* Fused jackets: approximate group placement and pivot, not verified registration. */}
    <g transform={`rotate(${6 * Math.sin(2 * Math.PI * frame / (fps * 5))} 375 585)`}><image href={staticFile(`${coverage}p12-vests.png`)} x="182" y="465" width="405" height="719" /></g>
  </svg>;
  if (scene.id === 'P13') return <svg viewBox="0 0 941 1672" preserveAspectRatio="none" style={{position:'absolute',width:'100%',height:'100%'}}>
    {/* Counter-roll keeps the candidate upright; its exact silhouette/foot registration is not verified. */}
    <g transform={`rotate(${-roll} 470.5 836)`}><image href={staticFile(`${coverage}p13-entity.png`)} x="177" y="503" width="451" height="802" /></g>
  </svg>;
  if (scene.id === 'P18' && frame >= 3446) return <img src={staticFile(`${coverage}p18-travel-retry.png`)} style={{position:'absolute',width:'100%',height:'100%',objectFit:'cover'}} />;
  return <DeckGravityClues {...context} />;
};

export const Skenario03MotionCoverageTest = () => <ImpactMicroShake contactFrame={manifest.timing.impactFrame} durationFrames={10} jitterPx={5} pushPx={8}>
  <StudioV2Player manifest={testManifest} captions={captions} plateTransform={({frame, fps}) => `rotate(${2.4 * Math.sin(2 * Math.PI * frame / (fps * 5))}deg)`} plateOverlay={MotionCandidateOverlay} overlay={UnderwayAtmosphere} />
</ImpactMicroShake>;
