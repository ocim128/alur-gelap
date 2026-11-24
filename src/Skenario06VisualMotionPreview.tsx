import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {Skenario06VisualMotionStoryboard} from './Skenario06VisualMotionStoryboard';

// Storyboard frames only: not the Investigator candidate or production edit map.
const segments = [
  {name: 'BARISAN BERTAMBAH', sourceStart: 0, sourceEnd: 524},
  {name: 'PINTU DAN JATUH', sourceStart: 1120, sourceEnd: 2418},
  {name: 'DORONG DAN ROBEK', sourceStart: 3694, sourceEnd: 4243},
  {name: 'PINTU BESI DAN JOLT', sourceStart: 4693, sourceEnd: 4868},
] as const;

export const motionPreviewDuration = segments.reduce((sum, s) => sum + s.sourceEnd - s.sourceStart, 0);

const Segment = ({sourceStart, name}: {sourceStart: number; name: string}) => {
  const frame = useCurrentFrame();
  const originalFrame = sourceStart + frame;
  // Scratch-only jolt; this is neither the final mix nor a timed export approval.
  const jolt = sourceStart === 4693 && originalFrame >= 4828 && originalFrame < 4840;
  const shake = jolt ? (originalFrame % 2 === 0 ? 5 : -5) : 0;
  return <AbsoluteFill style={{background: '#10131b', overflow: 'hidden'}}>
    <AbsoluteFill style={{width: 1080, height: 1920, transform: `scale(.25) translate(${shake * 4}px,0)`, transformOrigin: 'top left'}}>
      <Sequence from={-sourceStart} durationInFrames={4868}>
        <Skenario06VisualMotionStoryboard />
      </Sequence>
    </AbsoluteFill>
    <div style={{position: 'absolute', top: 8, left: 8, right: 8, color: 'white', background: '#10131bed', padding: '5px 7px', fontFamily: 'Arial, sans-serif', fontSize: 10, fontWeight: 700}}>
      SKEMA GERAK · WAKTU SEMENTARA · {name}
    </div>
  </AbsoluteFill>;
};

export const Skenario06VisualMotionPreview = () => {
  let cursor = 0;
  return <AbsoluteFill>{segments.map((s) => {
    const from = cursor;
    const length = s.sourceEnd - s.sourceStart;
    cursor += length;
    return <Sequence key={s.name} from={from} durationInFrames={length}>
      <Segment sourceStart={s.sourceStart} name={s.name} />
    </Sequence>;
  })}</AbsoluteFill>;
};
