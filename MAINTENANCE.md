# Repository maintenance log

Record completed improvements with evidence, checks and worthwhile follow-ups. Keep creative decisions and episode review findings in their existing records.

## 2026-11-23 — Align Studio v2 validation with its player

- **Improvement:** Studio v2 requires a moving scene camera and no longer requires Arc 1 character, HUD, reframe or bed metadata. The player and assembler contract use the same camera requirement. Editorial checks remain; tactical overlays still require visual review.
- **Evidence:** StudioV2Player animates the camera for the whole scene, but the previous validator counted that movement only on holds up to nine seconds and relied on reframe metadata the player never reads. The five current Studio v2 manifests all use moving cameras.
- **Checks:** Before/after `checkAll()` results match across all 16 existing manifests. Regression tests cover stripped metadata, long holds, missing or static cameras, retained editorial checks and Arc 1 character validation. `npm run check` passed (71 Node and 16 Python tests), and a Scenario 05 frame rendered successfully. A shared caption chunker reproduces the shipped Scenario 03 and 04 narrator beats exactly without running their builders. A single still is not a full playback review.
- **Follow-up:** Review long-hold pacing in exports; a nonzero camera change does not guarantee perceptible or effective motion. Revisit shared ASR reconciliation after the active Scenario 06 audio work, with explicit hyphen and occurrence semantics. Existing episode builders and captions remain historical records.

## 2026-11-22 — Restore the current production entry point

- **Improvement:** Updated the README to lead with Studio v2, the actual pilot composition and its handoff, the current episode contracts, and the archived Arc 01 paths.
- **Evidence:** The prior new-episode instructions linked to nonexistent `episodes/001-kemacetan-terakhir/...` paths and directed new work to the archived Arc 01 recut without `pipelineVersion: 2`. `src/Root.tsx` registers the standalone pilot through a custom component, so the generic player and preview toggles did not describe it.
- **Checks:** README local link paths and `git diff --check` passed. The episode validator passed with existing archival warnings, and all 26 Node tests passed. `npm run check` stopped at TypeScript: Episode 004 was moved into `episodes/arc1/` during this run, while `src/Root.tsx` still imports its previous path. That separate worktree change was left untouched.
- **Follow-up:** The pilot component loads `mix-master.wav` directly while the manifest validator checks the narration asset. Consider a validated playback-mix dependency if future custom compositions follow this pattern; confirm the assembly generator and archived artifacts before changing their contract.
