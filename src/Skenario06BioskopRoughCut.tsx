import {Audio} from '@remotion/media';
import {AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import cut from '../episodes/006-bioskop-tanpa-pintu/rough-cut.json';

export const bioskopRoughCutDuration = cut.duration;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const roomInk = '#272a31';
const light = '#fff2bb';

const Ranto = ({x, y, angle = 0}: {x: number; y: number; angle?: number}) => (
  <g transform={`translate(${x} ${y}) rotate(${angle})`} fill="#10141b" stroke="#b6b2a1" strokeWidth="3">
    <path d="M-22 0 Q-18 -28 0 -29 Q19 -28 23 0 L14 18 L19 46 H6 L0 21 L-7 46 H-19 L-14 18 Z" />
    <circle cy="-44" r="15" />
    <path d="M-17 -48 Q-15 -67 2 -65 Q18 -63 19 -48 Z" />
  </g>
);

const Door = ({x, y, side = false, open = false}: {x: number; y: number; side?: boolean; open?: boolean}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x="-57" y="-50" width="114" height="110" fill={open ? '#0b0d14' : side ? '#41545b' : '#87373e'} stroke="#b7ac9a" strokeWidth="4" />
    <path d="M-39 15H39" stroke="#ded0b9" strokeWidth="5" />
    <text textAnchor="middle" y="-22" fill="#fff2dc" fontSize="16" fontWeight="700">{side ? 'DARURAT' : 'KELUAR'}</text>
  </g>
);

const Auditorium = ({panel, progress}: {panel: number; progress: number}) => {
  const dark = panel === 11;
  const sideBranch = panel === 8 || panel === 9;
  const rowCount = panel === 1 ? 20 + Math.floor(progress * 6) : panel >= 2 && panel <= 7 ? 26 : panel === 16 ? 20 + Math.floor(progress * 6) : 20;
  const shift = panel === 9 ? interpolate(progress, [.17, .34], [0, 133], clamp) : 0;
  const surge = dark ? interpolate(progress, [.18, .8], [0, 125], clamp) : 0;
  const atScreen = panel >= 17;
  const fall = interpolate(progress, [panel === 9 ? .68 : .65, .92], [0, 165], clamp);
  const walk = interpolate(progress, [.06, .94], [1135, 435], clamp);
  const tear = panel === 18 ? interpolate(progress, [.51, 1], [6, 45], clamp) : 6;

  return <>
    <rect x="48" y="270" width="444" height="940" rx="16" fill={dark ? '#261c26' : roomInk} stroke="#63616b" strokeWidth="4" />
    <rect x="72" y="292" width="396" height="95" rx="8" fill="#685652" />
    <path d="M104 307H436V347Q372 359 299 346T104 348Z" fill={dark ? '#554759' : '#dcd4b9'} />
    {!dark && <ellipse cx="270" cy="326" rx="49" ry="15" fill={light} />}
    {(panel === 4 || panel === 13 || atScreen) && <>
      <path d="M122 351Q166 368 217 355" fill="none" stroke={light} strokeWidth="5" />
      <path d={`M146 346l${tear} -14h6l${tear} 14Z`} fill={panel === 18 ? '#97c6d4' : '#152028'} stroke={light} strokeWidth="3" />
    </>}
    {Array.from({length: rowCount}, (_, i) => {
      const y = 409 + i * (sideBranch ? 23 : 25) + shift + surge;
      const marked = i === 0 && (panel === 9 || (panel === 8 && progress >= .61));
      return <g key={i}>
        <rect x="102" y={y} width="127" height="12" rx="4" fill={marked ? light : dark ? '#79434b' : '#666876'} />
        <rect x="310" y={y} width="127" height="12" rx="4" fill={dark ? '#79434b' : '#666876'} />
        {marked && <path d={`M176 ${y - 3}h20l36 -15v31l-36 -10h-20Z`} fill="white" />}
      </g>;
    })}
    <path d="M69 1150H471M69 1162H471" stroke="#a09586" strokeWidth="4" />
    {(panel === 1 || panel === 3 || panel === 10 || panel === 12 || panel === 14) && <>
      <rect x="250" y="1100" width="50" height="40" rx="5" fill="#96949b" />
      <circle cx="276" cy="1111" r="8" fill={light} />
    </>}
    {(panel === 2 || panel === 5 || panel === 6 || panel === 7) && <Door x={270} y={1075} open={panel === 7 && progress >= .08} />}
    {(panel === 5 || sideBranch) && <Door x={75} y={813} side open={panel === 9 && progress >= .17} />}
    {panel === 5 && <text x="270" y="996" textAnchor="middle" fill={light} fontSize="24">01:50</text>}
    {panel === 2 && <path d="M345 1026h23v7h-23zm0 -3a7 7 0 1 0 0 14a7 7 0 1 0 0 -14" fill={light} />}
    {panel === 7 && <Ranto x={270} y={997 - fall} angle={fall / 4} />}
    {panel === 8 && <Ranto x={251} y={440} />}
    {panel === 9 && <Ranto x={127 + fall * .38} y={809 + fall} angle={fall / 3} />}
    {panel === 6 && <Ranto x={270} y={998} />}
    {panel === 11 && <Ranto x={270} y={Math.min(1140, 1030 + surge)} />}
    {panel === 15 && <Ranto x={270} y={walk} />}
    {panel === 16 && <Ranto x={270} y={435} />}
    {atScreen && <Ranto x={270} y={interpolate(progress, [0, 1], [405, 360], clamp)} />}
    {[1, 2, 3, 5, 10, 12, 14].includes(panel) && <Ranto x={panel === 2 ? 192 : 331} y={1110} />}
  </>;
};

const Exterior = ({panel, progress}: {panel: number; progress: number}) => {
  const gate = panel !== 22;
  const shutter = panel >= 23 ? interpolate(progress, [0, 1], panel === 23 ? [0, 60] : [60, 260], clamp) : 0;
  return <>
    <rect x="30" y="375" width="480" height="660" rx="7" fill="#4a4445" stroke="#776d66" strokeWidth="4" />
    {Array.from({length: 13}, (_, i) => <path key={i} d={`M32 ${405 + i * 47}H508`} stroke="#6b605a" strokeWidth="3" />)}
    {gate && <>
      <rect x="307" y="586" width="153" height="326" fill="#a3c4d0" stroke="#242d38" strokeWidth="5" />
      <rect x="309" y="589" width="149" height={102 + shutter} fill="#626b71" />
    </>}
    {panel === 19 && <path d="M76 420V866H199M116 420V816H194" fill="none" stroke="#b0927b" strokeWidth="8" />}
    {panel === 22 && <text x="270" y="535" textAnchor="middle" fill="#ccb6a0" fontSize="35" letterSpacing="5">BIOSKOP</text>}
    {panel !== 20 && <Ranto x={panel === 21 ? 382 : 225} y={panel === 21 ? 891 : 940} angle={panel === 21 ? 57 : 0} />}
  </>;
};

export const Skenario06BioskopRoughCut = () => {
  const frame = useCurrentFrame();
  const shot = cut.shots.find(({start, end}) => frame >= start && frame < end);
  const rewind = cut.rewinds.some((start) => frame >= start && frame < start + 12);
  const progress = shot ? (frame - shot.start) / (shot.end - shot.start) : 0;
  const caption = shot?.captions.find(({from, to}) => frame >= from && frame < to);

  return <AbsoluteFill style={{background: '#10131b', color: 'white', fontFamily: 'Arial, sans-serif'}}>
    <Audio src={staticFile('assets/006-bioskop-rough-cut/scratch.mp3')} />
    {cut.rewinds.map((start) => <Sequence key={start} from={start} durationInFrames={12}>
      <Audio src={staticFile('sfx/shared/tape-snap-rewind.wav')} volume={0.55} />
    </Sequence>)}
    {shot && <svg viewBox="0 0 540 1440" width="100%" height="100%" aria-hidden="true">
      {shot.panel < 19 ? <Auditorium panel={shot.panel} progress={progress} /> : <Exterior panel={shot.panel} progress={progress} />}
    </svg>}
    {rewind && <AbsoluteFill style={{background: 'repeating-linear-gradient(#51363c, #51363c 18px, #151620 18px, #151620 40px)'}} />}
    {frame >= cut.duration - 9 && <AbsoluteFill style={{background: 'black'}} />}
    {caption && <div style={{position: 'absolute', left: '8%', right: '8%', bottom: '8%', textAlign: 'center', fontSize: 48, fontWeight: 700, textShadow: '0 2px 7px black'}}>
      {caption.text}
    </div>}
  </AbsoluteFill>;
};
