import type {CSSProperties, ReactNode} from "react";
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame, useVideoConfig} from "remotion";

/** Normalized coordinates in the composition, from 0 to 1. */
export type NormalizedBox = {x: number; y: number; width: number; height: number};
export type FrameTransition = {at: number; duration: number; from: number; to: number};

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const boxStyle = (box: NormalizedBox): CSSProperties => ({
  position: "absolute", left: `${box.x * 100}%`, top: `${box.y * 100}%`,
  width: `${box.width * 100}%`, height: `${box.height * 100}%`,
});

/** Absolute frame transitions must be sorted and non-overlapping. */
const transitionValue = (frame: number, initial: number, transitions: FrameTransition[]) =>
  transitions.reduce((value, t) => frame < t.at ? value : interpolate(
    frame, [t.at, t.at + Math.max(1, t.duration)], [t.from, t.to],
    {...clamp, easing: Easing.inOut(Easing.quad)},
  ), initial);

export type SilhouetteAtmosphereLayerProps = {
  grainOpacity?: number;
  grainSeed?: string;
  flicker?: {box: NormalizedBox; color: string; opacity?: number; strength?: number};
};

export function SilhouetteAtmosphereLayer({grainOpacity = 0.035, grainSeed = "noir", flicker}: SilhouetteAtmosphereLayerProps) {
  const frame = useCurrentFrame();
  const flickerAmount = flicker ? 1 - (flicker.strength ?? 0.2) * random(`${grainSeed}-light-${Math.floor(frame / 2)}`) : 0;
  return <AbsoluteFill style={{pointerEvents: "none", overflow: "hidden"}}>
    <svg aria-hidden="true" width="100%" height="100%" style={{position: "absolute", opacity: grainOpacity, mixBlendMode: "screen"}}>
      <filter id={`grain-${grainSeed.replace(/[^a-zA-Z0-9_-]/g, "-")}`}><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed={Math.floor(random(`${grainSeed}-${frame}`) * 10000)} /></filter>
      <rect width="100%" height="100%" filter={`url(#grain-${grainSeed.replace(/[^a-zA-Z0-9_-]/g, "-")})`} />
    </svg>
    {flicker && <div style={{...boxStyle(flicker.box), background: flicker.color, opacity: (flicker.opacity ?? 0.1) * flickerAmount, mixBlendMode: "screen"}} />}
  </AbsoluteFill>;
}

export type BranchRewindTransitionProps = {startFrame: number; durationFrames?: number; intensity?: number; seed?: string};

export function BranchRewindTransition({startFrame, durationFrames, intensity = 1, seed = "rewind"}: BranchRewindTransitionProps) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = Math.max(1, durationFrames ?? Math.round(0.4 * fps));
  const localFrame = frame - startFrame;
  if (localFrame < 0 || localFrame >= duration) return null;
  const phase = localFrame / duration;
  const opacity = Math.min(1, Math.max(0, intensity)) * Math.sin(Math.PI * phase);
  return <AbsoluteFill style={{pointerEvents: "none", overflow: "hidden", opacity}}>
    <AbsoluteFill style={{background: "repeating-linear-gradient(to bottom, rgba(220,235,245,.18) 0px, rgba(220,235,245,.18) 1px, transparent 1px, transparent 5px)", mixBlendMode: "screen"}} />
    {Array.from({length: 7}, (_, i) => <div key={i} style={{
      position: "absolute", left: `${random(`${seed}-x-${localFrame}-${i}`) * 12}%`,
      top: `${random(`${seed}-y-${localFrame}-${i}`) * 100}%`, width: "85%",
      height: `${2 + random(`${seed}-h-${localFrame}-${i}`) * 8}px`,
      background: i % 2 ? "rgba(240,245,255,.45)" : "rgba(210,40,35,.35)",
      translate: `${(random(`${seed}-shift-${localFrame}-${i}`) - .5) * 60}px 0px`,
    }} />)}
  </AbsoluteFill>;
}

export type ClockJump = {atFrame: number; seconds: number};
export type ClockRewind = {startFrame: number; durationFrames: number; fromSeconds: number; toSeconds: number};
export type LiveDigitalClockHUDProps = {
  initialSeconds: number;
  jumps?: ClockJump[];
  rewind?: ClockRewind;
  showSeconds?: boolean;
  warning?: boolean;
  box?: NormalizedBox;
  fontSize?: number;
};

export function LiveDigitalClockHUD({initialSeconds, jumps = [], rewind, showSeconds = false, warning = false, box, fontSize = 54}: LiveDigitalClockHUDProps) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ordered = [...jumps].sort((a, b) => a.atFrame - b.atFrame);
  const latest = ordered.filter(jump => jump.atFrame <= frame).at(-1);
  let seconds = latest ? latest.seconds + (frame - latest.atFrame) / fps : initialSeconds + frame / fps;
  if (rewind && frame >= rewind.startFrame && frame < rewind.startFrame + Math.max(1, rewind.durationFrames)) {
    seconds = rewind.durationFrames <= 1
      ? rewind.toSeconds
      : interpolate(frame, [rewind.startFrame, rewind.startFrame + rewind.durationFrames - 1], [rewind.fromSeconds, rewind.toSeconds], clamp);
  } else if (rewind && frame >= rewind.startFrame + Math.max(1, rewind.durationFrames) && (!latest || latest.atFrame < rewind.startFrame + Math.max(1, rewind.durationFrames))) {
    seconds = rewind.toSeconds + (frame - rewind.startFrame - Math.max(1, rewind.durationFrames)) / fps;
  }
  const clock = ((Math.floor(seconds) % 86400) + 86400) % 86400;
  const parts = [Math.floor(clock / 3600), Math.floor(clock / 60) % 60, ...(showSeconds ? [clock % 60] : [])].map(value => String(value).padStart(2, "0"));
  return <div style={{...(box ? boxStyle(box) : {position: "absolute", top: "15%", left: "8%"}), color: warning ? "#ff3333" : "#e7eff3", fontFamily: "monospace", fontWeight: 700, fontSize, textShadow: "0 2px 6px #000", fontVariantNumeric: "tabular-nums", pointerEvents: "none"}}>{parts.join(":")}</div>;
}

export type SlidingHatchOverlayProps = {
  box: NormalizedBox;
  initialOpen?: number;
  transitions: FrameTransition[];
  direction?: "left" | "right" | "up" | "down";
  color?: string;
};

export function SlidingHatchOverlay({box, initialOpen = 0, transitions, direction = "right", color = "#07080B"}: SlidingHatchOverlayProps) {
  const frame = useCurrentFrame();
  const open = Math.max(0, Math.min(1, transitionValue(frame, initialOpen, transitions)));
  const displacement = open * 100 * (direction === "left" || direction === "up" ? -1 : 1);
  return <div style={{...boxStyle(box), overflow: "hidden", pointerEvents: "none"}}>
    <div style={{width: "100%", height: "100%", background: color, translate: direction === "left" || direction === "right" ? `${displacement}% 0%` : `0% ${displacement}%`}} />
  </div>;
}

export type UnderDoorShoeShadowProps = {box: NormalizedBox; startFrame: number; stopFrame: number; fromX?: number; color?: string};

export function UnderDoorShoeShadow({box, startFrame, stopFrame, fromX = -0.3, color = "#07080B"}: UnderDoorShoeShadowProps) {
  const frame = useCurrentFrame();
  if (frame < startFrame) return null;
  const x = interpolate(frame, [startFrame, Math.max(startFrame + 1, stopFrame)], [fromX, 0.5], {...clamp, easing: Easing.out(Easing.quad)});
  return <div style={{...boxStyle(box), overflow: "hidden", pointerEvents: "none"}}>
    <div style={{position: "absolute", left: `${x * 100}%`, top: 0, width: "38%", height: "100%", translate: "-50% 0", display: "flex", gap: "8%"}}>
      <div style={{width: "46%", height: "100%", background: color}} /><div style={{width: "46%", height: "100%", background: color}} />
    </div>
  </div>;
}

export type ImpactMicroShakeProps = {children: ReactNode; contactFrame: number; durationFrames?: number; jitterPx?: number; pushPx?: number};

export function ImpactMicroShake({children, contactFrame, durationFrames = 10, jitterPx = 5, pushPx = 8}: ImpactMicroShakeProps) {
  const frame = useCurrentFrame();
  const elapsed = frame - contactFrame;
  const decay = elapsed >= 0 && elapsed < durationFrames ? 1 - elapsed / Math.max(1, durationFrames) : 0;
  const x = decay * (pushPx + Math.sin(elapsed * 2.6) * jitterPx);
  return <AbsoluteFill style={{translate: `${x}px 0px`}}>{children}</AbsoluteFill>;
}
