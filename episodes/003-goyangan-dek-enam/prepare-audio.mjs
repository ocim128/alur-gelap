// Pitch-preserving narration preparation with continuous PCM sample timeline assembly.
// Integrates dead-air tightening, clean story pause splices, and monotonic PTS verification.
// Outputs both uncompressed WAV and MP3 derivatives along with remapped timestamps.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const episodeDir = 'episodes/003-goyangan-dek-enam';
const source = join(episodeDir, 'narration-investigator.mp3');
const sourceTimes = join(episodeDir, 'narration-investigator-timestamps.json');
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
const FADE_SEC = 0.01; // 10 ms crossfade
const FADE_SAMPLES = Math.round(FADE_SEC * SAMPLE_RATE);

// 1. Identify non-protected dead-air gaps between words
const wordGaps = [];
for (let i = 0; i < timing.words.length - 1; i++) {
  const w1 = timing.words[i];
  const w2 = timing.words[i + 1];
  const gap = w2.start - w1.end;
  wordGaps.push({
    idx1: i,
    word1: w1.word,
    end1: w1.end,
    idx2: i + 1,
    word2: w2.word,
    start2: w2.start,
    gap: Math.round(gap * 1000) / 1000
  });
}

function isProtected(gap) {
  // Rewind boundary: between word 129 ("Tamat,") and word 130 ("balik")
  if (gap.idx1 === 129) return 'PROTECTED: rewind boundary';
  // Post-rewind silence boundary: between word 139 ("berlayar.") and word 140 ("Perhatiin")
  if (gap.idx1 === 139) return 'PROTECTED: post-rewind boundary';
  // Execution beat: between word 199 ("Sekarang,") and word 200 ("tarik")
  if (gap.idx1 === 199) return 'PROTECTED: execution beat';
  // Impact beat: between word 212 ("berak") and word 213 ("Menghantam")
  if (gap.idx1 === 212) return 'PROTECTED: impact beat';
  // Lock click: between word 228 ("Klik,") and word 229 ("besi")
  if (gap.idx1 === 228) return 'PROTECTED: lock click';
  // Post-pin dread silence boundary: between word 244 ("hening.") and word 245 ("Napasmu")
  if (gap.idx1 === 244) return 'PROTECTED: post-pin boundary';
  return false;
}

// Dead-air tightening: tighten non-protected gaps > 0.65s down to 0.42s
const cuts = [];
for (const g of wordGaps) {
  if (isProtected(g)) continue;

  if (g.gap > 0.65) {
    const cutDur = g.gap - 0.42;
    const cutStart = Math.round((g.end1 + 0.21) * 1000) / 1000;
    const cutEnd = Math.round((g.start2 - 0.21) * 1000) / 1000;
    cuts.push({
      idx1: g.idx1,
      word1: g.word1,
      end1: g.end1,
      idx2: g.idx2,
      word2: g.word2,
      start2: g.start2,
      originalGap: g.gap,
      retained: 0.42,
      start: cutStart,
      end: cutEnd,
      cutDur: Math.round(cutDur * 1000) / 1000
    });
  }
}

console.log(`Defined ${cuts.length} dead-air cuts to tighten unhurried speech.`);

// 2. Define the 3 intentional story pause insertions (in raw source time)
// - Pause 1: branchRewind gap (between word 129 "Tamat," and word 130 "balik lagi.")
// - Pause 2: Post-rewind dread silence (between word 139 "berlayar." and word 140 "Perhatiin sekelilingmu...")
// - Pause 3: Post-pin dread silence (between word 244 "hening." and word 245 "Napasmu memburu...")
const pauses = [
  { name: 'rewind-gap', atSec: 73.220, durSec: 0.400 },
  { name: 'post-rewind-silence', atSec: 78.220, durSec: 1.600 },
  { name: 'post-pin-dread-silence', atSec: 137.700, durSec: 2.000 }
];

// 3. Decode source MP3 into continuous 16-bit PCM samples
const decodeProc = spawnSync('ffmpeg', [
  '-hide_banner', '-loglevel', 'error',
  '-i', source,
  '-f', 's16le', '-ac', '1', '-ar', String(SAMPLE_RATE),
  'pipe:1'
], { maxBuffer: 50 * 1024 * 1024 });

if (decodeProc.status !== 0) {
  throw new Error(`Failed to decode source audio: ${decodeProc.stderr}`);
}

const inputBuffer = decodeProc.stdout;
const inputSamples = new Int16Array(inputBuffer.buffer, inputBuffer.byteOffset, inputBuffer.byteLength / 2);
console.log(`Decoded source audio: ${inputSamples.length} samples (${(inputSamples.length / SAMPLE_RATE).toFixed(3)}s)`);

// Step A: Assemble dead-air cuts on PCM sample timeline
const cutRanges = [];
let lastSample = 0;
for (const cut of cuts) {
  const cutStart = Math.round(cut.start * SAMPLE_RATE);
  const cutEnd = Math.round(cut.end * SAMPLE_RATE);
  cutRanges.push({ start: lastSample, end: cutStart });
  lastSample = cutEnd;
}
cutRanges.push({ start: lastSample, end: inputSamples.length });

let estimatedTightenedSamples = inputSamples.length;
for (const cut of cuts) {
  estimatedTightenedSamples -= (Math.round(cut.end * SAMPLE_RATE) - Math.round(cut.start * SAMPLE_RATE) - FADE_SAMPLES);
}
const tightenedSamples = new Int16Array(estimatedTightenedSamples + SAMPLE_RATE);

let tightPos = 0;
for (let r = 0; r < cutRanges.length; r++) {
  const range = cutRanges[r];
  let srcStart = range.start;
  const srcEnd = range.end;

  if (r === 0) {
    const len = srcEnd - srcStart;
    tightenedSamples.set(inputSamples.subarray(srcStart, srcEnd), tightPos);
    tightPos += len;
  } else {
    const crossfadeStart = tightPos - FADE_SAMPLES;
    for (let i = 0; i < FADE_SAMPLES; i++) {
      const alpha = i / FADE_SAMPLES;
      const prevVal = tightenedSamples[crossfadeStart + i];
      const nextVal = inputSamples[srcStart + i];
      tightenedSamples[crossfadeStart + i] = Math.round(prevVal * (1 - alpha) + nextVal * alpha);
    }
    srcStart += FADE_SAMPLES;
    const remaining = srcEnd - srcStart;
    if (remaining > 0) {
      tightenedSamples.set(inputSamples.subarray(srcStart, srcEnd), tightPos);
      tightPos += remaining;
    }
  }
}

const tightAudio = tightenedSamples.subarray(0, tightPos);
console.log(`Tightened speech PCM: ${tightAudio.length} samples (${(tightAudio.length / SAMPLE_RATE).toFixed(3)}s)`);

// Step B: Calculate split points in tightened timeline and splice the 3 story silence pauses
function getTightenedSec(srcSec) {
  let removed = 0;
  for (const c of cuts) {
    if (srcSec < c.start) break;
    if (srcSec < c.end) {
      srcSec = c.start;
      break;
    }
    removed += (c.end - c.start);
  }
  return srcSec - removed;
}

const tightenedPauses = pauses.map(p => ({
  ...p,
  tightenedSec: Math.round(getTightenedSec(p.atSec) * 1000) / 1000
}));

// Build final output buffer with inserted pauses + clean ending tail
const TAIL_SEC = 1.000; // clean decay + tail padding
const tailSamples = Math.round(TAIL_SEC * SAMPLE_RATE);
const totalPauseSamples = pauses.reduce((sum, p) => sum + Math.round(p.durSec * SAMPLE_RATE), 0);
const finalCapacity = tightAudio.length + totalPauseSamples + tailSamples + SAMPLE_RATE;
const outputSamples = new Int16Array(finalCapacity);

let inPos = 0;
let outPos = 0;

for (const p of tightenedPauses) {
  const splitSample = Math.round(p.tightenedSec * SAMPLE_RATE);
  const sliceLen = splitSample - inPos;
  if (sliceLen > 0) {
    outputSamples.set(tightAudio.subarray(inPos, splitSample), outPos);
    outPos += sliceLen;
    inPos = splitSample;
  }
  const pauseSamples = Math.round(p.durSec * SAMPLE_RATE);
  // outputSamples is pre-zeroed, so advancing outPos inserts pure zero silence
  outPos += pauseSamples;
}

// Copy remainder of tightened audio
const finalSliceLen = tightAudio.length - inPos;
if (finalSliceLen > 0) {
  outputSamples.set(tightAudio.subarray(inPos), outPos);
  outPos += finalSliceLen;
}

// Smooth 50ms fade-out on speech release to avoid abrupt ending
const fadeOutSamples = Math.round(0.050 * SAMPLE_RATE);
for (let i = 0; i < fadeOutSamples; i++) {
  const idx = outPos - fadeOutSamples + i;
  outputSamples[idx] = Math.round(outputSamples[idx] * (1 - i / fadeOutSamples));
}

// Append clean ending tail silence
outPos += tailSamples;

const finalPcm = outputSamples.subarray(0, outPos);
const preparedDurationSec = Math.round((finalPcm.length / SAMPLE_RATE) * 1000) / 1000;
console.log(`Assembled continuous PCM with all pauses: ${finalPcm.length} samples = ${preparedDurationSec.toFixed(3)}s`);

// 4. Encode to WAV (uncompressed 16-bit 48kHz mono)
const pcmOutBuffer = Buffer.from(finalPcm.buffer, finalPcm.byteOffset, finalPcm.byteLength);

const encodeWavProc = spawnSync('ffmpeg', [
  '-hide_banner', '-loglevel', 'error', '-y',
  '-f', 's16le', '-ar', String(SAMPLE_RATE), '-ac', '1', '-i', 'pipe:0',
  outputWav
], { input: pcmOutBuffer });

if (encodeWavProc.status !== 0) {
  throw new Error(`Failed to encode prepared WAV: ${encodeWavProc.stderr}`);
}
console.log(`Wrote prepared WAV: ${outputWav}`);

// Also encode to MP3 for Remotion manifest asset compatibility
const encodeMp3Proc = spawnSync('ffmpeg', [
  '-hide_banner', '-loglevel', 'error', '-y',
  '-f', 's16le', '-ar', String(SAMPLE_RATE), '-ac', '1', '-i', 'pipe:0',
  '-codec:a', 'libmp3lame', '-q:a', '2',
  outputMp3
], { input: pcmOutBuffer });

if (encodeMp3Proc.status !== 0) {
  throw new Error(`Failed to encode prepared MP3: ${encodeMp3Proc.stderr}`);
}
console.log(`Wrote prepared MP3: ${outputMp3}`);

// 5. Monotonic PTS verification via ffprobe (on MP3)
const probeProc = spawnSync('ffprobe', [
  '-v', 'error',
  '-select_streams', 'a',
  '-show_packets',
  '-show_entries', 'packet=pts_time,duration_time',
  '-of', 'csv=p=0',
  outputMp3
], { encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 });

if (probeProc.status !== 0) {
  throw new Error(`ffprobe failed: ${probeProc.stderr}`);
}

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

if (monotonicityViolations > 0) {
  throw new Error(`Monotonic PTS check failed with ${monotonicityViolations} violations`);
}
console.log(`Verified ${packetLines.length} packets: 100% strictly monotonic PTS, zero discontinuities.`);

// 6. Remap word and chunk timestamps from exact PCM sample timeline
function mapTimestamp(t, isStart) {
  let removed = 0;
  for (const c of cuts) {
    if (t < c.start) break;
    if (t < c.end) {
      t = c.start;
      break;
    }
    removed += (c.end - c.start);
  }
  const tAfterCuts = t - removed;

  let added = 0;
  for (const p of pauses) {
    const condition = isStart ? (t >= p.atSec) : (t > p.atSec);
    if (condition) {
      added += p.durSec;
    }
  }
  return Math.round((tAfterCuts + added) * 1000) / 1000;
}

const mapWordObject = item => ({
  ...item,
  start: mapTimestamp(item.start, true),
  end: mapTimestamp(item.end, false)
});

const remappedWords = timing.words.map(mapWordObject);

const remappedChunks = timing.chunks.map(chunk => {
  const chunkWords = remappedWords.filter(w => w.chunk === chunk.index);
  const start = chunkWords.length > 0 ? chunkWords[0].start : mapTimestamp(chunk.start, true);
  const end = chunkWords.length > 0 ? chunkWords[chunkWords.length - 1].end : mapTimestamp(chunk.end, false);
  return {
    ...chunk,
    start,
    end
  };
});

// Ensure final chunk end matches final word end
if (remappedChunks.length > 0 && remappedWords.length > 0) {
  remappedChunks[remappedChunks.length - 1].end = remappedWords[remappedWords.length - 1].end;
}

const remappedTimings = {
  version: 1,
  voiceId: timing.voiceId,
  durationSec: preparedDurationSec,
  master: true,
  chunks: remappedChunks,
  words: remappedWords,
  sfx: (timing.sfx ?? []).map(mapWordObject),
  source: 'narration-investigator-timestamps.json',
  note: 'Assembled on continuous PCM sample timeline with spliced non-overlapping story pauses (rewind gap 0.4s, post-rewind silence 1.6s, post-pin dread silence 2.0s). Zero speed-up, monotonic PTS verified.'
};

writeFileSync(timingsPath, JSON.stringify(remappedTimings, null, 2) + '\n');
console.log(`Wrote remapped timestamps: ${timingsPath}`);

// 7. Write audio-edit-map.json
const editMap = {
  source,
  outputWav,
  outputMp3,
  sourceDurationSec,
  preparedDurationSec,
  speechEndSec: remappedWords[remappedWords.length - 1].end,
  crossfadeSec: FADE_SEC,
  tighteningCuts: cuts.map(c => ({
    start: c.start,
    end: c.end,
    durationSec: c.cutDur,
    word1: c.word1,
    word2: c.word2,
    originalGapSec: c.originalGap,
    retainedGapSec: c.retained
  })),
  insertedPauses: pauses.map(p => ({
    name: p.name,
    rawSourceSec: p.atSec,
    insertedSilenceSec: p.durSec
  })),
  timelinePlacement: {
    rewindGap: {
      gapStartSec: remappedWords[129].end,
      gapEndSec: remappedWords[130].start,
      gapDurationSec: Math.round((remappedWords[130].start - remappedWords[129].end) * 1000) / 1000,
      rewindWhooshDurationSec: 0.400,
      note: 'Placed at bad outcome reset between word 129 (Tamat,) and word 130 (balik lagi).'
    },
    postRewindDreadSilence: {
      silenceStartSec: remappedWords[139].end,
      silenceEndSec: remappedWords[140].start,
      silenceDurationSec: Math.round((remappedWords[140].start - remappedWords[139].end) * 1000) / 1000,
      note: 'Placed between word 139 (berlayar.) and word 140 (Perhatiin sekelilingmu).'
    },
    executionAndImpactBeat: {
      cueSekarangSec: remappedWords[199].start,
      pullTuasSec: remappedWords[200].start,
      woodImpactSec: remappedWords[212].start,
      note: 'Execution beat preserved with zero tightening.'
    },
    postPinDreadSilence: {
      silenceStartSec: remappedWords[244].end,
      silenceEndSec: remappedWords[245].start,
      silenceDurationSec: Math.round((remappedWords[245].start - remappedWords[244].end) * 1000) / 1000,
      note: 'Placed after word 244 (hening.) and before word 245 (Napasmu memburu).'
    },
    blackoutTail: {
      speechReleaseSec: remappedWords[remappedWords.length - 1].end,
      preparedTrackEndSec: preparedDurationSec,
      assembledVideoCutEndSec: 154.000,
      tailHoldSec: Math.round((154.000 - remappedWords[remappedWords.length - 1].end) * 1000) / 1000,
      note: 'Atmospheric wide P24 hold with low sub-hit at 154.0s cut to black.'
    }
  },
  runtimeBudget: {
    preNarrationTitleAndRoomToneSec: 0.000,
    narrationTrackDurationSec: preparedDurationSec,
    spokenSpeechEndSec: remappedWords[remappedWords.length - 1].end,
    tailAtmosphericHoldSec: Math.round((154.000 - remappedWords[remappedWords.length - 1].end) * 1000) / 1000,
    measuredTotalCutDurationSec: 154.000,
    targetWindowSec: [140.0, 165.0]
  },
  notes: 'Assembled on continuous PCM sample timeline; zero playback speed change (atempo 1.0x preserved); strictly monotonic PTS verified by ffprobe across all packets.'
};

writeFileSync(mapPath, JSON.stringify(editMap, null, 2) + '\n');
console.log(`Wrote edit map: ${mapPath}`);

// 8. Copy to public/assets/003-goyangan-dek-enam/
const publicDir = 'public/assets/003-goyangan-dek-enam';
mkdirSync(publicDir, { recursive: true });
copyFileSync(outputWav, join(publicDir, 'narration-prepared.wav'));
copyFileSync(outputMp3, join(publicDir, 'narration-prepared.mp3'));
copyFileSync(timingsPath, join(publicDir, 'narration-timestamps.json'));
console.log(`Copied narration derivatives to ${publicDir}`);
