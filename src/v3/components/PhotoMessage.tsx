import {Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {
  isTanpaNamaCharacter,
  V3_CHROME_REGIONS,
  V3_CRITICAL_REGIONS,
  V3_FONT_SIZES,
  V3_OVERLAY_FADE_FRAMES,
  V3_TANPA_NAMA,
  V3_THEME,
} from '../layout.mjs';
import type {CharacterV3, PhotoEventV3} from '../types';
import {ReadReceiptIcon} from './MessageBubble';
import {TanpaNamaAvatar} from './TanpaNamaAvatar';

export type PhotoMessageProps = {
  event: PhotoEventV3;
  sender?: CharacterV3;
  isSelf?: boolean;
};

export function PhotoMessage({event, sender, isSelf = false}: PhotoMessageProps) {
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
  const isTanpaNama = !isSelf && isTanpaNamaCharacter(sender, event.from);
  const displayName = isTanpaNama
    ? V3_TANPA_NAMA.displayName
    : sender?.name?.trim()
      ? sender.name
      : V3_TANPA_NAMA.displayName;
  const nameColor = isTanpaNama ? V3_TANPA_NAMA.color : (sender?.color ?? V3_THEME.textSecondary);

  return (
    <div
      data-v3="photo-message"
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
          width: 780,
          padding: '18px 20px 20px',
          borderRadius: isSelf ? '26px 26px 8px 26px' : '26px 26px 26px 8px',
          backgroundColor: isSelf ? V3_THEME.outgoingBubbleBg : V3_THEME.incomingBubbleBg,
          border: `1.5px solid ${isSelf ? V3_THEME.outgoingBubbleBorder : V3_THEME.incomingBubbleBorder}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6px'}}>
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
            width: '100%',
            height: 440,
            borderRadius: 18,
            overflow: 'hidden',
            backgroundColor: '#090C11',
          }}
        >
          <Img
            src={staticFile(event.src)}
            style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
          />
        </div>

        {event.caption && (
          <div
            style={{
              padding: '2px 6px 0',
              color: V3_THEME.textPrimary,
              fontSize: V3_FONT_SIZES.photoCaption,
              lineHeight: 1.25,
            }}
          >
            {event.caption}
          </div>
        )}
      </div>
    </div>
  );
}

export type PhotoZoomOverlayProps = {
  event: PhotoEventV3;
  sender?: CharacterV3;
};

/** Full-bleed dark lightbox whose critical photo clue, sender header, and caption stay strictly inside V3_CRITICAL_REGIONS.photoLightboxContent. */
export function PhotoZoomOverlay({event, sender}: PhotoZoomOverlayProps) {
  const frame = useCurrentFrame();
  const zoom = event.zoom;
  if (!zoom) return null;

  const start = event.at + zoom.atOffset;
  const duration = zoom.durationFrames ?? 90;
  const end = start + duration;
  if (frame < start || frame >= end) return null;

  const fadeInFrames = V3_OVERLAY_FADE_FRAMES.photoZoomIn;
  const fadeOutFrames = V3_OVERLAY_FADE_FRAMES.photoZoomOut;
  const fadeInEnd = Math.min(start + fadeInFrames, end);
  const fadeOutStart = Math.max(fadeInEnd, end - fadeOutFrames);
  const opacity =
    fadeInFrames > 0 && frame < fadeInEnd
      ? interpolate(frame, [start, fadeInEnd], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
      : fadeOutFrames > 0 && frame >= fadeOutStart
        ? interpolate(frame, [fadeOutStart, end], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
        : 1;

  const zoomInEnd = Math.min(start + Math.round(duration * 0.45), fadeOutStart);
  const scale = interpolate(frame, [start, zoomInEnd], [1.04, zoom.scale], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  const panX = (0.5 - zoom.x) * (scale - 1) * 100;
  const panY = (0.5 - zoom.y) * (scale - 1) * 100;
  const isTanpaNama = isTanpaNamaCharacter(sender, event.from);
  const displayName = isTanpaNama
    ? V3_TANPA_NAMA.displayName
    : sender?.name?.trim()
      ? sender.name
      : V3_TANPA_NAMA.displayName;
  const statusHeight = V3_CHROME_REGIONS.statusBar.height;
  const box = V3_CRITICAL_REGIONS.photoLightboxContent;

  return (
    <div
      data-v3="photo-zoom-overlay"
      data-event-id={event.id}
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#06080D',
        opacity,
        zIndex: 35,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: box.x,
          top: box.y - statusHeight,
          width: box.width,
          height: box.height,
          borderRadius: 24,
          border: `1.5px solid ${V3_THEME.headerBorder}`,
          backgroundColor: '#090C12',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '20px 26px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(17, 21, 31, 0.92)',
            borderBottom: `1px solid ${V3_THEME.headerBorder}`,
            zIndex: 2,
          }}
        >
          <span style={{color: V3_THEME.textPrimary, fontSize: V3_FONT_SIZES.senderName, fontWeight: 700}}>
            {displayName}
          </span>
          {event.timeLabel && (
            <span style={{color: V3_THEME.textSecondary, fontSize: V3_FONT_SIZES.messageTime}}>
              {event.timeLabel}
            </span>
          )}
        </div>

        <div style={{position: 'relative', flex: 1, overflow: 'hidden', backgroundColor: '#05070B'}}>
          <Img
            src={staticFile(event.src)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `translate(${panX.toFixed(2)}%, ${panY.toFixed(2)}%) scale(${scale.toFixed(4)})`,
              transformOrigin: 'center center',
            }}
          />
        </div>

        {event.caption && (
          <div
            style={{
              padding: '20px 26px',
              backgroundColor: 'rgba(17, 21, 31, 0.94)',
              borderTop: `1px solid ${V3_THEME.headerBorder}`,
              color: V3_THEME.textPrimary,
              fontSize: V3_FONT_SIZES.photoCaption,
              lineHeight: 1.25,
              zIndex: 2,
            }}
          >
            {event.caption}
          </div>
        )}
      </div>
    </div>
  );
}
