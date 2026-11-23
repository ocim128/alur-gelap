# Scenario 05 assembly handoff

**Later post-audit revision:** See [audit-rework-handoff.md](audit-rework-handoff.md) for the current candidate, updated timing and unresolved blockers. The remaining text below describes the earlier export and is retained as production history.

Composition `Skenario05SabukKetiga`: 1080 × 1920, 30 fps, 4,693 frames (156.433 s). The owner-accepted prepared narration MP3 is unchanged (SHA-256 `A6638C8A0C1E71E8D808160CACD1D2CD51EC74F8727524AA7E3B8B0DDCFBC416`). [Assembly edit map](assembly-edit-map.json) and [shifted word timestamps](assembly-timestamps.json) document a PCM derivative with 0.100 s of silence inserted inside existing digital-zero gaps; no original narration samples are removed. The sidecar word times remain producer estimates, not verified phonetic boundaries.

| Event | Frames, start inclusive / end exclusive | Seconds |
| --- | --- | --- |
| Rewind 1 | 1734–1746 | 57.800–58.200 |
| Rewind 2 | 2174–2186 | 72.467–72.867 |
| Rewind 3 | 2721–2733 | 90.700–91.100 |
| Dread silence | 2733–2778 | 91.100–92.600 |

All four windows contain zero narration PCM samples. The final mix deliberately contains a snap in each rewind; the dread interval is true-zero PCM, with a visual beacon. The shifted sidecar places “Balik lagi” at 92.640 s. Snap placements use `round(startFrame * 48000 / 30)`. The end-of-narration estimate is 154.940 s, the final vacuum is 154.950–155.100 s, and the jolt begins at frame 4653; blackout begins at frame 4683. The production mix uses the separate `scenario05-tower-pa-mixready.wav`; the narrator's quoted line is muted in the mix between 43.400 and 46.940 s, preserving the preceding word's low-level tail. The narrator master remains unchanged.

The 0.4 s paired buckle clicks in P10 are placed at the first “kebuka” rather than the much later third-belt phrase. The P16 fake click and P17 release are placed at the measured end of “satu ketukan” and 0.4 s later. This allows the requested single-beat audible relationship but separates the fake click from the earlier spoken “sampai bunyi”; the script's measured delivery places these words several seconds apart. Treat this as a timing compromise for playback review, not proof that both spoken descriptions occur 0.4 s apart.

## Asset and rights record

- 24 selected owner-approved plates plus the separate clean jolt plate: `public/assets/005-sabuk-ketiga/selected-owner-approved/`; selection and technical audit history are in [sources/prompts.md](sources/prompts.md) and [orchestrator-image-handoff.md](orchestrator-image-handoff.md). The owner allowed the best available images despite unresolved defects. That decision does not convert the image technical failures into a pass.
- Narration and tower voice source, generation details and rights status: [audio-assets.md](audio-assets.md) and `public/sfx/LICENSES.md`. Publication terms for the tower voice remain unverified.
- Rewind tape snap: reused `public/assets/004-tangan-pilot-kemarin/sfx/tape-snap-rewind.wav`. Other sound effects and helicopter bed are procedurally synthesized in [mix.py](mix.py). The filtered echo derives from the approved narrator.
- Render and compression depend on the repository's Remotion/Node packages and local ffmpeg/ffprobe. Rebuild with `python episodes/005-sabuk-ketiga/build-assembly.py`, then `python episodes/005-sabuk-ketiga/mix.py`, `npm run check`, and `npm run render -- Skenario05SabukKetiga <new-output.mp4>`. Outputs refuse overwrite.

## Export verification and self-review

The first Remotion output measured −11.4 LUFS / −0.7 dBTP after AAC and failed delivery targets. It is retained as a non-delivery intermediate. The mastered MP4 applies `volume=-2.7dB` to its audio with video copied; the neighboring `_compressed.mp4` is the review delivery. [Export report](verification/export-report-mastered.json): 156.437 s, 1080 × 1920, 30 fps, limited-range BT.709 `yuv420p`, −14.1 LUFS, −3.1 dBTP. All three snaps correlate at their requested frames (0 ms measured offset); the final jolt audio onset is 2.458 ms before the flash. Maximum flash mean luma is 136.49; blackout is black. P11 and P19 impact transients independently correlate at 0 ms against the visual cue frames: [impact sync report](verification/impact-sync.json). `npm run check` passed (35 Node tests, four Python tests).

The source narration PCM and prepared mix are exactly zero across the dread interval. Decoded AAC has edge residue (full-window −80.78 dBFS RMS; peak −39.28 dBFS; inner window measured at the verifier's −300 dB floor). The 150 ms vacuum measures −63.42 dBFS RMS after AAC. Do not describe AAC as sample-exact digital zero.

At 270 × 480, the [exported frame sequence](verification/phone-contact-mastered.png) shows the P11 pilot pitched forward, but the exact body/panel contact remains obscured; stills cannot establish that the small shake sells the impact during playback. The flash partially hides the P24 → jolt cut, but the aircraft scale, terrain and sky still visibly change after the flash; it cannot be called a clean continuity match. Bent-rail shape, half-open-door readability and inconsistent rain remain the documented accepted limitations. Phone-size clips are provided for [P11](verification/p11-phone.mp4) and [the final transition](verification/p24-jolt-phone.mp4). This is a frame-based producer self-review, not a real-time listening/playback review or independent QA.

Full playback and listening, final caption sync, platform safe-zone review, image-exception assessment in motion, and independent QA remain open. No publishing approval is implied. Reproduce the final mastering with `ffmpeg -i <render.mp4> -map 0:v:0 -map 0:a:0 -c:v copy -af volume=-2.7dB -c:a aac -b:a 192k -movflags +faststart <new-mastered.mp4>`, then `npm run compress -- <new-mastered.mp4>` and run both verification scripts against the resulting review copy.
