import {Audio} from '@remotion/media';
import {Easing, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {useAudioWaveform} from '../audio-analysis';
import {V3_FONT_SIZES, V3_THEME} from '../layout.mjs';
import type {CharacterV3, VoiceEventV3} from '../types';
import {ReadReceiptIcon} from './MessageBubble';

export type VoiceNoteBubbleProps = {
  event: VoiceEventV3;
  sender?: CharacterV3;
  isSelf?: boolean;
};

function formatDuration(seconds: number): string {
  const rounded = Math.max(0, Math.round(seconds));
  const mins = Math.floor(rounded / 60);
  const secs = rounded % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

/** Original amber unplayed voice-note indicator (distinct from outgoing read receipts). */
function UnplayedVoiceBadge({frame}: {frame: number}) {
  const pulse = 0.6 + 0.4 * Math.sin(frame * 0.22);
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" aria-label="unplayed voice note" style={{flexShrink: 0}}>
      <circle cx="13" cy="13" r="10.5" fill="none" stroke={V3_THEME.warning} strokeWidth="2.4" opacity={pulse} />
      <circle cx="13" cy="13" r="5.5" fill={V3_THEME.warning} />
    </svg>
  );
}

export function VoiceNoteBubble({event, sender, isSelf = false}: VoiceNoteBubbleProps) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const waveform = useAudioWaveform(event.src, fps, 24);

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

  const clipFrames = Math.max(1, Math.ceil(waveform.durationSec * fps));
  const progress = Math.max(0, Math.min(1, local / clipFrames));
  const isPlaying = local >= 0 && local < clipFrames;
  const activeEnergy = isPlaying
    ? (waveform.framePeaks[Math.min(local, waveform.framePeaks.length - 1)] ?? 0.4)
    : 0;

  const displayName = sender?.name?.trim() ? sender.name : 'Tanpa Nama';
  const nameColor = sender?.color ?? V3_THEME.textSecondary;
  const elapsedSec = isPlaying ? local / fps : waveform.durationSec;
  const isUnplayed = Boolean(event.unplayed);

  return (
    <div
      data-v3="voice-note-bubble"
      data-event-id={event.id}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isSelf ? 'flex-end' : 'flex-start',
        width: '100%',
        gap: 10,
        opacity: entrance,
        transform: `translateY(${((1 - entrance) * 18).toFixed(1)}px)`,
      }}
    >
      <Sequence from={event.at} durationInFrames={clipFrames} layout="none">
        <Audio src={staticFile(event.src)} />
      </Sequence>

      <div
        style={{
          width: 790,
          padding: '20px 26px',
          borderRadius: isSelf ? '26px 26px 8px 26px' : '26px 26px 26px 8px',
          backgroundColor: isSelf ? V3_THEME.outgoingBubbleBg : V3_THEME.incomingBubbleBg,
          border: `1.5px solid ${
            isUnplayed
              ? V3_THEME.warning
              : isSelf
                ? V3_THEME.outgoingBubbleBorder
                : V3_THEME.incomingBubbleBorder
          }`,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
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
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            {event.timeLabel && (
              <span
                style={{
                  color: V3_THEME.textMuted,
                  fontSize: V3_FONT_SIZES.messageTime,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {event.timeLabel}
              </span>
            )}
            {isSelf && <ReadReceiptIcon ticks={event.ticks} />}
            {!isSelf && isUnplayed && <UnplayedVoiceBadge frame={frame} />}
          </div>
        </div>

        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: '50%',
              backgroundColor: isPlaying ? (isUnplayed ? V3_THEME.warning : V3_THEME.accent) : '#2A3347',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {isPlaying ? (
              <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
                <rect x="4" y="3" width="6" height="20" rx="2" fill="#0C0F16" />
                <rect x="16" y="3" width="6" height="20" rx="2" fill="#0C0F16" />
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
                <polygon points="7,3 23,13 7,23" fill={isUnplayed ? V3_THEME.warning : V3_THEME.textPrimary} />
              </svg>
            )}
          </div>

          <div
            style={{
              flex: 1,
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 6,
            }}
          >
            {waveform.bars.map((amp, index) => {
              const barPos = (index + 0.5) / waveform.bars.length;
              const played = barPos <= progress;
              const isHead = isPlaying && Math.abs(barPos - progress) < 0.08;
              const boost = isHead ? 0.78 + activeEnergy * 0.45 : 1;
              const barHeight = Math.max(12, Math.min(60, Math.round(amp * 56 * boost)));
              return (
                <div
                  key={index}
                  style={{
                    width: 10,
                    height: barHeight,
                    borderRadius: 5,
                    backgroundColor: played
                      ? isUnplayed
                        ? V3_THEME.warning
                        : V3_THEME.accent
                      : '#46526B',
                  }}
                />
              );
            })}
          </div>

          <span
            style={{
              color: V3_THEME.textSecondary,
              fontSize: V3_FONT_SIZES.voiceDuration,
              fontVariantNumeric: 'tabular-nums',
              flexShrink: 0,
            }}
          >
            {formatDuration(elapsedSec)}
          </span>
        </div>
      </div>

      <div
        data-v3="voice-subtitle"
        style={{
          maxWidth: 790,
          padding: '14px 22px',
          borderRadius: 18,
          backgroundColor: 'rgba(20, 25, 36, 0.94)',
          borderLeft: `4px solid ${isUnplayed ? V3_THEME.warning : isSelf ? '#D8CCFF' : nameColor}`,
          color: V3_THEME.textPrimary,
          fontSize: V3_FONT_SIZES.voiceSubtitle,
          lineHeight: 1.24,
        }}
      >
        “{event.subtitle}”
      </div>
    </div>
  );
}
