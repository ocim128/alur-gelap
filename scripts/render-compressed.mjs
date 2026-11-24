import {spawnSync} from 'node:child_process';
import {existsSync, mkdirSync, renameSync, rmSync} from 'node:fs';
import {createRequire} from 'node:module';
import {dirname, extname, join, resolve} from 'node:path';
import {compressVideo} from './compress-video.mjs';

// Usage: npm run render -- <composition-id> <delivery.mp4> [Remotion options] [--keep-master]
// `--keep-master` retains the intermediate render master next to the delivery (for
// revisions that will recompress later). Any failed intermediate is renamed
// `*.render-master.failed.mp4` so a broken render can never be mistaken for a
// reusable master.
const [composition, outputArg, ...options] = process.argv.slice(2);
const keepMaster = options.includes('--keep-master');
// A positional spelling survives npm argument filtering on Windows PowerShell.
const isMasterGainOption = option => /^(--)?audio-master-gain-db=/.test(option);
const masterGainOption = options.find(isMasterGainOption);
const remotionOptions = options.filter(option => option !== '--keep-master' && !isMasterGainOption(option));
if (!composition || !outputArg || extname(outputArg).toLowerCase() !== '.mp4') {
  console.error('Usage: npm run render -- <composition-id> <delivery.mp4> [Remotion options] [--keep-master]');
  process.exitCode = 1;
} else {
  const output = resolve(outputArg);
  const master = `${output.slice(0, -4)}.render-master.mp4`;
  try {
    if (existsSync(output) || existsSync(master)) throw new Error('Delivery or intermediate already exists; choose a fresh output path');
    mkdirSync(dirname(output), {recursive: true});
    const require = createRequire(import.meta.url);
    const cli = join(dirname(require.resolve('@remotion/cli/package.json')), 'remotion-cli.js');
    const result = spawnSync(process.execPath, [cli, 'render', 'src/index.ts', composition, master, ...remotionOptions], {stdio: 'inherit'});
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(`Remotion failed (${result.status})`);
    // The delivery step enforces explicit limited-range Rec.709 conversion/tags and
    // yuv420p, and measures loudness/color/silence on the compressed delivery.
    const audio = masterGainOption ? {masterGainDb: Number(masterGainOption.split('=')[1])} : undefined;
    compressVideo(master, output, {audio});
    if (keepMaster) console.log(`Master retained for revision work: ${master}`);
    else rmSync(master);
  } catch (error) {
    if (existsSync(master)) {
      const failed = `${master.slice(0, -4)}.render-master.failed.mp4`;
      if (existsSync(failed)) rmSync(failed);
      renameSync(master, failed);
      console.error(`Failed intermediate tagged: ${failed}`);
    }
    console.error(error.message);
    process.exitCode = 1;
  }
}
