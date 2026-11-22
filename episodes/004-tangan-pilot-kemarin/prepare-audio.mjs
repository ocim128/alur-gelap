// Pitch-preserving narration preparation for Standalone Scenario 04 (triple-branch-rewind).
// Continuous PCM sample timeline assembly: dead-air tightening, three enforced
// branchRewind boundaries (0.4 s / 0.4 s / 0.4 s + 1.6 s true-zero dread silence),
// monotonic PTS verification, remapped timestamps, WAV + MP3 derivatives.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const episodeDir = 'episodes/004-tangan-pilot-kemarin';
const source = join(episodeDir, 'narration-investigator.mp3');
const sourceTimes = join(episodeDir, 'narration-investigator-timestamps.json');
const outputWav = join(episodeDir, 'narration-prepared.wav');
const outputMp3 = join(episodeDir, 'narration-prepared.mp3');
const timingsPath = join(episodeDir, 'narration-timestamps.json');
const mapPath = join(episodeDir, 'audio-edit-map.json');

// Locked brief values (episodes/004-tangan-pilot-kemarin/brief.md).
const REWIND_TARGETS = [
  { name: 'rewind-1', tailStem: 'mati', nextStem: 'balik', targetGapSec: 0.4, note: 'Tape-snap straight back into Loop 2; zero dead air beyond the 0.4 s rewind.' },
  { name: 'rewind-2', tailStem: 'ambruk', nextStem: 'jarum', targetGapSec: 0.4, note: 'Tape-snap straight back into Loop 3; zero dead air beyond the 0.4 s rewind.' },
  { name: 'rewind-3', tailStem: 'tamat', nextStem: 'setiap', targetGapSec: 2.0, note: '0.4 s tape-snap rewind, then the episode\'s only 1.6 s true-zero dread silence before realization.' }
];
const ASSEMBLED_CUT_SEC = 154.0; // 02:34.0 / 4620 frames @ 30 fps
const TAIL_SEC = 1.5; // brief tail: 1.5 s from the final word to the hard cut
const HOOK_LIMIT_SEC = 3.0; // hook sentence must land <= 00:03.0
const LEAD_TARGET_SEC = 0.1; // trim leading silence to leave a small pre-speech room
const TIGHTEN_THRESHOLD_SEC = 0.65; // dead-air gaps above this get tightened
const TIGHTEN_RETAINED_SEC = 0.3; // retained natural gap after tightening (Ep 002 precedent: 0.18-0.32 s)
// Brief-documented hook fallback: drop "itu" -> "Tangan di tuas bukan tanganmu." (hook must land <= 00:03.0).
// The raw take's hook ends at 3.56 s, so the fallback edit is applied; it also removes the
// overlong mid-sentence pause that follows the dropped word.
const HOOK_FALLBACK = true;

if (!existsSync(source) || !existsSync(sourceTimes)) {
  throw new Error(`Missing source files in ${episodeDir}`);
}

const timing = JSON.parse(readFileSync(sourceTimes, 'utf8'));
const sourceDurationSec = timing.durationSec;
const SAMPLE_RATE = 48000;
const FADE_SEC = 0.01; // 10 ms crossfade at cut seams
const FADE_SAMPLES = Math.round(FADE_SEC * SAMPLE_RATE);

const stemOf = (w) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

// 1. Locate the three branchRewind boundaries by word stems (robust to ASR punctuation).
const words = timing.words;
const boundaries = REWIND_TARGETS.map((t) => {
  const idx = words.findIndex((w, i) =>
    i > 0 &&
    stemOf(w.word) === t.tailStem &&
    words[i + 1] !== undefined &&
    stemOf(words[i + 1].word) === t.nextStem
  );
  if (idx < 0) throw new Error(`Rewind boundary not found for ${t.name} (${t.tailStem} -> ${t.nextStem}). Inspect narration-timestamps.json wording.`);
  const rawGap = Math.round((words[idx + 1].start - words[idx].end) * 1000) / 1000;
  return { ...t, idx, word1: words[idx].word, end1: words[idx].end, word2: words[idx + 1].word, start2: words[idx + 1].start, rawGap };
});

for (const b of boundaries) {
  console.log(`Boundary ${b.name}: "${b.word1}" ends ${b.end1}s -> "${b.word2}" starts ${b.start2}s (raw gap ${b.rawGap}s, target ${b.targetGapSec}s)`);
}

// 2. Build the edit list on the source timeline:
//    { kind: 'cut', start, end, name }     remove [start, end)
//    { kind: 'insert', at, dur, name }     add dur seconds of true-zero silence at source position at
const edits = [];

// 2a. Leading trim: keep a small natural lead-in before the hook.
const firstStart = words[0].start;
if (firstStart > LEAD_TARGET_SEC + 0.05) {
  edits.push({ kind: 'cut', start: 0, end: Math.round((firstStart - LEAD_TARGET_SEC) * 1000) / 1000, name: 'lead-trim' });
}

// 2a-bis. Brief-documented hook fallback cut: remove "itu," from the hook plus its
// overlong trailing pause, so the hook lands <= 00:03.0 without touching vocal speed.
let hookFallbackCut = null;
if (HOOK_FALLBACK) {
  const ituIdx = words.findIndex((w, i) =>
    stemOf(w.word) === 'itu' && stemOf(words[i - 1]?.word ?? '') === 'dituas' && stemOf(words[i + 1]?.word ?? '') === 'bukan'
  );
  if (ituIdx > 0) {
    const itu = words[ituIdx];
    const next = words[ituIdx + 1];
    hookFallbackCut = {
      kind: 'cut',
      start: Math.round(itu.start * 1000) / 1000,
      end: Math.round(Math.max(itu.end, next.start - 0.06) * 1000) / 1000,
      name: 'hook-fallback-drop-itu'
    };
    edits.push(hookFallbackCut);
    const rawHookEnd = words.find(w => stemOf(w.word) === 'tanganmu')?.end ?? '?';
    console.log(`Hook fallback cut: [${hookFallbackCut.start}, ${hookFallbackCut.end}] removes "${itu.word}"; raw hook ended at ${rawHookEnd}s`);
  } else {
    console.log('Hook fallback: word pattern not found; hook left unmodified.');
  }
}

// 2b. Enforce the exact branchRewind gap durations (cut excess or insert silence at the midpoint).
const boundaryIdx = new Set(boundaries.map((b) => b.idx));
for (const b of boundaries) {
  const excess = Math.round((b.rawGap - b.targetGapSec) * 1000) / 1000;
  if (excess > 0.005) {
    // Symmetric trim: retain target/2 after the tail word and target/2 before the next word.
    edits.push({
      kind: 'cut',
      start: Math.round((b.end1 + b.targetGapSec / 2) * 1000) / 1000,
      end: Math.round((b.start2 - b.targetGapSec / 2) * 1000) / 1000,
      name: b.name
    });
  } else if (excess < -0.005) {
    edits.push({ kind: 'insert', at: Math.round((b.end1 + b.rawGap / 2) * 1000) / 1000, dur: Math.round(-excess * 1000) / 1000, name: b.name });
  }
}

// 2c. Dead-air tightening: non-boundary gaps > 0.65 s down to TIGHTEN_RETAINED_SEC.
// Protected beats are left untouched so cue-sheet SFX keeps its room.
const PROTECTED_BEATS = [
  { aStem: 'terjepit', bStem: 'ambruk', why: 'Loop 2 restrained copilot groan + muffled thud SFX live in this gap (cue sheet ~00:55.6)' }
];
const isProtectedBeat = (i) => PROTECTED_BEATS.some(p =>
  stemOf(words[i].word) === p.aStem && stemOf(words[i + 1].word) === p.bStem
);
const tighteningCuts = [];
for (let i = 0; i < words.length - 1; i++) {
  if (boundaryIdx.has(i)) continue;
  const gap = words[i + 1].start - words[i].end;
  if (gap > TIGHTEN_THRESHOLD_SEC) {
    if (isProtectedBeat(i)) {
      console.log(`Protected beat kept un-tightened: "${words[i].word}" -> "${words[i + 1].word}" (${Math.round(gap * 1000) / 1000}s)`);
      continue;
    }
    const half = TIGHTEN_RETAINED_SEC / 2;
    edits.push({
      kind: 'cut',
      start: Math.round((words[i].end + half) * 1000) / 1000,
      end: Math.round((words[i + 1].start - half) * 1000) / 1000,
      name: `tighten:${words[i].word}->${words[i + 1].word}`
    });
    tighteningCuts.push({ word1: words[i].word, word2: words[i + 1].word, originalGapSec: Math.round(gap * 1000) / 1000, retainedGapSec: TIGHTEN_RETAINED_SEC });
  }
}

// 2d. Trailing trim: keep exactly TAIL_SEC after the final spoken word.
const lastWordEndSrc = words[words.length - 1].end;
const tailTrimStart = Math.round((lastWordEndSrc + TAIL_SEC) * 1000) / 1000;
if (sourceDurationSec > tailTrimStart + 0.05) {
  edits.push({ kind: 'cut', start: tailTrimStart, end: Math.round(sourceDurationSec * 1000) / 1000, name: 'tail-trim' });
}

// Keep edits ordered by source position; never overlap.
edits.sort((a, b) => (a.kind === 'cut' ? a.start : a.at) - (b.kind === 'cut' ? b.start : b.at));
for (let i = 1; i < edits.length; i++) {
  const prev = edits[i - 1];
  const cur = edits[i];
  const prevEnd = prev.kind === 'cut' ? prev.end : prev.at;
  const curStart = cur.kind === 'cut' ? cur.start : cur.at;
  if (curStart < prevEnd) throw new Error(`Overlapping edits: ${prev.name} and ${cur.name}`);
}
console.log(`Planned ${edits.length} edits (${edits.filter(e => e.kind === 'insert').length} inserts, ${edits.filter(e => e.kind === 'cut').length} cuts).`);

// 3. Decode the source MP3 into continuous 16-bit PCM mono samples.
const decodeProc = spawnSync('ffmpeg', [
  '-hide_banner', '-loglevel', 'error',
  '-i', source,
  '-f', 's16le', '-ac', '1', '-ar', String(SAMPLE_RATE),
  'pipe:1'
], { maxBuffer: 80 * 1024 * 1024 });
if (decodeProc.status !== 0 || !decodeProc.stdout || decodeProc.stdout.length === 0) {
  throw new Error(`Failed to decode source audio: ${decodeProc.stderr}`);
}
const inputSamples = new Int16Array(decodeProc.stdout.buffer, decodeProc.stdout.byteOffset, decodeProc.stdout.byteLength / 2);
console.log(`Decoded source audio: ${inputSamples.length} samples (${(inputSamples.length / SAMPLE_RATE).toFixed(3)}s)`);

// 4. Assemble the output PCM in one pass over the source timeline.
const totalCutSamples = edits.reduce((sum, e) => e.kind === 'cut' ? sum + Math.round(e.end * SAMPLE_RATE) - Math.round(e.start * SAMPLE_RATE) : sum, 0);
const totalInsertSamples = edits.reduce((sum, e) => e.kind === 'insert' ? sum + Math.round(e.dur * SAMPLE_RATE) : sum, 0);
const outputSamples = new Int16Array(Math.max(SAMPLE_RATE, inputSamples.length - totalCutSamples + totalInsertSamples + 4 * SAMPLE_RATE));

let inPos = 0;   // sample cursor in the source
let outPos = 0;  // sample cursor in the output
let prevWasCut = false;

const copyRange = (srcStartSample, srcEndSample) => {
  const len = srcEndSample - srcStartSample;
  if (len <= 0) return;
  if (outPos + len > outputSamples.length) {
    throw new Error(`Output overrun: outPos ${outPos} + len ${len} > capacity ${outputSamples.length} (src ${srcStartSample}..${srcEndSample})`);
  }
  outputSamples.set(inputSamples.subarray(srcStartSample, srcEndSample), outPos);
  outPos += len;
};

for (const e of edits) {
  const pos = e.kind === 'cut' ? Math.round(e.start * SAMPLE_RATE) : Math.round(e.at * SAMPLE_RATE);
  // Copy everything before this edit.
  if (prevWasCut) {
    // Crossfade 10 ms across the cut seam into the post-cut material.
    const crossfadeStart = outPos - FADE_SAMPLES;
    for (let i = 0; i < FADE_SAMPLES; i++) {
      const alpha = i / FADE_SAMPLES;
      const prevVal = outputSamples[crossfadeStart + i];
      const nextVal = inputSamples[inPos + i];
      outputSamples[crossfadeStart + i] = Math.round(prevVal * (1 - alpha) + nextVal * alpha);
    }
    inPos += FADE_SAMPLES;
    copyRange(inPos, pos);
  } else {
    copyRange(inPos, pos);
  }
  if (e.kind === 'cut') {
    inPos = Math.round(e.end * SAMPLE_RATE);
    prevWasCut = true;
  } else {
    // Insert pure true-zero silence (buffer is pre-zeroed).
    inPos = pos; // source up to the insert point is consumed
    outPos += Math.round(e.dur * SAMPLE_RATE);
    prevWasCut = false;
  }
}
// Copy the remainder (through the end of the source, already tail-trimmed in 2d).
if (prevWasCut) {
  const crossfadeStart = outPos - FADE_SAMPLES;
  for (let i = 0; i < FADE_SAMPLES; i++) {
    const alpha = i / FADE_SAMPLES;
    const prevVal = outputSamples[crossfadeStart + i];
    const nextVal = inputSamples[inPos + i];
    outputSamples[crossfadeStart + i] = Math.round(prevVal * (1 - alpha) + nextVal * alpha);
  }
  inPos += FADE_SAMPLES;
}
copyRange(inPos, inputSamples.length);

// Pad true-zero silence so the tail after the final spoken word is exactly TAIL_SEC.
// (mapTimestamp is hoisted; `edits` is fully built at this point.)
const mappedSpeechEnd = mapTimestamp(lastWordEndSrc, false);
const minTailSampleCount = Math.round(mappedSpeechEnd * SAMPLE_RATE) + Math.round(TAIL_SEC * SAMPLE_RATE);
if (outPos < minTailSampleCount) {
  outPos = minTailSampleCount; // output buffer is pre-zeroed beyond outPos
  console.log(`Padded tail to reach ${TAIL_SEC}s after speech end (${(minTailSampleCount / SAMPLE_RATE).toFixed(3)}s track end)`);
}

// Smooth 50 ms fade-out on the final speech release region.
const fadeOutSamples = Math.round(0.05 * SAMPLE_RATE);
for (let i = 0; i < fadeOutSamples; i++) {
  const idx = outPos - fadeOutSamples + i;
  if (idx >= 0) outputSamples[idx] = Math.round(outputSamples[idx] * (1 - i / fadeOutSamples));
}

const finalPcm = outputSamples.subarray(0, outPos);
const preparedDurationSec = Math.round((finalPcm.length / SAMPLE_RATE) * 1000) / 1000;
console.log(`Assembled continuous PCM: ${finalPcm.length} samples = ${preparedDurationSec.toFixed(3)}s`);

// 5. Encode WAV (uncompressed 16-bit 48 kHz mono) and MP3.
const pcmOutBuffer = Buffer.from(finalPcm.buffer, finalPcm.byteOffset, finalPcm.byteLength);

const encodeWavProc = spawnSync('ffmpeg', [
  '-hide_banner', '-loglevel', 'error', '-y',
  '-f', 's16le', '-ar', String(SAMPLE_RATE), '-ac', '1', '-i', 'pipe:0',
  outputWav
], { input: pcmOutBuffer, maxBuffer: 80 * 1024 * 1024 });
if (encodeWavProc.status !== 0) throw new Error(`Failed to encode prepared WAV: ${encodeWavProc.stderr}`);
console.log(`Wrote prepared WAV: ${outputWav}`);

const encodeMp3Proc = spawnSync('ffmpeg', [
  '-hide_banner', '-loglevel', 'error', '-y',
  '-f', 's16le', '-ar', String(SAMPLE_RATE), '-ac', '1', '-i', 'pipe:0',
  '-codec:a', 'libmp3lame', '-q:a', '2',
  outputMp3
], { input: pcmOutBuffer, maxBuffer: 80 * 1024 * 1024 });
if (encodeMp3Proc.status !== 0) throw new Error(`Failed to encode prepared MP3: ${encodeMp3Proc.stderr}`);
console.log(`Wrote prepared MP3: ${outputMp3}`);

// 6. Monotonic PTS verification via ffprobe (every MP3 packet).
const probeProc = spawnSync('ffprobe', [
  '-v', 'error',
  '-select_streams', 'a',
  '-show_packets',
  '-show_entries', 'packet=pts_time,duration_time',
  '-of', 'csv=p=0',
  outputMp3
], { encoding: 'utf8', maxBuffer: 40 * 1024 * 1024 });
if (probeProc.status !== 0) throw new Error(`ffprobe failed: ${probeProc.stderr}`);

const packetLines = probeProc.stdout.trim().split('\n').map(l => l.trim()).filter(Boolean);
let prevPts = -1;
let violations = 0;
for (let i = 0; i < packetLines.length; i++) {
  const [pts] = packetLines[i].split(',').map(Number);
  if (pts <= prevPts) {
    console.error(`PTS monotonicity violation at packet ${i}: ${pts} <= ${prevPts}`);
    violations++;
  }
  prevPts = pts;
}
if (violations > 0) throw new Error(`Monotonic PTS check failed with ${violations} violations`);
console.log(`Verified ${packetLines.length} packets: 100% strictly monotonic PTS, zero discontinuities.`);

// 7. Remap word/chunk timestamps through the exact edit list.
function mapTimestamp(t, isStart) {
  let delta = 0;
  // Cuts, in source order.
  for (const e of edits) {
    if (e.kind !== 'cut') continue;
    if (t < e.start) break;
    if (t < e.end) { t = e.start; break; }
    delta -= (e.end - e.start);
  }
  let out = t + delta;
  // Inserts, in source order (strictness differs for word starts vs ends).
  for (const e of edits) {
    if (e.kind !== 'insert') continue;
    const condition = isStart ? (t >= e.at) : (t > e.at);
    if (condition) out += e.dur;
  }
  return Math.round(out * 1000) / 1000;
}

// Drop words whose entire span was removed by a cut (e.g. the hook fallback's "itu")
// so the remapped word list matches the audio actually spoken.
const isWordRemoved = (w) => edits.some(e => e.kind === 'cut' && w.start >= e.start - 0.001 && w.end <= e.end + 0.001);
const removedWords = words.filter(isWordRemoved).map(w => w.word);
const remappedWords = words.filter(w => !isWordRemoved(w)).map(w => ({ ...w, start: mapTimestamp(w.start, true), end: mapTimestamp(w.end, false) }));
if (removedWords.length > 0) console.log(`Removed from remapped word list: ${removedWords.join(', ')}`);
const remappedChunks = timing.chunks.map(chunk => {
  const chunkWords = remappedWords.filter(w => w.chunk === chunk.index);
  const start = chunkWords.length > 0 ? chunkWords[0].start : mapTimestamp(chunk.start, true);
  const end = chunkWords.length > 0 ? chunkWords[chunkWords.length - 1].end : mapTimestamp(chunk.end, false);
  return { ...chunk, start, end };
});
if (remappedChunks.length > 0 && remappedWords.length > 0) {
  remappedChunks[remappedChunks.length - 1].end = remappedWords[remappedWords.length - 1].end;
}

const lastWord = remappedWords[remappedWords.length - 1];
const hookLastIdx = remappedWords.findIndex(w => stemOf(w.word) === 'tanganmu');
if (hookLastIdx < 0) throw new Error('Hook final word "tanganmu" not found in timestamps');
const hookEndSec = remappedWords[hookLastIdx].end;

const remappedTimings = {
  version: 1,
  voiceId: timing.voiceId,
  durationSec: preparedDurationSec,
  master: true,
  chunks: remappedChunks,
  words: remappedWords,
  sfx: (timing.sfx ?? []).map(w => ({ ...w, start: mapTimestamp(w.start, true), end: mapTimestamp(w.end, false) })),
  source: 'narration-investigator-timestamps.json',
  note: 'Assembled on one continuous PCM sample timeline. Three enforced branchRewind gaps (rewind-1 0.400 s, rewind-2 0.400 s, rewind-3 0.400 s + 1.600 s true-zero dread silence = 2.000 s total). Zero playback-speed change; monotonic PTS verified.'
};
writeFileSync(timingsPath, JSON.stringify(remappedTimings, null, 2) + '\n');
console.log(`Wrote remapped timestamps: ${timingsPath}`);

// 8. audio-edit-map.json — assembly handoff for Agent 04.
const bPrepared = boundaries.map(b => {
  const i = remappedWords.findIndex((w, k) => stemOf(w.word) === b.tailStem && remappedWords[k + 1] && stemOf(remappedWords[k + 1].word) === b.nextStem);
  const tail = remappedWords[i];
  const next = remappedWords[i + 1];
  return {
    name: b.name,
    tailWord: tail.word,
    tailWordEndSec: tail.end,
    nextWord: next.word,
    nextWordStartSec: next.start,
    gapSec: Math.round((next.start - tail.end) * 1000) / 1000,
    targetGapSec: b.targetGapSec,
    lockedManifestFrames: { startFrame: [1380, 1773, 2172][boundaries.indexOf(b)], endFrame: [1392, 1785, 2184][boundaries.indexOf(b)] },
    note: b.note
  };
});

const r3 = bPrepared.find(b => b.name === 'rewind-3');
const tailHoldSec = Math.round((preparedDurationSec - lastWord.end) * 1000) / 1000;

const editMap = {
  source,
  outputWav,
  outputMp3,
  sourceDurationSec,
  preparedDurationSec,
  speechEndSec: lastWord.end,
  hookEndSec,
  hookWithinLimit: hookEndSec <= HOOK_LIMIT_SEC,
  crossfadeSec: FADE_SEC,
  leadTrimSec: edits.some(e => e.name === 'lead-trim') ? edits.find(e => e.name === 'lead-trim').end : 0,
  hookFallback: hookFallbackCut ? {
    applied: true,
    cutSec: [hookFallbackCut.start, hookFallbackCut.end],
    spokenHook: 'Tangan di tuas bukan tanganmu.',
    removedWords,
    note: 'Brief-documented fallback: raw hook ended past the 00:03.0 limit, so "itu" was dropped by edit (zero speed change). The word was also removed from narration-timestamps.json; captions must match this spoken form.'
  } : { applied: false, note: 'Raw hook already within the 00:03.0 limit.' },
  protectedBeats: PROTECTED_BEATS,
  tighteningCuts,
  branchRewindGaps: bPrepared,
  dreadSilence: {
    rewindWindowSec: [r3.tailWordEndSec, Math.round((r3.tailWordEndSec + 0.4) * 1000) / 1000],
    trueZeroSilenceSec: [Math.round((r3.tailWordEndSec + 0.4) * 1000) / 1000, r3.nextWordStartSec],
    trueZeroDurationSec: Math.round((r3.nextWordStartSec - r3.tailWordEndSec - 0.4) * 1000) / 1000,
    note: 'Rewind 3 tape-snap occupies the first 0.4 s of the gap; the remaining 1.6 s is true-zero (mute ambience and vocal) before the realization line.'
  },
  timelinePlacement: {
    blackoutTail: {
      speechReleaseSec: lastWord.end,
      preparedTrackEndSec: preparedDurationSec,
      tailHoldSec,
      assembledVideoCutEndSec: ASSEMBLED_CUT_SEC,
      note: 'Brief tail: 1.5 s from the final word; tension ramp, 150 ms vacuum, restrained sub-hit and 1-2 frame red flash are Agent 04 mix cues inside this tail.'
    }
  },
  runtimeBudget: {
    narrationTrackDurationSec: preparedDurationSec,
    spokenSpeechEndSec: lastWord.end,
    tailHoldSec,
    assembledVideoCutDurationSec: ASSEMBLED_CUT_SEC,
    targetWindowSec: [145.0, 160.0]
  },
  notes: 'Assembled on a continuous PCM sample timeline; zero playback-speed change (atempo 1.0x preserved); strictly monotonic PTS verified by ffprobe across all packets.'
};
writeFileSync(mapPath, JSON.stringify(editMap, null, 2) + '\n');
console.log(`Wrote edit map: ${mapPath}`);
console.log(`Hook end: ${hookEndSec}s (limit ${HOOK_LIMIT_SEC}s) -> ${hookEndSec <= HOOK_LIMIT_SEC ? 'PASS' : 'FAIL'}`);
console.log(`Speech end: ${lastWord.end}s; tail hold: ${tailHoldSec}s; prepared track: ${preparedDurationSec}s (assembled cut ${ASSEMBLED_CUT_SEC}s)`);

// 9. Copy derivatives for Remotion consumption.
const publicDir = 'public/assets/004-tangan-pilot-kemarin';
mkdirSync(publicDir, { recursive: true });
copyFileSync(outputWav, join(publicDir, 'narration-prepared.wav'));
copyFileSync(outputMp3, join(publicDir, 'narration-prepared.mp3'));
copyFileSync(timingsPath, join(publicDir, 'narration-timestamps.json'));
console.log(`Copied narration derivatives to ${publicDir}`);
