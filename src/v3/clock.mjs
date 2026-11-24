/**
 * Single source of truth for Studio v3 in-world phone clock math.
 * Status-bar clock is strictly derived from startClock + elapsed timeline (1:1 real seconds).
 * Shared between PhoneFrame/CctvFrame and scripts/check-v3.mjs.
 */

const DAY_SECONDS = 86400;
const DAY_MINUTES = 1440;

/**
 * Parse "HH:MM", "HH.MM", or "HH:MM:SS" into { seconds, hasSeconds } or null if invalid.
 */
export function parseInWorldClock(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  const hms = /^(\d{1,2})[:.](\d{2})[:.](\d{2})$/.exec(trimmed);
  if (hms) {
    const h = Number(hms[1]);
    const m = Number(hms[2]);
    const s = Number(hms[3]);
    if (h < 0 || h > 23 || m < 0 || m > 59 || s < 0 || s > 59) return null;
    return {seconds: h * 3600 + m * 60 + s, hasSeconds: true};
  }
  const hm = /^(\d{1,2})[:.](\d{2})$/.exec(trimmed);
  if (hm) {
    const h = Number(hm[1]);
    const m = Number(hm[2]);
    if (h < 0 || h > 23 || m < 0 || m > 59) return null;
    return {seconds: h * 3600 + m * 60, hasSeconds: false};
  }
  return null;
}

/** Exact in-world phone time in seconds-of-day at `frame` given `startClock` and `fps`. */
export function phoneSecondsAtFrame(startClock, frame, fps) {
  const parsed = parseInWorldClock(startClock);
  if (!parsed) return 0;
  const elapsedSec = Math.floor(Math.max(0, frame) / fps);
  return ((parsed.seconds + elapsedSec) % DAY_SECONDS + DAY_SECONDS) % DAY_SECONDS;
}

/** Format seconds-of-day as "HH:MM" for the status bar. */
export function formatStatusClock(secondsOfDay) {
  const wrapped = ((Math.floor(secondsOfDay) % DAY_SECONDS) + DAY_SECONDS) % DAY_SECONDS;
  const hh = String(Math.floor(wrapped / 3600)).padStart(2, '0');
  const mm = String(Math.floor((wrapped % 3600) / 60)).padStart(2, '0');
  return `${hh}:${mm}`;
}

/** Format seconds-of-day as "HH:MM:SS" for CCTV timestamps. */
export function formatHmsClock(secondsOfDay) {
  const wrapped = ((Math.floor(secondsOfDay) % DAY_SECONDS) + DAY_SECONDS) % DAY_SECONDS;
  const hh = String(Math.floor(wrapped / 3600)).padStart(2, '0');
  const mm = String(Math.floor((wrapped % 3600) / 60)).padStart(2, '0');
  const ss = String(wrapped % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

/**
 * Signed difference (event - phone) wrapped to (-halfDay, +halfDay] so midnight crossings
 * like phone=00:00 vs event=23:59 evaluate as -1 minute (valid past), while phone=23:59 vs
 * event=00:01 evaluates as +2 minutes (future -> invalid unless anomaly).
 */
function signedModDiff(a, b, modulus) {
  let diff = (a - b) % modulus;
  if (diff > modulus / 2) diff -= modulus;
  if (diff <= -modulus / 2) diff += modulus;
  return diff;
}

/**
 * Check whether an event's timeLabel ("HH.MM" / "HH:MM") or timestampLabel ("HH:MM:SS")
 * is <= the phone status-bar clock at `frame`.
 * Returns { ok: boolean, deltaSec: number, phoneClock: string }.
 */
export function isEventClockConsistent(startClock, frame, fps, eventClockLabel) {
  const parsedEvent = parseInWorldClock(eventClockLabel);
  if (!parsedEvent) {
    return {ok: false, invalidFormat: true, deltaSec: NaN, phoneClock: formatStatusClock(phoneSecondsAtFrame(startClock, frame, fps))};
  }
  const phoneSec = phoneSecondsAtFrame(startClock, frame, fps);
  if (parsedEvent.hasSeconds) {
    const deltaSec = signedModDiff(parsedEvent.seconds, phoneSec, DAY_SECONDS);
    return {ok: deltaSec <= 0, invalidFormat: false, deltaSec, phoneClock: formatHmsClock(phoneSec)};
  }
  const phoneMin = Math.floor(phoneSec / 60);
  const eventMin = Math.floor(parsedEvent.seconds / 60);
  const deltaMin = signedModDiff(eventMin, phoneMin, DAY_MINUTES);
  return {ok: deltaMin <= 0, invalidFormat: false, deltaSec: deltaMin * 60, phoneClock: formatStatusClock(phoneSec)};
}
