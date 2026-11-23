// Shared narration preparation CLI (generalizes the proven 003/004/005
// per-episode prepare-audio.mjs logic into one unit-tested tool).
//
// Driven by a per-episode JSON config (recommended location:
// episodes/<episode>/narration-prep.json). See export comments below for the
// full field reference. Highlights:
//   - tightening threshold/retained gap, exact rewind + dread-silence gap
//     replacement (frame-aligned), hook trim fallback, protected beats and
//     protected flanking gaps for world-voice replacements, tail pad,
//   - `--dry-run` prints projected prepared duration across tightening
//     parameters before any encoding happens,
//   - built-in gates: sample-level PCM checks on every claimed-silent window
//     (all rewinds, dread silence, muted world-voice spans, ending pad) aligned
//     to fps frame boundaries, sample-preserving padding verification, monotonic
//     MP3 PTS verification,
//   - emits an `assemblerHandoff` block plus a panel↔word-span table into
//     audio-edit-map.json.
// Existing outputs are never overwritten unless `--force` is given.
import {spawnSync} from 'node:child_process';
import {copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {applyRules} from './asr-reconcile.mjs';

export const DEFAULT_SAMPLE_RATE = 48000;
export const DEFAULT_FPS = 30;
export const FADE_SEC = 0.01; // 10 ms junction fades at every edit seam
export const GAP_TOLERANCE_SEC = 0.021; // half a 48 kHz-of-a-frame rounding margin (005 precedent)

export const stemOf = (word) => String(word).toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const ms = (sec) => Math.round(sec * 1000) / 1000;
const frameAligned = (sec, fps) => Math.round(sec * fps) / fps;
const roundToSample = (sec, sampleRate) => Math.round(sec * sampleRate);

/** Frame-aligned sample window inside [startSec, endSec); empty when narrower than one frame. */
export function frameAlignedWindow(startSec, endSec, fps, sampleRate) {
  const startFrame = Math.ceil(ms(startSec) * fps);
  const endFrame = Math.floor(ms(endSec) * fps);
  if (endFrame <= startFrame) return null;
  return {
    startFrame,
    endFrame,
    startSample: roundToSample(startFrame / fps, sampleRate),
    endSample: roundToSample(endFrame / fps, sampleRate),
  };
}

function findPair(words, tailStem, nextStem, occurrence = 1) {
  const hits = [];
  for (let i = 0; i < words.length - 1; i++) {
    if (stemOf(words[i].word) === tailStem && stemOf(words[i + 1].word) === nextStem) hits.push(i);
  }
  if (hits.length < occurrence) {
    throw new Error(`Boundary "${tailStem}"->"${nextStem}" occurrence ${occurrence} not found (hits: ${hits.length}). Inspect the raw word track wording.`);
  }
  return hits[occurrence - 1];
}

/**
 * Build the full edit plan from the config and raw timing. Pure: no ffmpeg, no files.
 * The returned `windows` are the claimed-silent windows the PCM gate will enforce;
 * every window is frame-aligned and always lies inside the region the matching edit
 * replaces with silence.
 */
export function buildPlan(config, rawTiming, options = {}) {
  const fps = config.fps ?? DEFAULT_FPS;
  const sampleRate = config.sampleRate ?? DEFAULT_SAMPLE_RATE;
  const tightening = {
    // `Infinity` threshold = tightening disabled (compares false against no gap).
    thresholdSec: options.thresholdSec ?? config.tightening?.thresholdSec ?? Infinity,
    retainedSec: options.retainedSec ?? config.tightening?.retainedSec ?? 0,
  };
  const leadTrimSec = config.leadTrimSec ?? 0.1;
  const tailPadSec = config.tail?.padSec ?? 1.0;
  const releaseFadeSec = config.tail?.releaseFadeSec ?? 0.05;

  const timing = {...rawTiming, words: rawTiming.words.map((word) => ({...word}))};
  let pronunciationRecords = [];
  if (config.pronunciation) {
    const applied = applyRules(timing.words, config.pronunciation);
    timing.words = applied.units;
    pronunciationRecords = applied.records;
  }
  const words = timing.words;

  // --- boundaries (rewind + optional dread silence) -------------------------
  const boundaries = (config.rewinds ?? []).map((rewind) => {
    const idx = findPair(words, rewind.tailStem, rewind.nextStem, rewind.occurrence ?? 1);
    const totalSec = frameAligned(rewind.rewindSec + (rewind.dreadSec ?? 0), fps);
    return {
      ...rewind,
      idx,
      word: words[idx].word,
      endSec: words[idx].end,
      nextWord: words[idx + 1].word,
      nextStartSec: words[idx + 1].start,
      rawGapSec: ms(words[idx + 1].start - words[idx].end),
      totalSec,
    };
  });

  // --- world-voice spans -----------------------------------------------------
  const worldVoices = (config.worldVoices ?? []).map((voice) => {
    const fromIdx = words.findIndex((word) => stemOf(word.word) === voice.fromStem);
    const toIdx = words.findIndex((word) => stemOf(word.word) === voice.toStem);
    if (fromIdx < 0 || toIdx <= fromIdx) throw new Error(`World-voice span "${voice.fromStem}".."${voice.toStem}" not found in order`);
    return {
      ...voice,
      fromIdx,
      toIdx,
      spanStartSec: words[fromIdx + 1].start,
      spanEndSec: words[toIdx].end,
      reservedWindowSec: [words[fromIdx].end, words[Math.min(toIdx + 1, words.length - 1)].start],
    };
  });

  const protectedGapIdx = new Set(boundaries.flatMap((boundary) => [boundary.idx, boundary.idx + 1]));
  for (const beat of config.protectedBeats ?? []) {
    const idx = words.findIndex((word, i) => i > 0 && stemOf(word.word) === beat.aStem && words[i + 1] && stemOf(words[i + 1].word) === beat.bStem);
    if (idx < 0) throw new Error(`Protected beat "${beat.aStem}"->"${beat.bStem}" not found`);
    protectedGapIdx.add(idx);
    protectedGapIdx.add(idx + 1);
  }
  for (const voice of worldVoices) {
    protectedGapIdx.add(voice.fromIdx);
    protectedGapIdx.add(voice.toIdx);
  }

  // --- edits -----------------------------------------------------------------
  const edits = [];
  const firstStart = words[0].start;
  if (firstStart > leadTrimSec + 0.05) {
    edits.push({name: 'lead-trim', srcStart: 0, srcEnd: ms(firstStart - leadTrimSec), silenceSec: 0});
  }

  // Hook trim fallback: only when the raw hook would exceed its limit, drop the
  // documented filler word (with its overlong trailing pause). The measured
  // hook-end gate defaults to 3.0 s when the config omits limitSec.
  const hookLimitSec = config.hook?.limitSec ?? 3.0;
  const hookFinalIdx = config.hook ? words.findIndex((word) => stemOf(word.word) === config.hook.finalWordStem) : -1;
  if (config.hook) {
    if (hookFinalIdx < 0) throw new Error(`Hook final word "${config.hook.finalWordStem}" not found`);
    const rawHookEndSec = words[hookFinalIdx].end;
    const fallback = config.hook.fallback;
    if (rawHookEndSec > hookLimitSec && !fallback) {
      throw new Error(`Raw hook ends at ${ms(rawHookEndSec)} s, beyond the ${hookLimitSec} s limit, and no fallback is configured`);
    }
    if (fallback && rawHookEndSec > hookLimitSec) {
      const dropIdx = words.findIndex((word, i) =>
        i > 0 && stemOf(word.word) === fallback.dropWordStem &&
        stemOf(words[i - 1].word) === fallback.afterStem &&
        stemOf(words[i + 1]?.word ?? '') === fallback.beforeStem);
      if (dropIdx < 0) throw new Error(`Hook fallback word "${fallback.dropWordStem}" (${fallback.afterStem}->${fallback.beforeStem} context) not found; the raw hook (${ms(rawHookEndSec)} s) exceeds the ${hookLimitSec} s limit`);
      const dropped = words[dropIdx];
      const next = words[dropIdx + 1];
      edits.push({name: 'hook-fallback', srcStart: ms(dropped.start), srcEnd: ms(Math.max(dropped.end, next.start - 0.06)), silenceSec: 0});
    }
  }

  for (const boundary of boundaries) {
    edits.push({
      name: boundary.name,
      srcStart: ms(boundary.endSec),
      srcEnd: ms(boundary.nextStartSec),
      silenceSec: boundary.totalSec,
      kind: 'boundary',
    });
  }
  for (const voice of worldVoices) {
    if (!voice.muteNarration) continue;
    edits.push({
      name: `worldvoice-mute:${voice.name}`,
      srcStart: ms(voice.spanStartSec),
      srcEnd: ms(voice.spanEndSec),
      silenceSec: frameAligned(voice.spanEndSec - voice.spanStartSec, fps),
      kind: 'world-voice-mute',
    });
  }
  const tighteningCuts = [];
  const skippedTightenings = [];
  const coveredByEdit = (start, end) => edits.find((edit) => start < edit.srcEnd && end > edit.srcStart);
  for (let i = 0; i < words.length - 1; i++) {
    if (protectedGapIdx.has(i)) continue;
    const gap = words[i + 1].start - words[i].end;
    if (gap <= tightening.thresholdSec) continue;
    const half = tightening.retainedSec / 2;
    const cutStart = ms(words[i].end + half);
    const cutEnd = ms(words[i + 1].start - half);
    if (cutEnd - cutStart <= 0) continue;
    // A gap already (partly) covered by a hook-fallback or world-voice mute edit is
    // left alone; overlapping cuts would corrupt the assembly.
    const covering = coveredByEdit(cutStart, cutEnd);
    if (covering) {
      skippedTightenings.push({word1: words[i].word, word2: words[i + 1].word, originalGapSec: ms(gap), coveredBy: covering.name});
      continue;
    }
    edits.push({name: `tighten:${words[i].word}->${words[i + 1].word}`, srcStart: cutStart, srcEnd: cutEnd, silenceSec: 0, kind: 'tighten'});
    tighteningCuts.push({idx: i, word1: words[i].word, word2: words[i + 1].word, originalGapSec: ms(gap), retainedGapSec: tightening.retainedSec});
  }

  const speechEndSec = words[words.length - 1].end;
  const tailTrimStart = ms(speechEndSec + tailPadSec);
  const sourceDurationSec = rawTiming.durationSec;
  if (sourceDurationSec > tailTrimStart + 0.05) {
    edits.push({name: 'tail-trim', srcStart: tailTrimStart, srcEnd: sourceDurationSec, silenceSec: 0, kind: 'trim'});
  }

  edits.sort((a, b) => a.srcStart - b.srcStart);
  for (let i = 1; i < edits.length; i++) {
    if (edits[i].srcStart < edits[i - 1].srcEnd) throw new Error(`Overlapping edits: ${edits[i - 1].name} and ${edits[i].name}`);
  }

  // --- timestamp mapper + projections ---------------------------------------
  const mapper = (t, isStart) => {
    let delta = 0;
    for (const edit of edits) {
      if (t < edit.srcStart) break;
      const span = edit.srcEnd - edit.srcStart;
      const pastEnd = isStart ? t >= edit.srcEnd : t > edit.srcEnd;
      if (!pastEnd) {
        if (edit.silenceSec > 0 && span > 0) {
          // Word times inside a replaced span spread proportionally across the
          // inserted silence so caption beats keep their relative timing.
          return ms(edit.srcStart + delta + edit.silenceSec * ((t - edit.srcStart) / span));
        }
        t = edit.srcStart;
        break;
      }
      delta += edit.silenceSec - span;
    }
    return ms(t + delta);
  };

  // Boundary mapping belongs to the plan itself, including dry-run consumers.
  for (const boundary of boundaries) {
    boundary.mappedEndSec = mapper(boundary.endSec, false);
    boundary.mappedNextStartSec = mapper(boundary.nextStartSec, true);
    boundary.mappedGapSec = ms(boundary.mappedNextStartSec - boundary.mappedEndSec);
  }

  const mappedSpeechEndSec = mapper(speechEndSec, false);
  const padSamples = roundToSample(tailPadSec, sampleRate);
  const removedSamples = edits.reduce((sum, edit) => sum + (roundToSample(edit.srcEnd, sampleRate) - roundToSample(edit.srcStart, sampleRate)), 0);
  const insertedSamples = edits.reduce((sum, edit) => sum + roundToSample(edit.silenceSec, sampleRate), 0);
  const copySamples = roundToSample(sourceDurationSec, sampleRate) - removedSamples;
  const projectedDurationSec = ms(Math.max(copySamples + insertedSamples, roundToSample(mappedSpeechEndSec, sampleRate) + padSamples) / sampleRate);

  // --- claimed-silent windows (mapped/output coordinates, frame-aligned) -----
  // Windows must live inside the region the matching edit replaces with silence,
  // expressed in prepared-track coordinates so the PCM gate can scan the output.
  const windows = [];
  for (const boundary of boundaries) {
    // Output-coordinate interval of this boundary's replaced span.
    const mappedEnd = mapper(boundary.endSec, false);
    const mappedNextStart = mapper(boundary.nextStartSec, true);
    const rewindEnd = Math.min(mappedEnd + (boundary.rewindSec ?? 0), mappedNextStart);
    const rewindClaim = frameAlignedWindow(mappedEnd, rewindEnd, fps, sampleRate);
    if (rewindClaim) windows.push({name: `${boundary.name}:rewind`, kind: 'rewind', startSec: mappedEnd, endSec: rewindEnd, ...rewindClaim});
    if (boundary.dreadSec) {
      const dreadStart = Math.max(mappedEnd + (boundary.rewindSec ?? 0), mappedEnd);
      const dreadClaim = frameAlignedWindow(dreadStart, mappedNextStart, fps, sampleRate);
      if (dreadClaim) windows.push({name: `${boundary.name}:dread`, kind: 'dread', startSec: dreadStart, endSec: mappedNextStart, ...dreadClaim});
    }
  }
  for (const voice of worldVoices) {
    if (!voice.muteNarration) continue;
    const mappedSpanStart = mapper(voice.spanStartSec, true);
    const mappedSpanEnd = mapper(voice.spanEndSec, false);
    const claim = frameAlignedWindow(mappedSpanStart, mappedSpanEnd, fps, sampleRate);
    if (claim) windows.push({name: `worldvoice:${voice.name}`, kind: 'world-voice', startSec: mappedSpanStart, endSec: mappedSpanEnd, ...claim});
  }
  const tailTrimEdit = edits.find((edit) => edit.kind === 'trim');
  const copiedEndSec = tailTrimEdit ? mapper(tailTrimEdit.srcStart, true) : mapper(sourceDurationSec, false);
  const padClaim = frameAlignedWindow(copiedEndSec, projectedDurationSec, fps, sampleRate);
  if (padClaim) windows.push({name: 'ending:tail-pad', kind: 'ending-pad', startSec: copiedEndSec, endSec: projectedDurationSec, ...padClaim});

  // Drop words whose entire span was removed by a zero-silence cut (e.g. the hook
  // fallback filler) so the remapped word list matches the audio actually spoken.
  const isWordRemoved = (word) => edits.some((edit) => edit.silenceSec === 0 && word.start >= edit.srcStart - 0.001 && word.end <= edit.srcEnd + 0.001);
  const keptMapped = timing.words.map((word, srcIndex) => ({word, srcIndex, start: mapper(word.start, true), end: mapper(word.end, false)}))
    .filter((item) => !isWordRemoved(item.word));
  const mappedWords = keptMapped.map(({word, srcIndex, ...timed}) => timed);
  const mappedPositionOfSrc = new Map(keptMapped.map((item, position) => [item.srcIndex, position]));
  const mappedChunks = (timing.chunks ?? []).map((chunk) => {
    const chunkWords = mappedWords.filter((word) => word.chunk === chunk.index);
    const start = chunkWords.length > 0 ? chunkWords[0].start : mapper(chunk.start, true);
    const end = chunkWords.length > 0 ? chunkWords[chunkWords.length - 1].end : mapper(chunk.end, false);
    return {...chunk, start, end};
  });
  if (mappedChunks.length > 0 && mappedWords.length > 0) mappedChunks[mappedChunks.length - 1].end = mappedWords[mappedWords.length - 1].end;

  const panelWordSpans = (config.panels ?? []).map((panel) => {
    const fromIdx = words.findIndex((word) => stemOf(word.word) === panel.fromStem);
    let toIdx = -1;
    for (let i = fromIdx >= 0 ? fromIdx : words.length; i < words.length; i++) {
      if (stemOf(words[i].word) === panel.toStem) {
        toIdx = i;
        break;
      }
    }
    if (fromIdx < 0 || toIdx < fromIdx) throw new Error(`Panel span "${panel.panel}" ("${panel.fromStem}".."${panel.toStem}") not found in order`);
    const mappedFrom = mappedPositionOfSrc.get(fromIdx);
    const mappedTo = mappedPositionOfSrc.get(toIdx);
    if (mappedFrom === undefined || mappedTo === undefined || mappedTo < mappedFrom) throw new Error(`Panel span "${panel.panel}" has no mapped spoken words`);
    const startSec = mappedWords[mappedFrom].start;
    const endSec = mappedWords[mappedTo].end;
    return {
      panel: panel.panel,
      fromWord: words[fromIdx].word,
      toWord: words[toIdx].word,
      startSec,
      endSec,
      startFrame: Math.round(startSec * fps),
      endFrame: Math.round(endSec * fps),
      wordCount: mappedTo - mappedFrom + 1,
    };
  });

  return {
    fps,
    sampleRate,
    words: timing.words,
    edits,
    boundaries,
    worldVoices,
    tighteningCuts,
    skippedTightenings,
    pronunciationRecords,
    windows,
    mapper,
    mappedWords,
    mappedChunks,
    mappedSfx: (timing.sfx ?? []).map((item) => ({...item, start: mapper(item.start, true), end: mapper(item.end, false)})),
    panelWordSpans,
    speechEndSec: mappedSpeechEndSec,
    rawHookEndSec: config.hook && hookFinalIdx >= 0 ? words[hookFinalIdx].end : null,
    mappedHookEndSec: config.hook && hookFinalIdx >= 0 ? mapper(words[hookFinalIdx].end, false) : null,
    hookLimitSec: config.hook ? hookLimitSec : null,
    hookFallbackApplied: edits.some((edit) => edit.name === 'hook-fallback'),
    tailPadSec,
    releaseFadeSec,
    padSamples,
    projectedDurationSec,
    sourceDurationSec,
  };
}

/** One-pass continuous-PCM assembly (005 style: exact silence replacement, 10 ms junction fades). */
export function assemblePcm(inputSamples, plan) {
  const {sampleRate, edits, tailPadSec} = plan;
  const fadeSamples = Math.max(1, Math.round(FADE_SEC * sampleRate));
  const removed = edits.reduce((sum, edit) => sum + (roundToSample(edit.srcEnd, sampleRate) - roundToSample(edit.srcStart, sampleRate)), 0);
  const inserted = edits.reduce((sum, edit) => sum + roundToSample(edit.silenceSec, sampleRate), 0);
  const output = new Int16Array(inputSamples.length - removed + inserted + plan.padSamples + sampleRate);
  const copyRanges = [];
  const modifiedRanges = []; // junction/release fade regions, excluded from the sample-preserving check
  let inPos = 0;
  let outPos = 0;
  for (const edit of edits) {
    const editStart = roundToSample(edit.srcStart, sampleRate);
    const editEnd = roundToSample(edit.srcEnd, sampleRate);
    const segment = editStart - inPos;
    if (segment > 0) {
      output.set(inputSamples.subarray(inPos, editStart), outPos);
      // Fade out into the junction so speech release never clicks against silence.
      const fade = Math.min(fadeSamples, segment);
      const fadeStart = outPos + segment - fade;
      for (let i = 0; i < fade; i++) output[fadeStart + i] = Math.round(output[fadeStart + i] * (1 - i / fade));
      if (segment > fade) copyRanges.push({srcStart: inPos, srcEnd: editStart - fade, outStart: outPos});
      if (fade > 0) modifiedRanges.push({outStart: fadeStart, sampleCount: fade});
      outPos += segment;
    }
    outPos += roundToSample(edit.silenceSec, sampleRate); // pre-zeroed output = exact silence
    inPos = editEnd;
  }
  const remaining = inputSamples.length - inPos;
  if (remaining > 0) {
    const fade = Math.min(fadeSamples, remaining);
    for (let i = 0; i < fade; i++) output[outPos + i] = Math.round(inputSamples[inPos + i] * (i / fade));
    output.set(inputSamples.subarray(inPos + fade), outPos + fade);
    if (remaining > fade) copyRanges.push({srcStart: inPos + fade, srcEnd: inputSamples.length, outStart: outPos + fade});
    if (fade > 0) modifiedRanges.push({outStart: outPos, sampleCount: fade});
    outPos += remaining;
  }
  // Release fade on the final track tail (room tone) so the copied audio meets the
  // exact-zero pad without a click. The faded region is recorded in modifiedRanges so
  // the sample-preserving check can exclude it deliberately.
  const releaseSamples = Math.min(Math.max(1, Math.round(plan.releaseFadeSec * sampleRate)), outPos);
  if (releaseSamples > 1) {
    const fadeStart = outPos - releaseSamples;
    for (let i = 0; i < releaseSamples; i++) output[fadeStart + i] = Math.round(output[fadeStart + i] * (1 - i / releaseSamples));
    modifiedRanges.push({outStart: fadeStart, sampleCount: releaseSamples});
  }
  // Sample-preserving pad: extend the track so the tail hold after the final word is
  // exactly tailPadSec; the appended region is guaranteed exact zeros.
  const speechEndSample = roundToSample(plan.speechEndSec, sampleRate);
  const targetLength = speechEndSample + roundToSample(tailPadSec, sampleRate);
  const padStart = Math.min(outPos, targetLength);
  const finalLength = Math.max(outPos, targetLength);
  return {
    pcm: output.subarray(0, finalLength),
    copyRanges,
    modifiedRanges,
    pad: {startSample: padStart, sampleCount: finalLength - padStart, exactZeroByConstruction: true},
    outPos,
  };
}

/**
 * The boundary gate. Every claimed-silent window in the plan is checked on the
 * assembled PCM at sample level; the window edges are fps-frame-aligned (recorded
 * with their frame numbers). Throws with per-window evidence when any nonzero
 * narration sample bleeds into a claimed silence.
 */
export function verifyProtectedWindows(pcm, plan, {maxReported = 5} = {}) {
  const violations = [];
  for (const window of plan.windows) {
    let firstNonzero = -1;
    let peak = 0;
    for (let i = window.startSample; i < Math.min(window.endSample, pcm.length); i++) {
      if (pcm[i] !== 0) {
        if (firstNonzero < 0) firstNonzero = i;
        peak = Math.max(peak, Math.abs(pcm[i]));
      }
    }
    if (firstNonzero >= 0) {
      violations.push({
        window: window.name,
        kind: window.kind,
        windowFrames: [window.startFrame, window.endFrame],
        windowSec: [window.startSec, window.endSec],
        firstNonzeroSample: firstNonzero,
        firstNonzeroSec: ms(firstNonzero / plan.sampleRate),
        peakAmplitude: peak,
      });
    }
  }
  if (violations.length > 0) {
    const reported = violations.slice(0, maxReported).map((v) =>
      `${v.window} [frame ${v.windowFrames[0]}–${v.windowFrames[1]}]: first nonzero sample at ${v.firstNonzeroSec} s (amplitude ${v.peakAmplitude})`);
    throw new Error(`Claimed-silence violation: nonzero narration PCM bleeds into ${violations.length} claimed silent window(s):\n${reported.join('\n')}`);
  }
  return {windows: plan.windows.length, violations: 0};
}

/**
 * Sample-preserving verification: untouched source regions must be bit-identical in
 * the assembled stem, and the appended tail pad must be exact zeros with exactly the
 * configured sample count after the final word.
 */
export function verifySamplePreserving(inputSamples, assembled, plan) {
  const pcm = assembled.pcm;
  const isModified = (outSample) => (assembled.modifiedRanges ?? []).some((range) => outSample >= range.outStart && outSample < range.outStart + range.sampleCount);
  for (const range of assembled.copyRanges) {
    const length = range.srcEnd - range.srcStart;
    for (let i = 0; i < length; i++) {
      if (isModified(range.outStart + i)) continue; // documented release-fade region
      if (pcm[range.outStart + i] !== inputSamples[range.srcStart + i]) {
        throw new Error(`Sample-preserving violation: output sample ${range.outStart + i} (${ms((range.outStart + i) / plan.sampleRate)} s) differs from source sample ${range.srcStart + i} (${ms((range.srcStart + i) / plan.sampleRate)} s)`);
      }
    }
  }
  for (let i = assembled.pad.startSample; i < pcm.length; i++) {
    if (pcm[i] !== 0) throw new Error(`Pad violation: nonzero sample ${i} (${ms(i / plan.sampleRate)} s) inside the claimed exact-zero tail pad`);
  }
  const padSec = ms((pcm.length - assembled.pad.startSample) / plan.sampleRate);
  const tailSec = ms(pcm.length / plan.sampleRate - plan.speechEndSec);
  if (Math.abs(tailSec - plan.tailPadSec) > GAP_TOLERANCE_SEC) {
    throw new Error(`Pad violation: tail hold after the final word is ${tailSec} s, expected ${plan.tailPadSec} s ± ${GAP_TOLERANCE_SEC}`);
  }
  return {copiedRanges: assembled.copyRanges.length, padStartSample: assembled.pad.startSample, padSec, tailSec};
}

/** Strictly monotonic MP3 PTS verification via ffprobe (per-packet). */
export function checkMonotonicPts(mp3Path, {maxBuffer = 40 * 1024 * 1024} = {}) {
  const proc = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'a', '-show_packets', '-show_entries', 'packet=pts_time', '-of', 'csv=p=0', mp3Path], {encoding: 'utf8', maxBuffer});
  if (proc.status !== 0) throw new Error(`ffprobe PTS check failed: ${proc.stderr}`);
  // Some packets carry side-data columns in the csv output; the pts is always the
  // first field. A non-numeric first field is itself a violation.
  const packets = proc.stdout.trim().split(/\r?\n/).filter(Boolean).map((line) => Number(line.split(',')[0]));
  let previous = -Infinity;
  let violations = 0;
  packets.forEach((pts, i) => {
    if (!(pts > previous)) {
      console.error(`PTS monotonicity violation at packet ${i}: ${pts} <= ${previous}`);
      violations++;
    }
    previous = pts;
  });
  if (violations > 0) throw new Error(`Monotonic PTS check failed with ${violations} violations`);
  return {packets: packets.length, violations: 0};
}

/** Projected durations across tightening parameters (pure; used by --dry-run). */
export function projectTighteningVariations(config, timing, variations) {
  const rows = [];
  for (const variation of variations) {
    const plan = buildPlan(config, timing, variation);
    rows.push({
      thresholdSec: variation.thresholdSec,
      retainedSec: variation.retainedSec,
      preparedDurationSec: plan.projectedDurationSec,
      speechEndSec: plan.speechEndSec,
      hookEndSec: plan.mappedHookEndSec,
      edits: plan.edits.length,
      tighteningCuts: plan.tighteningCuts.length,
      isConfig: (variation.thresholdSec ?? Infinity) === (config.tightening?.thresholdSec ?? Infinity) &&
        (variation.retainedSec ?? 0) === (config.tightening?.retainedSec ?? 0),
    });
  }
  return rows;
}

function decodeSourceSamples(source, sampleRate) {
  const proc = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-i', source, '-f', 's16le', '-ac', '1', '-ar', String(sampleRate), 'pipe:1'], {encoding: 'buffer', maxBuffer: 512 * 1024 * 1024});
  if (proc.status !== 0 || !proc.stdout?.length) throw new Error(`Failed to decode source audio: ${proc.stderr}`);
  return new Int16Array(proc.stdout.buffer, proc.stdout.byteOffset, proc.stdout.byteLength / 2);
}

function encodePcmDerivatives(pcmBuffer, {outputWav, outputMp3, sampleRate}) {
  for (const [output, extra] of [[outputWav, []], [outputMp3, ['-codec:a', 'libmp3lame', '-q:a', '2']]]) {
    const proc = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 's16le', '-ar', String(sampleRate), '-ac', '1', '-i', 'pipe:0', ...extra, output], {input: pcmBuffer, maxBuffer: 512 * 1024 * 1024, encoding: 'utf8'});
    if (proc.status !== 0) throw new Error(`Failed to encode ${output}: ${proc.stderr}`);
    console.log(`Wrote ${output}`);
  }
}

export function assertLockedGaps(plan) {
  for (const boundary of plan.boundaries) {
    const mappedEndSec = plan.mapper(boundary.endSec, false);
    const mappedNextStartSec = plan.mapper(boundary.nextStartSec, true);
    const gapSec = ms(mappedNextStartSec - mappedEndSec);
    const expected = boundary.totalSec;
    if (Math.abs(gapSec - expected) > GAP_TOLERANCE_SEC) {
      throw new Error(`${boundary.name}: locked gap ${gapSec} s != expected ${expected} s`);
    }
  }
  return plan.boundaries;
}

export async function prepareNarration(configPath, {dryRun = false, force = false} = {}) {
  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  const episodeDir = resolve(process.cwd(), 'episodes', config.episode);
  const source = resolve(process.cwd(), config.source ?? join('episodes', config.episode, 'narration-investigator.mp3'));
  const sourceTimes = resolve(process.cwd(), config.sourceTimestamps ?? join('episodes', config.episode, 'narration-investigator-timestamps.json'));
  const outputWav = resolve(process.cwd(), config.outputWav ?? join('episodes', config.episode, 'narration-prepared.wav'));
  const outputMp3 = resolve(process.cwd(), config.outputMp3 ?? join('episodes', config.episode, 'narration-prepared.mp3'));
  const timingsPath = resolve(process.cwd(), config.timingsPath ?? join('episodes', config.episode, 'narration-timestamps.json'));
  const mapPath = resolve(process.cwd(), config.editMapPath ?? join('episodes', config.episode, 'audio-edit-map.json'));
  const publicDir = resolve(process.cwd(), config.publicAssetsDir ?? join('public', 'assets', config.episode));
  if (!existsSync(source) || !existsSync(sourceTimes)) throw new Error(`Missing source files: ${source} / ${sourceTimes}`);
  if (!dryRun) {
    for (const output of [outputWav, outputMp3, timingsPath, mapPath, join(publicDir, 'narration-prepared.wav'), join(publicDir, 'narration-prepared.mp3'), join(publicDir, 'narration-timestamps.json')]) {
      if (!force && existsSync(output)) throw new Error(`Output already exists (use --force to re-prepare): ${output}`);
    }
  }

  const timing = JSON.parse(readFileSync(sourceTimes, 'utf8'));
  const plan = buildPlan(config, timing);
  for (const boundary of plan.boundaries) {
    console.log(`Boundary ${boundary.name}: "${boundary.word}" ends ${ms(boundary.endSec)} s -> "${boundary.nextWord}" starts ${ms(boundary.nextStartSec)} s (raw gap ${boundary.rawGapSec} s, exact ${boundary.totalSec} s)`);
  }
  console.log(`Planned ${plan.edits.length} edits (${plan.tighteningCuts.length} tightenings, ${plan.boundaries.length} boundary replacements, ${plan.windows.length} claimed-silent windows).`);

  if (dryRun) {
    const variations = [];
    for (const thresholdSec of [0.4, 0.5, 0.65]) {
      for (const retainedSec of [0.18, 0.26, 0.32, 0.42]) {
        variations.push({thresholdSec, retainedSec});
      }
    }
    const configured = {thresholdSec: config.tightening?.thresholdSec, retainedSec: config.tightening?.retainedSec};
    if (!variations.some((v) => v.thresholdSec === configured.thresholdSec && v.retainedSec === configured.retainedSec)) variations.push(configured);
    const rows = projectTighteningVariations(config, timing, variations);
    console.log('\n--dry-run projected prepared duration (no files written):');
    const show = (value) => (Number.isFinite(value) ? `${value} s` : 'off');
    for (const row of rows) {
      console.log(`${row.isConfig ? '>' : ' '} tightening ${show(row.thresholdSec)}, retained ${show(row.retainedSec)} -> prepared ${row.preparedDurationSec.toFixed(3)} s, speech end ${row.speechEndSec.toFixed(3)} s, hook end ${row.hookEndSec?.toFixed(3) ?? '-'} s, ${row.edits} edits (${row.tighteningCuts} tightenings)`);
    }
    console.log(`Config row marked with >. Projected config duration: ${plan.projectedDurationSec} s. Dry run complete; nothing encoded.`);
    return {plan, dryRun: true};
  }

  if (config.pronunciation && plan.pronunciationRecords.length > 0) {
    console.log(`Pronunciation reconciliations applied to the word track: ${plan.pronunciationRecords.length} (see the edit map).`);
  }

  const inputSamples = decodeSourceSamples(source, plan.sampleRate);
  console.log(`Decoded source audio: ${inputSamples.length} samples (${ms(inputSamples.length / plan.sampleRate)} s)`);
  const assembled = assemblePcm(inputSamples, plan);
  const preparedDurationSec = ms(assembled.pcm.length / plan.sampleRate);
  console.log(`Assembled continuous PCM: ${assembled.pcm.length} samples = ${preparedDurationSec} s (projected ${plan.projectedDurationSec} s)`);

  // Built-in gates before anything is written.
  const windowCheck = verifyProtectedWindows(assembled.pcm, plan);
  console.log(`PCM boundary gate: ${windowCheck.windows} claimed-silent windows verified sample-exact at frame-aligned boundaries.`);
  const preserveCheck = verifySamplePreserving(inputSamples, assembled, plan);
  console.log(`Sample-preserving check: ${preserveCheck.copiedRanges} copied ranges bit-identical; pad ${preserveCheck.padSec} s of exact zeros; tail hold ${preserveCheck.tailSec} s.`);

  if (plan.mappedHookEndSec !== null && plan.hookLimitSec !== null && plan.mappedHookEndSec > plan.hookLimitSec) {
    throw new Error(`Mapped hook ends at ${plan.mappedHookEndSec} s, beyond the ${plan.hookLimitSec} s measured-hook limit (target <= 3.0 s)`);
  }
  assertLockedGaps(plan);

  const pcmBuffer = Buffer.from(assembled.pcm.buffer, assembled.pcm.byteOffset, assembled.pcm.byteLength);
  encodePcmDerivatives(pcmBuffer, {outputWav, outputMp3, sampleRate: plan.sampleRate});
  const pts = checkMonotonicPts(outputMp3);
  console.log(`Verified ${pts.packets} MP3 packets: strictly monotonic PTS, zero discontinuities.`);

  const remappedTimings = {
    version: 1,
    voiceId: timing.voiceId,
    durationSec: preparedDurationSec,
    master: true,
    chunks: plan.mappedChunks,
    words: plan.mappedWords,
    sfx: plan.mappedSfx,
    source: config.sourceTimestamps ?? join('episodes', config.episode, 'narration-investigator-timestamps.json'),
    note: 'Assembled on one continuous PCM sample timeline by scripts/prepare-narration.mjs. Claimed-silent windows verified sample-exact at frame boundaries; pad verified sample-preserving; monotonic PTS verified. Zero playback-speed change.',
  };
  writeFileSync(timingsPath, JSON.stringify(remappedTimings, null, 2) + '\n');
  console.log(`Wrote remapped timestamps: ${timingsPath}`);

  const fps = plan.fps;
  const editMap = {
    source,
    outputWav,
    outputMp3,
    sourceDurationSec: plan.sourceDurationSec,
    preparedDurationSec,
    speechEndSec: plan.speechEndSec,
    hookEndSec: plan.mappedHookEndSec,
    hookWithinLimit: config.hook ? plan.mappedHookEndSec <= plan.hookLimitSec : null,
    hookLimitSec: plan.hookLimitSec,
    hookFallback: plan.hookFallbackApplied,
    crossfadeSec: FADE_SEC,
    tightening: config.tightening ?? null,
    skippedTightenings: plan.skippedTightenings,
    tighteningCuts: plan.tighteningCuts.map((cut) => ({
      word1: cut.word1,
      word2: cut.word2,
      originalGapSec: cut.originalGapSec,
      retainedGapSec: cut.retainedGapSec,
      mappedStartSec: plan.mapper(plan.words[cut.idx].end, false),
      mappedEndSec: plan.mapper(plan.words[cut.idx + 1].start, true),
    })),
    protectedBeats: config.protectedBeats ?? [],
    lockedRewindGaps: plan.boundaries.map((boundary) => ({
      name: boundary.name,
      afterWord: boundary.word,
      afterWordEndSec: boundary.mappedEndSec,
      beforeWord: boundary.nextWord,
      beforeWordStartSec: boundary.mappedNextStartSec,
      rewindSec: boundary.rewindSec ?? 0,
      dreadSilenceSec: boundary.dreadSec ?? 0,
      totalGapSec: boundary.mappedGapSec,
      naturalGapSec: boundary.rawGapSec,
      snapSampleOffset: roundToSample(boundary.mappedEndSec, plan.sampleRate),
      note: boundary.note ?? '',
    })),
    worldVoiceWindows: plan.worldVoices.map((voice) => ({
      name: voice.name,
      words: plan.words.slice(voice.fromIdx + 1, voice.toIdx + 1).map((word) => word.word),
      spanSec: [plan.mapper(voice.spanStartSec, true), plan.mapper(voice.spanEndSec, false)],
      reservedWindowSec: [plan.mapper(voice.reservedWindowSec[0], false), plan.mapper(voice.reservedWindowSec[1], true)],
      narrationMutedInStem: !!voice.muteNarration,
      why: voice.why ?? '',
    })),
    claimedSilenceWindows: plan.windows.map((window) => ({
      name: window.name,
      kind: window.kind,
      frames: [window.startFrame, window.endFrame],
      sec: [window.startSec, window.endSec],
      verified: 'sample-exact zeros in narration-prepared.wav (PCM boundary gate)',
    })),
    pronunciationRecords: plan.pronunciationRecords,
    panelWordSpans: plan.panelWordSpans,
    timelinePlacement: {
      blackoutTail: {
        speechReleaseSec: plan.speechEndSec,
        preparedTrackEndSec: preparedDurationSec,
        assembledVideoCutDurationSec: config.assembledCutSec ?? null,
        note: config.tail?.note ?? 'Tail pad after the final word is exact-zero silence reserved for mix cues (tension ramp, vacuum, jolt, hard cut).',
      },
    },
    runtimeBudget: {
      narrationTrackDurationSec: preparedDurationSec,
      spokenSpeechEndSec: plan.speechEndSec,
      assembledVideoCutDurationSec: config.assembledCutSec ?? null,
      targetWindowSec: config.targetWindowSec ?? null,
    },
    assemblerHandoff: {
      preparedTrack: {
        wav: outputWav,
        mp3: outputMp3,
        sampleRate: plan.sampleRate,
        channels: 1,
        durationSec: preparedDurationSec,
      },
      wordTimingSource: timingsPath,
      frameRules: {
        fps,
        sampleOffsetFormula: 'Math.round(frame * sampleRate / fps)',
        note: 'All claimed-silent windows are aligned to fps frame boundaries and were verified sample-exact in the prepared WAV.',
      },
      claimedSilenceWindows: plan.windows.map((window) => ({name: window.name, startFrame: window.startFrame, endFrame: window.endFrame})),
      rewindSnapAnchors: plan.boundaries.map((boundary) => ({
        name: boundary.name,
        startFrame: Math.round(plan.mapper(boundary.endSec, false) * fps),
        sampleOffset: roundToSample(plan.mapper(boundary.endSec, false), plan.sampleRate),
      })),
      tail: {
        speechEndSec: plan.speechEndSec,
        padSec: plan.tailPadSec,
        trackEndSec: preparedDurationSec,
      },
      notes: 'Lay cue-sheet SFX and world-voice assets only inside their reserved windows; keep claimed-silent windows silent in the mix.',
    },
    notes: 'Assembled by scripts/prepare-narration.mjs on a continuous PCM sample timeline; zero playback-speed change (atempo 1.0x preserved); strictly monotonic PTS verified by ffprobe across all packets.',
  };
  writeFileSync(mapPath, JSON.stringify(editMap, null, 2) + '\n');
  console.log(`Wrote edit map with assemblerHandoff + ${plan.panelWordSpans.length} panel word spans: ${mapPath}`);

  mkdirSync(publicDir, {recursive: true});
  copyFileSync(outputWav, join(publicDir, 'narration-prepared.wav'));
  copyFileSync(outputMp3, join(publicDir, 'narration-prepared.mp3'));
  copyFileSync(timingsPath, join(publicDir, 'narration-timestamps.json'));
  console.log(`Copied narration derivatives to ${publicDir}`);

  if (config.targetWindowSec && config.assembledCutSec) {
    const [low, high] = config.targetWindowSec;
    if (config.assembledCutSec < low || config.assembledCutSec > high) {
      console.warn(`[warning] assembled cut ${config.assembledCutSec} s is outside the ${low}–${high} s target window`);
    }
  }
  return {plan, preparedDurationSec, preserveCheck, windowCheck};
}

export function parseArgs(argv) {
  const positional = [];
  let dryRun = false;
  let force = false;
  for (const arg of argv) {
    if (arg === '--dry-run') dryRun = true;
    else if (arg === '--force') force = true;
    else if (arg.startsWith('--')) throw new Error(`Unknown option ${arg}`);
    else positional.push(arg);
  }
  if (positional.length !== 1) throw new Error('Usage: node scripts/prepare-narration.mjs <episode narration-prep.json> [--dry-run] [--force]');
  return {configPath: positional[0], dryRun, force};
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const {configPath, dryRun, force} = parseArgs(process.argv.slice(2));
    await prepareNarration(configPath, {dryRun, force});
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
