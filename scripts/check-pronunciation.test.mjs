import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {countNarrationWords} from './count-narration-words.mjs';
import {applyRules, canonicalScriptTokens, DEFAULT_DICTIONARY_PATH, heardUnits, reconcile} from './check-pronunciation.mjs';

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

test('canonical script tokens are punctuation-tolerant and hyphen-split', () => {
  assert.deepEqual(canonicalScriptTokens('Pelan-pelan, sekeras-kerasnya: BRAK!'), ['pelan', 'pelan', 'sekeras', 'kerasnya', 'brak']);
});

test('heard hyphen-split units keep proportional timing and the raw index', () => {
  const units = heardUnits([{word: 'pelan-pelan.', start: 1.0, end: 2.0}]);
  assert.deepEqual(units.map((unit) => unit.word), ['pelan', 'pelan.']);
  assert.equal(units[0].start, 1.0);
  assert.equal(units[1].end, 2.0);
  assert.equal(units[0].rawIndex, 0);
});

test('shared dictionary resolves the seeded Episode 003-005 artifacts', () => {
  const dictionary = JSON.parse(readFileSync(DEFAULT_DICTIONARY_PATH, 'utf8'));
  const rawWords = [
    {word: 'yang', start: 0.0, end: 0.1},
    {word: 'Gak', start: 0.1, end: 0.2},
    {word: 'diikat.', start: 0.2, end: 0.3},
    {word: 'kopilot', start: 0.4, end: 0.5},
    {word: 'benar-bener', start: 0.6, end: 0.8},
    {word: 'jadikan', start: 0.9, end: 1.0},
    {word: 'tancap', start: 1.1, end: 1.2},
    {word: 'tuas', start: 1.3, end: 1.4},
    {word: 'kemudian', start: 1.5, end: 1.6},
    {word: 'Satu', start: 1.7, end: 1.8},
    {word: 'ketukan', start: 1.9, end: 2.0},
    {word: 'kemudian', start: 2.1, end: 2.2},
    {word: 'Gapernah', start: 2.3, end: 2.5},
    {word: 'kop', start: 2.6, end: 2.7},
    {word: 'pilot.', start: 2.7, end: 2.8},
  ];
  const script = 'yang nggak diikat. copilot bener-bener jadiin tancep tuas kemudi. Satu ketukan kemudian. Nggak pernah copilot.';
  const result = reconcile(rawWords, script, dictionary);
  assert.equal(result.pass, true, `expected no suspects, got ${JSON.stringify(result.suspects)}`);
  const actions = result.reconciliations.map((record) => `${record.action}:${record.heard}`).sort();
  assert.ok(actions.includes('renamed:Gak'));
  assert.ok(actions.includes('renamed:kopilot'));
  assert.ok(actions.includes('renamed:benar'), 'heard "benar-bener" reconciles toward the script "bener-bener"');
  assert.ok(actions.includes('renamed:jadikan'), 'heard "jadikan" reconciles toward the script "jadiin"');
  assert.ok(actions.includes('renamed:tancap'), 'heard "tancap" reconciles toward the script "tancep"');
  assert.ok(actions.includes('split:Gapernah'));
  assert.ok(actions.includes('merged:kop pilot.'), 'merge records carry the heard tokens with their punctuation');
  assert.equal(result.reconciledTokens[9], 'kemudi', 'context-scoped rename applies after "tuas"');
  assert.equal(result.reconciledTokens[12], 'kemudian', 'the script-faithful "kemudian" elsewhere stays untouched');
});

test('a genuinely new ASR deviation escalates as a suspect', () => {
  const dictionary = {renames: [{from: 'gak', to: 'nggak'}], splits: [], merges: []};
  const result = reconcile(
    [{word: 'kunci.', start: 0, end: 0.2}, {word: 'Gak', start: 0.3, end: 0.4}],
    'kunci. nggak.',
    dictionary,
  );
  assert.equal(result.pass, true);
  const novel = reconcile(
    [{word: 'kuncli.', start: 0, end: 0.2}],
    'kunci.',
    dictionary,
  );
  assert.equal(novel.pass, false);
  assert.equal(novel.suspects.length, 1);
  assert.equal(novel.suspects[0].script, 'kunci');
  assert.equal(novel.suspects[0].heard, 'kuncli');
  assert.match(novel.suspects[0].context.script, /kunci/);
});

test('the shared dictionary fully reconciles the real Episode 005 word track (regression)', () => {
  const timing = JSON.parse(readFileSync(join('episodes', '005-sabuk-ketiga', 'narration-investigator-timestamps.json'), 'utf8'));
  const script = readFileSync(join('episodes', '005-sabuk-ketiga', 'narasi.txt'), 'utf8');
  const dictionary = JSON.parse(readFileSync(DEFAULT_DICTIONARY_PATH, 'utf8'));
  const result = reconcile(timing.words, script, dictionary);
  assert.equal(result.pass, true, `Episode 005 suspects after reconciliation: ${JSON.stringify(result.suspects.slice(0, 4))}`);
  assert.ok(result.reconciliations.length >= 19, `expected at least the 19 documented 005 artifacts, got ${result.reconciliations.length}`);
});

test('the shared dictionary fully reconciles the real Episode 004 word track (regression)', () => {
  const timing = JSON.parse(readFileSync(join('episodes', '004-tangan-pilot-kemarin', 'narration-investigator-timestamps.json'), 'utf8'));
  const script = readFileSync(join('episodes', '004-tangan-pilot-kemarin', 'narasi.txt'), 'utf8');
  const dictionary = JSON.parse(readFileSync(DEFAULT_DICTIONARY_PATH, 'utf8'));
  const result = reconcile(timing.words, script, dictionary);
  assert.equal(result.pass, true, `Episode 004 suspects after reconciliation: ${JSON.stringify(result.suspects.slice(0, 4))}`);
  const actions = result.reconciliations.map((record) => record.action);
  assert.ok(actions.includes('split'), 'heard "celahnya" splits against the hyphenated script "CELAH-nya"');
  assert.ok(actions.includes('merged'), 'heard "co pilot"/"kop pilot" merge to "copilot"');
});

test('shared rules repeat splits and merges without stale index consumption', () => {
  const raw = ['Dituas', 'Gak', 'Dituas', 'kop', 'pilot.', 'kop', 'pilot!']
    .map((word, i) => ({word, start: i, end: i + .8}));
  const original = structuredClone(raw);
  const result = applyRules(raw, {
    renames: [{from: 'gak', to: 'nggak', count: 1}],
    splits: [{from: 'dituas', to: ['di', 'tuas'], count: 2}],
    merges: [{from: ['kop', 'pilot'], to: 'copilot', count: 2}],
  });
  assert.deepEqual(result.units.map(unit => unit.word), ['di', 'tuas', 'nggak', 'di', 'tuas', 'copilot.', 'copilot!']);
  assert.deepEqual(result.records.map(record => record.rawIndex), [1, 0, 2, 3, 5]);
  assert.deepEqual(raw, original, 'rule application does not mutate input');
});

test('contextAfter scopes each rule type and absent matches need an explicit count', () => {
  const raw = ['Ikuti', 'Cahayanya', 'ikuti', 'arah', 'Dituas', 'ada', 'Dituas', 'tidak', 'kop', 'pilot', 'ada', 'kop', 'pilot', 'tidak']
    .map((word, i) => ({word, start: i, end: i + .5}));
  const rules = {
    renames: [{from:'ikuti', to:'ikutin', contextAfter:['cahayanya'], count:1}, {from:'missing', to:'ignored'}],
    splits: [{from:'dituas', to:['di','tuas'], contextAfter:['ada'], count:1}],
    merges: [{from:['kop','pilot'], to:'copilot', contextAfter:['ada'], count:1}],
  };
  const {units, records} = applyRules(raw, rules);
  assert.deepEqual(units.map(unit => unit.word), ['ikutin','Cahayanya','ikuti','arah','di','tuas','ada','Dituas','tidak','copilot','ada','kop','pilot','tidak']);
  assert.equal(records.length, 3);
  for (const field of ['renames', 'splits', 'merges']) {
    const mismatch = structuredClone(rules);
    mismatch[field][0].count = 2;
    assert.throws(() => applyRules(raw, mismatch), /expected 2 occurrences, found 1/);
  }
  assert.throws(() => applyRules(raw, {renames:[{from:'missing', to:'ignored', count:1}]}), /expected 1 occurrences, found 0/);
  assert.doesNotThrow(() => applyRules(raw, {splits:[{from:'missing', to:['a','b'], count:0}]}));
});

test('the shared dictionary fully reconciles the original Scenario 006 kamu word track', () => {
  const fixture = join('scripts', 'fixtures', 'scenario06-kamu');
  const words = JSON.parse(readFileSync(join(fixture, 'words.json'), 'utf8'));
  const script = readFileSync(join(fixture, 'narasi.txt'), 'utf8');
  const dictionary = JSON.parse(readFileSync(DEFAULT_DICTIONARY_PATH, 'utf8'));
  const result = reconcile(words, script, dictionary);
  assert.equal(result.pass, true, `Episode 006 suspects after reconciliation: ${JSON.stringify(result.suspects.slice(0, 4))}`);
  assert.equal(result.scriptTokenCount, 241, 'the canonical 241-word script is unchanged');
  assert.equal(result.heardTokenCount, 241, 'number normalization and merged tokens are restored to 241 units');
  const actions = result.reconciliations.map((record) => `${record.action}:${record.heard}`).sort();
  assert.ok(actions.some((action) => action.startsWith('split:20')), 'digit-normalized "dua puluh" splits back into two words');
  assert.ok(actions.some((action) => action.startsWith('split:dikain')), 'merged preposition "di kain" splits back');
  assert.ok(actions.some((action) => action.startsWith('split:luargang')), 'adjacent words "luar gang" split back');
  assert.ok(actions.some((action) => action.startsWith('renamed:2')), 'digit-normalized "tua" is restored before "Bioskop"');
  assert.ok(actions.some((action) => action.startsWith('renamed:Ikuti')), 'final-n elision resolves to "ikutin" before "cahayanya"');
});

test('context-scoped rules keep Episode 005 whole while splitting the Episode 004 token', () => {
  const dictionary = JSON.parse(readFileSync(DEFAULT_DICTIONARY_PATH, 'utf8'));
  const scoped = reconcile(
    [{word: 'Celahnya', start: 0.0, end: 0.4}, {word: 'ada', start: 0.5, end: 0.7}],
    'CELAH-nya ada',
    dictionary,
  );
  assert.deepEqual(scoped.reconciledTokens, ['celah', 'nya', 'ada'], 'scoped split fires with "ada" following');
  const solid = reconcile(
    [{word: 'Celahnya', start: 0.0, end: 0.4}, {word: 'kamu', start: 0.5, end: 0.7}],
    'celahnya kamu',
    dictionary,
  );
  assert.deepEqual(solid.reconciledTokens, ['celahnya', 'kamu'], 'the split stays off without the context');
});
