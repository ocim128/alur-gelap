export type StudioTiming = {
  blackoutFrame: number;
  rewindFrame?: number;
  rewindFrames?: number;
  branchRewinds?: {startFrame: number; endFrame: number}[];
  [cue: string]: unknown;
};

export function studioTimingError(timing: StudioTiming | undefined, duration: number, fps: number): string | null;
