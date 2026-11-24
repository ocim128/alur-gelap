# Episode review (Studio v3 · Arsip Terakhir) — [episode ID / version / date]

Copy into `episodes/<slug>/review.md`. Mark each item `pass`, `needs work`, `not checked`, or `not applicable` with concrete evidence. Never claim a listening review that did not occur.

## Artifact Binding

- **Composition ID** — `[ArsipNNSlug]`
- **Exported compressed MP4** — `[out/<file>.mp4]`
- **MP4 SHA-256** — `[hash]`
- **Measured video specs (`ffprobe`)** — `[width x height, fps, duration s, codec/color tags]`
- **Contact sheet** — `[path to 3 s contact sheet]`
- **Listening review** — `listening review: none` *(replace ONLY with `owner listened and approved <file> (sha256 <hash>) on YYYY-MM-DD` when a human actually listened)*

## Automated Validation

- [ ] `npm run check` passed (including `pipelineVersion: 3` schema, required `archiveNumber`, 45–75 s duration, frame-0 hook, reading-pace hold minimums, asset paths, `ARSIP #NNN · @skenarium` identity strip safe zone & `>= 42 px` font, overlay fade `<= 6 frames`, last artifact from `Tanpa Nama`, Clue Ledger event references, and unit tests).

## Story, Clue & Format Compliance

- [ ] **No narrator / no recap:** Story is reconstructed strictly from found-phone/found-footage artifacts; no narration track, no narration captions, no rewind loops, no `"Kamu berhasil bertahan hidup."` ending.
- [ ] **Frame-zero hook (`00:00.0`):** First message/artifact appears at frame 0, is readable within 2 s, and contains an impossible detail.
- [ ] **One local entity/rule + `Tanpa Nama` constant:** Local rule is never explained aloud; `Tanpa Nama` (fixed grey default avatar, no phone number, never explained) sends the final artifact and is logged in `arcs/03-arsip-terakhir/lore.md`; survival angle is never presented as real-world safety advice.
- [ ] **Fair-play visual clue (≤ 40%):** Clue planted in the first 40%, clearly readable at phone size on the exported MP4 / contact sheet, and pays off visually via artifact per the Clue Ledger.
- [ ] **Texting voices & Indonesian grounding:** Everyday Indonesian chat style is consistent and distinct per character; setting feels locally grounded.
- [ ] **Amateur photo / CCTV look (3–6 stills):** Stills look like raw low-light/flash phone photos or CCTV frames, not illustrations, and are gore-free.

## Readability, Safe Zones & Motion (Contact Sheet + Key Frames)

- [ ] **Minimum ~42 px text:** Identity strip (`ARSIP #NNN · @skenarium`), chat bubbles, voice-note subtitles, notifications, system messages and timestamps are legible at phone size (~270–360 px preview).
- [ ] **Platform UI safe zones:** All critical content clears top ~10% (`y >= 192`), bottom ~22% (`y <= 1497`), and right ~12% (`x + w <= 950`) across the 3-second contact sheet.
- [ ] **Clean overlay transitions (`<= 6` frames / hard cut):** Zero double-exposure ghosting of readable chat/overlay text across photo zoom, CCTV, call, and notification transitions.
- [ ] **Reading pace, scroll & voice-note states:** Every message holds ≥ `180 ms/word + 600 ms` (min `1.2 s`); thread scrolls naturally and clips below the solid identity strip; unplayed voice-note ring disappears when playback starts and bubble rests in played state afterward.
- [ ] **Motion discipline:** All animations are frame-driven (`useCurrentFrame()`); zero CSS animations; no broken/blank frames.

## Series Identity, Brand Safety & Publishing Checklist (Upload Step Only)

- [ ] **Series identity strip (`ARSIP #NNN · @skenarium`):** Visible in the solid strip directly below `ChatHeader` inside the critical safe zone; no on-screen `FIKSI` tag (account bio states fiction).
- [ ] **Original generic chat UI:** Zero WhatsApp, Telegram or Line trademarks, signature colors or icons.
- [ ] **No real PII / defamation:** Zero real people, real phone numbers (including on `Tanpa Nama`) or defamatory real place names.
- [ ] **Provenance & rights (`assets.md` + `public/sfx/LICENSES.md`):** Every voice note, still, and SFX (including the in-repo synthesized Tanpa Nama signature ping) is logged with tool/source, date and license status.
- [ ] **Upload-step disclosure (human publisher checklist — do NOT publish without explicit owner approval):**
  - Caption draft (`caption-draft.md`) includes **`#fiksi`** and **`#ceritahorror`**.
  - Platform's built-in **AI-generated-content label** is switched **ON** at upload.
  - Account bio states fiction.

## Audio Measurements (Compressed MP4)

- [ ] **Loudness measured (`ebur128` / `loudnorm`):** Integrated `[__ LUFS]`, True Peak `[__ dBTP]`.
- [ ] **Silence & ambience check:** Measured deliberate silent gaps and ambience floor on the compressed AAC stream; zero mood-explaining music.
- [ ] **Voice notes (2–6 s each):** Durations verified via `ffprobe`; masculine Indonesian voice used as an in-world male character, not a narrator; subtitles match lines.
- [ ] **Human ear-check (NOT verified by automated checks):** `listening review: none` — owner ear-check required before any publication decision.

## Honest Summary: Verified vs Unverified

- **Verified:** [exact commands, contact sheet, ffprobe/loudness measurements, visual checks actually performed]
- **Unverified / skipped:** [e.g. subjective audio listening quality, pronunciation by ear, voice naturalness, independent viewer first-watch reaction, platform upload preview & publishing rights]
- **Issues / fixes / retest:** [list any issues found and resolved, or open items]
- **Verdict:** `[ready for owner review / needs revision]` *(publishing requires separate owner authorization)*
