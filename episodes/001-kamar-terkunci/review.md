# Assembly self-review — Kamar Terkunci

- **Story / fair play: needs work.** The locked P04 does not visually establish the key and knife. P08 and P10 do not show each narrated action in the corresponding state; P19 is already seated when the narration says to sit. The owner waived the prior P02, P03, P08 and P14 findings, but P04 remains open and P19 still needs review. See `assembly-handoff.md`.
- **Clock continuity: needs work.** The measured cut has fewer than 70 seconds from the reset to the 09:03 check. The HUD jumps at the check; the time compression is not signaled.
- **Picture and sound: not checked in full playback.** Representative extracted frames include cover, scrape, shoe shadow, hatch and black cut. This does not substitute for normal-speed, phone-size playback or listening. Foley substitutions, narrator joins, voice intelligibility and caption timing need review.
- **Technical: pass for listed checks.** `npm run check` passed TypeScript, manifest validation and 25 tests. The MP4 is 1080 × 1920, 30 fps and 141.000 s. FFmpeg EBU R128 measured −14.2 LUFS integrated and −1.8 dBTP. Black begins at frame 4125 (137.500 s); the encoded AAC decoded to PCM crosses 0.001 amplitude at 137.500021 s, +0.021 ms relative to the black frame, within one frame. Very low AAC pre-echo appears before that threshold from 137.497646 s.
- **Rights: not checked for publication.** Existing shared foley provenance and required credit are recorded in `public/sfx/LICENSES.md`; image and voice service terms need review. See `assets.md`.
- **Platform preview, independent viewer, owner feedback and independent QA:** not checked.
- **Verdict: needs revision / review.** Export is a review draft, not a render pass or publication approval.

Reproduce after reviewing dependencies: `python episodes/001-kamar-terkunci/build-assembly.py`, `python episodes/001-kamar-terkunci/mix.py`, apply the mastering filters shown in the assembly handoff, render `Skenario01KamarTerkunci` with Remotion at 30 fps, then mux `mix-master.wav` as AAC. Existing output paths are overwritten by the commands used for this draft; preserve them before reproducing if needed.

## Audit revision — 22 November 2026

The timing and P17 shadow were revised after the independent FAIL. The clock now runs 70 s from reset to check; the P17 shadow interrupts the light strip in the source-frame test. P08 starts with the run line and P10 no longer starts before the stated hit, but the seated-state line and entry still lack matching selected picture. P04 still lacks the key and knife. The speech-to-hit measurement is provisional and full listening, phone-size motion review, rights and independent QA remain open. This producer revision is not an audit pass. See `assembly-handoff.md`.
