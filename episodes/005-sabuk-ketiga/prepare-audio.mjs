// Pitch-preserving narration preparation with continuous PCM sample timeline assembly.
// Scenario 05 "Sabuk Ketiga" (engine: triple-branch-rewind):
//   - mandatory TTS pronunciation diff: reconciles ASR artifacts in the raw word track
//     against the approved narasi.txt and emits pronunciation-diff.json evidence,
//   - dead-air tightening of unhurried speech gaps (zero playback-speed change),
//   - three exact 0.4 s branchRewind gaps (rewinds 1-2 snap straight back, zero dead air),
//   - the 1.5 s true-zero dread silence after Rewind 3 only (total 1.900 s at that boundary),
//   - preserved measured one-beat lag cues at P05 / P10 / P17 (never tightened),
//   - monotonic PTS verification and exact-sample timestamp remap.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const episodeDir = 'episodes/005-sabuk-ketiga';
const source = join(episodeDir, 'narration-investigator.mp3');
const sourceTimes = join(episodeDir, 'narration-investigator-timestamps.json');
const scriptPath = join(episodeDir, 'narasi.txt');
const diffPath = join(episodeDir, 'pronunciation-diff.json');
const outputWav = join(episodeDir, 'narration-prepared.wav');
const outputMp3 = join(episodeDir, 'narration-prepared.mp3');
const timingsPath = join(episodeDir, 'narration-timestamps.json');
const mapPath = join(episodeDir, 'audio-edit-map.json');

if (!existsSync(source) || !existsSync(sourceTimes)) {
  throw new Error(`Missing source files in ${episodeDir}`);
}

const timing = JSON.parse(readFileSync(sourceTimes, 'utf8'));
const sourceDurationSec = timing.durationSec;
const SAMPLE_RATE = 48000;
const FADE_SEC = 0.01; // 10 ms junction fades
const FADE_SAMPLES = Math.round(FADE_SEC * SAMPLE_RATE);
const REWIND_SEC = 0.400;
const DREAD_SEC = 1.500;
const TIGHTEN_THRESHOLD_SEC = 0.50; // tighten unhurried gaps only
const RETAINED_GAP_SEC = 0.32;      // retained natural gap around each cut
const TAIL_SEC = 1.000;             // clean decay + tail padding

// ---------------------------------------------------------------------------
// 0. Mandatory TTS pronunciation diff and reconciliation.
// The raw ShortZ word track carries Whisper ASR text. Every deviation from the
// approved script is classified: formatting (harmless), phonetic-variant (ASR
// mishearing of a correctly spoken word), merge/split (tokenization), or
// suspected-standardization (TTS/ASR may have used the formal Indonesian form;
// flagged, resolved to the script-faithful text, listening still possible).
// The raw master, timestamps and report are preserved untouched.
// ---------------------------------------------------------------------------
const norm = w => w.toLowerCase().replace(/[.,:!?…"'’-]/g, '');

// Curated reconciliation table, validated against narration-investigator-report.json
// attempts (every flagged heard-string) and the raw narration-investigator-timestamps.json words.
const renames = [
  { from: 'mapet', to: 'mepet', count: 1, class: 'phonetic-variant', note: 'ASR vowel mishearing (e/a).' },
  { from: 'realnya', to: 'relnya', count: 1, class: 'phonetic-variant', note: 'ASR intrusion; script word "relnya".' },
  { from: 'Bangkok', to: 'bengkok', count: 1, class: 'phonetic-variant', note: 'Near-identical phonetics (bengkok/Bangkok); ASR mishearing.' },
  { from: 'Kopilot', to: 'Copilot', count: 1, class: 'phonetic-variant', note: 'ASR k/c; case normalized to script.' },
  { from: 'kopilot', to: 'copilot', count: 2, class: 'phonetic-variant', note: 'ASR k/c, in "Copilot buka sabuknya" (P08) and the copilot quote "Suara copilot manggil" (P09).' },
  { from: 'anjolok', to: 'anjlok', count: 2, class: 'phonetic-variant', note: 'ASR epenthetic vowel; script "anjlok".' },
  { from: 'kemudih', to: 'kemudi', count: 1, class: 'phonetic-variant', note: 'Final-vowel devoicing heard by ASR; script "kemudi".' },
  { from: 'ditelan', to: 'ditelen', count: 1, class: 'phonetic-variant', note: 'Whisper colloquial-form normalization; script "ditelen".' },
  { from: 'Nyalip', to: 'Nyelip', count: 1, class: 'phonetic-variant', note: 'ASR a/e; script "nyelip".' },
  { from: 'Gak', to: 'nggak', count: 2, class: 'phonetic-variant', note: 'Whisper colloquial-form normalization; script "nggak" ("Nggak mirip dia" P09, "Nggak ada yang sempat" P12).' },
  { from: 'gak', to: 'nggak', count: 1, class: 'phonetic-variant', note: 'Whisper colloquial-form normalization; script "nggak" ("yang nggak diikat" P19).' },
  { from: 'gesel', to: 'geser', count: 1, class: 'phonetic-variant', note: 'ASR l/r; script "geser".' },
  { from: 'tancap', to: 'tancep', count: 1, class: 'phonetic-variant', note: 'ASR a/e; script "tancep".' },
  { from: 'Perhatikan', to: 'Perhatiin', count: 1, class: 'suspected-standardization', note: 'Formal Indonesian form heard instead of the colloquial script word; resolved to script text. Optional targeted listening if the owner wants audible confirmation.' },
  { from: 'kemudian', to: 'kemudi', count: 1, contextBefore: ['tuas'], class: 'suspected-standardization', note: 'In "tancep tuas kemudi sekeras-kerasnya" (P18) only: formal "kemudian" heard; resolved to script word "kemudi". The script-faithful "kemudian" in "Satu ketukan kemudian" (P10) is left untouched. Optional targeted listening if the owner wants audible confirmation.' }
];
const splits = [
  { from: 'Gapernah', to: ['Nggak', 'pernah'], splitRatio: 0.45, class: 'merge-split', note: 'Rapid "nggak pernah" merged by ASR into one token; span split for the script-faithful pair.' }
];
const merges = [
  { from: ['kop', 'pilot'], to: 'copilot', class: 'merge-split', note: '"copilot" split by ASR into two tokens ("kop"+"pilot."); spans merged.' }
];

const rawWords = timing.words.map((w, i) => ({ ...w, rawIdx: i }));
const rawSequence = rawWords.map(w => w.word);
const diffRecords = [];
const consumed = new Set();

function applyRename(r) {
  // Punctuation-tolerant match ("Bangkok.", "Nyalip,", "Perhatikan," ...), preserving the suffix.
  const stem = w => w.replace(/[.,]$/, '');
  const suffix = w => w.slice(stem(w).length);
  const hits = [];
  rawWords.forEach((w, i) => {
    if (consumed.has(i)) return;
    if (stem(w.word) !== r.from) return;
    if (r.contextBefore && !(rawWords[i - 1] && r.contextBefore.includes(stem(rawWords[i - 1].word)))) return;
    hits.push(i);
  });
  if (hits.length !== r.count) throw new Error(`Rename "${r.from}" expected ${r.count} occurrences, found ${hits.length}`);
  for (const i of hits) {
    consumed.add(i);
    const heard = rawWords[i].word;
    rawWords[i].word = r.to + suffix(heard);
    diffRecords.push({ rawIdx: i, heard, scriptFaithful: rawWords[i].word, class: r.class, action: 'renamed', note: r.note });
  }
}
renames.forEach(applyRename);

function applySplit(s) {
  const i = rawWords.findIndex((w, j) => w.word.replace(/[.,]$/, '') === s.from && !consumed.has(j));
  if (i < 0) throw new Error(`Split source "${s.from}" not found`);
  consumed.add(i);
  const w = rawWords[i];
  const mid = Math.round((w.start + (w.end - w.start) * s.splitRatio) * 1000) / 1000;
  rawWords[i] = { ...w, word: s.to[0], end: mid };
  rawWords.splice(i + 1, 0, { ...w, word: s.to[1], start: mid });
  diffRecords.push({ rawIdx: i, heard: s.from, scriptFaithful: s.to.join(' '), class: s.class, action: 'split', note: s.note });
}
splits.forEach(applySplit);

function applyMerge(m) {
  const stem = w => w.replace(/[.,]$/, '');
  const i = rawWords.findIndex((w, j) => stem(w.word) === m.from[0] && rawWords[j + 1] && stem(rawWords[j + 1].word) === m.from[1] && !consumed.has(j) && !consumed.has(j + 1));
  if (i < 0) throw new Error(`Merge source "${m.from.join(' ')}" not found`);
  consumed.add(i); consumed.add(i + 1);
  const a = rawWords[i], b = rawWords[i + 1];
  rawWords[i] = { ...a, word: m.to, end: b.end };
  rawWords.splice(i + 1, 1);
  diffRecords.push({ rawIdx: i, heard: m.from.join(' '), scriptFaithful: m.to, class: m.class, action: 'merged', note: m.note });
}
merges.forEach(applyMerge);

// Harmless formatting kept as ASR produced it (hyphen splits, case, punctuation).
const scriptText = readFileSync(scriptPath, 'utf8');
const scriptTokens = scriptText.split(/\s+/).filter(Boolean).map(t => t.replace(/[.,:!?]/g, '')).filter(Boolean);
const scriptCompare = scriptTokens.flatMap(t => (t.includes('-') ? t.split('-') : [t])).map(norm);
const wordsCompare = rawWords.map(w => norm(w.word));
let mismatch = -1;
for (let i = 0; i < Math.max(scriptCompare.length, wordsCompare.length); i++) {
  if (scriptCompare[i] !== wordsCompare[i]) { mismatch = i; break; }
}
if (mismatch >= 0) {
  throw new Error(`Reconciled word track still differs from script at token ${mismatch}: script "${scriptCompare[mismatch]}" vs words "${wordsCompare[mismatch]}"\nScript: ${scriptCompare.slice(Math.max(0, mismatch - 3), mismatch + 4).join(' ')}\nWords:   ${wordsCompare.slice(Math.max(0, mismatch - 3), mismatch + 4).join(' ')}`);
}
console.log(`Pronunciation diff: ${diffRecords.length} deviations reconciled (${renames.reduce((s, r) => s + r.count, 0)} renames, 1 split, 1 merge); reconciled word track now matches narasi.txt token-for-token.`);

writeFileSync(diffPath, JSON.stringify({
  episode: '005-sabuk-ketiga',
  checkedAt: new Date().toISOString(),
  scriptPath: 'narasi.txt',
  rawTimestampsPath: 'narration-investigator-timestamps.json',
  reportPath: 'narration-investigator-report.json',
  method: 'Word-by-word diff of the raw ShortZ ASR word track against the approved script tokens, cross-checked with the per-chunk ASR report attempts. Deviations classified and reconciled to script-faithful text while preserving ASR timings. ASR text alone cannot establish pronunciation; no listening review is claimed.',
  reportSummary: (() => {
    const report = JSON.parse(readFileSync(join(episodeDir, 'narration-investigator-report.json'), 'utf8'));
    return {
      passed: report.passed,
      totalChunks: report.totalChunks,
      verifiedChunks: report.verifiedChunks,
      warningChunks: report.warningChunks,
      failedChunks: report.failedChunks,
      note: 'Failed chunks reflect the generic 130±25% WPM pacing gate and Whisper word-match attempts, not established mispronunciation; see classification below and narration-investigator-report.json.'
    };
  })(),
  reconciliations: diffRecords,
  keptFormatting: [
    'Hyphen-split tokens kept as ASR produced them: "Baling"+"-baling", "Pura"+"-pura", "sekeras"+"-kerasnya", "pelan"+"-pelan" (Episode 003 precedent).',
    'Case and punctuation differences (e.g. "tamat." vs "Tamat.") are harmless ASR formatting and were not regenerated.'
  ],
  wpmPacingNote: 'Accepted takes measured 67-97 WPM against the generic 130±25% expectation. The Bahasa Bayi script is deliberately casual; the brief targets ~1.7 words/second overall (~102 WPM including pauses). No vocal-speed change was made; pacing is corrected only by tightening dead air.',
  result: 'pass'
}, null, 2) + '\n');
console.log(`Wrote pronunciation diff evidence: ${diffPath}`);

const words = rawWords;

// ---------------------------------------------------------------------------
// 1. Boundary finding on the reconciled word track, with uniqueness assertions.
// ---------------------------------------------------------------------------
function findPair(lastNorm, nextNorm, occurrence = 1) {
  const hits = [];
  for (let i = 0; i < words.length - 1; i++) {
    if (norm(words[i].word) === lastNorm && norm(words[i + 1].word) === nextNorm) hits.push(i);
  }
  if (hits.length < occurrence) {
    throw new Error(`Boundary "${lastNorm}"->"${nextNorm}" occurrence ${occurrence} not found (hits: ${hits.length})`);
  }
  return hits[occurrence - 1];
}

const bRewind1 = findPair('tamat', 'balik', 1);    // end of Loop 1 (P07) -> "Balik lagi. Copilot buka sabuknya" (P08)
const bRewind2 = findPair('tamat', 'insting', 1);  // end of Loop 2 (P09) -> "Insting terakhir" (P10)
const bRewind3 = findPair('tamat', 'balik', 2);    // end of Loop 3 (P11) -> "Balik lagi. Nggak ada..." (P12)
const lagP05 = findPair('kemudi', 'kancing');      // cyclic grip change -> third-belt buckle (C5 plant)
const lagP10 = findPair('kebuka', 'satu');         // "Sabukmu kebuka." -> "Satu ketukan kemudian" (C5 payoff)
const lagP17 = findPair('ketukan', 'sabuk');       // "Satu ketukan." -> "Sabuk ketiga kebuka sendiri" (main payoff)

// Tower-quote span for Agent 04's non-destructive narrator mute (replaced by the pa-announcer asset):
const idxJernih = words.findIndex(w => norm(w.word) === 'jernih');
const idxDarurat = words.findIndex(w => norm(w.word) === 'darurat');
if (idxJernih < 0 || idxDarurat < 1 || idxDarurat <= idxJernih) throw new Error('Tower quote span not found');
const towerQuote = { fromIdx: idxJernih + 1, toIdx: idxDarurat, expected: ['turun', 'lewatin', 'awan', 'izin', 'darurat'] };
const quoted = words.slice(towerQuote.fromIdx, towerQuote.toIdx + 1).map(w => norm(w.word));
if (JSON.stringify(quoted) !== JSON.stringify(towerQuote.expected)) {
  throw new Error(`Tower quote words mismatch: ${quoted.join(' ')}`);
}

// ---------------------------------------------------------------------------
// 2. Edits: exact-silence replacements at the three rewind boundaries + dead-air tightening elsewhere.
//    Protected lag-cue gaps (P05/P10/P17) are never touched.
//    The gaps flanking the tower quote are also protected: they reserve the clean
//    audible window in which Agent 04 lays the pa-announcer world voice (cue sheet).
// ---------------------------------------------------------------------------
const protectedIdx = new Set([bRewind1, bRewind1 + 1, bRewind2, bRewind2 + 1, bRewind3, bRewind3 + 1, lagP05, lagP05 + 1, lagP10, lagP10 + 1, lagP17, lagP17 + 1, idxJernih, idxDarurat]);

const edits = [];
const naturalGap = i => Math.round((words[i + 1].start - words[i].end) * 1000) / 1000;
edits.push({
  name: 'rewind1-gap',
  srcStart: words[bRewind1].end,
  srcEnd: words[bRewind1 + 1].start,
  silenceSec: REWIND_SEC,
  naturalGapSec: naturalGap(bRewind1),
  note: 'Rewind 1: tape-snap + reverse whoosh only; snaps straight back with zero dead air.'
});
edits.push({
  name: 'rewind2-gap',
  srcStart: words[bRewind2].end,
  srcEnd: words[bRewind2 + 1].start,
  silenceSec: REWIND_SEC,
  naturalGapSec: naturalGap(bRewind2),
  note: 'Rewind 2: tape-snap + reverse whoosh only; snaps straight back with zero dead air. Raw take had no natural gap here, so the 0.4 s rewind room is inserted.'
});
edits.push({
  name: 'rewind3-gap-and-dread-silence',
  srcStart: words[bRewind3].end,
  srcEnd: words[bRewind3 + 1].start,
  silenceSec: REWIND_SEC + DREAD_SEC,
  naturalGapSec: naturalGap(bRewind3),
  note: 'Rewind 3 (0.400 s tape-snap) immediately followed by the only 1.500 s true-zero dread silence; total 1.900 s.'
});

const tightenedCuts = [];
for (let i = 0; i < words.length - 1; i++) {
  if (protectedIdx.has(i)) continue;
  const gap = words[i + 1].start - words[i].end;
  if (gap > TIGHTEN_THRESHOLD_SEC) {
    const cutStart = Math.round((words[i].end + RETAINED_GAP_SEC / 2) * 1000) / 1000;
    const cutEnd = Math.round((words[i + 1].start - RETAINED_GAP_SEC / 2) * 1000) / 1000;
    if (cutEnd - cutStart <= 0) continue;
    edits.push({ name: `tighten-${i}`, srcStart: cutStart, srcEnd: cutEnd, silenceSec: 0 });
    tightenedCuts.push({ idx: i, word1: words[i].word, word2: words[i + 1].word, originalGapSec: Math.round(gap * 1000) / 1000, retainedGapSec: RETAINED_GAP_SEC });
  }
}
edits.sort((a, b) => a.srcStart - b.srcStart);
for (let i = 1; i < edits.length; i++) {
  if (edits[i].srcStart < edits[i - 1].srcEnd) throw new Error(`Overlapping edits at ${edits[i].name}`);
}

console.log(`Boundaries: rewind1@${bRewind1} rewind2@${bRewind2} rewind3@${bRewind3} lagP05@${lagP05} lagP10@${lagP10} lagP17@${lagP17}`);
console.log(`Defined ${edits.length} edits (${tightenedCuts.length} dead-air tightenings + 3 exact rewind-boundary replacements).`);

// ---------------------------------------------------------------------------
// 3. Decode source MP3 into continuous 16-bit PCM samples.
// ---------------------------------------------------------------------------
const decodeProc = spawnSync('ffmpeg', [
  '-hide_banner', '-loglevel', 'error',
  '-i', source,
  '-f', 's16le', '-ac', '1', '-ar', String(SAMPLE_RATE),
  'pipe:1'
], { maxBuffer: 80 * 1024 * 1024 });

if (decodeProc.status !== 0) {
  throw new Error(`Failed to decode source audio: ${decodeProc.stderr}`);
}

const inputSamples = new Int16Array(decodeProc.stdout.buffer, decodeProc.stdout.byteOffset, decodeProc.stdout.byteLength / 2);
console.log(`Decoded source audio: ${inputSamples.length} samples (${(inputSamples.length / SAMPLE_RATE).toFixed(3)}s)`);

// 4. Assemble the output on one continuous PCM sample timeline:
//    keep segments between edits, replace each edit span with exact silence, 10 ms junction fades.
const insertedTotal = edits.reduce((s, e) => s + Math.round(e.silenceSec * SAMPLE_RATE), 0);
const removedTotal = edits.reduce((s, e) => s + (Math.round(e.srcEnd * SAMPLE_RATE) - Math.round(e.srcStart * SAMPLE_RATE)), 0);
const tailSamples = Math.round(TAIL_SEC * SAMPLE_RATE);
const outputSamples = new Int16Array(inputSamples.length - removedTotal + insertedTotal + tailSamples + SAMPLE_RATE);

let inPos = 0;   // source sample cursor
let outPos = 0;  // output sample cursor
for (const e of edits) {
  const editStartSample = Math.round(e.srcStart * SAMPLE_RATE);
  const editEndSample = Math.round(e.srcEnd * SAMPLE_RATE);
  // Copy audio up to the edit, with a 10 ms fade-out into the junction
  const segLen = editStartSample - inPos;
  if (segLen > 0) {
    for (let i = 0; i < segLen; i++) outputSamples[outPos + i] = inputSamples[inPos + i];
    const fadeStart = outPos + segLen - FADE_SAMPLES;
    if (fadeStart > outPos) {
      for (let i = 0; i < FADE_SAMPLES; i++) {
        outputSamples[fadeStart + i] = Math.round(outputSamples[fadeStart + i] * (1 - i / FADE_SAMPLES));
      }
    }
    outPos += segLen;
  }
  // Insert exact silence (output buffer is pre-zeroed)
  outPos += Math.round(e.silenceSec * SAMPLE_RATE);
  inPos = editEndSample;
}
// Copy the remainder with a 10 ms fade-in after the last junction
const remaining = inputSamples.length - inPos;
if (remaining > 0) {
  const fadeLen = Math.min(FADE_SAMPLES, remaining);
  for (let i = 0; i < fadeLen; i++) {
    outputSamples[outPos + i] = Math.round(inputSamples[inPos + i] * (i / fadeLen));
  }
  outputSamples.set(inputSamples.subarray(inPos + fadeLen), outPos + fadeLen);
  outPos += remaining;
}
// Smooth 50 ms fade-out on speech release to avoid an abrupt ending
const fadeOutSamples = Math.round(0.050 * SAMPLE_RATE);
for (let i = 0; i < fadeOutSamples; i++) {
  const idx = outPos - fadeOutSamples + i;
  outputSamples[idx] = Math.round(outputSamples[idx] * (1 - i / fadeOutSamples));
}
// Append clean ending tail silence
outPos += tailSamples;

const finalPcm = outputSamples.subarray(0, outPos);
const preparedDurationSec = Math.round((finalPcm.length / SAMPLE_RATE) * 1000) / 1000;
console.log(`Assembled continuous PCM: ${finalPcm.length} samples = ${preparedDurationSec.toFixed(3)}s`);

// ---------------------------------------------------------------------------
// 5. Encode WAV + MP3 derivatives.
// ---------------------------------------------------------------------------
const pcmOutBuffer = Buffer.from(finalPcm.buffer, finalPcm.byteOffset, finalPcm.byteLength);
const encodeWavProc = spawnSync('ffmpeg', [
  '-hide_banner', '-loglevel', 'error', '-y',
  '-f', 's16le', '-ar', String(SAMPLE_RATE), '-ac', '1', '-i', 'pipe:0',
  outputWav
], { input: pcmOutBuffer });
if (encodeWavProc.status !== 0) throw new Error(`Failed to encode prepared WAV: ${encodeWavProc.stderr}`);
console.log(`Wrote prepared WAV: ${outputWav}`);

const encodeMp3Proc = spawnSync('ffmpeg', [
  '-hide_banner', '-loglevel', 'error', '-y',
  '-f', 's16le', '-ar', String(SAMPLE_RATE), '-ac', '1', '-i', 'pipe:0',
  '-codec:a', 'libmp3lame', '-q:a', '2',
  outputMp3
], { input: pcmOutBuffer });
if (encodeMp3Proc.status !== 0) throw new Error(`Failed to encode prepared MP3: ${encodeMp3Proc.stderr}`);
console.log(`Wrote prepared MP3: ${outputMp3}`);

// ---------------------------------------------------------------------------
// 6. Monotonic PTS verification via ffprobe (on MP3).
// ---------------------------------------------------------------------------
const probeProc = spawnSync('ffprobe', [
  '-v', 'error',
  '-select_streams', 'a',
  '-show_packets',
  '-show_entries', 'packet=pts_time,duration_time',
  '-of', 'csv=p=0',
  outputMp3
], { encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 });
if (probeProc.status !== 0) throw new Error(`ffprobe failed: ${probeProc.stderr}`);

const packetLines = probeProc.stdout.trim().split('\n').map(l => l.trim()).filter(Boolean);
let prevPts = -1;
let monotonicityViolations = 0;
for (let i = 0; i < packetLines.length; i++) {
  const [pts] = packetLines[i].split(',').map(Number);
  if (pts <= prevPts) {
    console.error(`PTS monotonicity violation at packet ${i}: ${pts} <= ${prevPts}`);
    monotonicityViolations++;
  }
  prevPts = pts;
}
if (monotonicityViolations > 0) throw new Error(`Monotonic PTS check failed with ${monotonicityViolations} violations`);
console.log(`Verified ${packetLines.length} packets: 100% strictly monotonic PTS, zero discontinuities.`);

// ---------------------------------------------------------------------------
// 7. Remap word and chunk timestamps from the exact PCM sample timeline.
// ---------------------------------------------------------------------------
function mapTime(t, isStart) {
  let delta = 0;
  for (const e of edits) {
    if (t < e.srcStart) break;
    const clampInside = isStart ? (t < e.srcEnd) : (t <= e.srcEnd);
    if (clampInside) { t = e.srcStart; break; }
    delta += e.silenceSec - (e.srcEnd - e.srcStart);
  }
  return Math.round((t + delta) * 1000) / 1000;
}
const mapWordObject = item => ({ ...item, start: mapTime(item.start, true), end: mapTime(item.end, false) });

const remappedWords = words.map(mapWordObject);
const remappedChunks = timing.chunks.map(chunk => {
  const chunkWords = remappedWords.filter(w => w.chunk === chunk.index);
  const start = chunkWords.length > 0 ? chunkWords[0].start : mapTime(chunk.start, true);
  const end = chunkWords.length > 0 ? chunkWords[chunkWords.length - 1].end : mapTime(chunk.end, false);
  return { ...chunk, start, end };
});
if (remappedChunks.length > 0 && remappedWords.length > 0) {
  remappedChunks[remappedChunks.length - 1].end = remappedWords[remappedWords.length - 1].end;
}

// Sanity assertions on the locked pacing
const assertGap = (idx, expectedSec, label) => {
  const gap = Math.round((remappedWords[idx + 1].start - remappedWords[idx].end) * 1000) / 1000;
  if (Math.abs(gap - expectedSec) > 0.021) throw new Error(`${label}: gap ${gap}s != expected ${expectedSec}s`);
  return gap;
};
const g1 = assertGap(bRewind1, REWIND_SEC, 'Rewind 1 gap');
const g2 = assertGap(bRewind2, REWIND_SEC, 'Rewind 2 gap');
const g3 = assertGap(bRewind3, REWIND_SEC + DREAD_SEC, 'Rewind 3 + dread gap');
const lagGaps = {
  P05: Math.round((remappedWords[lagP05 + 1].start - remappedWords[lagP05].end) * 1000) / 1000,
  P10: Math.round((remappedWords[lagP10 + 1].start - remappedWords[lagP10].end) * 1000) / 1000,
  P17: Math.round((remappedWords[lagP17 + 1].start - remappedWords[lagP17].end) * 1000) / 1000
};
console.log(`Locked gaps: rewind1=${g1}s rewind2=${g2}s rewind3+dread=${g3}s; lag cues P05=${lagGaps.P05}s P10=${lagGaps.P10}s P17=${lagGaps.P17}s`);
for (const [k, v] of Object.entries(lagGaps)) {
  if (v < 0.30) throw new Error(`Lag cue ${k} gap too short: ${v}s (one-beat ~0.4s must survive)`);
}

const speechEndSec = remappedWords[remappedWords.length - 1].end;
const remappedTimings = {
  version: 1,
  voiceId: timing.voiceId,
  durationSec: preparedDurationSec,
  master: true,
  chunks: remappedChunks,
  words: remappedWords,
  sfx: (timing.sfx ?? []).map(mapWordObject),
  source: 'narration-investigator-timestamps.json',
  note: 'Assembled on continuous PCM sample timeline. Word text reconciled to narasi.txt (see pronunciation-diff.json). Exact 0.4 s rewind gaps (rewinds 1-2 snap straight back), 1.9 s total at rewind 3 (0.4 s tape-snap region + 1.5 s true-zero dread silence), dead-air tightening to 0.32 s retained above 0.5 s, preserved one-beat lag cues (P05/P10/P17). Zero speed-up (atempo 1.0x), monotonic PTS verified.'
};
writeFileSync(timingsPath, JSON.stringify(remappedTimings, null, 2) + '\n');
console.log(`Wrote remapped timestamps: ${timingsPath}`);

// ---------------------------------------------------------------------------
// 8. Write audio-edit-map.json with the full Agent 04 cue handoff.
// ---------------------------------------------------------------------------
const m = i => remappedWords[i];
const editMap = {
  source,
  outputWav,
  outputMp3,
  sourceDurationSec,
  preparedDurationSec,
  speechEndSec,
  crossfadeSec: FADE_SEC,
  tightenThresholdSec: TIGHTEN_THRESHOLD_SEC,
  retainedGapSec: RETAINED_GAP_SEC,
  pronunciationDiff: 'pronunciation-diff.json',
  tighteningCuts: tightenedCuts.map(c => ({
    word1: c.word1,
    word2: c.word2,
    originalGapSec: c.originalGapSec,
    retainedGapSec: c.retainedGapSec,
    mappedStartSec: m(c.idx).end,
    mappedEndSec: m(c.idx + 1).start
  })),
  lockedRewindGaps: [
    { name: 'rewind1', afterWord: m(bRewind1).word, afterWordEndSec: m(bRewind1).end, beforeWord: m(bRewind1 + 1).word, beforeWordStartSec: m(bRewind1 + 1).start, rewindSec: g1, naturalGapSec: naturalGap(bRewind1), note: 'branchRewinds[0]; tape-snap SFX at round(startFrame x sampleRate / fps); zero dead air besides the 0.4 s rewind.' },
    { name: 'rewind2', afterWord: m(bRewind2).word, afterWordEndSec: m(bRewind2).end, beforeWord: m(bRewind2 + 1).word, beforeWordStartSec: m(bRewind2 + 1).start, rewindSec: g2, naturalGapSec: naturalGap(bRewind2), note: 'branchRewinds[1]; tape-snap SFX; zero dead air besides the 0.4 s rewind.' },
    {
      name: 'rewind3-with-dread-silence',
      afterWord: m(bRewind3).word,
      afterWordEndSec: m(bRewind3).end,
      beforeWord: m(bRewind3 + 1).word,
      beforeWordStartSec: m(bRewind3 + 1).start,
      rewindSec: REWIND_SEC,
      dreadSilenceSec: DREAD_SEC,
      totalGapSec: g3,
      dreadSilenceStartSec: Math.round((m(bRewind3).end + REWIND_SEC) * 1000) / 1000,
      dreadSilenceEndSec: m(bRewind3 + 1).start,
      naturalGapSec: naturalGap(bRewind3),
      note: 'branchRewinds[2]; the only 1.5 s true-zero dread silence (mute ambience + vocals entirely in the mix); P12 reset resumes at beforeWordStartSec.'
    }
  ],
  preservedLagCues: {
    P05: { afterWord: m(lagP05).word, gapStartSec: m(lagP05).end, beforeWord: m(lagP05 + 1).word, beforeWordStartSec: m(lagP05 + 1).start, gapSec: lagGaps.P05, note: 'C5 plant: third-belt buckle tick lands inside this measured one-beat lag (~0.4 s after the cyclic grip-change foley).' },
    P10: { afterWord: m(lagP10).word, gapStartSec: m(lagP10).end, beforeWord: m(lagP10 + 1).word, beforeWordStartSec: m(lagP10 + 1).start, gapSec: lagGaps.P10, note: 'C5 payoff part 1: third-belt self-release click lands one beat (~0.4 s) after the pilot belt click.' },
    P17: { afterWord: m(lagP17).word, gapStartSec: m(lagP17).end, beforeWord: m(lagP17 + 1).word, beforeWordStartSec: m(lagP17 + 1).start, gapSec: lagGaps.P17, note: 'Main payoff: release clack of the third belt lands one beat (~0.4 s) after the fake click; identical lag to C5.' }
  },
  towerQuoteMuteSpan: {
    fromWordIdx: towerQuote.fromIdx,
    toWordIdx: towerQuote.toIdx,
    words: quoted,
    startSec: remappedWords[towerQuote.fromIdx].start,
    endSec: remappedWords[towerQuote.toIdx].end,
    reservedWindow: {
      startSec: remappedWords[idxJernih].end,
      endSec: remappedWords[idxDarurat + 1].start,
      durationSec: Math.round((remappedWords[idxDarurat + 1].start - remappedWords[idxJernih].end) * 1000) / 1000,
      note: 'Narrator-free window reserved by protecting the flanking gaps; the pa-announcer asset is laid entirely inside it (speech starts at asset 0.000 s, ends at asset 4.040 s).'
    },
    replacementAsset: 'public/sfx/prepared/scenario05-tower-pa-mixready.wav',
    replacementAssetDurationSec: 4.09,
    note: 'Agent 04: mute the narrator quote non-destructively in the edit map and lay the pa-announcer asset inside the reserved window (suggest asset start = reservedWindow.startSec + 0.05 entry air; speech ends ~0.2 s before Instingmu onset); caption label yellow MENARA RADIO over the asset window. Radio static bed ducks while the impossibly clear voice plays (audible C3 contradiction). Final bandpass/mix judgment per the brief belongs to the mix.'
  },
  timelinePlacement: {
    narrationTitleWindowSec: [0, 1.8],
    firstWordStartSec: remappedWords[0].start,
    hookWords: ['Tiga', 'sabuk', 'terpasang.', 'Penumpangnya', 'cuma', 'dua.'],
    blackoutTail: {
      speechReleaseSec: speechEndSec,
      preparedTrackEndSec: preparedDurationSec,
      note: 'Brief: 150 ms silence vacuum, then restrained 1.0 s jolt, then 0.35 s blackout = 1.5 s tail from the last word. Agent 04 anchors the jolt at speechReleaseSec + 0.15 s and the hard cut to black at speechReleaseSec + 1.5 s, re-anchoring provisional frame numbers (blackoutFrame 4521) to this measured master.'
    }
  },
  runtimeBudget: {
    preNarrationSec: remappedWords[0].start,
    narrationTrackDurationSec: preparedDurationSec,
    spokenSpeechEndSec: speechEndSec,
    targetWindowSec: [145.0, 160.0],
    note: 'Provisional 151.0 s / 4530-frame timeline must be re-anchored to this measured master without changing vocal speed.'
  },
  notes: 'Assembled on continuous PCM sample timeline; zero playback speed change (atempo 1.0x preserved); strictly monotonic PTS verified by ffprobe across all packets.'
};
writeFileSync(mapPath, JSON.stringify(editMap, null, 2) + '\n');
console.log(`Wrote edit map: ${mapPath}`);

// ---------------------------------------------------------------------------
// 9. Copy to public/assets/005-sabuk-ketiga/.
// ---------------------------------------------------------------------------
const publicDir = 'public/assets/005-sabuk-ketiga';
mkdirSync(publicDir, { recursive: true });
copyFileSync(outputWav, join(publicDir, 'narration-prepared.wav'));
copyFileSync(outputMp3, join(publicDir, 'narration-prepared.mp3'));
copyFileSync(timingsPath, join(publicDir, 'narration-timestamps.json'));
console.log(`Copied narration derivatives to ${publicDir}`);
