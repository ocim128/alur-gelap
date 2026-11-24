import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {V3_CHROME_REGIONS, V3_CRITICAL_REGIONS, V3_FONT_SIZES, V3_THEME} from '../layout.mjs';
import type {NotificationEventV3} from '../types';

export type NotificationProps = {
  event: NotificationEventV3;
};

export function Notification({event}: NotificationProps) {
  const frame = useCurrentFrame();
  const local = frame - event.at;
  if (local < 0 || local >= event.durationFrames) return null;

  const slideIn = interpolate(local, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const slideOut = interpolate(local, [Math.max(12, event.durationFrames - 10), event.durationFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const visibility = Math.min(slideIn, slideOut);

  const statusHeight = V3_CHROME_REGIONS.statusBar.height;
  const box = V3_CRITICAL_REGIONS.notificationBanner;

  return (
    <div
      data-v3="notification-banner"
      data-event-id={event.id}
      style={{
        position: 'absolute',
        left: box.x,
        top: box.y - statusHeight,
        width: box.width,
        minHeight: 170,
        padding: '22px 28px',
        borderRadius: 24,
        backgroundColor: 'rgba(21, 27, 40, 0.97)',
        border: `2px solid ${V3_THEME.warning}`,
        boxShadow: '0 18px 44px rgba(0, 0, 0, 0.72)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        boxSizing: 'border-box',
        opacity: visibility,
        transform: `translateY(${((1 - visibility) * -36).toFixed(1)}px)`,
        zIndex: 45,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16}}>
        <span
          style={{
            color: V3_THEME.textPrimary,
            fontSize: V3_FONT_SIZES.notificationTitle,
            fontWeight: 700,
            lineHeight: 1.15,
          }}
        >
          {event.title}
        </span>
        <span
          style={{
            color: V3_THEME.warning,
            fontSize: V3_FONT_SIZES.notificationBody,
            fontWeight: 600,
          }}
        >
          {event.appName ?? 'Pesan'}
        </span>
      </div>
      <div
        style={{
          color: V3_THEME.textSecondary,
          fontSize: V3_FONT_SIZES.notificationBody,
          lineHeight: 1.24,
        }}
      >
        {event.body}
      </div>
    </div>
  );
}
