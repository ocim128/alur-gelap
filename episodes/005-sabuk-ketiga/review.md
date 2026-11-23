# Scenario 05 assembly review — 23 November 2026

**Current re-audit candidate:** [roll-color-rework-handoff.md](roll-color-rework-handoff.md) identifies the new MP4 by SHA-256 and records the P18 motion, color-conversion and export checks. The owner-approved exceptions and the earlier listening decision remain scoped as documented there; independent QA of the new file is pending.

**Later owner-directed polish:** See [owner-polish-handoff.md](owner-polish-handoff.md) for the current export and QA packet. The owner listened to and approved the earlier ending and accepted the specified coverage exceptions; the earlier review below is retained as history. Independent QA of the new reveal timing and P18 roll remains pending.

## Story and experience

- **Needs work / review in motion:** the measured voice delivery separates the fake-click narration from the delayed release. The audible one-beat pair has been positioned after “satu ketukan”; see [assembly handoff](assembly-v2-handoff.md) for the tradeoff. The P11 and P24 image exceptions remain visible or uncertain.
- **Not checked:** first-viewer comprehension and owner response.

## Picture, sound and accessibility

- **Partial:** the 270 × 480 [exported frame sequence](verification/phone-contact-mastered.png) shows a readable opening title, the forward-pitched pilot, flash and blackout. P11's contact is partly obscured and the post-flash exterior changes are visible. The sequence does not establish normal-speed impact readability or complete playback quality.
- **Not checked:** uninterrupted real-time playback with sound, narrator/voice-sfx intelligibility, subjective mix, caption coverage and platform UI safe zones. Phone-size clips for the impact and ending are linked in the assembly handoff.
- **Not applicable:** cartoon model sheet and seated puppet test; this is an approved silhouette-plate assembly.

## Technical, rights and delivery

- **Pass:** `npm run check`; 1080 × 1920, 30 fps, 156.437 s; compressed export sync, Rec.709, flash, blackout, loudness and peak checks; see [export report](verification/export-report-mastered.json) and [impact sync report](verification/impact-sync.json).
- **Needs work:** service and voice publication rights have not been independently verified; source records are in [audio-assets.md](audio-assets.md) and [assembly-v2-handoff.md](assembly-v2-handoff.md).
- **Not checked:** actual platform preview, publication rules, independent QA and full exported-file listening/playback.

Verdict: rendered review copy available, with playback review and independent QA still required. Owner approval to proceed with image exceptions is not a technical image pass or publication approval.
