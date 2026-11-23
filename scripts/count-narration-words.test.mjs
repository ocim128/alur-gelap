import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {countNarrationWords} from './count-narration-words.mjs';

test('counting rule: hyphenated compounds are one word, split count is printed for visibility', () => {
  const result = countNarrationWords('Baling-baling ekor nyangkut. Pelan-pelan, dua-duanya kebuka.');
  assert.equal(result.words, 6);
  assert.deepEqual(result.hyphenatedTokens, ['Baling-baling', 'Pelan-pelan,', 'dua-duanya']);
  assert.equal(result.splitCount, 3);
  assert.equal(result.wordsIfSplit, 9);
});

test('punctuation-only tokens and bare numbers follow the letter/number rule', () => {
  assert.equal(countNarrationWords('— ... !').words, 0);
  const numbers = countNarrationWords('Pukul 5 pagi. 2026.');
  assert.equal(numbers.words, 4);
  assert.equal(numbers.splitCount, 0);
});

test('the canonical count matches the Episode 004 brief figure (256 words / 265 split)', () => {
  const script = readFileSync('episodes/004-tangan-pilot-kemarin/narasi.txt', 'utf8');
  const counted = countNarrationWords(script);
  assert.equal(counted.words, 256, `canonical count ${counted.words}`);
  assert.equal(counted.wordsIfSplit, 265, `split count ${counted.wordsIfSplit}`);
});
