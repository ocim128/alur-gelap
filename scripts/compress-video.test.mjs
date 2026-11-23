import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {existsSync, mkdtempSync, rmSync, rmdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {compressVideo, planColorConversion, planAudioHandling, measureSilenceIntervals} from './compress-video.mjs';

const available = ['ffmpeg', 'ffprobe'].every(program => spawnSync(program, ['-version'], {stdio: 'ignore'}).status === 0);
const generateSource = (directory, name, extraVideoArgs = [], extraFilters = '') => {
  const input = join(directory, name);
  const result = spawnSync('ffmpeg', ['-v', 'error', '-f', 'lavfi', '-i', `testsrc2=size=96x160:rate=30:duration=1${extraFilters}`, '-f', 'lavfi', '-i', 'sine=frequency=440:duration=1', '-c:v', 'libx264', ...extraVideoArgs, '-c:a', 'aac', input], {encoding: 'utf8'});
  assert.equal(result.status, 0, result.stderr);
  return input;
};

test('color plan converts full-range and foreign-matrix sources explicitly or refuses them', () => {
  assert.equal(planColorConversion({pix_fmt: 'yuv420p', color_range: 'tv', color_space: 'bt709'}).conversion, 'tag-only');
  const full = planColorConversion({pix_fmt: 'yuvj420p', color_space: 'bt709'});
  assert.equal(full.conversion, 'explicit');
  assert.match(full.filter, /in_range=full/);
  assert.match(full.filter, /in_color_matrix=bt709/);
  assert.match(full.filter, /out_range=limited/);
  assert.match(full.filter, /out_color_matrix=bt709/);
  const bt601 = planColorConversion({pix_fmt: 'yuv420p', color_range: 'tv', color_space: 'smpte170m'});
  assert.equal(bt601.conversion, 'explicit');
  assert.match(bt601.filter, /in_range=limited/);
  assert.match(bt601.filter, /in_color_matrix=smpte170m/);
  // Ambiguous/unsupported sources must fail cleanly instead of being tagged unconverted.
  assert.throws(() => planColorConversion({pix_fmt: 'yuvj420p'}), /Ambiguous source color/);
  assert.throws(() => planColorConversion({pix_fmt: 'yuv420p', color_range: 'pc'}), /Ambiguous source color/);
  assert.throws(() => planColorConversion({pix_fmt: 'yuv444p', color_range: 'tv', color_space: 'bt709'}), /Unsupported source pixel format/);
  assert.throws(() => planColorConversion({pix_fmt: 'yuv420p', color_range: 'tv', color_space: 'arib-std-b67'}), /not a supported matrix/);
});

test('audio plan preserves layout by default and compensates explicit changes', () => {
  const stereo = {channels: 2, sample_rate: '48000'};
  const mono = {channels: 1, sample_rate: '48000'};
  const preserved = planAudioHandling(stereo);
  assert.deepEqual(preserved.args, ['-ar', '48000', '-ac', '2']);
  assert.match(preserved.note, /preserved verbatim/);
  const upmix = planAudioHandling(mono, {channels: 2});
  assert.equal(upmix.args.filter(arg => arg === '-ac' || arg === '2').length, 2);
  assert.match(upmix.note, /\+3 LU/);
  assert.ok(upmix.args.includes('-af') && upmix.args.includes('pan=stereo|c0=c0|c1=c0,volume=-3dB'));
  const downmix = planAudioHandling(stereo, {channels: 1});
  assert.ok(downmix.args.includes('pan=mono|c0=0.5*c0+0.5*c1,volume=3dB'));
  assert.throws(() => planAudioHandling(stereo, {channels: 6}), /Unsupported explicit channel change/);
});

test('silence intervals measure RMS and edge peaks and never assert digital zero implicitly', () => {
  const sampleRate = 48000;
  const samples = new Int16Array(sampleRate); // 1 s: 0–0.4 s speech, 0.4–1.0 s silence
  for (let i = 0; i < 0.4 * sampleRate; i++) samples[i] = Math.round(Math.sin(2 * Math.PI * 220 * i / sampleRate) * 12000);
  // Codec-style residue near the interval edges, exact zeros elsewhere.
  samples[Math.round(0.4 * sampleRate) + 5] = 30;
  samples[Math.round(0.95 * sampleRate)] = 20;
  const report = measureSilenceIntervals(samples, sampleRate);
  assert.equal(report.intervals.length, 1);
  const interval = report.intervals[0];
  assert.equal(interval.isDigitalZero, false);
  assert.ok(interval.rmsDbfs < -60, `rms ${interval.rmsDbfs}`);
  assert.ok(interval.edgePeakDbfs > -70, `edge peak ${interval.edgePeakDbfs} must reflect residue`);
  const exact = measureSilenceIntervals(new Int16Array(sampleRate), sampleRate);
  assert.equal(exact.intervals.length, 1);
  assert.equal(exact.intervals[0].isDigitalZero, true);
});

test('balanced delivery is limited-range Rec.709, measured, and never overwrites its source', {skip: !available}, () => {
  const directory = mkdtempSync(join(tmpdir(), 'rec709-check-'));
  const input = generateSource(directory, 'source.mp4');
  const output = join(directory, 'source_compressed.mp4');
  try {
    const result = compressVideo(input, output);
    assert.equal(result.output, output);
    assert.equal(result.colorPlan.conversion, 'tag-only');
    assert.ok(Number.isFinite(result.delivery.loudness.integratedLufs), 'integrated LUFS measured');
    assert.ok(Number.isFinite(result.delivery.loudness.truePeakDbfs), 'true peak measured');
    assert.equal(result.delivery.signalSanity.verdict, 'ok');
    assert.ok(Array.isArray(result.delivery.silence.intervals), 'AAC silence measurement present');
    const probe = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=pix_fmt,color_range,color_space,color_transfer,color_primaries', '-of', 'json', output], {encoding: 'utf8'});
    assert.equal(probe.status, 0, probe.stderr);
    assert.deepEqual(JSON.parse(probe.stdout).streams[0], {pix_fmt: 'yuv420p', color_range: 'tv', color_space: 'bt709', color_transfer: 'bt709', color_primaries: 'bt709'});
    assert.throws(() => compressVideo(input, output), /already exists/);
  } finally {
    rmSync(input, {force: true});
    rmSync(output, {force: true});
    rmdirSync(directory);
  }
});

test('a full-range tagged master is converted to limited-range data, not just retagged', {skip: !available}, () => {
  const directory = mkdtempSync(join(tmpdir(), 'fullrange-check-'));
  const input = generateSource(directory, 'full.mp4', ['-pix_fmt', 'yuv420p', '-color_range', 'pc', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709']);
  const output = join(directory, 'full_compressed.mp4');
  try {
    const result = compressVideo(input, output);
    assert.equal(result.colorPlan.conversion, 'explicit');
    assert.notEqual(result.delivery.signalSanity.verdict, 'fail');
    assert.ok(result.delivery.signalSanity.maxLuma <= 235 + 15, `converted delivery max luma ${result.delivery.signalSanity.maxLuma}`);
  } finally {
    rmSync(input, {force: true});
    rmSync(output, {force: true});
    rmdirSync(directory);
  }
});

test('unsupported pixel formats fail cleanly before any delivery is written', {skip: !available}, () => {
  const directory = mkdtempSync(join(tmpdir(), 'fmt-check-'));
  const input = join(directory, 'yuv444.mp4');
  const output = join(directory, 'yuv444_compressed.mp4');
  try {
    const result = spawnSync('ffmpeg', ['-v', 'error', '-f', 'lavfi', '-i', 'testsrc2=size=96x160:rate=30:duration=0.4', '-c:v', 'libx264', '-pix_fmt', 'yuv444p', input], {encoding: 'utf8'});
    assert.equal(result.status, 0, result.stderr);
    assert.throws(() => compressVideo(input, output), /Unsupported source pixel format "yuv444p"/);
    assert.equal(existsSync(output), false, 'no delivery written for unsupported input');
  } finally {
    rmSync(input, {force: true});
    rmSync(output, {force: true});
    rmdirSync(directory);
  }
});
