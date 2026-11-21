# Dimensi Niskala studio contracts

Studio v2 uses the standalone anthology format. Arc 01 is locked under v1. Start with [Standalone Pilot 01](../arcs/02-skenario-bertahan/arc.json). Review the finished scenario before planning another one.

These are stage checklists for human-directed work, not running agents or an automated system. The owner currently operates the [orchestrator](00-orchestrator.md). In a fresh chat, invoke one role with:

`Read agents/<role>.md and execute your stage for episodes/<slug>.`

Use this sequence: **01 Showrunner [per arc] → 02 Audio Producer [only when a narration take needs generating or preparing] → 03 Image Generator → 04 Remotion Assembler → 05 QA Auditor [single post-MP4 gate] → Human Publish.** For Arc 01 Episodes 003–007, the prepared Investigator MP3s, timing files and edit maps already exist: skip Agent 02 and start each approved brief with Agent 03. Agent 04 prepares or sources any missing cue-sheet foley and permitted in-world voice SFX. For a complex vehicle episode, the owner may also request an early, read-only QA review of `panels-contact.jpg`; this does not replace the post-MP4 gate. A fresh-context QA reviewer must be independent of the builder.

Copy [pipeline-state.json](../templates/pipeline-state.json) into each episode. Each stage has `status` (`pending`, `ready`, `pass`, or `fail`) and `notes`. `ready` means available for the owning role to inspect, **not approved**. The owner automatically accepts the Gemini 3.8 Flash TTS Investigator narration: when the prepared MP3 and timing files exist, record `audio: pass` as **owner-accepted narration**, not as evidence of listening or of final SFX/mix approval. Other stages pass on their checks and recorded handoff. The producer roles update their own stage. QA writes only `audit-report.md`; the human orchestrator records its verdict in `audit` and directs the next action.

On **FAIL**, route each defect only to the owning role with the exact issue and evidence; for Arc 01, missing or defective assembly SFX belong to Agent 04. Reset affected downstream stage statuses to `pending` when their artifacts become stale, then reassemble as needed and run a new independent post-MP4 audit. Human publishing is a distinct step and requires explicit owner authorization; a QA pass alone is not publication approval.

Episode 003 has the owner-designated brief `pass` and existing narration `pass`; its 140-word script is a pre-existing exception to the current new-script budget. Agent 03 is next. The opening rule's ASR estimate ends at 3.68 s and cue timings are provisional: preserve that uncertainty for assembly and QA, and establish the scenario and rule visually within the first three seconds. Do not silently rewrite the script or regenerate the voice.
