# Episode brief — [episode ID and working title]

Copy this into `episodes/<slug>/brief.md`. Complete each step before starting the next.

## Standalone Scenario

- **Collection and scenario** — [collection link and independent scenario title. Start with Pilot 01 only.]
- **Pipeline Version (v2)** — [set manifest `pipelineVersion: 2`; `script.engine: "triple-branch-rewind"` for new scenarios]
- **Target Runtime** — **145–160 s total** (validator band for `triple-branch-rewind`), including dialogue, deliberate silences and the final tail
- **Spoken budget** — **225–245 canonical words** for new scenarios (recalibrated 2026-11-23: at the measured ~1.70 words/s delivery this is 132–144 s of speech, leaving room for the rewinds, dread silence and tail without crushing pauses; Episodes 001–005 keep the grandfathered 245–265 band). Hyphenated compounds such as `baling-baling` count as **one** word (`node scripts/count-narration-words.mjs <narasi.txt>`; record both counts in the brief)
- **Setting and opening state** — [fresh location, immediate trap, stakes or timer, and objects available at the start]
- **Protagonist silhouette** — [fresh identity, shape and clothing. Link the scenario's character sheet when available.]
- **Self-contained resolution** — [how this video resolves its puzzle]

Use only the clues and context established within this video. Record the scenario's character sheet in the asset handoff.

## Single Timing Authority

Precedence is fixed and runs one way:

1. **This brief's timings are provisional story order only.** Frame numbers, beat windows and panel times here describe intent; they are never composition timing.
2. **`audio-edit-map.json` is the composition timeline authority** once the narration is locked. It is the PCM-verified output of `scripts/prepare-narration.mjs` (sample-exact gaps, frame-aligned claimed-silent windows, `assemblerHandoff` anchors).
3. **Everything downstream consumes it**: manifest `timing.*`, captions, cuts, world-voice/foley cue placement, the mix and the export verifier. The assembler re-anchors the brief's provisional numbers to the measured map; the validator rejects drift.
4. **Mismatches fail loudly** (validator, verifier, QA) — they are never reconciled by editing prose, estimates or timing sidecars to match each other.

## 1. Write the script

- **Narrative engine** — **Triple-Rewind** (`triple-branch-rewind`): three escalating bad-branch loops, then the winning execution under pressure. `earned-consequence` pressure may add cost inside a loop.
- **Core Dilemma & Bad-Decision Payoff** — [normal instinct, lethal outcome and planted physical cause. Name the harder escape and its complication.]
- **Hook rule** — the opening line states this scenario's specific danger or constraint, is **at most 6 canonical words** (hyphenated compounds = 1), and must measure **≤ 3.0 s** in the raw take (`scripts/prepare-narration.mjs` enforces this; its default limit is 3.0 s). Never speed the voice to fit. The generic two-sentence warning shape (“…Salah gerak, tamat.”) is forbidden as a hook template.
- **Hook trim fallback** — [name the exact filler word to drop and its neighboring-word context, so Agent 02 can cut it from the prepared track without a regeneration round-trip if the measured hook exceeds 3.0 s; or write `none needed` when the hook comfortably fits]. Example: drop `itu` in “Tangan di tuas itu bukan tanganmu.” (context: after `dituas`, before `bukan`). *This field is required and validated non-empty.*
- **Spoken script** — [link `narasi.txt` and both word counts]. Use Bahasa Bayi with short everyday Indonesian sentences. Let the clues, action and silence set the word count. Keep all-caps comic SFX (`BRAK!`, `KLIK!`) out of the script — they live in the cue sheet.

### Scripting rules (from the Episodes 001–005 narrative audit)

- **3-Chunk Sensory Opening (P01–P05).** Weave the setup into three connected beats — *Immediate Cage → Uncanny Anomaly → Physical Constraint* — not an eight-item prop inventory dump. [Cage]: … [Anomaly]: … [Constraint]: …
- **Loop grammar.** Each loop names its **decision owner and human motivation** (grounded panic, trust, guilt, pride — never three identical `Instingmu:` labels); every action and consequence carries an explicit subject; each failed loop ends cleanly on **`Tamat.` + paragraph break** so the TTS release leaves a natural gap for the 0.4 s rewind.
- **Chronological SFX-anchor syntax.** A sentence anchoring a foley transient carries **one action only**, in *prep → action → isolated sound beat* order. Never place a qualifying clause (e.g. “Jangan ditekan.”) between the sound trigger and its reaction.
- **Motif, human beat, earned close.** One recurring motif phrase paid off **≥ 3×** (last use recontextualizes it); one brief human warmth/stake beat inside P01–P05; a motif-earned closing line — do not default verbatim to “Kamu berhasil bertahan hidup.” Short diegetic `voice-sfx` lines (caption-labeled) add character color outside the word cap.
- **Entity Rule Boundary** — [what the threat/entity can do (its rule)]: … **The defect that traps it** [what it cannot do]: … The winning escape exploits this stated defect.
- **Spatial vectors** — [only when physics/direction drives the climax: name the direction, origin and target for each climax-critical movement (bank angle, door side, rotor side, gravity)]: …

### Loop Learning Map

One distinct fact per loop; if two loops teach the same fact, merge or differentiate them.

| Loop | Distinct fact revealed (what the survivor now knows) |
| --- | --- |
| 1 | |
| 2 | |
| 3 | |

### Brief-closed cold-read audit (log before handoff)

| Question | Loop 1 | Loop 2 | Loop 3 |
| --- | --- | --- | --- |
| WHO acts (explicit subject)? | | | |
| WHAT does it trigger? | | | |
| WHY is it fatal? | | | |

Stranger test: can someone who has not read this brief explain, in one sentence, why the final move worked? [their sentence]. Pronoun audit: every plot-bearing `dia` / `itu` / `yang` / `dua-duanya` has exactly one possible referent on a single listen. [checked / fixed list].

### Three-Loop Grouping

| Panels | Beat | Budget |
| --- | --- | --- |
| P01–P05 | Hook (≤3.0 s), setting, and **all** Fair-Play clues planted | ~20–25 s |
| P06–P11 | Three escalating bad branches, two panels each (~10–14 s per loop including its 0.4 s rewind), a different believable human instinct per loop | ~45–60 s |
| P12–P24 | Post-rewind-3 realization, the winning survival execution under pressure, climax, clean ending | ~70–90 s |

### Triple-Rewind Continuity Map

Fill one row per loop. State what the world does when the tape snaps back.

| Loop | Resets to (decision point) | Decision owner + human motivation | Protagonist knowledge carried forward | Environment state across loops | Panels | Fatal consequence shown |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | [the exact choice point the rewind returns to] | [WHO decides, and the grounded motivation: panic / trust / guilt / pride] | [what the protagonist now knows that they did not before] | [resets identically / degrades: describe what persists, e.g. fuel still lower] | P06–P07 | [outcome in red/amber] |
| 2 | [decision point] | [WHO + motivation] | [new knowledge] | [reset / degrade] | P08–P09 | [outcome] |
| 3 | [decision point] | [WHO + motivation] | [new knowledge] | [reset / degrade] | P10–P11 | [outcome] |

### `branchRewinds` — **PROVISIONAL until measured**

The frame numbers below come from this brief, **not from measured audio**. Agent 02's `audio-edit-map.json` (PCM-verified) replaces them at assembly; the manifest and mix must consume the measured `assemblerHandoff.rewindSnapAnchors` values, never this block.

```json
{
  "provisional": true,
  "timing": {
    "branchRewinds": [
      {"startFrame": 1380, "endFrame": 1392, "afterSpoken": "[tail word of loop 1]", "note": "Loop 1 snaps straight back; zero dead air beyond the 0.4 s rewind"},
      {"startFrame": 1773, "endFrame": 1785, "afterSpoken": "[tail word of loop 2]", "note": "Loop 2 snaps straight back"},
      {"startFrame": 2172, "endFrame": 2184, "afterSpoken": "[tail word of loop 3]", "note": "Loop 3: 0.4 s tape-snap, then the episode's only true-zero dread silence (1.2–1.6 s) before the winning realization"}
    ],
    "dreadSilenceFrames": "[startFrame, endFrame]"
  }
}
```

### Fair-Play Clue Ledger

Complete the ledger for every physical cause of the bad outcome and every object or detail used in the escape. Plant each one naturally before the decision or danger. Let the viewer see it or pick it up casually before revealing its purpose. The inference column is the audit: if the viewer cannot make the inference from the evidence alone, the row is not yet a clue.

| Clue ID | Planted at Panel/Line (Setup) | Viewer Inference (evidence → inference → enables escape) | How It Pays Off (Bad Outcome or Smart Escape) |
| --- | --- | --- | --- |
| [ID and physical detail] | [Opening panel and/or line where the clue is readable] | [observable evidence → what the viewer infers → how it enables the escape] | [Outcome or escape step that depends on it] |

## 2. Lock one ShortZ master

- Reuse the existing prepared Investigator take when available; otherwise generate the whole script in **one ShortZ `gemini-3.8-flash-tts` request**. Record [master path], [voice ID and settings], [generation date] and [word timestamps]. Keep the master and timing sidecar with the episode. The owner accepts this narrator automatically; do not require a separate listening approval or claim a review was performed.
- **Measured narration duration** — [___ s]. Allow room for dialogue, foley and deliberate silences inside the 145–160 s band.
- **Preparation** — run the shared [`scripts/prepare-narration.mjs`](../scripts/prepare-narration.mjs) with an episode `narration-prep.json` (tightening thresholds, exact rewind/dread gaps, the hook trim fallback authorized above, protected beats and world-voice flanking gaps, tail pad). It writes the PCM-verified `audio-edit-map.json` that becomes the timeline authority.
- **Preparation pronunciation rules** - [optional inline `pronunciation` object in `narration-prep.json`: `renames`, `splits`, `merges`, optional `contextBefore`/`contextAfter` and exact `count`; see the [audio producer contract](../agents/02-audio-producer.md)]. Copy the shared dictionary rules inline if needed; preparation retains raw hyphenated tokens for anchors, while the checker splits them for comparison. Record estimated split boundaries and any actual listening separately.
- **Pronunciation gate** — run [`scripts/check-pronunciation.mjs`](../scripts/check-pronunciation.mjs); only genuinely new ASR suspects escalate, and ASR text alone never establishes pronunciation.
- **Diegetic World Voices / Dialogue** — [multiple beats with speaker, line or action, cue time, acoustic perspective, 1–3 s dread silences and caption label or color]
- **Audio handoff** — [owner-accepted narration, known ASR uncertainties, pauses and gaps reserved for independent SFX; report any review actually performed]

### Mandatory Audio & Foley Cue Sheet

Audit the final narration for every described in-world sound and stop. Keep `investigator` as the sole storytelling narrator; generate a separate world voice (`pa-announcer`, crew voice, `entity-female`) only when the script explicitly speaks one. Record asset paths, exact trigger timing, repeat intervals, rights and the intended silence in the manifest handoff. Mark visual clues that require zero SFX accent. See the [world-audio profiles](../STYLE_GUIDE.md#heard-if-mentioned-world-audio) and the [v2 world-voice recipes](../agents/02-audio-producer.md#v2-world-voice-recipes).

| Beat / Trigger Phrase | Asset Type (foley / voice-sfx / bed-cut) | Acoustic Treatment | Mix Rule |
| --- | --- | --- | --- |
| [Narrated phrase or visual beat and time] | [Asset path and cue type; voice preset if applicable] | [Profile or natural perspective] | [Timing, level/duck, stop, repeat interval or no accent] |

## 3. Plan the panels

### Immutable Set & Identity Anchor

- **Set type, seating and geography** — [aircraft or room model/type, fixed seating and relative positions, right-hand drive where relevant, entry, exit and connecting spaces]
- **Character identity** — [silhouette, clothing and rim colors for each character or anomaly. List the locked sheets.]
- **Fixed prop geometry** — [belt mounts, hinge or slide directions, controls, map placement and construction, barriers, reflection geometry and exact plot-bearing signage]

### Per-Shot State Table

For the 24-panel format, fill every row. Include any separate jolt plate. Record exact narrated wording and the visible action it maps to, or mark a silent beat. Indicate `present`, `absent` or `departed` for the anomaly, `lit`, `dark` or `emergency` for lighting, and `clear`, `rain` or `fog` for weather. List `strobe`, `shake`, `glitch` or `none` in the Remotion effects column. Make rewinds and deliberate changes explicit.

| Panel | Time / camera vantage | Visible people + positions | Anomaly | Key prop states | Lighting | Weather | Exact narrated line and visible action | Remotion effects |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P01 | | | | | | | | |
| P02 | | | | | | | | |
| P03 | | | | | | | | |
| P04 | | | | | | | | |
| P05 | | | | | | | | |
| P06 | | | | | | | | |
| P07 | | | | | | | | |
| P08 | | | | | | | | |
| P09 | | | | | | | | |
| P10 | | | | | | | | |
| P11 | | | | | | | | |
| P12 | | | | | | | | |
| P13 | | | | | | | | |
| P14 | | | | | | | | |
| P15 | | | | | | | | |
| P16 | | | | | | | | |
| P17 | | | | | | | | |
| P18 | | | | | | | | |
| P19 | | | | | | | | |
| P20 | | | | | | | | |
| P21 | | | | | | | | |
| P22 | | | | | | | | |
| P23 | | | | | | | | |
| P24 | | | | | | | | |

### Audio-Visual Feasibility & Prop-State Table

For every narrated physical action, prove the picture can keep up. Fill this after the narration is measured (use the provisional word timings before that, then re-anchor from `narration-timestamps.json`). QA audits these rows in the export: a state change that appears before its narrated cause, or an action that cannot fit its literal screen time without a declared editorial treatment, is a blocker.

| Narrated action (exact line) | Measured speech span (s) | Prop/object state BEFORE | Prop/object state AFTER | Literal screen time | Editorial treatment |
| --- | --- | --- | --- | --- | --- |
| [e.g. “Satu ketukan kemudian, sabuk ketiga kebuka sendiri.”] | [start–end from narration-timestamps.json] | [belt closed, tongue lifted, pilot belt still fastened] | [third belt visibly open] | [x.x s at real time] | [real-time / editorial slow-motion: how the state change is spread across panels] |

Rules: the **literal screen time** is the measured speech span (plus reserved cue room). If the physical action cannot plausibly complete inside it, the brief must declare **editorial slow-motion** — the state change begins before the line or continues after it, panel by panel, and each affected panel's before/after state is written out. A reaction shot never substitutes for the narrated action.

- **Final jolt and tail** — [dedicated close-up/lunge panel or snap-zoom, concrete action, 3–4 s narration ramp, 120–180 ms silence, 0.7–1.1 s jolt and 0.2–0.3 s hard black. Fit the post-narration beat in 1.0–1.5 s.]

- **Asset and rights record** — [batch path, prompts, tools, voice rights, credits and any external dependencies]

## 4. Assemble and review

- **Composition** — [ID, manifest, FPS, frame duration, 9:16 dimensions, output version and preview]. Measure the cut against the **145–160 s** `triple-branch-rewind` band; the validator fails outside it.
- **Opening cover** — Set `openingTitle` to [3–4 punchy, conversational words]. Show it **00:00.0–00:01.8** in the upper center of the centered **3:4** safe zone. Use **00:00.2** for the TikTok cover. Flash-frame thumbnails are prohibited.
- **Captions and HUD** — Align to the locked narration via `narration-timestamps.json`; captions must match the spoken form (a dropped hook filler word is dropped on screen too). Record matching numeric strings such as `60%`, `03:00` or `PUKUL 3 PAGI`.
- **Review and delivery** — [validator result, review link and export path if requested]. Complete the [pre-publish review](review.md) and record any owner feedback or decision.
