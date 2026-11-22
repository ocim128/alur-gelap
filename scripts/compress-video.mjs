import {spawnSync} from 'node:child_process';
import {copyFileSync, existsSync, mkdtempSync, rmSync, rmdirSync, statSync, constants} from 'node:fs';
import {basename, dirname, extname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

function run(command, args, capture = false) {
  const result = spawnSync(command, args, {encoding: 'utf8', stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit'});
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} failed (${result.status}): ${capture ? result.stderr : 'see output above'}`);
  return result.stdout;
}

function probe(file) {
  return JSON.parse(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=codec_type,codec_name,width,height,avg_frame_rate,pix_fmt,color_range,color_space,color_transfer,color_primaries', '-of', 'json', file], true));
}

export function compressVideo(sourcePath, outputPath) {
  const source = resolve(sourcePath);
  if (!statSync(source).isFile()) throw new Error('Input must be a video file');
  const extension = extname(source);
  const output = resolve(outputPath ?? join(dirname(source), `${basename(source, extension)}_compressed.mp4`));
  if (source === output || existsSync(output)) throw new Error(`Output already exists or matches input: ${output}`);
  const before = probe(source);
  const inputVideo = before.streams.find(stream => stream.codec_type === 'video');
  const inputAudio = before.streams.find(stream => stream.codec_type === 'audio');
  if (!inputVideo) throw new Error('Input has no video stream');
  const staging = mkdtempSync(join(dirname(output), '.compression-'));
  const temporary = join(staging, 'delivery.mp4');
  try {
    // ShortZ's balanced CRF/audio settings, with explicit limited-range Rec.709 delivery tags.
    run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', source, '-map', '0:v:0', '-map', '0:a:0?', '-vf', 'setparams=range=limited:color_primaries=bt709:color_trc=bt709:colorspace=bt709', '-c:v', 'libx264', '-preset', 'medium', '-crf', '28', '-pix_fmt', 'yuv420p', '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', temporary]);
    const after = probe(temporary);
    const video = after.streams.find(stream => stream.codec_type === 'video');
    const audio = after.streams.find(stream => stream.codec_type === 'audio');
    const secondsBefore = Number(before.format.duration);
    const secondsAfter = Number(after.format.duration);
    if (!video || video.codec_name !== 'h264' || video.pix_fmt !== 'yuv420p' || video.color_range !== 'tv' || video.color_space !== 'bt709' || video.color_primaries !== 'bt709' || video.color_transfer !== 'bt709' || video.width !== inputVideo.width || video.height !== inputVideo.height || video.avg_frame_rate !== inputVideo.avg_frame_rate || (inputAudio && audio?.codec_name !== 'aac') || !Number.isFinite(secondsBefore) || !Number.isFinite(secondsAfter) || Math.abs(secondsBefore - secondsAfter) > 0.1) {
      throw new Error('Compressed output failed stream or duration verification');
    }
    copyFileSync(temporary, output, constants.COPYFILE_EXCL);
    console.log(`Compressed: ${output} (${(statSync(source).size / 1048576).toFixed(2)} → ${(statSync(output).size / 1048576).toFixed(2)} MiB)`);
    return output;
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
