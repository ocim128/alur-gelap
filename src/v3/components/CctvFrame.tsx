import {Easing, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {formatHmsClock, parseInWorldClock} from '../clock.mjs';
import {
  V3_CHROME_REGIONS,
  V3_CRITICAL_REGIONS,
  V3_FONT_SIZES,
  V3_OVERLAY_FADE_FRAMES,
  V3_THEME,
} from '../layout.mjs';
import type {CctvEventV3} from '../types';

export type CctvFrameProps = {
  event: CctvEventV3;
};

function advanceTimestamp(label: string, elapsedSeconds: number): string {
  const parsed = parseInWorldClock(label);
  if (!parsed || !parsed.hasSeconds) return label;
  return formatHmsClock(parsed.seconds + Math.floor(elapsedSeconds));
}

/** Full-bleed CCTV security view with critical REC/camera/timestamp labels positioned strictly inside V3_CRITICAL_REGIONS.cctvContent. */
export function CctvFrame({event}: CctvFrameProps) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const local = frame - event.at;
  if (local < 0 || local >= event.durationFrames) return null;

  const fadeInFrames = V3_OVERLAY_FADE_FRAMES.cctvIn;
  const fadeOutFrames = V3_OVERLAY_FADE_FRAMES.cctvOut;
  const fadeIn =
    fadeInFrames > 0
      ? interpolate(local, [0, fadeInFrames], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
      : 1;
  const fadeOut =
    fadeOutFrames > 0
      ? interpolate(local, [Math.max(fadeInFrames, event.durationFrames - fadeOutFrames), event.durationFrames], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 1;
  const opacity = Math.min(fadeIn, fadeOut);

  const jitterX = (random(`cctv-x-${frame}`) - 0.5) * 4;
  const jitterY = (random(`cctv-y-${frame}`) - 0.5) * 3;
  const recVisible = Math.floor(local / 15) % 2 === 0;

  let scale = 1.03;
  let panX = 0;
  let panY = 0;
  if (event.zoom) {
    const zStart = event.zoom.atOffset;
    const zDur = event.zoom.durationFrames ?? Math.max(20, event.durationFrames - zStart);
    scale = interpolate(local, [zStart, zStart + zDur], [1.03, event.zoom.scale], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.quad),
    });
    panX = (0.5 - event.zoom.x) * (scale - 1) * 100;
    panY = (0.5 - event.zoom.y) * (scale - 1) * 100;
  }

  const liveTimestamp = advanceTimestamp(event.timestampLabel, local / fps);
  const grainSeed = Math.floor(random(`cctv-grain-${frame}`) * 9999);
  const statusHeight = V3_CHROME_REGIONS.statusBar.height;
  const box = V3_CRITICAL_REGIONS.cctvContent;

  return (
    <div
      data-v3="cctv-frame"
      data-event-id={event.id}
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#050807',
        opacity,
        zIndex: 38,
        overflow: 'hidden',
      }}
    >
      {/* Full-bleed CCTV video image */}
      <div
        style={{
          position: 'absolute',
          inset: -6,
          transform: `translate(${jitterX.toFixed(2)}px, ${jitterY.toFixed(2)}px)`,
        }}
      >
        <Img
          src={staticFile(event.src)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'saturate(0.18) contrast(1.18) brightness(0.92)',
            transform: `translate(${panX.toFixed(2)}%, ${panY.toFixed(2)}%) scale(${scale.toFixed(4)})`,
            transformOrigin: 'center center',
          }}
        />
      </div>

      {/* Deterministic CCTV noise */}
      <svg
        aria-hidden="true"
        width="100%"
        height="100%"
        style={{position: 'absolute', inset: 0, opacity: 0.14, mixBlendMode: 'screen', pointerEvents: 'none'}}
      >
        <filter id={`cctv-noise-${event.id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={grainSeed} />
        </filter>
        <rect width="100%" height="100%" filter={`url(#cctv-noise-${event.id})`} />
      </svg>

      {/* Scanlines + vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'repeating-linear-gradient(to bottom, rgba(0,0,0,0.28) 0px, rgba(0,0,0,0.28) 2px, transparent 2px, transparent 6px), radial-gradient(ellipse at center, transparent 48%, rgba(0,0,0,0.72) 100%)',
        }}
      />

      {/* Critical HUD labels strictly inside V3_CRITICAL_REGIONS.cctvContent */}
      <div
        style={{
          position: 'absolute',
          left: box.x,
          top: box.y - statusHeight,
          width: box.width,
          height: box.height,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '16px 20px',
          boxSizing: 'border-box',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontFamily: 'Consolas, Menlo, monospace',
            color: '#E2F5EA',
            textShadow: '0 2px 8px rgba(0,0,0,0.9)',
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              backgroundColor: recVisible ? V3_THEME.danger : 'rgba(239,68,68,0.2)',
            }}
          />
          <span style={{fontSize: V3_FONT_SIZES.cctvLabel, fontWeight: 700}}>{event.cameraLabel}</span>
        </div>

        <div
          style={{
            alignSelf: 'flex-start',
            padding: '8px 18px',
            borderRadius: 10,
            backgroundColor: 'rgba(5, 8, 7, 0.78)',
            fontFamily: 'Consolas, Menlo, monospace',
            fontVariantNumeric: 'tabular-nums',
            color: '#E2F5EA',
            fontSize: V3_FONT_SIZES.cctvTimestamp,
            fontWeight: 700,
            letterSpacing: 1.5,
          }}
        >
          {liveTimestamp}
        </div>
      </div>
    </div>
  );
}
