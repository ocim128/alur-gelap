import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {isTanpaNamaCharacter, V3_FONT_SIZES, V3_TANPA_NAMA, V3_THEME} from '../layout.mjs';
import type {CharacterV3, MessageTicks, TextEventV3} from '../types';
import {TanpaNamaAvatar} from './TanpaNamaAvatar';

export type MessageBubbleProps = {
  event: TextEventV3;
  sender?: CharacterV3;
  isSelf?: boolean;
};

/**
 * Original read-receipt icon set for outgoing messages sent by the phone owner (isSelf):
 * - sent: hollow circle ring
 * - delivered: solid steel dot
 * - read: minimalist lavender eye icon
 */
export function ReadReceiptIcon({ticks}: {ticks?: MessageTicks}) {
  if (!ticks) return null;
  if (ticks === 'sent') {
    return (
      <svg width="28" height="24" viewBox="0 0 28 24" aria-label="sent" style={{flexShrink: 0}}>
        <circle cx="14" cy="12" r="7" fill="none" stroke={V3_THEME.textMuted} strokeWidth="2.8" />
      </svg>
    );
  }
  if (ticks === 'delivered') {
    return (
      <svg width="28" height="24" viewBox="0 0 28 24" aria-label="delivered" style={{flexShrink: 0}}>
        <circle cx="14" cy="12" r="7.5" fill={V3_THEME.textSecondary} />
      </svg>
    );
  }
  return (
    <svg width="32" height="24" viewBox="0 0 32 24" aria-label="read" style={{flexShrink: 0}}>
      <path
        d="M3 12C6.5 6.2 11 4 16 4C21 4 25.5 6.2 29 12C25.5 17.8 21 20 16 20C11 20 6.5 17.8 3 12Z"
        fill="none"
        stroke={V3_THEME.accent}
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="12" r="4.2" fill={V3_THEME.accent} />
    </svg>
  );
}

export function MessageBubble({event, sender, isSelf = false}: MessageBubbleProps) {
  const frame = useCurrentFrame();
  const local = frame - event.at;
  if (local < 0) return null;

  const entrance =
    event.at === 0
      ? 1
      : interpolate(local, [0, 8], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        });
  const isDeleted = event.deletedAt !== undefined && frame >= event.deletedAt;
  const isTanpaNama = !isSelf && isTanpaNamaCharacter(sender, event.from);
  const displayName = isTanpaNama
    ? V3_TANPA_NAMA.displayName
    : sender?.name?.trim()
      ? sender.name
      : V3_TANPA_NAMA.displayName;
  const nameColor = isTanpaNama ? V3_TANPA_NAMA.color : (sender?.color ?? V3_THEME.textSecondary);

  return (
    <div
      data-v3="message-bubble"
      data-event-id={event.id}
      style={{
        display: 'flex',
        justifyContent: isSelf ? 'flex-end' : 'flex-start',
        width: '100%',
        opacity: entrance,
        transform: `translateY(${((1 - entrance) * 18).toFixed(1)}px)`,
      }}
    >
      <div
        style={{
          maxWidth: 820,
          minWidth: 320,
          padding: '20px 26px',
          borderRadius: isSelf ? '26px 26px 8px 26px' : '26px 26px 26px 8px',
          backgroundColor: isSelf ? V3_THEME.outgoingBubbleBg : V3_THEME.incomingBubbleBg,
          border: `1.5px solid ${isSelf ? V3_THEME.outgoingBubbleBorder : V3_THEME.incomingBubbleBorder}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            {isTanpaNama && <TanpaNamaAvatar size={42} />}
            <span
              style={{
                color: isSelf ? '#D8CCFF' : nameColor,
                fontSize: V3_FONT_SIZES.senderName,
                fontWeight: 700,
                lineHeight: 1.15,
              }}
            >
              {displayName}
            </span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            {event.timeLabel && (
              <span
                style={{
                  color: V3_THEME.textMuted,
                  fontSize: V3_FONT_SIZES.messageTime,
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1.1,
                }}
              >
                {event.timeLabel}
              </span>
            )}
            {isSelf && <ReadReceiptIcon ticks={event.ticks} />}
          </div>
        </div>

        <div
          style={{
            color: isDeleted ? V3_THEME.textMuted : V3_THEME.textPrimary,
            fontStyle: isDeleted ? 'italic' : 'normal',
            fontSize: V3_FONT_SIZES.messageText,
            lineHeight: 1.26,
            wordBreak: 'break-word',
          }}
        >
          {isDeleted ? 'Pesan ini telah dihapus' : event.text}
          {!isDeleted && event.edited && (
            <span style={{color: V3_THEME.textMuted, fontSize: V3_FONT_SIZES.messageTime, marginLeft: 12}}>
              (diedit)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
