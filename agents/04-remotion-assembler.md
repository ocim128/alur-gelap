# 04 · Remotion Assembler

## Mission & Scope

For **Studio v3 (*Arsip Terakhir*)**, assemble data-driven found-phone and found-footage UI timelines from `episodes/<slug>/chat-script.json` (`pipelineVersion: 3`) using `src/v3/ArsipPlayer.tsx` and reusable UI components under `src/v3/components/`.

## Required Inputs & Preconditions

Read `episodes/<slug>/brief.md`, `episodes/<slug>/chat-script.json`, `episodes/<slug>/assets.md`, generated voice notes/SFX (from Agent 02), generated stills (from Agent 03), `STYLE_GUIDE.md` ([Studio v3](../STYLE_GUIDE.md#studio-v3--arsip-terakhir)) and `pipeline-state.json`. Require `brief`, `audio` and `images` approved (`handoffAllowed: true` or `status: "pass"`). Follow installed Remotion guidance.

## Allowed Write Scope

Assigned episode `chat-script.json` timing refinements (preserving approved copy/clues), composition registration in `src/Root.tsx`, reusable components under `src/v3/` when needed, output MP4 under `out/`, contact-sheet verification stills, `episodes/<slug>/review.md` / assembly notes, and `render` pipeline state. Preserve all archived 001–006 and Arc 01 code and exports.

## Hard Prohibitions (NEVER)

Never add a narrator track, burned-in narration captions, melodic music, rewind loops, CSS animations (`@keyframes` / CSS `transition`), or WhatsApp/Telegram/Line trademarks, brand greens/blues or icons. Never overwrite existing exports or publish without authorization.

## Studio v3 · Assembly Contract

1. **Use `src/v3/ArsipPlayer.tsx` and `src/v3/components/`:**
   - Drive the composition from `episodes/<slug>/chat-script.json` (`pipelineVersion: 3`, required integer `archiveNumber`, **1080 × 1920**, **30 fps**, **45–75 s**).
   - Compose with reusable v3 UI primitives: `PhoneFrame` (draining battery + advancing in-world clock), `ChatHeader` (group name, member count, `"mengetik…"`), **`ArchiveIdentityStrip`** (solid full-width strip directly under `ChatHeader` displaying **`ARSIP #NNN · @skenarium`** plus optional factual owner metadata tag such as `HP milik: Bayu` at `>= 42 px` inside the critical safe zone; no on-screen `FIKSI` tag), `MessageBubble` (sender name/color, fixed grey default avatar for `Tanpa Nama`, timestamp, self-only read receipts, deleted/edited states), `PhotoMessage` (tap-to-expand zoom on generated still), `VoiceNoteBubble` (waveform driven by actual audio + clean unplayed → playing → played state transition + short subtitle under the bubble), `SystemMessage`, `EvidenceTagOverlay` (optional factual evidence end-tag before the final `Tanpa Nama` artifact, `>= 42 px`, hard cut, inside safe zone), `Notification`, `CallScreen`, and `CctvFrame` (timestamp, noise, scanlines, subtle jitter, multi-frame sequence support).
   - Keep **every animation strictly driven by `useCurrentFrame()`** (real-phone auto-scroll, typing indicators before messages, kinetic zoom/pan into details to invite attention without explaining, optional scripted glitch beats). Zero CSS animations.
   - **Overlay transition rule:** Limit overlay fades (`PhotoZoomOverlay`, `CctvFrame`, `CallScreen`, `EvidenceTagOverlay`, `Notification`) to **`<= 6` frames** or hard cuts with opaque backdrops so readable text never appears doubled/ghosted.
2. **Enforce phone readability, safe zones and reading pace:**
   - All readable on-screen text (identity strip, archive metadata labels, chat messages, voice-note subtitles, notifications, system messages) must be **minimum ~42 px** at 1080 width.
   - Keep all story-readable text, including ChatHeader group name and member count, strictly inside `x >= 0`, `x + w <= 950`, `y >= 192`, `y + h <= 1497`. Decorative ambient chrome (top status clock/battery and bottom `Tulis pesan...` input bar) may remain outside that zone.
   - Hold every new message for at least **`180 ms × words + 600 ms`**, minimum **`1.2 s`**, and keep the hook artifact visible at **frame 0 (`00:00.0`)**.
   - Use an original, generic dark/neutral chat UI aesthetic — never imitate WhatsApp, Telegram or Line branding, colors or icons.
3. **Mix, validate and render:**
   - Time voice notes, normal UI pops (for non-Tanpa-Nama characters), the **Tanpa Nama signature ping** (`public/sfx/shared/tanpa-nama-ping.wav`, ONLY when a `Tanpa Nama` event arrives), phone-audible location ambience bed (`>= -50 dBFS` outside listed silence beats), rising low non-melodic tension rumble/drone, and deliberate hard silence drops per the cue sheet; **no melodic music**.
   - Run `npm run check` (including v3 validation and tests) before rendering.
   - Render via `npm run render -- <composition-id> out/<delivery>.mp4` without overwriting existing exports.
   - Export a **contact sheet of stills every 3 s** and run **loudness and silence checks on the compressed MP4** (since AAC encoding can shift loudness and silence floors). Record actual measurements and honest **`listening review: none`** (unless a human actually listened) in the handoff.

Archived Studio v2 / v1 Assembler contract lives in [archive/agents-v2-v1/04-remotion-assembler.md](../archive/agents-v2-v1/04-remotion-assembler.md).

## Handoff Update (pipeline-state.json)

Set `render` to `pass` only after checks and all artifacts exist; otherwise `ready` or `fail` with actionable notes. Tag findings with the shared evidence labels (`signal/timing`, `visual-state`, `motion`, `human-listening`, `experience`) and record `listening review: none` unless a real listening review of a named artifact happened. Carry each accepted source exception and its `downstreamVerify` result into the handoff; audit any new regression from your own polish changes as a fresh finding. A render pass requests independent QA; it is not a QA or publishing approval.
