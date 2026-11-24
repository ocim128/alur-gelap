/**
 * Core audio waveform decoder for Studio v3 voice notes.
 * Fails loudly on fetch/decode/AudioContext failures rather than silently
 * falling back to a fabricated 3-second duration that truncates playback.
 */

export function computeBuckets(samples, count) {
  if (!samples || samples.length === 0 || count <= 0) {
    throw new Error(`Cannot compute waveform buckets from empty PCM buffer (length=${samples?.length ?? 0}, count=${count})`);
  }
  const bucketSize = Math.max(1, Math.floor(samples.length / count));
  const raw = [];
  let maxRms = 0;
  for (let i = 0; i < count; i++) {
    const start = i * bucketSize;
    const end = i === count - 1 ? samples.length : Math.min(samples.length, start + bucketSize);
    let sumSq = 0;
    for (let j = start; j < end; j++) {
      const value = samples[j];
      sumSq += value * value;
    }
    const rms = end > start ? Math.sqrt(sumSq / (end - start)) : 0;
    raw.push(rms);
    if (rms > maxRms) maxRms = rms;
  }
  const normalizer = maxRms > 1e-4 ? maxRms : 1;
  return raw.map((rms) => Math.max(0.14, Math.min(1, rms / normalizer)));
}

export async function decodeWaveformFromUrl(url, fps, barCount = 24, deps = {}) {
  const fetchFn = deps.fetch ?? globalThis.fetch;
  const AudioCtx =
    deps.AudioContext ??
    (typeof window !== 'undefined'
      ? (window.AudioContext ?? window.webkitAudioContext)
      : globalThis.AudioContext);

  if (typeof AudioCtx !== 'function') {
    throw new Error(`AudioContext is unavailable; cannot decode voice note waveform for ${url}`);
  }
  if (typeof fetchFn !== 'function') {
    throw new Error(`fetch is unavailable; cannot load voice note waveform for ${url}`);
  }

  const response = await fetchFn(url);
  if (!response || !response.ok) {
    throw new Error(`Failed to fetch audio waveform source ${url}: HTTP ${response?.status ?? 'unknown'}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const ctx = new AudioCtx();
  try {
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
    const durationSec = audioBuffer?.duration;
    if (!Number.isFinite(durationSec) || durationSec <= 0) {
      throw new Error(`Decoded audio waveform for ${url} has invalid duration (${durationSec})`);
    }
    const channelData = audioBuffer.getChannelData(0);
    const totalFrames = Math.max(1, Math.ceil(durationSec * fps));
    return {
      durationSec,
      bars: computeBuckets(channelData, barCount),
      framePeaks: computeBuckets(channelData, totalFrames),
    };
  } catch (cause) {
    const detail = cause instanceof Error ? cause.message : String(cause);
    throw new Error(`Failed to decode audio waveform for ${url}: ${detail}`, {cause});
  } finally {
    if (typeof ctx.close === 'function') {
      await ctx.close().catch(() => undefined);
    }
  }
}
