export type DecodedWaveform = {
  durationSec: number;
  bars: number[];
  framePeaks: number[];
};

export declare function computeBuckets(samples: Float32Array, count: number): number[];

export declare function decodeWaveformFromUrl(
  url: string,
  fps: number,
  barCount?: number,
  deps?: {
    fetch?: typeof fetch;
    AudioContext?: new () => {
      decodeAudioData: (buffer: ArrayBuffer) => Promise<{duration: number; getChannelData: (channel: number) => Float32Array}>;
      close?: () => Promise<void>;
    };
  },
): Promise<DecodedWaveform>;
