# Scenario 04 assembly handoff

Composition: `Skenario04TanganPilotKemarin`, 1080 × 1920 at 30 fps, 4,636 frames (154.533 s), schema and pipeline version 2. The accepted narration MP3 remains byte-for-byte unchanged (SHA-256 `8d270aca0541c9595deb0e99f21404cef5859ded77d98d49fc12b682b0fa3b8c`). The assembly uses a separate WAV derivative of the accepted PCM, preserving every source sample and adding zeros at three previously digital-zero locations. See [assembly-edit-map.json](assembly-edit-map.json) and [assembly-timestamps.json](assembly-timestamps.json). The sidecar's word boundaries remain estimates; shifting does not improve the producer's phonetic alignment.

| Event | Frames, start inclusive / end exclusive | Seconds |
| --- | --- | --- |
| Rewind 1 | 1298–1310 | 43.2667–43.6667 |
| Rewind 2 | 1755–1767 | 58.5000–58.9000 |
| Rewind 3 | 2214–2226 | 73.8000–74.2000 |
| Dread silence | 2226–2274 | 74.2000–75.8000 |

All four windows contain zero narration PCM samples; the soundtrack intentionally includes tape snaps during the three rewinds. Total padding is 1.04 s. The start of each snap is placed at `round(startFrame * 48000 / 30)` in the mix. The final vacuum is 153.050–153.200 s, jolt begins at frame 4596, and blackout starts at frame 4628. The end is 1.493 s after the shifted sidecar's estimated last-word end of 153.040 s.

The original image technical verdict remains **FAIL**, with the owner's approval to proceed despite the documented exceptions: P09 does not depict movement or arm/panel contact, and its reaction has lit instruments after dark P08; P23 retains a cloud gap after landing; P14 foot attribution is ambiguous and map/check text is small; P22 aircraft geometry differs. Source mapping and technical audit are preserved in `owner-approved-exception/source-map.json` and [sources/prompts.md](sources/prompts.md). The P09 reaction is exposure-reduced and cut to the narrated impact; P23 receives continuous drift and separate click, paper and pencil cues. The ending's dedicated jolt plate is separate from P24. No image-stage pass or independent QA approval is implied.

Audio: the approved Investigator and separate Charon copilot clips are retained; their rights status is in [assets.md](assets.md). The rotor drone, warning static, short clicks, paper/noise textures, impacts and sub-hit are locally synthesized by [mix.py](mix.py), with no third-party recordings added. The tape snap was supplied by Agent 02. These synthesized sounds and the two voice clips still require subjective listening in context; automated checks do not establish sound quality or publication rights.

The original prepared WAV and MP3 were not modified. [check-audio-boundaries.py](check-audio-boundaries.py) reproduces both the source discrepancy and the new stem's exact-zero checks, and confirms that removal of the inserted zero blocks reconstructs the original PCM exactly.

## Export and review evidence

- Master: `out/skenario04-tangan-pilot-kemarin-mastered.mp4`; compressed review copy: `out/skenario04-tangan-pilot-kemarin-mastered_compressed.mp4`. The picture was first compressed after the Remotion render, then remuxed with the adjusted mix and compressed again for the review copy. Both are 1080 × 1920, 30 fps, limited-range Rec.709 with yuv420p video.
- `npm run check` passed (35 Node and 4 Python tests). The final compressed export passed [verify-export.py](verify-export.py); full measurements are in [verification/export-report.json](verification/export-report.json). Three tape snaps correlated at 0 ms offset; the jolt's decoded onset precedes frame 4596 by 3.167 ms. All 26 flash frames were measured; maximum mean luma was 43.14. The compressed mix measured −14.3 LUFS and −2.1 dBTP. Dread silence measured −94.08 dBFS RMS, with AAC edge residue; the underlying narration stem and PCM mix are exactly zero in that window. The final 150 ms vacuum measured −73.78 dBFS RMS after AAC.
- At 270 × 480, the P09 [insert](verification/p09-insert-phone-final.png) and [reaction](verification/p09-reaction-phone-final.png) convey a control and a slumped copilot, but **do not clearly sell the specific leftward movement or arm/panel contact** narrated at that moment; the accepted missing-coverage exception remains visible. The reaction's instrument illumination remains a continuity mismatch despite the exposure reduction.
- The P23 [phone-size frame](verification/p23-phone-final.png) shows the neutral stick, `CELAH` label and check clearly enough to recognize, but the cloud-gap exterior remains inconsistent with the landing. Motion and the timed click, paper and pencil sounds do not make the static plate itself depict those actions.
- The [cover](verification/cover-final.png), [jolt](verification/jolt-final.png), and [blackout](verification/black-final.png) stills were extracted from the compressed export. These are sampled-frame observations, not full playback or listening review. In-context audio listening, independent Agent 05 QA and publication-rights review remain outstanding.
