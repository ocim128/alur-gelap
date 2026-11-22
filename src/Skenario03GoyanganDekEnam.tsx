import {AbsoluteFill} from 'remotion';
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
