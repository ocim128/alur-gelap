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

1. Draft the assigned standalone scenario, targeting **2–3 minutes**. Use the [v2 beat map](../STYLE_GUIDE.md#v2-beat-map) for setup, tempting bad decision and lethal cause, `branchRewind`, multi-step escape under pressure, and earned logical payoff.
   - **Episode-specific hook.** Establish this episode's specific danger or constraint in the first three seconds, such as “Dia nggak lihat kamu. Tapi dia denger.” Avoid generic hooks such as “Salah gerak, tamat.”
   - **Pitch 3 First.** For a broad request with no setting, check `arcs/02-skenario-bertahan/arc.json` for repeated tropes. Pitch three fair-play puzzles, each in three lines describing setting, tempting bad decision and the opening-planted clue chain. Give each a distinct failure mechanic, such as line of sight, sequence or timing, or a spatial misread; do not default again to loud noise alerting a threat after Episodes 01 and 02.
   - **Real-time timed beats.** When a puzzle depends on a literal countdown or physical interval, keep its spoken line short enough to fit the actual window and plan the action, narration and sound together at real-time speed.
   - Write in **Bahasa Bayi**, using casual, short Indonesian sentences a friend would say. Use words such as `kamu`, `bakal`, `tamat`, `soalnya` and `perhatiin`. Cut bookish phrasing, poetic filler and arbitrary numbered rule lectures.
   - **Real Human, Not NPC.** Ground every character's dialogue, habits and constraints in believable psychology, paranoia or pragmatism; never write game-tutorial dialogue announcing the survival mechanic.
     Before handoff, mentally strip away the puzzle and read every action and spoken line as a grounded thriller; rewrite the setup wherever motivation feels contrived just to make the trap work.
   - Apply **Answer-Before-Question**. List every physical trap cause and each object or detail the escape uses in the brief's **Fair-Play Clue Ledger**. Match each one to a readable opening panel or casual line before the choice or danger and its later payoff. Plant clues naturally so viewers can solve the puzzle ahead of the narrator. Rewrite any beat that depends on a hidden flaw or a tool first introduced at the payoff.
2. Complete the brief and Mandatory Audio & Foley Cue Sheet for every described in-world sound, bed cut and voice; specify timing, perspective and silent clues. Keep Investigator as the sole narrator.
   - **TTS hygiene.** Never put raw all-caps comic sound effects such as `BRAK!`, `KRAK!` or `KLIK!` in `narasi.txt` for the narrator to speak. Put the transient in the foley cue sheet or use natural spoken phrasing.
   - Plan multiple separate diegetic voice or world-audio beats and deliberate 1–3 s dread silences. Give dialogue a caption speaker label or color.
   - Lock each narrated threat or visible action to the panel that shows it at that line. Resolve missing coverage before approving the brief.
3. Specify the camera position and direction for every interior, vehicle and mirror shot. Document RHD layout, what is in front of/behind the driver, reflection geometry, vehicle direction, door hinges and persistent prop states.
   - Each panel ID is one clean single-frame composition. Do not specify split screens, picture-in-picture insets, thought projections or multi-timestamp montage plates. If the protagonist is already visible full-body, specify `empty POV — no foreground character in frame` and do not add a blurred foreground duplicate.
4. Specify the final 3–4-second tension ramp and the post-narration vacuum, kinetic jolt and hard cut to black within the 1.0–1.5-second tail.
5. Deliver the assigned scenario's brief, script, clue ledger and scenario entry.

## Handoff Update (pipeline-state.json)

Set `brief` to `pass` only after the required work is complete; otherwise `ready` or `fail` with precise notes. Record file paths, exceptions and camera/jolt requirements for audio and image roles. Do not imply an audio or visual review occurred.
