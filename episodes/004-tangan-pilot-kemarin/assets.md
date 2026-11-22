# Scenario 04 — Tangan Pilot Kemarin · Asset & Rights Record

Audio stage record by Agent 02 (2026-11-22). Visual assets are Agent 03's scope and are not recorded here yet.

## Narration

- **Raw master:** `narration-investigator.mp3` (165.935 s, −16.3 LUFS) from the approved 256-word [narasi.txt](narasi.txt). One ShortZ CLI invocation (`gemini-cloud`, `gemini-3.8-flash-tts`, Investigator voice `voice_71a5a701-796e-421d-840e-0adc00b0816a`), 19 chunks. Raw verification exited 2; classification in [verification/pronunciation-diff.json](verification/pronunciation-diff.json): zero true omissions or insertions; drivers are Whisper chunk-boundary end-truncation flags, the generic wpm gate (Investigator narrates ~95–116 wpm), and ASR normalization pairs. 8 phonetic-suspect pairs (e.g. `beku→begu`, `gunung→gunuh`, `alih→ali`) remain text-vs-audio ambiguous and are flagged for the owner listening check; no listening review is claimed.
- **Prepared stem:** `narration-prepared.mp3` / `.wav` (48 kHz mono, **153.500 s**, speech ends **152.000 s**, tail hold **1.500 s**, −16.2 LUFS, true peak −0.5 dBTP, sample peak −0.46 dBFS). Built by [prepare-audio.mjs](prepare-audio.mjs) on one continuous PCM sample timeline; zero playback-speed change. 6,397 MP3 packets, 100% strictly monotonic PTS.
  - **Hook:** brief-documented fallback applied — raw hook ended 3.56 s (> 00:03.0 limit), so `itu` was removed by edit; spoken hook is **"Tangan di tuas bukan tanganmu."** ending at **2.700 s**. Captions must use this spoken form. The dropped word was also removed from `narration-timestamps.json` (262 words).
  - **Branch rewind gaps (exact, measured in the prepared timeline):**
    - Rewind 1: **0.400 s** at 43.440–43.840 s (after "…pinus mati.", before "Balik lagi.") — straight snap, zero dead air.
    - Rewind 2: **0.400 s** at 58.500–58.900 s (after "…ambruk.", before "Jarum bensin…") — straight snap, zero dead air.
    - Rewind 3: **2.000 s** at 73.300–75.300 s (after "Tamat.", before "Setiap kali…") = 0.400 s tape-snap window (73.300–73.700) + **1.600 s true-zero dread silence** (73.700–75.300), the episode's only post-rewind silence.
  - **Locked-frame reconciliation (Agent 04):** measured anchors vs the brief's provisional frames — rewind 1 at 43.44 vs f1380 (46.0) = 2.56 s early; rewind 2 at 58.50 vs f1773 (59.1) = 0.6 s early; rewind 3 at 73.30 vs f2172 (72.4) = 0.9 s late; speech end 152.00 vs provisional 152.5. Total cut stays 154.0 s / 4620 frames; stretch or hold panel boundaries between the locked rewind intervals to the measured anchors. Anchor transient SFX to `narration-timestamps.json`, not to panel starts.
  - **Protected beat:** the gap "terjepit." (56.96) → "Ambruk." (57.72) was left un-tightened for the copilot groan + muffled thud room.
  - Dead-air tightening: 29 gaps > 0.65 s trimmed to 0.30 s retained (Ep 002 precedent). Full cut list in [audio-edit-map.json](audio-edit-map.json).
- Derivative copies for Remotion live in `public/assets/004-tangan-pilot-kemarin/` (SHA-256 of `narration-prepared.mp3`: `8d270aca0541c9595deb0e99f21404cef5859ded77d98d49fc12b682b0fa3b8c`).

## World-audio `voice-sfx` (separate assets, not narrator parsing)

Cue sheet calls for exactly one COPILOT line and one restrained copilot groan. Both generated with the configured Google Cloud Gemini 3.8 Flash TTS (`gemini-3.8-flash-tts`), prebuilt voice **Charon** (same voice for both cues = one copilot identity), `--no-master` raw sources retained. AI-generation service terms and publication rights have not been independently verified; ASR evidence recorded below; delivery/identity consistency in context requires the owner listening check (no listening review is claimed).

| Asset | Source take | Prepared file | Measured evidence | Suggested cue (prepared timeline) | Treatment |
| --- | --- | --- | --- | --- | --- |
| COPILOT line "Gantian, bang?" | `sfx/voice-copilot-gantian-source.mp3` (accepted attempt heard "Gantian bang?", word ratio 1.0, similarity 1.0; overall chunk "failed" only on the generic wpm gate) | `sfx/voice-copilot-gantian.wav` — 0.715 s, sample peak −1.02 dBFS, lead trimmed, dry | `sfx/voice-copilot-gantian-source-report.json` | **24.900 s** — right after the narrator says "gantian" (24.36–24.86), before "tolak." (ends 25.84). Cue-sheet provisional was ~00:26.5 | Dry close interior, **no acoustic processing** per cue sheet; caption yellow `COPILOT` |
| Restrained copilot groan | `sfx/voice-copilot-groan-source-v3.mp3` (accepted attempt heard **"URGH"**; alternates on file: `-v2` heard "VUH!", `-v1` "Hngh!" prompt produced a neutral "Hmm" hum — not used) | `sfx/voice-copilot-groan.wav` — 0.745 s, sample peak −1.10 dBFS, dry | `sfx/voice-copilot-groan-source-v3-report.json` | **57.000 s** — inside the protected beat "terjepit." → "Ambruk." (56.96→57.72). Clip is 30 ms longer than the beat; trim its tail ~50 ms in the mix if needed | Filter-safe: no wet/bone texture; mix restrained under the muffled thud (~00:55.6 provisional) |

ASR on non-verbal vocalizations is not a pronunciation verdict; the groan candidates are flagged as requiring listening in context, consistent with the repo's candidate policy.

## Cue-sheet foley prepared this stage

| Asset | Recipe | Cue (prepared timeline) |
| --- | --- | --- |
| `sfx/tape-snap-rewind.wav` | Locally synthesized via FFmpeg (no third-party recording): 0.34 s exponential pitch-drop tape-stop (≈1100→60 Hz) + 5 ms filtered noise snap + 50 Hz sub thump, 0.400 s exactly, sample peak −1.0 dBFS | One asset reused identically ×3 at the rewind gap starts **43.440 / 58.500 / 73.300 s** (locked frames 1380 / 1773 / 2172 = `Math.round(startFrame * sampleRate / fps)`) |

Remaining cue-sheet sounds (rotor bed, panel hum, paper tap, static burst, flashlight click, metal shudder, muffled thud, fuel-gauge tick, reserve-valve clack, rotor scream, mountain impact, pedal friction, airframe creak, tension ramp, eerie smooth rotor, cloud-wall pass rumble, runway hum, relieved breath, touchdown, spin-down, cyclic click, page flip, pencil tick, vacuum + sub-hit) are **not yet prepared**; they are Agent 04 assembly/mix scope against `narration-timestamps.json` anchors. Final mix measurements (−14 LUFS, ≤ −1.5 dBTP after AAC) apply at export.

## Rights summary

- Narrator voice: owner-accepted Investigator (`voice_71a5a701-796e-421d-840e-0adc00b0816a`), Google Cloud project-scoped; no listening-approval gate required per studio policy; publication rights unverified.
- COPILOT voice-sfx: Gemini prebuilt Charon via the configured cloud project; service terms and publication rights unverified; sources retained.
- `tape-snap-rewind.wav`: locally synthesized; no third-party rights.
- No third-party music or foley was added at this stage.

## Visual correction candidates ? 2026-11-23

Built-in image generator, three `docs/style-anchor/` files as style references only. Original draft images remain in `public/assets/004-tangan-pilot-kemarin/style-batch/`; correction attempts in `public/assets/004-tangan-pilot-kemarin/correction-candidates/`; owner-approved study preserved in `style-test/`. See [source record and audit](sources/prompts.md) and [contact sheet](panels-contact.jpg). Candidates are unapproved for assembly; image-service terms and publication rights have not been independently verified. No complete final WebP batch or dedicated jolt is delivered.

## P04 correction ? 2026-11-23

`public/assets/004-tangan-pilot-kemarin/correction-candidates/P04-v2.png`: built-in image generation using only the three master style anchors; provisional selection, one production correction. Prompt, source path, retry counts, rights status and updated audit are in [sources/prompts.md](sources/prompts.md). Image-stage remains failed; prior assets and accepted audio preserved.

## P09 neutral insert ? 2026-11-23

`public/assets/004-tangan-pilot-kemarin/correction-candidates/P09-neutral-insert.png` generated by built-in imagegen using only the three style anchors. Neutral control-position study only; does not cover the full narrated action and is not selected for production. Source and limitations recorded in [sources/prompts.md](sources/prompts.md). Publication rights not independently verified.

## Owner-directed correction exception ? 2026-11-23

New P23-v4/v5, P24-v4, P09-reaction and final-jolt candidate files are under `public/assets/004-tangan-pilot-kemarin/correction-candidates/`; all generated with built-in imagegen and the three master anchors for style. P23-v5 edits P23-v4 to remove rain. Source paths, prompts, retry accounting and unresolved continuity/action failures are in [sources/prompts.md](sources/prompts.md). Service terms and publication rights not independently verified. No completed WebP handoff.

## Owner-approved exception image handoff ? 2026-11-23

24 selected 1080?1920 WebP plates, P09 reaction and final-jolt plate: `public/assets/004-tangan-pilot-kemarin/owner-approved-exception/`. Exact original source mapping is in that directory. Built-in imagegen; only master anchors used as style references. The owner approved proceeding despite the technical failures documented in [sources/prompts.md](sources/prompts.md); this is not a technical QA pass. Image-service and publication rights remain unverified.
