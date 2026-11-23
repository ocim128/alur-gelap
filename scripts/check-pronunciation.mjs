// Mandatory pronunciation-diff checker (agents/02-audio-producer.md contract).
//
// Diffs the raw ShortZ ASR word track against the approved narasi.txt using the shared
// `asr-reconcile.json` dictionary (recurring Indonesian Whisper artifacts from Episodes
// 003-005: e.g. Gak->nggak, kopilot->copilot, benar->bener, jadikan->jadiin). Matching is
// punctuation-tolerant, case-insensitive, hyphen-split-aware and context-aware
// (`contextBefore`). Known artifacts are classified and reconciled automatically; only
// genuinely NEW deviations escalate as suspects (exit 1).
//
// Usage:
//   node scripts/check-pronunciation.mjs <episodeDir> [--dictionary <path>] [--out <path>]
// Reads <episodeDir>/narration-investigator-timestamps.json and <episodeDir>/narasi.txt.
// ASR text alone cannot establish pronunciation; a pass here is not a listening review.
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join, resolve} from 'node:path';

export const DEFAULT_DICTIONARY_PATH = join(resolve(fileURLToPath(import.meta.url)), '..', 'asr-reconcile.json');
import {applyRules, normalizeHeard, stripTrailingPunctuation} from './asr-reconcile.mjs';
export {applyRules, normalizeHeard} from './asr-reconcile.mjs';

/** Canonical script tokens: whitespace-split, punctuation-stripped, hyphen-split, lowercased (003-005 precedent). */
export function canonicalScriptTokens(scriptText) {
  return String(scriptText)
    .split(/\s+/u)
    .filter(Boolean)
    .map((token) => token.replace(/[.,:!?…;:'"’”]+/gu, ''))
    .filter((token) => token.length > 0)
    .flatMap((token) => token.split('-'))
    .filter(Boolean)
    .map((token) => token.toLowerCase());
}

/** Split hyphenated heard tokens into comparable units, keeping a link to the raw word. */
export function heardUnits(rawWords) {
  const units = [];
  rawWords.forEach((raw, rawIndex) => {
    const stripped = stripTrailingPunctuation(raw.word);
    const suffix = raw.word.slice(stripped.length);
    const parts = stripped.split('-').filter(Boolean);
    parts.forEach((part, partIndex) => {
      units.push({
        rawIndex,
        word: part + (partIndex === parts.length - 1 ? suffix : ''),
        start: raw.start + (raw.end - raw.start) * (partIndex / Math.max(1, parts.length)),
        end: raw.start + (raw.end - raw.start) * ((partIndex + 1) / Math.max(1, parts.length)),
      });
    });
  });
  return units;
}

/**
 * Reconcile a raw ASR word track against the approved script with the shared dictionary.
 * Returns applied reconciliation records, the remaining suspects (context included) and
 * a pass flag. Pure: no filesystem access.
 */
export function reconcile(rawWords, scriptText, dictionary = {renames: [], splits: [], merges: []}) {
  const {units, records} = applyRules(heardUnits(rawWords), dictionary);

  const scriptTokens = canonicalScriptTokens(scriptText);
  const reconciledTokens = units.map((unit) => normalizeHeard(unit.word));
  const suspects = [];
  for (let i = 0; i < Math.max(scriptTokens.length, reconciledTokens.length); i++) {
    if (scriptTokens[i] === reconciledTokens[i]) continue;
    suspects.push({
      position: i,
      script: scriptTokens[i] ?? '(missing)',
      heard: reconciledTokens[i] ?? '(extra)',
      context: {
        script: scriptTokens.slice(Math.max(0, i - 3), i + 4).join(' '),
        heard: reconciledTokens.slice(Math.max(0, i - 3), i + 4).join(' '),
      },
    });
  }
  return {
    pass: suspects.length === 0,
    scriptTokenCount: scriptTokens.length,
    heardTokenCount: reconciledTokens.length,
    reconciliations: records,
    suspects,
    reconciledTokens,
  };
}

export function checkEpisodeDir(episodeDir, dictionaryPath = DEFAULT_DICTIONARY_PATH) {
  const dictionary = JSON.parse(readFileSync(dictionaryPath, 'utf8'));
  const timing = JSON.parse(readFileSync(join(episodeDir, 'narration-investigator-timestamps.json'), 'utf8'));
  const scriptText = readFileSync(join(episodeDir, 'narasi.txt'), 'utf8');
  return {
    dictionary: dictionaryPath,
    ...reconcile(timing.words, scriptText, dictionary),
  };
}

export function parseArgs(argv) {
  const positional = [];
  let dictionary = DEFAULT_DICTIONARY_PATH;
  let out = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--dictionary') dictionary = argv[++i];
    else if (argv[i] === '--out') out = argv[++i];
    else if (argv[i].startsWith('--')) throw new Error(`Unknown option ${argv[i]}`);
    else positional.push(argv[i]);
  }
  if (positional.length !== 1) throw new Error('Usage: node scripts/check-pronunciation.mjs <episodeDir> [--dictionary <path>] [--out <path>]');
  return {episodeDir: positional[0], dictionary, out};
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const {episodeDir, dictionary, out} = parseArgs(process.argv.slice(2));
    const result = checkEpisodeDir(episodeDir, dictionary);
    const summary = {
      episodeDir,
      dictionary,
      result: result.pass ? 'pass' : 'suspects',
      scriptTokenCount: result.scriptTokenCount,
      heardTokenCount: result.heardTokenCount,
      reconciled: result.reconciliations.length,
      suspects: result.suspects,
      note: 'Dictionary reconciliation only; ASR text cannot establish pronunciation and no listening review is claimed.',
    };
    if (out) {
      const {writeFileSync, existsSync} = await import('node:fs');
      if (existsSync(out)) throw new Error(`Refusing to overwrite existing diff output: ${out}`);
      writeFileSync(out, JSON.stringify(summary, null, 2) + '\n');
      console.log(`Wrote ${out}`);
    }
    console.log(JSON.stringify(summary, null, 2));
    if (!result.pass) {
      console.error(`${result.suspects.length} suspect deviation(s) after dictionary reconciliation; resolve with the ASR report and targeted listening before audio: pass.`);
      process.exitCode = 1;
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
