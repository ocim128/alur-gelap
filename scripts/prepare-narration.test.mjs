// Regression test modeled on Episode 004: a claimed-silent window that contains live
// signal must be rejected at sample level, while a properly assembled, sample-preserving
// padded stem must be accepted. Pure functions only — no ffmpeg, no episode media.
import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {
  applyReconciliations,
  assemblePcm,
  buildPlan,
  frameAlignedWindow,
  prepareNarration,
  projectTighteningVariations,
  verifyProtectedWindows,
  verifySamplePreserving,
} from './prepare-narration.mjs';

const SR = 48000;
const FPS = 30;
const tone = (samples, fromSec, toSec, {frequency = 220, amplitude = 9000, decayToSec = null} = {}) => {
  const from = Math.round(fromSec * SR);
  const to = Math.round((decayToSec ?? toSec) * SR);
  for (let i = from; i < to; i++) {
    const envelope = decayToSec !== null ? 1 - (i - from) / Math.max(1, to - from) : 1;
    samples[i] = Math.round(Math.sin(2 * Math.PI * frequency * i / SR) * amplitude * envelope);
  }
  return samples;
};
const synth = (durationSec, extra = []) => {
  const samples = new Int16Array(Math.round(durationSec * SR));
  for (const word of words) tone(samples, word.start, word.end);
  for (const extra_ of extra) extra_(samples);
  return samples;
};

// A 004-shaped raw word track: merged "dituas", filler "itu," in the hook, a
// three-loop rewind boundary ("tamat." -> "Setiap"), a protected beat, a tower
// quote for a world-voice replacement, and a final word.
const words = [
  {word: 'Tangan', start: 0.15, end: 0.45},
  {word: 'dituas', start: 0.45, end: 0.80},
  {word: 'itu,', start: 0.80, end: 0.95},
  {word: 'bukan', start: 1.30, end: 1.62},
  {word: 'tanganmu.', start: 2.20, end: 3.50}, // raw hook end 3.50 s > 3.0 s limit; gap to "bukan" stays natural
  {word: 'lepas', start: 3.60, end: 3.90},
  {word: 'satu', start: 10.00, end: 10.30},
  {word: 'detik.', start: 10.30, end: 10.60},
  {word: 'tamat.', start: 40.00, end: 40.30},
  {word: 'Setiap', start: 42.50, end: 42.80}, // raw gap 2.2 s -> exact 2.0 s boundary
  {word: 'kali', start: 43.00, end: 43.20},
  {word: 'narik', start: 44.40, end: 44.70}, // 1.2 s gap -> tightened to 0.3 s
  {word: 'terjepit,', start: 55.00, end: 55.30},
  {word: 'ambruk.', start: 56.20, end: 56.50}, // protected beat, never tightened
  {word: 'jernih', start: 69.60, end: 69.90},
  {word: 'turun', start: 70.00, end: 70.30},
  {word: 'lewatin', start: 70.30, end: 70.80},
  {word: 'izin', start: 70.80, end: 71.10},
  {word: 'darurat.', start: 71.10, end: 71.50},
  {word: 'Instingmu', start: 72.20, end: 72.60},
  {word: 'pulang.', start: 100.00, end: 100.10},
];
const timing = {durationSec: 103.0, words};
const shortTiming = {durationSec: 101.0, words}; // source ends before the tail pad target
const config = {
  episode: 'fixture-004-regression',
  sampleRate: SR,
  fps: FPS,
  tightening: {thresholdSec: 0.65, retainedSec: 0.3},
  leadTrimSec: 0.05,
  hook: {limitSec: 3.0, finalWordStem: 'tanganmu', fallback: {dropWordStem: 'itu', afterStem: 'dituas', beforeStem: 'bukan'}},
  rewinds: [{name: 'rewind-3', tailStem: 'tamat', nextStem: 'setiap', rewindSec: 0.4, dreadSec: 1.6, note: '0.4 s tape-snap + the only true-zero dread silence'}],
  protectedBeats: [{aStem: 'terjepit', bStem: 'ambruk', why: 'copilot groan + muffled thud live in this gap'}],
  worldVoices: [{name: 'tower-pa', fromStem: 'jernih', toStem: 'darurat', muteNarration: true, why: 'pa-announcer replacement window'}],
  tail: {padSec: 1.5, releaseFadeSec: 0.05},
  panels: [{panel: 'P01', fromStem: 'tangan', toStem: 'tanganmu'}],
};

test('buildPlan produces frame-aligned claimed-silent windows and applies the documented hook fallback', () => {
  const plan = buildPlan(config, timing);
  const names = plan.windows.map((window) => window.name);
  assert.deepEqual(names, ['rewind-3:rewind', 'rewind-3:dread', 'worldvoice:tower-pa']);
  assert.equal(plan.hookFallbackApplied, true, 'raw hook 3.50 s exceeds the 3.0 s limit, fallback must apply');
  assert.equal(plan.rawHookEndSec, 2.96, 'mapped hook must land within the 3.0 s limit');
  for (const window of plan.windows) {
    assert.ok(Number.isInteger(window.startFrame) && Number.isInteger(window.endFrame), 'windows are frame-aligned');
    assert.equal(window.startSample, Math.round(window.startFrame / FPS * SR), 'window start sits exactly on its frame');
    assert.equal(window.endSample, Math.round(window.endFrame / FPS * SR), 'window end sits exactly on its frame');
    assert.ok(window.endSample > window.startSample, 'window covers at least one frame');
  }
  const dread = plan.windows.find((window) => window.name === 'rewind-3:dread');
  assert.ok(Math.abs((dread.endSec - dread.startSec) - 1.6) < 0.05, `dread window spans ~1.6 s (got ${dread.endSec - dread.startSec})`);
  assert.equal(plan.panelWordSpans[0].panel, 'P01');
  assert.equal(plan.panelWordSpans[0].wordCount, 4, 'panel spans count spoken words (the dropped filler is excluded)');
  assert.equal(plan.panelWordSpans[0].startFrame, Math.round(plan.panelWordSpans[0].startSec * FPS));
});

test('a sample-preserving padded stem passes every gate', () => {
  const plan = buildPlan(config, shortTiming);
  const source = synth(shortTiming.durationSec);
  const assembled = assemblePcm(source, plan);
  assert.ok(assembled.pad.sampleCount > 0, 'short source must be padded');
  const windows = verifyProtectedWindows(assembled.pcm, plan);
  assert.equal(windows.violations, 0);
  const preserved = verifySamplePreserving(source, assembled, plan);
  assert.ok(Math.abs(preserved.tailSec - 1.5) <= 0.021, `tail hold after the final word is the configured 1.5 s (got ${preserved.tailSec})`);
  assert.equal(preserved.padSec * SR - assembled.pad.sampleCount < 1, true, 'pad length is sample-exact');
  // Bleed that the boundary replacement silenced: speech energy continuing past the
  // ASR end of "tamat." must not leak into the claimed dread silence.
  const bleeding = synth(shortTiming.durationSec, [(samples) => tone(samples, 40.30, 40.44, {amplitude: 4000, decayToSec: 40.44})]);
  const assembledBleed = assemblePcm(bleeding, plan);
  verifyProtectedWindows(assembledBleed.pcm, plan);
  const dread = plan.windows.find((window) => window.name === 'rewind-3:dread');
  for (let i = dread.startSample; i < dread.endSample; i++) assert.equal(assembledBleed.pcm[i], 0, 'dread silence is exact zero despite source bleed');
});

test('a claimed silent window containing live signal is rejected with window evidence', () => {
  const plan = buildPlan(config, shortTiming);
  const source = synth(shortTiming.durationSec);
  const assembled = assemblePcm(source, plan);
  // Simulate the Episode 004 incident: a stale assembly where the claimed dread
  // silence still contains live signal.
  const stale = new Int16Array(assembled.pcm);
  const dread = plan.windows.find((window) => window.name === 'rewind-3:dread');
  tone(stale, dread.startSec + 0.1, dread.startSec + 0.2, {amplitude: 6000});
  assert.throws(() => verifyProtectedWindows(stale, plan), (error) => {
    assert.match(error.message, /Claimed-silence violation/);
    assert.match(error.message, /rewind-3:dread/);
    assert.match(error.message, /frame/);
    return true;
  }, 'nonzero narration PCM inside a claimed silence must fail the gate');
});

test('pad and copy integrity violations are rejected', () => {
  const plan = buildPlan(config, shortTiming);
  const source = synth(shortTiming.durationSec);
  const assembled = assemblePcm(source, plan);
  const corruptPad = new Int16Array(assembled.pcm);
  corruptPad[assembled.pad.startSample + 10] = 300;
  assert.throws(() => verifySamplePreserving(source, {...assembled, pcm: corruptPad}, plan), /Pad violation/);
  const corruptCopy = new Int16Array(assembled.pcm);
  const range = assembled.copyRanges[2];
  corruptCopy[range.outStart + 500] = (corruptCopy[range.outStart + 500] + 257) & 0xffff;
  assert.throws(() => verifySamplePreserving(source, {...assembled, pcm: corruptCopy}, plan), /Sample-preserving violation/);
});

test('a hook beyond its limit without a configured fallback fails the plan', () => {
  const noFallback = {...config, hook: {limitSec: 3.0, finalWordStem: 'tanganmu'}};
  assert.throws(() => buildPlan(noFallback, timing), /no fallback is configured/);
  const satisfiedHook = {...config, hook: {limitSec: 4.0, finalWordStem: 'tanganmu', fallback: config.hook.fallback}};
  const plan = buildPlan(satisfiedHook, timing);
  assert.equal(plan.hookFallbackApplied, false, 'fallback is skipped when the raw hook already fits');
});

test('reconciliations are punctuation-tolerant, context-scoped and assert counts', () => {
  const raw = [
    {word: 'yang', start: 0.0, end: 0.1},
    {word: 'Gak', start: 0.1, end: 0.2},
    {word: 'diikat.', start: 0.2, end: 0.3},
    {word: 'tuas', start: 0.4, end: 0.5},
    {word: 'kemudian', start: 0.5, end: 0.6},
    {word: 'Satu', start: 0.7, end: 0.8},
    {word: 'ketukan', start: 0.8, end: 0.9},
    {word: 'kemudian', start: 0.9, end: 1.0},
    {word: 'Gapernah', start: 1.1, end: 1.3},
    {word: 'kop', start: 1.4, end: 1.5},
    {word: 'pilot.', start: 1.5, end: 1.6},
  ];
  const {words: reconciled, records} = applyReconciliations(raw, {
    renames: [
      {from: 'Gak', to: 'nggak', count: 1, class: 'phonetic-variant'},
      {from: 'kemudian', to: 'kemudi', contextBefore: ['tuas'], class: 'suspected-standardization'},
    ],
    splits: [{from: 'Gapernah', to: ['Nggak', 'pernah'], splitRatio: 0.45}],
    merges: [{from: ['kop', 'pilot'], to: 'copilot'}],
  });
  const text = reconciled.map((word) => word.word).join(' ');
  assert.match(text, /nggak diikat\./);
  assert.ok(!/Gak/.test(text));
  assert.equal(reconciled[4].word, 'kemudi', 'context-scoped rename applies after "tuas"');
  assert.equal(reconciled[7].word, 'kemudian', 'the same word outside the context is untouched');
  assert.equal(reconciled[8].word, 'Nggak');
  assert.equal(reconciled[9].start, reconciled[8].end, 'split shares the span at the split ratio');
  assert.equal(reconciled[10].word, 'copilot');
  assert.equal(reconciled[10].end, 1.6, 'merge keeps the second token end');
  assert.equal(records.length, 4);
  assert.throws(() => applyReconciliations(raw, {renames: [{from: 'Gak', to: 'nggak', count: 2}]}), /expected 2 occurrences/);
});

test('dry-run projections match the assembled duration and mark the config row', () => {
  const rows = projectTighteningVariations(config, shortTiming, [
    {thresholdSec: 0.65, retainedSec: 0.3},
    {thresholdSec: 0.65, retainedSec: 0.42},
    {thresholdSec: 0.5, retainedSec: 0.3},
  ]);
  assert.equal(rows.filter((row) => row.isConfig).length, 1);
  const plan = buildPlan(config, shortTiming);
  const assembled = assemblePcm(synth(shortTiming.durationSec), plan);
  const configRow = rows.find((row) => row.isConfig);
  assert.ok(Math.abs(configRow.preparedDurationSec - assembled.pcm.length / SR) < 0.01,
    `projected ${configRow.preparedDurationSec} s matches assembled ${assembled.pcm.length / SR} s`);
  const looser = rows.find((row) => row.retainedSec === 0.42);
  assert.ok(looser.preparedDurationSec > configRow.preparedDurationSec, 'a larger retained gap projects a longer track');
});

test('frameAlignedWindow returns null below one frame and exact samples otherwise', () => {
  assert.equal(frameAlignedWindow(1.0, 1.01, FPS, SR), null);
  const window = frameAlignedWindow(1.0, 2.0, FPS, SR);
  assert.deepEqual({start: window.startFrame, end: window.endFrame, startSample: window.startSample}, {start: 30, end: 60, startSample: SR});
});

test('the CLI pipeline encodes a synthetic take end to end with gates, PTS check and handoff', {skip: !['ffmpeg', 'ffprobe'].every(program => spawnSync(program, ['-version'], {stdio: 'ignore'}).status === 0)}, async () => {
  const root = mkdtempSync(join(tmpdir(), 'prepare-e2e-'));
  try {
    const SR = 48000;
    const fps = 30;
    const e2eWords = [
      {word: 'tangan', start: 0.15, end: 0.45},
      {word: 'dituas', start: 0.45, end: 0.80},
      {word: 'itu,', start: 0.80, end: 0.95},
      {word: 'bukan', start: 1.30, end: 1.62},
      {word: 'tanganmu.', start: 2.20, end: 3.50},
      {word: 'mati.', start: 9.00, end: 9.30},
      {word: 'balik', start: 11.00, end: 11.30},
      {word: 'detik.', start: 11.30, end: 11.50},
      {word: 'pulang.', start: 13.00, end: 13.10},
    ];
    // Synthesize the raw take: one tone burst per word, exact-zero gaps.
    const samples = new Int16Array(15.0 * SR);
    for (const word of e2eWords) {
      for (let i = Math.round(word.start * SR); i < Math.round(word.end * SR); i++) {
        samples[i] = Math.round(Math.sin(2 * Math.PI * 200 * i / SR) * 9000);
      }
    }
    const pcm = Buffer.from(samples.buffer, 0, samples.byteLength);
    const mp3 = join(root, 'narration-investigator.mp3');
    const encode = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 's16le', '-ar', String(SR), '-ac', '1', '-i', 'pipe:0', '-codec:a', 'libmp3lame', '-q:a', '2', mp3], {input: pcm, maxBuffer: 64 * 1024 * 1024});
    assert.equal(encode.status, 0, encode.stderr);
    const timestamps = join(root, 'narration-investigator-timestamps.json');
    writeFileSync(timestamps, JSON.stringify({durationSec: 15.0, voiceId: 'fixture', words: e2eWords, chunks: [], sfx: []}));
    const configPath = join(root, 'narration-prep.json');
    const config = {
      episode: 'fixture-e2e',
      source: mp3,
      sourceTimestamps: timestamps,
      outputWav: join(root, 'narration-prepared.wav'),
      outputMp3: join(root, 'narration-prepared.mp3'),
      timingsPath: join(root, 'narration-timestamps.json'),
      editMapPath: join(root, 'audio-edit-map.json'),
      sampleRate: SR,
      fps,
      tightening: {thresholdSec: 2.0, retainedSec: 0.3},
      leadTrimSec: 0.05,
      hook: {limitSec: 3.0, finalWordStem: 'tanganmu', fallback: {dropWordStem: 'itu', afterStem: 'dituas', beforeStem: 'bukan'}},
      rewinds: [{name: 'rewind-1', tailStem: 'mati', nextStem: 'balik', rewindSec: 0.4, dreadSec: 0}],
      tail: {padSec: 1.0, releaseFadeSec: 0.05},
      assembledCutSec: 12.4,
      targetWindowSec: [12.0, 13.0],
      panels: [{panel: 'P01', fromStem: 'tangan', toStem: 'tanganmu'}],
      publicAssetsDir: join(root, 'public-assets'),
    };
    writeFileSync(configPath, JSON.stringify(config));
    const result = await prepareNarration(configPath, {});
    assert.ok(result.preparedDurationSec > 0);
    const editMap = JSON.parse(readFileSync(join(root, 'audio-edit-map.json'), 'utf8'));
    assert.equal(editMap.hookWithinLimit, true);
    assert.equal(editMap.hookFallback, true, 'the documented hook fallback is recorded in the edit map');
    assert.ok(editMap.assemblerHandoff?.preparedTrack?.durationSec > 0, 'assemblerHandoff block emitted');
    assert.equal(editMap.panelWordSpans?.length, 1, 'panel word-span table emitted');
    assert.equal(editMap.claimedSilenceWindows?.length, 1, 'rewind window recorded');
    assert.equal(editMap.claimedSilenceWindows[0].kind, 'rewind');
    const timings = JSON.parse(readFileSync(join(root, 'narration-timestamps.json'), 'utf8'));
    assert.equal(timings.master, true);
    assert.equal(timings.words.length, e2eWords.length - 1, 'the dropped filler word is removed from the word track');
    assert.equal(timings.words.find(word => word.word === 'itu,'), undefined);
    assert.ok(Math.abs(timings.durationSec - result.preparedDurationSec) < 0.01);
    for (const derivative of ['narration-prepared.wav', 'narration-prepared.mp3', 'narration-timestamps.json']) {
      assert.ok(existsSync(join(root, 'public-assets', derivative)), `derivative copied: ${derivative}`);
    }
    // A second run refuses to overwrite approved outputs without --force.
    await assert.rejects(() => prepareNarration(configPath, {}), /Output already exists/);
    await assert.doesNotReject(() => prepareNarration(configPath, {force: true}));
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});
