# Episode 004 ? assembler review, 21 November 2026

**Status: render ready for inspection; independent post-MP4 QA and listening remain open.** The owner approved the brief and selected images, and automatically accepts the existing Investigator narration. No listening review is implied. Composition `Arc01Episode04` uses the repository-root Remotion project, `manifest.json`, `captions.json`, the approved panel batch and the separate SFX recorded in `assets.md` and `public/sfx/LICENSES.md`.

## Story and experience

- **Assembly evidence:** opening establishes the survivor and ruko; the callout supplies `JAUHI LANTAI SATU` within three seconds. The ASR estimate places the end of the spoken opening rule at 3.59 s; actual speech timing is not verified by listening.
- **Continuity:** entry HARI 2 ? 21:00, water 80%, battery 30%; exit HARI 2 ? 23:30, water 70%, battery 25%. The phone and water bottle are in the opening art. A sampled frame shows the supplied footprint clue with no sound accent; the panel batch has a mixed-footprint continuity caveat to check at normal speed.
- **Not checked:** independent first-viewer comprehension, animated acting and full cause-and-effect in real-time playback. The script describes a hypothetical bottle rolling if touched; the actual cue is only a close scrape, with no fall or roll down the stairs.

## Picture, sound and accessibility

- **Sampled frame review:** `verification/contact-review.jpg` includes the 00:00.2 cover, inventory cards, clue, anticipating survivor, reveal, jolt and black. In these frames, the title is within the upper-center 3:4 crop and supply cards do not cover the face. Profile-grid/platform preview and the complete cut at phone size remain unchecked.
- **Captions:** 122 caption words match the script in order ignoring punctuation and capitalization, grouped at a maximum of four. ASR `diruko` was split at an estimated midpoint; `center` and `tersengol` were normalized to script spelling. ASR timing, speech sync, pronunciation and audio edit joins require listening.
- **Cue placement:** close bottle scrape begins 49.0 s and separate breath begins 50.4 s; the bed fades down before the scrape and resumes after. The footprint clue has no dedicated accent. The bottle source depicts sliding on wood, so its suitability for the pictured floor must be judged by ear. No in-world voice is scripted. Tension, vacuum, jolt and blackout measurements are in `mix-measurements.md`.
- **Not checked:** normal-speed playback of every scene and transition, full narration and foley listening, subjective mix balance, and platform UI or flash comfort. Do not interpret owner narrator acceptance as those reviews.

## Technical, rights and delivery

- **Pass:** exported MP4 1080 ? 1920, 30 fps, 69.600 s; `npm run check` passed all 22 tests and validated this composition. Existing legacy Episode 001 warning messages remain. Exported flash/AAC stinger offset is 0.000 ms by the documented ?60 dBFS onset measurement; final mix is ?14.0 LUFS and ?1.4 dBTP.
- **Rights record:** see `assets.md` and `public/sfx/LICENSES.md` for generated art, voice and CC0/CC BY source details. Publication rights for voice, image service and fonts remain unverified; the dklon attribution applies. Platform disclosure and publishing are separate and not authorized by this handoff.
- **Reproduction:** see `mix-measurements.md` for assembly, render, mastering and sync measurements. The MP4 is an assembly artifact; independent post-MP4 Agent 05 QA is still required.
- **Owner feedback:** brief and panels approved; no feedback on this finished cut. **Independent viewer feedback:** unavailable.

Verdict: ready for inspection; listening and full real-time review remain needed before a production pass or publishing decision.
