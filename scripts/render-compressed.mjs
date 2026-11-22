import {spawnSync} from 'node:child_process';
import {existsSync, mkdirSync, rmSync} from 'node:fs';
import {createRequire} from 'node:module';
import {dirname, extname, join, resolve} from 'node:path';
import {compressVideo} from './compress-video.mjs';

const [composition, outputArg, ...options] = process.argv.slice(2);
if (!composition || !outputArg || extname(outputArg).toLowerCase() !== '.mp4') {
  console.error('Usage: npm run render -- <composition-id> <delivery.mp4> [Remotion options]');
  process.exitCode = 1;
} else {
  const output = resolve(outputArg);
  const master = `${output.slice(0, -4)}.render-master.mp4`;
  try {
    if (existsSync(output) || existsSync(master)) throw new Error('Delivery or intermediate already exists; choose a fresh output path');
    mkdirSync(dirname(output), {recursive: true});
    const require = createRequire(import.meta.url);
    const cli = join(dirname(require.resolve('@remotion/cli/package.json')), 'remotion-cli.js');
    const result = spawnSync(process.execPath, [cli, 'render', 'src/index.ts', composition, master, ...options], {stdio: 'inherit'});
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(`Remotion failed (${result.status}); intermediate retained if present: ${master}`);
    // The delivery step enforces limited-range Rec.709 metadata and yuv420p.
    compressVideo(master, output);
    rmSync(master);
  } catch (error) {
    console.error(`${error.message}\nAny rendered intermediate is retained at ${master}`);
    process.exitCode = 1;
  }
}
