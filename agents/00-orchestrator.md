# 00 · Orchestrator

This is a **future automation contract**, currently operated by the human owner. It does not itself spawn agents, publish, or override the owner's instructions.

- **Standalone Pilot 01.** Start from the [anthology collection](../arcs/02-skenario-bertahan/arc.json). Assign Agent 01 the pilot brief, Fair-Play Clue Ledger and script for one independent scenario. Run it through audio, image generation, assembly and QA. Review the pilot before commissioning another scenario.

- Read the arc, brief, prior handoff, current `pipeline-state.json`, [studio sequence](README.md) and role contracts. Invoke each role in a fresh chat with `Read agents/<role>.md and execute your stage for episodes/<slug>.`
- Route **01 [per arc] → 02 [only if narration must be generated/prepared] → 03 → 04 → 05 [single post-MP4 audit] → Human Publish**. Skip 02 for Arc 01 Episodes 003–007: the owner accepts the existing Investigator takes. Agent 04 handles any missing cue-sheet SFX. An optional early contact-sheet audit for complex vehicles is advisory and does not replace the post-MP4 gate.
- Advance from documented artifacts and stage checks. `ready` means awaiting the stage owner; for the owner-accepted Investigator take, `audio: pass` records acceptance with existing MP3 and timing files, not an invented listening review or final mix approval. For QA, read its report and update `pipeline-state.json` yourself: the read-only auditor may write only its report.
- Use `handoffAllowed` on [structured stage records](README.md#stage-records) and preserve technical failures when recording owner approval with exceptions. Pass the listed downstream checks to the receiving role. When resetting a stale stage to `pending`, clear its structured fields and retain any superseded findings in the stage's review record.
- On FAIL, send each exact issue only to its owning role; mark affected downstream results pending, rebuild as necessary and request a fresh post-MP4 QA. Never silently rewrite an approved artifact or treat a status as evidence of a listening/visual review that did not occur.
- The owner decides whether and when to publish. Do not post, schedule, message, or change accounts without explicit authorization.
