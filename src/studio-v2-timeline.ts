export type StudioScene = {
  id: string;
  at: number;
  plate: string;
  atCue?: string;
  camera: {from: {scale: number; x: number; y: number}; to: {scale: number; x: number; y: number}};
};

export type StudioCaption = {
  startMs: number;
  endMs: number;
  speaker?: string | null;
  words: {text: string; startMs?: number; endMs?: number; color?: string}[];
};

/** Frame positions use the composition timeline; captions use milliseconds on that same timeline. */
export function validateScenes(scenes: StudioScene[], duration: number): void {
  if (!Number.isInteger(duration) || duration < 1 || !scenes.length || scenes[0].at !== 0) throw new Error('Scenes must start at frame 0 and have a positive integer duration');
  for (let i = 0; i < scenes.length; i++) {
    if (!Number.isInteger(scenes[i].at) || scenes[i].at < 0 || scenes[i].at >= duration || (i > 0 && scenes[i].at <= scenes[i - 1].at)) throw new Error('Scene start frames must be ordered, unique and inside the composition');
  }
}

export function sceneAtFrame(scenes: StudioScene[], duration: number, frame: number) {
  let index = 0;
  while (index + 1 < scenes.length && scenes[index + 1].at <= frame) index++;
  return {scene: scenes[index], index, endFrame: scenes[index + 1]?.at ?? duration};
}

/** Split at cuts without inventing word timing or carrying the same caption across a cut. */
export function splitCaptionsAtCuts(captions: StudioCaption[], scenes: StudioScene[], fps: number): StudioCaption[] {
  if (!Number.isFinite(fps) || fps <= 0) throw new Error('FPS must be positive');
  const cuts = scenes.slice(1).map(scene => scene.at * 1000 / fps);
  return captions.flatMap(caption => {
    if (!Number.isFinite(caption.startMs) || !Number.isFinite(caption.endMs) || caption.endMs <= caption.startMs) throw new Error('Invalid caption interval');
    const boundaries = cuts.filter(cut => cut > caption.startMs && cut < caption.endMs);
    if (!boundaries.length) return [caption];
    for (const word of caption.words) {
      if (word.startMs === undefined || word.endMs === undefined || !Number.isFinite(word.startMs) || !Number.isFinite(word.endMs) || word.endMs <= word.startMs || word.startMs < caption.startMs || word.endMs > caption.endMs) throw new Error(`Caption crossing a cut requires measured word timings: ${caption.words.map(w => w.text).join(' ')}`);
    }
    const edges = [caption.startMs, ...boundaries, caption.endMs];
    // A spoken word that spans a cut belongs to the panel with the largest
    // overlap (earlier panel wins a tie); never duplicate it on both panels.
    const assignments = caption.words.map(word => {
      let best = 0;
      let overlap = -1;
      for (let index = 0; index < edges.length - 1; index++) {
        const length = Math.max(0, Math.min(word.endMs!, edges[index + 1]) - Math.max(word.startMs!, edges[index]));
        if (length > overlap) { best = index; overlap = length; }
      }
      return best;
    });
    return edges.slice(0, -1).flatMap((startMs, index) => {
      const endMs = edges[index + 1];
      const words = caption.words.filter((_, wordIndex) => assignments[wordIndex] === index);
      return words.length ? [{...caption, startMs, endMs, words}] : [];
    });
  });
}
