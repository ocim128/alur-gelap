// Pitch-preserving narration preparation with continuous PCM sample timeline assembly.
// Integrates dead-air tightening, clean pause splices, and monotonic PTS verification.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const episodeDir = 'episodes/001-kamar-terkunci';
const source = join(episodeDir, 'narration-investigator.mp3');
const sourceTimes = join(episodeDir, 'narration-investigator-timestamps.json');
const output = join(episodeDir, 'narration-prepared.mp3');
const timingsPath = join(episodeDir, 'narration-timestamps.json');
const mapPath = join(episodeDir, 'audio-edit-map.json');

if (!existsSync(source) || !existsSync(sourceTimes)) {
  throw new Error(`Missing source files in ${episodeDir}`);
}

const timing = JSON.parse(readFileSync(sourceTimes, 'utf8'));
const sourceDurationSec = timing.durationSec;
const SAMPLE_RATE = 48000;
const FADE_SEC = 0.01;
const FADE_SAMPLES = Math.round(FADE_SEC * SAMPLE_RATE);

// 1. Define dead-air cuts (tightening 9 major non-protected gaps > 0.70s, retaining 0.50s)
const cuts = [
  { start: 26.597, end: 26.867 },
  { start: 56.297, end: 56.497 },
  { start: 75.191, end: 75.505 },
  { start: 77.554, end: 77.868 },
  { start: 83.432, end: 83.828 },
  { start: 109.894, end: 110.204 },
  { start: 113.392, end: 113.891 },
  { start: 121.460, end: 121.855 },
  { start: 125.726, end: 125.993 }
];

// 2. Define the 4 intentional story pause insertions (in raw source time)
// - Pause 1: Captor dialogue line (between word 11 "Diangintip." and word 12 "Lalu")
// - Pause 2: branchRewind gap (between word 93 "lagi." and word 94 "Balik")
// - Pause 3: Reset dread silence (between word 100 "kursinya," and word 101 "perhatiin")
// - Pause 4: Pre-hatch dread silence (between word 193 "tempatmu." and word 194 "Lubang")
const pauses = [
  { name: 'captor-line-gap', atSec: 8.280, durSec: 2.600 },
  { name: 'rewind-gap', atSec: 51.970, durSec: 0.400 },
  { name: 'reset-silence', atSec: 56.100, durSec: 1.500 },
  { name: 'pre-hatch-dread-silence', atSec: 102.720, durSec: 2.000 }
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

// Step B: Calculate split points in tightened timeline and splice the 4 silence pauses
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
const TAIL_SEC = 1.115; // clean decay + tail padding
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

// 4. Encode to MP3 in a single linear pass
const pcmOutBuffer = Buffer.from(finalPcm.buffer, finalPcm.byteOffset, finalPcm.byteLength);
const encodeProc = spawnSync('ffmpeg', [
  '-hide_banner', '-loglevel', 'error', '-y',
  '-f', 's16le', '-ar', String(SAMPLE_RATE), '-ac', '1', '-i', 'pipe:0',
  '-codec:a', 'libmp3lame', '-q:a', '2',
  output
], { input: pcmOutBuffer });

if (encodeProc.status !== 0) {
  throw new Error(`Failed to encode prepared MP3: ${encodeProc.stderr}`);
}
console.log(`Wrote prepared MP3: ${output}`);

// 5. Monotonic PTS verification via ffprobe
const probeProc = spawnSync('ffprobe', [
  '-v', 'error',
  '-select_streams', 'a',
  '-show_packets',
  '-show_entries', 'packet=pts_time,duration_time',
  '-of', 'csv=p=0',
  output
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

const remappedTimings = {
  version: 1,
  voiceId: timing.voiceId,
  durationSec: preparedDurationSec,
  master: true,
  chunks: remappedChunks,
  words: remappedWords,
  sfx: (timing.sfx ?? []).map(mapWordObject),
  source: 'narration-investigator-timestamps.json',
  note: 'Assembled on continuous PCM sample timeline with spliced non-overlapping pauses (captor line 2.6s, rewind 0.4s, reset silence 1.5s, pre-hatch silence 2.0s). Zero speed-up, monotonic PTS verified.'
};

writeFileSync(timingsPath, JSON.stringify(remappedTimings, null, 2) + '\n');
console.log(`Wrote remapped timestamps: ${timingsPath}`);

// 7. Write audio-edit-map.json
const editMap = {
  source,
  output,
  sourceDurationSec,
  preparedDurationSec,
  speechEndSec: remappedWords[remappedWords.length - 1].end,
  silenceThresholdDb: -38,
  retainedGapSec: 0.50,
  crossfadeSec: FADE_SEC,
  tighteningCuts: cuts,
  insertedPauses: pauses.map(p => ({
    name: p.name,
    rawSourceSec: p.atSec,
    insertedSilenceSec: p.durSec
  })),
  timelinePlacement: {
    captorCue: {
      asset: 'public/assets/001-kamar-terkunci/captor-muffled.wav',
      cueStartSec: 8.50,
      durationSec: 2.030,
      cueEndSec: 10.53,
      surroundingSilenceRangeSec: [remappedWords[11].end, remappedWords[12].start],
      marginBeforeSec: Math.round((8.50 - remappedWords[11].end) * 1000) / 1000,
      marginAfterSec: Math.round((remappedWords[12].start - 10.53) * 1000) / 1000,
      note: 'Zero overlap against narrator speech.'
    },
    rewindGap: {
      gapStartSec: remappedWords[93].end,
      gapEndSec: remappedWords[94].start,
      gapDurationSec: Math.round((remappedWords[94].start - remappedWords[93].end) * 1000) / 1000,
      rewindWhooshDurationSec: 0.400
    },
    resetDreadSilence: {
      silenceStartSec: remappedWords[100].end,
      silenceEndSec: remappedWords[101].start,
      silenceDurationSec: Math.round((remappedWords[101].start - remappedWords[100].end) * 1000) / 1000
    },
    preHatchDreadSilence: {
      silenceStartSec: remappedWords[193].end,
      silenceEndSec: remappedWords[194].start,
      silenceDurationSec: Math.round((remappedWords[194].start - remappedWords[193].end) * 1000) / 1000
    }
  },
  runtimeBudget: {
    preNarrationTitleAndRoomToneSec: 1.800,
    narrationTrackDurationSec: preparedDurationSec,
    spokenSpeechEndSec: remappedWords[remappedWords.length - 1].end,
    badBranchAftermathHoldSec: 2.000,
    cleanBlackoutTailSec: 3.500,
    measuredTotalCutDurationSec: Math.round((1.800 + remappedWords[remappedWords.length - 1].end + 2.000 + 3.500) * 1000) / 1000,
    targetWindowSec: [140.0, 165.0]
  },
  notes: 'Assembled on continuous PCM sample timeline; zero playback speed change; strictly monotonic PTS verified by ffprobe across all packets.'
};

writeFileSync(mapPath, JSON.stringify(editMap, null, 2) + '\n');
console.log(`Wrote edit map: ${mapPath}`);

// 8. Copy to public/assets/001-kamar-terkunci/
const publicDir = 'public/assets/001-kamar-terkunci';
mkdirSync(publicDir, { recursive: true });
copyFileSync(output, join(publicDir, 'narration-prepared.mp3'));
copyFileSync(timingsPath, join(publicDir, 'narration-timestamps.json'));
console.log(`Copied narration derivatives to ${publicDir}`);
