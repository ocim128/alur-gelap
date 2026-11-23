import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {existsSync, readFileSync, readdirSync, realpathSync, statSync} from "node:fs";
import {join, relative, resolve, sep} from "node:path";
import {fileURLToPath} from "node:url";
import {studioTimingError} from "../src/studio-v2-timing.mjs";
import {countNarrationWords} from "./count-narration-words.mjs";

const isFrame = (v) => Number.isInteger(v) && v >= 0;
const nonempty = (v) => typeof v === "string" && v.trim().length > 0;
const unit = (v) => Number.isFinite(v) && v >= 0 && v <= 1;
const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));
const digest = (data) => createHash("sha256").update(data).digest("hex");
const styleId = "gritty-dark-anime-comic";
const assetBatchDir = (manifestPath) => `assets/${manifestPath.slice(0, -"/manifest.json".length)}`;
// Documented legacy Episodes 001-003 keep their archived all-caps comic SFX lines
// (BRAK!, KLIK!) — the cue-sheet rule applies to studio v2 episodes from 004 on.
const legacyEpisodes = new Set(["001-kamar-terkunci", "002-rumah-tengah-hutan", "003-goyangan-dek-enam"]);
// Episodes 001-005 were produced before the 2026-11-23 word-budget recalibration
// (245–265 -> 225–245 canonical words) and the hook gates; they stay valid under
// the earlier bounds. New episodes use the recalibrated band and hook gates.
const grandfatheredEpisodes = new Set([...legacyEpisodes, "004-tangan-pilot-kemarin", "005-sabuk-ketiga"]);
// Directory names that hold provenance/archived copies, never active manifests.
const archivedDirPattern = /^(?:archive|archives|backup|backups|snapshot|snapshots|old|attic|sources|pre-.+|.+-before)$/i;
const comparisonManifests = new Map([
  ["001-kemacetan-terakhir/manifest.json", "6a8fc50c2866838e826378c74807190da4606aa7f795c4db2e653094c5364a40"],
  ["001-kemacetan-terakhir/recut-v2/manifest.json", "2bf61aa0f37995353474339debf5457c27bfedaecff26be783a97d57b2086f42"],
  ["001-kemacetan-terakhir/recut-v2-alternate/manifest.json", "8770fdf453b9c33adab467f10abd448acb75265b4c76a6b480cb0256fe01bcf2"],
  ["001-kemacetan-terakhir/attempt-05/manifest.json", "3b9c322738c5dd01398eedac8e52ccc29882296a2d7f2337c5087056cc1f8280"],
]);
// Only a file named exactly manifest.json counts; manifest.previous.json,
// manifest.snapshot.json and friends are backups by construction.
const activeManifestName = "manifest.json";

export function findActiveManifests(dir) {
  return readdirSync(dir, {withFileTypes: true}).flatMap(entry => {
    if (entry.isDirectory()) return archivedDirPattern.test(entry.name) ? [] : findActiveManifests(join(dir, entry.name));
    return entry.name === activeManifestName ? [join(dir, entry.name)] : [];
  });
}

/** narasi.txt comic-SFX lint: ALL-CAPS runs of 3+ characters ending in "!" (BRAK!, KLIK!) belong in the cue sheet, never in narration. */
export function findComicSfxTokens(scriptText) {
  return String(scriptText).match(/[A-Z]{3,}!+/gu) ?? [];
}

function checkEditorial(scenes, fps, twistAt, fail, studioV2) {
  const visible = scenes.filter(scene => scene.editorial.protagonist !== "absent");
  fail(5 * visible.length >= 2 * scenes.length, `protagonist appears in ${visible.length}/${scenes.length} shots; at least 40% required`);
  fail(visible.some(scene => scene.at < 3 * fps), "opening 0–3 s needs a visible protagonist");
  const reactions = visible.filter(scene => scene.editorial.protagonist === "reaction");
  if (!studioV2) fail(reactions.filter(scene => scene.at >= 12 * fps && scene.at < 55 * fps).length >= 2,
    "12–55 s needs at least two protagonist reaction/action shots");
  const reveal = scenes.findIndex(scene => scene.at === twistAt);
  fail(reveal > 0, `final reveal must start a shot at twist frame ${twistAt}`);
  const anticipation = scenes[reveal - 1];
  fail(anticipation.editorial.protagonist === "reaction",
    `${anticipation.id}: final reveal needs a visible protagonist reaction in the immediately preceding shot`);
}

function alphaCapable(path) {
  const data = readFileSync(path);
  if (data.length >= 26 && data.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return [4, 6].includes(data[25]) || data.includes(Buffer.from("tRNS"));
  if (data.length >= 25 && data.toString("ascii", 0, 4) === "RIFF" && data.toString("ascii", 8, 12) === "WEBP") {
    const chunk = data.toString("ascii", 12, 16);
    if (chunk === "VP8X") return !!(data[20] & 0x10);
    if (chunk === "VP8L" && data.length >= 25) return !!(data[24] & 0x10);
  }
  return false;
}

export function validateEpisode(manifest, captions, {publicDir, manifestPath, batchRoots = [], episodesDir = null} = {}) {
  const {id, duration, fps, narration, beds, scenes} = manifest;
  const episodeSlug = manifestPath?.split("/")[0];
  const prefix = `${id ?? manifestPath ?? "episode"}: `;
  const fail = (condition, message) => assert(condition, prefix + message);
  const comparison = comparisonManifests.has(manifestPath) &&
    comparisonManifests.get(manifestPath) === digest(JSON.stringify(manifest));
  const legacyFactoryCut = comparison || manifestPath?.startsWith("001-kemacetan-terakhir/");
  const warnings = [];
  const factoryCheck = (condition, message) => {
    if (condition) return;
    if (legacyFactoryCut) warnings.push(message);
    else fail(false, message);
  };
  const pipelineVersion = manifest.pipelineVersion === undefined ? 1 : manifest.pipelineVersion;
  fail(pipelineVersion === 1 || (pipelineVersion === 2 && manifest.schemaVersion === 2 && !legacyFactoryCut),
    "invalid pipelineVersion for this manifest");
  const studioV2 = pipelineVersion === 2;
  const strict = manifest.schemaVersion === 2 && !comparison;
  if (strict) fail(typeof manifestPath === "string" && /^(?:[\w-]+\/)+manifest\.json$/.test(manifestPath),
    "expected an episode-relative manifest path to determine the asset folder");
  const batchDir = strict ? assetBatchDir(manifestPath) : null;
  const childBatches = strict ? batchRoots.filter(root => root.startsWith(batchDir + "/")) : [];
  const batchAssets = new Map();
  const asset = (name, context) => {
    fail(nonempty(name) && typeof publicDir === "string", `${context}: invalid asset path`);
    const full = resolve(publicDir, name);
    fail(full.startsWith(resolve(publicDir) + sep) && statSync(full, {throwIfNoEntry: false})?.isFile(), `${context}: missing asset ${name}`);
    return full;
  };
  const batchAsset = (name, context, sharedSfx = false) => {
    const full = asset(name, context);
    if (strict) {
      const root = sharedSfx && name.startsWith("sfx/") ? "sfx" : batchDir;
      const canonical = relative(publicDir, full).split(sep).join("/");
      const physicalPublic = realpathSync(publicDir);
      const physical = relative(physicalPublic, realpathSync(full)).split(sep).join("/");
      fail(canonical === name && physical === name && name.startsWith(root + "/"),
        `${context}: asset ${name} must be in public/${batchDir}/${sharedSfx ? " or public/sfx/" : ""}`);
      fail(!childBatches.some(child => name.startsWith(child + "/")),
        `${context}: asset ${name} belongs to a nested attempt's batch`);
    }
    return full;
  };
  const clip = (c, available, name, sharedSfx = false) => {
    fail(c && typeof c === "object", `${name}: missing clip`);
    batchAsset(c.asset, name, sharedSfx);
    fail(isFrame(c.at) && isFrame(c.duration) && c.duration > 0 && c.at + c.duration <= available, `${name}: invalid frame interval ${c.at}+${c.duration}/${available}`);
    fail(Number.isFinite(c.gain) && c.gain >= 0 && c.gain <= 1, `${name}: invalid gain`);
  };
  fail(nonempty(id) && /^[a-zA-Z0-9-]+$/.test(id), "invalid composition id");
  fail(isFrame(fps) && fps > 0 && isFrame(duration) && duration > 0, "invalid duration/fps");
  if (studioV2) {
    batchAsset(manifest.soundMix?.asset, "playback mix");
    if (manifest.soundMix.sampleRate !== undefined) fail(Number.isInteger(manifest.soundMix.sampleRate) && manifest.soundMix.sampleRate > 0, "invalid playback sample rate");
    const timing = manifest.timing ?? {blackoutFrame: manifest.blackoutFrame, rewindFrame: manifest.rewindFrame, rewindFrames: manifest.rewindFrames};
    const timingError = studioTimingError(timing, duration, fps);
    fail(!timingError, timingError);
    if (["branch-rewind", "both"].includes(manifest.script?.engine)) fail(timing.rewindFrame !== undefined || timing.branchRewinds !== undefined, "branch-rewind requires rewind timing");
    if (manifest.script?.engine === "triple-branch-rewind") {
      fail(timing.branchRewinds?.length === 3, "triple-branch-rewind requires exactly three branchRewinds intervals");
      fail(timing.branchRewinds.every(({startFrame, endFrame}) => endFrame - startFrame === Math.max(1, Math.round(fps * 0.4))), "triple-branch-rewind intervals must last 0.4 s rounded to frames");
      const runtimeSeconds = duration / fps;
      fail(runtimeSeconds >= 145 && runtimeSeconds <= 160,
        `triple-branch-rewind runtime ${runtimeSeconds.toFixed(2)} s is outside the 145–160 s band`);
      // Word band recalibrated 2026-11-23 (measured ~1.70 w/s delivery + rewinds +
      // dread silence + tail): Episodes 001-005 stay on the grandfathered band.
      const grandfathered = episodeSlug !== undefined && grandfatheredEpisodes.has(episodeSlug);
      const [wordLow, wordHigh] = grandfathered ? [245, 265] : [225, 245];
      fail(Number.isInteger(manifest.script?.wordCount) && manifest.script.wordCount >= wordLow && manifest.script.wordCount <= wordHigh,
        `triple-branch-rewind spoken word count ${JSON.stringify(manifest.script?.wordCount ?? null)} is outside the ${wordLow}–${wordHigh} band${grandfathered ? " (grandfathered)" : ""}`);
    }
    for (const [name, value] of Object.entries(timing)) {
      if (name.endsWith("Frame")) fail(isFrame(value) && value < duration, `${name}: invalid cue frame`);
      if (name.endsWith("SampleOffset")) fail(Number.isInteger(value), `${name}: invalid sample offset`);
      if (name.endsWith("SilenceFrames")) fail(Array.isArray(value) && value.length === 2 && isFrame(value[0]) && isFrame(value[1]) && value[0] < value[1] && value[1] <= duration, `${name}: invalid silence interval`);
    }
  }
  if (manifest.tensionRamp !== undefined) {
    const r = manifest.tensionRamp;
    fail(r && Number.isFinite(r.startSec) && r.startSec >= 0 && Number.isFinite(r.endSec) && r.endSec > r.startSec && r.endSec * fps <= duration && unit(r.extraScale) && unit(r.vignetteStrength), "invalid tensionRamp");
  }
  if (manifest.finalJolt !== undefined) {
    const j = manifest.finalJolt;
    fail(j && Number.isFinite(j.triggerSec) && j.triggerSec >= 0 && Number.isFinite(j.durationSec) && j.durationSec > 0 && (j.handoffSec === undefined || (Number.isFinite(j.handoffSec) && j.handoffSec >= 0)) && Number.isFinite(j.blackoutSec) && j.blackoutSec > 0 && Math.round(j.triggerSec * fps) + Math.round(j.durationSec * fps) + Math.round((j.handoffSec ?? 0) * fps) + Math.round(j.blackoutSec * fps) <= duration, "invalid finalJolt timing or clipped blackout");
    fail([j.zoomFrom, j.zoomTo].every(v => Number.isFinite(v) && v > 0) && [j.shakePx, j.shakeDecayMs, j.rgbSplitPx].every(v => Number.isFinite(v) && v >= 0) && Number.isInteger(j.flashFrames) && j.flashFrames >= 0, "invalid finalJolt effect settings");
    if (j.joltImageSrc !== undefined) {
      batchAsset(j.joltImageSrc, "finalJolt image");
      if (strict) fail(manifest.art?.rasterAssets?.[j.joltImageSrc] === manifest.art?.styleId, "finalJolt image: missing or mixed style ID");
    }
  }
  if (manifest.arcEpisode !== undefined) {
    fail(Number.isInteger(manifest.arcEpisode) && manifest.arcEpisode >= 1 && manifest.arcEpisode <= 7,
      "arcEpisode must be an integer from 1 to 7");
    fail(Array.isArray(manifest.characterSheets) && manifest.characterSheets.length > 0,
      "arcEpisode requires at least one characterSheets path");
    for (const sheet of manifest.characterSheets) asset(sheet, "character sheet");
  }
  const baseline = manifest.schemaVersion === undefined && comparison;
  const v2 = manifest.schemaVersion === 2;
  fail(baseline || v2, "unsupported or missing schema version (only the exact comparison cut is grandfathered)");
  if (studioV2 && (duration < 90 * fps || duration > 210 * fps)) {
    warnings.push("episode duration is outside the 90–210 s studio v2 target");
  }
  if (!studioV2) for (const [label, frames] of [["episode", duration], ["narration", narration?.duration]]) {
    if (isFrame(frames) && frames > 0) {
      const seconds = frames / fps;
      if (frames < 61 * fps || frames > 78 * fps)
        warnings.push(`${label} duration ${seconds.toFixed(3)} s is outside the 61–78 s warning guardrail`);
    }
  }
  if (manifest.openingTitle !== undefined || !legacyFactoryCut) {
    const words = nonempty(manifest.openingTitle)
      ? manifest.openingTitle.trim().split(/\s+/u).filter(word => /[\p{L}\p{N}]/u.test(word)).length
      : 0;
    factoryCheck(words >= 3 && words <= 4, "openingTitle must contain 3–4 words");
  }
  if (v2) {
    asset("fonts/theboldfont.ttf", "caption font");
    if (studioV2) {
      const script = manifest.script;
      fail(script?.format === "decision-consequence" && ["branch-rewind", "triple-branch-rewind", "earned-consequence", "both"].includes(script.engine),
        "studio v2 requires a decision-consequence script engine");
      fail(script.hook?.at === 0 && nonempty(script.hook.line), "invalid hook at frame 0");
      const ending = script.ending;
      fail(isFrame(ending?.at) && ending.at > 0 && isFrame(ending.twistAt) && ending.twistAt >= ending.at &&
        ending.twistAt < duration && nonempty(ending.payoff), "invalid ending/twist");
      if (script.wordCount !== undefined) {
        fail(Number.isInteger(script.wordCount) && script.wordCount > 0, "invalid spoken word count");
        if (script.wordCount < 200 || script.wordCount > 480) warnings.push("spoken word count is outside the 200–480 word studio v2 target");
      }
      // narasi.txt ALL-CAPS comic-SFX lint. All-caps exclamations (BRAK!, KLIK!) are
      // cue-sheet sounds; the narrator must never read them. Documented legacy
      // Episodes 001–003 keep their archived scripts and are exempt.
      if (episodesDir && episodeSlug && !legacyEpisodes.has(episodeSlug)) {
        const narasiPath = resolve(episodesDir, manifestPath.slice(0, -"manifest.json".length), "narasi.txt");
        fail(existsSync(narasiPath), `missing narasi.txt for a studio v2 episode (expected ${relative(episodesDir, narasiPath)})`);
        if (existsSync(narasiPath)) {
          const sfxTokens = findComicSfxTokens(readFileSync(narasiPath, "utf8"));
          fail(sfxTokens.length === 0,
            `narasi.txt contains ${sfxTokens.length} ALL-CAPS comic SFX token(s) (${[...new Set(sfxTokens)].join(", ")}); route them to the foley cue sheet instead of the narration script`);
        }
      }
      // Hook gates for new studio v2 episodes (Episodes 001–005 grandfathered):
      // the opening hook is at most 6 canonical words, and the brief pre-authorizes
      // a trim fallback (or states "none needed") so the measured ≤3.0 s gate in
      // scripts/prepare-narration.mjs always has a documented action to take.
      if (episodesDir && episodeSlug && !grandfatheredEpisodes.has(episodeSlug)) {
        const hookWords = countNarrationWords(String(script.hook?.line ?? "")).words;
        fail(nonempty(script.hook?.line) && hookWords <= 6,
          `hook ${JSON.stringify(script.hook?.line ?? null)} counts ${hookWords} canonical words; the opening hook must be at most 6 words`);
        const briefPath = resolve(episodesDir, manifestPath.slice(0, -"manifest.json".length), "brief.md");
        fail(existsSync(briefPath), `missing brief.md for a studio v2 episode (expected ${relative(episodesDir, briefPath)})`);
        const fallbackMatch = existsSync(briefPath)
          ? readFileSync(briefPath, "utf8").match(/\*\*Hook trim fallback\*\* —(.+)/)
          : null;
        fail(fallbackMatch !== null && fallbackMatch[1].trim().length > 0,
          `missing or empty "Hook trim fallback" field in brief.md; pre-authorize the filler-word trim (or state "none needed")`);
      }
    } else {
      if (legacyFactoryCut) {
        fail(duration >= 60 * fps && duration <= 72 * fps, `duration ${duration} frames must be 60–72 s`);
      } else {
        fail(duration >= 62 * fps && duration <= 75 * fps, `episode duration ${duration} frames must be 62–75 s`);
        fail(isFrame(narration?.duration) && narration.duration >= 60 * fps && narration.duration <= 73 * fps,
          "prepared narration duration must be 60–73 s");
      }
      const s = manifest.script;
      fail(s?.format === "survival-tactics-curiosity-gap", "invalid script format");
      fail(s.hook?.at === 0 && nonempty(s.hook.line), "invalid hook at frame 0");
      fail(s.promise?.at === 3 * fps && nonempty(s.promise.line) && nonempty(s.promise.openLoop), `invalid promise at frame ${3 * fps}`);
      fail(s.tactics?.at === 12 * fps && Array.isArray(s.tactics.steps) && s.tactics.steps.length >= 2, "invalid tactical steps");
      let previous = 12 * fps - 1;
      s.tactics.steps.forEach((step, i) => {
        fail(step.number === i + 1 && isFrame(step.at) && step.at > previous && step.at >= 12 * fps && step.at < 55 * fps && nonempty(step.line) && nonempty(step.detail), `invalid tactical step ${i + 1} at ${step.at}`);
        previous = step.at;
      });
      fail(s.ending?.at === 55 * fps && isFrame(s.ending.twistAt) && s.ending.twistAt > 55 * fps && s.ending.twistAt <= (legacyFactoryCut ? 70 : 74) * fps && s.ending.twistAt < duration && nonempty(s.ending.payoff), "invalid ending/twist");
    }
    const expectedStyle = studioV2 ? "urban-silhouette-noir" : styleId;
    fail(nonempty(manifest.art?.styleId) && manifest.art.rasterAssets && typeof manifest.art.rasterAssets === "object", "missing art style map");
    if (strict) fail(manifest.art.styleId === expectedStyle, `art.styleId must be ${expectedStyle}`);
    for (const [path, style] of Object.entries(manifest.art.rasterAssets)) {
      batchAsset(path, "art style map");
      fail(style === manifest.art.styleId, `art style map: missing or mixed style ID for ${path}`);
    }
  }
  fail(Array.isArray(scenes) && scenes[0]?.at === 0 && Array.isArray(beds), "missing scenes, beds, or scene at frame zero");
  clip(narration, duration, "narration");
  if (studioV2 && (scenes.length < 15 || scenes.length > 28)) {
    warnings.push("scene count is outside the 15–28 panel studio v2 planning range");
  }
  const sceneIds = new Set();
  const plateUses = [];
  const firstRasterUses = new Map();
  const reportedRasterRepeats = new Set();
  const activity = [];
  const activityInterval = (start, end) => {if (end > start) activity.push([start, end]);};
  const point = (p) => p && unit(p.x) && unit(p.y);
  const box = (b) => point(b) && unit(b.width) && unit(b.height) && b.width > 0 && b.height > 0 && b.x + b.width <= 1 && b.y + b.height <= 1;
  const raster = (path, context) => {
    const full = batchAsset(path, context);
    if (v2) fail(manifest.art.rasterAssets[path] === manifest.art.styleId, `${context}: missing or mixed style ID for ${path}`);
    const first = firstRasterUses.get(full);
    if (!first) firstRasterUses.set(full, context);
    else if (!reportedRasterRepeats.has(full)) {
      factoryCheck(false, `${context}: repeated image asset ${path} (first used at ${first})`);
      reportedRasterRepeats.add(full);
    }
    if (!batchAssets.has(full)) batchAssets.set(full, {path, fingerprint: digest(readFileSync(full))});
    return full;
  };
  for (const [index, scene] of scenes.entries()) {
    const end = scenes[index + 1]?.at ?? duration;
    const length = end - scene.at;
    fail(isFrame(scene.at) && isFrame(end) && length > 0 && end <= duration, `${scene.id}: invalid scene interval ${scene.at}–${end}`);
    fail(nonempty(scene.id) && !sceneIds.has(scene.id), `duplicate/missing scene id ${scene.id}`); sceneIds.add(scene.id);
    if (studioV2 && scene.atCue !== undefined) fail(nonempty(scene.atCue) && scene.at === manifest.timing?.[scene.atCue], `${scene.id}: scene start differs from named cue ${scene.atCue}`);
    const plate = raster(scene.plate, `${scene.id} plate`);
    if (strict) plateUses.push({scene, fingerprint: batchAssets.get(plate).fingerprint});
    fail(scene.camera?.from && scene.camera?.to && [scene.camera.from, scene.camera.to].every(c => Number.isFinite(c.scale) && c.scale > 0 && Number.isFinite(c.x) && Number.isFinite(c.y)), `${scene.id}: invalid camera`);
    if (studioV2 && length <= 9 * fps && ["x", "y", "scale"].some(key => scene.camera.from[key] !== scene.camera.to[key])) {
      activityInterval(scene.at, end);
    }
    let previousReframeEnd = 0;
    for (const r of scene.reframes ?? []) {
      fail(isFrame(r.at) && isFrame(r.duration) && r.duration > 0 && r.at >= previousReframeEnd && r.at + r.duration <= length && Number.isFinite(r.scale) && r.scale > 0 && Number.isFinite(r.x) && Number.isFinite(r.y), `${scene.id}: invalid reframe`);
      activityInterval(scene.at + r.at, scene.at + r.at + r.duration);
      previousReframeEnd = r.at + r.duration;
    }
    let layers = scene.layers ?? [];
    if (v2) {
      fail(!("layers" in scene) && !("label" in scene), `${scene.id}: legacy layers/label are forbidden`);
      fail(scene.characters?.mode === "baked" || scene.characters?.mode === "masked", `${scene.id}: invalid character mode`);
      fail(Array.isArray(scene.hud), `${scene.id}: hud must be an array`);
      if (strict) {
        const e = scene.editorial;
        fail(e && ["absent", "visible", "reaction"].includes(e.protagonist) &&
          ["character-emotion", "threat-proximity", "tactical-hud"].includes(e.purpose) && nonempty(e.evidence),
          `${scene.id}: expected editorial protagonist, shot purpose, and visible evidence`);
        if (e.purpose === "character-emotion") fail(e.protagonist !== "absent",
          `${scene.id}: character-emotion requires the visible protagonist`);
        if (e.purpose === "tactical-hud") fail(scene.hud.some(h =>
          ["radarDiagram", "blueprintOverlay", "supplyChecklist"].includes(h?.type) ||
          (h?.type === "tacticalCallout" && Array.isArray(h.guide))),
          `${scene.id}: tactical-hud requires a diagram, checklist, or plotted guide`);
      }
      if (scene.characters.mode === "baked") fail(!("layers" in scene.characters) && !("foreground" in scene.characters), `${scene.id}: baked scene has cutouts`);
      if (scene.characters.mode === "masked") {
        layers = scene.characters.layers;
        fail(Array.isArray(layers) && layers.length > 0, `${scene.id}: masked scene needs character layers`);
        const fg = raster(scene.characters.foreground, `${scene.id} foreground`);
        fail(alphaCapable(fg), `${scene.id}: foreground is not alpha-capable`);
      }
      fail(scene.cameraPreset === undefined || ["slow-push", "punch-in", "dread-drift", "impact-shake"].includes(scene.cameraPreset), `${scene.id}: invalid camera preset`);
      if (scene.cameraPreset === "punch-in") activityInterval(scene.at, scene.at + Math.min(16, length));
      if (scene.cameraPreset === "impact-shake") activityInterval(scene.at, scene.at + Math.min(14, length));
      const hudIds = new Set();
      for (const h of scene.hud) {
        const where = `${scene.id}/${h.id ?? "HUD"}`;
        fail(nonempty(h.id) && !hudIds.has(h.id), `${where}: duplicate/missing HUD id`); hudIds.add(h.id);
        fail(["timestampBadge", "tacticalCallout", "supplyChecklist", "radarDiagram", "blueprintOverlay"].includes(h.type), `${where}: unknown HUD type`);
        fail(isFrame(h.at) && isFrame(h.duration) && h.duration > 0 && h.at + h.duration <= length && Number.isInteger(h.revealFrames) && h.revealFrames > 0 && h.revealFrames <= h.duration, `${where}: invalid HUD timing ${h.at}+${h.duration} of ${length}`);
        if (h.type === "timestampBadge" || h.type === "tacticalCallout") fail(nonempty(h.text), `${where}: missing text`);
        if (h.type !== "timestampBadge") fail(box(h.box), `${where}: out-of-bounds box`);
        if (h.type === "tacticalCallout" && h.guide !== undefined) fail(Array.isArray(h.guide) && h.guide.length === 2 && h.guide.every(point) && JSON.stringify(h.guide[0]) !== JSON.stringify(h.guide[1]), `${where}: invalid guide`);
        if (h.type === "supplyChecklist") fail(Array.isArray(h.items) && h.items.length > 0 && h.items.every(item => nonempty(item.label) && nonempty(item.display) && unit(item.value)), `${where}: invalid checklist`);
        if (h.type === "radarDiagram" || h.type === "blueprintOverlay") fail(Array.isArray(h.paths) && h.paths.length > 0 && h.paths.every(path => Array.isArray(path.points) && path.points.length >= 2 && path.points.every(point) && path.points.some(p => p.x !== path.points[0].x || p.y !== path.points[0].y)), `${where}: invalid diagram path`);
        activityInterval(scene.at + h.at, scene.at + h.at + h.revealFrames);
        if (h.at + h.duration < length) activityInterval(scene.at + h.at + h.duration, scene.at + h.at + h.duration + 1);
      }
    }
    fail(Array.isArray(layers), `${scene.id}: invalid character layers`);
    for (const l of layers) {
      raster(l.asset, `${scene.id} layer`);
      fail(Number.isFinite(l.x) && Number.isFinite(l.y) && Number.isFinite(l.width) && l.width > 0, `${scene.id}: invalid layer geometry`);
      if (l.enter) {
        fail(isFrame(l.enter.at) && Number.isInteger(l.enter.duration) && l.enter.duration > 0 && l.enter.at + l.enter.duration <= length && Number.isFinite(l.enter.x) && Number.isFinite(l.enter.y), `${scene.id}: invalid layer entrance`);
        if (l.enter.x !== 0 || l.enter.y !== 0) activityInterval(scene.at + l.enter.at, scene.at + l.enter.at + l.enter.duration);
      }
    }
    for (const cue of scene.cues ?? []) {
      fail(cue.at < length, `${scene.id}/${cue.name}: cue starts outside scene`);
      clip(cue, duration - scene.at, `${scene.id}/${cue.name}`, true);
    }
    for (const [name, event] of [["hit", scene.hit], ["blackout", scene.blackout]]) if (event) {
      fail(isFrame(event.at) && Number.isInteger(event.duration) && event.duration > 0 && event.at + event.duration <= length, `${scene.id}: invalid ${name} interval`);
      if ((name === "hit" && event.strength > 0) || (name === "blackout" && event.opacity > 0)) activityInterval(scene.at + event.at, scene.at + event.at + event.duration);
    }
    if (scene.lightUp) {
      const l = scene.lightUp;
      fail(isFrame(l.at) && Number.isInteger(l.duration) && l.duration > 0 && l.at + l.duration <= length && unit(l.minBrightness) && (l.sweep === undefined || (unit(l.sweep.fromX) && unit(l.sweep.toX) && unit(l.sweep.y))) && (l.offMask === undefined || (unit(l.offMask.x) && unit(l.offMask.y) && unit(l.offMask.radiusX) && l.offMask.radiusX > 0 && unit(l.offMask.radiusY) && l.offMask.radiusY > 0)), `${scene.id}: invalid lightUp interval`);
      activityInterval(scene.at + l.at, scene.at + l.at + l.duration);
    }
    if (v2 && index > 0) {
      const prev = scenes[index - 1];
      const distinct = prev.plate !== scene.plate || JSON.stringify(prev.characters) !== JSON.stringify(scene.characters) || JSON.stringify(prev.camera.to) !== JSON.stringify(scene.camera.from);
      if (distinct) activityInterval(scene.at, scene.at + 1);
    }
  }
  for (const bed of beds) {clip(bed, duration, bed.name, true); fail(isFrame(bed.fadeIn) && isFrame(bed.fadeOut) && bed.fadeIn + bed.fadeOut <= bed.duration, `${bed.name}: invalid fades`);}
  if (v2) {
    activity.sort((a, b) => a[0] - b[0]);
    let cursor = 0;
    for (const [start, end] of [...activity, [duration, duration]]) {
      fail(2 * (start - cursor) <= 5 * fps, `plain still ${cursor}–${start} (${start - cursor} frames) exceeds 2.5 s`);
      cursor = Math.max(cursor, end);
    }
  }
  if (strict) {
    checkEditorial(scenes, fps, manifest.script.ending.twistAt, fail, studioV2);
    const previousByPlate = new Map();
    for (const {scene, fingerprint} of plateUses) {
      const previous = previousByPlate.get(fingerprint);
      fail(!previous || scene.at - previous.at >= 15 * fps,
        `${scene.id}: repeats the static plate from ${previous?.id} within 15 s (frames ${previous?.at} and ${scene.at})`);
      previousByPlate.set(fingerprint, scene);
    }
  }
  fail(Array.isArray(captions) && captions.length > 0, "caption array is empty");
  let previousEnd = 0;
  for (const [i, c] of captions.entries()) {
    fail(Number.isFinite(c.startMs) && Number.isFinite(c.endMs) && c.startMs >= previousEnd && c.endMs > c.startMs && c.endMs <= narration.duration * 1000 / fps && Math.ceil(c.startMs * fps / 1000) < Math.ceil(c.endMs * fps / 1000), `caption ${i}: invalid timing ${c.startMs}–${c.endMs} ms`);
    if (v2) {
      fail(!("text" in c) && !("emphasis" in c), `caption ${i}: legacy text/emphasis forbidden`);
      fail(Array.isArray(c.words) && c.words.length > 0 && c.words.length <= 4, `caption ${i}: requires 1–4 words`);
      for (const word of c.words) fail(nonempty(word.text) && !/\s/u.test(word.text) && /[\p{L}\p{N}]/u.test(word.text) && (word.color === undefined || ["white", "yellow", "red", "default", "highlight", "danger"].includes(word.color)), `caption ${i}: invalid word or color`);
    } else {
      fail(nonempty(c.text), `caption ${i}: empty text`);
      fail(c.emphasis === undefined || (nonempty(c.emphasis) && c.text.includes(c.emphasis)), `caption ${i}: invalid emphasis`);
    }
    previousEnd = c.endMs;
  }
  return {id, scenes: scenes.length, captions: captions.length, duration, fps, baseline, comparison, warnings, rasters: [...batchAssets.values()]};
}

function findManifests(dir) {
  // Active manifests only: exact `manifest.json` filenames outside archived/backup
  // directories. `manifest.previous.json`/`manifest.snapshot.json` files and
  // provenance folders never enter the scan, so backup copies can never trigger
  // duplicate composition ID or asset errors.
  return findActiveManifests(dir);
}

export function validatePipelineState(state, label = "pipeline-state.json") {
  assert(state && typeof state === "object" && !Array.isArray(state), `${label}: expected a state object`);
  for (const stage of ["brief", "audio", "images", "render", "audit", "publish"]) {
    const entry = state[stage];
    assert(entry && typeof entry === "object" && !Array.isArray(entry), `${label}: missing ${stage} stage`);
    assert(["pending", "ready", "pass", "fail"].includes(entry.status), `${label}: invalid ${stage} status`);
    assert(typeof entry.notes === "string", `${label}: ${stage} notes must be a string`);
    // Older episodes have status and notes only. A structured record is all-or-nothing.
    const fields = ["technicalVerdict", "ownerDisposition", "handoffAllowed", "exceptions"];
    if (!fields.some(field => Object.hasOwn(entry, field))) continue;
    const context = `${label}: ${stage}`;
    const {technicalVerdict, ownerDisposition, handoffAllowed, exceptions} = entry;
    assert(["pass", "fail"].includes(technicalVerdict), `${context}: technicalVerdict must be pass or fail`);
    assert(entry.status === technicalVerdict, `${context}: status must match technicalVerdict`);
    assert(["pending", "approved", "approved_with_exceptions", "rejected"].includes(ownerDisposition), `${context}: invalid ownerDisposition`);
    assert(typeof handoffAllowed === "boolean", `${context}: handoffAllowed must be a boolean`);
    assert(Array.isArray(exceptions), `${context}: exceptions must be an array`);

    const approved = ownerDisposition === "approved";
    const waived = ownerDisposition === "approved_with_exceptions";
    if (approved) assert(technicalVerdict === "pass", `${context}: approved requires a technical pass`);
    if (waived) assert(technicalVerdict === "fail" && exceptions.length > 0, `${context}: approved_with_exceptions requires a technical fail and at least one exception`);
    else assert(exceptions.length === 0, `${context}: exceptions require approved_with_exceptions`);
    assert(handoffAllowed === (approved || waived), `${context}: handoffAllowed must match ownerDisposition`);

    for (const [index, exception] of exceptions.entries()) {
      const location = `${context}.exceptions[${index}]`;
      assert(exception && typeof exception === "object" && !Array.isArray(exception), `${location}: expected an exception object`);
      for (const field of ["panel", "defect", "evidence", "downstreamVerify"]) {
        assert(nonempty(exception[field]), `${location}: ${field} must be a nonempty string`);
      }
      if (stage === "images") {
        assert(["absent", "present_unreadable_at_phone_size", "present_conflicting_state"].includes(exception.defect), `${location}: invalid image defect label`);
      }
    }
  }
}

export function checkAll(root = process.cwd()) {
  const episodeDir = resolve(root, "episodes"), publicDir = resolve(root, "public"), ids = new Set();
  const templateState = resolve(root, "templates", "pipeline-state.json");
  if (statSync(templateState, {throwIfNoEntry: false})?.isFile()) validatePipelineState(readJson(templateState), templateState);
  for (const entry of readdirSync(episodeDir, {withFileTypes: true})) if (entry.isDirectory()) {
    const statePath = join(episodeDir, entry.name, "pipeline-state.json");
    if (statSync(statePath, {throwIfNoEntry: false})?.isFile()) validatePipelineState(readJson(statePath), statePath);
  }
  const paths = findManifests(episodeDir).sort().map(path => ({
    path, manifestPath: relative(episodeDir, path).split(sep).join("/").replace(/^arc1\//, ""),
  }));
  assert(paths.length > 0, "No episode manifests found");
  const batchRoots = paths.map(({manifestPath}) => assetBatchDir(manifestPath));
  const batches = new Map();
  return paths.map(({path, manifestPath}) => {
    const manifest = readJson(path);
    assert(typeof manifest.captions === "string" && /^[\w-]+\.json$/.test(manifest.captions), `Invalid captions path: ${path}`);
    assert(!ids.has(manifest.id), `Duplicate composition ID: ${manifest.id}`); ids.add(manifest.id);
    const result = validateEpisode(manifest, readJson(join(path, "..", manifest.captions)), {publicDir, manifestPath, batchRoots, episodesDir: episodeDir});
    const episode = manifestPath.split("/")[0];
    const owners = batches.get(episode) ?? new Map();
    batches.set(episode, owners);
    for (const raster of result.rasters) {
      const previous = owners.get(raster.fingerprint);
      if (previous && previous.manifestPath !== manifestPath && (!previous.comparison || !result.comparison)) {
        assert.fail(`${result.id}: same raster bytes in different attempts: ${previous.path} (${previous.manifestPath}) and ${raster.path} (${manifestPath})`);
      }
      if (!previous) owners.set(raster.fingerprint, {...raster, manifestPath, comparison: result.comparison});
    }
    for (const warning of result.warnings) console.warn(`[warning] ${result.id}: ${warning}`);
    console.log(`${result.id}: ${result.scenes} scenes, ${result.captions} captions, ${result.duration} frames (${(result.duration / result.fps).toFixed(2)} s)${result.comparison ? " [comparison]" : " [production v2]"}`);
    return result;
  });
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) checkAll();
