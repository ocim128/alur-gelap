/** Validate frame-based player timing; return a message suitable for validator and player. */
export function studioTimingError(timing, duration, fps) {
  if (!Number.isInteger(duration) || duration <= 0 || !Number.isFinite(fps) || fps <= 0) return 'invalid duration/fps';
  if (!timing || !Number.isInteger(timing.blackoutFrame) || timing.blackoutFrame < 0 || timing.blackoutFrame >= duration) return 'invalid blackout frame';
  if (timing.rewindFrames !== undefined && timing.rewindFrame === undefined) return 'rewind duration requires a rewind frame';
  if (timing.rewindFrame !== undefined) {
    const length = timing.rewindFrames ?? Math.max(1, Math.round(fps * 0.4));
    if (!Number.isInteger(timing.rewindFrame) || timing.rewindFrame < 0 || !Number.isInteger(length) || length <= 0 || timing.rewindFrame + length > timing.blackoutFrame) return 'invalid branchRewind interval';
  }
  return null;
}
