import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {V3_FONT_SIZES, V3_THEME} from '../layout.mjs';
import type {SystemEventV3} from '../types';

export type SystemMessageProps = {
  event: SystemEventV3;
};

export function SystemMessage({event}: SystemMessageProps) {
  const frame = useCurrentFrame();
  const local = frame - event.at;
  if (local < 0) return null;

  const entrance =
    event.at === 0
      ? 1
      : interpolate(local, [0, 8], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.quad),
        });

  return (
    <div
      data-v3="system-message"
      data-event-id={event.id}
      style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        opacity: entrance,
        transform: `translateY(${((1 - entrance) * 10).toFixed(1)}px)`,
      }}
    >
      <div
        style={{
          maxWidth: 800,
          padding: '12px 26px',
          borderRadius: 18,
          backgroundColor: V3_THEME.systemPillBg,
          border: `1px solid ${V3_THEME.headerBorder}`,
          color: V3_THEME.textSecondary,
          fontSize: V3_FONT_SIZES.systemText,
          fontWeight: 500,
          textAlign: 'center',
          lineHeight: 1.22,
        }}
      >
        {event.text}
      </div>
    </div>
  );
}
