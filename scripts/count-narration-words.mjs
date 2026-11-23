// Canonical narration word counter.
//
// One counting rule for briefs, budgets and validator gates (codified from the
// Episode 004 brief: "256 kata; 265 bila kata bergabung dihitung terpisah"):
//   - a token counts as one word when it contains at least one letter or number,
//   - hyphenated compounds ("baling-baling", "sekeras-kerasnya") count as ONE word,
//   - the split count reports how many extra words the same text yields if every
//     hyphenated compound is counted as its parts (printed for visibility).
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';

const hasLetterOrNumber = (token) => /[\p{L}\p{N}]/u.test(token);

export function countNarrationWords(text) {
  const tokens = String(text).split(/\s+/u).filter(Boolean);
  let words = 0;
  let splitCount = 0;
  const hyphenatedTokens = [];
  for (const token of tokens) {
    if (!hasLetterOrNumber(token)) continue;
    words += 1;
    const parts = token.split('-').filter(hasLetterOrNumber);
    if (parts.length > 1) {
      hyphenatedTokens.push(token);
      splitCount += parts.length - 1;
    }
  }
  return {words, hyphenatedTokens, splitCount, wordsIfSplit: words + splitCount};
}

export function countNarrationWordsFile(path) {
  return {file: resolve(path), ...countNarrationWords(readFileSync(path, 'utf8'))};
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.length !== 3) {
    console.error('Usage: node scripts/count-narration-words.mjs <narasi.txt>');
    process.exitCode = 1;
  } else {
    try {
      const result = countNarrationWordsFile(process.argv[2]);
      console.log(JSON.stringify(result, null, 2));
      console.log(`Canonical count (hyphenated compounds = 1 word): ${result.words} words (${result.wordsIfSplit} if split).`);
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
  }
}
