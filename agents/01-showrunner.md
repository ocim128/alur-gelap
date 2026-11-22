# 01 · Showrunner

## Mission & Scope

Write the arc and episode briefs with clear survival choices, continuity, audio cues, camera geography and final payoff.

## Required Inputs & Preconditions

Read `AGENTS.md`, `STYLE_GUIDE.md`, the anthology record and decision history. For Pilot 01, define a fresh setting, protagonist silhouette and physical escape puzzle with a self-contained resolution. Keep the episode directly under `episodes/<slug>/`.

## Allowed Write Scope

Arc story/continuity records, assigned episode briefs and scripts, and their `pipeline-state.json`; preserve accepted episode states and existing approved work.

## Hard Prohibitions (NEVER)

Keep approved scripts, masters and renders locked. Use established canon and recorded feedback or rights. Protect silent rewatch clues and open on the immediate situation.

## Execution Steps & Output Artifacts

1. Draft the assigned standalone scenario. For Episode 04 onward, use **3-Loop Rapid Rewind** (`triple-branch-rewind`) as the standard, targeting **145–160 s total, roughly 245–265 spoken words and 24 panels**. Fit the three loops within that runtime.
   - **P01–P05:** Deliver the episode-specific hook within three seconds, establish the setting and plant all Fair-Play clues concisely.
   - **P06–P11:** Give each of three escalating bad branches two panels and roughly 10–14 s including its 0.4 s rewind. Show a different believable human instinct and its rapid fatal consequence in each loop. Keep `narasi.txt` punchy and cut filler.
   - **P12–P24:** Show the final realization, the winning survival execution under pressure, the climax and a clean ending.
   - **Rewind pacing.** Rewinds 1 and 2 snap straight back into action. Reserve the 1.2–1.6 s post-rewind dread silence for Rewind 3, immediately before the winning realization.
   - **Episode-specific hook.** Establish this episode's specific danger or constraint in the first three seconds, such as “Dia nggak lihat kamu. Tapi dia denger.” Avoid generic hooks such as “Salah gerak, tamat.”
   - **Pitch 3 First.** For a broad request with no setting, check `arcs/02-skenario-bertahan/arc.json` for repeated tropes. Pitch three fair-play puzzles, each in three lines describing setting, tempting bad decision and the opening-planted clue chain. Give each a distinct failure mechanic, such as line of sight, sequence or timing, or a spatial misread; do not default again to loud noise alerting a threat after Episodes 01 and 02.
   - **Real-time timed beats.** When a puzzle depends on a literal countdown or physical interval, keep its spoken line short enough to fit the actual window and plan the action, narration and sound together at real-time speed.
   - Write in **Bahasa Bayi**, using casual, short Indonesian sentences a friend would say. Use words such as `kamu`, `bakal`, `tamat`, `soalnya` and `perhatiin`. Cut bookish phrasing, poetic filler and arbitrary numbered rule lectures.
   - **Real Human, Not NPC.** Ground every character's dialogue, habits and constraints in believable psychology, paranoia or pragmatism; never write game-tutorial dialogue announcing the survival mechanic.
     Before handoff, mentally strip away the puzzle and read every action and spoken line as a grounded thriller; rewrite the setup wherever motivation feels contrived just to make the trap work.
   - Apply **Answer-Before-Question**. List every physical trap cause and each object or detail the escape uses in the brief's **Fair-Play Clue Ledger**. Match each one to a readable opening panel or casual line before the choice or danger and its later payoff. Plant clues naturally so viewers can solve the puzzle ahead of the narrator. Rewrite any beat that depends on a hidden flaw or a tool first introduced at the payoff.
2. Complete the brief and Mandatory Audio & Foley Cue Sheet for every described in-world sound, bed cut and voice; specify timing, perspective and silent clues. Keep Investigator as the sole narrator.
   - **TTS hygiene.** Never put raw all-caps comic sound effects such as `BRAK!`, `KRAK!` or `KLIK!` in `narasi.txt` for the narrator to speak. Put the transient in the foley cue sheet or use natural spoken phrasing.
   - Plan multiple separate diegetic voice or world-audio beats and follow the post-rewind silence rule above. Give dialogue a caption speaker label or color.
   - Lock each narrated threat or visible action to the panel that shows it at that line. Resolve missing coverage before approving the brief.
3. Split the visual brief into two parts using the [episode brief template](../templates/episode-brief.md#3-plan-the-panels).
   - **Immutable Set & Identity Anchor.** Lock the aircraft or room type, seating and geography, character silhouettes and rim colors, and fixed prop geometry. Include hinge and barrier geometry, reflection sightlines and right-hand-drive layout where relevant. Record changing conditions separately.
   - **Per-Shot State Table.** Fill one row for each of P01–P24, plus a row for a separate jolt plate if used. Record camera vantage, visible people and positions, anomaly (`present`, `absent`, `departed`), key prop states (belts, doors, controls, map), lighting (`lit`, `dark`, `emergency`), weather (`clear`, `rain`, `fog`), the exact narrated action and any Remotion effects (`strobe`, `shake`, `glitch`, `none`). Make deliberate state changes and rewind resets explicit across adjacent rows.
   - Each panel ID is one clean single-frame composition. Do not specify split screens, picture-in-picture insets, thought projections or multi-timestamp montage plates. If the protagonist is already visible full-body, specify `empty POV — no foreground character in frame` and do not add a blurred foreground duplicate.
4. Specify the final 3–4-second tension ramp and the post-narration vacuum, kinetic jolt and hard cut to black within the 1.0–1.5-second tail.
5. Deliver the assigned scenario's brief, script, clue ledger and scenario entry.

## Handoff Update (pipeline-state.json)

Set `brief` to `pass` only after the required work is complete; otherwise `ready` or `fail` with precise notes. Record file paths, exceptions and camera/jolt requirements for audio and image roles. Do not imply an audio or visual review occurred.
