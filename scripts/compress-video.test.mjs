import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdtempSync, rmSync, rmdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {compressVideo} from './compress-video.mjs';

const available = ['ffmpeg', 'ffprobe'].every(program => spawnSync(program, ['-version'], {stdio: 'ignore'}).status === 0);
test('balanced delivery is limited-range Rec.709 and never overwrites its source', {skip: !available}, () => {
  const directory = mkdtempSync(join(tmpdir(), 'rec709-check-'));
  const input = join(directory, 'source.mp4');
  const output = join(directory, 'source_compressed.mp4');
  try {
    const source = spawnSync('ffmpeg', ['-v', 'error', '-f', 'lavfi', '-i', 'testsrc2=size=96x160:rate=30:duration=1', '-f', 'lavfi', '-i', 'sine=frequency=440:duration=1', '-c:v', 'libx264', '-c:a', 'aac', input], {encoding: 'utf8'});
    assert.equal(source.status, 0, source.stderr);
    assert.equal(compressVideo(input), output);
    const probe = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=pix_fmt,color_range,color_space,color_transfer,color_primaries', '-of', 'json', output], {encoding: 'utf8'});
    assert.equal(probe.status, 0, probe.stderr);
    assert.deepEqual(JSON.parse(probe.stdout).streams[0], {pix_fmt: 'yuv420p', color_range: 'tv', color_space: 'bt709', color_transfer: 'bt709', color_primaries: 'bt709'});
    assert.throws(() => compressVideo(input), /already exists/);
  } finally {
    rmSync(input, {force: true});
    rmSync(output, {force: true});
    rmdirSync(directory);
  }
});
