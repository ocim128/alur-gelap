import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectNarration} from './review-narration.mjs';

test('finds a run of short sentences while treating rewind words separately', () => {
  const result = inspectNarration('Dia masuk. Pintu terkunci. Kunci hilang. Tamat. Balik lagi. Ranto membuka pintu perlahan sekali.');
  assert.equal(result.words, 14);
  assert.equal(result.consecutiveShortPassages.length, 1);
  assert.deepEqual(result.consecutiveShortPassages[0].sentences, ['Dia masuk.', 'Pintu terkunci.', 'Kunci hilang.']);
});

test('uses real chunk timestamps and identifies a mismatched script', () => {
  const timing = {chunks: [
    {index: 0, text: 'Ranto masuk.', start: 0, end: 1.5},
    {index: 1, text: 'Pintu tertutup.', start: 1.7, end: 3},
  ]};
  const good = inspectNarration('Ranto masuk.\n\nPintu tertutup.', timing);
  assert.equal(good.synthesis.matchesScript, true);
  assert.equal(good.synthesis.joins[0].nextStartSec, 1.7);
  assert.equal(inspectNarration('Ranto keluar.', timing).synthesis.matchesScript, false);
  assert.throws(() => inspectNarration('Ranto.', {chunks: [{text: 'Ranto.', start: 1}]}), /valid start\/end/);
});
