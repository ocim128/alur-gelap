import {V3_TANPA_NAMA} from '../layout.mjs';

/**
 * Fixed grey default avatar constant for the series presence "Tanpa Nama".
 * Identical across every episode of Arsip Terakhir.
 */
export function TanpaNamaAvatar({size = 44}: {size?: number}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      aria-label="Tanpa Nama default avatar"
      style={{flexShrink: 0, display: 'block'}}
    >
      <circle
        cx="22"
        cy="22"
        r="20.5"
        fill={V3_TANPA_NAMA.avatarBg}
        stroke={V3_TANPA_NAMA.avatarBorder}
        strokeWidth="2"
      />
      <circle cx="22" cy="16.5" r="6.5" fill={V3_TANPA_NAMA.avatarFg} />
      <path
        d="M10.5 34.5C12.2 28.5 16.5 25.5 22 25.5C27.5 25.5 31.8 28.5 33.5 34.5"
        fill={V3_TANPA_NAMA.avatarFg}
      />
    </svg>
  );
}
