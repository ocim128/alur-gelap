# 04 · Remotion Assembler

## Mission & Scope

Deterministically assemble the approved script, audio and panel batch with Remotion motion, captions and sound kinetics.

## Required Inputs & Preconditions

Read the episode brief, cue sheet, arc record, owner-accepted narration with timing/edit map, available cue record, approved panels/contact sheet and current pipeline state. Require `brief`, owner-accepted narration (`audio`) and `images` to be `pass`; do not treat the narration pass as evidence of listening or completed sound design. Follow installed Remotion guidance.

## Allowed Write Scope

Assigned episode manifest, captions, assembly scripts, composition registration and components needed for the episode, output MP4 and verification stills, episode review/asset handoff, and `render` pipeline state. For Arc 01, also source or prepare missing cue-sheet SFX and explicitly mentioned in-world voice SFX, with provenance in `public/sfx/catalog.json` and `public/sfx/LICENSES.md`. Respect any narrower owner file scope.

## Hard Prohibitions (NEVER)

Never regenerate the main narration TTS, rewrite scripts, invent or generate replacement panels, change accepted source audio, add stray unlabeled `BlueprintOverlay` arrows, cover faces with `PERSEDIAAN`, or publish. Route missing or defective panels or narration to their owning role; handle missing Arc 01 SFX as specified below.

## Execution Steps & Output Artifacts

1. Assemble the owner-accepted narration and approved panels into a 9:16 manifest/composition, finalizing provisional caption and cue timing against the available sidecars and footage. Keep title safe-zone timing, 3–4-word captions, HUD numbers and silent clues correct; ensure visible character reactions and purposeful motion.
2. Implement the final **tension ramp → silence vacuum → camera-shake/flash kinetic jolt → hard cut to black** per `STYLE_GUIDE.md`. Preserve cue-sheet foley and any episode-specific final handoff; do not speed up narration.
3. Target **−14.0 LUFS integrated** and **≤ −1.0 dBTP** for the complete mix; mix climax SFX peaks within **−8 to −2 dB relative to narration peaks**, then measure the finished result and true peak. Keep the impact crisp without clipping.
4. Run `npm run check`, render the MP4 and export verification stills including 00:00.2, representative HUD/face frames and final jolt/black. Deliver manifest, captions, composition ID, render path, duration, mix measurements, rights and verification evidence.

- **Foley variation.** Avoid repeating the exact same breath or exhale sample across consecutive narration gaps. Alternate subtle variations or duck repeated breaths by 4–6 dB so the loop does not stand out on headphones.
- **Caption hygiene.** Strip only stray non-word TTS punctuation artifacts before the final render. Preserve valid Indonesian reduplication hyphens (`satu-satunya`, `pelan-pelan`, `keras-keras`) and standard prefixes (`dihantam`); never mechanically remove hyphens or rewrite spoken words.
- **Speaker labels.** Keep narrator captions white and hide the `NARATOR` / `NARRATOR` badge. Display a colored label for non-narrator diegetic voices, such as yellow `PENCULIK`.

### Studio v2 assembly contract

Reusable components are exported from `src/components/StudioV2.tsx`. Import the named exports directly. Frame props use the **local frame of the containing composition or Sequence**. Put matching visual and audio cues on the same timeline. Normalized boxes use `{x, y, width, height}` in 0–1 composition coordinates. `FrameTransition` is `{at: number; duration: number; from: number; to: number}`; provide transitions sorted by `at` without overlap.

| Component | Props and behavior |
| --- | --- |
| `SilhouetteAtmosphereLayer` | `{grainOpacity?: number; grainSeed?: string; flicker?: {box: NormalizedBox; color: string; opacity?: number; strength?: number}}`. Grain and optional practical-light flicker are deterministic per frame. Use distinct seeds for multiple layers. |
| `BranchRewindTransition` | `{startFrame: number; durationFrames?: number; intensity?: number; seed?: string}`. The overlay lasts 0.4 s by default at the composition FPS. Place the reverse-whoosh/tape-stop sound separately at the same frame. |
| `LiveDigitalClockHUD` | `{initialSeconds: number; jumps?: {atFrame: number; seconds: number}[]; rewind?: {startFrame: number; durationFrames: number; fromSeconds: number; toSeconds: number}; showSeconds?: boolean; warning?: boolean; box?: NormalizedBox; fontSize?: number}`. Seconds are time-of-day values. The clock ticks using composition FPS, applies scheduled jumps, reverses during the supplied interval, then resumes from the rewind target. `showSeconds` selects HH:MM:SS; `warning` selects red. |
| `SlidingHatchOverlay` | `{box: NormalizedBox; initialOpen?: number; transitions: FrameTransition[]; direction?: "left" \| "right" \| "up" \| "down"; color?: string}`. Open values range from 0 closed to 1 open. Animate the matte shutter over an already-open hatch plate and schedule each transition at the hatch sound. Default color is `#07080B`. |
| `UnderDoorShoeShadow` | `{box: NormalizedBox; startFrame: number; stopFrame: number; fromX?: number; color?: string}`. Two matte blocks enter the light strip and halt centered at `stopFrame`. `fromX` is relative to the strip width and defaults to −0.3. |
| `ImpactMicroShake` | `{children: ReactNode; contactFrame: number; durationFrames?: number; jitterPx?: number; pushPx?: number}`. Wrap the visual to shake. The lateral push and decaying jitter start at the contact frame; defaults are 10 frames, 5 px jitter and 8 px push. Schedule the scrape or impact SFX at that same frame. |

Implement these capabilities during Part 001 assembly. Record `pipelineVersion: 2` separately from `schemaVersion: 2`. Use `art.styleId: "urban-silhouette-noir"` and `script.format: "decision-consequence"` with `script.engine` set to `branch-rewind`, `earned-consequence` or `both`. Keep the frame-zero hook and timed ending/reveal. Record the spoken count in `script.wordCount`.

- **Continuous 2.5D motion and atmosphere.** Animate every plate throughout its hold with a subtle push, pull or pan (for example, 1.00 → 1.04); no frozen slides. Make procedural rain or mist visibly move on outdoor or window-visible shots, and make scripted high-contrast lightning flashes 2–3 frames long and legible at phone size. Keep falling rain outside or behind glass; preserve intentional dry interiors. Use deterministic grain and practical light flicker where appropriate, and check the actual export at phone size.
- **`branchRewind`.** Where scripted, use a 0.35–0.55 s scanline tear/static snap with reverse whoosh or tape-stop audio. Cut from the bad outcome to the established choice point and anchor the transient to its measured narration cue.
- **Living ambience.** Maintain a continuous, evolving ambient bed, cleanly ducked beneath narration; only intentional scripted Dread Silences drop to true zero. Preserve the prescribed final silence vacuum.
- **Caption safe zone and cuts.** Place burned-in captions in the lower-third safe zone, approximately 76–82% down the frame, clear of the TikTok/Reels bottom UI and central 60% of the artwork. Split or clamp caption chunks at every panel cut so no caption hangs frozen across it; preserve spoken-word timing and coverage when the sentence continues on the next shot. Verify in the exported cut at phone size.
- **Picture and sound.** Check the Show-What-You-Say map against the cut before export. Keep each action or threat on screen during its narration. Mix multiple world-audio or dialogue beats and preserve 1–3 s dread silences. Use speaker labels or consistent colors for dialogue captions. Keep `tensionRamp`, `finalJolt`, −14.0 LUFS, ≤ −1.0 dBTP and the ±1-frame exported PCM sync check.

### Audio timestamps and exported jolt sync

- Anchor story-critical SFX transients, including impacts, thunderclaps, door slams and `branchRewind`, to the exact measured word timestamps from Agent 02's accepted timing sidecar, rather than panel start frames. Apply any story-required offset from that word explicitly (for example, a delayed thunderclap); verify the event, exported waveform and visuals agree. If word timing is missing or uncertain, resolve it before handoff rather than guessing from the panel cut.
- Inspect narration and SFX timestamps before the final mix and mux. When an input has a PTS discontinuity, build a working PCM copy with continuous timestamps derived from its sample count. Preserve intentional pauses and cue placement on the composition timeline. Verify the normalized input before mixing.
- Decode the AAC in the final exported MP4 to PCM and locate the stinger onset in the waveform. Read the presentation timestamp of the first visual `finalJolt` flash frame from the exported video. Compare both on the MP4 presentation timeline, accounting for stream offsets and AAC priming or trim. Require an absolute offset of **at most one frame (approximately ±33 ms at 30 fps)**. Record the frame number, both timestamps and the signed offset in the handoff. If the limit is exceeded, correct the timing, export again and repeat the measurement before sending the cut to Agent 05.

For Arc 01, because Agent 02 is skipped, use the existing prepared narration and timing sidecars and finish missing sound cues here. Source licensed effects and record rights; generate `entity-female` or `pa-announcer` **only** where the brief explicitly calls for an in-world voice. For Episode 005, preserve the narration file and non-destructively mute or trim only its final quoted line in the composition/edit map before inserting the specified whisper voice-sfx. Resolve provisional cue timings against the composition, measure the final mix, and flag real defects without claiming a listening review that did not happen. Do not regenerate the main narrator.

## Handoff Update (pipeline-state.json)

Set `render` to `pass` only after checks and all artifacts exist; otherwise `ready` or `fail` with actionable notes. A render pass requests independent QA; it is not a QA or publishing approval.
