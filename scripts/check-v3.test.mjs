import test, {after} from "node:test";
import assert from "node:assert/strict";
import {mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {V3_LAYOUT} from "../src/v3/layout.mjs";
import {
  checkAllV3,
  countChatWords,
  measureAudioDurationSec,
  minReadingHoldFrames,
  validateV3Layout,
  validateV3Script,
} from "./check-v3.mjs";

const tempRoot = mkdtempSync(join(tmpdir(), "v3-gates-"));
after(() => rmSync(tempRoot, {recursive: true, force: true}));

const publicDir = join(tempRoot, "public");
const assetDir = "assets/fixture-v3";
mkdirSync(join(publicDir, assetDir), {recursive: true});

function writeSilentWav(path, durationSec, sampleRate = 16000) {
  const numSamples = Math.round(durationSec * sampleRate);
  const dataSize = numSamples * 2;
  const buf = Buffer.alloc(44 + dataSize);
  buf.write("RIFF", 0, "ascii");
  buf.writeUInt32LE(36 + dataSize, 4);
  buf.write("WAVEfmt ", 8, "ascii");
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36, "ascii");
  buf.writeUInt32LE(dataSize, 40);
  writeFileSync(path, buf);
}

writeFileSync(join(publicDir, assetDir, "photo.jpg"), Buffer.from([0xff, 0xd8, 0xff, 0xd9]));
writeFileSync(join(publicDir, assetDir, "cctv.jpg"), Buffer.from([0xff, 0xd8, 0xff, 0xd9]));
writeSilentWav(join(publicDir, assetDir, "vn-valid.wav"), 3.2);
writeSilentWav(join(publicDir, assetDir, "vn-short.wav"), 1.4);
writeSilentWav(join(publicDir, assetDir, "vn-long.wav"), 6.8);

const baseScript = {
  pipelineVersion: 3,
  id: "fixture-v3",
  fps: 30,
  durationInFrames: 1500, // 50 s
  fiksiTag: {visible: true, label: "FIKSI"},
  app: {groupName: "Grup Uji", memberCount: 3, theme: "dark", selfId: "raka"},
  startClock: "23:45:40",
  characters: [
    {id: "raka", name: "Raka", color: "#7DD3FC", voice: "male-masc-id"},
    {id: "dina", name: "Dina", color: "#FDBA74"},
  ],
  events: [
    {id: "m1", at: 0, type: "text", from: "dina", text: "siapa ketuk pintu? kita bertiga", timeLabel: "23.45"}, // 5 words -> 1.5s = 45f
    {id: "m2", at: 180, type: "photo", from: "raka", src: `${assetDir}/photo.jpg`, caption: "kosong kok", timeLabel: "23.45"}, // 12% <= 40%
    {id: "m3", at: 630, type: "voice", from: "raka", src: `${assetDir}/vn-valid.wav`, subtitle: "Jangan buka pintu dulu ya.", timeLabel: "23.46"}, // 21s -> 23:46:01
    {id: "m4", at: 960, type: "cctv", durationFrames: 180, src: `${assetDir}/cctv.jpg`, cameraLabel: "CAM 01", timestampLabel: "23:46:10"}, // 32s -> 23:46:12
  ],
  clueLedger: [{clue: "Gembok luar terkunci", plantedIn: "m2", paidOffIn: "m4"}],
};

const clone = () => structuredClone(baseScript);
const validate = (script, extra = {}) => validateV3Script(script, {publicDir, ...extra});

test("valid v3 script and repository ArsipDemo pass all checks", () => {
  const res = validate(clone());
  assert.equal(res.durationSec, 50);
  assert.equal(res.voiceCount, 1);
  assert.equal(res.clues, 1);
  assert.ok(Math.abs(measureAudioDurationSec(join(publicDir, assetDir, "vn-valid.wav")) - 3.2) < 0.01);

  const repoResults = checkAllV3();
  assert.ok(repoResults.some((r) => r.id === "arsip-demo"), "ArsipDemo must be discovered and validated");
});

test("v3 rejects invalid pipelineVersion, duration outside 45-75 s, and non-zero hook", () => {
  const badVer = clone();
  badVer.pipelineVersion = 2;
  assert.throws(() => validate(badVer), /pipelineVersion must be 3/);

  const tooShort = clone();
  tooShort.durationInFrames = 44 * 30;
  assert.throws(() => validate(tooShort), /outside the 45–75 s/);

  const tooLong = clone();
  tooLong.durationInFrames = 76 * 30;
  assert.throws(() => validate(tooLong), /outside the 45–75 s/);

  const lateHook = clone();
  lateHook.events[0].at = 15;
  assert.throws(() => validate(lateHook), /must start at frame 0/);
});

test("v3 computes each message reading-time minimum from its own word count and fails if next event starts too early", () => {
  assert.equal(countChatWords("siapa ketuk pintu? kita bertiga"), 5);
  assert.equal(minReadingHoldFrames(5, 30), 45);
  assert.equal(minReadingHoldFrames(2, 30), 36);

  const exactPass = clone();
  exactPass.events[1].at = 45;
  assert.doesNotThrow(() => validate(exactPass));

  const tooEarly = clone();
  tooEarly.events[1].at = 44;
  assert.throws(() => validate(tooEarly), /reading hold 44 frames.*shorter than minimum 45 frames/);

  const longText = clone();
  longText.events[0].text = "satu dua tiga empat lima enam tujuh delapan sembilan sepuluh sebelas dua-belas";
  longText.events[1].at = 80;
  assert.throws(() => validate(longText), /shorter than minimum 83 frames/);
});

test("v3 fails when a clue is planted after 40% of durationInFrames or references missing event IDs", () => {
  const atBoundary = clone();
  atBoundary.events[1].at = 600; // exactly 40% of 1500 (23:46:00)
  atBoundary.events[1].timeLabel = "23.46";
  atBoundary.events[2].at = 750;
  assert.doesNotThrow(() => validate(atBoundary));

  const tooLate = clone();
  tooLate.events[1].at = 601;
  tooLate.events[1].timeLabel = "23.46";
  tooLate.events[2].at = 750;
  assert.throws(() => validate(tooLate), /exceeds first 40% limit/);

  const missingPlant = clone();
  missingPlant.clueLedger[0].plantedIn = "m999";
  assert.throws(() => validate(missingPlant), /plantedIn "m999" does not match/);

  const missingPayoff = clone();
  missingPayoff.clueLedger[0].paidOffIn = "m888";
  assert.throws(() => validate(missingPayoff), /paidOffIn "m888" does not match/);

  const redundantTs = clone();
  redundantTs.clueLedger[0].plantedAtSec = 6.0;
  assert.throws(() => validate(redundantTs), /do not hand-enter plantedAtSec\/paidOffAtSec/);
});

test("v3 enforces in-world clock consistency and requires anomaly exceptions to be listed in clueLedger", () => {
  // Future timeLabel on a normal message must fail.
  const futureMsg = clone();
  futureMsg.events[1].timeLabel = "23.46"; // phone is 23:45:46 at frame 180
  assert.throws(() => validate(futureMsg), /ahead of phone clock/);

  // Future CCTV timestampLabel without anomaly must fail.
  const futureCctv = clone();
  futureCctv.events[3].timestampLabel = "23:46:20"; // phone is 23:46:12 at frame 960
  assert.throws(() => validate(futureCctv), /ahead of phone clock/);

  // Deliberate future timestamp with anomaly: true AND listed in clueLedger passes.
  const deliberateAnomaly = clone();
  deliberateAnomaly.events[3].timestampLabel = "23:49:00";
  deliberateAnomaly.events[3].anomaly = true; // m4 is paidOffIn in clueLedger
  assert.doesNotThrow(() => validate(deliberateAnomaly));

  // anomaly: true NOT referenced in clueLedger must fail.
  const unlistedAnomaly = clone();
  unlistedAnomaly.events[0].timeLabel = "23.50";
  unlistedAnomaly.events[0].anomaly = true; // m1 is not in clueLedger
  assert.throws(() => validate(unlistedAnomaly), /anomaly: true must be referenced in clueLedger/);

  // Midnight rollover consistency (23:59:45 -> 00:00:15).
  const midnight = clone();
  midnight.startClock = "23:59:45";
  midnight.events[0].timeLabel = "23.59";
  midnight.events[1].timeLabel = "23.59"; // at 6 s -> 23:59:51
  midnight.events[2].timeLabel = "00.00"; // at 21 s -> 00:00:06
  midnight.events[3].timestampLabel = "00:00:16"; // at 32 s -> 00:00:17
  assert.doesNotThrow(() => validate(midnight));
});

test("v3 fails when a voice-note file measured duration is outside 2-6 s or hand-enters durationSec", () => {
  const tooShortVn = clone();
  tooShortVn.events[2].src = `${assetDir}/vn-short.wav`;
  assert.throws(() => validate(tooShortVn), /measured duration 1\.40 s is outside 2–6 s/);

  const tooLongVn = clone();
  tooLongVn.events[2].src = `${assetDir}/vn-long.wav`;
  assert.throws(() => validate(tooLongVn), /measured duration 6\.80 s is outside 2–6 s/);

  const redundantDur = clone();
  redundantDur.events[2].durationSec = 3.2;
  assert.throws(() => validate(redundantDur), /must not hand-enter durationSec/);
});

test("v3 fails on missing asset paths or missing/hidden FIKSI tag", () => {
  const missingPhoto = clone();
  missingPhoto.events[1].src = `${assetDir}/does-not-exist.jpg`;
  assert.throws(() => validate(missingPhoto), /missing asset/);

  const hiddenFiksi = clone();
  hiddenFiksi.fiksiTag.visible = false;
  assert.throws(() => validate(hiddenFiksi), /FIKSI tag must be present/);

  const wrongLabel = clone();
  wrongLabel.fiksiTag.label = "DRAMA";
  assert.throws(() => validate(wrongLabel), /FIKSI tag must be present/);
});

test("v3 layout encodes full-bleed chrome with critical regions inside top-10%/right-12%/bottom-22% safe zone and fonts >= 42 px", () => {
  assert.doesNotThrow(() => validateV3Layout(V3_LAYOUT));
  // Full-bleed chrome extends to full 1080x1920 without failing.
  assert.equal(V3_LAYOUT.chromeRegions.canvas.width, 1080);
  assert.equal(V3_LAYOUT.chromeRegions.inputBar.y + V3_LAYOUT.chromeRegions.inputBar.height, 1920);
  // Message body font is 46-48 px.
  assert.ok(V3_LAYOUT.fontSizes.messageText >= 46 && V3_LAYOUT.fontSizes.messageText <= 48);

  const smallFont = structuredClone(V3_LAYOUT);
  smallFont.fontSizes.voiceSubtitle = 41;
  assert.throws(() => validateV3Layout(smallFont), /font size "voiceSubtitle" \(41 px\) is below minimum 42 px/);

  const topIntrusion = structuredClone(V3_LAYOUT);
  topIntrusion.criticalRegions.chatContent = {x: 28, y: 180, width: 916, height: 1200}; // y=180 < 192
  assert.throws(() => validateV3Layout(topIntrusion), /top edge \(180 px\) intrudes into top 10% danger zone/);

  const rightIntrusion = structuredClone(V3_LAYOUT);
  rightIntrusion.criticalRegions.chatContent = {x: 50, y: 224, width: 901, height: 1200}; // 951 > 950
  assert.throws(() => validateV3Layout(rightIntrusion), /right edge \(951 px\) intrudes into right 12% danger zone/);

  const bottomIntrusion = structuredClone(V3_LAYOUT);
  bottomIntrusion.criticalRegions.chatContent = {x: 28, y: 224, width: 916, height: 1274}; // 1498 > 1497
  assert.throws(() => validateV3Layout(bottomIntrusion), /bottom edge \(1498 px\) intrudes into bottom 22% danger zone/);

  const fiksiTopIntrusion = structuredClone(V3_LAYOUT);
  fiksiTopIntrusion.criticalRegions.fiksiTag = {x: 560, y: 16, width: 184, height: 54}; // y=16 < 192 (TikTok tabs)
  assert.throws(() => validateV3Layout(fiksiTopIntrusion), /criticalRegions\.fiksiTag top edge \(16 px\) intrudes into top 10% danger zone/);

  const fiksiRightIntrusion = structuredClone(V3_LAYOUT);
  fiksiRightIntrusion.criticalRegions.fiksiTag = {x: 800, y: 222, width: 160, height: 50}; // 960 > 950
  assert.throws(() => validateV3Layout(fiksiRightIntrusion), /criticalRegions\.fiksiTag right edge/);
});

test("v3 receipts (ticks) are allowed only on phone owner outgoing messages and never as unread ticks", () => {
  const selfTicks = clone();
  selfTicks.events[1].ticks = "read"; // raka is selfId -> valid
  assert.doesNotThrow(() => validate(selfTicks));

  const receivedTicks = clone();
  receivedTicks.events[0].ticks = "read"; // dina !== selfId -> must fail
  assert.throws(() => validate(receivedTicks), /receipts \(ticks\) are only allowed on messages sent by phone owner/);

  const unreadTicks = clone();
  unreadTicks.events[2].ticks = "unread";
  assert.throws(() => validate(unreadTicks), /invalid ticks "unread"/);
});

test("templates/chat-script.example.json obeys single-source-of-truth, clock consistency, and non-sandal rules", () => {
  const example = JSON.parse(readFileSync("templates/chat-script.example.json", "utf8"));
  assert.equal(example.pipelineVersion, 3);
  assert.doesNotMatch(JSON.stringify(example), /sandal/i, "template must not pre-empt Pilot 01 sandals clue");
  assert.doesNotThrow(() => validateV3Script(example, {requireAssets: false}));
});
