# Episode brief — [episode ID and working title]

Copy this into `episodes/<slug>/brief.md`. Complete each step before starting the next.

## Standalone Scenario

- **Collection and scenario** — [collection link and independent scenario title. Start with Pilot 01 only.]
- **Pipeline Version (v2)** — [set manifest `pipelineVersion: 2`]
- **Target Runtime (2.0–3.0m)** — [120–180 s, including silence and final tail]
- **Setting and opening state** — [fresh location, immediate trap, stakes or timer, and objects available at the start]
- **Protagonist silhouette** — [fresh identity, shape and clothing. Link the scenario's character sheet when available.]
- **Self-contained resolution** — [how this video resolves its puzzle]

Use only the clues and context established within this video. Record the scenario's character sheet in the asset handoff.

## 1. Write the script

- **Narrative engine** — Branch-Rewind. Earned consequences can add pressure or cost.
- **Core Dilemma & Bad-Decision Payoff** — [normal instinct, lethal outcome and planted physical cause. Name the harder escape and its complication.]
- **First sentence** — [immediate trap and stakes that read within three seconds for a first-time viewer]
- **Spoken script** — [link and count]. Use Bahasa Bayi with short everyday Indonesian sentences. Let the clues, action and silence set the word count.

| Approximate time | Story beat |
| --- | --- |
| 0:00–0:30 | Hook, stakes or timer, and planted environment |
| 0:30–1:15 | Tempting bad decision, explained physical cause and lethal red/amber outcome |
| 1:15–2:30 | `branchRewind`, multi-step escape using the planted clues and a pressure complication |
| 2:30–2:50 | Earned escape or logical twist that recontextualizes the opening |

### Fair-Play Clue Ledger

Complete the ledger for every physical cause of the bad outcome and every object or detail used in the escape. Plant each one naturally before the decision or danger. Let the viewer see it or pick it up casually before revealing its purpose.

| Clue ID | Planted at Panel/Line (Setup) | How It Pays Off (Bad Outcome or Smart Escape) |
| --- | --- | --- |
| [ID and physical detail] | [Opening panel and/or line where the clue is readable] | [Outcome or escape step that depends on it] |

## 2. Lock one ShortZ master

- Reuse the existing prepared Investigator take when available; otherwise generate the whole script in **one ShortZ `gemini-3.8-flash-tts` request**. Record [master path], [voice ID and settings], [generation date] and [word timestamps]. Keep the master and timing sidecar with the episode. The owner accepts this narrator automatically; do not require a separate listening approval or claim a review was performed.
- **Measured narration duration** — [___ s]. Allow room for dialogue, foley and deliberate silences in the target runtime. Lock source, duration and word timing before assembly.
- **Diegetic World Voices / Dialogue** — [multiple beats with speaker, line or action, cue time, acoustic perspective, 1–3 s dread silences and caption label or color]
- **Audio handoff** — [owner-accepted narration, known ASR uncertainties, pauses and gaps reserved for independent SFX; report any review actually performed]

### Mandatory Audio & Foley Cue Sheet

Audit the final narration for every described in-world sound and stop. Keep `investigator` as the sole storytelling narrator; only generate a separate `entity-female` or `pa-announcer` voice-sfx when an in-scene voice or PA is explicitly mentioned. Record asset paths, exact trigger timing, repeat intervals, rights and the intended silence in the manifest handoff. Mark visual clues that require zero SFX accent. See the [world-audio profiles](../STYLE_GUIDE.md#heard-if-mentioned-world-audio).

| Beat / Trigger Phrase | Asset Type (foley / voice-sfx / bed-cut) | Acoustic Treatment | Mix Rule |
| --- | --- | --- | --- |
| [Narrated phrase or visual beat and time] | [Asset path and cue type; voice preset if applicable] | [Profile or natural perspective] | [Timing, level/duck, stop, repeat interval or no accent] |

## 3. Plan the panels

### Spatial & Camera Layout

- **Floor plan and route** — [entry, exit, stairs or landings, connecting spaces, and each character’s position at the reveal]
- **Openings and barriers** — [door and window type, hinge and swing direction, bars or glass, which side each character is on, and exact plot-bearing signage]
- **Camera and sightlines** — [where the camera stands, what it looks toward, and which corner, barrier or reflection conceals or reveals the threat. Carry that geometry through the reveal and final jolt.]

For a 2–3 minute cut, plan **roughly 16–26 purposeful 9:16 panels** in Urban Silhouette Noir. Allow 5–9 s for atmospheric shots with slow motion or flicker and cut tightly on action. Keep Indonesian vehicles right-hand drive.

**Show-What-You-Say Panel Lock** — [exact narrated threat or action line | transcript time | panel ID | subject and action visible on screen]. Include each narrated threat and visible action.

| Beat and time | Unique panel and narrative purpose | Motion, HUD or effect |
| --- | --- | --- |
| Hook | [protagonist, situation and threat] | [title and action] |
| Decision and consequence | [choice and visible outcome, one row per panel] | [branch color and any rewind cue] |
| Anticipation and reveal | [protagonist reaction followed by payoff] | [precise sound hit] |
| Post-Narration Final Jolt (1.0–1.5s) | [dedicated close-up/lunge panel or snap-zoom; concrete threat action] | [final 3–4 s narration ramp; 120–180 ms silence; 0.7–1.1 s jolt with shake, 1–2-frame flash and limited stinger; 0.2–0.3 s hard black] |

- **Asset and rights record** — [batch path, prompts, tools, voice rights, credits and any external dependencies]

## 4. Assemble and review

- **Composition** — [ID, manifest, FPS, frame duration, 9:16 dimensions, output version and preview]. Measure the cut against the **120–180 s** target.
- **Opening cover** — Set `openingTitle` to [3–4 punchy, conversational words]. Show it **00:00.0–00:01.8** in the upper center of the centered **3:4** safe zone. Use **00:00.2** for the TikTok cover. Flash-frame thumbnails are prohibited.
- **Captions and HUD** — Align to the locked narration. Record matching numeric strings such as `60%`, `03:00` or `PUKUL 3 PAGI`.
- **Review and delivery** — [validator result, review link and export path if requested]. Complete the [pre-publish review](review.md) and record any owner feedback or decision.
