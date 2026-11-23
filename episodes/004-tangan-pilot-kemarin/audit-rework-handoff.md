# Episode 004 — Agent 04 post-audit rework handoff

**Superseded for handoff:** On 23 November 2026, the owner listened to this cut, passed the `sampai` ending, and approved P05, P09 and P23 as coverage/continuity exceptions. See [pipeline-state.json](pipeline-state.json) and [assembly-polish-handoff.md](assembly-polish-handoff.md) for the current cut. The technical image FAIL and this audit history remain intact.

This is a **review cut with unresolved blockers**, not a passing Agent 05 audit. The prior export, accepted narration, owner-approved image sources, image technical FAIL and audit history remain preserved. [coverage-rework-request.md](coverage-rework-request.md) prepares the exact missing-coverage handoff for the human-operated orchestrator and Agents 01/03; it does not claim that any role has received or completed the request.

## Coverage that remains blocked

- P09, 00:52.50–00:58.50: the approved neutral cyclic insert and reaction do not depict the narrated leftward push, catch and arm/panel contact. Masking the reaction's instrument lights addresses only the blackout continuity, not the missing action. Do not re-prompt or paraphrase the image-service refusal recorded in [sources/prompts.md](sources/prompts.md).
- P05, 00:26.46–00:28.42: no selected shot shows an identifiable copilot foot on the pedal. P14's foot attribution remains ambiguous and is not substituted as proof. Preserve the approved picture exceptions for P14, P22 and P23 as well.

## Assembly work and ending evidence

P07 and P11 receive sustained procedural warning-red grading. P09's reaction uses exposure reduction and local instrument masking. The dedicated jolt adds `ImpactMicroShake` at the same frame as its red sweep and stinger. The hard-black tail is retained. The accepted original MP3 and padded narration samples are unchanged.

The previous sidecar's 153.040 s final-word end was an estimate. On the padded source, the final sample above −60 dBFS is **152.894937 s**, followed by digital zero; the last word is aligned by correlation against decoded MP4 audio. This bounds the end of measurable source signal but does not establish the last phoneme by ear. The new PCM vacuum is **152.916667–153.066667 s** (150 ms), and frame **4592** starts the jolt. Blackout starts at frame **4624 / 154.133333 s**, and the 4632-frame cut ends at **154.400 s**. The cut ends about 1.505 s after the last significant source sample. Full human listening for the final phoneme, dialogue, effects, and mix remains pending.

The previous render and measurements are recorded in [assembly-v2-handoff.md](assembly-v2-handoff.md). The owner requested a new Agent 05 audit; this document is the handoff for the human-operated orchestrator to initiate it. Do not regard this rework as having passed the picture audit until the missing P09 and P05 coverage or an owner-approved story solution is supplied, assembled, and independently reviewed.

## Rework export verification

- Compressed review copy: `out/skenario04-audit-rework-v3-master_compressed.mp4`; retained master: `out/skenario04-audit-rework-v3-master.mp4`. Remotion's rendered video was remuxed with the mono mastered mix because the initial stereo render measured 3 LU louder, then compressed to the review copy. Neither earlier delivery was overwritten.
- `npm run check` passed (35 Node tests, 4 Python tests). [verify-export.py](verify-export.py) passed on the compressed review copy; [export-report-audit-rework-v3.json](verification/export-report-audit-rework-v3.json) records the actual encoded measurements: 1080 × 1920 / 30 fps / limited Rec.709, −14.3 LUFS, −2.1 dBTP, and maximum measured flash-frame mean luma 43.14. Three rewind snaps correlated at 0 ms offset; the dread silence measured −94.08 dBFS RMS including AAC residue.
- The final-word source-to-export correlation was 0.8828 with measured 0 ms lag. The 152.894937 s last significant source sample is 168.313 ms before the decoded stinger onset at 153.063250 s. The 150 ms vacuum measured −73.88 dBFS RMS after AAC. The stinger leads the jolt frame by 3.417 ms. A difference search after the flash detected horizontal jolt movement of +1 then −1 pixels at 108-pixel preview width (approximately 10 pixels at 1080 width); it does not replace motion review by eye.
- A [phone-size P09 reaction frame](verification/p09-dark-v3-final.png) shows the lit instruments masked after P08. [P07](verification/p07-red-rework.png) and [P11](verification/p11-red-rework.png) show the sustained warning-red treatment from the first rework, retained in this cut. These are sampled frames, not full playback. The [ending audio excerpt](verification/ending-listening-check.wav) is provided for a human phoneme and mix check; no listening has been claimed. [speech-boundary-rework-v3.json](verification/speech-boundary-rework-v3.json) contains the 10 ms waveform measurements.
- Investigator and Charon voice publication terms, image-service rights and platform use remain unverified; see [assets.md](assets.md). No publication is authorized by this handoff.
