# Scenario 04 — Tangan Pilot Kemarin · Audio Handoff to Agent 04 (Remotion Assembler)

Owner **approved** `narration-prepared.mp3` on 2026-11-23 (pronunciation, pacing, and the Rewind 3 dread silence clean; no re-roll). This document flags the exact measured timestamps to anchor in `Skenario04TanganPilotKemarin`. Full edit math in [audio-edit-map.json](audio-edit-map.json); word-level anchors in [narration-timestamps.json](narration-timestamps.json) (262 words; the hook fallback word `itu` is absent — captions must read "Tangan di tuas bukan tanganmu.").

## Narration track

- `narration-prepared.mp3` / `.wav` — **153.500 s**, speech ends **152.000 s**, trailing tail 1.500 s, −16.2 LUFS, −0.5 dBTP. Lay from t = 0. The track is 0.5 s shorter than the 154.0 s cut; the mix fills the last 0.5 s (sub-hit tail region) — no trim needed.
- Zero speed change; 6,397 MP3 packets verified continuous (max PTS+duration vs next-PTS deviation 0.000000 s).

## `branchRewinds[0..2]` — locked frames + measured narration gaps

Manifest uses the locked brief intervals; the measured narration gap around each rewind is what the audio must line up with. Reconcile panel boundaries between the locked intervals to these measured anchors:

| Index | Locked frames | Provisional video time | Measured narration gap (prepared timeline) | Gap content |
| --- | --- | --- | --- | --- |
| `branchRewinds[0]` | `{ startFrame: 1380, endFrame: 1392 }` | 00:46.0–00:46.4 | **43.440 → 43.840 s** (0.400 s) | "…pinus **mati.**" ends 43.440; "**Balik** lagi." starts 43.840. Tape-snap only — zero dead air |
| `branchRewinds[1]` | `{ startFrame: 1773, endFrame: 1785 }` | 00:59.1–00:59.5 | **58.500 → 58.900 s** (0.400 s) | "**Ambruk.**" ends 58.500; "**Jarum** bensin…" starts 58.900. Tape-snap only — zero dead air |
| `branchRewinds[2]` | `{ startFrame: 2172, endFrame: 2184 }` | 01:12.4–01:12.8 | **73.300 → 75.300 s** (2.000 s) | "**Tamat.**" ends 73.300; "**Setiap** kali…" starts 75.300. Split: tape-snap window 73.300–73.700 + **1.600 s TRUE-ZERO dread silence 73.700–75.300** (mute ambience and vocal) |

**Drift to reconcile:** rewind 1 narration sits **2.56 s early** vs its provisional frame time, rewind 2 **0.60 s early**, rewind 3 **0.90 s late**; speech ends 152.000 vs provisional 152.5. Keep the three 12-frame intervals and `blackoutFrame: 4611` exactly as locked; stretch/hold panel times between intervals to the measured anchors. The 1.6 s dread silence must land in video time immediately after `branchRewinds[2]`'s 0.4 s window (silence covers the start of P12, whose realization speech begins at 75.300).

## `voice-sfx` assets (separate clips — never parsed into the narrator track)

| Asset | File | Duration | Cue (prepared timeline) | Mix note | Caption |
| --- | --- | --- | --- | --- | --- |
| COPILOT "Gantian, bang?" | `sfx/voice-copilot-gantian.wav` (also in `public/assets/004-tangan-pilot-kemarin/sfx/`) | 0.715 s | **24.900 s** — right after the narrator says "gantian" (24.360–24.860), before "tolak." (ends 25.840). Provisional cue-sheet slot was ~00:26.5 | Dry close interior, **no acoustic processing**; level under narration | Yellow, labeled `COPILOT` |
| Restrained copilot groan (Loop 2) | `sfx/voice-copilot-groan.wav` | 0.745 s | **57.000 s** — inside the protected beat "terjepit." (ends 56.960) → "Ambruk." (starts 57.720) | Clip is ~30 ms longer than the beat; trim its tail ~50 ms in the mix if needed. Filter-safe, no wet/bone texture; mix restrained under the muffled thud | None (non-verbal) |

Listening-in-context for the two copilot clips (AI-generated, Charon voice) is still pending — the owner's approval covers the narrator stem only. Sources and rights: `public/sfx/LICENSES.md`, "Standalone Scenario 04" section; [assets.md](assets.md).

## Tape-snap SFX (three cues, one asset)

`sfx/tape-snap-rewind.wav` — 0.400 s exactly, sample peak −1.0 dBFS, locally synthesized (no third-party rights). Anchor one instance at each rewind gap start: **43.440 / 58.500 / 73.300 s**, i.e. sample offset `Math.round(startFrame * sampleRate / fps)` at the `branchRewinds[i].startFrame` boundary. Same clip all three times; rewind 3's snap must stop before the true-zero window opens at 73.700.

## Tail (P24) and mix targets

- Last spoken word "sampai." ends **152.000 s**; tension ramp 3–4 s underneath the final line; **150 ms vacuum**; one restrained low sub-hit with the 1–2 frame red flash inside the **152.650–153.700** window; hard cut to black **153.700–154.000** (`blackoutFrame: 4611`).
- Final mix: −14 LUFS integrated, ≤ −1.5 dBTP after AAC; measure on the compressed export.
- Deliberate silence protections: the three rewind gaps above (do not let ambience bleed into rewind 3's true-zero), plus the silent red-strobe reveal beats P01/P03 (rewatch clue — **no sound accent**) and P09's strobe stays under the diegetic groan/thud only.

## Still open for assembly

Remaining cue-sheet foley/beds (rotor bed, panel hum, paper tap, static burst, flashlight click, metal shudder, muffled thud, fuel tick, reserve-valve clack, rotor scream, mountain impact, pedal friction, airframe creak, tension ramp, eerie-smooth rotor, cloud-wall pass rumble, runway hum, relieved breath, touchdown, spin-down, cyclic click, page flip, pencil tick, vacuum + sub-hit) are not prepared as assets yet — source or synthesize per the cue sheet and the shared CC0 libraries, and log provenance in `public/sfx/LICENSES.md`. Impact cues sync ±1 frame with `ImpactMicroShake` (P07/P09/P11).
