# Episode brief (Studio v3 · Arsip Terakhir) — [episode ID and working title]

Copy this into `episodes/<slug>/brief.md`. Complete and get owner sign-off before generating audio or stills.

## Archive Overview

- **Collection** — [arcs/03-arsip-terakhir/arc.json](../../arcs/03-arsip-terakhir/arc.json) · [Canon Ledger (`Tanpa Nama`)](../../arcs/03-arsip-terakhir/lore.md)
- **Public Archive Number** — `ARSIP #NNN` (`archiveNumber: N` in `chat-script.json`, rendered as `ARSIP #NNN · @skenarium`)
- **Pipeline Version** — `3` (`chat-script.json`, no narrator)
- **Composition ID** — `[ArsipNNSlug]`
- **Target Runtime** — **45–75 s** (`1350–2250` frames at 30 fps), **1080 × 1920**
- **Local Setting** — [familiar Indonesian setting: kos, minimarket shift malam, pos ronda, KKN, rumah nenek, ojol, etc. — no real place names that could defame anyone]
- **Archive Premise** — [2–3 sentences: whose phone/archive this is, what normal situation opens it, and what goes wrong]
- **Survival Angle (fiction only)** — [who survives or nearly escapes by noticing the clue or obeying the rule, OR the tragic ending and clearly visible fatal mistake; never frame either as real-world safety advice]

## Local Entity / Rule & `Tanpa Nama` (Never Explained Aloud)

- **The one local entity or rule** — [describe the exact local supernatural behavior or rule privately for production alignment]
- **How the viewer infers it** — [what observable contradictions, timing delays, phrasing errors or visual details let a viewer deduce the rule without narration]
- **Survival or tragic mistake** — [concrete action/inaction and consequence visible inside the archive]
- **`Tanpa Nama` appearance (series constant, not a second explained rule)** — [which final artifact event(s) `Tanpa Nama` sends — fixed display name `"Tanpa Nama"`, fixed grey default avatar, no phone number, signature ping only on `Tanpa Nama` events — plus any optional subtle earlier cross-episode clue. Record on-screen appearances in `arcs/03-arsip-terakhir/lore.md`.]

## Characters & Texting Voices

Give every character a distinct, consistent everyday Indonesian chat voice (singkatan, typo ringan, `"wkwk"`, lowercase, punctuation). Assign the masculine Indonesian TTS voice (`voice_71a5a701-796e-421d-840e-0adc00b0816a`) to **one** male character as an in-world voice note speaker, not a narrator.

| Character ID | Display Name | Phone Owner? | Bubble / Name Color | TTS Voice Role (if any) | Texting Voice & Quirks |
| --- | --- | --- | --- | --- | --- |
| [id] | [Name] | [yes / no] | [#HEX] | [male-masc-id / Charon / Orus / none] | [e.g. all lowercase, singkat `yg`, `udh`, `wkwk`, jarang titik] |

## Frame-Zero Hook (00:00.0)

- **Opening artifact / message** — `"[Exact text or artifact visible at frame 0]"`
- **Readable in ≤ 2 s?** — [word count; impossible detail that hooks the viewer immediately]

## Beat Map (45–75 s, No Rewind Loops)

Shape: **Normal → odd detail → escalation → silence or reveal**.

| Approx Time | Frame Range (30 fps) | Phase | Event IDs | What Happens in the Archive |
| --- | --- | --- | --- | --- |
| 00:00–00:08 | 0–240 | Hook & Normal | | |
| 00:08–00:24 | 240–720 | Odd Detail + Clue Plant (≤ 40%) | | |
| 00:24–00:48 | 720–1440 | Escalation | | |
| 00:48–00:60 | 1440–1800 | Silence & Recasting Reveal | | |

## One-Watch Comprehension Plan (Q1–Q4) & Archive Metadata

After **one** watch, a cold viewer must be able to answer Q1–Q4 from on-screen artifacts alone (mystery is allowed in *why/what* the entity is, never zero clue about *what happened*):

- **Q1 (Whose phone is this archive?):** [how the viewer knows immediately, e.g. factual evidence label `"HP milik: ..."` + outgoing bubbles]
- **Q2 (What was wrong?):** [the observable anomaly/event a cold viewer catches on watch 1]
- **Q3 (What happened to the others?):** [concrete visual/audio event showing the other characters' fate]
- **Q4 (What probably happened to the phone owner?):** [strong factual/artifact hint at the owner's fate before/at the ending]
- **Archive metadata tags (max 2 short factual lines, `>= 42 px`, inside safe zone, facts only — no adjectives/explanation/narration):**
  1. `[e.g. HP milik: Bayu]` (header/identity-strip area)
  2. `[e.g. ditemukan: portal barat · 05.12]` (end evidence tag before final `Tanpa Nama` artifact, optional)

## Cold-Read Result (Model Proxy — NOT Audience Evidence)

> Generate strict blind-review input via `node scripts/export-cold-read-input.mjs episodes/<slug>` BEFORE generating any assets. Provide ONLY that strict output (chat texts, VN subtitles, archive metadata tags, PLAYBACK badges/timestamps, and one-line literal still descriptions — zero brief prose, zero clue ledger, zero audio notes) to a fresh-context reviewer. Always cite the exact **`chat-script.json` SHA-256** below so stale cold-reads are immediately obvious. Record answers verbatim; revise and re-run if any answer misses intent.

- **Status:** `[pending / pass — model proxy only, not human audience evidence]`
- **Script SHA-256:** `[exact sha256 from export-cold-read-input.mjs]`
- **Q1:** `[verbatim cold-read answer]`
- **Q2:** `[verbatim cold-read answer]`
- **Q3:** `[verbatim cold-read answer]`
- **Q4:** `[verbatim cold-read answer]`

## Fair-Play Clue Ledger

At least one visual clue must be planted within the **first 40%** of the cut and clearly readable at phone size. **The payoff is shown, never stated** — pay it off with an artifact (such as a later photo, CCTV still, or voice note) so the viewer connects the dots themselves; no character explains the clue in chat or voice notes. Keep a single source of truth in `chat-script.json`: store frame positions in `at` and let the validator derive timestamps and measure voice-note durations directly from the audio files.

| Clue ID | Visual / Text Clue | Planted In (Event ID) | Paid Off In (Event ID — Artifact Only) | Phone-Size Readability Plan |
| --- | --- | --- | --- | --- |
| C1 | [e.g. gembok luar pintu kamar 4 terkunci di foto lorong pertama] | `m3` (≤ 40% of `durationInFrames`) | `m9` (shown via artifact, never explained aloud) | [clearly visible in chat bubble and tap-to-expand zoom; zero artificial highlight/arrow] |

## Ending (Recasts Everything, No Recap)

- **Final artifact** — [unread last message / unknown-sender voice note / impossible photo / presence status]
- **Why it recasts the archive** — [what viewers realize on rewatch]
- **Prohibited endings checked** — No `"Kamu berhasil bertahan hidup."`, no narrator, no recap.

## Reading-Pace Budget

Formula: each new readable message holds for at least **`180 ms × words + 600 ms`**, minimum **`1.2 s`** (`36` frames at 30 fps).

- **Script file** — `episodes/<slug>/chat-script.json`
- **Total events / text messages / voice notes / stills** — [counts]
- **Total on-screen words (chat + voice subtitles)** — [count]
- **Minimum required reading hold sum vs planned runtime** — [e.g. minimum X s across messages; planned Y s inside 45–75 s]

## Visuals List (3–6 Amateur Phone Photos / CCTV Stills)

Style: authentic low-light handheld smartphone photo or grainy CCTV capture (ISO noise, harsh flash, imperfect framing) — **not** illustrations, **gore-free**.

| Asset Path (`public/...`) | Event ID | Type (`phone-photo` / `cctv`) | Subject & Clue Details | Zoom Target (if any) |
| --- | --- | --- | --- | --- |
| `assets/<slug>/still-01.jpg` | `m2` | `phone-photo` | | |

## Audio & Sound-Design Cue Sheet (No Melodic Music; Diegetic Bed + Tension + Silence Drops)

**No melodic music.** Non-melodic, mostly diegetic sound design is required:
- **Location bed:** audible on phone speakers (`>= -50 dBFS` across the export except deliberate silence beats listed below).
- **Voice notes (`2–6 s` each):** carry their own environment (wind, footsteps, breath, room) and may hide one phone-audible audio clue.
- **Tension layer:** low non-melodic sub rumble/drone rising from the odd detail through escalation.
- **Reveal drop:** deliberate hard drop to near-silence at the reveal.
- All sounds synthesized in-repo or licensed with records in `public/sfx/LICENSES.md`.

| Layer / Cue ID | Frame Range (30 fps) | Time (s) | Type (`location-bed` / `tension-drone` / `voice-note` / `ui-sfx` / `tanpa-nama-ping` / `silence-drop`) | Speaker / Asset | Exact Line / Sound Design & Target Level |
| --- | --- | --- | --- | --- | --- |
| `bed` | `0–...` | `00:00–...` | `location-bed` | | |
| `tension` | | | `tension-drone` | | |
| `silence-1` | | | `silence-drop` | *(deliberate silence beat)* | |

## Series Identity, Brand Safety & Upload Disclosure Checklist

- **Series identity strip** — Solid full-width strip directly under `ChatHeader` showing **`ARSIP #NNN · @skenarium`** (`>= 42 px`, inside critical safe zone; `archiveNumber` integer in `chat-script.json`, handle fixed series-wide). No on-screen `FIKSI` tag (account bio states fiction).
- **Upload caption & AI label (`caption-draft.md`)** — Draft short Indonesian hook + pinned clue-hunt comment + mandatory **`#fiksi`** and **`#ceritahorror`** tags + explicit reminder to switch ON the platform's built-in **AI-generated-content label** at upload (publishing requires separate owner authorization).
- **Generic original chat UI** — Does not copy WhatsApp, Telegram, or Line branding, signature greens/blues, or icons.
- **Defamation / privacy check** — Zero real people, zero real phone numbers (including on `Tanpa Nama`), zero real village/store/place names that could defame anyone.
- **Gore check** — Strictly gore-free.
- **Provenance & rights log** — Record every generated voice note, still, and sourced SFX in `episodes/<slug>/assets.md`, and log on-screen `Tanpa Nama` appearances in `arcs/03-arsip-terakhir/lore.md`.
