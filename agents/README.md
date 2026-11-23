# Dimensi Niskala studio contracts

Studio v2 uses the standalone anthology format. Arc 01 is locked under v1. Start with [Standalone Pilot 01](../arcs/02-skenario-bertahan/arc.json). Review the finished scenario before planning another one.

These are stage checklists for human-directed work, not running agents or an automated system. The owner currently operates the [orchestrator](00-orchestrator.md). In a fresh chat, invoke one role with:

`Read agents/<role>.md and execute your stage for episodes/<slug>.`

Use this sequence: **01 Showrunner [per arc] → 02 Audio Producer [only when a narration take needs generating or preparing] → 03 Image Generator → 04 Remotion Assembler → 05 QA Auditor [single post-MP4 gate] → Human Publish.** For Arc 1 Episodes 003–007 (`episodes/arc1/003-bel-minimarket` … `episodes/arc1/007-pos-evakuasi-sunyi`), the prepared Investigator MP3s, timing files and edit maps already exist: skip Agent 02 and start each approved brief with Agent 03. Agent 04 prepares or sources any missing cue-sheet foley and permitted in-world voice SFX; for Studio v2 scenarios, Agent 02 additionally delivers the rewind/tail stingers and any spoken world voices. Always cite episodes by their full `arc/slug` path so Arc 1 Episode 005 (`episodes/arc1/005-suara-dari-rumah-kosong`) is never confused with the Studio v2 scenario `005-sabuk-ketiga`. For a complex vehicle episode, the owner may also request an early, read-only QA review of `panels-contact.jpg`; this does not replace the post-MP4 gate. A fresh-context QA reviewer must be independent of the builder.

Copy [pipeline-state.json](../templates/pipeline-state.json) into each episode. Each stage has `status` (`pending`, `ready`, `pass`, or `fail`) and `notes`. `ready` means available for the owning role to inspect, **not approved**. The owner automatically accepts the Gemini 3.8 Flash TTS Investigator narration: when the prepared MP3 and timing files exist, record `audio: pass` as **owner-accepted narration**, not as evidence of listening or of final SFX/mix approval. Other stages pass on their checks and recorded handoff. The producer roles update their own stage. QA writes only `audit-report.md`; the human orchestrator records its verdict in `audit` and directs the next action.

On **FAIL**, route each defect only to the owning role with the exact issue and evidence; for Arc 1, missing or defective assembly SFX belong to Agent 04. Reset affected downstream stage statuses to `pending` when their artifacts become stale, then reassemble as needed and run a new independent post-MP4 audit. Human publishing is a distinct step and requires explicit owner authorization; a QA pass alone is not publication approval.

Episode 003 (`episodes/003-goyangan-dek-enam`) has the owner-designated brief `pass` and existing narration `pass`; its 263-word script (canonical count, 266 when hyphenated compounds are split) is a pre-existing exception to the current new-script budget. Agent 03 is next. The opening rule's ASR estimate ends at 3.68 s and cue timings are provisional: preserve that uncertainty for assembly and QA, and establish the scenario and rule visually within the first three seconds. Do not silently rewrite the script or regenerate the voice. Episodes 002 and 003 are **pre-hygiene legacy exemplars**: their scripts still carry all-caps comic SFX lines (`BRAK!`, `KLIK!`) that today's SFX lint bans — read them for structure and tone only; never copy their SFX-into-script pattern into a new `narasi.txt`.

## First-view rough cut

Before locking Studio v2 narration or commissioning the final panel batch, the Showrunner prepares a phone-size Remotion storyboard with scratch Indonesian narration, temporary captions and the rewind cue. Give the viewer the same visual evidence as the survivor. Prioritize the opening anomaly, the clue that changes the next decision and the final payoff. Run the [first-view review](../templates/review.md#first-view-rough-cut) during the brief stage. Record the viewer’s own words, revise the confusing beat and replay it. If an unfamiliar viewer is unavailable, record a producer self-review and leave viewer evidence pending. Final export QA follows its existing contract.

Start with [Scenario 006’s rough cut](../episodes/006-bioskop-tanpa-pintu/review.md) for an example.

## Evidence labels and review phrasing

Tag every finding in an audit, handoff note or verification report with one evidence label so routing is unambiguous:

| Label | Covers |
| --- | --- |
| `signal/timing` | Waveform, loudness, PTS, frame-offset, sync and silence measurements on a named artifact |
| `visual-state` | Prop, anomaly, lighting, signage or continuity state read from exported frames |
| `motion` | Camera, transition, shake, rewind or flash transitions detected in the export |
| `human-listening` | Observations from an actual listening pass — only ever recorded when one happened |
| `experience` | Phone-size readability, hook comprehension and first-view judgments |

Review claims use fixed phrasing. When nobody has listened, write exactly **`listening review: none`**. When a listening review actually happened, write **`owner listened and approved <file> (sha256 <hash>) on YYYY-MM-DD`** — naming the specific export artifact and its hash. Never imply a listening review from ASR, measurements or an approval of a different artifact.

Owner-approved exceptions and new regressions are independent facts. An `ownerDisposition: "approved_with_exceptions"` record keeps its `technicalVerdict: "fail"` and its documented exceptions; that disposition allows the stated handoff **without re-blocking it**, and later roles carry each exception's `downstreamVerify` check. It does **not** grandfather new work: a defect introduced by later polish (for example, framing crops from procedural transforms in a revision) is a fresh finding audited under the normal rubric, even when a nearby exception was accepted.

## Stage records

For new image handoffs, add the four structured fields below after the technical review. Any other stage can use the same record. Keep `status` and `notes` for compatibility. An older record with only those fields still uses the `status: "pass"` handoff rule.

```json
{
  "status": "fail",
  "notes": "See the transition audit for the selected P09 plate.",
  "technicalVerdict": "fail",
  "ownerDisposition": "approved_with_exceptions",
  "handoffAllowed": true,
  "exceptions": [
    {
      "panel": "P09",
      "defect": "present_unreadable_at_phone_size",
      "evidence": "In the selected contact sheet the arm and panel edge merge.",
      "downstreamVerify": "Agent 04 checks whether the contact reads in the compressed export at phone size. Agent 05 reports the result independently."
    }
  ]
}
```

Keep `status` equal to the technical verdict once it is known. Use `ownerDisposition: "pending"` while awaiting the owner's choice. `approved` allows handoff for a technical pass. `approved_with_exceptions` allows handoff for a technical fail and requires at least one documented exception. Pending and rejected records block handoff. Use `exceptions: []` except when recording accepted exceptions. Only record a disposition the owner actually gave.

For image exceptions use the audit's defect labels. Put the specific finding in `evidence`. Use a panel, transition or artifact identifier in `panel`. For a stage-wide issue use `episode`. Downstream roles carry the required checks into their handoffs and record what they found. Approval applies to the stated handoff only.
