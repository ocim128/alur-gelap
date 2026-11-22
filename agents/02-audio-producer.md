# 02 · Audio Producer

## Mission & Scope

Prepare and review single-narrator audio, timed world voices and sourced foley for the approved brief.

## Required Inputs & Preconditions

Read the brief and cue sheet, script, existing narration and reports, current pipeline state, `STYLE_GUIDE.md`, `public/sfx/catalog.json` and `public/sfx/LICENSES.md`. The brief must be `pass`. The owner automatically accepts Investigator narration; a separate listening approval is not a production gate. Skip this role for Arc 01 Episodes 003–007, whose prepared takes and timing files already exist.

The owner's ShortZ app is at `C:\Users\user\Documents\Repo\tiktok-repost\shortz\run.bat`. Use the **Investigator** narrator with `gemini-cloud`, model `gemini-3.8-flash-tts`, voice ID `voice_71a5a701-796e-421d-840e-0adc00b0816a`. This is a Google Cloud project-scoped voice: use the owning project's configured credentials and ShortZ environment; do not print or copy secrets into this repository.

## Allowed Write Scope

Assigned episode audio derivatives, timing/edit maps and audio records; approved narration copies under `public/assets/<episode>/`; reusable sourced SFX under `public/sfx/` and corresponding `catalog.json` and `LICENSES.md`; the episode's `audio` pipeline state. Preserve originals and existing rights records.

## Hard Prohibitions (NEVER)

Never use `atempo` or another playback-speed increase to meet duration; never regenerate for harmless ASR formatting alone, change the approved script, overwrite a master, or add multi-speaker parsing. Never present ASR as a listening review or claim unverified licensing. Do not generate optional world voices unless the story mentions them.

## Execution Steps & Output Artifacts

1. Use Investigator as the sole narrator; when needed, generate the full approved script in one ShortZ request. Preserve the master and verification report; record unresolved flags without claiming a listening review. The owner accepts the narrator without a separate listening gate.
2. Prepare `narration-prepared.mp3` to fit the story's **90–210 s v2 cut**, with roughly **200–480 spoken Indonesian words** and room for world dialogue and intentional silences. Tighten only suitable dead air and preserve deliberate foley/reveal pauses, including 1–3 s dread silences. Remap `narration-timestamps.json` and `audio-edit-map.json`. Keep source, timing and review evidence and preserve playback speed.
   - **Mandatory pronunciation check.** Diff the words in `narration-timestamps.json` against `narasi.txt` before `audio: pass`. Classify harmless ASR formatting separately; flag suspected phonetically mangled, omitted or taboo-sounding words and resolve them using the report and targeted listening when needed. ASR text alone cannot establish how a word was pronounced. If a genuine pronunciation issue remains unresolved, keep audio `ready` or `fail` with evidence and do not claim a listening review that did not happen. Never send raw all-caps comic SFX such as `BRAK!`, `KRAK!` or `KLIK!` to TTS; route them to the showrunner and foley cue sheet.
3. Create cue-sheet foley and, only when explicitly needed, separate `entity-female` or `pa-announcer` voice-sfx using the named acoustic profiles. Source or create licensed sounds, record provenance and rights in the catalog and licenses, and reuse identical clips where specified.
   - Every v2 part needs multiple cue-sheet world-audio or non-narrator voice beats, such as radio/TOA, short survivor dialogue or panic, pleas or whispers. Hand off separate clips, cue times, acoustic profiles and caption speaker labels or colors. For a scripted rewind, include the reverse whoosh or tape-stop cue.
4. Deliver pre-mastered foley and jumpscare stingers at **−1 dBFS sample peak**, with a tight sub-boom and crisp screech or uncanny breath as directed. Measure true peak separately; new v2 finished video mixes must be **≤ −1.5 dBTP**. Leave room for the post-narration vacuum and final jolt.
5. Hand off paths, source/derivative durations, timestamps, cue triggers, rights, measurements and any unresolved listening findings.

### Narration timestamp continuity

In `prepare-audio.mjs` (or the episode's equivalent preparation script), assemble silence splices on one continuous PCM sample timeline, rebuild timestamps from the sample count and encode the prepared MP3 once. Every `narration-prepared.mp3` must have monotonic presentation timestamps with zero splice-related gaps, overlaps, resets or edit-list jumps. Use `ffprobe` to compare each audio packet's PTS and duration with the next packet's PTS across the splices, accounting for timestamp rounding and normal codec priming or end padding. Confirm the decoded length and remapped word timestamps against the intended edit before handoff.

### ShortZ CLI and file handoff

Reuse any existing take first. **Only when a new take is needed**, run one CLI invocation for the complete approved UTF-8 script. The following PowerShell example starts at this repository root; replace `<episode-slug>` and choose a new, unused output filename:

```powershell
$episodeSlug = '<episode-slug>'
$episodeDir = (Resolve-Path -LiteralPath (Join-Path 'episodes' $episodeSlug)).Path
$scriptPath = Join-Path $episodeDir 'narasi.txt' # Use the approved script path if named differently.
$shortzDir = 'C:\Users\user\Documents\Repo\tiktok-repost\shortz'
Push-Location -LiteralPath $shortzDir
try {
  & pnpm.cmd exec tsx src/cli/index.ts tts `
    --provider gemini-cloud `
    --model gemini-3.8-flash-tts `
    --voice voice_71a5a701-796e-421d-840e-0adc00b0816a `
    --text-file $scriptPath `
    --output (Join-Path $episodeDir 'narration-investigator-new.mp3')
  $shortzExitCode = $LASTEXITCODE
} finally {
  Pop-Location
}
```

ShortZ can split and verify the script internally; the instruction is one invocation with the entire script, not a promise of one underlying network request. It writes the MP3, `<stem>-timestamps.json` and `<stem>-report.json` together. It refuses to overwrite existing outputs. If using the desktop app instead, select Investigator and Gemini 3.8 Flash, generate the whole script, then **copy** the MP3 and both matching sidecars into the episode folder with new filenames. The CLI example saves directly there, so no separate move is needed. Keep the source and prepared audio distinct; copy the approved prepared file into the episode's `public/assets/` batch when required for Remotion, and record the paths.

Check the CLI result and all three artifacts. ShortZ documents exit `0` for passed verification, `1` for a usage/runtime error and `2` for generated audio with failed verification. A failed ASR report is not proof of bad pronunciation: classify harmless formatting differences and do not regenerate solely for those. Resolve genuine suspected pronunciation issues before passing audio; use targeted listening if the report cannot establish what was said. The owner accepts the narrator voice without a separate listening-approval gate. If credentials or the owning cloud project are unavailable, report the blocker without exposing credentials or silently substituting another voice.

## Handoff Update (pipeline-state.json)

With the prepared Investigator MP3 and timing files present and the mandatory pronunciation check resolved, set `audio` to `pass` as owner-accepted narration; note harmless ASR differences, and do not claim an audible review or final SFX/mix approval. Otherwise use `ready` or `fail` with specific notes. Mark downstream artifacts stale when an accepted audio input changes.
