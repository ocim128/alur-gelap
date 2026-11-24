import {useEffect, useState} from 'react';
import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';
import {decodeWaveformFromUrl, type DecodedWaveform} from './audio-analysis-core.mjs';

export type {DecodedWaveform};

const waveformCache = new Map<string, Promise<DecodedWaveform>>();

export function loadWaveform(src: string, fps: number, barCount = 24): Promise<DecodedWaveform> {
  const key = `${src}|${fps}|${barCount}`;
  let pending = waveformCache.get(key);
  if (!pending) {
    pending = decodeWaveformFromUrl(staticFile(src), fps, barCount);
    waveformCache.set(key, pending);
  }
  return pending;
}

/**
 * Decodes real voice-note audio duration and waveform bars before allowing Remotion to render.
 * Fails loudly via cancelRender + thrown error if fetch or WebAudio decoding fails (never
 * falls back to a fabricated 3-second duration that silently truncates playback).
 */
export function useAudioWaveform(src: string, fps: number, barCount = 24): DecodedWaveform | null {
  const [data, setData] = useState<DecodedWaveform | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    const handle = delayRender(`Decode voice note waveform: ${src}`);
    loadWaveform(src, fps, barCount)
      .then((decoded) => {
        if (active) setData(decoded);
        continueRender(handle);
      })
      .catch((cause) => {
        const err = cause instanceof Error ? cause : new Error(String(cause));
        if (active) setError(err);
        cancelRender(err);
      });
    return () => {
      active = false;
    };
  }, [src, fps, barCount]);

  if (error) {
    throw error;
  }

  return data;
}
