/**
 * Single source of truth for Studio v3 (Arsip Terakhir) layout, series identity,
 * Tanpa Nama constants, overlay transition bounds, and typography.
 *
 * Full-bleed 1080x1920 chat UI: chrome/backgrounds extend edge-to-edge, while ALL CRITICAL
 * content regions (series identity strip text, chat bubbles, subtitles, photo clues, CCTV labels,
 * notifications, and call info) stay strictly inside the platform safe zone
 * (avoid top 10%, right 12%, bottom 22%).
 */

export const V3_CANVAS = Object.freeze({
  width: 1080,
  height: 1920,
});

/** Fixed series-wide account handle (never per episode). */
export const V3_SERIES_HANDLE = '@skenarium';

/** Format the series identity strip label, e.g. "ARSIP #001 · @skenarium". */
export function formatArchiveIdentity(archiveNumber) {
  const padded = String(archiveNumber).padStart(3, '0');
  return `ARSIP #${padded} · ${V3_SERIES_HANDLE}`;
}

/**
 * Fixed series-level identity for "Tanpa Nama" (the one recurring presence across
 * standalone Arsip Terakhir episodes). Never explained, no phone number, fixed grey
 * default avatar, and exclusive signature ping sound.
 */
export const V3_TANPA_NAMA = Object.freeze({
  id: 'unknown',
  displayName: 'Tanpa Nama',
  color: '#94A3B8',
  avatarBg: '#475569',
  avatarFg: '#CBD5E1',
  avatarBorder: '#64748B',
  signatureSfx: 'sfx/shared/tanpa-nama-ping.wav',
});

/** True if the character or sender ID represents the series constant "Tanpa Nama". */
export function isTanpaNamaCharacter(character, senderId = character?.id) {
  if (senderId === V3_TANPA_NAMA.id || character?.id === V3_TANPA_NAMA.id) return true;
  if (typeof character?.name === 'string') {
    const normalized = character.name.trim().toLowerCase();
    if (normalized === V3_TANPA_NAMA.displayName.toLowerCase()) return true;
  }
  return false;
}

/**
 * Pre-play arrival beat (0.5 s at 30 fps) for unplayed incoming voice notes so the
 * amber unplayed indicator is briefly visible, disappears when playback begins, and
 * the bubble then plays and rests in its played state.
 */
export const V3_UNPLAYED_PREPLAY_FRAMES = 15;

/**
 * Overlay transition fade limits (in frames at 30 fps).
 * Full-screen overlays use 0-frame hard cuts with opaque backdrops so readable chat
 * and overlay text can never appear doubled/ghosted. All fades must be <= 6 frames.
 */
export const V3_OVERLAY_FADE_FRAMES = Object.freeze({
  maxAllowed: 6,
  photoZoomIn: 0,
  photoZoomOut: 0,
  cctvIn: 0,
  cctvOut: 0,
  callIn: 0,
  callOut: 0,
  evidenceIn: 0,
  evidenceOut: 0,
  notificationIn: 4,
  notificationOut: 4,
});

// Platform UI safe zone for critical content:
// - Avoid top ~10% (TikTok "Following | For You" tabs): y >= 192
// - Avoid right ~12% (action icons): x + width <= 950
// - Avoid bottom ~22% (caption & audio controls): y + height <= 1497
export const V3_SAFE_ZONE = Object.freeze({
  avoidTopRatio: 0.1,
  avoidRightRatio: 0.12,
  avoidBottomRatio: 0.22,
  minCriticalY: Math.ceil(V3_CANVAS.height * 0.1), // 192
  maxX: Math.floor(V3_CANVAS.width * (1 - 0.12)), // 950
  maxY: Math.floor(V3_CANVAS.height * (1 - 0.22)), // 1497
});

export const V3_MIN_FONT_SIZE = 42;

/**
 * Every readable text and subtitle font size rendered in Studio v3 UI components.
 * Validator asserts every entry here is >= V3_MIN_FONT_SIZE (42 px at 1080 width).
 * Message body text is 48 px for effortless phone readability.
 */
export const V3_FONT_SIZES = Object.freeze({
  statusBar: 42,
  identityStrip: 42,
  archiveMetadata: 42,
  evidenceTag: 42,
  headerGroupName: 48,
  headerSubtitle: 42,
  senderName: 42,
  messageText: 48,
  messageTime: 42,
  photoCaption: 46,
  voiceSubtitle: 46,
  voiceDuration: 42,
  systemText: 44,
  notificationTitle: 46,
  notificationBody: 44,
  callCaller: 60,
  callSubtitle: 46,
  cctvLabel: 44,
  cctvTimestamp: 44,
  inputPlaceholder: 42,
});

/**
 * Full-bleed decorative/chrome regions allowed to extend edge-to-edge across 1080x1920.
 */
export const V3_CHROME_REGIONS = Object.freeze({
  canvas: Object.freeze({x: 0, y: 0, width: 1080, height: 1920}),
  statusBar: Object.freeze({x: 0, y: 0, width: 1080, height: 86}),
  chatHeader: Object.freeze({x: 0, y: 200, width: 1080, height: 126}),
  identityStrip: Object.freeze({x: 0, y: 326, width: 1080, height: 118}),
  threadBackdrop: Object.freeze({x: 0, y: 444, width: 1080, height: 1352}),
  inputBar: Object.freeze({x: 0, y: 1796, width: 1080, height: 124}),
});

/**
 * Story-critical content regions (series identity strip label, optional archive metadata,
 * chat bubbles, subtitles, photo clues, CCTV labels, notifications, call info, evidence tag).
 * Validator asserts every box stays strictly within:
 *   x >= 0, x + width <= maxX (950), y >= minCriticalY (192), y + height <= maxY (1497).
 */
export const V3_CRITICAL_REGIONS = Object.freeze({
  chatHeaderContent: Object.freeze({x: 28, y: 200, width: 916, height: 126}),
  identityStripContent: Object.freeze({x: 28, y: 332, width: 916, height: 106}),
  chatContent: Object.freeze({x: 28, y: 444, width: 916, height: 1044}),
  notificationBanner: Object.freeze({x: 28, y: 444, width: 916, height: 220}),
  photoLightboxContent: Object.freeze({x: 28, y: 444, width: 916, height: 1044}),
  callContent: Object.freeze({x: 28, y: 444, width: 916, height: 1044}),
  cctvContent: Object.freeze({x: 28, y: 444, width: 916, height: 1044}),
  evidenceTagContent: Object.freeze({x: 28, y: 444, width: 916, height: 1044}),
});

/** Original generic midnight-slate palette (distinct from WhatsApp/Telegram/Line). */
export const V3_THEME = Object.freeze({
  canvasBg: '#0B0E14',
  phoneBg: '#0C0F16',
  phoneBorder: '#232A38',
  statusBarBg: '#11151F',
  headerBg: '#151A25',
  headerBorder: '#242C3D',
  identityStripBg: '#10141E',
  identityStripText: '#E2E8F0',
  identityStripHandle: '#94A3B8',
  threadBg: '#0C0F16',
  incomingBubbleBg: '#1B2130',
  incomingBubbleBorder: '#2D364D',
  outgoingBubbleBg: '#2B2542',
  outgoingBubbleBorder: '#473D6B',
  systemPillBg: '#171D2A',
  inputBarBg: '#131823',
  textPrimary: '#F3F6FB',
  textSecondary: '#A8B3C7',
  textMuted: '#7F8CA3',
  accent: '#A78BFA',
  warning: '#F59E0B',
  danger: '#EF4444',
});

export const V3_LAYOUT = Object.freeze({
  canvas: V3_CANVAS,
  seriesHandle: V3_SERIES_HANDLE,
  tanpaNama: V3_TANPA_NAMA,
  unplayedPreplayFrames: V3_UNPLAYED_PREPLAY_FRAMES,
  overlayFadeFrames: V3_OVERLAY_FADE_FRAMES,
  safeZone: V3_SAFE_ZONE,
  minFontSize: V3_MIN_FONT_SIZE,
  fontSizes: V3_FONT_SIZES,
  chromeRegions: V3_CHROME_REGIONS,
  criticalRegions: V3_CRITICAL_REGIONS,
});
