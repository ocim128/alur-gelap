# Episode 004 ? independent post-MP4 audit, 21 November 2026

**Verdict: PASS WITH NOTES.** No blocking defect was demonstrated in the sampled exported picture or measured audio gates. The human orchestrator records `audit: pass` and carries the notes and unchecked items forward. This does not authorize publication, and the assembler's `render: ready` state records that full playback and listening remain outstanding. No source, audio, image, render or pipeline state was edited by this reviewer.

## Measured technical gates

- **Export:** `out/ep004-alarm-di-tangga.mp4`, `Arc01Episode04`: H.264 1080 ? 1920, 30 fps, **2,088 frames / 69.600 s**. The AAC stream reports 69.600 s and both streams report start 0. The first AAC packet has PTS ?0.021333 s and specifies 1,024 skipped priming samples. PCM measurements below use the decoded, priming-trimmed stream on the video presentation timeline. Decoded AAC is approximately 69.525 s; the shortfall is in the final black tail.
- **Jolt sync:** Exported frame **2052 (68.400000 s)** still shows the girl by the door; frame **2053 (68.433333 s)** is the first flash/jolt. The finished AAC first exceeds ?60 dBFS in the stinger window at **68.433333 s** and exceeds ?40 dBFS at **68.433521 s**. Signed audio-minus-video offset is **0.000 ms** at the ?60 dBFS threshold, within ?33 ms.
- **Vacuum and tail:** The last pre-sting finished-mix sample above ?60 dBFS is approximately **68.262438 s**, yielding **170.9 ms** of near-silence before the stinger, within 120?180 ms. The prepared narration decodes to 68.260 s and has signal above ?40 dBFS until approximately 68.252 s; this is a waveform boundary, not proof of an audibly natural final consonant. Jolt lasts 27 frames / 0.900 s. Black starts at frame 2080 (69.333333 s) for eight frames / 0.267 s. From the narration-file end to video end is 1.340 s, within the 1.0?1.5 s tail budget.
- **Loudness:** Independent FFmpeg EBU R128 measurement on final AAC gives **?14.0 LUFS integrated and ?1.4 dBTP**, meeting the ? ?1.0 dBTP limit. The assembler reports a ?5.7 dB peak difference between a narration-plus-effects window and the isolated stinger window; this is not an isolated narrator-stem comparison.
- **Automated checks:** `npm run check` passed TypeScript, episode validation and **23/23 tests**. Warnings are from older comparison cuts. These checks do not prove perceptual quality or caption-to-speech sync.

## Picture, script and cue evidence

- **Script and captions:** Normalizing case and punctuation yields **122 script words and 122 caption words in the same order**. The timing sidecar is provisional ASR; matching text alone does not establish narration intelligibility or actual caption-to-speech synchronization.
- **Cover and HUD:** Actual frame 6 (00:00.2) displays the four-word `JANGAN TIDUR DI BAWAH` title in the upper portion of the centered 3:4 crop; the title component schedules it for 0?1.8 s. The entry badge and supply data are `HARI 2 ? 21:00`, water 80%, battery 30%; the exit badge and card are `HARI 2 ? 23:30`, water 70%, battery 25%. Sampled HUD frames do not obscure the survivor's face. An actual platform profile preview and continuous all-frame clearance were not checked.
- **Five visual checks:** (1) Sampled frames show the closed ruko shutter, rear stair, unbarred balcony window, brown room door and red-capped bottle; reveal and jolt retain the girl next to the brown door and dark corner. (2) Selected wide stair views show plausible figures; the reveal includes the floor to show the bottle by the shoe and the crouching girl, while the jolt is a face/upper-body close-up. The corrected panel 10 arm is visibly connected and the bottle remains beside the shoe. (3) Panels 07?09 place the survivor by the window looking toward the door; the close reveal and jolt retain the door-side corner. Static samples support the sightline but cannot establish the transition's feel in motion. (4) The balcony window is unbarred and the bottle rests on a stair, then appears beside the shoe. The muddy prints are identifiable in the sampled 30 s view without a graphic or dedicated accent. (5) `DISEWAKAN` is visible in the opening art but is incidental to the spoken story; no other plot-bearing environmental lettering is required. The locked survivor and teen retain recognizable face, hair and clothing cues. No vehicle is shown, so RHD/windshield geometry is not applicable.
- **Foley timeline:** The manifest schedules a close bottle scrape at **49.000 s** and a breath at **50.400 s**, after the ASR-estimated `plastik bergesek dekat sekali` end at 48.915 s. The picture next shows the bottle at the shoe from 50.900 s. The quiet clue has no dedicated SFX cue. This is timeline evidence, not a claim of audible realism, intelligibility or final sync; no sound of a bottle falling down stairs is scheduled.

## Notes and limits

- **Mixed footprints:** Panel 06 contains both bare-foot-like and shoe-tread marks above the alarm. This may imply multiple tracks; it is an incidental continuity ambiguity in the sampled still, not a demonstrated contradiction of the narration. Check whether it distracts in the actual cut without accenting the clue.
- **Record note:** An earlier paragraph in `assets.md` still says full brief approval is pending, but the later assembly section and pipeline state record the owner's full-brief and selected-image approval. The orchestrator can reconcile the stale wording without changing the approved artwork.
- **Review coverage:** The approved brief, script, timing/edit records, manifest/captions, locked sheets, contact sheet, asset record and assembler review were compared. Actual MP4 frames were sampled across all ten panels, the reveal, flash and black. The complete cut was not played at normal speed, and no listening, first-viewer test or platform preview was available. Thus exact final-word release, narration edit joins, caption sync, bottle-scrape suitability, breath/mix balance, flash comfort and subjective transitions remain unchecked. The owner's automatic narrator acceptance does not imply listening.

**Human listening:** Review the full cut and caption sync, narrator edit joins and final word, bottle scrape on the depicted floor, breath, stinger and mix balance.<br>
**Rights and release:** Verify generated voice/image and font terms, required CC BY attribution, platform disclosure and explicit publication authorization.

---

## Earlier image-stage advisory audits ? historical

# Re-audit ? 21 November 2026

**Advisory still-image result: PASS WITH NOTE.** The earlier image defects below are superseded by this recheck. This does not pass the post-MP4 gate or change pipeline state. The full brief remains pending; the spatial-layout approval is not full-brief approval.

- **Resolved:** The revised panels 05?06 show identifiable muddy footprints on treads above the red-capped alarm bottle at contact-sheet scale. Panel 10 now shows a shorter connected arm and a hand withdrawing above the bottle near the survivor's shoe. The unbarred window and the reveal/jolt room geometry remain intact in the selected stills.
- **Note for Agent 04:** Panel 06 shows both bare-foot and shoe-tread marks above the bottle. This could imply more than one source of tracks; check whether the distinction confuses the intended clue in the actual cut. Keep the clue unaccented. No demonstrated narrative contradiction is established by the still alone.
- **Handoff:** Agent 03 owns image-stage status. A passing production handoff also requires the still-pending full brief decision by the owner/orchestrator. Preserve this distinction; do not mark the brief approved based on this re-audit.

**Review scope:** The revised contact sheet for each episode, critical full-size revised panels, brief, prior audit, recorded retries and pipeline state were compared. Each batch contains 11 unique 1080 ? 1920 panel files. No MP4, manifest or captions were found for these episodes: cover, final SFX, actual cuts, caption/HUD parity, jolt synchronization, vacuum, true peak and normal-speed playback remain unchecked. `npm run check` passed all 22 tests, but does not validate these unregistered future compositions. The prepared Investigator narration is owner-accepted without a claimed listening review. A separate independent post-MP4 audit remains required.

**Human listening:** Narration, effects, caption sync and final mix remain unchecked.<br>
**Rights and release:** Voice, generated-image and other applicable rights, and publication authorization, remain for the orchestrator.

---

## Earlier advisory audit ? historical; superseded where stated above

# Episode 004 ? Agent 03 advisory image audit, 21 November 2026

**Image-stage assessment: FAIL / not ready for a passing image handoff.** This is an assessment of the selected stills, not a post-render verdict. `brief: pending` also remains an independent handoff precondition: the owner approved the spatial layout and unbarred window, but the state does not claim approval of the complete brief.

## Scope and checks

This is the owner's requested **early Agent 03 image-stage review**, not the independent post-MP4 gate. No episode MP4, manifest or captions were found; consequently the exported-pixel, sound, 00:00.2 cover, caption/HUD, ?1-frame jolt sync, 120?180 ms vacuum and true-peak gates are **not checked**. Do not enter this advisory result as a final `audit` verdict. `npm run check` passed (22 tests); it does not validate these as-yet-unregistered episodes. The locked driver and teen sheets, episode brief and script, selected contact sheet, selected critical images, generation record and pipeline state were reviewed. Each batch has ten distinct 1080 ? 1920 WebP panels plus a distinct jolt, verified by SHA-256. Prepared narration, timestamps and edit map exist; owner acceptance does not imply listening.

## Findings and routing

1. **Agent 03 ? panels 05?06, silent muddy-footprint clue:** At the contact sheet's 270 ? 480 tile size, I cannot reliably identify upward muddy footprints on the treads above the red-capped bottle; they merge into the dark stair texture. This supports the producer's documented `images: fail` and 2/2 retry count for both panels. A directed correction should make the two footprints legible as footprints above the alarm while preserving the low-key, unaccented clue and physical contact on horizontal stair treads. Recheck at phone size.
2. **Agent 03 ? panel 10, anatomy:** The girl's forearm and hand extend conspicuously toward the bottle and look unusually long in the selected full-resolution image. The bottle is correctly near the survivor's shoe, so repair the reach without moving that story prop. The image record says retry 2 displaced the bottle and the earlier variant was retained; route a new directed correction through the orchestrator rather than claiming the prior alternative passed.
3. **Orchestrator ? brief state:** Resolve the still-pending full-brief handoff before a passing image-stage handoff; do not infer full brief approval from the window-layout decision.

## Five checks and assembly handoff

- **Set/props:** 05?06 show the stair and bottle; 09?10 place the red cap near the shoe. The selected 10 and jolt share a brown door at left and dark corner at right. The prop transition needs in-cut review.
- **Scale/anatomy:** Panel 10's reach is the concern above; the close jolt omits the door bottom and floor. The remaining sampled figures show no comparably obvious stretched arm.
- **Vantage:** 07?09 keep the survivor beside the window, and 10 looks toward the door-side corner; the 09 ? 10 ? jolt move needs verification in the actual composition.
- **Barriers/reflection:** 03 shows an unbarred casement and balcony. 05 depicts the bottle resting on a stair tread; 09?10 place the hand and bottle inside the room. The footprint readability failure remains.
- **Text/identity:** `DISEWAKAN` is incidental to `narasi.txt`, so small size is a note rather than a blocking text error. The driver and teen broadly match the locked hair, clothing and faces. Opening HUD and the final cue of plastic close to the shoe remain Agent 04 work; no fall or rolling sound should be invented.

After directed correction and a renewed Agent 03 self-audit, Agent 04 should assemble the approved handoff; the orchestrator must arrange a separate independent post-MP4 audit. No state or artwork was edited.

**Human listening:** Final narration, effects, caption sync and mix remain unchecked; the orchestrator must arrange the final ear-check.<br>
**Rights and release:** Verify voice, generated-image and other asset rights and obtain TikTok publication authorization before release.
