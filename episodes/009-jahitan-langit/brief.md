# Episode brief (Studio v3 · Arsip Terakhir) — ARSIP #003 “Jahitan Langit”

## Archive Overview

- **Collection** — [arcs/03-arsip-terakhir/arc.json](../../arcs/03-arsip-terakhir/arc.json) · [Canon Ledger (`Tanpa Nama`)](../../arcs/03-arsip-terakhir/lore.md)
- **Public Archive Number** — `ARSIP #003` (`archiveNumber: 3` in `chat-script.json`, rendered as `ARSIP #003 · @skenarium`)
- **Pipeline Version** — `3` (`chat-script.json`, no narrator)
- **Composition ID** — `Arsip03JahitanLangit`
- **Target Runtime** — **64.00 s** (`1920` frames at 30 fps), inside the **45–75 s** band, **1080 × 1920**
- **Local Setting** — Perkemahan fiktif “Bukit Lengang” pada malam berangin, pukul 23.12–23.13. Tidak memakai nama tempat, orang, atau nomor telepon nyata.
- **Archive Premise** — Ini ponsel Gilang, yang ikut camping bertiga dengan Bima dan Nadia. Bima memotret langit malam dan menemukan jalur jahitan di antara bintang-bintang; makin malam, mereka menyadari bahwa “langit” adalah atap kanvas raksasa dan satu-satunya jalan keluar adalah resleting logam besar di horizon. Bima membukanya, Nadia menyusul, lalu Gilang meninggalkan ponselnya di log kayu dan ikut keluar.
- **Survival Angle (fiction only)** — Berakhir tragis. Kesalahan fatal yang terlihat jelas: Bima membuka resleting dan melangkah keluar, Nadia mengikutinya, lalu Gilang meninggalkan ponsel dan menyusul tanpa pernah kembali. Ini fiksi, bukan panduan keselamatan dunia nyata.

## Local Entity / Rule & `Tanpa Nama` (Never Explained Aloud)

- **The one local entity or rule** — Lokasi perkemahan berada di dalam tenda kanvas kolosal. “Langit” adalah atap kanvas; bintang adalah lubang-lubang kecil yang tembus cahaya; asap tidak bisa naik dan menyebar mendatar; hujan menghantam kain, bukan tanah; di horizon ada resleting logam raksasa. Di luar resleting hanya ruang gelap, kering, tanpa angin, tanpa serangga, tanpa hujan. Tidak ada karakter yang menjelaskan aturan ini.
- **How the viewer infers it** — Foto m1 memperlihatkan jahitan ganda yang melintang di antara bintang yang tidak sejajar. Foto m2 memperlihatkan asap api unggun menyebar ke samping. VN m5 menyebut hujan terdengar dari atas dan tidak sampai tanah; m6 memastikan tanah kering. Foto m8 menyorot kain tenun dengan jahitan ganda yang sama. Foto m12 memperlihatkan resleting logam raksasa. VN m15 membawa udara luar yang mati: tanpa angin, tanpa hujan, tanpa serangga.
- **Survival or tragic mistake** — Bima mengikuti jalur jahitan ke bawah, menemukan resleting, dan membukanya “dikit”. Di luar, ia tidak menemukan apa pun dan berhenti membalas. Nadia menyusul, kehilangan Bima di kegelapan, dan VN-nya terputus. Gilang menulis “gw nyusul bentar”, meninggalkan ponsel di log, dan ikut keluar. Tidak ada yang kembali.
- **`Tanpa Nama` appearance (series constant, not a second explained rule)** — Mengirim dua artefak terakhir: `m21`, foto flash tanpa caption dari luar resleting yang terbuka, memperlihatkan tenda dome kecil, api unggun sekarat, dua kursi lipat kosong, dan ponsel Gilang menyala di log; lalu `m22`, VN `2.6 s` tanpa suara manusia berisi suara resleting logam besar menutup perlahan, subtitle `"[suara resleting besar menutup]"`, berstatus unplayed. Nama tampilan tetap `Tanpa Nama`, avatar abu-abu default, tanpa nomor telepon; `tanpa-nama-ping.wav` hanya berbunyi untuk kedua artefak ini. Tidak ada kemunculan halus lebih awal di episode ini.

## Characters & Texting Voices

Setiap karakter punya suara chat yang konsisten dan berbeda. Tidak ada dua karakter yang memakai voice role yang sama. Gilang memakai `male-masc-id`; Bima memakai `male-young-id` (Puck/M1); Nadia memakai `female-expressive-id` (Leda/F3). Semua voice note adalah suara karakter di dunia, bukan narator.

| Character ID | Display Name | Phone Owner? | Bubble / Name Color | TTS Voice Role (if any) | Texting Voice & Quirks |
| --- | --- | --- | --- | --- | --- |
| `gilang` | Gilang | yes | `#7DD3FC` | `male-masc-id` | Pendek, tenang, lowercase, pakai `gw`, jarang titik, cenderung mengatur (“udah”, “jgn jauh jauh”). Membalas sebagai orang yang mencoba menenangkan grup. |
| `bima` | Bima | no | `#FDBA74` | `male-young-id` | Kering, penasaran, lowercase, kalimat pendek, pakai `dikit`, `banget`, `apaan`. Mengajukan pertanyaan literal tanpa panik. |
| `nadia` | Nadia | no | `#F9A8D4` | `female-expressive-id` | Cepat dan ekspresif, pakai `woy`, `banget`, elipsis, kalimat terpotong saat takut. Lebih reaktif daripada dua lainnya. |
| `unknown` | Tanpa Nama | no | `#94A3B8` | none | Tidak pernah menulis teks. Hanya mengirim foto dan satu VN suara resleting. Tidak pernah menjelaskan dirinya. |

## Frame-Zero Hook (00:00.0)

- **Opening artifact / message** — Foto m1: langit malam berbintang dengan jahitan ganda yang sedikit tidak sejajar melintang di antara bintang; caption Bima `"bintangnya ada jahitan"`.
- **Readable in ≤ 2 s?** — Ya. Tiga kata, tampil penuh di frame 0; foto tetap tajam sampai zoom mulai pada frame `42` (1.40 s). Detail mustahilnya langsung terbaca: ada jahitan di langit.

## Beat Map (64.00 s, No Rewind Loops)

Shape: **Normal → odd detail → escalation → silence or reveal**. Hook sudah mengandung detail mustahil, lalu grup memperlakukan itu sebagai lelucon biasa sebelum eskalasi.

| Approx Time | Frame Range (30 fps) | Phase | Event IDs | What Happens in the Archive |
| --- | --- | --- | --- | --- |
| 00:00.0–00:02.8 | 0–84 | Hook | `m1` | Foto langit berjahitan + caption “bintangnya ada jahitan”. |
| 00:02.8–00:10.8 | 84–324 | Normal / odd detail | `m2`–`m4` | Foto api unggun dengan asap mendatar; Gilang menyalahkan angin; Bima membantah karena ia diam dan asap tetap ke kiri. |
| 00:10.8–00:24.2 | 324–726 | Clue plant + escalation | `m5`–`m10` | Hujan terdengar di atas, tanah kering; Bima menyorot senter ke atas dan menemukan kain berjahit ganda; Nadia menyuruh turun; Bima mengikuti jalur jahitan ke bawah. |
| 00:24.2–00:39.2 | 726–1176 | Escalation | `m10`–`m15` | Bima menemukan resleting raksasa, membukanya sedikit, lalu melapor dari luar: kosong, tanpa angin, tanpa apa pun. |
| 00:39.2–00:54.6 | 1176–1638 | Escalation / silence | `m15`–`m19` | Nadia menyusul dan terputus; pesan Gilang tidak dibaca; Gilang meninggalkan ponsel dan menyusul. |
| 00:54.6–00:57.4 | 1638–1722 | Silence / evidence | `m20` | Kartu bukti: tiga orang hilang, ponsel ditemukan pukul 03.42 di log kayu. Hard drop keheningan. |
| 00:57.4–01:04.0 | 1722–1920 | Reveal | `m21`–`m22` | `Tanpa Nama` mengirim foto dari luar resleting yang terbuka, lalu VN resleting besar menutup. |

## One-Watch Comprehension Plan (Q1–Q4) & Archive Metadata

Setelah **satu** tontonan, penonton dingin harus bisa menjawab Q1–Q4 dari artefak di layar. Misteri boleh ada pada *apa/kenapa* entitasnya, bukan pada *apa yang terjadi*.

- **Q1 (Whose phone is this archive?):** Strip `HP milik: Gilang` + bubble keluar di sisi kanan dari `selfId: gilang` (m3, m7, m11, m18, m19). Nama grup “Kemah Bukit Lengang · 3 anggota” dan ketiga nama peserta konsisten.
- **Q2 (What was wrong?):** Jahitan ganda di langit (m1), asap mendatar (m2), hujan di atas kain tapi tanah kering (m5–m6), kain tenun berjahit ganda saat senter diarahkan ke atas (m8), dan resleting logam raksasa (m12). Penonton menyimpulkan: langit adalah atap kanvas; resleting adalah satu-satunya bukaan.
- **Q3 (What happened to the others?):** Bima membuka resleting dan melapor dari luar bahwa di sana kosong dan tanpa angin (m13–m15), lalu berhenti membalas. Nadia menyusul, VN-nya terputus saat mencari Bima (m16–m17), lalu diam. Kartu bukti menyatakan Bima dan Nadia hilang.
- **Q4 (What probably happened to the phone owner?):** Gilang menulis “nadia? bima?” dengan tanda `delivered` tetapi tidak pernah `read` (m18), lalu VN “Gw nyusul bentar.” (m19). Kartu bukti menyatakan ketiganya hilang dan ponsel ditemukan di log kayu pukul 03.42; foto terakhir memperlihatkan ponselnya masih menyala di log. Penonton menyimpulkan Gilang keluar menyusul dan tidak kembali.
- **Archive metadata tags (max 2 short factual lines, `>= 42 px`, inside safe zone, facts only):**
  1. `HP milik: Gilang` (strip identitas di bawah header)
  2. `Gilang, Bima, Nadia hilang · HP ditemukan 03.42 di log kayu` (kartu bukti sebelum artefak terakhir `Tanpa Nama`)

## Cold-Read Result (Model Proxy — NOT Audience Evidence)

> Input ekspor ketat dibuat dengan `node scripts/export-cold-read-input.mjs episodes/009-jahitan-langit` sebelum aset apa pun dibuat. Reviewer menerima ONLY teks chat, subtitle VN, label metadata, dan deskripsi literal satu baris untuk still — tanpa brief, tanpa clue ledger, tanpa catatan audio, tanpa zoom. Jawaban dicatat verbatim. Ini proxy model, bukan bukti audiens manusia.

- **Status:** `pass — model proxy only, not human audience evidence`
- **Script SHA-256:** `37ce74456e7aa6f8aaadf46c58599577bd867f1cb28176e8ef62804618cb3e71`
- **Q1:** `Gilang's. The evidence label says "HP milik: Gilang," and he's one of the three members in the "Kemah Bukit Lengang" group.`
- **Q2:** `The campsite wasn't really outdoors. The "sky" was sewn fabric with a giant zipper: the stars had a stitched seam across them, smoke drifted sideways with no wind, rain pattered above but never reached the dry ground, and when Bima pointed his flashlight up he found a double row of stitching and a huge zipper. Behind the zipper was nothing — no wind, no anything.`
- **Q3:** `Bima opened the zipper a crack, said it was empty out there, then Nadia went after him. Her last voice note is dark and she says she can't find him, then Gilang says he'll follow. The evidence label states all three went missing, and the final photo shows the fire dying, the chairs empty, no people. So they walked out past the zipper into the empty dark and never came back — Nadia couldn't even find Bima, so being out there separates them.`
- **Q4:** `Same as the others. He went after Nadia and Bima and didn't come back; his phone was left on the log and was found at 03.42. The last artifact confirms it: a photo of the campsite taken from outside through the wide-open zipper, with his lit phone sitting on the log and nobody around, then the sound of the giant zipper closing. He's gone, sealed out (or in) with the rest.`
- **Confusion notes (verbatim):**
  - `The scale doesn't add up. There's a normal dome tent and campfire, but the sky above them is also fabric with a zipper — is the whole place a tent, or is the tent the sky? Nothing on screen settles it.`
  - `The final photo is taken from outside the zipper, but Gilang's phone is visible inside the shot on the log, so it wasn't taken with this phone. Who held the camera is never shown.`
  - `The ~4.5 hour gap between the last 23.13 message and the phone being found at 03.42 is never accounted for.`
  - `"Hilang" is all we get for the three of them. No bodies, no confirmation of death — that they were lost or taken in the dark is inference, not something on screen.`
  - `It's unclear whether Bima actually crawled out or was taken; he only says he'll open it "a bit."`
  - `The sideways smoke and the rain that doesn't land are both weird, but nothing links them or explains them separately.`
- **Gate decision:** No Q1–Q4 answer failed. No script revision required. The scale confusion is about the exact geometry of the rule (a permitted *why/what* mystery), not about what happened; it should be rechecked with human viewers after render. The impossible camera position is the intended `Tanpa Nama` artifact, not a comprehension failure.

### Fresh-context recheck after m2 zoom revision (2026-11-25)

Model proxy only, not audience evidence. Reviewer saw only `sources/cold-read-input.md`; its SHA-256 matches the actual revised script: `a1060a68751014cb16fbac899f7209679842202f030ca857215f640c405a6e37`. A 63-character value quoted in the request omitted the `a` in `405a6e37`; the hash in the exported input is the correctly measured 64-character value. Reviewer answers and confusion notes are verbatim:

- **Q1:** ?Gilang?s phone.?
- **Q2:** ?The sky over their campsite was a huge stitched fabric covering. Bima found a giant zipper, opened it, and saw an empty, windless space outside.?
- **Q3:** ?Bima went toward the opening and disappeared. Nadia went after him, could not find him in the darkness, and also disappeared.?
- **Q4:** ?Gilang went to look for them and probably disappeared too; his phone was left on the log at the campsite.?
- **Confusion:** ?I cannot tell exactly where the three went or whether Bima actually crossed through the opening. The final image makes the campsite look enclosed behind the zipper, which then closes. The name Tanpa Nama does not establish who took the image or made the recording.?
- **Gate:** pass for Q1?Q4. The locations and fate remain inferential; first-viewer human verification remains pending. The reviewer flagged the transcribed-hash discrepancy; the file itself was independently hashed as above.

### Timing-only rebind after voice generation

Current script SHA-256: `8f92e9cfc64151a23aded2a3aa50fe8eae9dc9c5efd55ec5c972ee6f2d520639`. Six event positions changed solely to fit measured clips: m6 432?437, m11 852?854, m16 1284?1322, m17 1350?1363, m18 1476?1513 and m19 1530?1550. The exporter output before and after these changes is byte-for-byte identical after excluding its SHA line; the fresh-context answers above remain the original verbatim answers, not a newly performed review. No dialogue or literal still description changed. See `sources/cold-read-input-initial.md` and `sources/cold-read-input.md`.

## Fair-Play Clue Ledger

Minimal satu clue visual berada di **40% pertama** dan terbaca di ukuran ponsel. Payoff selalu ditunjukkan lewat artefak, tidak pernah dijelaskan karakter.

| Clue ID | Visual / Text Clue | Planted In (Event ID) | Paid Off In (Event ID — Artifact Only) | Phone-Size Readability Plan |
| --- | --- | --- | --- | --- |
| C1 | Jahitan ganda melintang di langit malam, dengan bintang yang sedikit tidak sejajar di kedua sisinya. | `m1` (frame 0, 0.0%) | `m8` (frame 552) | Foto penuh di bubble; zoom 1.55× mulai frame 42 agar frame 0 tetap tajam; jahitan kontras terhadap langit gelap. Tanpa panah atau highlight buatan. |
| C2 | Asap api unggun menyebar mendatar ke samping, bukan naik. | `m2` (frame 84, 4.4%) | `m8` (frame 552) | Zoom 1.3× mulai frame 45; asap diberi tepi terang dari flash agar arahnya terbaca di layar ponsel. |
| C3 | Hujan terdengar dari atas dan tanah tetap kering. | `m5` (frame 324, 16.9%) | `m15` (frame 1176) | VN m5 membawa hujan menampar kain di atas, tanpa cipratan tanah; VN m15 membawa udara luar yang kering dan tanpa serangga. Clue ini audio, bukan teks. |

## Ending (Recasts Everything, No Recap)

- **Final artifact** — `m21`: foto flash tanpa caption dari `Tanpa Nama`, diambil dari luar resleting logam yang terbuka lebar, memperlihatkan tenda dome kecil, api unggun sekarat, dua kursi lipat kosong, dan ponsel Gilang menyala di log. Lalu `m22`: VN `2.6 s` dari `Tanpa Nama`, unplayed, berisi suara resleting logam besar menutup perlahan, subtitle `"[suara resleting besar menutup]"`.
- **Why it recasts the archive** — Penonton menyadari bahwa seluruh “langit” adalah atap kanvas yang bisa ditutup; resleting yang dibuka Bima adalah satu-satunya jalan keluar, dan sekarang ditutup dari luar. Ponsel yang masih menyala di log menjelaskan Q4: Gilang keluar tanpa membawa ponsel dan tidak kembali. Foto itu seharusnya tidak mungkin ada karena tidak ada orang di luar.
- **Prohibited endings checked** — Tidak ada `"Kamu berhasil bertahan hidup."`, tidak ada narator, tidak ada recap, tidak ada penjelasan aturan secara lisan.

## Reading-Pace Budget

Formula: setiap pesan baru ditahan minimal **`180 ms × kata + 600 ms`**, minimum **`1.2 s`** (`36` frame pada 30 fps). Angka di bawah dihitung dari `at` di `chat-script.json`; validator mencocokkan setiap jarak antar-event.

- **Script file** — `episodes/009-jahitan-langit/chat-script.json`
- **Total events / text messages / voice notes / stills / evidence cards** — `22 / 9 / 7 / 5 / 1`
- **Total on-screen words (chat + caption + VN subtitle + evidence)** — `105`
- **Minimum required reading hold sum vs planned runtime** — **≈ 33.8 s** total hold minimum; planned **64.00 s**, semua jarak antar-event lolos.

| Event | At (frame) | Time (s) | Type | Words | Min Hold (s) | Gap to Next (s) |
| --- | --- | --- | --- | --- | --- | --- |
| `m1` | 0 | 0.00 | photo + caption | 3 | 1.20 | 2.80 |
| `m2` | 84 | 2.80 | photo + caption | 5 | 1.50 | 3.00 |
| `m3` | 174 | 5.80 | text | 4 | 1.32 | 2.40 |
| `m4` | 246 | 8.20 | text | 8 | 2.04 | 2.60 |
| `m5` | 324 | 10.80 | voice | 8 | 2.04 | 3.77 |
| `m6` | 437 | 14.57 | text | 3 | 1.20 | 1.63 |
| `m7` | 486 | 16.20 | text | 4 | 1.32 | 2.20 |
| `m8` | 552 | 18.40 | photo + caption | 3 | 1.20 | 3.60 |
| `m9` | 660 | 22.00 | text | 3 | 1.20 | 2.20 |
| `m10` | 726 | 24.20 | voice | 9 | 2.22 | 4.27 |
| `m11` | 854 | 28.47 | text | 3 | 1.20 | 1.93 |
| `m12` | 912 | 30.40 | photo + caption | 2 | 1.20 | 3.20 |
| `m13` | 1008 | 33.60 | voice | 6 | 1.68 | 3.80 |
| `m14` | 1122 | 37.40 | text | 2 | 1.20 | 1.80 |
| `m15` | 1176 | 39.20 | voice | 10 | 2.40 | 4.87 |
| `m16` | 1322 | 44.07 | text | 4 | 1.32 | 1.37 |
| `m17` | 1363 | 45.43 | voice | 9 | 2.22 | 5.00 |
| `m18` | 1513 | 50.43 | text | 2 | 1.20 | 1.23 |
| `m19` | 1550 | 51.67 | voice | 3 | 1.20 | 2.93 |
| `m20` | 1638 | 54.60 | evidence | 10 | 2.40 | 2.80 |
| `m21` | 1722 | 57.40 | photo | 0 | 1.20 | 2.80 |
| `m22` | 1806 | 60.20 | voice (unplayed) | 4 | 1.32 | 3.80 tail |

## Visuals List (5 Amateur Phone Photos)

Style: foto ponsel malam yang autentik — noise ISO, flash keras, framing tidak sempurna, low-light — **bukan ilustrasi**, tanpa gore, tanpa merek atau orang nyata. Stills have been generated and inspected at 540 ? 960; see `assets.md` for limitations and provenance.

**Glitch beats:** `6 f` di `m8` (saat kain terlihat) dan `8 f` di `m15` (saat VN udara mati). Intensitas rendah; tidak boleh membuat teks yang sedang terbaca tampil ganda. Tidak ada rewind loop.

| Asset Path (`public/...`) | Event ID | Type (`phone-photo` / `cctv`) | Literal One-Line Description | Zoom Target (if any) |
| --- | --- | --- | --- | --- |
| `assets/009-jahitan-langit/still-01-sky-seam.jpg` | `m1` | `phone-photo` | Long-exposure night photo of a star field with a slightly misaligned double-stitched seam running horizontally across it; a dark treeline and the top edge of a dome tent are visible at the bottom. | `x 0.50, y 0.36, scale 1.55`, `atOffset 42`, `40 f` |
| `assets/009-jahitan-langit/still-02-smoke.jpg` | `m2` | `phone-photo` | Night flash photo of a small campfire in a clearing; its smoke spreads sideways in a flat layer above the flames, and a dome tent, two folding chairs, and a wooden log are visible beside it. | `x 0.52, y 0.30, scale 1.30`, `atOffset 45`, `42 f` |
| `assets/009-jahitan-langit/still-03-canvas.jpg` | `m8` | `phone-photo` | Low-light phone photo pointed upward at a taut woven fabric surface lit by a headlamp beam; a double row of stitching runs across the fabric, and the beam fades into black at the edges. | `x 0.54, y 0.34, scale 1.70`, `atOffset 48`, `54 f` |
| `assets/009-jahitan-langit/still-04-zipper.jpg` | `m12` | `phone-photo` | Low-light phone photo of a metal zipper pull and interlocking teeth filling most of the frame, hanging in darkness above a dark horizon line and partly lit by a dim headlamp. | `x 0.60, y 0.55, scale 1.50`, `atOffset 45`, `48 f` |
| `assets/009-jahitan-langit/still-05-outside-zipper.jpg` | `m21` | `phone-photo` | Flash photo taken from outside through a wide-open metal zipper in a dark fabric wall, looking slightly down into a small campsite: a compact dome tent, a dying campfire, two empty folding chairs, and a lit smartphone resting on a wooden log. | `x 0.62, y 0.66, scale 1.30`, `atOffset 24`, `48 f` |

## Audio & Sound-Design Cue Sheet (No Melodic Music; Diegetic Bed + Tension + Silence Drops)

**No melodic music.** Semua suara non-melodik dan sebagian besar diegetik. Bed lokasi harus terdengar di speaker ponsel dan tidak boleh turun di bawah `-50 dBFS` kecuali pada `silence-1` yang memang tercatat. The cue sheet below is the original plan; measured takes and final timings are recorded in `assets.md` and `chat-script.json`.

| Layer / Cue ID | Frame Range (30 fps) | Time (s) | Type (`location-bed` / `tension-drone` / `voice-note` / `ui-sfx` / `tanpa-nama-ping` / `silence-drop`) | Speaker / Asset | Exact Line / Sound Design & Target Level |
| --- | --- | --- | --- | --- | --- |
| `bed-a` | `0–1638` | `00:00–54.60` | `location-bed` | `ambience-pine-canvas-bed.wav` | Angin malam pinus di dalam ruang tertutup, ritme kanvas berklepak di atas, hujan menampar kain, api unggun dengan reverb pendek, jangkrik jauh. Target `≈ -36 dBFS`; tidak pernah di bawah `-50 dBFS`. |
| `tension` | `174–1638` | `05.80–54.60` | `tension-drone` | `tension-canvas-drone.wav` | Drone non-melodik 90–220 Hz + sub rumble; mulai `-38 dBFS` di m3, naik bertahap ke `-22 dBFS` saat resleting dibuka; hard cut di m20. |
| `silence-1` | `1638–1722` | `54.60–57.40` | `silence-drop` | *(deliberate silence beat)* | Hard cut ke room tone `≈ -60 dBFS`; tidak ada musik, tidak ada UI pop, hanya sisa napas ruangan. Kartu bukti m20 tampil tanpa aksentuasi. |
| `bed-b` | `1722–1920` | `57.40–64.00` | `location-bed` | `ambience-pine-canvas-bed.wav` | Bed kembali pelan di `≈ -42 dBFS`, lebih tipis dari bed-a; kanvas dan api terdengar jauh, seperti ruangan yang mulai ditutup. |
| `vn-m5` | `324–426` | `10.80–14.20` | `voice-note` | `vn-01-bima-rain.wav` | Bima: “Gil, hujannya bunyi di atas, ga nyampe tanah.” `3.4 s`. Hujan menampar kain tegang di atas kepala, tanpa cipratan tanah; napas dekat, sedikit tertutup. |
| `vn-m10` | `726–840` | `24.20–28.00` | `voice-note` | `vn-02-bima-seam.wav` | Bima: “Iya. Ada jalur jahitannya ke bawah. Gw ikutin dulu.” `3.8 s`. Langkah di serasah kering; di `0.4 s` terakhir ada gemeretak gigi resleting logam samar — clue audio sebelum resleting terlihat. |
| `vn-m13` | `1008–1092` | `33.60–36.40` | `voice-note` | `vn-03-bima-zipper.wav` | Bima: “Gede banget. Gw buka dikit ya.” `2.8 s`. Tangan menyentuh logam, gigi resleting bergetar, napas menahan; tidak ada musik. |
| `vn-m15` | `1176–1278` | `39.20–42.60` | `voice-note` | `vn-04-bima-outside.wav` | Bima: “Gil... di luar kosong. Ga ada angin, ga ada apa-apa.” `3.4 s`. Udara mati: tanpa angin, tanpa hujan, tanpa serangga; ruang terasa hampa dan kering. |
| `vn-m17` | `1350–1470` | `45.00–49.00` | `voice-note` | `vn-05-nadia-outside.wav` | Nadia: “Bima? ... Gil, di sini gelap banget. Gw ga nemu—” `4.0 s`. Suaranya bergema tipis di kehampaan; kalimat terputus, bukan ditutup musik. |
| `vn-m19` | `1530–1599` | `51.00–53.30` | `voice-note` | `vn-06-gilang-last.wav` | Gilang: “Gw nyusul bentar.” `2.3 s`. Suara dekat, api unggun berderak, kanvas berklepak sekali; langkah menjauh di akhir. |
| `ui-regular` | `0–1638` | `00:00–54.60` | `ui-sfx` | `ui-pop-in.wav` / `ui-pop-out.wav` | Pop UI normal untuk pesan karakter biasa; tidak dipakai untuk kartu bukti atau artefak `Tanpa Nama`. |
| `ping-m21` | `1722` | `57.40` | `tanpa-nama-ping` | `public/sfx/shared/tanpa-nama-ping.wav` | Signature ping khusus `Tanpa Nama`, sekali saat foto m21 masuk. Tidak ada ping lain di episode ini selain m21 dan m22. |
| `vn-m22` | `1806` + `15 f` preplay = `1821–1899` | `60.20` (preplay) / `60.70–63.30` | `voice-note` | `vn-07-tanpa-nama-zipper.wav` | Tanpa suara manusia. Resleting logam besar ditarik menutup perlahan, `2.6 s`, gigi logam saling mengunci; reverb ruang kanvas. Subtitle: `"[suara resleting besar menutup]"`. |
| `ping-m22` | `1806` | `60.20` | `tanpa-nama-ping` | `public/sfx/shared/tanpa-nama-ping.wav` | Signature ping khusus `Tanpa Nama` saat VN terakhir masuk, sebelum `15 f` unplayed preplay. |

## Series Identity, Brand Safety & Upload Disclosure Checklist

- **Series identity strip** — Strip solid penuh di bawah `ChatHeader`: **`ARSIP #003 · @skenarium`**, `>= 42 px`, di dalam critical safe zone; `archiveNumber: 3` di `chat-script.json`, handle tetap series-wide. Tidak ada tag `FIKSI` di layar.
- **Upload caption & AI label (`caption-draft.md`)** — Belum dibuat. Saat dibuat nanti, caption pendek berbahasa Indonesia + komentar clue-hunt + wajib `#fiksi` dan `#ceritahorror`; ingatkan untuk menyalakan label **AI-generated content** di platform saat upload. Publikasi butuh otorisasi owner terpisah.
- **Generic original chat UI** — Tidak meniru WhatsApp, Telegram, atau Line: tanpa warna signature, ikon, atau branding mereka.
- **Defamation / privacy check** — Nol orang nyata, nol nomor telepon nyata (termasuk `Tanpa Nama`), nol nama desa/toko/tempat nyata yang bisa mencemarkan. Nama “Bukit Lengang” fiktif.
- **Gore check** — Tidak ada gore, luka, mayat, atau darah. Kehilangan disampaikan lewat artefak dan keheningan.
- **Provenance & rights log** — `assets.md` belum dibuat; semua voice note, still, dan SFX harus dicatat saat produksi aset, dengan lisensi di `public/sfx/LICENSES.md`. Baris `Tanpa Nama` untuk `lore.md` diusulkan di respons akhir dan belum dimasukkan ke canon.

## Production Assumptions & Deferred Work

- **External dependencies** — Tidak ada. Semua still, voice note, dan SFX direncanakan sebagai aset yang dibuat di repo; tidak ada musik, footage, atau foto pihak ketiga. Lisensi SFX tetap dicatat di `public/sfx/LICENSES.md` saat aset dibuat.
- **#COMPLETION_DRIVE:** Mengasumsikan durasi target VN (`2.3–4.0 s`) bisa dicapai tanpa memotong kalimat; durasi aktual belum diukur karena audio belum dibuat.
- **#SUGGEST_VERIFY:** Setelah generasi audio, ukur setiap VN dengan `ffprobe`; pastikan `2–6 s`, cek alignment ASR, dan pastikan `m22` + `15 f` preplay tidak melewati frame `1920`.
- **#COMPLETION_DRIVE:** Mengasumsikan still dapat memperlihatkan jahitan ganda, asap mendatar, kain tenun, resleting, dan sudut pandang luar dalam satu frame yang terbaca di ponsel.
- **#SUGGEST_VERIFY:** Review still pada ukuran 1080 × 1920 dan di layar ponsel; jika clue tidak terbaca, revisi framing/zoom sebelum render.
- **#COMPLETION_DRIVE:** Mengasumsikan dua artefak terakhir (`m21` foto + `m22` VN resleting) lebih kuat daripada satu artefak; ini keputusan kreatif yang harus diuji lewat Cold-Read dan review owner.
- **#SUGGEST_VERIFY:** Jika Cold-Read menyebut ending berlebihan atau membingungkan, pilih salah satu: pertahankan foto m21 saja, atau pindahkan VN resleting menjadi artefak terakhir tunggal.
- **#COMPLETION_DRIVE:** `arc.json` dan `lore.md` tidak diubah sesuai instruksi isolasi paralel; entri usulan disediakan di respons akhir untuk di-merge owner.
- **#SUGGEST_VERIFY:** Merge entri arc/lore hanya setelah brief dan script disetujui; jangan menandai episode sebagai canon sebelum ada review.
- **#COMPLETION_DRIVE:** Cold-Read dijalankan oleh reviewer konteks baru sebagai proxy model, bukan audiens manusia.
- **#SUGGEST_VERIFY:** Uji dengan penonton manusia setelah render; jangan klaim sebagai bukti audiens.
