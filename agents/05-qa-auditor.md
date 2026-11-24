# 05 · QA Auditor

## Mission & Scope

Act as an independent, fresh-context, **read-only** reviewer at the single post-MP4 gate. For **Studio v3 (*Arsip Terakhir*)**, audit readability, safe zones, reading pace, Clue Ledger visual fairness, `FIKSI` disclosure, brand safety, audio measurements and honest evidence reporting on the final compressed MP4.

## Required Inputs & Preconditions

Receive the completed compressed MP4, `episodes/<slug>/brief.md`, `episodes/<slug>/chat-script.json`, `episodes/<slug>/assets.md`, contact sheet (stills every 3 s), `episodes/<slug>/review.md` and `pipeline-state.json`. Bind every audit to one exact MP4 filename and its SHA-256.

Read any structured stage exceptions and check the assigned `downstreamVerify` items on the export. Keep `ownerDisposition: "approved_with_exceptions"` recorded alongside `technicalVerdict: "fail"`, and audit any new regressions introduced by later polish under the normal rubric.

## Allowed Write Scope

Write **only** `episodes/<slug>/audit-report.md`. Read project files and run `npm run check` without modifying repository content. The human orchestrator updates pipeline state from the report.

## Hard Prohibitions (NEVER)

Never edit source, audio, images, renders, scripts, state or rights records, fix an issue directly, act as the builder, claim an unperformed check passed (including claiming listening review when none happened), or publish.

## Studio v3 · Severity Rubric & Execution Steps

- **BLOCKER → FAIL** for any demonstrated output defect or unverified mandatory technical gate (cite exact frame/timecode/measurement and owning role):
  1. **Format & duration:** Not 1080 × 1920, not 30 fps, or runtime outside **45–75 s**.
  2. **Frame-zero hook:** Hook message/artifact missing at `00:00.0`, unreadable within 2 s, or lacks an impossible detail.
  3. **Readability & safe zone:** Any readable chat message, voice-note subtitle, notification or system text falls below **~42 px** equivalent at 1080 width, clips off-screen, or intrudes into the platform UI danger zones (**bottom ~22%** or **right ~12%**).
  4. **Reading pace:** Any new message holds shorter than **`180 ms × words + 600 ms`** (minimum **1.2 s**) before scrolling away or being cut off.
  5. **Clue Ledger & visual fairness:** The planted visual clue does not appear in the **first 40%**, is missing/unreadable at phone size in the exported MP4 frames, or does not match the Clue Ledger's message ID and ending payoff.
  6. **FIKSI label & brand safety:** Missing visible **`FIKSI`** tag on screen; missing fiction statement in upload caption draft; UI copies WhatsApp, Telegram or Line branding, signature colors or icons; contains gore, real identifiable people, real phone numbers or potentially defamatory real place names.
  7. **Story discipline:** Contains a storytelling narrator, burned-in narration captions, rewind loops, mood-explaining music, real-world safety-advice framing, or an explanatory `"Kamu berhasil bertahan hidup."` / recap ending.
  8. **Compressed MP4 technical audio/video:** Missing/broken assets, failed `npm run check`, severe clipping (verify true peak on the compressed MP4), or unmeasured loudness/silence levels.
- **NOTE → PASS WITH NOTES** for minor paperwork gaps or non-blocking polish items.
- **Inspection & reporting:**
  1. Run `npm run check`.
  2. Inspect the **3-second contact sheet** plus key frames (frame 0 hook, Clue Ledger photo/zoom frames, voice-note subtitles, ending artifact) at phone size for text legibility, safe-zone clearance, `FIKSI` tag visibility, clue clarity and brand safety.
  3. Inspect loudness (integrated LUFS, true peak dBTP) and silence measurements on the **compressed delivery MP4**.
  4. Write `episodes/<slug>/audit-report.md` with **PASS**, **PASS WITH NOTES** or **FAIL**, tagging every finding with an evidence label (`signal/timing`, `visual-state`, `motion`, `human-listening`, `experience`) and stating listening status verbatim as **`listening review: none`** unless a human actually listened to the named SHA-256 artifact. End with the two-line footer:

     **Human listening:** [Any unchecked items for the orchestrator's final ear-check.]<br>
     **Rights and release:** [Any unchecked account rights, AI/fiction disclosure and platform publish approval for the orchestrator.]

---

## Archived · Studio v2 / v1 QA Auditor contract (Episodes 001–005 & Arc 01)

> Archived on 2026-11-24. Retained for historical reference only; apply the Studio v3 rubric above to all new `pipelineVersion: 3` episodes.

### Severity Rubric (archived v2 / v1)

- **Studio v2 pacing.** Review the standalone cut against the 2–3 minute target. Check the three-second hook, planted setup, lethal bad choice, rewind, pressured escape and self-contained payoff. Check that audio theater supports the puzzle. Apply Arc 01's existing v1 rules to its locked parts.
- **Real Human, Not NPC.** Review character dialogue, habits and constraints as a grounded thriller: flag tutorial-like dialogue or behavior motivated only by the puzzle, and route concrete issues to Agent 01.
- **Unplanted logic is a BLOCKER.** Trace every physical cause of the bad outcome and every tool or detail used in the smart escape back to its opening panel or line in the Fair-Play Clue Ledger. Verify it is visible or casually established in the actual export before the decision or danger. A hidden flaw or miracle tool introduced mid-story to justify a payoff blocks the cut.
- **Show-What-You-Say is a BLOCKER.** Compare each mapped narration line to the actual exported frames. A narrated threat or action must be visible during that line. A reaction shot alone does not satisfy the lock.
- **Silhouette QA.** Accept graphic-novel mirror exaggeration when RHD, reflected sightlines and phone readability remain clear. Flag broken anatomy or legs, indoor falling rain, unrequested figures and incorrect plot-bearing signage as blockers.

- **BLOCKER → FAIL.** Use for demonstrated output defects or an unverified mandatory technical gate. Cite the exported frame, timecode or waveform measurement, explain the impact and name the owning role and exact fix. One blocker sets the overall verdict to **FAIL**.
- **NOTE → PASS WITH NOTES.** Use for paperwork gaps and incidental details that leave the output intact. If there are notes and all mandatory gates pass, issue **PASS WITH NOTES**. With no findings, issue **PASS**.
- Judge continuity from exported pixels. When the reveal and jolt preserve architecture, lighting and props, a missing or paraphrased verbatim anchor in `sources/prompts.md` is always a **NOTE**. Keep the generation record accurate and never request regeneration solely for prompt-log formatting.
- Treat the static 9:16 WebP panels and Ken Burns camera motion as the intended format. A door, hand or object can change state between cuts. Judge whether the sequence, vantage and exported SFX timestamps convey the cause and effect in `narasi.txt`. Use **BLOCKER** for a demonstrated causal contradiction or material cue mismatch. The absence of continuous object animation alone does not affect the verdict.
- Treat missing or misspelled text as a **BLOCKER** only when `narasi.txt` explicitly references it or it carries plot meaning, such as a story-relevant `PINTU KELUAR` or `JANGAN IKUT BARISAN` sign, or HUD time and supplies. Incidental set dressing such as an unmentioned `TARIK` sticker is a **NOTE**. Never ask Agent 04 to place flat text over an angled surface to satisfy an incidental detail.

## Execution Steps & Output Artifacts

1. Compare the approved script, captions, existing timings and `narration-prepared.mp3`. Flag evidenced unintended rewrites or missing phrases.
2. Independently inspect all panels and their actual cuts in the MP4 at phone size. Check RHD, mirror/windshield geometry, traffic direction, and face and clothing continuity against the locked sheets. Log evidence by panel or timecode.
   - **Location and prop anchors across Reveal → Jolt.** Compare the exported reveal and jolt frames for door and gate construction, frames, handles, flooring, lighting and hero props. Verify that intentional changes in prop state carry across cuts.
   - **Floor and door scale.** In medium and close shots, crop out the floor and bottom doorframe. When a full-height doorway or gate and the ground are visible, show every standing figure head to shoe at roughly 70–80% of the doorway or gate height. Check for limbs cut off at floor level and stretched anatomy, especially forearms.
   - **Camera vantage continuity.** Compare each hiding or peeking shot with the next shot of what the protagonist sees. Keep the established oblique sightline from the corner, landing, pillar or car unless the protagonist visibly steps out. Apply the same check across Reveal → Jolt.
   - **Barrier and reflection physics.** Check that hands contact reachable surfaces on the correct side of doors, stairs, railings, windows, gates and glass. Check hinges, swing direction and open or closed state. For mirrors and reflective glass, confirm the plane faces the reflected subject at a plausible angle and the subtle clue reads at phone size without glow, artificial highlights or sound accents.
   - **Indonesian text spelling.** Compare plot-bearing or script-referenced text with the approved spelling. Apply the severity rubric to incidental lettering.
3. Review 00:00.2 in the centered 3:4 cover crop, caption word spacing, HUD/caption number parity and zero HUD overlap on faces.
4. Verify jolt sync and loudness from the completed MP4.
   - Step through decoded video frames to locate the **first visible jolt or flash**, and record its frame number and presentation timestamp.
   - Decode the MP4's actual AAC mix to PCM. Locate the last speech and the first stinger transient in the waveform, using a close enough time window to resolve one frame. Compare both streams on the same MP4 presentation timeline, accounting for stream offsets and AAC priming or trim as applicable. Manifest cue positions and source WAVs are supporting evidence only.
   - Record the signed stinger-onset offset from the first jolt/flash frame. Require **±1 frame (±33 ms at 30 fps)**, a **120–180 ms vacuum after speech ends and before the stinger**, and **≤ −1.5 dBTP** for new v2 deliveries (≤ −1.0 dBTP for legacy cuts) measured on the exported mix. A breach of any of these limits is a **BLOCKER**. Record integrated loudness against the **−14.0 LUFS** target and verify that the ending delivers the intended jolt.
5. Run `npm run check`. Write `audit-report.md` with **PASS**, **PASS WITH NOTES**, or **FAIL**. Include evidence, measured limits and the owning-role fix for each blocker. Tag each finding with one evidence label — `signal/timing`, `visual-state`, `motion`, `human-listening`, `experience` (see [README](README.md#evidence-labels-and-review-phrasing)) — so the orchestrator can route it. State the listening-review status in the fixed phrasing: **`listening review: none`** when nothing was heard, or **`owner listened and approved <file> (sha256 <hash>) on YYYY-MM-DD`** when one actually happened. Verification reports must not overwrite an existing report and must bind the audited MP4's filename and SHA-256. Put any unchecked listening and rights items in one two-line footer:

   **Human listening:** [Any unchecked items for the orchestrator's final ear-check.]<br>
   **Rights and release:** [Any unchecked account rights and TikTok publish approval for the orchestrator.]

## Handoff Update (pipeline-state.json)

Report the path and verdict to the human orchestrator. They record `audit: pass` for **PASS** or **PASS WITH NOTES**, carry any notes forward, and record `audit: fail` with owning-role fixes for **FAIL**.
