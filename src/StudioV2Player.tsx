import {useMemo, type ReactNode} from 'react';
import {Audio} from '@remotion/media';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {SpeakerCaption} from './components/SpeakerCaption';
import {BranchRewindTransition} from './components/StudioV2';
import {sceneAtFrame, splitCaptionsAtCuts, validateScenes} from './studio-v2-timeline';
import type {StudioCaption, StudioScene} from './studio-v2-timeline';
import {studioTimingError} from './studio-v2-timing.mjs';

export type StudioV2Manifest = {
  duration: number;
  scenes: StudioScene[];
  soundMix: {asset: string; gain?: number};
  timing: {rewindFrame?: number; rewindFrames?: number; blackoutFrame: number};
};

export type StudioV2OverlayContext = {frame: number; fps: number; scene: StudioScene; sceneIndex: number; sceneEndFrame: number};
export type StudioV2PlayerProps = {
  manifest: StudioV2Manifest;
  captions: StudioCaption[];
  /** Drawn inside the moving plate, for spatially locked props and masks. */
  plateOverlay?: (context: StudioV2OverlayContext) => ReactNode;
  /** Optional episode-specific motion composed with the plate camera. */
  plateTransform?: (context: StudioV2OverlayContext) => string;
  /** Drawn above the plate, for screen-space atmosphere, flashes or titles. */
  overlay?: (context: StudioV2OverlayContext) => ReactNode;
};

export function StudioV2Player({manifest, captions, plateOverlay, plateTransform, overlay}: StudioV2PlayerProps) {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const splitCaptions = useMemo(() => splitCaptionsAtCuts(captions, manifest.scenes, fps), [captions, manifest.scenes, fps]);
  validateScenes(manifest.scenes, manifest.duration);
  if (manifest.duration !== durationInFrames) throw new Error('Player manifest duration must match the composition');
  const timingError = studioTimingError(manifest.timing, manifest.duration, fps);
  if (timingError) throw new Error(timingError);
  const namedTiming = manifest.timing as Record<string, number | undefined>;
  for (const item of manifest.scenes) {
    if (item.atCue && item.at !== namedTiming[item.atCue]) throw new Error(`${item.id}: scene start differs from named cue ${item.atCue}`);
  }
  const {scene, index, endFrame} = sceneAtFrame(manifest.scenes, manifest.duration, frame);
  const context = {frame, fps, scene, sceneIndex: index, sceneEndFrame: endFrame};
  const progress = interpolate(frame, [scene.at, Math.max(scene.at + 1, endFrame - 1)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const from = scene.camera?.from ?? {scale: 1.035, x: index % 2 ? 10 : -10, y: 0};
  const requestedTo = scene.camera?.to ?? {scale: 1.075, x: -from.x, y: 0};
  const to = from.scale === requestedTo.scale && from.x === requestedTo.x && from.y === requestedTo.y ? {...requestedTo, scale: requestedTo.scale + 0.04} : requestedTo;
  const scale = from.scale + (to.scale - from.scale) * progress;
  const x = from.x + (to.x - from.x) * progress;
  const y = from.y + (to.y - from.y) * progress;
  const timeMs = frame * 1000 / fps;
  const caption = splitCaptions.find(cue => timeMs >= cue.startMs && timeMs < cue.endMs);

  return <AbsoluteFill style={{backgroundColor: '#000', overflow: 'hidden'}}>
    <Audio src={staticFile(manifest.soundMix.asset)} volume={manifest.soundMix.gain ?? 1} />
    {frame < manifest.timing.blackoutFrame && <>
      <AbsoluteFill style={{overflow: 'hidden'}}><AbsoluteFill style={{transform: `translate(${x}px, ${y}px) scale(${scale}) ${plateTransform?.(context) ?? ''}`}}>
        <Img src={staticFile(scene.plate)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        {plateOverlay?.(context)}
      </AbsoluteFill></AbsoluteFill>
      {overlay?.(context)}
      {manifest.timing.rewindFrame !== undefined && <BranchRewindTransition startFrame={manifest.timing.rewindFrame} durationFrames={manifest.timing.rewindFrames} />}
      {caption && <SpeakerCaption speaker={caption.speaker} text={caption.words.map(word => word.text).join(' ')} words={caption.words} />}
    </>}
  </AbsoluteFill>;
}
