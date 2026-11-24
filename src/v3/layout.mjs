/**
 * Single source of truth for Studio v3 (Arsip Terakhir) layout and typography constants.
 * Full-bleed 1080x1920 chat UI: chrome/backgrounds extend edge-to-edge, while ALL CRITICAL
 * content regions (including FIKSI tag, chat bubbles, subtitles, photo clues, CCTV labels,
 * notifications, and call info) stay strictly inside the platform safe zone
 * (avoid top 10%, right 12%, bottom 22%).
 */

export const V3_CANVAS = Object.freeze({
  width: 1080,
  height: 1920,
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
  fiksiTag: 42,
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
  chatHeader: Object.freeze({x: 0, y: 86, width: 1080, height: 126}),
  threadBackdrop: Object.freeze({x: 0, y: 212, width: 1080, height: 1584}),
  inputBar: Object.freeze({x: 0, y: 1796, width: 1080, height: 124}),
});

/**
 * Story-critical content regions (FIKSI tag, chat bubbles, subtitles, photo clues,
 * CCTV labels, notifications, call info). Validator asserts every box stays strictly within:
 *   x >= 0, x + width <= maxX (950), y >= minCriticalY (192), y + height <= maxY (1497).
 */
export const V3_CRITICAL_REGIONS = Object.freeze({
  fiksiTag: Object.freeze({x: 28, y: 222, width: 176, height: 50}),
  chatContent: Object.freeze({x: 28, y: 282, width: 916, height: 1206}),
  notificationBanner: Object.freeze({x: 28, y: 282, width: 916, height: 220}),
  photoLightboxContent: Object.freeze({x: 28, y: 282, width: 916, height: 1206}),
  callContent: Object.freeze({x: 28, y: 282, width: 916, height: 1206}),
  cctvContent: Object.freeze({x: 28, y: 282, width: 916, height: 1206}),
});

/** Original generic midnight-slate palette (distinct from WhatsApp/Telegram/Line). */
export const V3_THEME = Object.freeze({
  canvasBg: '#0B0E14',
  phoneBg: '#0C0F16',
  phoneBorder: '#232A38',
  statusBarBg: '#11151F',
  headerBg: '#151A25',
  headerBorder: '#242C3D',
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
  fiksiBg: 'rgba(18, 22, 32, 0.90)',
  fiksiBorder: 'rgba(168, 179, 199, 0.45)',
  fiksiText: '#DCE3F0',
});

export const V3_LAYOUT = Object.freeze({
  canvas: V3_CANVAS,
  safeZone: V3_SAFE_ZONE,
  minFontSize: V3_MIN_FONT_SIZE,
  fontSizes: V3_FONT_SIZES,
  chromeRegions: V3_CHROME_REGIONS,
  criticalRegions: V3_CRITICAL_REGIONS,
});
