# Scenario 04 assembly timing conflict

**Historical note:** The owner subsequently approved non-destructive gap padding. The padded stem and the later post-audit rework are described in [assembly-v2-handoff.md](assembly-v2-handoff.md) and [audit-rework-handoff.md](audit-rework-handoff.md). The measurements below describe the original accepted PCM, not the revised timeline.

The requested assembly cannot meet both the accepted sidecar's stated times and the no-clipping silence requirement on the supplied PCM. The accepted source files remain unchanged.

`python episodes/004-tangan-pilot-kemarin/check-audio-boundaries.py` measures `narration-prepared.wav` at 48 kHz:

- Rewind 2 is documented at 58.500–58.900 s. The last 0.200 s of that interval has −17.88 dBFS RMS and −1.48 dBFS peak in the narration stem, inconsistent with a clean gap followed immediately by the next word at 58.900 s.
- The documented third rewind is 73.300–73.700 s, followed by true-zero silence from 73.700–75.300 s. That proposed silence contains 24,171 nonzero samples, including −15.30 dBFS RMS and −1.47 dBFS peak from 75.200–75.300 s. Muting the proposed window would delete significant voice-stem content. The word sidecar identifies the following word as `Setiap` from 75.300 s, but these PCM measurements show the sidecar boundary is not a safe silence boundary. Waveform measurements alone do not establish phonetic content; a listening/alignment review is still needed.
- At 30 fps the sidecar-derived tentative rewind intervals are frames 1303–1315 (43.433–43.833 s), 1755–1767 (58.500–58.900 s), and 2199–2211 (73.300–73.700 s). Rounding the first start introduces −6.7 ms relative to 43.440 s. These are not verified placements.

`npm run check` passes for the existing repository; Scenario 04 has no assembled manifest or composition yet, so this does not validate its cut. No MP4 has been rendered and no export, sound mix, flash, or phone-size playback verification has occurred. The owner-approved image exceptions and their technical FAIL remain intact. The static contact sheet alone cannot establish that P09 sells the motion and contact; P23's check is small and its exterior remains inconsistent with the landing, as already recorded by the image handoff.

To proceed, the narration's word boundaries need an audio review and a permitted timeline decision: preserve the existing audio and allow the post-rewind material to move where needed to create the full silence, or revise the timing/silence requirement. Any such adjustment must preserve all speech and re-anchor the later captions, SFX, final word and tail. The assembler contract prohibits changing the accepted source audio and requires uncertain word timing to be resolved before handoff.
