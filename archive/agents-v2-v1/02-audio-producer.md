## Archived · Studio v2 / v1 Audio Producer contract (Episodes 001–005 & Arc 01)

> Archived on 2026-11-24. Retained for historical reference only; do not use single-narrator masters or rewind/jolt stingers for Studio v3 episodes.

### v2 Foley ownership split

Agent 02 delivers **narration, spoken world voices, and the rewind/tail stingers** (tape-snap and the final jumpscare stinger). **Agent 04 handles all remaining cue-sheet foley during assembly** — impacts, cloth, doors, ambience beds and any late-added cue the mix needs — sourcing or preparing them and recording rights. Do not duplicate the other role's assets: if a gap appears during assembly, Agent 04 fills it and records provenance rather than returning the episode to Agent 02, except for narration or spoken world voices, which stay locked to Agent 02's accepted artifacts.

## Hard Prohibitions (NEVER)

Never use `atempo` or another playback-speed increase to meet duration; never regenerate for harmless ASR formatting alone, change the approved script, overwrite a master, or add multi-speaker parsing. Never present ASR as a listening review or claim unverified licensing. Do not generate optional world voices unless the story mentions them.

## Execution Steps & Output Artifacts

1. Use Investigator as the sole narrator; when needed, generate the full approved script in one ShortZ request. Preserve the master and verification report; record unresolved flags without claiming a listening review. The owner accepts the narrator without a separate listening gate.
2. Prepare `narration-prepared.wav`/`.mp3` with the shared [`scripts/prepare-narration.mjs`](../scripts/prepare-narration.mjs) CLI and an episode `narration-prep.json` (tightening thresholds, exact rewind/dread gaps, the brief's pre-authorized hook trim fallback, protected beats and world-voice flanking gaps, tail pad). It assembles one continuous PCM sample timeline, verifies every claimed-silent window at sample level on frame-aligned boundaries, verifies sample-preserving padding and monotonic PTS, remaps `narration-timestamps.json`, and writes the PCM-verified `audio-edit-map.json` that becomes the composition timeline authority. The **measured hook gate** enforces the brief's `hook.limitSec` (default **3.0 s**): if the raw hook exceeds it and a fallback is pre-authorized, apply the trim; if no fallback is configured, the take fails loudly. `audio-edit-map.json` records `hookEndSec` / `hookWithinLimit` for the handoff. Then run [`scripts/check-pronunciation.mjs`](../scripts/check-pronunciation.mjs) — only genuinely new suspects escalate.
   - **Preparation reconciliation config.** In `narration-prep.json`, `pronunciation` is an optional inline rule object using the same `renames`, `splits` and `merges` arrays as [`scripts/asr-reconcile.json`](../scripts/asr-reconcile.json), for example `"pronunciation": {"renames": [{"from": "gak", "to": "nggak", "count": 1}], "splits": [{"from": "dituas", "to": ["di", "tuas"], "splitRatio": 0.5}], "merges": [{"from": ["kop", "pilot"], "to": "copilot"}]}`. Use an inline copy of the shared dictionary when needed; the config does not load a path automatically. Rules match case-insensitively with optional `contextBefore` and `contextAfter` arrays. They apply to all matching occurrences; absent entries are allowed unless an optional nonnegative `count` asserts the exact number for that rule. Preparation matches raw ASR tokens and retains hyphenated words for stem anchors; the checker splits hyphens for comparison, so records can differ between the two views. Splits divide the original interval using `splitRatio` (default 0.5); their new boundary is an estimate, not an independently measured word onset. Write stem and phrase anchors against the reconciled word track. Inspect the resulting `pronunciationRecords` and anchor timings, and use actual listening when needed; reconciliation is not a listening review.
   - **Delivery and joins.** Inspect the ShortZ report's actual chunks and proposed `tighteningCuts`; a single CLI invocation may synthesize and stitch multiple chunks, and an ASR match or PCM silence check cannot establish natural phrasing. When listening is available, compare the retained master and prepared take at normal speed around chunk joins, punctuation, long gaps and rewinds; record artifact and observations. Protect meaningful pauses and adjust individual edits only with evidence, then regenerate the map and downstream timings. The owner's automatic voice acceptance remains in force; if no listening occurred, record `listening review: none` and leave performance unverified rather than adding an approval prerequisite.
   - **Locate the joins.** Run `node scripts/review-narration.mjs episodes/<slug>/narasi.txt --timestamps <ShortZ-timestamps.json>` on the actual master sidecar. It prints the adjoining text and estimated times for each synthesis join, plus whether the chunk text matches the current script. If it does not match, identify the correct script and take before using those times. Record the master path, script hash, relevant join or suspected cut times, who listened and what they heard. Check `tighteningCuts` in the actual edit map as well; dry-run totals alone do not identify or prove the sound of each cut.
   - **Mandatory pronunciation check.** Diff the words in `narration-timestamps.json` against `narasi.txt` before `audio: pass`. Classify harmless ASR formatting separately; flag suspected phonetically mangled, omitted or taboo-sounding words and resolve them using the report and targeted listening when needed. ASR text alone cannot establish how a word was pronounced. If a genuine pronunciation issue remains unresolved, keep audio `ready` or `fail` with evidence and do not claim a listening review that did not happen. Never send raw all-caps comic SFX such as `BRAK!`, `KRAK!` or `KLIK!` to TTS; route them to the showrunner and foley cue sheet.
   - **WPM classification.** Accepted Investigator/Bahasa Bayi takes legitimately measure roughly **67–116 WPM**; ShortZ's generic pacing gate expects **130 ± 25%** and is not calibrated for this deliberately casual delivery. A chunk that fails only the generic WPM gate is **not** pronunciation or pacing evidence: classify it, keep the take, and judge pacing against the brief's words-per-second target instead. Never change vocal speed to approach the generic gate.
3. Create the rewind/tail stingers and, only when the script explicitly speaks one, the separate world voices using the recipes below and the named acoustic profiles. Record provenance and rights in the catalog and licenses, and reuse identical clips where specified. Remaining cue-sheet foley belongs to Agent 04 during assembly (see the ownership split above).
   - Every v2 part needs multiple cue-sheet world-audio or non-narrator voice beats, such as radio/TOA, short survivor dialogue or panic, pleas or whispers. Hand off separate clips, cue times, acoustic profiles and caption speaker labels or colors. For a scripted rewind, include the reverse whoosh or tape-stop cue, and reuse the canonical `public/sfx/shared/tape-snap-rewind.wav` for the tape-snap stinger rather than referencing another episode's folder.
4. Deliver the stingers at **−1 dBFS sample peak**, with a tight sub-boom and crisp screech or uncanny breath as directed. Measure true peak separately; new v2 finished video mixes must be **≤ −1.5 dBTP**. Leave room for the post-narration vacuum and final jolt.
5. Hand off paths, source/derivative durations, timestamps, cue triggers, rights, measurements and any unresolved listening findings.

### v2 world-voice recipes

These are production recipes, not pronunciation evidence. Every spoken world voice requires the mandatory ASR spot-check artifact below; delivery and mix require listening in context before release.

| Voice role | Preset / model | Prompt style | Acoustic profile | Caption label |
| --- | --- | --- | --- | --- |
| `pa-announcer` | Google Cloud `gemini-3.8-flash-tts`, voice **Orus** (Episode 005 precedent) | Flat, formal Indonesian public announcement; exact cue-sheet line only | `toa-megaphone` as the closest installed radio-bandpass treatment; final radio-timbre judgment belongs to the mix | yellow, e.g. `MENARA RADIO` |
| crew male / `copilot` | voice **Charon** (Episode 004 precedent: "Gantian, bang?") | Short in-character line or effort interjection, natural perspective | dry or mild distance per cue sheet | yellow speaker label, e.g. `COPILOT` |
| `entity-female` | A current CLI-roster voice — **`Fenrir` is the assigned candidate** (Episode 005 used `Aoede`, which is no longer in ShortZ's `GEMINI_TTS_VOICES` roster of `Charon`, `Fenrir`, `Orus`, `Algenib`) | Young female, flat / close-whisper style prompts as in Arc 1 Episode 005 | `behind-wall` or `close-whisper` | `SUARA` / story label |

Rules that apply to every recipe:

- **If the assigned candidate does not read as the intended voice character** (for `entity-female`, if the take does not read as a young, flat, eerie female delivery), try the remaining roster voice before requesting a new project-scoped voice, and record the attempts in the audio handoff.
- **ASR spot-check artifact.** Every spoken world-voice source must keep an ASR verification record (the ShortZ `-report.json`/`-timestamps.json` sidecars, or an equivalent ASR transcript diff against the exact cue text) in the episode record. ASR recognizing the intended words is a transcription check only — it never establishes pronunciation or performance, and no listening review is claimed by it.
- **Flanking-gap protection.** Slower PA/crew deliveries can overrun the narrator quote they replace. When a world voice replaces a narrated quote, Agent 02 must **reserve the window**: declare the quote span under `worldVoices` in `narration-prep.json` (this protects the flanking narration gaps from tightening), optionally with `muteNarration: true` to silence the quote in the prepared stem, measure the replacement asset's speech span, and lay it entirely inside the reserved narrator-free window with entry air before and clearance before the next narrated word. Record the reserved window in `audio-edit-map.json` (`worldVoiceWindows.reservedWindowSec`) so Agent 04 mixes inside measured bounds instead of guessing.
- **Non-verbal vocalization prompt table.** For effort sounds, prompt the TTS with a written interjection and verify what the ASR actually hears; ASR on non-verbal vocalizations is not a pronunciation verdict.

| Intended vocalization | Prompt | ASR precedent |
| --- | --- | --- |
| Restrained strain groan | `"Ugh!"` | heard "URGH" (Episode 004 accepted take) |
| Strained exhale / effort | `"Ngh!"` | heard "VUH" (Episode 004 `-v2`, retained alternate) |
| Suppressed grunt | `"Hngh!"` | heard "Hmm" (Episode 004 `-v1`, retained, not used) |

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
