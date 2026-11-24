# 01 · Showrunner

## Mission & Scope

For **Studio v3 (*Arsip Terakhir*)**, design standalone found-phone / found-footage survival-horror episodes and deliver `brief.md` plus a timed, data-driven `chat-script.json` (`pipelineVersion: 3`) — **no narrator and no narration script**.

## Required Inputs & Preconditions

Read `AGENTS.md`, `STYLE_GUIDE.md` ([Studio v3](../STYLE_GUIDE.md#studio-v3--arsip-terakhir)), [arcs/03-arsip-terakhir/arc.json](../arcs/03-arsip-terakhir/arc.json), [arcs/03-arsip-terakhir/lore.md](../arcs/03-arsip-terakhir/lore.md), [templates/v3-brief.md](../templates/v3-brief.md), [templates/chat-script.example.json](../templates/chat-script.example.json) and `archive/playbook/experiments.md`. Keep every new episode directly under `episodes/<slug>/`.

## Allowed Write Scope

Arc collection record (`arcs/03-arsip-terakhir/arc.json`), canon ledger (`arcs/03-arsip-terakhir/lore.md`), assigned episode `brief.md`, `chat-script.json`, `caption-draft.md` and `pipeline-state.json`. Preserve accepted episode states and all archived 001–006 / Arc 01 files.

## Hard Prohibitions (NEVER)

Never write a narrator monologue, narration captions, rewind loops, `"Tamat."` resets, or `"Kamu berhasil bertahan hidup."` recaps for Studio v3. Never explain the local entity/rule or `"Tanpa Nama"` aloud, never invent off-screen `Tanpa Nama` lore, never present fiction as real-world safety advice, copy WhatsApp/Telegram/Line branding, or use real people, real phone numbers or defaming real place names. Never alter approved or archived episodes.

## Studio v3 · Execution Steps & Output Artifacts

1. **Draft `episodes/<slug>/brief.md`** from [templates/v3-brief.md](../templates/v3-brief.md):
   - **Premise & grounded setting:** Choose an everyday Indonesian setting (kos, minimarket shift malam, ronda, KKN, rumah nenek, ojol, etc.) and assign the next public **`archiveNumber`** (`ARSIP #001` = `episodes/007-grup-ronda-rt07`, incrementing cleanly).
   - **One unstated local entity/rule + Tanpa Nama series constant:** State the single local supernatural rule privately in the brief (what it does, how it hunts/mimics, how someone survives it). Never have a character lecture or explain the rule aloud in the chat. Design the ending so **`Tanpa Nama`** (fixed display name `"Tanpa Nama"`, fixed grey default avatar, no phone number, never explained or the solution) sends the final artifact; optionally include one subtle earlier cross-episode clue (call log, CCTV corner, forwarded tag). Log on-screen appearances in [lore.md](../arcs/03-arsip-terakhir/lore.md).
   - **Characters with distinct texting voices:** Define each participant's handle/display name, accent color, TTS voice role (if they send voice notes — the masculine Indonesian voice is assigned to one male character), and consistent texting quirks (singkatan, typo ringan, `"wkwk"`, lowercase, punctuation habits).
   - **Frame-zero hook:** Write the first message or artifact visible at `00:00.0`, readable within **2 s**, containing an impossible detail.
   - **Beat map (45–75 s, 30 fps):** Follow **Normal → odd detail → escalation → silence or reveal**. No rewind loops.
   - **One-Watch Comprehension Rule (Q1–Q4):** Design every episode so a cold viewer can answer after **one** watch: **Q1** whose phone is this archive? **Q2** what was wrong? **Q3** what happened to the others? **Q4** what (probably) happened to the phone owner? Mystery is allowed in *why/what* the entity is, never zero clue about *what happened*. Unintended funny readings are acceptable only if the intended reading is also clearly available.
   - **Archive metadata (evidence-tag text):** You may use at most **2 short factual lines** styled as an evidence label (e.g., `"HP milik: Bayu"`, `"ditemukan: portal barat · 05.12"`). Facts only — no explanation, no adjectives, no narration — placed in the identity strip area and/or as one end tag before the final `Tanpa Nama` artifact (`>= 42 px`, inside critical safe zone).
   - **Fair-Play Clue Ledger:** In addition to one-watch comprehension, plant at least one visual clue in the **first 40%** of the timeline (e.g., inside a sent photo or CCTV still) that explains the ending on rewatch. **The payoff is shown, never stated** — pay it off through an artifact (a later photo, CCTV sequence, or voice note), never by having a character explain the clue. Log exact `plantedIn` and `paidOffIn` event IDs; the validator derives timestamps directly from event `at` frames.
   - **Survival angle & recasting ending:** Someone survives (or nearly does) by noticing the clue or obeying the rule — never framed as real-world safety advice. Close on a final artifact sent by **`Tanpa Nama`** that recasts everything.
   - **Visuals & Full Sound-Design Cue Sheet:** Specify **3–6 gore-free amateur phone-photo or CCTV stills** (for Agent 03) with one-line literal visual descriptions, and a frame-ranged sound-design cue sheet (for Agent 02): **no melodic music**; non-melodic, mostly diegetic sound design comprising a phone-audible location bed (`>= -50 dBFS` except listed silence beats), **2–6 s in-world voice notes** carrying their own environment (and optional audio clue), a rising low non-melodic tension layer (sub rumble/drone) from the odd detail through escalation, a deliberate hard drop to near-silence at the reveal, normal UI pops for characters, and the Tanpa Nama signature ping ONLY for Tanpa Nama events.
   - **Identity strip, upload disclosure & brand safety:** Confirm `archiveNumber` (rendered in the solid `ARSIP #NNN · @skenarium` strip; no on-screen `FIKSI` tag), draft `caption-draft.md` with `#fiksi` `#ceritahorror` plus reminder to enable the platform AI-generated-content label at upload, original chat app name/theme, and zero real phone numbers/identifiable people/defaming place names.
2. **Run the mandatory Cold-Read Gate (before any asset generation):**
   - Spawn a fresh-context reviewer receiving **ONLY** what a viewer perceives: chat texts, VN subtitles, archive metadata tags, and one-line literal descriptions of each photo/CCTV still (what is visible, never what it means) — **no brief and no clue ledger**.
   - Ask it to answer **Q1–Q4** (whose phone, what was wrong, what happened to the others, what probably happened to the owner).
   - Record its answers **verbatim** in `episodes/<slug>/brief.md` under **`Cold-Read Result`**, explicitly labeled as a **model proxy, not audience evidence**. If any answer misses the brief's intent, revise the script and re-run the Cold-Read Gate before proceeding to assets.
3. **Author `episodes/<slug>/chat-script.json`** (`pipelineVersion: 3`, matching [templates/chat-script.example.json](../templates/chat-script.example.json)):
   - Include required integer `archiveNumber` (zero-padded to 3 digits in the `ARSIP #NNN · @skenarium` strip; handle fixed series-wide).
   - Place the hook event at `at: 0`, and make sure the **last event** is sent by the `Tanpa Nama` character (`id: "unknown"`, `name: "Tanpa Nama"`).
   - Keep a single source of truth: store frame numbers in `at`, do **not** hand-enter redundant `plantedAtSec`/`paidOffAtSec` or voice `durationSec` fields (the validator and player derive timestamps from `at` and measure voice-note durations directly from the audio files).
   - Count on-screen words per message and budget every message hold to at least **`180 ms × words + 600 ms`**, minimum **`1.2 s`** (36 frames at 30 fps), keeping total `durationInFrames` strictly inside **45–75 s** (`1350–2250` frames at 30 fps).
   - Reference real event IDs in `clueLedger` (with `plantedIn` ≤ 40% of `durationInFrames`), specify short subtitles under every `voice` event, and mark optional `zoom` / `glitch` beats that invite attention without explaining the plot.
4. **Create `episodes/<slug>/pipeline-state.json`** from [templates/pipeline-state.json](../templates/pipeline-state.json). Set `brief` to `ready` for owner review, then `pass` once approved.

Archived Studio v2 Showrunner contract lives in [archive/agents-v2-v1/01-showrunner.md](../archive/agents-v2-v1/01-showrunner.md).

## Handoff Update (pipeline-state.json)

The showrunner **creates** the episode's `pipeline-state.json` from [templates/pipeline-state.json](../templates/pipeline-state.json) at brief handoff. Set `brief` to `ready` while the orchestrator reviews the draft, then to `pass` once the brief is approved; otherwise `ready` or `fail` with precise notes. Record file paths, exceptions and camera/jolt requirements for audio and image roles. Do not imply an audio or visual review occurred.
