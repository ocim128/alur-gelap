import {interpolate, useCurrentFrame} from 'remotion';
import {
  V3_CHROME_REGIONS,
  V3_CRITICAL_REGIONS,
  V3_FONT_SIZES,
  V3_OVERLAY_FADE_FRAMES,
  V3_THEME,
} from '../layout.mjs';
import type {EvidenceEventV3} from '../types';

export type EvidenceTagOverlayProps = {
  event: EvidenceEventV3;
};

/**
 * Full-bleed opaque dark evidence card showing one short factual label
 * (e.g. "ditemukan: portal barat · 05.12") inside V3_CRITICAL_REGIONS.evidenceTagContent.
 * Uses a 0-frame hard cut so readable chat text underneath never appears doubled.
 */
export function EvidenceTagOverlay({event}: EvidenceTagOverlayProps) {
  const frame = useCurrentFrame();
  const local = frame - event.at;
  if (local < 0 || local >= event.durationFrames) return null;

  const fadeInFrames = V3_OVERLAY_FADE_FRAMES.evidenceIn;
  const fadeOutFrames = V3_OVERLAY_FADE_FRAMES.evidenceOut;
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

  const statusHeight = V3_CHROME_REGIONS.statusBar.height;
  const box = V3_CRITICAL_REGIONS.evidenceTagContent;

  return (
    <div
      data-v3="evidence-tag-overlay"
      data-event-id={event.id}
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#07090F',
        opacity,
        zIndex: 42,
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
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 32px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '100%',
            padding: '32px 36px',
            borderRadius: 16,
            backgroundColor: '#10141E',
            border: `2px solid ${V3_THEME.headerBorder}`,
            borderLeft: `6px solid ${V3_THEME.accent}`,
            fontFamily: 'Arial, sans-serif',
            fontVariantNumeric: 'tabular-nums',
            fontSize: V3_FONT_SIZES.evidenceTag,
            fontWeight: 700,
            color: V3_THEME.textPrimary,
            letterSpacing: 0.6,
            lineHeight: 1.32,
          }}
        >
          {event.text}
        </div>
      </div>
    </div>
  );
}
