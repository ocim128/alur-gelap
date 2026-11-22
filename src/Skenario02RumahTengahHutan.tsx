import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Audio} from '@remotion/media';
import {BranchRewindTransition, ImpactMicroShake} from './components/StudioV2';
import manifest from '../episodes/002-rumah-tengah-hutan/manifest.json';
import captions from '../episodes/002-rumah-tengah-hutan/captions.json';

const outdoor = new Set(['P01', 'P02', 'P03', 'P04', 'P21', 'P22', 'P23', 'P24']);

// The selected plates contain painted bolts. Keep the relevant window dark
// except for the actual two-frame flash, so it has a definite onset.
const windowMasks: Record<string, string> = {
  P05: '0,20 37,26 37,55 0,54', P17: '0,11 42,17 42,53 0,48',
  P18: '0,16 32,20 32,55 0,53', P19: '0,14 24,22 24,56 0,55',
};

export const Skenario02RumahTengahHutan = () => {
  const frame = useCurrentFrame();
  const sceneIndex = manifest.scenes.reduce((last, scene, i) => scene.at <= frame ? i : last, 0);
  const scene = manifest.scenes[sceneIndex];
  const end = manifest.scenes[sceneIndex + 1]?.at ?? manifest.duration;
  const caption = captions.find(c => frame * 1000 / 30 >= c.startMs && frame * 1000 / 30 < c.endMs);
  const captionText = caption?.words.map(w => w.text).join(' ') ?? '';
  const t = manifest.timing;
  const isFlash = [t.setupFlashFrame, t.climaxFlashFrame, t.climaxThunderFrame]
    .some(at => frame >= at && frame < at + 3); // last flash is the impact jolt
  const isImpact = scene.id === 'P08' || scene.id === 'P19';
  const contact = scene.id === 'P08' ? 1867 : t.climaxThunderFrame;
  const progress = interpolate(frame, [scene.at, end], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const zoom = 1.035 + .04 * progress;
  const pan = (sceneIndex % 2 === 0 ? 1 : -1) * (-10 + 20 * progress);
  const plate = <AbsoluteFill style={{overflow: 'hidden'}}>
    <AbsoluteFill style={{transform: `translate(${pan}px, ${scene.id === 'P15' ? 230 : 0}px) scale(${zoom * (isImpact ? 1.19 : scene.id === 'P15' ? 1.25 : 1)})`,
      transformOrigin: isImpact ? '50% 12%' : 'center'}}>
    <Img src={staticFile(scene.plate)} style={{width: '100%', height: '100%', objectFit: 'fill'}} />
    {windowMasks[scene.id] && !isFlash && <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{position:'absolute', width:'100%', height:'100%'}}>
      <polygon points={windowMasks[scene.id]} fill="#03080c" opacity="0.94" />
    </svg>}
    </AbsoluteFill>
  </AbsoluteFill>;
  return <AbsoluteFill style={{backgroundColor: '#000', overflow: 'hidden'}}>
    <Audio src={staticFile('assets/002-rumah-tengah-hutan/mix-polish.wav')} />
    {frame < t.blackoutFrame && <>
      {isImpact ? <ImpactMicroShake contactFrame={contact} jitterPx={7} pushPx={8} durationFrames={10}>{plate}</ImpactMicroShake> : plate}
      {outdoor.has(scene.id) && <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden',
        clipPath: scene.id === 'P22' ? 'polygon(0 17%, 15% 23%, 15% 65%, 0 67%)' : undefined}}>
        <div style={{position:'absolute', inset:'-20%', opacity:.20, transform:`translateY(${(frame * 19) % 135}px)`,
          background:'repeating-linear-gradient(103deg, transparent 0px, transparent 36px, rgba(211,232,246,.7) 37px, transparent 39px)'}} />
        <div style={{position:'absolute', inset:'-15%', opacity:.18, transform:`translateX(${Math.sin(frame / 75) * 35}px)`,
          background:'radial-gradient(ellipse at 30% 90%, #a6c3d3 0%, transparent 55%), radial-gradient(ellipse at 75% 65%, #7794a8 0%, transparent 48%)'}} />
      </AbsoluteFill>}
      <BranchRewindTransition startFrame={t.rewindFrame} durationFrames={t.rewindFrames} intensity={.85} seed="forest-rewind" />
      {isFlash && <AbsoluteFill style={{backgroundColor:'rgba(255,255,255,.85)', pointerEvents:'none'}} />}
      {frame < 54 && <div style={{position:'absolute', top:'19%', left:'12.5%', width:'75%', textAlign:'center',
        font:'900 54px Arial, sans-serif', color:'white', textShadow:'0 4px 9px black'}}>PONDOK TENGAH BADAI</div>}
      {caption && <div style={{position:'absolute', top:'77%', left:scene.id === 'P15' ? '0%' : '5%', width:scene.id === 'P15' ? '80%' : '90%', textAlign:'center',
        whiteSpace:'nowrap', fontFamily:'Arial, sans-serif', fontWeight:900,
        fontSize:Math.min(59, 1350 / captionText.length) * (scene.id === 'P15' ? .8 : 1), color:'white',
        textShadow:'-3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000'}}>{captionText}</div>}
    </>}
  </AbsoluteFill>;
};
