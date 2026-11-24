# alur-gelap

A Remotion project for vertical Indonesian survival/horror videos. The current **Studio v3 (*Arsip Terakhir*)** direction produces 45–75 s found-phone and found-footage archives with no narrator — reconstructed from group chats, short character voice notes, amateur phone photos, CCTV stills, call logs and notifications. Studio v2 (*Skenario Bertahan*, Episodes 001–005; unfinished Scenario 006 paused) and Arc 01 (*Kemacetan Terakhir*) are archived production history.

## Preview and check

Use a Node version supported by [package.json](package.json), such as Node 22.13 or newer in the Node 22 line. From the repository root:

```powershell
npm ci
npm run dev
npm run check
npm run build
```

The terminal prints the Remotion Studio URL. Historical Studio v2 compositions (such as `Skenario01KamarTerkunci` through `Skenario05SabukKetiga`) and Arc 01 compositions (`KemacetanTerakhirMotionComic`, `KemacetanTerakhirMotionComicRecut`, etc.) remain registered for archive compatibility. Studio v3 reusable player compositions (`src/v3/ArsipPlayer.tsx`, `ArsipDemo`, and `Arsip01GrupRondaRT07`) are introduced under the Studio v3 pipeline.

**System dependencies:** **Python 3** (standard library only) and **FFmpeg / FFprobe** on `PATH` are required for `npm run check` (including Python unit tests and Rec.709 / v3 audio verification tests), `npm run render`, `npm run compress`, and `python scripts/verify-v3-export.py <delivery.mp4> <chat-script.json>`.

`npm run build` runs the checks before bundling. Checks validate source and schema constraints; they do not replace playback, listening, rights review or independent QA.

Creating a composition, rendering an export and publishing are separate actions. When a render is requested, select the intended composition and output path in Studio or use the Remotion CLI. Do not overwrite an existing export unless that is intended; publishing requires separate authorization.

For a standard delivery, `npm run render -- <composition-id> <delivery.mp4>` renders then compresses automatically using ShortZ's balanced quality settings and limited-range Rec.709 tags. FFmpeg and FFprobe must be on PATH. In PowerShell quote optional Remotion flags, for example `'--concurrency=3'`. For a separately mastered MP4, run `npm run compress -- <master.mp4>` after mastering; the command creates a neighboring `_compressed.mp4` without overwriting the master or an existing delivery. The color tags assume the master is already Rec.709; tagging alone does not convert another color space or recover crushed blacks. Recheck audio sync, loudness and silence on the compressed file because AAC encoding can change them.

## Start a new episode

1. Read [AGENTS.md](AGENTS.md), the [v3 style guide](STYLE_GUIDE.md#studio-v3--arsip-terakhir), the [studio role contracts](agents/README.md), the [Arsip Terakhir collection record](arcs/03-arsip-terakhir/arc.json) and [decision history](archive/playbook/experiments.md).
2. Keep the episode directly under `episodes/<slug>/`. Create `brief.md` from [templates/v3-brief.md](templates/v3-brief.md), `chat-script.json` from [templates/chat-script.example.json](templates/chat-script.example.json) (`pipelineVersion: 3`), `pipeline-state.json` from [templates/pipeline-state.json](templates/pipeline-state.json), `assets.md`, and `review.md` from [templates/v3-review.md](templates/v3-review.md).
3. Design a 45–75 s archive with no narrator: frame-zero hook readable in ≤2 s with an impossible detail, Normal → odd detail → escalation → silence/reveal beat shape (no rewind loops), one unstated local entity/rule + **"Tanpa Nama"** sending the final artifact (logged in [arcs/03-arsip-terakhir/lore.md](arcs/03-arsip-terakhir/lore.md)), at least one visual fair-play clue planted in the first 40% (logged in the Clue Ledger), distinct Indonesian texting voices, 2–6 s TTS character voice notes (using the masculine Indonesian voice as one male character), original Tanpa Nama signature sound on Tanpa Nama events only, 3–6 gore-free amateur phone-photo or CCTV stills, original non-trademarked chat UI, solid **`ARSIP #NNN · @skenarium`** identity strip (`archiveNumber` required; no on-screen `FIKSI` tag — disclosure moves to upload `#fiksi` `#ceritahorror` + platform AI label), ≥42 px readable text inside the safe zone (avoiding top ~10%, bottom ~22%, right ~12%), overlay fades ≤6 frames, and ≥`180 ms/word + 600 ms` (min `1.2 s`) reading hold per message.
4. Register the episode composition in [Root.tsx](src/Root.tsx) using the data-driven v3 player (`src/v3/ArsipPlayer.tsx`), run `npm run check`, render via `npm run render -- <composition-id> <delivery.mp4>`, inspect a 3-second contact sheet plus loudness/silence on the compressed MP4, and complete `review.md` without inventing listening or rights approvals. A passing automated check is not a publishing approval.

Manifest and `chat-script.json` media paths are relative to `public/`. The [style guide](STYLE_GUIDE.md) covers v3 UI/audio/photo rules alongside archived v2/v1 references.

## Archive and maintenance

Studio v2 (*Skenario Bertahan*, [arcs/02-skenario-bertahan/arc.json](arcs/02-skenario-bertahan/arc.json)) is grandfathered for published Episodes 001–005; unfinished `episodes/006-bioskop-tanpa-pintu` is marked paused in its `pipeline-state.json` with its files left untouched. The archived [Arc 01 Episode 001 brief](episodes/arc1/001-kemacetan-terakhir/brief.md), [recut manifest](episodes/arc1/001-kemacetan-terakhir/recut-v2/manifest.json) and [captions](episodes/arc1/001-kemacetan-terakhir/recut-v2/captions.json) document the earlier v1 format. The [earlier playbook](archive/playbook/) retains prior workflow and decision history. Archived directed prompt records use repository-root-relative paths for assets in this repository; external references remain as originally recorded.

See the [maintenance log](MAINTENANCE.md) for completed repository improvements, evidence and follow-ups.
