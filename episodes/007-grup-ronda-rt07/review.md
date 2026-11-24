# Episode review — ARSIP #001 (`episodes/007-grup-ronda-rt07`) / v4 / 2026-11-24

## v4 builder handoff — independent Agent 05 re-audit pending

- **[signal/timing]** Compressed `out/007-grup-ronda-rt07/arsip01-grup-ronda-rt07-v4.mp4`, SHA-256 `4e6e1dd67e8a6fa8e17dca649861780b0815041df6669e458a1ab6ab94b99dae`, 6,573,387 bytes; composition `Arsip01GrupRondaRT07`, 1080×1920, 30 fps, 1995 frames / 66.5 s video (66.517 s container), H.264 limited Rec.709 and AAC stereo 48 kHz. Preview `out/007-grup-ronda-rt07/arsip01-grup-ronda-rt07-v4-preview-540p.mp4` derives from that compressed delivery.
- **[signal/timing]** Compressed delivery: integrated `-15.4 LUFS`, true peak `-1.6 dBTP` (only 0.1 dB below the `-1.5 dBTP` ceiling). Render command: `npm run render -- Arsip01GrupRondaRT07 out/007-grup-ronda-rt07/arsip01-grup-ronda-rt07-v4.mp4 audio-master-gain-db=9`. The positional option is used because the Windows npm wrapper dropped the leading-dash spelling; it applies +9 dB and oversampled peak limiting before AAC. Encoder measurements are on the final compressed MP4.
- **[signal/timing]** Decoded stereo mix: 637 active 100 ms windows, minimum `-26.67 dBFS` RMS, zero windows below `-50 dBFS`. Silence 55.0–57.8 s: `-56.30 dBFS` RMS, `digitalZeros: 0` out of 268,800 channel samples; all 28 100 ms windows below `-50 dBFS`, maximum `-50.20 dBFS` at the first 100 ms of the hard drop. The threshold margin at that boundary is only 0.20 dB; sample peak across the silence is `-31.35 dBFS`, so the near-silence claim is RMS-window based, not a sample-peak claim. Measurements of the full mix do not prove every shorter interval or isolated bed audibility. Detailed ignored artifacts: `out/007-grup-ronda-rt07/audio-measurements-v4.json` and `measure-v4-audio.py`.
- **[visual-state]** Builder inspected the final compressed 3-second contact sheet `out/007-grup-ronda-rt07/contact-sheet-3s-v4.jpg` and `frame-v4-00s.png`, `frame-v4-m3.png`, `frame-v4-m6.png`, `frame-v4-m14a.png`, `frame-v4-m14b.png`, `frame-v4-m14c.png`, `frame-v4-m13.png`, `frame-v4-m15.png`, and `frame-v4-end.png` in the same directory. These sampled frames show the group name/member count below the top safe boundary; frame-zero hook; m6 `23.48`; recorded CCTV timestamps `23:47:47`, `23:47:52`, `23:47:56`; a single-line missing-person evidence tag; and the final played Tanpa Nama voice note. Older bubbles scroll clipped below the strip; continuous motion and all frames were not independently checked.
- **[experience]** The final strict-input cold-read model proxy identifies Bayu as missing after disclosing his location while leaving his exact fate uncertain. Its exact input and verbatim Q1–Q4 responses are recorded in `brief.md` and `sources/v4-cold-read-input.md`. It is neither audience evidence nor Agent 05 re-audit. m13 and the evidence label were strengthened after earlier model proxies did not infer Bayu's likely outcome.
- **[signal/timing]** The compressor's 12-frame sampled luma sanity test reported **warning**, not failure; this cannot certify every frame. All six approved stills were preserved byte-for-byte.
- **[signal/timing]** `npm run check` passed after the v4 changes: 89/89 Node tests and 16/16 Python tests, zero failures and zero skips. Archived-episode warnings remain in the log.
- **[human-listening]** Owner listened to v3 on a phone and reported crickets worked, scary factor was acceptable for now, and the m6 laugh was missed. This does not establish v4 audibility or approval. **v4: `listening review: none`.** The new laugh has a measured -7 dB band-limited relative level in a speech gap; actual pronunciation, laugh audibility, drone, mix and sync require human listening on v4.
- **[experience] Pending:** Agent 05's independent fresh-context re-audit of this exact v4 hash, human phone playback/listening, first-view audience comprehension, live platform overlay fit, publication terms and release approval. Agent 05's prior FAIL applies to the v3 hash and remains in `audit-report.md`.

## Historical v3 builder review (superseded)

## Checkpoint 6b — builder inspection of compressed v3

- **[signal/timing] Artifact:** `out/007-grup-ronda-rt07/arsip01-grup-ronda-rt07-v3.mp4`, SHA-256 `30e173d2aba2a45f40535edd9ed481d41943b656cbe4ab1ab7f14a25d45a1084`, 7,175,082 bytes. Composition `Arsip01GrupRondaRT07`; 1080×1920, 30 fps, 1995 video frames (66.5 s video; container 66.517 s), H.264 limited-range Rec.709, AAC 48 kHz stereo. Compressed 540p preview: `out/007-grup-ronda-rt07/arsip01-grup-ronda-rt07-v3-preview-540p.mp4`.
- **[signal/timing] Mix:** FFmpeg EBU R128 integrated `-21.5 LUFS`, true peak `-3.6 dBTP` (ceiling `-1.5 dBTP`). Decoded stereo mix measured in 64 nonoverlapping windows up to 1 second, covering 0–55.0 s and 57.8–66.5 s: minimum RMS `-34.85 dBFS` at 4–5 s; zero windows below `-50 dBFS`. This measures the complete mix, not the isolated ambience stem; it does not prove phone-speaker audibility or rule out every shorter low-level interval.
- **[signal/timing] Deliberate silence-1**, 55.0–57.8 s: `-61.14 dBFS` RMS, `-42.24 dBFS` sample peak, `digitalZeros: 0` of 268,800 decoded channel samples. Interior 55.1–57.7 s: `-61.32 dBFS` RMS, `-48.01 dBFS` sample peak, `digitalZeros: 0`. Edge peak includes codec transition energy. Measurement script and individual windows are in ignored `out/007-grup-ronda-rt07/measure-v3-audio.py` and `audio-measurements-v3.json`.
- **[visual-state]** Inspected contact sheet `out/007-grup-ronda-rt07/contact-sheet-3s-v3.jpg` and full-size compressed-export frames `frame-v3-00s.png`, `frame-v3-m3.png`, `frame-v3-m14a.png`, `frame-v3-m14b.png`, `frame-v3-m14c.png`, `frame-v3-m15.png`, `frame-v3-end.png` in the same directory. Additional `frame-v3-m14c-start.png` and `frame-v3-m14c-end.png` show the zoom endpoints. The hook and owner label appear at frame 0; the CCTV sequence shows the seated and standing figure, then an empty pos with four glasses and a lit phone; frame 1290 displays `23:47:40`; the evidence tag is one line; frame 1994 shows Tanpa Nama's grey avatar and played voice note without an amber ring. CCTV playback timestamps were held fixed to the stills' recorded times.
- **[visual-state]** The 03a/03c source images passed the visual 540×960 count documented in `assets.md`. The frame-1290 phone and glasses are visible within the critical area; the phone is close to the right boundary at the initial CCTV transition and platform overlay fit remains untested. The image-generated CCTV shelter/props are not pixel-identical to the earlier phone photo; continuity should be judged during playback.
- **[signal/timing]** Compressor color sanity sampled 12 frames and reported **warning**, with at most 615 severe out-of-range luma samples in one 2,073,600-pixel frame, below its 1% fail threshold. This sampling does not certify the entire video.
- **[signal/timing]** `npm run check` completed with 89/89 Node tests and 16/16 Python tests passing, zero failures and zero skips; TypeScript and both episode validators also passed. Existing archived-episode warnings remain in the check log.
- **[human-listening]** `listening review: none`.
- **[experience] Not verified:** independent fresh-context post-MP4 QA; human watch and listening of this exact MP4, including speech pronunciation, chuckle, signature-ping character, phone-speaker audibility and sync; real-phone playback, platform overlay fit, full-frame-by-frame transitions, and first-view audience comprehension; commercial/publication terms for generated images, TTS and generated chuckle; any publication approval. Automated checks and this builder review are not independent QA or audience evidence.

## Historical v2 review (superseded)

## Artifact Binding

- **Public Archive Number** — `ARSIP #001` (`archiveNumber: 1`, rendered as `ARSIP #001 · @skenarium`)
- **Composition ID** — `Arsip01GrupRondaRT07`
- **Exported compressed MP4 (v2)** — `out/007-grup-ronda-rt07/arsip001-grup-ronda-rt07-v2.mp4` (`7,188,219` bytes / `6.86 MiB`)
- **MP4 SHA-256 (v2)** — `137d82c2e285dd9fa5fef63c3442b4c3ef6765033b7ec4607af4127d8d6f4fc6`
- **540p preview MP4 (v2)** — `out/007-grup-ronda-rt07/arsip001-grup-ronda-rt07-v2-preview-540p.mp4` (`4,410,378` bytes, SHA-256 `9c33a6797f3673eef043d02b0dfaa0bd60f61a5e8750297cb15c484c250da2a4`, downscaled directly from v2 delivery MP4)
- **Prior v1 delivery (preserved untouched)** — `out/arsip01-grup-ronda-rt07.mp4` (SHA-256 `28eb83e2e659075d3151557fb161b53400895912a4a97e04070504ead49b83ea`)
- **Measured video specs (`ffprobe`)** — `1080 × 1920`, `30 fps`, `64.000 s`, `h264` (`yuv420p`, limited-range `tv`, `bt709/bt709/bt709`), audio `aac 48000 Hz stereo`
- **Contact sheet (v2, every 3 s)** — `out/007-grup-ronda-rt07/contact-sheet-3s-v2.jpg` (`539,687` B, SHA-256 `ef09f528987633b464ec0351863454cc95d4bf973f611ad52749a4821e374ef3`)
- **Full-size key frames inspected (from compressed v2 MP4)** —
  - `out/007-grup-ronda-rt07/frame-v2-00s.png` (frame `0`, hook + `ARSIP #001 · @skenarium` strip)
  - `out/007-grup-ronda-rt07/frame-v2-m3-zoom.png` (frame `258`, `m3` 4-glass coffee zoom, hard-cut opaque backdrop)
  - `out/007-grup-ronda-rt07/frame-v2-m14-zoom.png` (frame `1580`, `m14` CCTV 4 empty glasses + glowing phone on floor)
  - `out/007-grup-ronda-rt07/frame-v2-end.png` (frame `1919`, final frame: `Tanpa Nama` grey avatar, played `m16` state with amber ring gone + play icon)
  - Diagnostic state checks: `frame-v2-m16-unplayed.png` (frame `1752`, amber ring visible pre-play) & `frame-v2-m16-playing.png` (frame `1790`, amber ring gone, lavender pause icon + mid-playback waveform)
- **Caption draft (not posted)** — `episodes/007-grup-ronda-rt07/caption-draft.md`
- **Listening review** — `listening review: none`

## Automated Validation

- [x] **pass** — `npm run check` passed end-to-end (`tsc --noEmit`, `check-episodes.mjs`, `check-v3.mjs` enforcing `archiveNumber`, `ARSIP #NNN · @skenarium` safe zone & `>= 42 px`, overlay fade `<= 6 frames`, last artifact from `Tanpa Nama`, `tanpa-nama-ping.wav` existence, `unplayed` preplay overrun check, 88/88 Node unit tests, and 16/16 Python tests).

## Story, Clue & Format Compliance

- [x] **pass — No narrator / no recap:** Reconstructed purely from group chat messages, 4 short in-world voice notes, 3 phone photos, 1 incoming call screen, 1 missed-call system line, and 1 CCTV still. Zero narration, zero rewind loops, zero `"Kamu berhasil bertahan hidup."`.
- [x] **pass — Frame-zero hook (`00:00.0`):** `m1` (`"mas td yg ketawa di pos siapa? kita kan cuma bertiga"`) renders at `opacity: 1` on frame 0 (`frame-v2-00s.png`).
- [x] **pass — One local entity/rule + `Tanpa Nama` constant:** Local mimic rule is never explained aloud; Bayu "nearly survives" via silence after `m4`. `Tanpa Nama` (fixed grey default avatar, no phone number, never explained) sends `m15` and final artifact `m16`, logged in `arcs/03-arsip-terakhir/lore.md`. Never framed as real-world safety advice.
- [x] **pass — Fair-play visual clues (≤ 40%):** `C1` planted at `m3` (`8.75%` ≤ 40%, 4 glasses vs 3 made) and paid off visually via CCTV `m14` (4 empty glasses + phone on floor); `C2` planted at `m1` (`0.0%`, `3 anggota`) and paid off visually at `m15`/`m16` (`Tanpa Nama` appears with no join message while header remains `3 anggota`).
- [x] **pass — Texting voices & Indonesian grounding:** Distinct per character (`bayu`, `hendra`, `darto`), grounded in fictional `RT 07`.
- [x] **pass — Amateur photo / CCTV look (4 stills, gore-free):** All 4 stills verified at `540 × 960` (`assets.md`).

## Readability, Safe Zones & Motion (Contact Sheet + Key Frames)

- [x] **pass — Minimum ~42 px text:** `ARSIP #001 · @skenarium` (`42 px`), chat body (`48 px`), VN subtitles (`46 px`), timestamps (`42 px`); all legible on `contact-sheet-3s-v2.jpg` and full-size frames.
- [x] **pass — Platform UI safe zones:** All critical regions (`identityStripContent`, `chatContent`, `photoLightboxContent`, `callContent`, `cctvContent`, `notificationBanner`) clear top 10% (`y >= 192`), bottom 22% (`y <= 1497`), and right 12% (`x + w <= 950`).
- [x] **pass — Clean overlay transitions (`<= 6` frames / hard cut):** Full-screen overlays (`PhotoZoomOverlay`, `CctvFrame`, `CallScreen`) now use 0-frame hard cuts with 100% opaque backdrops; `Notification` uses 4-frame fade (`<= 6`). Confirmed zero double-exposure ghosting across all tiles of `contact-sheet-3s-v2.jpg` (including ~30 s and ~51 s) and full-size frames.
- [x] **pass — Final voice note 3-state transition:** Verified frame-by-frame in `frame-v2-m16-unplayed.png` (amber ring + play icon during 15-frame pre-play arrival), `frame-v2-m16-playing.png` (amber ring gone, pause icon + moving waveform during playback), and `frame-v2-end.png` (amber ring gone, resting play icon + full played waveform at frame 1919).
- [x] **pass — Solid identity strip clipping & motion discipline:** Scrolling messages clip strictly below `ARSIP #001 · @skenarium` (`y = 282`); all motion driven by `useCurrentFrame()`, zero CSS animations.

## Series Identity, Brand Safety & Publishing Checklist (Upload Step Only)

- [x] **pass — Series identity strip (`ARSIP #001 · @skenarium`):** Rendered cleanly in solid strip directly under `ChatHeader`; no on-screen `FIKSI` tag (owner decision 2026-11-24; account bio states fiction).
- [x] **pass — Original generic chat UI & signature sound:** Zero WhatsApp/Telegram/Line trademarks, colors, icons, or audio; `tanpa-nama-ping.wav` synthesized in-repo via `scripts/generate-tanpa-nama-sfx.mjs` and played ONLY on `Tanpa Nama` events (`m15`, `m16`).
- [x] **pass — No real PII / defamation:** Zero real people, real phone numbers, or defamatory real place names.
- [x] **pass (with caveat) — Provenance & rights (`assets.md` + `public/sfx/LICENSES.md`):** All assets logged; commercial/publication terms for Google Cloud TTS and AI image generation have not been independently verified by legal counsel.
- [ ] **pending upload step (owner/human publisher ONLY — do NOT publish without authorization):**
  - Caption draft ready in `episodes/007-grup-ronda-rt07/caption-draft.md` with **`#fiksi`** and **`#ceritahorror`**.
  - Switch **ON** the platform's built-in **AI-generated-content label** at upload.
  - Confirm `@skenarium` account bio states fiction.

## Audio Measurements (Compressed v2 MP4)

- [x] **pass — Loudness measured on compressed `out/007-grup-ronda-rt07/arsip001-grup-ronda-rt07-v2.mp4`:**
  - Integrated loudness: **`-16.3 LUFS`**
  - True peak: **`-4.1 dBTP`** (passes `<= -1.5 dBTP` ceiling with `2.6 dB` headroom)
- [x] **pass — Silence & ambience check:** `verify_export_common.py` measured `6` low-ambience intervals (`-60.82` to `-60.69 dBFS` RMS, `digitalZeros: 0`); zero mood-explaining music.
- [x] **pass — Voice notes (2–6 s each) & signature ping:** All 4 voice notes verified inside 2–6 s via `ffprobe`; `m16` derived directly from `m4` `"Pos aman."` tail; `tanpa-nama-ping.wav` (`0.420 s`, `-8.0 dBFS` peak) triggers at `m15` and `m16` (during `m16`'s 0.5 s pre-play beat so it clears before `"Pos aman."` plays).
- [ ] **not checked — Human ear-check:** `listening review: none` — owner ear-check is required before any publication decision.

## Honest Summary: Verified vs Unverified

- **Verified:**
  - `npm run check` green end-to-end (`tsc`, `check-episodes.mjs`, `check-v3.mjs`, 88/88 Node tests, 16/16 Python tests).
  - `npm run render -- Arsip01GrupRondaRT07 out/007-grup-ronda-rt07/arsip001-grup-ronda-rt07-v2.mp4` completed without overwriting v1; `ffprobe` confirms `1080×1920`, `30 fps`, `64.000 s`, limited-range `yuv420p` `bt709`, `aac 48000 Hz 2ch`.
  - Compressed v2 MP4 audio measured via `render-compressed.mjs` and `verify_export_common.py`: **`-16.3 LUFS`**, **`-4.1 dBTP`**, `6` low-ambience intervals (`digitalZeros: 0`), zero music.
  - Compressor `signalSanity` logged `"verdict": "warning"` (`58` severe out-of-range pixels across 12 sampled frames, max `21` / `2,073,600` = `0.001%`, well under the `1%` fail gate) — disclosed transparently.
  - Visual inspection of `contact-sheet-3s-v2.jpg`, `frame-v2-00s.png`, `frame-v2-m3-zoom.png`, `frame-v2-m14-zoom.png`, `frame-v2-end.png`, `frame-v2-m16-unplayed.png`, and `frame-v2-m16-playing.png` confirmed `ARSIP #001 · @skenarium` legibility, zero `FIKSI` tag, zero overlay ghosting, fixed grey `Tanpa Nama` avatar, and exact 3-state `m16` voice-note lifecycle.
- **Unverified / NOT checked:**
  - **`listening review: none`** — no human has listened to the v2 MP4, the 4 voice notes, or the new synthesized `tanpa-nama-ping.wav` by ear.
  - Subjective audio tone/vibe of `tanpa-nama-ping.wav` (whether the cold two-pulse metallic ping feels unsettling and clearly distinct from regular UI pops on phone speakers) and voice-note pronunciation/delivery (`m4`, `m6` flat take, `m9` mid-word cutoff, `m16` reused tail) have **not** been judged by ear.
  - Continuous 30 fps playback feel on a real phone (hard-cut overlay cadence, scroll rhythm, `0.5 s` pre-play timing on `m16`, glitch timing) has **not** been watched by a human (540p preview provided for owner playback).
  - Independent first-watch viewer comprehension and live TikTok/Reels/Shorts upload overlay fit + commercial legal terms for Google Cloud TTS / AI image generation have **not** been independently verified.
- **Verdict:** **`ready for owner review (Checkpoint 5)`** — awaiting owner watch + listening review. Publishing/uploading remains strictly unauthorized until explicit owner approval.
