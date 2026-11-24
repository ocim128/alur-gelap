import {V3_CRITICAL_REGIONS, V3_FONT_SIZES, V3_THEME} from '../layout.mjs';

export type FiksiTagProps = {
  visible?: boolean;
  label?: string;
};

/** Small FIKSI disclosure badge pinned upper-left below the chat header inside the critical safe zone. */
export function FiksiTag({visible = true, label = 'FIKSI'}: FiksiTagProps) {
  if (!visible) return null;
  const box = V3_CRITICAL_REGIONS.fiksiTag;
  return (
    <div
      data-v3="fiksi-tag"
      style={{
        position: 'absolute',
        left: box.x,
        top: box.y,
        width: box.width,
        height: box.height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: V3_THEME.fiksiBg,
        border: `2px solid ${V3_THEME.fiksiBorder}`,
        borderRadius: 12,
        color: V3_THEME.fiksiText,
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        fontSize: V3_FONT_SIZES.fiksiTag,
        fontWeight: 700,
        letterSpacing: 3,
        lineHeight: 1,
        zIndex: 60,
        pointerEvents: 'none',
      }}
    >
      {label}
    </div>
  );
}
