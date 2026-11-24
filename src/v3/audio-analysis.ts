import {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

export type DecodedWaveform = {
  durationSec: number;
  bars: number[];
  framePeaks: number[];
};

const waveformCache = new Map<string, Promise<DecodedWaveform>>();

const FALLBACK_BARS = Array.from({length: 24}, (_, i) => 0.25 + 0.55 * Math.abs(Math.sin((i + 1) * 0.72)));

function computeBuckets(samples: Float32Array, count: number): number[] {
  if (samples.length === 0 || count <= 0) return FALLBACK_BARS;
  const bucketSize = Math.max(1, Math.floor(samples.length / count));
  const raw: number[] = [];
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

async function decodeWaveformFromUrl(url: string, fps: number, barCount: number): Promise<DecodedWaveform> {
  if (typeof window === 'undefined' || (typeof AudioContext === 'undefined' && typeof (window as unknown as {webkitAudioContext?: typeof AudioContext}).webkitAudioContext === 'undefined')) {
    return {durationSec: 3, bars: FALLBACK_BARS.slice(0, barCount), framePeaks: Array.from({length: Math.round(3 * fps)}, () => 0.5)};
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch audio waveform source ${url}: HTTP ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const AudioCtx = window.AudioContext ?? (window as unknown as {webkitAudioContext: typeof AudioContext}).webkitAudioContext;
  const ctx = new AudioCtx();
  try {
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
    const channelData = audioBuffer.getChannelData(0);
    const durationSec = audioBuffer.duration;
    const totalFrames = Math.max(1, Math.ceil(durationSec * fps));
    return {
      durationSec,
      bars: computeBuckets(channelData, barCount),
      framePeaks: computeBuckets(channelData, totalFrames),
    };
  } finally {
    await ctx.close().catch(() => undefined);
  }
}

export function loadWaveform(src: string, fps: number, barCount = 24): Promise<DecodedWaveform> {
  const key = `${src}|${fps}|${barCount}`;
  let pending = waveformCache.get(key);
  if (!pending) {
    pending = decodeWaveformFromUrl(staticFile(src), fps, barCount);
    waveformCache.set(key, pending);
  }
  return pending;
}

export function useAudioWaveform(src: string, fps: number, barCount = 24): DecodedWaveform {
  const [data, setData] = useState<DecodedWaveform | null>(null);

  useEffect(() => {
    let active = true;
    const handle = delayRender(`Decode voice note waveform: ${src}`);
    loadWaveform(src, fps, barCount)
      .then((decoded) => {
        if (active) setData(decoded);
        continueRender(handle);
      })
      .catch(() => {
        if (active) {
          setData({
            durationSec: 3,
            bars: FALLBACK_BARS.slice(0, barCount),
            framePeaks: Array.from({length: Math.round(3 * fps)}, () => 0.5),
          });
        }
        continueRender(handle);
      });
    return () => {
      active = false;
    };
  }, [src, fps, barCount]);

  return (
    data ?? {
      durationSec: 3,
      bars: FALLBACK_BARS.slice(0, barCount),
      framePeaks: Array.from({length: Math.round(3 * fps)}, () => 0.5),
    }
  );
}
