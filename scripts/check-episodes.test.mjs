import test, {after} from "node:test";
import assert from "node:assert/strict";
import {copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from "node:fs";
import {tmpdir} from "node:os";
import {dirname, join, resolve} from "node:path";
import Module from "node:module";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import ts from "typescript";
import {checkAll, validateEpisode, validatePipelineState} from "./check-episodes.mjs";

const tempRoot = mkdtempSync(join(tmpdir(), "episode-gates-"));
after(() => rmSync(tempRoot, {recursive: true, force: true}));
const publicDir = join(tempRoot, "public");
const opts = {publicDir, manifestPath: "fixture/attempt-06/manifest.json"};
const assetDir = "assets/fixture/attempt-06";
const styleId = "gritty-dark-anime-comic";
const originalPlate = readFileSync("public/assets/kemacetan-terakhir/door-threat.webp");
const plates = Array.from({length: 30}, (_, i) => `${assetDir}/shot-${i}.webp`);
const plateA = plates[0];
const fg = `${assetDir}/seat.png`;
const actor = `${assetDir}/actor.webp`;
const opaque = `${assetDir}/opaque.webp`;
mkdirSync(join(publicDir, assetDir), {recursive: true});
mkdirSync(join(publicDir, "sfx"), {recursive: true});
mkdirSync(join(publicDir, "fonts"), {recursive: true});
for (const [i, plate] of plates.entries()) writeFileSync(join(publicDir, plate), Buffer.concat([originalPlate, Buffer.from([i])]));
copyFileSync("public/assets/kemacetan-terakhir/seat-occluder.png", join(publicDir, fg));
writeFileSync(join(publicDir, actor), originalPlate);
writeFileSync(join(publicDir, opaque), originalPlate);
writeFileSync(join(publicDir, assetDir, "narration.mp3"), "");
writeFileSync(join(publicDir, "fonts/theboldfont.ttf"), "");
writeFileSync(join(publicDir, "sfx/knock.wav"), "");
const camera = {from: {scale: 1, x: 0, y: 0}, to: {scale: 1, x: 0, y: 0}};
const base = {
  id: "FixtureV2", schemaVersion: 2, fps: 30, duration: 2100,
  openingTitle: "Jangan Buka Kaca",
  captions: "captions.json", narration: {asset: `${assetDir}/narration.mp3`, at: 0, duration: 2100, gain: 0.7}, beds: [],
  art: {styleId, rasterAssets: Object.fromEntries(plates.map(plate => [plate, styleId]))},
  script: {format: "survival-tactics-curiosity-gap", hook: {at: 0, line: "Wabah datang"}, promise: {at: 90, line: "Apa bahayanya?", openLoop: "Apa di belakang?"}, tactics: {at: 360, steps: [{number: 1, at: 370, line: "Kunci", detail: "pintu"}, {number: 2, at: 800, line: "Sembunyi", detail: "jendela"}]}, ending: {at: 1650, twistAt: 1890, payoff: "Ada seseorang"}},
  scenes: plates.map((plate, i) => ({
    id: `s${i}`, name: `Shot ${i}`, at: i * 70, plate, camera, characters: {mode: "baked"}, hud: [],
    editorial: {
      protagonist: [6, 12, 26].includes(i) ? "reaction" : i < 10 ? "visible" : "absent",
      purpose: "threat-proximity",
      evidence: "Figure closes the distance from the driver's door",
    },
  })),
};
const captions = [{startMs: 0, endMs: 1000, timestampMs: null, confidence: null, words: [{text: "Ada"}, {text: "bahaya", color: "danger"}]}];
const clone = () => structuredClone(base);
const validate = (manifest, cap = captions) => validateEpisode(manifest, cap, opts);

test("speaker captions hide narrator labels and retain colored world-voice labels", () => {
  const filename = resolve("src/components/SpeakerCaption.test.cjs");
  const compiled = ts.transpileModule(readFileSync("src/components/SpeakerCaption.tsx", "utf8"), {
    compilerOptions: {module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX},
  }).outputText;
  const componentModule = new Module(filename);
  componentModule.filename = filename;
  componentModule.paths = Module._nodeModulePaths(dirname(filename));
  componentModule._compile(compiled, filename);
  const {SpeakerCaption} = componentModule.exports;
  for (const speaker of [undefined, null, "", "NARATOR", " narrator "]) {
    const markup = renderToStaticMarkup(React.createElement(SpeakerCaption, {speaker, text: "KAMU DIKUNCI"}));
    assert.match(markup, /KAMU DIKUNCI/);
    assert.match(markup, /color:white/);
    assert.doesNotMatch(markup, /NARATOR|NARRATOR/i);
  }
  const dialogue = renderToStaticMarkup(React.createElement(SpeakerCaption, {speaker: "PENCULIK", text: "JANGAN GERAK"}));
  assert.match(dialogue, /PENCULIK/);
  assert.match(dialogue, /JANGAN GERAK/);
  assert.match(dialogue, /color:#ffe154/i);
  const indonesian = renderToStaticMarkup(React.createElement(SpeakerCaption, {text: "satu-satunya pelan-pelan keras-keras dihantam"}));
  assert.match(indonesian, /top:77%/);
  assert.match(indonesian, /satu-satunya pelan-pelan keras-keras dihantam/);
  const semantic = renderToStaticMarkup(React.createElement(SpeakerCaption, {text: 'BUKA PINTU BAHAYA', words: [{text: 'BUKA', color: 'yellow'}, {text: 'PINTU', color: 'white'}, {text: 'BAHAYA', color: 'red'}]}));
  assert.match(semantic, /color:#ffd052/i);
  assert.match(semantic, /color:#f2544e/i);
  assert.match(semantic, /color:#fff/i);
});

test("v2 flash overlay caps opacity and respects its frame interval", () => {
  const filename = resolve('src/components/StudioV2.test.cjs');
  const compiled = ts.transpileModule(readFileSync('src/components/StudioV2.tsx', 'utf8'), {
    compilerOptions: {module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX},
  }).outputText;
  const componentModule = new Module(filename);
  componentModule.filename = filename;
  componentModule.paths = Module._nodeModulePaths(dirname(filename));
  const nativeRequire = componentModule.require.bind(componentModule);
  let frame = 10;
  componentModule.require = name => name === 'remotion'
    ? {useCurrentFrame: () => frame, AbsoluteFill: ({style, children}) => React.createElement('div', {style}, children)}
    : nativeRequire(name);
  componentModule._compile(compiled, filename);
  const {FlashOverlay} = componentModule.exports;
  const markup = renderToStaticMarkup(React.createElement(FlashOverlay, {startFrame: 10, opacity: .95}));
  assert.match(markup, /opacity:0\.65/);
  frame = 13;
  assert.equal(renderToStaticMarkup(React.createElement(FlashOverlay, {startFrame: 10})), '');
});

test("studio v2 accepts a long decision-consequence pilot without changing the v1 ceiling", () => {
  const pilot = clone();
  pilot.pipelineVersion = 2;
  pilot.duration = 120 * pilot.fps;
  pilot.soundMix = {asset: `${assetDir}/narration.mp3`};
  pilot.timing = {blackoutFrame: pilot.duration - 1, rewindFrame: 100, rewindFrames: 12};
  pilot.narration.duration = 115 * pilot.fps;
  pilot.art.styleId = "urban-silhouette-noir";
  for (const path of Object.keys(pilot.art.rasterAssets)) pilot.art.rasterAssets[path] = pilot.art.styleId;
  pilot.scenes = pilot.scenes.slice(0, 20).map((scene, i) => ({
    ...scene, at: i * 180, camera: {...camera, to: {...camera.to, scale: 1.05}},
    editorial: {...scene.editorial, protagonist: i === 18 ? "reaction" : scene.editorial.protagonist},
  }));
  pilot.script = {
    format: "decision-consequence", engine: "branch-rewind", wordCount: 300,
    hook: {at: 0, line: "Jangan ikut barisan."},
    ending: {at: 3060, twistAt: 3420, payoff: "Barisan itu menunggu."},
  };
  assert.deepEqual(validate(pilot).warnings, []);
  assert.throws(() => validate({...pilot, pipelineVersion: 1}), /62–75 s/);
  assert.throws(() => validate({...pilot, pipelineVersion: 3}), /invalid pipelineVersion/);
  pilot.script.wordCount = 185;
  assert.ok(validate(pilot).warnings.some(warning => /spoken word count/.test(warning)));
});

test("studio player rejects missing mix, invalid blackout and invalid rewind intervals", () => {
  const episode = JSON.parse(readFileSync('episodes/002-rumah-tengah-hutan/manifest.json'));
  const episodeCaptions = JSON.parse(readFileSync('episodes/002-rumah-tengah-hutan/captions.json'));
  const check = value => validateEpisode(value, episodeCaptions, {publicDir: resolve('public'), manifestPath: '002-rumah-tengah-hutan/manifest.json'});
  assert.doesNotThrow(() => check(episode));
  const missing = structuredClone(episode); missing.soundMix.asset = 'assets/002-rumah-tengah-hutan/missing.wav';
  assert.throws(() => check(missing), /playback mix: missing asset/);
  for (const frame of [episode.duration, episode.duration + 1, -1, 1.5]) {
    const invalid = structuredClone(episode); invalid.timing.blackoutFrame = frame;
    assert.throws(() => check(invalid), /invalid blackout frame/);
  }
  const invalid = structuredClone(episode); invalid.timing.rewindFrame = invalid.timing.blackoutFrame - 1; invalid.timing.rewindFrames = 12;
  assert.throws(() => check(invalid), /invalid branchRewind interval/);
  const drifted = structuredClone(episode); drifted.timing.climaxThunderFrame += 1;
  assert.throws(() => check(drifted), /scene start differs from named cue/);
});

test("climax timing and optional image must be valid and fit the composition", () => {
  const a = clone();
  a.tensionRamp = {startSec: 65, endSec: 68, extraScale: .06, vignetteStrength: .3};
  a.finalJolt = {triggerSec: 68.5, durationSec: 1, blackoutSec: .25, zoomFrom: 1, zoomTo: 1.24, shakePx: 16, shakeDecayMs: 320, flashFrames: 2, rgbSplitPx: 6};
  assert.doesNotThrow(() => validate(a));
  a.finalJolt.blackoutSec = 1; assert.throws(() => validate(a), /clipped blackout/);
  a.finalJolt.blackoutSec = .25; a.finalJolt.handoffSec = .5; assert.throws(() => validate(a), /clipped blackout/);
  a.finalJolt.handoffSec = -.1; assert.throws(() => validate(a), /clipped blackout/);
  a.finalJolt.handoffSec = .1; assert.doesNotThrow(() => validate(a)); delete a.finalJolt.handoffSec;
  a.finalJolt.blackoutSec = .25; a.finalJolt.joltImageSrc = `${assetDir}/missing.webp`; assert.throws(() => validate(a), /missing asset/);
  delete a.finalJolt.joltImageSrc; a.tensionRamp.endSec = a.tensionRamp.startSec; assert.throws(() => validate(a), /tensionRamp/);
});

test("a handoff light-up must fit its scene and use a valid brightness", () => {
  const a = clone();
  a.scenes[0].lightUp = {at: 5, duration: 5, minBrightness: .3};
  assert.doesNotThrow(() => validate(a));
  a.scenes[0].lightUp.minBrightness = -1; assert.throws(() => validate(a), /invalid lightUp/);
  a.scenes[0].lightUp = {at: 5, duration: 5, minBrightness: .3, sweep: {fromX: .2, toX: 1.1, y: .5}}; assert.throws(() => validate(a), /invalid lightUp/);
  a.scenes[0].lightUp = {at: 5, duration: 5, minBrightness: .3, offMask: {x: .5, y: .6, radiusX: .4, radiusY: .4}}; assert.doesNotThrow(() => validate(a));
  a.scenes[0].lightUp.offMask.radiusX = 0; assert.throws(() => validate(a), /invalid lightUp/);
  a.scenes[0].lightUp = {at: 68, duration: 5, minBrightness: .3}; assert.throws(() => validate(a), /invalid lightUp/);
});

test("valid v2 and the exact comparison baseline", () => {
  assert.doesNotThrow(() => validate(clone()));
  const old = JSON.parse(readFileSync("episodes/arc1/001-kemacetan-terakhir/manifest.json"));
  const oldCaps = JSON.parse(readFileSync("episodes/arc1/001-kemacetan-terakhir/captions.json"));
  assert.doesNotThrow(() => validateEpisode(old, oldCaps, {publicDir: resolve("public"), manifestPath: "001-kemacetan-terakhir/manifest.json"}));
  assert.throws(() => validateEpisode(old, oldCaps, opts), /schema version/);
  const path = "001-kemacetan-terakhir/attempt-05/manifest.json";
  const closed = JSON.parse(readFileSync(join("episodes", "arc1", path)));
  const closedCaptions = JSON.parse(readFileSync(join("episodes", "arc1", dirname(path), "captions.json")));
  const closedOptions = {publicDir: resolve("public"), manifestPath: path};
  assert.equal(validateEpisode(closed, closedCaptions, closedOptions).comparison, true);
  closed.scenes[0].name += " revised";
  assert.throws(() => validateEpisode(closed, closedCaptions, closedOptions), /art.styleId/);
});
test("duration over 75 seconds and missing promise fail", () => {
  const a = clone(); a.duration = 2251; assert.throws(() => validate(a), /duration/);
  const b = clone(); b.script.promise.line = ""; assert.throws(() => validate(b), /promise/);
});
test("out-of-order tactical steps fail", () => {
  const a = clone(); a.script.tactics.steps[1].at = 369; assert.throws(() => validate(a), /tactical step/);
});
test("consecutive scenes cannot reuse the same image path to break up a still", () => {
  const a = clone(); a.scenes[1].at = 38; a.scenes[1].plate = a.scenes[0].plate; a.scenes[2].at = 76;
  assert.throws(() => validate(a), /repeated image asset/);
});
test("75 static frames pass and 76 fail", () => {
  const a = clone();
  a.scenes[1].at = 75;
  assert.doesNotThrow(() => validate(a));
  a.scenes[1].at = 76;
  assert.throws(() => validate(a), /plain still 0–76/);
});
test("settled HUD does not excuse an overlong hold", () => {
  const a = clone(); a.scenes.splice(1, 1); a.scenes[0].hud = [{id: "badge", type: "timestampBadge", text: "03.00", at: 0, duration: 140, revealFrames: 5}];
  assert.throws(() => validate(a), /plain still/);
});
test("HUD box, foreground and mixed style errors fail", () => {
  const a = clone(); a.scenes[0].hud = [{id: "x", type: "tacticalCallout", text: "Bahaya", at: 0, duration: 30, revealFrames: 10, box: {x: .9, y: .1, width: .2, height: .2}}];
  assert.throws(() => validate(a), /out-of-bounds/);
  const b = clone(); b.scenes[0].characters = {mode: "masked", layers: [{asset: plateA, x: 0, y: 0, width: 50}], foreground: "missing.png"};
  assert.throws(() => validate(b), /missing asset/);
  const c = clone(); c.art.rasterAssets[plateA] = "photograph"; assert.throws(() => validate(c), /mixed style/);
});
test("masked character accepts an alpha foreground and rejects an opaque plate", () => {
  const a = clone();
  a.art.rasterAssets[fg] = styleId;
  a.art.rasterAssets[actor] = styleId;
  a.scenes[0].characters = {mode: "masked", layers: [{asset: actor, x: 10, y: 10, width: 50}], foreground: fg};
  assert.doesNotThrow(() => validate(a));
  a.art.rasterAssets[opaque] = styleId;
  a.scenes[0].characters.foreground = opaque;
  assert.throws(() => validate(a), /not alpha-capable/);
});
test("five-word captions, invalid colors and missing assets fail", () => {
  assert.throws(() => validate(clone(), [{...captions[0], words: Array.from({length: 5}, () => ({text: "satu"}))}]), /1–4 words/);
  assert.throws(() => validate(clone(), [{...captions[0], words: [{text: "bahaya", color: "blue"}]}]), /invalid word or color/);
  const a = clone(); a.scenes[0].plate = "missing.webp"; assert.throws(() => validate(a), /missing asset/);
});
test("animated infographics break up an otherwise long still", () => {
  const a = clone(); a.scenes.splice(1, 2);
  for (const scene of a.scenes.filter(scene => ["s16", "s17"].includes(scene.id))) scene.editorial.protagonist = "visible";
  a.scenes[0].hud = [60, 130].map((at, i) => ({id: `diagram-${i}`, type: "blueprintOverlay", at, duration: 15, revealFrames: 10, box: {x: .1, y: .1, width: .7, height: .4}, paths: [{points: [{x: 0, y: 0}, {x: 1, y: 1}], arrow: true}]}));
  assert.doesNotThrow(() => validate(a));
});

test("protagonist coverage, hook, middle reactions and direct anticipation are required", () => {
  const hidden = clone();
  hidden.scenes.find(scene => scene.id === "s4").editorial.protagonist = "absent";
  assert.throws(() => validate(hidden), /11\/30 shots.*40%/);
  const hook = clone();
  hook.scenes[0].editorial.protagonist = hook.scenes[1].editorial.protagonist = "absent";
  hook.scenes[16].editorial.protagonist = hook.scenes[17].editorial.protagonist = "visible";
  assert.throws(() => validate(hook), /opening 0–3 s/);
  const mid = clone();
  mid.scenes[12].editorial.protagonist = "visible";
  assert.throws(() => validate(mid), /two protagonist reaction/);
  const reveal = clone();
  reveal.scenes[26].editorial.protagonist = "visible";
  assert.throws(() => validate(reveal), /immediately preceding shot/);
});

test("shot purpose requires visible evidence and a tactical shot needs an actual diagram", () => {
  const a = clone();
  a.scenes[4].editorial.evidence = " ";
  assert.throws(() => validate(a), /visible evidence/);
  a.scenes[4].editorial = {protagonist: "absent", purpose: "tactical-hud", evidence: "Diagram plots both exits"};
  assert.throws(() => validate(a), /requires a diagram/);
  a.scenes[16].editorial.protagonist = "visible";
  a.scenes[4].hud = [{id: "map", type: "radarDiagram", at: 0, duration: 40, revealFrames: 10, box: {x: .1, y: .1, width: .8, height: .6}, paths: [{points: [{x: 0, y: 0}, {x: 1, y: 1}]}]}];
  a.scenes[27].cues = [{name: "Knock", asset: "sfx/knock.wav", at: 0, duration: 10, gain: .5}];
  assert.doesNotThrow(() => validate(a));
});

test("rejects assets from an older attempt and shared paths for narration or art", () => {
  const oldPlate = "assets/fixture/attempt-05/shot.webp";
  mkdirSync(join(publicDir, dirname(oldPlate)), {recursive: true});
  copyFileSync(join(publicDir, plateA), join(publicDir, oldPlate));
  const a = clone();
  a.art.rasterAssets[oldPlate] = styleId;
  assert.throws(() => validate(a), /must be in public\/assets\/fixture\/attempt-06/);
  const b = clone();
  b.narration.asset = "sfx/knock.wav";
  assert.throws(() => validate(b), /narration: asset/);
  const c = clone();
  c.scenes[0].plate = "sfx/knock.wav";
  assert.throws(() => validate(c), /s0 plate: asset/);
  const d = clone();
  d.art.rasterAssets[oldPlate] = styleId;
  assert.throws(() => validateEpisode(d, captions, {publicDir, manifestPath: "fixture/manifest.json", batchRoots: ["assets/fixture/attempt-05"]}), /nested attempt's batch/);
});

test("rejects a repeated static plate under another filename within 15 seconds", () => {
  const duplicate = `${assetDir}/copied.webp`;
  copyFileSync(join(publicDir, plateA), join(publicDir, duplicate));
  const a = clone();
  a.art.rasterAssets[duplicate] = styleId;
  a.scenes[6].plate = duplicate;
  assert.throws(() => validate(a), /repeats the static plate.*within 15 s/);
  a.scenes[6].plate = plates[6];
  a.scenes[7].plate = duplicate;
  assert.doesNotThrow(() => validate(a));
});

test("repository scan rejects raster copies placed in a different attempt's own folder", () => {
  const earlier = "fixture/attempt-05";
  const earlierManifest = JSON.parse(JSON.stringify(base).replaceAll("attempt-06", "attempt-05"));
  earlierManifest.id = "EarlierFixture";
  mkdirSync(join(publicDir, "assets", earlier), {recursive: true});
  for (const asset of [...plates, base.narration.asset]) {
    copyFileSync(join(publicDir, asset), join(publicDir, asset.replace("attempt-06", "attempt-05")));
  }
  for (const [folder, manifest] of [[earlier, earlierManifest], ["fixture/attempt-06", base]]) {
    const dir = join(tempRoot, "episodes", folder);
    mkdirSync(dir, {recursive: true});
    writeFileSync(join(dir, "manifest.json"), JSON.stringify(manifest));
    writeFileSync(join(dir, "captions.json"), JSON.stringify(captions));
  }
  assert.throws(() => checkAll(tempRoot), /same raster bytes in different attempts/);
});

test("factory duration checks include both the narration and the composition", () => {
  const a = clone();
  a.narration.duration = 61 * a.fps;
  assert.doesNotThrow(() => validate(a));
  a.narration.duration = 60 * a.fps;
  assert.ok(validate(a).warnings.some(warning => /narration duration.*61–78 s/.test(warning)));
  a.narration.duration--;
  assert.throws(() => validate(a), /narration duration.*60–73 s/);
  a.duration = 74 * a.fps;
  a.narration.duration = 73 * a.fps + 1;
  assert.throws(() => validate(a), /narration duration.*60–73 s/);
  a.narration.duration = base.narration.duration;
  a.duration = 75 * a.fps + 1;
  assert.throws(() => validate(a), /episode duration.*62–75 s/);
  a.duration = 62 * a.fps - 1;
  assert.throws(() => validate(a), /episode duration.*62–75 s/);
});

test("new episodes require a readable three- or four-word opening title", () => {
  for (const openingTitle of [undefined, null, "", "Tetap Tenang", "Buka Pintu Kalau Sudah Aman"]) {
    assert.throws(() => validate({...clone(), openingTitle}), /openingTitle must contain 3–4 words/);
  }
  for (const openingTitle of ["Jangan   Buka Kaca", "Jangan Buka Kaca Mobil!"]) {
    assert.doesNotThrow(() => validate({...clone(), openingTitle}));
  }
});

test("a raster path repeated after fifteen seconds still fails the factory check", () => {
  const a = clone();
  a.scenes[7].plate = plateA;
  assert.throws(() => validate(a), /repeated image asset.*first used at s0 plate/);
});

test("Episode 001 keeps passing with factory warnings for earlier cuts", () => {
  const episodes = checkAll();
  const original = episodes.find(episode => episode.id === "KemacetanTerakhirMotionComic");
  const attempt06 = episodes.find(episode => episode.id === "KemacetanTerakhirMotionComicAttempt06");
  assert.ok(original.warnings.some(warning => /episode duration 84\.800 s/.test(warning)));
  assert.ok(attempt06.warnings.some(warning => /repeated image asset.*hook-character\.webp/.test(warning)));
});

test("arc metadata is optional and supports both ends of a seven-episode arc", () => {
  assert.doesNotThrow(() => validate(clone()));
  const sheet = "assets/characters/fixture-driver/sheet.png";
  mkdirSync(join(publicDir, dirname(sheet)), {recursive: true});
  copyFileSync(join(publicDir, fg), join(publicDir, sheet));
  for (const arcEpisode of [1, 7]) {
    assert.doesNotThrow(() => validate({...clone(), arcEpisode, characterSheets: [sheet]}));
  }
  for (const arcEpisode of [0, 8, 1.5, "2", null]) {
    assert.throws(() => validate({...clone(), arcEpisode, characterSheets: [sheet]}), /arcEpisode must be an integer from 1 to 7/);
  }
  assert.throws(() => validate({...clone(), arcEpisode: 2}), /requires at least one characterSheets path/);
  assert.throws(() => validate({...clone(), arcEpisode: 2, characterSheets: [sheet, "assets/characters/missing.png"]}), /character sheet: missing asset/);
  assert.throws(() => validate({...clone(), arcEpisode: 2, characterSheets: ["../outside.png"]}), /character sheet: missing asset/);
});

test("Episode 005 keeps narrator and whisper in separately timed caption beats", () => {
  const beats = JSON.parse(readFileSync("episodes/arc1/005-suara-dari-rumah-kosong/captions.json", "utf8"));
  const text = beat => beat.words.map(word => word.text).join(" ");
  const narrator = beats.find(beat => text(beat).includes("BERBISIK"));
  const whisper = beats.find(beat => text(beat).includes("KALAU"));
  assert.equal(text(narrator), "DIA BERBISIK");
  assert.ok(narrator.endMs <= 68500, "narrator beat must end before the whisper clip");
  assert.ok(whisper.startMs >= 68900, "whisper caption must not appear before its measured onset");
  assert.equal(text(whisper), "KALAU KACA DIKETUK,");
  const next = beats[beats.indexOf(whisper) + 1];
  assert.equal(text(next), "KENAPA KAMU MASIH MENOLEH?");
  assert.ok(next.startMs >= 70833 && next.endMs <= 72567);
});

test("pipeline state accepts documented statuses and rejects missing or invalid stages", () => {
  const state = JSON.parse(readFileSync("templates/pipeline-state.json", "utf8"));
  assert.doesNotThrow(() => validatePipelineState(state));
  const episode = JSON.parse(readFileSync("episodes/arc1/003-bel-minimarket/pipeline-state.json", "utf8"));
  assert.doesNotThrow(() => validatePipelineState(episode));
  const progressed = structuredClone(state); progressed.audio.status = "pass"; progressed.images.status = "ready";
  assert.doesNotThrow(() => validatePipelineState(progressed));
  const missing = structuredClone(state); delete missing.audit;
  assert.throws(() => validatePipelineState(missing), /missing audit stage/);
  const badStatus = structuredClone(state); badStatus.render.status = "approved";
  assert.throws(() => validatePipelineState(badStatus), /invalid render status/);
  const badNotes = structuredClone(state); badNotes.audio.notes = null;
  assert.throws(() => validatePipelineState(badNotes), /audio notes must be a string/);

  // A draft without a manifest must still have its pipeline state checked.
  const draftRoot = join(tempRoot, "draft-scan");
  const draftDir = join(draftRoot, "episodes", "003-draft");
  mkdirSync(draftDir, {recursive: true});
  const invalidDraft = structuredClone(state); invalidDraft.images.status = "approved";
  writeFileSync(join(draftDir, "pipeline-state.json"), JSON.stringify(invalidDraft));
  assert.throws(() => checkAll(draftRoot), /invalid images status/);
});
