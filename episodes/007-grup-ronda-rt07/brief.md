# Episode brief (Studio v3 · Arsip Terakhir) — 007 · Grup Ronda RT 07

## Archive Overview

- **Collection** — [arcs/03-arsip-terakhir/arc.json](../../arcs/03-arsip-terakhir/arc.json) · [Canon Ledger (`Tanpa Nama`)](../../arcs/03-arsip-terakhir/lore.md)
- **Public Archive Number** — **`ARSIP #001`** (`archiveNumber: 1` in `chat-script.json`, rendered as `ARSIP #001 · @skenarium`; folder name `episodes/007-grup-ronda-rt07` and composition ID `Arsip01GrupRondaRT07` unchanged)
- **Pipeline Version** — `3` (`episodes/007-grup-ronda-rt07/chat-script.json`, no narrator)
- **Composition ID** — `Arsip01GrupRondaRT07`
- **Target Runtime** — **64.0 s** (`1920` frames at 30 fps), **1080 × 1920** (strictly inside 45–75 s; adjusted from provisional 62.0 s after measuring `m4` at `4.925 s`)
- **Local Setting** — Pos ronda dan gang kampung fiktif `RT 07` menjelang tengah malam (`23:47`–`23:48`); tidak menyebut nama desa, kecamatan, atau wilayah nyata.
- **Archive Premise** — Tiga warga yang sedang shift ronda malam (`Bayu`, `Hendra`, `Darto`) saling berkirim kabar di grup chat `Ronda RT 07` (`3 anggota`). Ketika Darto mendengar tawa dari pos, Hendra bercanda sambil bilang ia sudah membuatkan **3 gelas kopi**, lalu mengirim foto pos ronda bertuliskan `"pos aman"` — namun di bangku pos tampak **4 gelas kopi** (satu gelas sudah diminum setengah). Tak lama kemudian voice note mulai masuk dengan jeda tipis dan pilihan kata yang janggal saat sesuatu meniru suara mereka.
- **Survival Angle (fiction only — "nearly survives")** — Bayu (pemilik ponsel) sempat mengirim **satu** voice note awal (`m4`) sebelum sadar ada yang tidak beres; balasan tunggal itu sekaligus membocorkan lokasinya (`portal barat`) dan memberi entitas contoh suaranya (`"Pos aman."`). Begitu melihat perubahan gaya bicara Hendra dan Darto, Bayu berhenti total membalas pesan maupun mengangkat panggilan—kebungkamannya menahan entitas agar tidak langsung mengambilnya di pos dan **membuatnya masih hidup untuk sementara waktu ("nearly survives")**, tetapi tidak menyelamatkannya sepenuhnya: foto dari luar `PORTAL BARAT` (`m15`) dan voice note terakhir memakai suaranya sendiri (`m16`) menunjukkan entitas sudah melacaknya ke sana. Cerita ini murni fiksi, bukan panduan keselamatan nyata.

## Entity / Rule (Never Explained Aloud)

- **The one entity or rule** — Entitas peniru (*mimic*) yang sudah ikut duduk di pos ronda sejak awal; ia menyalin suara dan cara bicara siapa pun yang membalas di grup, dan **melacak target lewat informasi dan balasan yang mereka kirimkan**.
- **How the viewer infers it** — (1) Hendra menyebut ia membuat **3** gelas kopi (`m2`), tetapi foto `m3` memperlihatkan **4** gelas kopi di bangku pos dengan satu gelas sudah diminum setengah; (2) suara dan kosakata Hendra berubah kaku (`gw/wkwk` → `"aku... di pos, Pak."`) di `m6`, lalu Darto (`mas bayu` → `"bayu kamu di mana? jawab aku bayu"`) di `m10`; (3) entitas terus memancing Bayu menjawab (`m10`, panggilan `m11`, `m13` `"bayu jangan diam aja, balas dulu"`) karena diamnya Bayu memutus umpan lokasi langsung—namun satu balasan awal Bayu di `m4` sudah cukup memberi nama tempat (`portal barat`) dan sampel suaranya; (4) header grup tetap `3 anggota` sepanjang video tanpa pesan gabung/keluar, lalu pengirim ke-4 tanpa nama/foto muncul di `m15`/`m16`.
- **Why Bayu only nearly survives** — Diam setelah `m4` menghindarkannya dari nasib langsung Hendra dan Darto di pos, tetapi tidak menghapus jejak dari `m4` (`portal barat` + suara `"Pos aman."`), sehingga akhir video memperlihatkan ia hampir/sudah ditemukan.

## Characters & Texting Voices

| Character ID | Display Name | Phone Owner? | Bubble / Name Color | TTS Voice Role | Texting Voice & Quirks |
| --- | --- | --- | --- | --- | --- |
| `bayu` | Bayu | yes (`selfId`) | `#7DD3FC` | `male-masc-id` (`voice_71a5a701-796e-421d-840e-0adc00b0816a`, masculine Indonesian male voice) | Singkat, tenang, pragmatis (`gw`, `bntr`, huruf kecil); mengirim 1 voice note awal (`m4`, satu-satunya pesan dengan tanda terima `read`) lalu berhenti total membalas begitu mencium kejanggalan. |
| `hendra` | Hendra | no | `#FDBA74` | `Charon` (distinct male voice 2) | Santai, suka bercanda (`wkwk`, `gw`, `kali`, `udh`). Saat ditiru di `m6`/`m13`, berubah kaku menjadi `"aku"` dan kalimat formal tanpa `"wkwk"`. |
| `darto` | Darto | no | `#6EE7B7` | `Orus` (distinct male voice 3) | Tetangga lebih senior, sopan (`mas`, `pak`, `lho`, tanda tanya ganda `??`). Saat ditiru di `m10`, berubah dingin tanpa `"mas"`: `"bayu kamu di mana? jawab aku bayu"`. |
| `unknown` | `Tanpa Nama` (fixed grey default avatar, no phone number) | no | `#94A3B8` | `male-masc-id` (suara Bayu sendiri, EQ datar) | Series presence (`Tanpa Nama`, logged in [lore.md](../../arcs/03-arsip-terakhir/lore.md)) — masuk ke grup tanpa pesan gabung saat header tetap `3 anggota`, mengirim foto luar `PORTAL BARAT` tanpa caption (`m15`) lalu VN tiruan suara Bayu `"Pos aman."` (`m16`, datang unplayed lalu diputar dan berhenti di status played), dipicu nada notifikasi khas `Tanpa Nama`. |

## Frame-Zero Hook (00:00.0)

- **Opening artifact / message (`m1`, `at: 0`)** — `"mas td yg ketawa di pos siapa? kita kan cuma bertiga"`
- **Readable in ≤ 2 s?** — 10 kata sehari-hari, langsung terbaca di frame 0 (`opacity: 1` penuh) dengan detail mustahil (*suara tawa di pos padahal ronda cuma bertiga*).

## Beat Map (64.0 s, 1920 Frames @ 30 fps, No Rewind Loops)

Shape: **Normal → odd detail → escalation → silence or reveal**.
In-world phone clock starts at **`23:47:28`**, ticking cleanly from `23:47` to `23:48` at `t = 32.0 s` (`frame 960`). Header stays **`3 anggota`** throughout the entire video.

| Event ID | Start (s) | Frame | Hold (s / f) | Min Hold (s / f) | Type & Sender | Summary |
| --- | --- | --- | --- | --- | --- | --- |
| `m1` | `0.00` | `0` | `2.80 s` / `84 f` | `2.40 s` / `72 f` (10 w) | `text` (`darto`) | Hook: tanya siapa yang ketawa di pos padahal cuma bertiga. |
| `m2` | `2.80` | `84` | `2.80 s` / `84 f` | `2.22 s` / `67 f` (9 w) | `text` (`hendra`) | Normal beat: `"wkwk angin kali pak, kopi udh gw bikinin 3 ya"` (establishes `N = 3`). |
| `m3` | `5.60` | `168` | `5.40 s` / `162 f` | `1.20 s` / `36 f` (2 w) | `photo` (`hendra`) | **Clue C1 plant (8.75% ≤ 40%):** `"pos aman"` — 4 gelas kopi di bangku, 1 sudah diminum setengah (zoom `atOffset: 42`, `96 f`, `scale: 1.32`). |
| `m4` | `11.00` | `330` | `5.80 s` / `174 f` | `2.40 s` / `72 f` (10 w) | `voice` (`bayu`, `ticks: "read"`) | VN Bayu (`4.925 s`): `"Gue di portal barat bentar, nanti balik ke pos. Pos aman."` (bocor lokasi + suara). |
| `m5` | `16.80` | `504` | `3.00 s` / `90 f` | `2.22 s` / `67 f` (9 w) | `text` (`darto`) | Odd detail: Darto barusan melihat Hendra lewat Gang 2. |
| `m6` | `19.80` | `594` | `4.60 s` / `138 f` | `2.40 s` / `72 f` (10 w) | `voice` (`hendra`) | VN Hendra janggal (`3.565 s`): `"Hah... aku di pos, Pak. Aku dari tadi di pos."` |
| `m7` | `24.40` | `732` | `3.20 s` / `96 f` | `2.40 s` / `72 f` (10 w) | `text` (`darto`) | Darto memanggil Bayu karena suara Hendra aneh; Bayu mulai diam. |
| `m8` | `27.60` | `828` | `4.60 s` / `138 f` | `1.20 s` / `36 f` (3 w) | `photo` (`darto`) | `"itu hendra bukan??"` — foto gang gelap ber-noise (sosok di ujung gang, zoom `atOffset: 36`, `84 f`, `scale: 2.0`). |
| `m9` | `32.20` | `966` | `4.80 s` / `144 f` | `2.40 s` / `72 f` (10 w) | `voice` (`darto`) | VN Darto panik (`3.625 s`, terputus mendadak di `3.680 s`): `"Mas Bayu jawab dong! Dia nengok ke sini, dia lari—"` |
| `m10` | `37.00` | `1110` | `3.20 s` / `96 f` | `1.86 s` / `56 f` (7 w) | `text` (`darto`) | Mimic Darto memancing jawaban: `"bayu kamu di mana? jawab aku bayu"` (Bayu tetap diam). |
| `m11` | `40.20` | `1206` | `4.20 s` / `126 f` | — (`105 f` overlay) | `call` (`Darto`) | Panggilan masuk dari Darto, tidak diangkat Bayu. |
| `m12` | `44.40` | `1332` | `2.20 s` / `66 f` | `1.50 s` / `45 f` (5 w) | `system` | `"Panggilan tak terjawab dari Darto"` + jeda hening. |
| `m13` | `46.60` | `1398` | `2.80 s` / `84 f` | `1.68 s` / `51 f` (6 w) | `text` (`hendra`) | Mimic Hendra memaksa: `"bayu jangan diam aja, balas dulu"` (Bayu tetap diam). |
| `m14` | `49.40` | `1482` | `6.20 s` / `186 f` | — (`165 f` overlay) | `cctv` (`CAM 01`) | **Clue C1 payoff (shown, never stated):** pos ronda kosong, **keempat gelas kopi kini habis semua**, ponsel menyala tergeletak di lantai; diikuti glitch di `1650`. |
| `m15` | `55.60` | `1668` | `2.60 s` / `78 f` | — (tanpa caption) | `photo` (`unknown`) | **Clue C2 payoff:** pengirim ke-4 tanpa nama/foto muncul tanpa pesan gabung (header tetap `3 anggota`), mengirim foto flash dari luar `PORTAL BARAT`. |
| `m16` | `58.20` | `1746` | `5.80 s` / `174 f` | `1.20 s` / `36 f` (2 w) | `voice` (`unknown`, `unplayed: true`) | VN terakhir (`2.375 s` + `~3.4 s` hening) memakai **suara Bayu sendiri** (diturunkan dari ekor `m4`): `"Pos aman."` dengan indikator `unplayed` amber original. |

## Fair-Play Clue Ledger

**The payoff is shown, never stated** — tidak ada karakter yang menyebut jumlah gelas kopi, jumlah anggota, atau aturan entitas. Semua stempel waktu diturunkan langsung dari frame `at` di `chat-script.json`.

| Clue ID | Visual / Text Clue | Planted In (Event ID) | Paid Off In (Event ID — Artifact Only) | Phone-Size Readability Plan |
| --- | --- | --- | --- | --- |
| `C1` | Chat menetapkan **3 gelas kopi** (`m2`: `"kopi udh gw bikinin 3 ya"`), tetapi foto pos (`m3`) menampakkan **4 gelas kopi** di bangku dengan 1 gelas sudah diminum setengah | `m3` (frame `168` = **8.75%** dari 1920, jauh di bawah batas 40%) | `m14` (CCTV pos ronda kosong: **semua 4 gelas kopi kini habis diminum**, ponsel tergeletak menyala di lantai) | Ke-4 gelas bening kopi hitam diletakkan terpisah jelas di bangku kayu diterangi flash HP di `still-01-pos-aman.jpg`, diperbesar halus oleh `PhotoZoomOverlay` (`x: 0.57, y: 0.58, scale: 1.32`), lalu 4 gelas kosong di posisi yang sama terlihat di CCTV `m14` (`x: 0.48, y: 0.52, scale: 1.55`) tanpa panah/lingkaran. |
| `C2` | Grup ronda hanya beranggotakan **3 orang** (`m1`: `"kita kan cuma bertiga"` dan header tetap **`3 anggota`** sepanjang video tanpa pesan gabung/keluar) | `m1` (frame `0` = **0.0%** dari 1920) | `m15` (pengirim ke-4 tanpa nama/foto mengirim foto luar portal barat, disusul VN `m16`, sementara header grup tetap `3 anggota`) | Header `3 anggota` selalu terlihat di atas thread saat bubble dari `Tanpa Nama` masuk di `m15`/`m16`. |

## Ending (Recasts Everything, No Recap)

- **Final artifact (`m15` + `m16`)** — Pengirim tanpa nama/foto masuk ke grup yang tetap bertuliskan `3 anggota`, mengirim foto luar `PORTAL BARAT` (`m15`), diikuti voice note dengan indikator `unplayed` (`m16`) memakai **suara Bayu sendiri** (`male-masc-id`): `"Pos aman."`
- **Why it recasts the archive** — Penonton sadar saat rewatch bahwa sosok keempat sudah duduk meminum gelas kopi ke-4 sejak foto pertama (`m3`), sudah menghabiskan keempat gelas di `m14`, dan satu balasan awal Bayu di `m4` (`portal barat` + `"Pos aman."`) cukup untuk menuntun entitas sampai ke depan portal barat meski Bayu memilih bungkam sesudahnya.
- **Prohibited endings checked** — Tidak ada `"Kamu berhasil bertahan hidup."`, tidak ada narator, tidak ada rekap, tidak ada klaim bahwa diam menyelamatkan Bayu sepenuhnya.

## Reading-Pace Budget

Formula: setiap pesan yang terbaca ditahan minimal **`max(1.2 s, 0.18 s × kata + 0.6 s)`** (`ceil(sec × 30)` frame).

- **Script file** — [episodes/007-grup-ronda-rt07/chat-script.json](chat-script.json)
- **Event breakdown** — 16 event total: 6 pesan teks, 3 foto chat, 4 voice note, 1 pesan sistem, 1 layar panggilan masuk, 1 CCTV still.
- **Total on-screen words (chat + caption foto + subtitle VN + sistem)** — **93 kata** (termasuk 4 subtitle VN).
- **Automated pace check** — Semua 13 event berteks lolos batas minimum baca di `scripts/check-v3.mjs`; total durasi **64.0 s** (`1920` frames), menyisakan ruang penuh untuk 4 voice note (`2.375–4.925 s` terukur) dan jeda hening di akhir.

## Visuals List (4 Amateur Phone Photos / CCTV Stills)

Gaya: foto kamera HP amatir malam hari (flash keras, noise ISO tinggi, framing sedikit miring) dan rekaman CCTV monokrom — **bukan** ilustrasi/siluet 2D, **bebas gore**.

| Asset Path (`public/...`) | Event ID | Type | Subject & Clue Details | Zoom Target |
| --- | --- | --- | --- | --- |
| `assets/007-grup-ronda-rt07/still-01-pos-aman.jpg` | `m3` | `phone-photo` | Foto flash HP amatir di dalam/depan Pos Ronda RT 07 (bangku kayu sederhana, termos air panas, papan kecil `POS RONDA RT 07`). **Kunci fair-play (`C1`):** di atas bangku/meja kayu berjajar **tepat 4 gelas belimbing/kaca berisi kopi hitam** — **3 gelas masih penuh, 1 gelas di ujung sudah tinggal setengah** — terpisah rapi dan mudah dihitung di 540×960. | `{x: 0.57, y: 0.58, scale: 1.32, atOffset: 42, durationFrames: 96}` |
| `assets/007-grup-ronda-rt07/still-02-gang-gelap.jpg` | `m8` | `phone-photo` | Foto HP malam ber-noise tinggi di gang sempit kampung beraspal/paving di bawah lampu jalan kuning redup: sesosok pria berjaket gelap berdiri diam membelakangi kamera di ujung gang. Bebas gore. | `{x: 0.55, y: 0.55, scale: 2.0, atOffset: 36, durationFrames: 84}` |
| `assets/007-grup-ronda-rt07/still-03-cctv-pos.jpg` | `m14` | `cctv` | Sudut kamera CCTV atas-miring monokrom/IR menyorot Pos Ronda RT 07 yang kini sepi kosong; **ke-4 gelas kopi di meja/bangku semuanya kini kosong (habis diminum)**, dan sebuah ponsel menyala tergeletak di lantai kayu pos. | `{x: 0.48, y: 0.52, scale: 1.55, atOffset: 45, durationFrames: 105}` |
| `assets/007-grup-ronda-rt07/still-04-portal-barat.jpg` | `m15` | `phone-photo` | Foto flash HP malam amatir dari arah luar menghadap palang bambu/besi gang gelap bertuliskan papan sederhana `PORTAL BARAT`, sepi, diambil seolah seseorang baru berhenti tepat di depan portal. | *(inline chat photo, tanpa zoom)* |

### Image Generation Risk & Count Verification Gate (Enforced in Phase 3)

- **Risiko:** Generator gambar AI sering salah menghitung objek berulang (misalnya menghasilkan 3 atau 5 gelas alih-alih tepat 4, atau membuat semua gelas tampak sama penuh).
- **Gerbang wajib sebelum menerima aset:** Setiap still yang membawa petunjuk terhitung (`still-01-pos-aman.jpg`: **tepat 4 gelas kopi, 3 penuh + 1 setengah habis**; `still-03-cctv-pos.jpg`: **tepat 4 gelas kosong habis**) WAJIB diperiksa dan dihitung langsung pada resolusi **540 × 960** sebelum diterima untuk assembly.
- **Tindakan jika meleset:** Regenerasi atau lakukan *compositing* yang bersih sampai jumlah dan level kopinya 100% tepat dan mudah dihitung pada 540 × 960, lalu catat jumlah percobaan (attempt count) serta metode finalnya di `episodes/007-grup-ronda-rt07/assets.md`.

## Audio Cue Sheet (4 Voice Notes + UI/Ambience SFX — No Mood Music)

Setiap voice note berdurasi **2–6 dtk** (diukur langsung dari file audio oleh validator; tidak ditulis manual di JSON). **Tanpa musik latar yang menjelaskan suasana.**

| Event / Cue ID | Approx Time | Type | Speaker / Asset | Exact Spoken Line or Sound Description | Target Duration |
| --- | --- | --- | --- | --- | --- |
| `ambience` | `00:00–01:04` | `ambience` | `assets/007-grup-ronda-rt07/ambience-night-village.wav` | Jangkrik malam kampung & angin halus sangat pelan. | loop |
| `uiSfx` | tiap pesan | `ui-sfx` | `assets/007-grup-ronda-rt07/ui-pop-in.wav`, `ui-pop-out.wav` | Suara pop chat original non-WA yang singkat & bersih. | ~0.07 s |
| `m4` | `00:11.0` | `voice-note` | `bayu` (`male-masc-id`) | `"Gue di portal barat bentar, nanti balik ke pos. Pos aman."` | `4.925 s` |
| `m6` | `00:19.8` | `voice-note` | `hendra` (`Charon`, jeda tipis & kaku) | `"Hah... aku di pos, Pak. Aku dari tadi di pos."` | `3.565 s` |
| `m9` | `00:32.2` | `voice-note` | `darto` (`Orus`, terengah, terpotong mendadak di `3.680 s`) | `"Mas Bayu jawab dong! Dia nengok ke sini, dia lari—"` | `3.625 s` |
| `m11–m12` | `00:40.2–00:46.6` | `silence` | *(hening disengaja setelah panggilan tak terjawab)* | Hening mencekam saat Bayu tidak menjawab. | ~2.2 s |
| `m16` | `00:58.2` | `voice-note` | `unknown` (`male-masc-id` — diturunkan langsung dari ekor `"Pos aman."` rekaman `m4`, EQ datar + room tone halus) | `"Pos aman."` | `2.375 s` |

## Series Identity, Brand Safety & Upload Disclosure Checklist

- **Series identity strip** — Solid full-width strip (`y: 212..282`) directly below `ChatHeader` displaying **`ARSIP #001 · @skenarium`** (`42 px`, inside critical safe zone `x: 28, y: 218, w: 916, h: 58`), clipping scrolling messages cleanly below `y = 282`. By owner decision on 2026-11-24, there is **no on-screen `FIKSI` tag** (the `@skenarium` account bio states fiction).
- **Receipt & voice-note semantics** — Tanda terima (`ticks: "read"`) hanya muncul pada pesan yang dikirim pemilik ponsel (`bayu`, `m4`). Semua pesan masuk tidak memakai tanda terima. Voice note terakhir (`m16`) datang dengan indikator `unplayed` amber selama `0.5 s` preplay, cincin amber menghilang begitu pemutaran dimulai, waveform berjalan, lalu bubble berhenti di status `played`.
- **Upload caption & AI label (`caption-draft.md`)** — Draft tidak diposting tersedia di [caption-draft.md](caption-draft.md) dengan hook singkat, komentar pin pencarian petunjuk, tag wajib **`#fiksi`** dan **`#ceritahorror`**, serta pengingat untuk mengaktifkan label **AI-generated-content** bawaan platform saat upload (publikasi tetap butuh izin eksplisit owner).
- **Generic original chat UI** — Tema midnight-slate original `ArsipPlayer`, ikon tanda baca original, avatar abu-abu default tetap `Tanpa Nama`, dan nada notifikasi khas `Tanpa Nama` yang disintesis sendiri (nol warna/ikon/suara/merek WhatsApp, Telegram, atau Line).
- **Defamation / privacy check** — Tanpa nama orang nyata, tanpa nomor telepon nyata (termasuk pada `Tanpa Nama`), hanya label fiktif generik `RT 07` / `PORTAL BARAT`.
- **Gore check** — 100% bebas darah/gore.
- **Provenance & rights log** — Tercatat lengkap (termasuk attempt count still, penurunan `m16` dari `m4`, nada khas `Tanpa Nama`, dan status `listening review: none`) di [episodes/007-grup-ronda-rt07/assets.md](assets.md) dan [arcs/03-arsip-terakhir/lore.md](../../arcs/03-arsip-terakhir/lore.md).
