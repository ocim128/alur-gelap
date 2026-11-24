import {interpolate, useCurrentFrame} from 'remotion';
import {V3_CHROME_REGIONS, V3_CRITICAL_REGIONS, V3_FONT_SIZES, V3_THEME} from '../layout.mjs';
import type {CallEventV3} from '../types';

export type CallScreenProps = {
  event: CallEventV3;
};

export function CallScreen({event}: CallScreenProps) {
  const frame = useCurrentFrame();
  const local = frame - event.at;
  if (local < 0 || local >= event.durationFrames) return null;

  const fadeIn = interpolate(local, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fadeOut = interpolate(local, [Math.max(8, event.durationFrames - 8), event.durationFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = Math.min(fadeIn, fadeOut);

  const ringPhase = (local % 36) / 36;
  const ringScale = 1 + ringPhase * 0.45;
  const ringOpacity = event.status === 'incoming' ? (1 - ringPhase) * 0.65 : 0;

  const statusLabel =
    event.subtitle ??
    (event.status === 'incoming'
      ? 'Panggilan masuk…'
      : event.status === 'missed'
        ? 'Panggilan tak terjawab'
        : 'Panggilan berakhir');

  const isMissed = event.status === 'missed';
  const initial = (event.caller.trim()[0] ?? '?').toUpperCase();
  const statusHeight = V3_CHROME_REGIONS.statusBar.height;
  const box = V3_CRITICAL_REGIONS.callContent;

  return (
    <div
      data-v3="call-screen"
      data-event-id={event.id}
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, #131826 0%, #090C12 100%)',
        opacity,
        zIndex: 40,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: box.x,
          top: box.y - statusHeight,
          width: box.width,
          height: box.height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '90px 44px 70px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
          <div style={{position: 'relative', width: 210, height: 210, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {ringOpacity > 0 && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: `4px solid ${V3_THEME.accent}`,
                  opacity: ringOpacity,
                  transform: `scale(${ringScale.toFixed(3)})`,
                }}
              />
            )}
            <div
              style={{
                width: 190,
                height: 190,
                borderRadius: '50%',
                backgroundColor: '#232B3E',
                border: `3px solid ${isMissed ? V3_THEME.danger : V3_THEME.accent}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: V3_THEME.textPrimary,
                fontSize: 80,
                fontWeight: 700,
              }}
            >
              {initial}
            </div>
          </div>

          <div
            style={{
              color: V3_THEME.textPrimary,
              fontSize: V3_FONT_SIZES.callCaller,
              fontWeight: 700,
              textAlign: 'center',
            }}
          >
            {event.caller}
          </div>

          <div
            style={{
              color: isMissed ? V3_THEME.danger : V3_THEME.textSecondary,
              fontSize: V3_FONT_SIZES.callSubtitle,
              fontWeight: 500,
              textAlign: 'center',
            }}
          >
            {statusLabel}
          </div>
        </div>

        <div style={{display: 'flex', alignItems: 'center', gap: 140}}>
          <div
            style={{
              width: 112,
              height: 112,
              borderRadius: '50%',
              backgroundColor: V3_THEME.danger,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="46" height="46" viewBox="0 0 46 46" aria-hidden="true">
              <rect x="8" y="20" width="30" height="7" rx="3.5" fill="#fff" />
            </svg>
          </div>

          {event.status === 'incoming' && (
            <div
              style={{
                width: 112,
                height: 112,
                borderRadius: '50%',
                backgroundColor: V3_THEME.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="46" height="46" viewBox="0 0 46 46" aria-hidden="true">
                <circle cx="23" cy="23" r="11" fill="none" stroke="#0C0F16" strokeWidth="5" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
