# Review ? ARSIP #003 ?Jahitan Langit? v1

- **Composition:** `Arsip03JahitanLangit`, 1920 frames / 64.00 s, 1080 ? 1920, 30 fps.
- **Delivery:** `out/009-jahitan-langit/arsip03-jahitan-langit-v1.mp4`; SHA-256 `43b450d765360ac04ee8c1329211f6bafec144fd16ef070f3f4318fba1b330c0`. Preview: `out/009-jahitan-langit/arsip03-jahitan-langit-v1-preview-540p.mp4`.
- **Status:** candidate ready for independent audit and owner review; no publication or scheduling.
- **human-listening:** listening review: none.

## Checks and findings

- **signal/timing:** `npm run check` passed (91 Node tests, 20 Python tests; zero failures and zero skips). `check-v3.mjs` checks all 7 voice durations and layout. The full report `out/009-jahitan-langit/verify-v1.json` is bound to the delivery and script hashes.
- **signal/timing:** compressed MP4 measured ?15.7 LUFS integrated and ?3.2 dBTP; 610 active 100 ms windows, lowest ?39.85 dBFS, zero below ?50 dBFS. At 54.60?57.40 s the silence-drop interior was ?67.50 dBFS RMS (maximum window ?62.75 dBFS). Decoded stereo had 0 exact zero samples of 6,144,000. Automated measurements do not assess sound design or intelligibility.
- **signal/timing:** Initial render was ?17.9 LUFS / ?1.6 dBTP. Preserved initial: `out/009-jahitan-langit/arsip03-jahitan-langit-v1-initial.mp4`. Final master generated from it with FFmpeg, copying video and re-encoding audio: `-af loudnorm=I=-15.1:TP=-3.5:LRA=7 -ar 48000 -c:a aac -b:a 192k`. The verifier measures the final AAC, not an assumed master.
- **visual-state:** Generated stills were inspected at 540 ? 960; m1's first candidate looked like wires, so it was replaced after two further attempts. On the compressed export, frame 0 shows the double seam and caption; m2 zoom shows sideways smoke; m8 shows two seams. The first m12 zoom lost its treeline, so a bottom-aligned zoom was implemented and rendered again; final frame 975 shows the trees below the metal. The zipper teeth are stylized/irregular in the generated image and its sense of scale still requires human viewing. m21 shows the open teeth, campsite, empty chairs and bright phone; final frame shows m22 resting in played state.
- **visual-state:** Initial compressor Rec.709 sample scan emitted a warning for a small number of out-of-nominal luma values (41 severe samples across 12 sampled 1080p frames); threshold failure was not reached. Final mastering copied video without re-encoding. Full-video color judgment remains open.
- **experience:** Fresh-context model proxy passed Q1?Q4 for original script SHA `a1060a68751014cb16fbac899f7209679842202f030ca857215f640c405a6e37`. Final timing-only script SHA `8f92e9cfc64151a23aded2a3aa50fe8eae9dc9c5efd55ec5c972ee6f2d520639` has identical reviewer-visible input other than SHA; verbatim answers in `brief.md`. This is not human audience evidence.

## Evidence files

Contact sheet `out/009-jahitan-langit/contact-sheet-3s-v1.jpg` samples frames 0, 90, ?, 1890. Full-size PNGs: `frame-00-m1.png`, `frame-m1-zoom.png`, `frame-m2-zoom.png`, `frame-m8-zoom.png`, `frame-m12-zoom.png`, `frame-m20-evidence.png`, `frame-m21-outside-zipper.png`, `frame-final-m22.png` in `out/009-jahitan-langit/`. The pre-correction video and frame extracts are retained in `out/009-jahitan-langit/pre-scale-fix/`.

## Not verified

- **human-listening:** No one has listened to this MP4. Voice naturalness, onset/cutoff, ASR pronunciation, relative mix, rattle clue, whether m22 reads as a colossal closing zipper on phone speakers, and location-bed realism are unverified. ShortZ's generic short-utterance QA reports retain onset and WPM/alignment warnings even when word differences are colloquial spelling.
- **experience:** No independent cold human viewer, phone playback review, full-motion inspection, independent audit, or owner approval of this export. A model cold-read is not audience feedback.
- **visual-state:** Scale and physical plausibility of m12 teeth, m21's relationship to the campsite, actual readable timing in motion and full-video color need independent review; the contact sheet samples only isolated frames.
- **rights:** Google TTS/voice and OpenAI-generated-image publication terms have not been independently verified. Caption and AI-label reminder are drafts; no upload has occurred.
