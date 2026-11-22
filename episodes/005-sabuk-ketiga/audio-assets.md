# Audio assets & rights record — Standalone Scenario 05 "Sabuk Ketiga"

Audio Producer (Agent 02) handoff, 2026-11-22; **owner approved `narration-prepared.mp3` by listening check 2026-11-23** (pronunciation, pacing and the Rewind 3 dread silence clean; no re-roll). All numbers below are measured on the locked master and its prepared derivatives; the provisional timeline in [brief.md](brief.md) (02:31.0 / 151.0 s / 4530 frames) must be re-anchored to these values without changing vocal speed.

## Narration (single Investigator storyteller)

- **Master:** [narration-investigator.mp3](narration-investigator.mp3) — one ShortZ CLI invocation (`gemini-cloud`, `gemini-3.8-flash-tts`, Investigator voice `voice_71a5a701-796e-421d-840e-0adc00b0816a`) over the approved 259-word [narasi.txt](narasi.txt). Raw master **170.125 s**, 21 chunks, −16.9 LUFS / LRA 3.8 / noise floor −20.0 dBFS. Sidecars preserved unchanged: [narration-investigator-timestamps.json](narration-investigator-timestamps.json), [narration-investigator-report.json](narration-investigator-report.json).
- **ShortZ report verdict:** `passed: false` — 3/21 chunks verified, 18 flagged. The flags are the generic 130±25% WPM pacing gate (accepted takes measured 67–97 WPM; the Bahasa Bayi script is deliberately casual and the brief targets ~1.7 words/s overall) plus Whisper word-match attempts. Per the contract a failed ASR report is not proof of bad pronunciation; every deviation was classified in the mandatory pronunciation diff instead. No listening review is claimed; the owner's acceptance of the Investigator narrator is automatic and is not evidence of an audible review.
- **Prepared:** [narration-prepared.wav](narration-prepared.wav) / [narration-prepared.mp3](narration-prepared.mp3) — **155.985 s**, speech end **154.84 s**, −16.9 LUFS integrated, true peak −1.14 dBTP (final −14 LUFS / ≤ −1.5 dBTP delivery is Agent 04's mix step). Assembled by [prepare-audio.mjs](prepare-audio.mjs) on one continuous 48 kHz PCM sample timeline at 1.0× speed (zero `atempo`): 46 dead-air tightenings (gaps > 0.50 s retained at 0.32 s), three exact rewind-boundary replacements, protected lag-cue and tower-window gaps, 50 ms release fade + 1.0 s clean tail. **6,501 MP3 packets: 100% strictly monotonic PTS**, zero splice gaps/overlaps; locked regions verified true zero at sample level.
- **Remapped timing tracks:** [narration-timestamps.json](narration-timestamps.json) (words + chunks, script-faithful text) and [audio-edit-map.json](audio-edit-map.json) (edit list + Agent 04 cue handoff). Copies: `public/assets/005-sabuk-ketiga/`.
- **Pronunciation diff evidence:** [pronunciation-diff.json](pronunciation-diff.json) — 20 deviations reconciled (18 renames, 1 split `Gapernah`→`Nggak pernah`, 1 merge `kop pilot`→`copilot`); reconciled track matches narasi.txt token-for-token. Two items are marked `suspected-standardization` (`Perhatikan`→`Perhatiin`, formal `kemudian`→script `kemudi` in P18): resolved to script text; optional targeted listening if the owner wants audible confirmation. Harmless formatting kept as ASR produced it (hyphen splits, case, punctuation). No all-caps comic SFX in this script; nothing routed to the foley sheet as spoken text.

## Locked 3-loop pacing (triple-branch-rewind)

| Region | Mapped time (s) | Frames @30 fps | Content |
| --- | --- | --- | --- |
| Rewind 1 | 57.80 → 58.20 | 1734 → 1746 (12) | After "Tamat." (P07); tape-snap + reverse whoosh only, zero dead air |
| Rewind 2 | 72.46 → 72.86 | 2174 → 2186 (12) | After "Tamat." (P09); snaps straight back, zero dead air |
| Rewind 3 | 90.64 → 91.04 | 2719 → 2731 (12) | After "Tamat." (P11); tape-snap + reverse whoosh |
| Dread silence | 91.04 → 92.54 | 2731 → 2776 (45) | **True zero (sample-verified); the only dread silence**; P12 reset speech resumes at 92.54 |
| Tower window | 42.74 → 46.94 | 1282 → 1408 | Narrator-free window reserved for the `pa-announcer` tower asset |
| Speech end / tail | 154.84 → 155.985 | 4645 → 4680 | 150 ms vacuum + 1.0 s jolt + 0.35 s blackout land inside this tail; hard cut at ≈ 156.34 s (frame ≈ 4690; re-anchors provisional `blackoutFrame: 4521`) |

One-beat lag cues preserved un-tightened (raw-take measured): **P05** `kemudi→Kancing` **0.50 s** (buckle tick cue), **P10** `kebuka→Satu` **0.68 s** (third-belt self-release click), **P17** `ketukan→sabuk` **0.84 s** (release clack after the fake click). Cue transients anchor to these word timestamps, not to panel starts.

## Panel re-anchor table (measured narration spans, 24 lines ↔ 24 panels)

| Panel | Narration span (s) | Panel | Narration span (s) |
| --- | --- | --- | --- |
| P01 | 0.00 – 7.68 | P13 | 95.80 – 102.94 |
| P02 | 8.04 – 15.16 | P14 | 103.26 – 106.70 |
| P03 | 15.60 – 23.18 | P15 | 107.02 – 111.78 |
| P04 | 23.50 – 32.08 | P16 | 112.10 – 117.44 |
| P05 | 32.40 – 39.08 | P17 | 117.44 – 123.88 |
| P06 | 39.40 – 46.40 | P18 | 124.32 – 130.22 |
| P07 | 46.94 – 57.80 | P19 | 130.54 – 135.78 |
| P08 | 58.20 – 64.88 | P20 | 136.10 – 139.42 |
| P09 | 65.20 – 72.46 | P21 | 139.74 – 145.56 |
| P10 | 72.86 – 82.80 | P22 | 145.94 – 147.70 |
| P11 | 83.28 – 90.64 | P23 | 148.02 – 152.16 |
| P12 | 92.54 – 95.48 | P24 | 152.54 – 154.84 |

Hook words start at exactly 0.000 s (`Tiga sabuk terpasang…`), so the title window 0–1.8 s and cover frame 6 keep their provisional anchors.

## `pa-announcer` tower voice-sfx (the only world voice in this episode)

- **Line (verbatim, locked brief):** "turun, lewatin awan, izin darurat" — cue window P06 (measured narrator quote 43.06–45.76 s inside the reserved window 42.74–46.94 s).
- **Source:** `public/sfx/sources/scenario05-tower-original.wav` — generated via Google Cloud Gemini 3.8 Flash TTS, **Orus**, flat formal Indonesian PA style; SHA-256 `B9FA8C54F1047F41B4041B7F1A8C1D114C1E448F054E5D0B90E2975966A3E8FE`. Generated by [generate-pa.ts](generate-pa.ts) from the ShortZ environment (one invocation, original retained). Named `scenario05-` because Arc 01 Episode 005 already owns the `ep005-` prefix in the shared SFX tree.
- **ASR spot-check** ([verify-pa.ts](verify-pa.ts), Whisper small): transcript matched the requested line verbatim — `Turun,` 0–0.82, `lewatin` 1.22–2.06, `awan,` 2.06–2.68, `izin` 2.98–3.50, `darurat.` 3.50–4.04 s. This is ASR evidence, not a listening review; performance/mix listening is pending.
- **Derivatives (originals retained):** `public/sfx/prepared/scenario05-tower-pa.wav` — `toa-megaphone` profile (500–2800 Hz bandpass, soft saturation, faint slapback), the closest installed radio-bandpass treatment; the brief leaves final radio-timbre judgment to the mix. `public/sfx/prepared/scenario05-tower-pa-mixready.wav` — 4.090 s (speech ends 4.040 s + 40 ms release fade), +21.2 dB peak normalization to −1.0 dBFS sample peak, sized to fit the 4.200 s reserved window. Suggested lay point: asset start ≈ reservedWindow.startSec + 0.05 s.
- **Rights:** generated via Google Cloud; publication terms not independently verified (same standing as the Episode 007 PA record). Logged in [public/sfx/catalog.json](../../public/sfx/catalog.json) (`scenario05-tower-pa`, `scenario05-tower-pa-mixready`) and [public/sfx/LICENSES.md](../../public/sfx/LICENSES.md).
- **Edit-map instruction (non-destructive):** the narrator's spoken quote of the line stays in `narration-prepared.mp3`; Agent 04 mutes words 77–81 (`turun lewatin awan izin darurat`) in the edit map and lays this asset inside the reserved window, caption label yellow `MENARA RADIO`, with the radio-static bed ducking under the impossibly clear voice (audible C3 tell).

## Cue-sheet handoff notes for Agent 04

- Narration stem: `public/assets/005-sabuk-ketiga/narration-prepared.mp3` (WAV twin alongside). All cue transients anchor to [narration-timestamps.json](narration-timestamps.json) / [audio-edit-map.json](audio-edit-map.json).
- Tape-snap/reverse-whoosh SFX ×3 at the rewind regions above, scheduled at `round(startFrame × sampleRate / fps)`; Scenario 03's identical 0.40 s `rewind-whoosh` clip is reusable (`public/assets/003-goyangan-dek-enam/sfx/rewind-whoosh.wav`, CC0 techiew).
- Rotor/wind beds, radio static, belt clicks/clack, door grind, buffet, gust, touchdown and the final jolt (150 ms vacuum, sub-boom + short wind gust, 2-frame flash ≤65%) per the brief's mandatory cue sheet; deliver one-shots at −1 dBFS sample peak, mix −14 LUFS integrated / ≤ −1.5 dBTP on the compressed delivery, and keep the deliberate silent clues silent (peak tip, hanging empty belt, radio never repaired).
- Deliberate silences to protect in the mix: rewind 1–2 gaps (57.80–58.20, 72.46–72.86), the full mute across 91.04–92.54 (dread), the reserved tower window entry/exit, and the tail vacuum before the jolt.

Generation scripts kept with the episode: [generate-pa.ts](generate-pa.ts), [verify-pa.ts](verify-pa.ts), [prepare-audio.mjs](prepare-audio.mjs) (rebuilds all prepared derivatives from the untouched master).
