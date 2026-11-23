// A reading aid for the showrunner and audio producer. The sentence split is
// approximate and the report never assigns a quality verdict.
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {countNarrationWords} from './count-narration-words.mjs';

const normalize = (text) => String(text).replace(/\s+/gu, ' ').trim();

export function inspectNarration(text, timing = null) {
  const script = String(text);
  const sentences = normalize(script).split(/(?<=[.!?…])\s+/u).filter(Boolean);
  const lengths = sentences.map((sentence) => countNarrationWords(sentence).words);
  const shortRuns = [];
  let runStart = null;
  for (let i = 0; i <= sentences.length; i++) {
    const isShort = i < sentences.length && lengths[i] > 0 && lengths[i] <= 4;
    const isReset = i < sentences.length && /^(?:tamat|balik lagi)[.!?…]*$/iu.test(sentences[i]);
    if (isShort && !isReset) {
      if (runStart === null) runStart = i;
    } else if (runStart !== null) {
      if (i - runStart >= 3) {
        shortRuns.push({
          firstSentence: runStart + 1,
          sentences: sentences.slice(runStart, i),
        });
      }
      runStart = null;
    }
  }

  let synthesis = null;
  if (timing !== null) {
    if (!Array.isArray(timing.chunks) || timing.chunks.length === 0) {
      throw new Error('The timestamp file must contain a non-empty chunks array.');
    }
    const chunks = timing.chunks;
    for (const chunk of chunks) {
      if (typeof chunk.text !== 'string' || !Number.isFinite(chunk.start) ||
          !Number.isFinite(chunk.end) || chunk.start < 0 || chunk.end < chunk.start) {
        throw new Error('Every chunk needs text and valid start/end seconds.');
      }
    }
    const matchesScript = normalize(chunks.map((chunk) => chunk.text).join(' ')) === normalize(script);
    synthesis = {
      matchesScript,
      chunkCount: chunks.length,
      joins: chunks.slice(1).map((chunk, i) => ({
        previousChunk: chunks[i].index,
        nextChunk: chunk.index,
        previousEndSec: chunks[i].end,
        nextStartSec: chunk.start,
        previousText: chunks[i].text,
        nextText: chunk.text,
      })),
    };
  }
  return {
    scriptSha256: createHash('sha256').update(script, 'utf8').digest('hex'),
    ...countNarrationWords(script),
    sentenceCountApprox: sentences.length,
    shortSentenceCountApprox: lengths.filter((count) => count > 0 && count <= 4).length,
    consecutiveShortPassages: shortRuns,
    synthesis,
    interpretation: 'Use counts and passages to guide a read-through. Join times come from the supplied timestamps and need listening review.',
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (args.length !== 1 && !(args.length === 3 && args[1] === '--timestamps')) {
      throw new Error('Usage: node scripts/review-narration.mjs <narasi.txt> [--timestamps <ShortZ-timestamps.json>]');
    }
    const script = readFileSync(args[0], 'utf8');
    const timing = args.length === 3 ? JSON.parse(readFileSync(args[2], 'utf8')) : null;
    console.log(JSON.stringify(inspectNarration(script, timing), null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
