import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../src/studio-v2-timeline.ts', import.meta.url), 'utf8');
const javascript = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022}}).outputText;
const {validateScenes, sceneAtFrame, splitCaptionsAtCuts} = await import(`data:text/javascript;base64,${Buffer.from(javascript).toString('base64')}`);
const scenes = [{id: 'A', at: 0, plate: 'a.webp'}, {id: 'B', at: 30, plate: 'b.webp'}, {id: 'C', at: 60, plate: 'c.webp'}];

test('scene selection changes at the exact cut and holds until the composition end', () => {
  validateScenes(scenes, 90);
  assert.deepEqual([sceneAtFrame(scenes, 90, 29).scene.id, sceneAtFrame(scenes, 90, 30).scene.id, sceneAtFrame(scenes, 90, 89).endFrame], ['A', 'B', 90]);
  assert.throws(() => validateScenes([{...scenes[0], at: 1}], 90), /frame 0/);
  assert.throws(() => validateScenes([scenes[0], {...scenes[1], at: 0}], 90), /ordered/);
});

test('captions crossing cuts split on measured words without repeating or dropping text', () => {
  const captions = [{startMs: 800, endMs: 2200, speaker: 'PENCULIK', words: [
    {text: 'pelan-pelan', startMs: 800, endMs: 950}, {text: 'jangan', startMs: 1000, endMs: 1300}, {text: 'bergerak', startMs: 2050, endMs: 2200},
  ]}];
  const result = splitCaptionsAtCuts(captions, scenes, 30);
  assert.deepEqual(result.map(c => [c.startMs, c.endMs, c.speaker, c.words.map(w => w.text).join(' ')]), [
    [800, 1000, 'PENCULIK', 'pelan-pelan'], [1000, 2000, 'PENCULIK', 'jangan'], [2000, 2200, 'PENCULIK', 'bergerak'],
  ]);
  const noCrossing = [{startMs: 0, endMs: 1000, words: [{text: 'dihantam'}]}];
  assert.deepEqual(splitCaptionsAtCuts(noCrossing, scenes, 30), noCrossing);
});

test('caption splitting refuses to guess missing word timing or cut through a word', () => {
  assert.throws(() => splitCaptionsAtCuts([{startMs: 900, endMs: 1100, words: [{text: 'jangan'}]}], scenes, 30), /requires measured word timings/);
  assert.throws(() => splitCaptionsAtCuts([{startMs: 900, endMs: 1100, words: [{text: 'jangan', startMs: 950, endMs: 1050}]}], scenes, 30), /crosses a panel cut/);
});

test('caption cut times use the supplied frame rate', () => {
  const shots = [scenes[0], {...scenes[1], at: 24}];
  const caption = [{startMs: 900, endMs: 1100, words: [{text: 'ya', startMs: 900, endMs: 1000}, {text: 'tidak', startMs: 1000, endMs: 1100}]}];
  assert.deepEqual(splitCaptionsAtCuts(caption, shots, 24).map(c => c.endMs), [1000, 1100]);
});
