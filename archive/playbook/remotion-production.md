# Remotion production in this repository

## Current setup

The `alur-gelap` repository root is the Remotion project root. `src/index.ts` registers the root, and `src/Root.tsx` registers compositions. `public/` contains static assets. Existing compositions are unrelated working content; preserve them and any user changes. The project currently defines vertical 1080 × 1920 compositions. It has `npm run dev`, `npm run check`, and `npm run build` scripts in its `package.json`.

When asked to make a video, read the installed `remotion-best-practices` skill and its indicated creation, markup, interactivity, captions, preview and render references as needed. Start Studio as directed by that skill, verify the actual composition preview and do not render unless explicitly requested. Implement a uniquely named composition, appropriate frame rate and frame-based duration, and use editable, named layers where practical. Use Remotion's frame clock for deterministic animation; avoid relying on wall-clock time, unseeded randomness, network-only assets or CSS animations that might render differently. Base scene boundaries and duration on the final narration and storyboard.

### Timing that survives an edit

Give shots stable names in the episode's existing timing code. Define each shot start once and express events within the shot as local frame offsets. For example, if a door closes on frame 18 of a shot, its picture and sound can share that cue. Keep each narration take and its phrase timings under the same ID so moving the take also moves its captions. This works with ordinary Remotion sequences and an episode-local cue list.

After retiming, check that referenced media exist, voiced words fit inside their sequences, and captions and sound cues land inside their intended intervals. Replay the changed cut with the preceding and following shots to catch a clue that now arrives too early or too late.

## Paths and commands

Run these from the repository root:

```powershell
npm run dev
npm run check
npm run build
```

Register a new episode composition in `src/Root.tsx`, put its components under a descriptive `src/` subfolder, and reference assets placed in a matching `public/` subfolder with Remotion's `staticFile` when appropriate. Record exact paths and the composition ID in the brief. Check existing dependencies and assets before adding more. The repository root is a runnable Remotion app.

If the user explicitly requests an MP4 export, run the CLI from the repository root with the real composition ID and an episode-specific destination, for example:

```powershell
npx remotion render src/index.ts COMPOSITION_ID "episodes/001-short-episode-slug/final.mp4"
```

Replace both placeholders. The root `remotion.config.ts` enables overwrite, so check that the output path is new or that replacement is intended before rendering. Verify the actual export's duration, aspect ratio, picture, audio and caption sync; a successful command alone does not establish quality. A reviewable Studio preview is useful even when no export has been requested.

## Historical note on repository separation

This archived guidance predates the move of the Remotion project into this repository. Some historical production scripts still depend on external tools. Record those dependencies in each episode brief. When separation is actually requested, choose whether to move the Remotion project into the new repository or establish an explicit versioned dependency, then migrate source code, required assets, licenses, package manifest and lockfile, configuration and reproducible commands. Verify install, Studio, lint/build and any explicitly requested render from a clean checkout. Avoid absolute Windows paths in portable content documents. This archived playbook does not itself perform a migration.
