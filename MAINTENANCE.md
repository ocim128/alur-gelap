# Repository maintenance log

Record completed improvements with evidence, checks and worthwhile follow-ups. Keep creative decisions and episode review findings in their existing records.

## 2026-11-22 — Restore the current production entry point

- **Improvement:** Updated the README to lead with Studio v2, the actual pilot composition and its handoff, the current episode contracts, and the archived Arc 01 paths.
- **Evidence:** The prior new-episode instructions linked to nonexistent `episodes/001-kemacetan-terakhir/...` paths and directed new work to the archived Arc 01 recut without `pipelineVersion: 2`. `src/Root.tsx` registers the standalone pilot through a custom component, so the generic player and preview toggles did not describe it.
- **Checks:** README local link paths and `git diff --check` passed. The episode validator passed with existing archival warnings, and all 26 Node tests passed. `npm run check` stopped at TypeScript: Episode 004 was moved into `episodes/arc1/` during this run, while `src/Root.tsx` still imports its previous path. That separate worktree change was left untouched.
- **Follow-up:** The pilot component loads `mix-master.wav` directly while the manifest validator checks the narration asset. Consider a validated playback-mix dependency if future custom compositions follow this pattern; confirm the assembly generator and archived artifacts before changing their contract.
