# Episode brief — 006 · Bioskop Tanpa Pintu

## Standalone Scenario

- **Collection and scenario** — [Skenario Bertahan, Standalone Scenario 06](../arcs/02-skenario-bertahan/arc.json). `@skenarium` anthology. Fully independent of Scenarios 01–05: fresh setting, fresh protagonist, fresh mechanics. The location itself is the anomaly; there is no creature, ghost, mimic or imitator anywhere in this episode.
- **Pipeline Version (v2)** — manifest `pipelineVersion: 2`, `schemaVersion: 2`; `script.engine: "triple-branch-rewind"`.
- **Target Runtime** — **145–160 s total** (validator band), including dialogue, deliberate silences and the final tail. Provisional plan: **154.0 s / 4620 frames at 30 fps**.
- **Spoken budget** — **225–245 canonical words**. Measured: **241 canonical words / 241 if split** (`node scripts/count-narration-words.mjs episodes/006-bioskop-tanpa-pintu/narasi.txt`). At ~1.70 w/s this is ≈ 141.8 s of speech, leaving ~12 s inside 154 s for three 0.4 s rewinds, the Rewind 3 dread silence, breathing pauses and the 1.5 s tail. No pause is crushed to fit words.
- **Setting and opening state** — A single-screen 1970s Indonesian cinema (`bioskop tua`, one studio) at 01:50, the night before demolition. The projectionist is alone on the **open rear balcony** where the projector stands, threading the last reel. The **studio entry door** has latched itself shut behind him; his keys hang on the outside hook, on the other side. The auditorium below has more seat rows than it had four minutes ago. A large white fabric screen and a low stage are straight ahead (north). Red `KELUAR` double doors sit on the back wall under the balcony. A side fire exit is on the left wall. Amber wall sconces and the white projector beam are the only light.
- **Protagonist silhouette** — A male projectionist in his fifties: solid matte `#07080B` silhouette, flat cap, short-sleeve work shirt, lanyard, dark trousers, worn shoes, a slight stoop from years at the projector. Amber rim light from the sconces, white rim light from his own beam. No drawn face, no eyes, no skin tone. Locked as **PROJ-06** in the image handoff.
- **Self-contained resolution** — He stops trying to leave through the doors the auditorium rebuilds. He walks *into* his own projector beam, pushes through the loose fabric screen, crosses the exposed stage and leaves through the open alley roll-up gate behind it. Every clue and every tool is established inside this video.

Use only the clues and context established within this video. Record the scenario's character sheet in the asset handoff.

## Single Timing Authority

Precedence is fixed and runs one way:

1. **This brief's timings are provisional story order only.** Frame numbers, beat windows and panel times here describe intent; they are never composition timing.
2. **`audio-edit-map.json` is the composition timeline authority** once the narration is locked. It is the PCM-verified output of `scripts/prepare-narration.mjs`.
3. **Everything downstream consumes it**: manifest `timing.*`, captions, cuts, world-voice/foley cue placement, the mix and the export verifier.
4. **Mismatches fail loudly** (validator, verifier, QA) — they are never reconciled by editing prose, estimates or timing sidecars to match each other.

## 1. Write the script

- **Narrative engine** — **Triple-Rewind** (`triple-branch-rewind`): three escalating bad-branch loops, each snapped back by a 0.4 s tape-snap rewind, then the winning execution under pressure.
- **Core Dilemma & Bad-Decision Payoff** — Every believable instinct points at a door. The auditorium rebuilds everything *it* made — seats, aisles, side doors, back doors — and always grows *away from the screen*, so retreating lengthens the room and every exit returns him to the same hall at a lying height. The lethal causes are physical and planted: the `KELUAR` doors open onto the balcony edge with no floor beyond; the side fire exit opens onto a rebuilt left balcony ledge and momentum carries him straight through it; killing the projector removes the room's only straight reference and the rows in front grind backward, crushing him against the balcony. The harder escape is forward, through the one thing the room never rebuilt. The complication is that the fabric resists and the aisle behind him folds while he pushes.
- **Hook rule** — `Bioskop ini nggak punya pintu.` — **5 canonical words**, target **≤ 3.0 s** in the raw take. Never speed the voice to fit.
- **Hook trim fallback** — drop **`ini`** (context: after `Bioskop`, before `nggak`), giving `Bioskop nggak punya pintu.` Agent 02 applies this only if the measured hook exceeds 3.0 s; the dropped word is also dropped on screen so captions match the take.
- **Spoken script** — [`narasi.txt`](narasi.txt). **241 canonical words / 241 if split.**

### Scripting rules (from the Episodes 001–005 narrative audit)

- **3-Chunk Sensory Opening (P01–P05).**
  - **[Cage]** The studio entry door latches itself; his keys are on the outside hook, on the wrong side of the door; he is alone on the open rear balcony above a hall he can no longer reach safely.
  - **[Anomaly]** The seat rows have multiplied — twenty rows when he threaded the reel, now running to the far wall — and the bright projector patch on the screen has not moved a millimetre.
  - **[Constraint]** The screen's bottom edge hangs loose 20 cm above the low stage and lifts in a draft from behind it; the red `KELUAR` doors are behind him and the side fire exit is on his left. The daughter's 07:00 school play (`panggung`) is his clock.
- **Loop grammar.** Three different decision owners and motivations, no repeated `Instingmu:` label: **panic/trust** (Loop 1), **testing by momentum** (Loop 2), **angry logic** (Loop 3). Every action and consequence carries an explicit subject (`kamu`, `kursi`, `pintu`). Each failed loop ends on **`Tamat.` + paragraph break**.
- **Chronological SFX-anchor syntax.** Every foley-anchoring sentence carries one action in *prep → action → isolated sound beat* order. E.g. `Kamu taruh senter di kursi lorong.` (action) is a separate sentence from `Sorotnya terang.` (state), so the click and the beam can be cued without a mid-sentence qualifier.
- **Motif, human beat, earned close.** Motif **`Ikutin cahayanya.`** belongs to **him**: it is what he always told his nervous daughter before her school play (`Kamu selalu pesan: ikutin cahayanya.` P05), reused as his own decision at P14, and paid off at P23. The close (`Kali ini, kamu nggak jatuh.`) is earned by the motif and the three falls; it does not default to `Kamu berhasil bertahan hidup.`
- **Place Rule Boundary (Power vs. Defect).** *Power:* the auditorium rebuilds what it made — seats, aisles, side walls, side doors, back doors — and only ever grows **away from the screen**; anything that leaves through a rebuilt opening is returned to the hall at a height the room chooses. *The defect that traps it:* it cannot rebuild the cinema's **original fixtures** — the screen, the stage and the projector beam. The screen is stretched fabric on a 1970s frame, not a structural wall, and the room never built behind it because the screen already covered the gap. The winning escape exploits exactly that stated defect and invents no new weakness at the climax.
- **Spatial vectors.** Forward = **north, toward the screen**. The walk follows the **beam footprint on the floor** from the balcony base, straight down the centre aisle, to the **screen centre at the bottom edge**. The push is **north through the fabric**, then the survivor turns **stage-right (east) six metres** along the backstage brick wall to the **roll-up gate on the alley**. The retreat vectors he rejects are **south** (red `KELUAR` doors under the balcony) and **west** (side fire exit).

### Loop Learning Map

One distinct fact per loop; if two loops taught the same fact, merge or differentiate.

| Loop | Distinct fact revealed (what the survivor now knows) |
| --- | --- |
| 1 | **The back is a lie.** The red `KELUAR` doors open onto the hall's own balcony edge; the room grows south and the floor beyond the doors is missing. |
| 2 | **The sides are a drop, and the room returns objects but cannot rebuild the screen.** The side exit opens onto a rebuilt left balcony ledge, so momentum carries him through it; while falling he sees the aisle seat empty — the room returned the flashlight to the pedestal — and the screen's loose edge still lifting in the same place. |
| 3 | **The beam is the anchor.** Killing the projector removes the only straight reference; the rows **in front** grind backward toward the balcony and crush him against it, so the beam's landing point is the one surface that never moves. |

### Brief-closed cold-read audit (log before handoff)

| Question | Loop 1 | Loop 2 | Loop 3 |
| --- | --- | --- | --- |
| WHO acts (explicit subject)? | The projectionist (`kamu`) runs from the balcony to the red `KELUAR` doors. | The projectionist (`kamu`) leaves his lit flashlight on an aisle seat, then sprints through the left fire exit. | The projectionist (`kamu`) switches off the projector. |
| WHAT does it trigger? | The doors open onto the balcony edge; the hall is on the other side and the floor ahead is empty air. | The exit opens straight onto a rebuilt left balcony ledge and his own momentum carries him over it. | The screen and hall go dark; the seat rows in front of him grind backward and close on the balcony. |
| WHY is it fatal? | He steps out of a door that has no floor behind it and falls into the seat rows from balcony height. | He falls from the rebuilt left balcony ledge; while falling he sees the empty seat and the unchanged screen edge — proof, not a rescue. | With the beam gone the room has no straight reference, and the rows crush him against the rear balcony. |

Hook payoff audit: `Bioskop ini nggak punya pintu.` is literal at P22 — the cinema's rear wall is solid brick where the red `KELUAR` doors would surface; no door, frame or lintel. **Checked.**

Stranger test: *“Every door in that cinema looped back into the same hall, but the screen was the one thing the room never rebuilt, so the way out was through the screen.”* Pronoun audit: `Kain itu` (P13) has one referent — the screen fabric named in the previous sentence. `biang keladinya` (P10) has one referent — `cahaya`. `kursinya` (P09) has one referent — the aisle seat named in P08. `Ujung kainnya` (P09) has one referent — the screen fabric named in P04. `Kuncinya` (P02) has one owner — the studio entry door. No ambiguous `dia` appears anywhere in `narasi.txt`. **Checked, no fixes needed.**

### Three-Loop Grouping

| Panels | Beat | Budget |
| --- | --- | --- |
| P01–P05 | Hook (5 words, ≤3.0 s), single-hall geography, daughter's stake, and setup clues C1–C4 + C10; loop markers C5–C8 are planted inside their loops | 38.0 s |
| P06–P11 | Three escalating bad branches, **2 panels each** (~15–21 s per loop including its 0.4 s rewind), a different believable instinct per loop | 55.0 s (incl. Rewind 3 + dread silence) |
| P12–P24 | Post-rewind-3 realization, the winning walk into the beam, the screen push, backstage exit, exterior payoff, climax and clean ending | 61.0 s |

**Panel renumbering note:** Loop 2 is **P08–P09** and Loop 3 is **P10–P11**. The backstage/alley run is six real plates: **P19** backstage wide, **P20** gate insert, **P21** duck-out, **P22** brick payoff, **P23** final line, **P24** gate-slam jolt. There is no black plate; the final 0.3 s black is procedural in Remotion. `Per-Shot State Table`, `Triple-Rewind Continuity Map` and this grouping all use this numbering.

### Triple-Rewind Continuity Map

| Loop | Resets to (decision point) | Decision owner + human motivation | Protagonist knowledge carried forward | Environment state across loops | Panels | Fatal consequence shown |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | The balcony rail beside the projector, keys still outside the studio door | **Him, panic and trust** — the red `KELUAR` sign is the only official exit he has ever used | The back doors are a loop; the hall is behind them | **Resets identically.** Same 20-row hall, same lit beam, same keys. Clean tape snap, no degradation. | P06–P07 | He steps through the `KELUAR` doors onto empty air and falls into the seat rows from balcony height. Harsh red wash. |
| 2 | The balcony rail beside the projector; the flashlight is back on the pedestal, unlit | **Him, testing by momentum** — mark the world, then commit to a second exit at a run | The side exit is a drop, not a path; the room rebuilds loose objects; the screen edge does not change | **Degrades in one visible way only:** the aisle seat where the flashlight lay is empty, and the flashlight is back on the projector pedestal, proving the room returned it. Everything else resets identically. | P08–P09 | He runs through the fire exit onto a rebuilt left balcony ledge and falls; mid-fall he sees the empty seat and the unchanged screen edge. Harsh red wash. |
| 3 | The balcony rail beside the projector; flashlight on the pedestal; projector running | **Him, angry logic** — if the light is causing this, kill the light | The beam is the room's only straight anchor; darkness collapses it from the front | **Resets identically** to the post-Rewind-2 state, then the projector is switched off inside the loop. The rewind restores the beam. | P10–P11 | The hall goes black and the rows in front grind backward, crushing him against the rear balcony. Harsh red wash, then true-zero dread silence. |

### `branchRewinds` — **PROVISIONAL until measured**

The frame numbers below come from this brief, **not from measured audio**. Agent 02's `audio-edit-map.json` (PCM-verified) supersedes every value in this block; the manifest and mix must consume the measured `assemblerHandoff.rewindSnapAnchors` and never this JSON.

```json
{
  "provisional": true,
  "supersededBy": "audio-edit-map.json (PCM-verified, scripts/prepare-narration.mjs)",
  "fps": 30,
  "timing": {
    "branchRewinds": [
      {"startFrame": 1653, "endFrame": 1665, "afterSpoken": "Tamat. (loop 1)", "note": "Loop 1 snaps straight back; zero dead air beyond the 0.4 s rewind"},
      {"startFrame": 2265, "endFrame": 2277, "afterSpoken": "Tamat. (loop 2)", "note": "Loop 2 snaps straight back"},
      {"startFrame": 2736, "endFrame": 2748, "afterSpoken": "Tamat. (loop 3)", "note": "Loop 3: 0.4 s tape-snap, then the episode's only true-zero dread silence (1.4 s) before the winning realization"}
    ],
    "dreadSilenceFrames": [2748, 2790],
    "blackoutFrame": 4611
  }
}
```

### Fair-Play Clue Ledger

| Clue ID | Planted at Panel/Line (Setup) | Viewer Inference (evidence → inference → enables escape) | How It Pays Off (Bad Outcome or Smart Escape) |
| --- | --- | --- | --- |
| C1 **Beam patch never moves** | P01 wide, P04 close, repeated after every rewind | The bright patch on the screen sits in the identical spot each loop → the screen is not being rebuilt → it is an original fixture | Proves the screen is the one fixed surface; the escape walks to it |
| C2 **Loose bottom edge + draft** | P04, P05, P13 | The bottom edge lifts and dust drifts upward from behind it → there is open space behind the fabric → the screen is not backed by a wall | The push-through at P17–P18 |
| C3 **Small corner tear** | P04, P13 | A 15 cm split at the screen's lower-left, light bleeding through → the fabric is thin and already open | He widens it with both hands at P18 |
| C4 **Low stage lip** | P01, P04, P13 | A 0.6 m stage with a visible lip under the screen → climbable in one step → he can reach the fabric | P17 climb |
| C5 **Lit flashlight** | P08, seen again at P09 | A hard white bar of light on an aisle seat → a movable object the room can see → after the reset it is gone from the seat and back on the pedestal, so the room returns loose objects to their starting places | Confirms the screen's survival; motivates the C1 inference |
| C6 **`KELUAR` doors return to the hall** | P06–P07 | The doors open onto the hall from the balcony edge → the back is a loop with no floor | Loop 1 death; rejects the back |
| C7 **Side exit returns at balcony height** | P08–P09 | The fire exit opens onto a rebuilt left balcony ledge and his momentum carries him over → sides are a drop | Loop 2 death; rejects the sides |
| C8 **Projector switch** | P10 | A visible metal switch on the pedestal → he can kill the light | Loop 3 death; proves the beam anchors the room |
| C9 **Roll-up gate + cold dawn** | P20, P21 | Cool light under a half-open steel shutter, visibly different from the red doors → the alley is real and outside | Final exit |
| C10 **Clock 01:50 + 07:00 play** | P05 clock + P05 line | The wall clock reads 01:50; he says the play is at seven → he has a deadline and a reason to live | Human stake, not a mechanism |
| C11 **Exterior wall has no red door** | P22 | Outside, the cinema's alley wall is solid brick where the red `KELUAR` doors should be → the red doors never existed outside the rebuilt hall → the hook was literally true | Pays off `Bioskop ini nggak punya pintu.` and closes the loop on the whole location |

**Answer-before-question:** every item above is readable in P01–P05, P08–P10, P13 or P19–P22, before or at the action that depends on it. No hidden flaw, no tool introduced at the payoff. The screen push uses only the loose edge, the tear, the stage and his hands — all planted.

## 2. Lock one ShortZ master

- **Source** — one continuous take of [`narasi.txt`](narasi.txt), generated in **one ShortZ `gemini-3.8-flash-tts` request** with the locked Investigator narrator. No multi-speaker parsing. Owner acceptance of the Investigator voice is recorded per the standing workflow; no separate listening approval is implied here and no review has been performed yet.
- **Measured narration duration** — *to be recorded by Agent 02.* Provisional estimate 141.8 s of speech.
- **Preparation** — run `scripts/prepare-narration.mjs` with an episode `narration-prep.json`: exact 0.400 s rewind gaps after each `Tamat.` block, a 1.400 s true-zero dread silence after Rewind 3, the hook trim fallback above authorised, protected one-beat pauses before P07 / P09 / P11, and a 1.5 s tail pad.
- **Hook trim authority** — if the raw hook exceeds 3.0 s, cut `ini` from `Bioskop ini nggak punya pintu.` and drop it from the caption too.
- **Pronunciation gate** — run `scripts/check-pronunciation.mjs`. New watchwords to verify: `nyusurin` (may ASR as `menyusuri`), `ketiup` (may ASR as `tertiup`), `nyampe` (may ASR as `sampai`), `kursinya`, `matiin`, `nggak`. Only genuinely new suspects escalate; ASR text alone never establishes pronunciation.
- **Diegetic World Voices / Dialogue** — none. The script reports the father's line (`Kamu selalu pesan: ikutin cahayanya.`) and never speaks a second voice in scene; no `pa-announcer` or `entity-female` cue is authorised. All world audio is foley and ambience.
- **Audio handoff** — owner-accepted narrator, known ASR uncertainties, three rewind gaps, one dread silence and the tail reserved for independent SFX.

### Mandatory Audio & Foley Cue Sheet

Audit the final narration for every described in-world sound and stop. Keep `investigator` as the sole storytelling narrator.

| Beat / Trigger Phrase | Asset Type | Acoustic Treatment | Mix Rule |
| --- | --- | --- | --- |
| P02 `Pintu masuk studio ketutup sendiri.` | foley — heavy studio door latch + soft wooden slam | Dry, close, 1.2 m perspective | Single click at the latch, then the door weight; −18 dB under voice; no reverb tail |
| P01–P10 continuous projector | bed-cut — 24 fps projector clatter + motor hum | Warm, slightly boxy, mono-compatible | −26 dB bed, ducked −4 dB under voice; hard stop at the P10 switch |
| P04 `ketiup angin` (bottom edge lifting) | foley — low draught, fabric flutter | Behind-wall-ish, airy, no whistle | −30 dB; **no accent on the beam patch** (silent rewatch clue) |
| P06 `Dua daun merah kebuka.` | foley — heavy double push-bar exit doors | Dry, back-row perspective | Both leaves on the verb; latch clack, then hinge groan; −16 dB; no music |
| Rewind 1 (frame 1653) | foley — tape snap + reverse whoosh | Non-diegetic glitch | 0.400 s exactly; full level; no silence after |
| P08 `Kamu taruh senter di kursi lorong.` | foley — flashlight body on upholstery + switch click | Dry, 2 m perspective | Click on `taruh`, thud on `kursi`; −16 dB; leave 0.3 s before `Sorotnya terang.` |
| P09 `Pintunya kebuka.` | foley — push-bar fire door | Metal, medium room | −15 dB; one action only |
| P09 fall | foley — air rush, cloth flap, body impact on seats | Wide, no music | Starts after `balkon kiri`; impact under `Tamat.`; −12 dB |
| Rewind 2 (frame 2265) | foley — tape snap + reverse whoosh | Non-diegetic | 0.400 s exactly; no silence after |
| P10 `Kamu matiin proyektor.` | foley — heavy toggle switch, motor spin-down | Close, mechanical | Switch on the verb, spin-down 1.6 s; bed fades to true zero |
| P11 `Baris kursi di depanmu berderak, mundur,` | foley — timber stress, rows grinding on bolts, low rumble | Wide, low, sub-heavy | Rises from −24 to −10 dB; no music |
| Rewind 3 (frame 2736) | foley — tape snap + reverse whoosh | Non-diegetic | 0.400 s, then 1.400 s true-zero dread silence (frames 2748–2790); no bed, no room tone |
| P12 `Lampu proyektor nyala.` | foley — projector strike + clatter restart | Same bed as P01 | Snap to −26 dB; one clean restart, no stutter |
| P17–P18 screen push | foley — fabric stretch + seam tear | Close, fibrous; no music sting | Slow build under `Kainnya berat.`; tear on `Kamu dorong lagi.`; −14 dB |
| P19–P23 backstage/alley dawn | ambience — open alley, distant traffic, birds | Open, cool, wide stereo | Fade in from −34 dB under `Di balik layar`; never louder than voice |
| P24 roll-up gate slam | foley — steel shutter drop + chain rattle | Hard, close, sub thump | Triggered after the final word; tail jolt layer |

**Silent rewatch clues (no SFX accent):** the unchanged projector patch on the screen (C1); the loose bottom edge lifting (C2); the empty aisle seat seen mid-fall (C5); the blank brick where the red door should be (C11).

## 3. Plan the panels

### Immutable Set & Identity Anchor

- **Set type, seating and geography** — ONE unified 1970s cinema auditorium, never a corridor or a second room. **20 rows × 18 seats** at the start, centre aisle 1.2 m wide, two side aisles; the room visibly adds rows from P03 onward (26+), and every rewind restores the count to 20. **North (screen wall):** 12 m × 5 m white fabric screen on a steel frame, bottom edge 20 cm above a **0.6 m low stage** that runs the full width; stage lip visible. **South (back wall):** red `KELUAR` double doors at ground level, centred under the balcony; a wall clock reading **01:50** sits at balcony level directly above them, visible from the balcony. **West (left wall):** amber sconces every 3 m and one side fire exit at row 7 with a push bar. **East (right wall):** matching sconces, no exit. **Back-centre, elevated:** open projector balcony at 2.4 m with a steel stair at centre-back descending to the centre aisle; a **studio entry door at the west end of the balcony wall** (the locked door, keys on an outside hook visible through a wired-glass pane) and a wheeled projector pedestal at the north rail. **Backstage (only after P18):** raw brick, exposed pipes, dust, a 6 m stage-right walk, and a half-open steel roll-up gate on the east wall. **Alley (P21–P24):** an L-shaped service alley outside the gate, running south along the east wall to the cinema's rear wall; P21 is the duck-out, P22 is the corner view of that rear wall — uninterrupted brick where the red doors would surface, with no door, frame or lintel.
- **Character identity** — **PROJ-06**, the projectionist: male, fifties, flat cap, short-sleeve shirt, lanyard, dark trousers, worn shoes, slight stoop. Solid `#07080B` silhouette, no facial features, amber rim from the sconces / white rim from the beam. Silhouette locked across all 24 panels; no other person appears.
- **Fixed prop geometry** — projector pedestal at the balcony's north rail with a visible metal toggle switch on its right side and a reel on top; keys on the outside hook of the studio entry door, visible through its wired-glass pane; one heavy handheld flashlight with a wide white beam; the screen's bottom edge rests 20 cm above the stage, lifting ~5 cm in the draft, with a 15 cm tear at its lower-left; the stage lip at 0.6 m; the roll-up gate opening 2.8 m wide, half open at 1.4 m. **No windows anywhere in the hall.** Screen frame, doors, sconces, clock and stage lip never change shape between loops.

### Per-Shot State Table

All times provisional story order. Weather: `clear` for every interior panel; no rain, fog or exterior leakage. The alley in P21–P24 stays dry under cold dawn light.

| Panel | Time / camera vantage | Visible people + positions | Anomaly status | Key prop states (beam / hem / flashlight) | Lighting | Weather | Exact narrated line and visible action | Remotion effects |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P01 | 00:00.0–00:05.0 / wide low angle from the front row, looking back at the balcony | PROJ-06 at the projector, full body, facing the hall | present | Beam on; reel turning; 20 rows visible | amber + white beam | clear | `Bioskop ini nggak punya pintu.` — he stands silhouetted behind the beam | HoverDrift |
| P02 | 00:05.0–00:14.0 / medium at the studio entry door, one fixed vantage | PROJ-06 full body at the latch, hand on the handle | present | Entry door latched; keys on the outside hook behind the wired-glass pane; beam on | amber | clear | `Bioskop tua. Kamu tukang proyektornya, di balkon belakang.` then `Pintu masuk studio ketutup sendiri. Kuncinya di luar.` — his hand works the latch; the keys hang beyond the glass | HoverDrift |
| P03 | 00:14.0–00:20.0 / high POV down from the balcony rail | PROJ-06's forearms on the rail, no full body | present | Rows run past the far wall line; same beam patch | amber + white | clear | `Di bawah, kursi nambah. Tadi dua puluh, sekarang nyampe ujung.` — he leans over the rail | HoverDrift, subtle parallax |
| P04 | 00:20.0–00:26.0 / low side angle across the stage to the screen | PROJ-06 at frame right edge, half body | present | Bottom edge lifting 5 cm; corner tear catching light | amber + white | clear | `Layar putih besar di depan. Ujung bawahnya longgar, ketiup angin.` — the edge moves, dust drifts | HoverDrift |
| P05 | 00:26.0–00:38.0 / over-shoulder, looking south then west | PROJ-06 full body, back to camera | present | Red glow from the `KELUAR` doors below; wall clock 01:50 at balcony level; side exit visible far left | amber + red spill | clear | `Pintu keluar merah di belakang. Pintu darurat di kiri. Tujuh pagi anakmu tampil. Kamu selalu pesan: ikutin cahayanya. Kamu janji nonton.` — he turns his head between the two exits, then looks at the clock | HoverDrift, sconce flicker |
| P06 | 00:38.0–00:43.5 / tracking behind him down the steel stair to the back row | PROJ-06 full body, running south | present | Doors shut, then thrown open at the panel end; hands on the bar | amber → red | clear | `Kamu lari ke pintu keluar. Dua daun merah kebuka.` — he reaches the bar and both leaves swing open | ImpactMicroShake |
| P07 | 00:43.5–00:55.1 / wide from the hall, looking at the open red doorway at the balcony edge | PROJ-06 mid-step through the doorway, one foot over empty air | present | Doors wide; the same hall fills the doorway; seats 2.4 m below the threshold | harsh red | clear | `Di baliknya bukan lorong. Studio yang sama, dari tepi balkon. Kamu melangkah ke lantai kosong. Tamat.` — his leading foot leaves the threshold | Strobe-free red wash, shake on the step |
| P08 | 00:55.5–01:01.5 / medium from the aisle, after Rewind 1 | PROJ-06 full body, crouching at an aisle seat | present | Flashlight placed, beam on, hard white bar across seats | amber + white bar | clear | `Balik lagi. Kamu taruh senter di kursi lorong. Sorotnya terang.` — he sets it down and straightens | HoverDrift, beam bloom |
| P09 | 01:01.5–01:15.5 / single mid-fall POV from the left balcony rail | PROJ-06's forearms at the frame edges (POV) | present | Empty aisle seat below-left, flashlight gone; lifting screen hem ahead; red wash | harsh red + white bar | clear | `Kamu lari ke pintu darurat kiri. Pintunya kebuka. Kamu jatuh dari balkon kiri. Sambil jatuh, kamu lihat kursinya kosong. Ujung kainnya masih terangkat. Tamat.` — the seat and the lifting hem hold in frame as he drops | Shake, red flash, falling drift |
| P10 | 01:15.9–01:21.9 / tight on the projector pedestal, after Rewind 2 | PROJ-06 full body standing at the switch | present | Flashlight back on pedestal, unlit; hand on toggle; beam on | amber + white beam | clear | `Balik lagi. Kamu matiin proyektor. Kalau cahaya biang keladinya, matiin aja.` — he throws the switch | HoverDrift |
| P11 | 01:21.9–01:31.2 / wide from the screen looking south at the balcony | PROJ-06 silhouette on the balcony, arms braced | present | Beam off; screen dark; rows in front visibly closer and moving backward | dark → harsh red rim | clear | `Layar gelap. Ruangan ikut gelap. Baris kursi di depanmu berderak, mundur, menghimpitmu ke balkon. Tamat.` — rows surge south and crush the balcony | Shake, red flash, hard cut to black |
| P12 | 01:33.0–01:36.0 / same wide, after dread silence | PROJ-06 at the rail, still | present | Beam snaps back on; flashlight on pedestal; hall reset | amber + white | clear | `Balik lagi. Lampu proyektor nyala.` — he straightens and looks at the screen | Slow push-in |
| P13 | 01:36.0–01:43.5 / low angle over his shoulder to the screen | PROJ-06 at frame left, full upper body | present | Beam patch unchanged; bottom edge lifting; tear visible | amber + white | clear | `Titik terang di kain nggak pernah geser. Kain itu yang nggak ikut berubah.` — his head turns from the patch to the loose edge | HoverDrift, InstrumentGlowFlicker |
| P14 | 01:43.5–01:45.0 / close on his hand on the rail | PROJ-06 hand and shoulder | present | Beam footprint on the floor below like a path | amber + white | clear | `Ikutin cahayanya.` — his hand leaves the rail | HoverDrift |
| P15 | 01:45.0–01:51.5 / tracking from behind, centre aisle | PROJ-06 full body walking north | present | Beam footprint on the floor like a path | amber + white | clear | `Kamu turun. Jalan lurus ke depan, nyusurin sorot lampu di lantai.` — he descends the steel stair and walks | HoverDrift, path glow |
| P16 | 01:51.5–01:56.0 / wide from the screen looking south | PROJ-06 mid-aisle, walking toward the camera and the screen | present | Rows stretching and closing behind him | amber + white, edges darkening | clear | `Di belakangmu, kursi berderak. Ruangan makin panjang.` — rows slide back and multiply | Parallax, shake |
| P17 | 01:56.0–02:02.5 / low angle at the stage lip | PROJ-06 full body climbing the 0.6 m lip | present | Hand on the stage edge; screen bottom edge at chest height | amber + white | clear | `Kamu nggak noleh. Kamu naik ke panggung. Kamu dorong kain layar.` — he climbs and presses both palms to the fabric | HoverDrift |
| P18 | 02:02.5–02:05.5 / tight on the fabric from behind | PROJ-06's shoulders and hands, fabric bulging around him | present | Fabric stretched, tear widening, light spilling around his shape | white bloom through fabric | clear | `Kainnya berat. Kamu dorong lagi.` — the seam rips and he pushes through | Flash ≤65%, shake |
| P19 | 02:05.5–02:11.5 / wide backstage, single fixed vantage from the tear | PROJ-06 full body through the tear, dust around him | departed | Raw brick, exposed pipes, torn screen behind; gate glow at frame right | cool dawn + amber spill | clear | `Di balik layar: bata mentah, pipa, gang belakang.` — he lands and holds, looking toward the gate | HoverDrift, dust motes |
| P20 | 02:11.5–02:16.5 / wide from the backstage, single fixed vantage on the gate | none — insert plate | departed | Half-open steel roll-up gate, cold dawn light under the shutter, dust in the beam | cool blue + amber spill | clear | `Pintu besi gulung kebuka. Cahaya pagi masuk, dingin.` — the gate holds half open, dawn under it | HoverDrift, dust motes |
| P21 | 02:16.5–02:21.0 / wide from the alley, looking back at the half-open gate | PROJ-06 on hands and knees under the shutter, mid-duck | departed | Gate half open; cold dawn on the alley floor; torn-screen glow behind him | cool blue | clear | `Kamu jalan enam meter ke kanan. Keluar.` — his shoulders clear the shutter | HoverDrift |
| P22 | 02:21.0–02:28.4 / alley corner, wide on the cinema's rear wall | PROJ-06 full body at frame left, facing the wall | departed | Solid brick rear wall under a faded painted `BIOSKOP` sign; open gate behind him; **no red door, no frame, no lintel** | cool blue | clear | `Di dinding luar gang, pintu keluar merah nggak pernah ada.` — he stops and stares at the blank brick | Slow push-in, dust |
| P23 | 02:28.4–02:32.5 / alley, medium wide, gate behind him | PROJ-06 standing still, half-turned toward the gate | departed | Gate begins to fall; street empty; cold dawn | cool blue | clear | `Ikutin cahayanya. Kali ini, kamu nggak jatuh.` — he holds, half-turned, as the shutter starts down | Slow push-in |
| P24 | 02:32.5–02:34.0 / low angle on the gate from the alley | PROJ-06 full body, back to camera, silhouetted against dawn | departed | Gate slams shut; dust kicks out | cool blue rim | clear | No narration — the gate drops behind him; 0.3 s procedural hard cut to black at frame 4611 | Jolt: shake ±14 px, flash ≤65% |

**Narration-to-panel map (1:1, checked):** P01 hook; P02 identity + lock; P03 growth; P04 screen; P05 exits + stake; P06 run + doors; P07 reveal + `Tamat.`; P08 flashlight marker; P09 side fall + `Tamat.`; P10 switch; P11 crush + `Tamat.`; P12 reset; P13 anchor; P14 motif; P15 descent; P16 pursuit; P17 climb + push; P18 push; P19 backstage; P20 gate + dawn; P21 six metres + out; P22 brick payoff; P23 close; P24 no narration. Every spoken sentence is quoted in exactly one panel; the `Di balik layar` paragraph splits cleanly at the gate clause between P19 and P20.

### Audio-Visual Feasibility & Prop-State Table

Provisional spans at ~1.70 w/s; re-anchor from `narration-timestamps.json` after the master locks.

| Narrated action (exact line) | Measured speech span (s) | Prop/object state BEFORE | Prop/object state AFTER | Literal screen time | Editorial treatment |
| --- | --- | --- | --- | --- | --- |
| `Kamu lari ke pintu keluar.` | 2.9 | Doors shut, bar untouched | Both hands on the bar; doors open at the panel end | 5.5 s (P06) | real-time |
| `Kamu melangkah ke lantai kosong.` | 2.9 | Foot on the threshold | Foot past the threshold, no floor | 4.0 s (P07 tail) | real-time |
| `Kamu taruh senter di kursi lorong.` | 3.5 | Flashlight in hand, off | Flashlight on the seat, beam on | 3.0 s (P08) | real-time |
| `Kamu jatuh dari balkon kiri.` | 2.9 | Body past the fire-exit threshold | Body dropping past the left rail | 3.5 s (P09 tail) | **editorial slow-motion**: the 1.2 s drop is stretched so the empty seat and the screen edge read clearly while he falls |
| `Kamu matiin proyektor.` | 1.8 | Beam on, motor running | Beam off, motor spinning down | 2.2 s (P10) | real-time |
| `Baris kursi di depanmu berderak, mundur,` | 4.1 | Rows at rest, 4 m from the balcony | Rows 1.5 m closer, crushing the balcony | 4.5 s (P11) | real-time + shake |
| `Kamu naik ke panggung.` | 2.4 | Feet on the floor | Both feet on the 0.6 m stage | 3.0 s (P17) | real-time |
| `Kainnya berat. Kamu dorong lagi.` | 2.9 | Fabric taut, 15 cm tear | Tear at 1.4 m, body halfway through | 3.0 s (P18) | **editorial slow-motion**: the push is stretched across P18 and the first 0.4 s of P19 |
| `Kamu jalan enam meter ke kanan.` | 2.9 | At the tear, facing east | At the gate | 4.5 s (P21) | real-time |

- **Final jolt and tail** — P23's final word lands at 02:32.5. Standard **1.5 s tail after the final spoken word**: 150 ms silence vacuum → P24 gate-slam jolt (1.05 s: steel drop + chain rattle, shake ±14 px, flash ≤65%) → 0.3 s procedural hard cut to black. Tail ends 02:34.0 (frame 4620); blackout frame 4611. The black is generated in Remotion and is never a 24th plate.
- **Asset and rights record** — batch under `episodes/006-bioskop-tanpa-pintu/`; style ID `urban-silhouette-noir`; 24 original plates plus one jolt plate. No third-party footage, no external character sheets, no voice assets beyond the Investigator master. Foley sourced from `public/sfx/` or newly recorded with an explicit redistribution licence and credit.

## 4. Assemble and review

- **Composition** — proposed `Skenario06BioskopTanpaPintu`, 1080 × 1920, 30 fps, `durationInFrames` 4620 (154.0 s), `pipelineVersion: 2`, `schemaVersion: 2`. Measure against the **145–160 s** band.
- **Opening cover** — `openingTitle` **`BIOSKOP TANPA PINTU`** (3 words), frames 0–54 (00:00.0–00:01.8), upper centre of the centred 3:4 safe zone (y 240–1680). Cover frame 6 (00:00.2). No flash-frame thumbnail.
- **Captions and HUD** — align to `narration-timestamps.json`; 3–4 words per beat; white default, `yellow` for survival terms, `red` for danger. HUD badge `PUKUL 01:50` in P01–P05, switching to `PUKUL 05:40` only in P19–P24. Any dropped hook `ini` is dropped on screen.
- **Review and delivery** — validator, then the [pre-publish review](review.md) at phone size.

## Handoff

- **Agent 02** — one-shot Investigator master, `narration-prep.json`, hook trim authority, three 0.400 s rewind gaps, one 1.400 s dread silence, 1.5 s tail pad. No world voices.
- **Agent 03** — 24 plates against the Immutable Set Anchor; PROJ-06 silhouette lock; single-hall geography; no rain indoors; flashlight beam and screen bottom edge are the two phone-readable clue props; backstage cold dawn only in P19–P23; P22 must read as **solid brick under the faded `BIOSKOP` sign, with no red door, frame or lintel**; P24 is the gate-slam jolt plate, and the final black is procedural.
- **Agent 04** — three `branchRewinds` from the measured map only; red-branch palette override; P24 gate-drop jolt plate starts at frame 4575 ±1; audible hit after the 150 ms vacuum; procedural hard cut to black at 4611 ±1.
- **Provisional status** — every time and frame in this brief is story order. `audio-edit-map.json` replaces them at assembly.
