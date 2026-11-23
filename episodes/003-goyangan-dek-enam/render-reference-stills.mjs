// Render lossless PNG reference stills of a composition at chosen frames.
// The stills are the tag-independent RGB reference for the Rec.709 pixel proofs:
// a video frame is decoded to RGB under an explicit range/matrix hypothesis and
// compared with the still the same renderer produced for that frame.
//
// Usage: node episodes/003-goyangan-dek-enam/render-reference-stills.mjs <out-dir> <frame,frame,...> [composition-id]
import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..', '..');
const [outArg, frameArg, compositionId = 'Skenario03GoyanganDekEnam'] = process.argv.slice(2);
if (!outArg || !frameArg) {
  console.error('Usage: render-reference-stills.mjs <out-dir> <frame,frame,...> [composition-id]');
  process.exit(1);
}
const outDir = resolve(root, outArg);
const frames = [...new Set(frameArg.split(',').map(Number))].sort((a, b) => a - b);
if (!frames.length || frames.some(Number.isNaN)) throw new Error(`Invalid frame list: ${frameArg}`);
if (existsSync(outDir)) throw new Error(`Reference directory already exists: ${outDir}; choose a fresh name`);

// Resolve the entry point the same way the Remotion CLI does for `src/index.ts`.
const serveUrl = await bundle({entryPoint: resolve(root, 'src/index.ts'), onProgress: () => {}});
const composition = await selectComposition({serveUrl, id: compositionId, inputProps: {}});
if (frames.some(frame => frame < 0 || frame >= composition.durationInFrames)) {
  throw new Error(`Frame outside 0..${composition.durationInFrames - 1}`);
}
mkdirSync(outDir, {recursive: true});
const stills = [];
for (const frame of frames) {
  const output = resolve(outDir, `frame-${String(frame).padStart(5, '0')}.png`);
  if (existsSync(output)) throw new Error(`Refusing to overwrite ${output}`);
  await renderStill({composition, serveUrl, output, frame, imageFormat: 'png', inputProps: {}, logLevel: 'error'});
  const bytes = readFileSync(output);
  stills.push({frame, file: `frame-${String(frame).padStart(5, '0')}.png`, bytes: statSync(output).size,
    sha256: createHash('sha256').update(bytes).digest('hex'), pngSignature: bytes.subarray(1, 4).toString('ascii') === 'PNG'});
}
const record = {
  schemaVersion: 1,
  compositionId,
  composition: {id: composition.id, width: composition.width, height: composition.height, fps: composition.fps, durationInFrames: composition.durationInFrames},
  remotion: JSON.parse(readFileSync(resolve(root, 'node_modules/remotion/package.json'), 'utf8')).version,
  imageFormat: 'png',
  node: process.version,
  stills,
};
writeFileSync(resolve(outDir, 'index.json'), JSON.stringify(record, null, 2) + '\n', {flag: 'wx'});
console.log(JSON.stringify(record, null, 2));
