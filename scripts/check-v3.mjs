import assert from "node:assert/strict";
import {execFileSync} from "node:child_process";
import {readFileSync, readdirSync, statSync} from "node:fs";
import {dirname, join, relative, resolve, sep} from "node:path";
import {fileURLToPath} from "node:url";
import {isEventClockConsistent, parseInWorldClock} from "../src/v3/clock.mjs";
import {V3_LAYOUT, V3_MIN_FONT_SIZE} from "../src/v3/layout.mjs";

const nonempty = (v) => typeof v === "string" && v.trim().length > 0;
const isFrame = (v) => Number.isInteger(v) && v >= 0;
const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));
const archivedDirPattern = /^(?:archive|archives|backup|backups|snapshot|snapshots|old|attic|sources|pre-.+|.+-before)$/i;
const validEventTypes = new Set(["text", "photo", "voice", "system", "notification", "call", "cctv"]);

export function countChatWords(text) {
  if (typeof text !== "string") return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/u).filter((word) => /[\p{L}\p{N}]/u.test(word)).length;
}

export function minReadingHoldSeconds(wordCount) {
  return Math.max(1.2, 0.18 * wordCount + 0.6);
}

export function minReadingHoldFrames(wordCount, fps) {
  return Math.ceil(minReadingHoldSeconds(wordCount) * fps);
}

/**
 * Measure an audio file's real duration in seconds.
 * Parses RIFF/WAV headers directly in Node (fast, zero-subprocess), falling back to ffprobe for MP3/M4A/etc.
 */
export function measureAudioDurationSec(filePath) {
  const buf = readFileSync(filePath);
  if (buf.length >= 44 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WAVE") {
    let offset = 12;
    let byteRate = 0;
    let dataSize = 0;
    while (offset + 8 <= buf.length) {
      const chunkId = buf.toString("ascii", offset, offset + 4);
      const chunkSize = buf.readUInt32LE(offset + 4);
      const dataStart = offset + 8;
      if (chunkId === "fmt " && dataStart + 12 <= buf.length) {
        byteRate = buf.readUInt32LE(dataStart + 8);
      } else if (chunkId === "data") {
        dataSize = chunkSize;
        break;
      }
      offset = dataStart + chunkSize + (chunkSize % 2);
    }
    if (byteRate > 0 && dataSize > 0) {
      return dataSize / byteRate;
    }
  }

  const out = execFileSync(
    "ffprobe",
    ["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", filePath],
    {encoding: "utf8", stdio: ["ignore", "pipe", "pipe"]},
  ).trim();
  const parsed = Number.parseFloat(out);
  assert(Number.isFinite(parsed) && parsed > 0, `Could not measure audio duration for ${filePath}`);
  return parsed;
}

function assertValidBox(box, label, width, height) {
  assert(box && typeof box === "object", `v3 layout: ${label} must be an object`);
  const {x, y, width: w, height: h} = box;
  assert([x, y, w, h].every((v) => Number.isFinite(v)) && w > 0 && h > 0, `v3 layout: ${label} has invalid geometry`);
  assert(x >= 0 && y >= 0 && x + w <= width && y + h <= height, `v3 layout: ${label} exceeds ${width}x${height} canvas`);
}

/**
 * Validate Studio v3 layout constants:
 * - Every font size >= 42 px
 * - Chrome regions may extend full-bleed across 1080x1920
 * - Critical regions (FIKSI tag, bubbles, subtitles, photo clues, CCTV HUD, notifications, calls)
 *   must avoid top 10% (y >= 192), right 12% (x + width <= 950), and bottom 22% (y + height <= 1497).
 */
export function validateV3Layout(layout = V3_LAYOUT) {
  assert(layout && typeof layout === "object", "v3 layout: expected layout object");
  const width = layout.canvas?.width;
  const height = layout.canvas?.height;
  assert(width === 1080 && height === 1920, `v3 layout: canvas must be 1080x1920, got ${width}x${height}`);

  const minCriticalY = Math.ceil(height * 0.1); // avoid top 10% (TikTok tabs)
  const maxX = Math.floor(width * (1 - 0.12)); // avoid right 12%
  const maxY = Math.floor(height * (1 - 0.22)); // avoid bottom 22%

  assert(layout.fontSizes && typeof layout.fontSizes === "object", "v3 layout: missing fontSizes");
  const fontEntries = Object.entries(layout.fontSizes);
  assert(fontEntries.length > 0, "v3 layout: fontSizes must not be empty");
  for (const [name, size] of fontEntries) {
    assert(
      Number.isFinite(size) && size >= V3_MIN_FONT_SIZE,
      `v3 layout: font size "${name}" (${size} px) is below minimum ${V3_MIN_FONT_SIZE} px`,
    );
  }

  assert(layout.chromeRegions && typeof layout.chromeRegions === "object", "v3 layout: missing chromeRegions");
  for (const [name, box] of Object.entries(layout.chromeRegions)) {
    assertValidBox(box, `chromeRegions.${name}`, width, height);
  }

  assert(layout.criticalRegions && typeof layout.criticalRegions === "object", "v3 layout: missing criticalRegions");
  assert(layout.criticalRegions.fiksiTag, "v3 layout: fiksiTag must be defined inside criticalRegions");
  const criticalEntries = Object.entries(layout.criticalRegions);
  assert(criticalEntries.length > 0, "v3 layout: criticalRegions must not be empty");
  for (const [name, box] of criticalEntries) {
    assertValidBox(box, `criticalRegions.${name}`, width, height);
    assert(
      box.y >= minCriticalY,
      `v3 layout: criticalRegions.${name} top edge (${box.y} px) intrudes into top 10% danger zone (min ${minCriticalY} px)`,
    );
    assert(
      box.x + box.width <= maxX,
      `v3 layout: criticalRegions.${name} right edge (${box.x + box.width} px) intrudes into right 12% danger zone (max ${maxX} px)`,
    );
    assert(
      box.y + box.height <= maxY,
      `v3 layout: criticalRegions.${name} bottom edge (${box.y + box.height} px) intrudes into bottom 22% danger zone (max ${maxY} px)`,
    );
  }

  return {
    fontCount: fontEntries.length,
    criticalRegionCount: criticalEntries.length,
    minCriticalY,
    maxX,
    maxY,
  };
}

export function validateV3Script(
  script,
  {
    publicDir,
    layout = V3_LAYOUT,
    label = null,
    measureAudio = measureAudioDurationSec,
    requireAssets = true,
  } = {},
) {
  assert(script && typeof script === "object" && !Array.isArray(script), "v3 script must be an object");
  const prefix = `${script.id ?? label ?? "v3-episode"}: `;
  const fail = (condition, message) => assert(condition, prefix + message);

  validateV3Layout(layout);

  fail(script.pipelineVersion === 3, "pipelineVersion must be 3");
  fail(nonempty(script.id) && /^[a-zA-Z0-9-]+$/.test(script.id), "invalid script id");
  fail(Number.isInteger(script.fps) && script.fps > 0, "invalid fps");
  fail(Number.isInteger(script.durationInFrames) && script.durationInFrames > 0, "invalid durationInFrames");

  const durationSec = script.durationInFrames / script.fps;
  fail(
    durationSec >= 45 && durationSec <= 75,
    `duration ${durationSec.toFixed(2)} s is outside the 45–75 s Studio v3 band`,
  );

  fail(
    script.fiksiTag?.visible === true &&
      typeof script.fiksiTag?.label === "string" &&
      script.fiksiTag.label.trim().toUpperCase() === "FIKSI",
    'FIKSI tag must be present with {visible: true, label: "FIKSI"}',
  );

  fail(nonempty(script.app?.groupName), "app.groupName is required");
  fail(parseInWorldClock(script.startClock) !== null, "startClock must be valid HH:MM or HH:MM:SS");

  fail(Array.isArray(script.characters) && script.characters.length > 0, "characters must be a non-empty array");
  const characterIds = new Set();
  for (const char of script.characters) {
    fail(char && typeof char === "object", "invalid character entry");
    fail(nonempty(char.id) && !characterIds.has(char.id), `duplicate/missing character id ${char.id}`);
    fail(typeof char.name === "string", `character ${char.id}: name must be a string`);
    fail(nonempty(char.color), `character ${char.id}: missing color`);
    characterIds.add(char.id);
  }
  if (script.app.selfId !== undefined) {
    fail(characterIds.has(script.app.selfId), `app.selfId "${script.app.selfId}" does not match any character`);
  }

  const checkAsset = (assetPath, context) => {
    fail(nonempty(assetPath), `${context}: invalid asset path`);
    if (!requireAssets) return null;
    fail(typeof publicDir === "string", `${context}: publicDir required to verify asset ${assetPath}`);
    const resolvedPublic = resolve(publicDir);
    const full = resolve(publicDir, assetPath);
    fail(
      full.startsWith(resolvedPublic + sep) && statSync(full, {throwIfNoEntry: false})?.isFile(),
      `${context}: missing asset ${assetPath}`,
    );
    return full;
  };

  if (script.audio?.ambience) {
    checkAsset(script.audio.ambience.src, "audio.ambience");
  }
  if (script.audio?.uiSfx) {
    for (const [key, src] of Object.entries(script.audio.uiSfx)) {
      if (src !== undefined) checkAsset(src, `audio.uiSfx.${key}`);
    }
  }

  fail(Array.isArray(script.events) && script.events.length > 0, "events must be a non-empty array");
  fail(script.events[0].at === 0, `hook event "${script.events[0]?.id ?? "0"}" must start at frame 0`);

  const eventsById = new Map();
  let previousAt = -1;
  const measuredVoiceDurations = new Map();

  for (const [index, event] of script.events.entries()) {
    fail(event && typeof event === "object", `event[${index}] must be an object`);
    fail(nonempty(event.id) && !eventsById.has(event.id), `duplicate/missing event id ${event.id}`);
    fail(validEventTypes.has(event.type), `${event.id}: unsupported event type "${event.type}"`);
    fail(
      isFrame(event.at) && event.at < script.durationInFrames,
      `${event.id}: invalid frame at=${event.at} for duration ${script.durationInFrames}`,
    );
    fail(event.at >= previousAt, `${event.id}: events must be sorted by at (${event.at} < ${previousAt})`);
    previousAt = event.at;
    eventsById.set(event.id, event);

    if (event.type === "text" || event.type === "photo" || event.type === "voice") {
      fail(characterIds.has(event.from), `${event.id}: unknown sender "${event.from}"`);
      if (event.ticks !== undefined) {
        fail(
          ["sent", "delivered", "read"].includes(event.ticks),
          `${event.id}: invalid ticks "${event.ticks}" (use sent/delivered/read on outgoing messages, or unplayed: true on incoming voice notes)`,
        );
        fail(
          script.app.selfId !== undefined && event.from === script.app.selfId,
          `${event.id}: receipts (ticks) are only allowed on messages sent by phone owner "${script.app.selfId ?? "none"}", not received message from "${event.from}"`,
        );
      }
    }

    if (event.type === "text") {
      fail(nonempty(event.text), `${event.id}: text message requires non-empty text`);
      if (event.deletedAt !== undefined) {
        fail(
          isFrame(event.deletedAt) && event.deletedAt > event.at && event.deletedAt < script.durationInFrames,
          `${event.id}: invalid deletedAt ${event.deletedAt}`,
        );
      }
    }

    if (event.type === "photo") {
      checkAsset(event.src, `${event.id} photo`);
      if (event.zoom !== undefined) {
        const z = event.zoom;
        fail(
          z &&
            Number.isFinite(z.x) &&
            z.x >= 0 &&
            z.x <= 1 &&
            Number.isFinite(z.y) &&
            z.y >= 0 &&
            z.y <= 1 &&
            Number.isFinite(z.scale) &&
            z.scale > 1 &&
            isFrame(z.atOffset),
          `${event.id}: invalid zoom spec`,
        );
      }
    }

    if (event.type === "voice") {
      fail(
        !Object.hasOwn(event, "durationSec"),
        `${event.id}: voice event must not hand-enter durationSec; duration is measured from the audio asset`,
      );
      fail(nonempty(event.subtitle), `${event.id}: voice note requires a subtitle`);
      const fullPath = checkAsset(event.src, `${event.id} voice`);
      if (fullPath !== null) {
        const measuredSec = measureAudio(fullPath);
        fail(
          Number.isFinite(measuredSec) && measuredSec >= 2 && measuredSec <= 6,
          `${event.id}: voice note measured duration ${Number(measuredSec).toFixed(2)} s is outside 2–6 s`,
        );
        fail(
          event.at + Math.ceil(measuredSec * script.fps) <= script.durationInFrames,
          `${event.id}: voice note (${measuredSec.toFixed(2)} s) overruns durationInFrames`,
        );
        measuredVoiceDurations.set(event.id, measuredSec);
      }
    }

    if (event.type === "system") {
      fail(nonempty(event.text), `${event.id}: system message requires non-empty text`);
    }

    if (event.type === "notification") {
      fail(nonempty(event.title) && nonempty(event.body), `${event.id}: notification requires title and body`);
      fail(
        Number.isInteger(event.durationFrames) &&
          event.durationFrames > 0 &&
          event.at + event.durationFrames <= script.durationInFrames,
        `${event.id}: invalid notification durationFrames`,
      );
    }

    if (event.type === "call") {
      fail(nonempty(event.caller), `${event.id}: call requires caller`);
      fail(["incoming", "missed", "ended"].includes(event.status), `${event.id}: invalid call status`);
      fail(
        Number.isInteger(event.durationFrames) &&
          event.durationFrames > 0 &&
          event.at + event.durationFrames <= script.durationInFrames,
        `${event.id}: invalid call durationFrames`,
      );
    }

    if (event.type === "cctv") {
      checkAsset(event.src, `${event.id} cctv`);
      fail(nonempty(event.cameraLabel) && nonempty(event.timestampLabel), `${event.id}: cctv requires labels`);
      fail(
        Number.isInteger(event.durationFrames) &&
          event.durationFrames > 0 &&
          event.at + event.durationFrames <= script.durationInFrames,
        `${event.id}: invalid cctv durationFrames`,
      );
    }
  }

  // Reading-time minimum check per message event.
  for (let i = 0; i < script.events.length; i++) {
    const event = script.events[i];
    let readableText = null;
    if (event.type === "text" || event.type === "system") readableText = event.text;
    else if (event.type === "voice") readableText = event.subtitle;
    else if (event.type === "photo" && nonempty(event.caption)) readableText = event.caption;
    else if (event.type === "notification") readableText = `${event.title} ${event.body}`;
    if (readableText === null) continue;

    const words = countChatWords(readableText);
    const minFrames = minReadingHoldFrames(words, script.fps);
    const nextAt = script.events[i + 1]?.at ?? script.durationInFrames;
    const holdFrames = nextAt - event.at;
    fail(
      holdFrames >= minFrames,
      `${event.id}: reading hold ${holdFrames} frames (${(holdFrames / script.fps).toFixed(2)} s) is shorter than minimum ${minFrames} frames (${minReadingHoldSeconds(words).toFixed(2)} s for ${words} words)`,
    );
  }

  // Clue Ledger validation: non-empty, real event IDs, planted in first 40%, no redundant timestamps.
  fail(Array.isArray(script.clueLedger) && script.clueLedger.length > 0, "clueLedger must be a non-empty array");
  const maxPlantFrame = Math.floor(0.4 * script.durationInFrames);
  const clueEventIds = new Set();
  for (const [index, entry] of script.clueLedger.entries()) {
    fail(entry && typeof entry === "object", `clueLedger[${index}] must be an object`);
    fail(nonempty(entry.clue), `clueLedger[${index}]: clue description required`);
    fail(
      !Object.hasOwn(entry, "plantedAtSec") && !Object.hasOwn(entry, "paidOffAtSec"),
      `clueLedger[${index}]: do not hand-enter plantedAtSec/paidOffAtSec; timestamps are derived from event frames`,
    );
    const planted = eventsById.get(entry.plantedIn);
    const paidOff = eventsById.get(entry.paidOffIn);
    fail(Boolean(planted), `clueLedger[${index}]: plantedIn "${entry.plantedIn}" does not match any event id`);
    fail(Boolean(paidOff), `clueLedger[${index}]: paidOffIn "${entry.paidOffIn}" does not match any event id`);
    fail(
      planted.at <= maxPlantFrame,
      `clueLedger[${index}]: clue planted in "${entry.plantedIn}" at frame ${planted.at} (${((planted.at / script.durationInFrames) * 100).toFixed(1)}%) exceeds first 40% limit (frame ${maxPlantFrame})`,
    );
    fail(
      paidOff.at > planted.at,
      `clueLedger[${index}]: paidOffIn "${entry.paidOffIn}" (frame ${paidOff.at}) must occur after plantedIn "${entry.plantedIn}" (frame ${planted.at})`,
    );
    clueEventIds.add(entry.plantedIn);
    clueEventIds.add(entry.paidOffIn);
  }

  // In-world clock consistency: every event's timeLabel/timestampLabel must be <= the phone clock
  // at that frame, unless event.anomaly === true AND event.id is listed in clueLedger.
  for (const event of script.events) {
    if (event.anomaly === true) {
      fail(
        clueEventIds.has(event.id),
        `${event.id}: event marked anomaly: true must be referenced in clueLedger`,
      );
    }
    const clockLabel = event.type === "cctv" ? event.timestampLabel : event.timeLabel;
    if (clockLabel === undefined) continue;
    const check = isEventClockConsistent(script.startClock, event.at, script.fps, clockLabel);
    fail(!check.invalidFormat, `${event.id}: invalid clock label "${clockLabel}"`);
    if (!check.ok) {
      fail(
        event.anomaly === true && clueEventIds.has(event.id),
        `${event.id}: event clock "${clockLabel}" is ahead of phone clock "${check.phoneClock}" at frame ${event.at} (mark anomaly: true and list in clueLedger only for deliberate clues)`,
      );
    }
  }

  return {
    id: script.id,
    events: script.events.length,
    durationInFrames: script.durationInFrames,
    fps: script.fps,
    durationSec,
    voiceCount: measuredVoiceDurations.size,
    clues: script.clueLedger.length,
    assetsChecked: requireAssets,
  };
}

export function findActiveV3Scripts(dir) {
  if (!statSync(dir, {throwIfNoEntry: false})?.isDirectory()) return [];
  return readdirSync(dir, {withFileTypes: true}).flatMap((entry) => {
    if (entry.isDirectory()) return archivedDirPattern.test(entry.name) ? [] : findActiveV3Scripts(join(dir, entry.name));
    return entry.name === "chat-script.json" ? [join(dir, entry.name)] : [];
  });
}

function isPreAssetBriefDraft(scriptPath) {
  const statePath = join(dirname(scriptPath), "pipeline-state.json");
  if (!statSync(statePath, {throwIfNoEntry: false})?.isFile()) return false;
  const state = readJson(statePath);
  return state?.audio?.status === "pending" && state?.images?.status === "pending";
}

export function checkAllV3(root = process.cwd()) {
  const layoutSummary = validateV3Layout(V3_LAYOUT);
  const publicDir = resolve(root, "public");
  const episodeScripts = findActiveV3Scripts(resolve(root, "episodes"));
  const demoScriptPath = resolve(root, "src", "v3", "demo", "chat-script.json");
  const paths = [...episodeScripts];
  if (statSync(demoScriptPath, {throwIfNoEntry: false})?.isFile()) {
    paths.push(demoScriptPath);
  }
  paths.sort();

  const ids = new Set();
  const results = paths.map((filePath) => {
    const script = readJson(filePath);
    assert(!ids.has(script.id), `Duplicate v3 script ID: ${script.id}`);
    ids.add(script.id);
    const label = relative(root, filePath).split(sep).join("/");
    const preAssetDraft = filePath !== demoScriptPath && isPreAssetBriefDraft(filePath);
    const result = validateV3Script(script, {
      publicDir,
      layout: V3_LAYOUT,
      label,
      requireAssets: !preAssetDraft,
    });
    const note = preAssetDraft
      ? " [studio v3 brief draft — asset existence & voice duration checks pending asset generation]"
      : " [studio v3]";
    console.log(
      `${result.id}: ${result.events} events, ${result.voiceCount} voice notes verified, ${result.clues} clue(s), ${result.durationInFrames} frames (${result.durationSec.toFixed(2)} s)${note}`,
    );
    return result;
  });

  console.log(
    `Studio v3 layout verified: ${layoutSummary.fontCount} font constants >= ${V3_MIN_FONT_SIZE} px, ${layoutSummary.criticalRegionCount} critical regions inside safe zone (y >= ${layoutSummary.minCriticalY}, x <= ${layoutSummary.maxX}, y <= ${layoutSummary.maxY})`,
  );
  return results;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  checkAllV3();
}
