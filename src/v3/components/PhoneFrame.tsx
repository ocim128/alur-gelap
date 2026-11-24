import type {ReactNode} from 'react';
import {interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {formatStatusClock, phoneSecondsAtFrame} from '../clock.mjs';
import {V3_CHROME_REGIONS, V3_FONT_SIZES, V3_THEME} from '../layout.mjs';
import type {GlitchSpecV3} from '../types';

export type PhoneFrameProps = {
  startClock: string;
  startBattery?: number;
  endBattery?: number;
  glitches?: GlitchSpecV3[];
  children: ReactNode;
};

/** Full-bleed 1080x1920 smartphone shell with live real-time clock, draining battery, and optional glitch pass. */
export function PhoneFrame({
  startClock,
  startBattery = 34,
  endBattery = 28,
  glitches = [],
  children,
}: PhoneFrameProps) {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const clockLabel = formatStatusClock(phoneSecondsAtFrame(startClock, frame, fps));

  const battery = Math.max(
    1,
    Math.min(
      100,
      Math.round(
        interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [startBattery, endBattery], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
      ),
    ),
  );
  const lowBattery = battery <= 20;

  const activeGlitch = glitches.find((g) => frame >= g.at && frame < g.at + g.durationFrames);
  const glitchIntensity = activeGlitch ? (activeGlitch.intensity ?? 0.7) : 0;
  const shiftX = activeGlitch ? (random(`v3-gx-${frame}`) - 0.5) * 28 * glitchIntensity : 0;
  const shiftY = activeGlitch ? (random(`v3-gy-${frame}`) - 0.5) * 10 * glitchIntensity : 0;

  const box = V3_CHROME_REGIONS.canvas;
  const statusHeight = V3_CHROME_REGIONS.statusBar.height;

  return (
    <div
      data-v3="phone-frame"
      style={{
        position: 'absolute',
        left: box.x,
        top: box.y,
        width: box.width,
        height: box.height,
        backgroundColor: V3_THEME.phoneBg,
        overflow: 'hidden',
        transform: activeGlitch ? `translate(${shiftX.toFixed(1)}px, ${shiftY.toFixed(1)}px)` : undefined,
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
      }}
    >
      {/* Full-bleed top status bar */}
      <div
        data-v3="status-bar"
        style={{
          position: 'relative',
          height: statusHeight,
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: V3_THEME.statusBarBg,
          borderBottom: `1px solid ${V3_THEME.headerBorder}`,
          color: V3_THEME.textPrimary,
          fontSize: V3_FONT_SIZES.statusBar,
          fontWeight: 600,
          fontVariantNumeric: 'tabular-nums',
          zIndex: 20,
        }}
      >
        <span>{clockLabel}</span>

        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <svg width="38" height="28" viewBox="0 0 38 28" aria-hidden="true">
            <rect x="2" y="18" width="6" height="8" rx="1.5" fill={V3_THEME.textPrimary} />
            <rect x="12" y="13" width="6" height="13" rx="1.5" fill={V3_THEME.textPrimary} />
            <rect x="22" y="8" width="6" height="18" rx="1.5" fill={V3_THEME.textMuted} opacity="0.45" />
            <rect x="32" y="2" width="6" height="24" rx="1.5" fill={V3_THEME.textMuted} opacity="0.25" />
          </svg>

          <span style={{color: lowBattery ? V3_THEME.danger : V3_THEME.textPrimary}}>{battery}%</span>

          <div
            style={{
              width: 52,
              height: 26,
              borderRadius: 6,
              border: `2.5px solid ${lowBattery ? V3_THEME.danger : V3_THEME.textPrimary}`,
              padding: 3,
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: `${battery}%`,
                height: '100%',
                borderRadius: 2.5,
                backgroundColor: lowBattery ? V3_THEME.danger : V3_THEME.textPrimary,
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: -7,
                top: 6,
                width: 4,
                height: 10,
                borderRadius: '0 2px 2px 0',
                backgroundColor: lowBattery ? V3_THEME.danger : V3_THEME.textPrimary,
              }}
            />
          </div>
        </div>
      </div>

      {/* Main screen starts below decorative status chrome; its header reserves the top safe band. */}
      <div style={{position: 'relative', width: '100%', height: box.height - statusHeight, overflow: 'hidden'}}>
        {children}
      </div>

      {/* Optional frame-driven glitch tear */}
      {activeGlitch && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 55,
            background:
              'repeating-linear-gradient(to bottom, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 2px, transparent 2px, transparent 6px)',
          }}
        >
          {Array.from({length: 5}, (_, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: `${random(`v3-gl-${frame}-${idx}`) * 15}%`,
                top: `${random(`v3-gt-${frame}-${idx}`) * 92}%`,
                width: '82%',
                height: 4 + random(`v3-gh-${frame}-${idx}`) * 14,
                backgroundColor: idx % 2 === 0 ? 'rgba(167,139,250,0.34)' : 'rgba(239,68,68,0.28)',
                transform: `translateX(${((random(`v3-gs-${frame}-${idx}`) - 0.5) * 60 * glitchIntensity).toFixed(1)}px)`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
