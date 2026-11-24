# Arsip Terakhir studio contracts

**Studio v3 (*Arsip Terakhir*)** is the active format for all new episodes: 45–75 s found-phone and found-footage vertical archives with no narrator, starting from [Arsip Terakhir](../arcs/03-arsip-terakhir/arc.json). Studio v2 (*Skenario Bertahan*, [Arc 02](../arcs/02-skenario-bertahan/arc.json)) is grandfathered for published Episodes 001–005, with unfinished `episodes/006-bioskop-tanpa-pintu` paused. Arc 01 is archived under v1.

These are stage checklists for human-directed work, not running agents or an automated system. The owner currently operates the [orchestrator](00-orchestrator.md). In a fresh chat, invoke one role with:

`Read agents/<role>.md and execute your stage for episodes/<slug>.`

Use this Studio v3 sequence: **01 Showrunner (`brief.md` + `chat-script.json`) → 02 Audio Producer (character voice notes + UI/ambience SFX) → 03 Image Generator (3–6 amateur phone-photo/CCTV stills + `assets.md`) → 04 Remotion Assembler (UI timeline via `ArsipPlayer` + render) → 05 QA Auditor [single post-MP4 gate] → Human Publish.** Always cite episodes by their full path (`episodes/007-grup-ronda-rt07` vs `episodes/arc1/005-suara-dari-rumah-kosong`). A fresh-context QA reviewer must be independent of the builder.

Copy [pipeline-state.json](../templates/pipeline-state.json) into each episode. Each stage has `status` (`pending`, `ready`, `pass`, or `fail`) and `notes`. `ready` means available for the owning role to inspect, **not approved**. For Studio v3, Agent 02 delivers measured character voice-note clips and SFX without claiming listening review (`listening review: none` until the owner actually listens). Other stages pass on their checks and recorded handoff. The producer roles update their own stage. QA writes only `audit-report.md`; the human orchestrator records its verdict in `audit` and directs the next action.

On **FAIL**, route each defect only to the owning role with the exact issue and evidence. Reset affected downstream stage statuses to `pending` when their artifacts become stale, then reassemble as needed and run a new independent post-MP4 audit. Human publishing is a distinct step and requires explicit owner authorization; a QA pass alone is not publication approval.

Archived Studio v2 / v1 pipeline notes live in [archive/agents-v2-v1/README.md](../archive/agents-v2-v1/README.md).

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
