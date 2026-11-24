import {spawnSync} from 'node:child_process';
import {copyFileSync, existsSync, mkdtempSync, rmSync, rmdirSync, statSync, constants} from 'node:fs';
import {basename, dirname, extname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

// Post-mortem (Episodes 004/005): a master tagged limited-range Rec.709 must have its
// pixels converted first. setparams/tags alone relabel unconverted frames (washed or
// crushed color), so every conversion here is planned explicitly before any tag is set.
const SUPPORTED_PIXEL_FORMATS = new Set(['yuv420p', 'yuvj420p']);
const FULL_RANGE_VALUES = new Set(['pc', 'jpeg', 'full']);
// ffprobe color_space names -> swscale `in_color_matrix` values.
const COLOR_MATRIX_MAP = new Map([
  ['bt709', 'bt709'],
  ['bt601', 'bt601'],
  ['smpte170m', 'smpte170m'],
  ['smpte240m', 'smpte240m'],
  ['bt470bg', 'bt470'],
  ['bt470m', 'bt470'],
  ['bt2020nc', 'bt2020'],
  ['bt2020c', 'bt2020'],
]);
const LIMITED_TAG_FILTER = 'setparams=range=limited:color_primaries=bt709:color_trc=bt709:colorspace=bt709';

function run(command, args, capture = false) {
  const result = spawnSync(command, args, {encoding: 'utf8', stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit'});
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} failed (${result.status}): ${capture ? result.stderr : 'see output above'}`);
  return result.stdout;
}

function probe(file) {
  return JSON.parse(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=codec_type,codec_name,width,height,avg_frame_rate,pix_fmt,color_range,color_space,color_transfer,color_primaries,channels,channel_layout,sample_rate', '-of', 'json', file], true));
}

/**
 * Decide how the source video stream becomes limited-range Rec.709 yuv420p.
 * Returns the pixel filter to run during encoding plus an explicit plan record.
 * Throws (before encoding) on unsupported or ambiguous sources instead of
 * tagging unconverted frames.
 */
export function planColorConversion(videoStream) {
  const pixFmt = videoStream?.pix_fmt ?? '(unknown)';
  if (!SUPPORTED_PIXEL_FORMATS.has(pixFmt)) {
    throw new Error(`Unsupported source pixel format "${pixFmt}": only 8-bit 4:2:0 masters (yuv420p, yuvj420p) are supported. Re-export the master with yuv420p before compressing; the compressor will not relabel unconvertible frames.`);
  }
  const range = videoStream.color_range;
  const fullRange = pixFmt === 'yuvj420p' || FULL_RANGE_VALUES.has(range);
  const rawMatrix = videoStream.color_space;
  const inMatrix = rawMatrix === undefined ? undefined : COLOR_MATRIX_MAP.get(rawMatrix);
  if (rawMatrix !== undefined && inMatrix === undefined) {
    throw new Error(`Ambiguous source color: color_space "${rawMatrix}" is not a supported matrix. Refusing to guess a conversion; re-export the master with an explicit bt709/bt601 colorspace tag.`);
  }
  const needsMatrixConversion = inMatrix !== undefined && inMatrix !== 'bt709';
  if (!fullRange && !needsMatrixConversion) {
    // Data is already limited-range (or conservatively assumed limited when untagged)
    // and already bt709 (or untagged): tagging without pixel conversion is correct.
    return {
      filter: LIMITED_TAG_FILTER,
      conversion: 'tag-only',
      source: {pixFmt, colorRange: range ?? 'unspecified (assumed limited)', colorSpace: rawMatrix ?? 'unspecified (assumed bt709)'},
      note: 'Pixels pass through unchanged; delivery tags describe the existing limited-range bt709 data.',
    };
  }
  if (inMatrix === undefined) {
    throw new Error(`Ambiguous source color: ${pixFmt} with ${fullRange ? 'full' : 'limited'} range and no colorspace tag. A conversion is required, but the input matrix is unknown. Refusing to guess; re-export the master with an explicit bt709/bt601 colorspace tag.`);
  }
  const filter = `scale=in_range=${fullRange ? 'full' : 'limited'}:in_color_matrix=${inMatrix}:out_range=limited:out_color_matrix=bt709,format=yuv420p,${LIMITED_TAG_FILTER}`;
  return {
    filter,
    conversion: 'explicit',
    source: {pixFmt, colorRange: range ?? 'unspecified', colorSpace: rawMatrix},
    note: `Pixels converted ${fullRange ? 'full→limited range' : 'limited range'}, ${inMatrix}→bt709 matrix before any delivery tag is set.`,
  };
}

/**
 * Make audio channel handling explicit. By default the master's channel count and
 * sample rate are preserved verbatim, so a stereo/mono Remotion render can never be
 * silently re-laid-out (a duplicated mono→stereo upmix adds ~+3 LU of integrated
 * loudness under BS.1770 summing). A requested layout change is applied through an
 * explicit filter with documented gain compensation.
 */
export function planAudioHandling(audioStream, requested = {}) {
  if (!audioStream) return {args: [], channels: null, sampleRate: null, note: 'source has no audio stream; delivering video only'};
  const sourceChannels = audioStream.channels;
  const channels = requested.channels ?? sourceChannels;
  const sampleRate = requested.sampleRate ?? Number(audioStream.sample_rate);
  const args = ['-ar', String(sampleRate), '-ac', String(channels)];
  let note;
  if (channels === sourceChannels) {
    note = `channel layout preserved verbatim (${sourceChannels}ch @ ${sampleRate} Hz); no implicit gain change`;
  } else if (sourceChannels === 1 && channels === 2) {
    args.push('-af', 'pan=stereo|c0=c0|c1=c0,volume=-3dB');
    note = 'mono duplicated to stereo with an explicit −3 dB compensation (dual-mono summing would otherwise add ~+3 LU)';
  } else if (sourceChannels === 2 && channels === 1) {
    args.push('-af', 'pan=mono|c0=0.5*c0+0.5*c1,volume=3dB');
    note = 'stereo averaged to mono with an explicit +3 dB compensation (equal-channel loudness reference; integrated loudness is measured on the delivery either way)';
  } else {
    throw new Error(`Unsupported explicit channel change ${sourceChannels}ch → ${channels}ch; preserve the master layout or extend planAudioHandling.`);
  }
  if (requested.masterGainDb !== undefined) {
    const gain = Number(requested.masterGainDb);
    if (!Number.isFinite(gain) || gain < 0 || gain > 12) throw new Error('masterGainDb must be between 0 and 12 dB');
    if (channels !== sourceChannels) throw new Error('masterGainDb requires preserved channel layout');
    // Oversampled limiting before the final AAC encode reduces intersample peaks;
    // the actual compressed file is still measured after encoding.
    args.push('-af', `aresample=192000,volume=${gain}dB,alimiter=limit=0.74:attack=5:release=50:level=disabled:latency=1,aresample=${sampleRate}`);
    note += `; explicit +${gain} dB master gain and oversampled peak limiting`;
  }
  return {args, channels, sampleRate, note};
}

function decodeMono16(file, sampleRate) {
  const proc = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-i', file, '-map', '0:a:0', '-ac', '1', '-ar', String(sampleRate), '-f', 's16le', 'pipe:1'], {encoding: 'buffer', maxBuffer: 512 * 1024 * 1024});
  if (proc.status !== 0 || !proc.stdout?.length) throw new Error(`failed to decode audio for silence measurement: ${proc.stderr}`);
  return new Int16Array(proc.stdout.buffer, proc.stdout.byteOffset, proc.stdout.byteLength / 2);
}

const dbfs = (linear) => 20 * Math.log10(Math.max(linear, 1e-10));

/**
 * Measure silent stretches on a decoded AAC delivery. Intervals are reported with a
 * measured RMS *and* an edge peak (max |sample| near both interval edges, where codec
 * residue shows up first). `isDigitalZero` is measured per interval; AAC decoders
 * essentially never produce exact zeros, so callers must never claim digital zero on
 * AAC without this flag being true.
 */
export function measureSilenceIntervals(samples, sampleRate, {thresholdDbfs = -60, minIntervalSec = 0.08, hopSec = 0.02, edgeSec = 0.02} = {}) {
  const hop = Math.max(1, Math.round(hopSec * sampleRate));
  const minInterval = Math.round(minIntervalSec * sampleRate);
  const edge = Math.max(1, Math.round(edgeSec * sampleRate));
  const quiet = [];
  for (let start = 0; start < samples.length; start += hop) {
    let sum = 0;
    const end = Math.min(samples.length, start + hop);
    for (let i = start; i < end; i++) {
      const v = samples[i] / 32768;
      sum += v * v;
    }
    quiet.push([start, end, dbfs(Math.sqrt(sum / Math.max(1, end - start))) < thresholdDbfs]);
  }
  const intervals = [];
  let current = null;
  for (const [start, end, isQuiet] of quiet) {
    if (isQuiet) {
      if (!current) current = [start, end];
      else current[1] = end;
    } else if (current) {
      intervals.push(current);
      current = null;
    }
  }
  if (current) intervals.push(current);
  return {
    thresholdDbfs,
    intervals: intervals
      .filter(([start, end]) => end - start >= minInterval)
      .map(([start, end]) => {
        let sum = 0;
        let digitalZero = true;
        let edgePeak = 0;
        for (let i = start; i < end; i++) {
          const v = samples[i] / 32768;
          sum += v * v;
          if (samples[i] !== 0) digitalZero = false;
        }
        for (const [from, to] of [[start, Math.min(end, start + edge)], [Math.max(start, end - edge), end]]) {
          for (let i = from; i < to; i++) edgePeak = Math.max(edgePeak, Math.abs(samples[i]));
        }
        return {
          startSec: Math.round((start / sampleRate) * 1000) / 1000,
          endSec: Math.round((end / sampleRate) * 1000) / 1000,
          durationSec: Math.round(((end - start) / sampleRate) * 1000) / 1000,
          rmsDbfs: Math.round(dbfs(Math.sqrt(sum / Math.max(1, end - start))) * 100) / 100,
          edgePeakDbfs: Math.round(dbfs(edgePeak / 32768) * 100) / 100,
          isDigitalZero: digitalZero,
        };
      }),
    note: 'Silence is measured on the decoded AAC with RMS and edge peaks. Lossy audio almost never decodes to exact zeros; never claim digital zero on AAC unless isDigitalZero is true.',
  };
}

function measureLoudness(file) {
  // ebur128 prints its summary to stderr; spawn directly so it is captured.
  const proc = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', file, '-af', 'ebur128=peak=true', '-f', 'null', process.platform === 'win32' ? 'NUL' : '/dev/null'], {encoding: 'utf8', maxBuffer: 64 * 1024 * 1024});
  if (proc.status !== 0) throw new Error(`loudness measurement failed: ${proc.stderr}`);
  const summary = proc.stderr.rsplit ? proc.stderr.rsplit('Summary:', 1).pop() : proc.stderr.split('Summary:').pop();
  const integrated = summary?.match(/I:\s*(-?[\d.]+)\s*LUFS/);
  const peak = summary?.match(/Peak:\s*(-?[\d.]+)\s*dBFS/);
  if (!integrated || !peak) throw new Error(`loudness summary not parseable: ${proc.stderr.slice(-400)}`);
  return {integratedLufs: Number(integrated[1]), truePeakDbfs: Number(peak[1])};
}

/**
 * Read decoded Y samples directly, before any gray conversion or resizing. A
 * gray conversion can expand TV-range 16..235 to 0..255, and a single outlier
 * can be codec ringing, so neither proves that the whole signal is full range.
 * Per-frame excursion rates are a conservative sanity gate, not a legal-range
 * certification or proof of the original source's color space.
 */
export function measureSignalSanity(file, {sampleCount = 12, durationSec, fps = 30} = {}) {
  const video = probe(file).streams.find(stream => stream.codec_type === 'video');
  if (!video || video.pix_fmt !== 'yuv420p' || !video.width || !video.height) {
    throw new Error('Signal sanity requires an 8-bit yuv420p video with known dimensions');
  }
  if (!Number.isFinite(durationSec) || durationSec <= 0 || !Number.isFinite(fps) || fps <= 0 || !Number.isInteger(sampleCount) || sampleCount <= 0) {
    throw new Error('Signal sanity requires positive duration, fps and integer sample count');
  }
  const totalFrames = Math.max(1, Math.round(durationSec * fps));
  const stride = Math.max(1, Math.floor(totalFrames / sampleCount));
  const frameSize = video.width * video.height;
  const proc = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-i', file, '-vf', `select='not(mod(n\\,${stride}))',extractplanes=y`, '-fps_mode', 'vfr', '-frames:v', String(sampleCount), '-pix_fmt', 'gray', '-f', 'rawvideo', 'pipe:1'], {encoding: 'buffer', maxBuffer: frameSize * sampleCount + 1024 * 1024});
  if (proc.status !== 0 || !proc.stdout?.length) throw new Error(`signal sanity decode failed: ${proc.stderr}`);
  if (proc.stdout.length % frameSize !== 0) throw new Error('signal sanity decoded an incomplete Y frame');
  const frames = proc.stdout.length / frameSize;
  if (frames !== Math.min(sampleCount, Math.ceil(totalFrames / stride))) throw new Error(`signal sanity expected sampled frames but decoded ${frames}`);
  let min = 255;
  let max = 0;
  let below = 0, above = 0, severe = 0;
  const perFrame = [];
  for (let frame = 0; frame < frames; frame++) {
    let frameBelow = 0, frameAbove = 0, frameSevere = 0;
    for (let i = frame * frameSize; i < (frame + 1) * frameSize; i++) {
      const y = proc.stdout[i];
      min = Math.min(min, y);
      max = Math.max(max, y);
      if (y < 16) frameBelow++;
      if (y > 235) frameAbove++;
      if (y <= 4 || y >= 251) frameSevere++;
    }
    below += frameBelow; above += frameAbove; severe += frameSevere;
    perFrame.push({frame: frame * stride, below16: frameBelow, above235: frameAbove, severe: frameSevere});
  }
  // Conservative review thresholds per sampled frame. They are policy, not a
  // mathematical determination of whether data was mislabeled as full range.
  const failed = perFrame.some(f => f.severe / frameSize >= 0.01 || (f.below16 + f.above235) / frameSize >= 0.05);
  return {
    sampledFrames: frames,
    pixelsPerFrame: frameSize,
    minLuma: min,
    maxLuma: max,
    below16: below,
    above235: above,
    severe,
    perFrame,
    thresholds: {severeCodes: '0-4 or 251-255', severeFractionPerFrame: 0.01, outsideNominalFractionPerFrame: 0.05},
    verdict: failed ? 'fail' : below || above ? 'warning' : 'ok',
    note: 'Direct decoded Y samples; any out-of-range values are reported. Failure means at least 1% severe or 5% outside 16–235 in a sampled frame, requiring review; it does not prove full-range mislabeling. Sampling cannot certify the whole video.',
  };
}

export function compressVideo(sourcePath, outputPath, options = {}) {
  const source = resolve(sourcePath);
  if (!statSync(source).isFile()) throw new Error('Input must be a video file');
  const extension = extname(source);
  const output = resolve(outputPath ?? join(dirname(source), `${basename(source, extension)}_compressed.mp4`));
  if (source === output || existsSync(output)) throw new Error(`Output already exists or matches input: ${output}`);
  const before = probe(source);
  const inputVideo = before.streams.find(stream => stream.codec_type === 'video');
  const inputAudio = before.streams.find(stream => stream.codec_type === 'audio');
  if (!inputVideo) throw new Error('Input has no video stream');
  // Plan every transformation explicitly and fail before encoding on anything
  // ambiguous (unsupported pixel formats, unknown color matrices, layout changes).
  const colorPlan = planColorConversion(inputVideo);
  const audioPlan = planAudioHandling(inputAudio, options.audio);
  const staging = mkdtempSync(join(dirname(output), '.compression-'));
  const temporary = join(staging, 'delivery.mp4');
  try {
    // ShortZ's balanced CRF/audio settings, with the planned conversion applied
    // before the limited-range Rec.709 delivery tags are set.
    run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', source, '-map', '0:v:0', '-map', '0:a:0?', '-vf', colorPlan.filter, '-c:v', 'libx264', '-preset', 'medium', '-crf', '28', '-pix_fmt', 'yuv420p', '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-c:a', 'aac', '-b:a', '128k', ...audioPlan.args, '-movflags', '+faststart', temporary]);
    const after = probe(temporary);
    const video = after.streams.find(stream => stream.codec_type === 'video');
    const audio = after.streams.find(stream => stream.codec_type === 'audio');
    const secondsBefore = Number(before.format.duration);
    const secondsAfter = Number(after.format.duration);
    if (!video || video.codec_name !== 'h264' || video.pix_fmt !== 'yuv420p' || video.color_range !== 'tv' || video.color_space !== 'bt709' || video.color_primaries !== 'bt709' || video.color_transfer !== 'bt709' || video.width !== inputVideo.width || video.height !== inputVideo.height || video.avg_frame_rate !== inputVideo.avg_frame_rate || (inputAudio && audio?.codec_name !== 'aac') || !Number.isFinite(secondsBefore) || !Number.isFinite(secondsAfter) || Math.abs(secondsBefore - secondsAfter) > 0.1) {
      throw new Error(`Compressed output failed stream or duration verification (in: ${JSON.stringify({pix_fmt: inputVideo.pix_fmt, color_range: inputVideo.color_range, dims: `${inputVideo.width}x${inputVideo.height}`, fps: inputVideo.avg_frame_rate, duration: secondsBefore})}, out: ${JSON.stringify(video ? {pix_fmt: video.pix_fmt, color_range: video.color_range, color_space: video.color_space, dims: `${video.width}x${video.height}`, fps: video.avg_frame_rate} : null)}, audio: ${JSON.stringify(audio ? audio.codec_name : null)}, out duration: ${secondsAfter})`);
    }
    const fps = Number(video.avg_frame_rate.split('/').reduce((a, b) => Number(a) / Number(b)));
    const loudness = measureLoudness(temporary);
    const signalSanity = measureSignalSanity(temporary, {durationSec: secondsAfter, fps: Number.isFinite(fps) && fps > 0 ? fps : 30});
    if (signalSanity.verdict === 'fail') {
      throw new Error(`Delivery fails raw-Y signal sanity: a sampled frame exceeds the excursion thresholds; review the source and conversion. Delivery not written. ${JSON.stringify(signalSanity)}`);
    }
    const silence = inputAudio ? measureSilenceIntervals(decodeMono16(temporary, audioPlan.sampleRate ?? 48000), audioPlan.sampleRate ?? 48000) : {thresholdDbfs: null, intervals: [], note: 'no audio stream'};
    copyFileSync(temporary, output, constants.COPYFILE_EXCL);
    console.log(`Compressed: ${output} (${(statSync(source).size / 1048576).toFixed(2)} → ${(statSync(output).size / 1048576).toFixed(2)} MiB)`);
    console.log(`Color plan: ${colorPlan.conversion} — ${colorPlan.note}`);
    if (inputAudio) console.log(`Audio plan: ${audioPlan.note}`);
    console.log(`Delivery measurement: ${JSON.stringify({loudness, signalSanity, silenceIntervals: silence.intervals.length})}`);
    return {output, colorPlan, audioPlan, delivery: {loudness, signalSanity, silence}};
  } finally {
    rmSync(temporary, {force: true});
    rmdirSync(staging);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.length !== 3) {
    console.error('Usage: npm run compress -- <master.mp4>');
    process.exitCode = 1;
  } else {
    try { compressVideo(process.argv[2]); } catch (error) { console.error(error.message); process.exitCode = 1; }
  }
}
