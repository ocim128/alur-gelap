/** Validate frame-based player timing; return a message suitable for validator and player. */
export function studioTimingError(timing, duration, fps) {
  if (!Number.isInteger(duration) || duration <= 0 || !Number.isFinite(fps) || fps <= 0) return 'invalid duration/fps';
  if (!timing || !Number.isInteger(timing.blackoutFrame) || timing.blackoutFrame < 0 || timing.blackoutFrame >= duration) return 'invalid blackout frame';
  if (timing.branchRewinds !== undefined) {
    if (timing.rewindFrame !== undefined || timing.rewindFrames !== undefined) return 'branchRewinds cannot be combined with single-rewind timing';
    if (!Array.isArray(timing.branchRewinds) || timing.branchRewinds.length === 0) return 'branchRewinds must be a nonempty array';
    for (const interval of timing.branchRewinds) {
      if (!Number.isInteger(interval?.startFrame) || !Number.isInteger(interval?.endFrame) ||
          interval.startFrame < 0 || interval.endFrame <= interval.startFrame || interval.endFrame > timing.blackoutFrame) {
        return 'invalid branchRewinds interval';
      }
    }
    const ordered = [...timing.branchRewinds].sort((a, b) => a.startFrame - b.startFrame);
    if (ordered.some((interval, index) => index > 0 && interval.startFrame < ordered[index - 1].endFrame)) return 'branchRewinds intervals overlap';
  }
  if (timing.rewindFrames !== undefined && timing.rewindFrame === undefined) return 'rewind duration requires a rewind frame';
  if (timing.rewindFrame !== undefined) {
    const length = timing.rewindFrames ?? Math.max(1, Math.round(fps * 0.4));
    if (!Number.isInteger(timing.rewindFrame) || timing.rewindFrame < 0 || !Number.isInteger(length) || length <= 0 || timing.rewindFrame + length > timing.blackoutFrame) return 'invalid branchRewind interval';
  }
  return null;
}
