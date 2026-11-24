import {
  V3_CHROME_REGIONS,
  V3_CRITICAL_REGIONS,
  V3_FONT_SIZES,
  V3_SERIES_HANDLE,
  V3_THEME,
} from '../layout.mjs';

export type ArchiveIdentityStripProps = {
  archiveNumber: number;
};

/**
 * Full-width solid series identity strip directly below ChatHeader:
 * displays "ARSIP #NNN · @skenarium" (>= 42 px) inside V3_CRITICAL_REGIONS.identityStripContent.
 * Scrolling messages clip strictly below this strip (y = 282) so no message passes behind it.
 */
export function ArchiveIdentityStrip({archiveNumber}: ArchiveIdentityStripProps) {
  const strip = V3_CHROME_REGIONS.identityStrip;
  const box = V3_CRITICAL_REGIONS.identityStripContent;
  const padded = String(archiveNumber).padStart(3, '0');

  return (
    <div
      data-v3="identity-strip"
      style={{
        position: 'absolute',
        left: strip.x,
        top: strip.y,
        width: strip.width,
        height: strip.height,
        backgroundColor: V3_THEME.identityStripBg,
        borderBottom: `1.5px solid ${V3_THEME.headerBorder}`,
        zIndex: 60,
        pointerEvents: 'none',
        boxSizing: 'border-box',
      }}
    >
      <div
        data-v3="identity-strip-content"
        style={{
          position: 'absolute',
          left: box.x - strip.x,
          top: box.y - strip.y,
          width: box.width,
          height: box.height,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          fontSize: V3_FONT_SIZES.identityStrip,
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{color: V3_THEME.identityStripText, fontWeight: 800, letterSpacing: 1.5}}>
          ARSIP #{padded}
        </span>
        <span style={{color: V3_THEME.accent, fontWeight: 700}}>·</span>
        <span style={{color: V3_THEME.identityStripHandle, fontWeight: 600, letterSpacing: 0.4}}>
          {V3_SERIES_HANDLE}
        </span>
      </div>
    </div>
  );
}
