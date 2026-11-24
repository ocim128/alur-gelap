# ARSIP #002 — v1 builder review, 2026-11-25

## Artifact binding

- Composition: `Arsip02PagiJamDua`.
- Compressed MP4: `out/008-pagi-jam-dua/arsip02-pagi-jam-dua-v1.mp4`, SHA-256 `35807d420e1956f801c21f7d534e63a145174220d21a8121918a98fcf4dc0718`.
- 1080 × 1920, 30 fps, 2,090 frames, 69.674 s container duration, H.264 limited-range BT.709, AAC stereo. The script is 69.667 s.
- `out/008-pagi-jam-dua/arsip02-pagi-jam-dua-v1-preview-540p.mp4`; `out/008-pagi-jam-dua/contact-sheet-3s-v1.jpg`; key-frame JPEGs are alongside them.
- **listening review: none**. The owner has not listened to or approved this episode mix.

## Verification and limitations

- **signal/timing — pass:** `npm run check`: 91 Node tests passed, 0 failed, 0 skipped; 20 Python tests passed. Includes existing archived-content warnings. This does not prove performance, story comprehension or audio quality.
- **signal/timing — pass:** `python scripts/verify-v3-export.py out/008-pagi-jam-dua/arsip02-pagi-jam-dua-v1.mp4 episodes/008-pagi-jam-dua/chat-script.json`: integrated −15.7 LUFS, true peak −2.2 dBTP; minimum active 100 ms stereo RMS −43.75 dBFS across 660 windows, 0 below −50; silence interior aggregate −64.99 dBFS, maximum window −62.43 dBFS; 0 exact zero samples both inside and globally. Full JSON: `out/008-pagi-jam-dua/verify-v3-export-v1.json`. Loudness-band membership was explicitly checked; the script's overall pass alone does not enforce that target band.
- **signal/timing — needs work:** Aji source has final alignment and overall ShortZ pass; Salsa final alignment passes but ShortZ reports a raw last-word timing/truncation failure; Nino alignment flags two `nggak`/`gak` spelling variants. All three report possible onset clipping. Retakes and reports retained in `sources/`; no claim that ASR settles audible boundaries. Nino's 5.285 s note overlaps the incoming m8 pop by about 0.952 s; owner/QA must judge intelligibility. Clips are 3.365 s, 3.565 s, and 5.285 s.
- **visual-state — needs work:** all six source stills were examined at 540 × 960, and the exported contact sheet and seven key frames were inspected. m1 overhead foot patches are visible in its zoom; m9 `POS 2` is legible; m14 yellow tent, m18 factual tag, and m19 silhouette are visible. At m16 the dark circle under the tent pole can read as a manufactured foot rather than a shadow, so the payoff is not established beyond doubt. The m5 bright boundary can also be read as a horizon. Independent QA should judge these at phone size. The generated m1 photo's feet are cropped in the frame-zero bubble, becoming visible during its zoom.
- **motion / experience — not fully checked:** sampled contact sheet and named frames are not a complete transition or safe-zone audit; no independent first-watch comprehension test or human phone review occurred. The approved model-proxy cold read and script SHA-256 `c8ef58ec335d18400d38900449e316d0ddae42bcda7593aac7b429fbaa38836f` remain unchanged; no timing or story edits were made.
- **human-listening — not verified:** voice naturalness, onset/tail, pacing, mix, bird recognition at 02.41, soundscape realism, the hard drop and notification identity on phone speakers. Synthetic bird and breath sounds are candidates, not evidence of perceived birds/breath.
- **rights — not verified:** commercial/publication terms for Google voice service and built-in generated imagery. See `assets.md` and `public/sfx/LICENSES.md`. No human approval, independent Agent 05 audit, publication or audience result is claimed.

## Reproducibility and findings

The requested `npm run render -- Arsip02PagiJamDua out/008-pagi-jam-dua/arsip02-pagi-jam-dua-v1.mp4` first produced the preserved `out/008-pagi-jam-dua/arsip02-pagi-jam-dua-v1-premaster.mp4` (SHA-256 `9c9aee10dcf1c0c08d147818abf4614add879924eaecd973eba7125e0cad2608`): −21.7 LUFS and six low active windows. The final v1 was made from that compressed file with FFmpeg video stream copy and a second AAC encode using `aresample=192000,volume=8.8dB,alimiter=limit=0.74:attack=5:release=50:level=disabled:latency=1,aresample=48000`, `-c:a aac -b:a 192k -movflags +faststart`. An intermediate +7 dB candidate was retained but measured −16.6 LUFS, outside the requested band. Double AAC encoding and limiter sound require ear review. These versions were not independently audited.

Builder corrected m1 and m16 zoom cropping specifically for this episode; sample frames confirm visibility, but do not resolve whether the m16 disk reads as a shadow. No on-screen `FIKSI` tag was added. The caption draft contains both required hashtags and the future upload label reminder.

**Verdict: rendered candidate, needs independent Agent 05 QA and owner phone listening; audio and image technical exceptions remain open. Not a publication approval.**
