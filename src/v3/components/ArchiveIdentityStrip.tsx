import {
  V3_CHROME_REGIONS,
  V3_CRITICAL_REGIONS,
  V3_FONT_SIZES,
  V3_SERIES_HANDLE,
  V3_THEME,
} from '../layout.mjs';

export type ArchiveIdentityStripProps = {
  archiveNumber: number;
  metadataLine?: string;
};

/**
 * Full-width solid series identity strip directly below ChatHeader:
 * displays "ARSIP #NNN · @skenarium" plus optional factual evidence tag
 * (e.g. "HP milik: Bayu") at >= 42 px inside V3_CRITICAL_REGIONS.identityStripContent.
 * Scrolling messages clip strictly below this strip (y = 330) so no message passes behind it.
 */
export function ArchiveIdentityStrip({archiveNumber, metadataLine}: ArchiveIdentityStripProps) {
  const strip = V3_CHROME_REGIONS.identityStrip;
  const box = V3_CRITICAL_REGIONS.identityStripContent;
  const padded = String(archiveNumber).padStart(3, '0');
  const trimmedMeta = metadataLine?.trim();

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
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 10,
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: V3_FONT_SIZES.identityStrip}}>
          <span style={{color: V3_THEME.identityStripText, fontWeight: 800, letterSpacing: 1.5}}>
            ARSIP #{padded}
          </span>
          <span style={{color: V3_THEME.accent, fontWeight: 700}}>·</span>
          <span style={{color: V3_THEME.identityStripHandle, fontWeight: 600, letterSpacing: 0.4}}>
            {V3_SERIES_HANDLE}
          </span>
        </div>

        {trimmedMeta && (
          <div
            data-v3="archive-metadata-strip"
            style={{
              fontFamily: 'Consolas, Menlo, monospace',
              fontSize: V3_FONT_SIZES.archiveMetadata,
              fontWeight: 600,
              color: '#CBD5E1',
              letterSpacing: 0.4,
              lineHeight: 1,
            }}
          >
            {trimmedMeta}
          </div>
        )}
      </div>
    </div>
  );
}
