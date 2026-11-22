# Standalone Scenario 02 — Rumah Tengah Hutan

**Status: pass.** Showrunner brief approved by orchestrator. Pitch 1 ("Sinkronisasi Petir & Jebakan Ranting Roboh") locked with 252-word Bahasa Bayi narration in `narasi.txt`, Fair-Play Clue Ledger fully planted in P01–P06 before 00:25, filter-safe noir aftermath, and 24-panel single-frame layout aligned to a 02:34.0 (154.0 s) timeline. Ready for parallel handoff to Agent 02 (Audio Producer) and Agent 03 (Image Generator).

---

## Standalone Scenario

- **Collection:** [Skenario Bertahan](../../arcs/02-skenario-bertahan/arc.json), Scenario 02. Independent Indonesian forest setting, fresh protagonist silhouette, and unique acoustic masking survival puzzle; zero continuity or characters from Arc 01 or Pilot 01.
- **Premise:** Seorang pendaki yang terjebak badai hutan pinus masuk ke dalam pos pantau kehutanan tua untuk berlindung. Tepat setelah ia masuk, angin badai menumbangkan pohon pinus raksasa di teras depan—batang pohon dan tanah longsor memblokir total pintu depan dari luar. Seekor makhluk buas nokturnal bertubuh kurus jangkung bersarang di sela dahan pohon tumbang tepat di ambang teras, memotong jalan keluar utama. Pintu keluar darurat di belakang terkunci oleh palang kayu tebal yang macet berkarat dan hanya bisa dibuka dengan hantaman keras balok kayu jati. Menghantam palang secara membabi buta akan memicu monster melompat menyerang. Untuk bertahan, survivor memanfaatkan ritme badai: kilatan petir selalu disusul gelegar guruh berjarak 3 detik yang menggetarkan dinding. Survivor menghitung waktu dan menghantamkan balok kayu tepat bersamaan dengan ledakan guruh untuk menelan suara pukulan, lalu melarikan diri menyusuri tebing.
- **Opening State:** Senja badai berkabut di lereng hutan pinus. Pintu depan terblokir batang pinus roboh dan longsoran tanah; makhluk bersarang di sela dahan menghadap luar dengan telinga siaga ke dalam. Barang yang terlihat di pembuka: jendela kaca samping yang menangkap kilatan petir berjarak 3 detik ke suara guruh, balok kayu jati tebal yang lepas di dekat tungku perapian batu, dan pintu darurat belakang dengan palang kayu yang macet.
- **Resolution:** Survivor menghitung jeda 3 detik setelah kilatan petir, menghantam palang kayu sekuat tenaga tepat saat gelegar guruh meledak di langit, menahan napas dalam keheningan 2 detik memastikan monster tidak terpicu, lalu mendorong pintu belakang dan lari menuruni jalan setapak tebing tembus badai.
- **Runtime and Count:** Target **145–160 s** (timeline terukur: **02:34.0 / 154.0 s**), narasi [narasi.txt](narasi.txt) berjumlah **252 kata** dalam Bahasa Bayi, dibawakan oleh narator tunggal Investigator (~1.7 kata/detik) dengan jeda terencana: 0.4 s rewind, 1.6 s post-rewind dread silence, countdown petir 3 detik, 2.0 s dread silence pasca-guruh, serta 4.0 s blackout tail.
- **Assembly Intent:** Proposed composition `Skenario02RumahTengahHutan`, 1080 × 1920, 30 fps; manifest `pipelineVersion: 2`, `schemaVersion: 2`, `art.styleId: urban-silhouette-noir`, `script.format: decision-consequence`, `script.engine: branch-rewind`.
- **Remotion 2.5D Plate Prep & Procedural Effects:**
  1. **Outdoor-Only Rain & Fog Overlay (`P01`, `P02`, `P03`, `P22`, `P23`, `P24`):** Partikel hujan lebat dan kabut tebal hanya dirender di luar ruangan atau menembus kaca jendela/pintu terbuka. Interior pos pantau tetap kering.
  2. **Procedural Lightning Flash Overlay (`P05`, `P18`):** Remotion menerapkan 1–2 frame white flash filter (`rgba(255,255,255,0.85)`) yang menerangi ruangan pos pantau sinkron dengan visual kilat di jendela.
  3. **ImpactMicroShake (`P08`, `P19`):** Getaran kamera lateral `±6–8 px` jitter pada frame hantaman balok kayu bad branch (`P08`) dan hantaman balok simultan gelegar guruh (`P19`).
  4. **Branch-Rewind Glitch Overlay (`P10` → `P11`):** Transisi 0.4 s `branchRewind` (00:59.6–01:00.0) menggunakan efek scanline tape snap, chromatic glitch, dan reverse whoosh.

---

## Draft Silhouette Profile

**Protagonist (Survivor):**
- Pemuda/pemudi Indonesia usia 20-an, tinggi 165–170 cm, postur atletis ringkas pendaki gunung.
- Busana: Jas hujan ponco gelap atau jaket outdoor tebal tahan air dengan hoodie terbuka/ke belakang, tali ransel trekking melintang di dada, celana kargo gelap, dan sepatu boots gunung bertapak tebal.
- Siluet Urban Silhouette Noir: Matte `#07080B`, tepi siluet tegas dengan aksen rim light dingin tipis dari pantulan kilat jendela; wajah datar tanpa detail mata realistis.

**Creature ("Pemangsa Ambang Ranting"):**
- Bukan manusia. Entitas karnivora predator nokturnal berpostur jangkung kurus dengan sendi-sendi fleksibel yang mampu meringkuk di sela dahan pohon tumbang.
- Cakar melengkung panjang seperti kait tajam, telinga runcing fleksibel yang terus bergerak menangkap getaran suara dari dalam rumah, tubuh bertekstur gelap kasar menyatu dengan kulit kayu pinus.
- Karakteristik Berburu: Terhalang dahan pinus lebat untuk melihat ke dalam pos pantau, tetapi memiliki pendengaran akustik tajam terhadap suara dentuman keras yang terisolasi.

---

## Spatial & Camera Layout

**Bangunan & Lingkungan Pos Pantau:**
- Pos pantau kehutanan berdinding papan kayu kasar berukuran 4 m × 6 m di tepi lereng tebing pinus berkabut.
- **Sisi Selatan (Depan):** Pintu depan kayu lapuk dengan teras kecil. Pohon pinus raksasa roboh tepat di atas teras, batangnya menghalangi daun pintu dari luar bercampur tumpukan tanah longsor. Monster bersarang di sela dahan pohon yang patah di ambang teras, menghadap ke arah badai luar dengan telinga siaga ke dalam.
- **Sisi Barat:** Jendela kaca berbingkai kayu persegi panjang yang menghadap langsung ke arah langit badai; menjadi indikator visual utama datangnya kilatan petir.
- **Area Tengah:** Lantai papan kayu solid. Terdapat perapian batu kali tua; di dekat perapian tergeletak balok kayu jati solid (`balok kayu jati`) berukuran sekitar 1 meter yang terlepas dari rangka dinding.
- **Sisi Utara (Belakang):** Pintu keluar darurat dari kayu tebal yang terpasak palang kayu melintang pada braket besi berkarat (`palang kayu macet`). Pintu ini mengarah ke jalan setapak berbatu di tepi tebing yang aman dari jangkauan pohon tumbang.

**Sightlines & Sudut Kamera:**
- Sudut kamera interior dari depan menghadap ke belakang memperlihatkan balok jati di lantai dan pintu darurat di ujung ruangan.
- Sudut kamera mengarah ke jendela barat memperlihatkan kilatan petir yang menerangi interior.
- Setiap panel adalah **komposisi tunggal satu frame (single-frame composition)** tanpa split-screen atau montase. Bila karakter tampak utuh (full body), sudut kamera didefinisikan sebagai `empty POV — no foreground character in frame` guna mencegah figur foreground buram ganda.

---

## Script, Decision, and Fair Play

**Opening (00:00.0–00:32.0):** “Kamu nemu pondok pos pantau di tengah badai. Salah gerak, tamat.” Pohon pinus roboh menutup pintu depan, monster bersarang di ranting ambang pintu, jendela menangkap kilat-guruh 3 detik, balok jati tergeletak, dan pintu darurat belakang macet. Stakes dan batasan fisik ditanamkan tuntas dalam 32 detik pertama.

**Bad Branch (00:32.0–01:00.0):** Karena panik melihat jalan depan tertutup monster, insting manusiawi paling wajar adalah lari ke pintu belakang, menyambar balok kayu jati, dan langsung menghantam palang sekuat tenaga agar cepat lepas. Hantaman balok menghasilkan dentuman keras (*BRAK!*) yang memecah kesunyian. Monster di ambang depan langsung memutar leher, melompat menembus sela dahan, dan menyergap survivor dari belakang. Survivor terpental ke lantai kayu dalam pencahayaan merah noir. Layar menggelap. Transisi `branchRewind` 0.4 s (00:59.6–01:00.0) mengembalikan waktu ke saat survivor berdiri memegang balok.

**Survival Branch (01:00.0–02:34.0):** Balik lagi. Jangan hantam palang sembarangan. Monster tidak bisa melihat ke dalam karena tertutup dahan, tapi peka pada suara dentuman keras. Kuncinya: manfaatkan ritme badai. Ambil balok jati, dekati pintu belakang pelan-pelan. Tatap jendela samping: kilat menyala! Hitung mundur: *Satu... dua... tiga...* Gelegar guruh meledak di langit, dan tepat di detik yang sama: *BRAK!* Hantam palang kayu sekuat tenaga. Suara hantaman balok tenggelam total di balik gelegar guruh. Diam membeku selama 2 detik memastikan monster di depan tetap tenang. Palang patah, dorong pintu darurat ke luar, dan lari menyusuri jalan setapak tebing menjauh dari pondok.

---

### Fair-Play Clue Ledger

Seluruh 4 petunjuk fisik ditanamkan secara natural pada panel P01–P06 sebelum 00:32:

| ID | Panel & Detail Spoken Alami (Setup P01–P06) | Payoff (Bad Outcome atau Smart Escape) |
| --- | --- | --- |
| **C1 — Ritme Kilat-ke-Guruh 3 Detik** | **P05 (00:19.0–00:25.0):** Jendela samping memperlihatkan kilat terang, disusul tepat 3 detik kemudian oleh gelegar guruh yang menggetarkan dinding. “Di jendela, kilatan petir selalu disusul guruh keras tiga detik kemudian, bikin dinding bergetar.” | **P18–P20 (01:35.0–01:54.0):** Survivor menghitung 3 detik setelah kilat menyala (`P18`) untuk mengeksekusi hantaman balok kayu secara simultan di dalam puncak gelegar guruh (`P19`), dan palang patah tanpa memicu monster (`P20`). |
| **C2 — Pohon Pinus Tumbang & Monster di Ambang** | **P02 & P03 (00:04.0–00:15.0):** Pohon pinus roboh dan tanah longsor memblokir pintu depan; monster kurus bersarang di sela ranting menghadap luar dengan telinga siaga ke dalam. “Baru aja kamu masuk, pohon pinus raksasa di teras roboh dihantam angin... ada makhluk bertangan panjang kurus yang bersarang di ambang teras.” | **P09–P10 (00:47.0–00:59.6):** Hantaman tanpa peredam memicu monster melompat masuk menerkam. **P12 & P21:** Survivor menyadari pandangan monster terhalang dahan dan tetap tenang jika suara disamarkan guruh. |
| **C3 — Balok Kayu Jati Solid di Dekat Perapian** | **P06 (00:25.0–00:32.0):** Balok kayu jati tebal tergeletak lepas di lantai batu dekat tungku perapian. “Di lantai dekat perapian, ada balok kayu jati tebal yang lepas.” | **P07 (00:32.0–00:41.0) & P15–P16 (01:22.0–01:30.0):** Menjadi satu-satunya alat pemukul berat yang cukup kuat untuk mematahkan palang pintu darurat. |
| **C4 — Pintu Darurat Belakang Berpalang Macet** | **P06 (00:25.0–00:32.0):** Pintu kayu darurat di dinding belakang dengan palang kayu tebal macet di braket besi berkarat. “Dan di belakang, ada pintu darurat yang palang kayunya macet.” | **P08 (00:41.0–00:47.0) & P19–P22 (01:43.0–02:09.0):** Satu-satunya rute pelarian fisik yang harus dibuka dengan mematahkan palangnya. |

---

## Audio Handoff and Mandatory Cue Sheet

Narator Investigator adalah satu-satunya pencerita (white captions). Seluruh SFX dunia (foley) dan keheningan dramatis dialokasikan dengan bersih pada timeline terukur **02:34.0 (154.0 s)**, tanpa menumpuk vokal narator.

| Waktu Terukur | Aset / Cue Type | Perlakuan Akustik | Mix & Pacing Rule |
| --- | --- | --- | --- |
| 00:00.0–00:04.0 | Judul `PONDOK TENGAH BADAI`, angin badai menderu, hujan deras outdoor | Ambien eksterior basah tebing | Level ambien −22 LUFS; pembukaan jernih, cover TikTok pada 00:00.2. |
| 00:04.0–00:10.0 | Suara derak pohon patah dan debuman pohon tumbang di teras depan (*CRASH-THUD*) | Low end rumble, getaran kayu | Menegaskan pintu depan tertutup total oleh pohon pinus di P02. |
| 00:10.0–00:19.0 | Gesekan dahan pinus, dengusan napas berat monster di ambang teras | Foley basah, terisolasi di ambang | Monster bersarang di sela dahan di P03; kupingnya bergerak di P04. |
| 00:19.0–00:25.0 | Kilatan petir di jendela (00:20.0), jeda hening 3.0 s, lalu gelegar guruh (*BOOM-RUMBLE*) di 00:23.0 | Low sub rumble menggetarkan dinding | Menanamkan aturan 3 detik ritme guruh secara gamblang di P05. |
| 00:25.0–00:32.0 | Ketukan sepatu di lantai kayu, dentang gesekan kayu jati tebal | Foley dekat kering | Menunjukkan balok kayu jati dan palang pintu macet di P06. |
| 00:32.0–00:41.0 | Langkah kaki tergesa-gesa ke pintu belakang, gesekan balok diangkat | Tense footsteps, napas memburu | Membangun kepanikan insting manusiawi di P07. |
| 00:41.0–00:47.0 | Hantaman keras balok kayu ke palang pintu: *BRAK!* bergema nyaring | Harsh transient wood impact | Peak sound tanpa guruh; memicu getaran layar Remotion di P08. |
| 00:47.0–00:59.6 | Derak dahan terkoyak, desisan melengking monster, lompatan cepat, suara impak tumpul dan rebahan tubuh | Distorsi red noir aftermath | Monster menerjang di P09; survivor terkapar di P10. Narasi berhenti di 00:58.0; hold visual hingga 00:59.6. |
| 00:59.6–01:00.0 | `branchRewind` tape snap / glitch reverse whoosh | Efek transisi non-diegetik | Tepat 0.4 detik; membalikkan visual ke pilihan awal. |
| 01:00.0–01:01.6 | **1.6 s Post-Rewind Dread Silence** | Mute total ambien & vokal | Keheningan mutlak pasca-rewind di P11 sebelum instruksi selamat dimulai. |
| 01:01.6–01:22.0 | Ambien badai di luar, gemercik tetesan air hujan di kaca | Quiet indoor room tone | Membangun kembali konsentrasi survivor di P11–P14. |
| 01:22.0–01:35.0 | Langkah kaki perlahan tanpa derit, balok kayu jati diangkat dengan mantap | Controlled foley | Survivor mendekati pintu belakang di P15–P16 dan menatap jendela di P17. |
| 01:35.0–01:43.0 | Kilatan petir di jendela (01:36.0), countdown narator: *Satu... dua... tiga...* | Suara bisik narator berhitung | Ketegangan memuncak di P18 menunggu ledakan guruh. |
| 01:43.0–01:49.0 | Gelegar guruh raksasa (*KABOOM!*) bersamaan hantaman balok *BRAK!* | Massive simultaneous acoustic masking | Suara balok tenggelam 100% di dalam gelombang guruh di P19; Remotion `ImpactMicroShake`. |
| 01:49.0–01:54.0 | Suara patahan palang kayu jatuh ke lantai (*clatter-thud* pelan) | Foley patahan kayu teredam | Patahnya palang di P20 tertelan gemuruh guruh yang mereda. |
| 01:54.0–02:02.0 | **2.0 s Dread Silence** (01:55.0–01:57.0) | Hening total detak jantung & napas tertahan | Ketegangan mutlak di P21 saat guruh reda; monster di depan tetap tenang. |
| 02:02.0–02:09.0 | Derit engsel pintu darurat terdorong keluar, deru angin badai tebing | Udara luar menyergap masuk | Palang patah, pintu terbuka di P22. |
| 02:09.0–02:19.0 | Langkah lari cepat menuruni tanah berbatu becek, hujan menerpa pakaian | Dynamic outdoor sprint | Survivor lari menjauh di jalan setapak tebing di P23. |
| 02:19.0–02:34.0 | Tension lift 3 s terakhir; 150 ms hening; 1 restrained low sub-hit pada cut to black | Sub-bass −14 LUFS, ≤ −1 dBTP | Potong bersih ke hitam (blackout) pada 02:34.0 tanpa teks sisa. |

---

## Panel Plan — Single-Frame Show-What-You-Say Lock

**24 panel 9:16 independen.** Format Urban Silhouette Noir (matte `#07080B`, abu-abu arang, aksen petir/cyan mist dingin; panel P08–P10 warning red/amber). Setiap panel adalah frame utuh tanpa pembagian layar. Penggunaan `empty POV — no foreground character in frame` diterapkan di setiap bidikan di mana figur karakter sudah terlihat utuh atau di luar sudut pandang kamera guna mencegah figur buram ganda.

| ID / Waktu Terukur | Subjek Frame & Jangkar Narasi | Palet, Sudut & Foreground Treatment |
| --- | --- | --- |
| **P01** (00:00.0–00:04.0) | Eksterior wide pos pantau kayu tua di tepi tebing berkabut saat senja badai. Siluet protagonis berponco berdiri di depan pintu. “Kamu nemu pondok pos pantau di tengah badai. Salah gerak, tamat.” | Slate/charcoal; kabut dingin; hujan lebat outdoor; **protagonis terlihat jelas di pintu**. Judul `PONDOK TENGAH BADAI` (0–00:01.8, safe zone). Cover TikTok 00:00.2. |
| **P02** (00:04.0–00:10.0) | Eksterior/teras depan: Pohon pinus raksasa roboh menghantam teras pos pantau; batang dan tanah longsor mengunci pintu depan dari luar. “Baru aja kamu masuk, pohon pinus raksasa di teras roboh dihantam angin. Batang pohon dan tanah longsor nutup pintu depan dari luar.” | Slate/charcoal; kabut tebal; **empty POV — no foreground character**; batang pinus besar melintang rapat di depan kusen pintu. |
| **P03** (00:10.0–00:15.0) | Teras ambang pintu: Di sela-sela dahan pinus yang patah, terlihat siluet makhluk hitam berkaki panjang kurus yang bersarang di ambang teras, menghadap ke arah badai luar. “Tapi perhatiin: di sela dahan pohon itu, ada makhluk bertangan panjang kurus yang bersarang di ambang teras.” | Slate/cyan; **empty POV — no foreground character**; siluet monster bertekstur menyatu dengan dahan pinus. |
| **P04** (00:15.0–00:19.0) | Close-up kepala monster dari belakang dahan: Telinga runcing predator bergetar lembut, siaga mengarah ke dalam ruangan pos pantau. “Dia menghadap luar, tapi kupingnya siaga ke arah ruangan.” | Deep matte black; **empty POV — no foreground character**; telinga predator menangkap akustik ruangan. |
| **P05** (00:19.0–00:25.0) | Interior menghadap jendela kaca samping: Kilatan petir putih menyilaukan menerangi ruangan (Remotion flash overlay pada 00:20.0), disusul 3 detik kemudian dinding bergetar oleh gelegar guruh. “Di jendela, kilatan petir selalu disusul guruh keras tiga detik kemudian, bikin dinding bergetar.” | Slate/white flash ke charcoal; **empty POV — no foreground character**; interior kering, kilat di luar kaca. |
| **P06** (00:25.0–00:32.0) | Interior wide membentang dari tungku ke belakang: Di lantai dekat tungku batu tergeletak balok kayu jati solid; di dinding belakang tampak pintu darurat berpalang kayu tebal. “Di lantai dekat perapian, ada balok kayu jati tebal yang lepas. Dan di belakang, ada pintu darurat yang palang kayunya macet.” | Slate/grey; **empty POV — no foreground character**; balok jati di kiri bawah dan pintu berpalang di kanan atas tampak kontras. |
| **P07** (00:32.0–00:41.0) | Interior medium: Protagonis yang panik bergegas mengangkat balok kayu jati tebal, mendekati pintu darurat belakang. “Pintu depan tertutup monster. Instingmu: lari ke belakang, ambil balok kayu, dan hajar palangnya sekuat tenaga biar cepat lepas. Wajar, kan? Biar bisa langsung kabur.” | Slate bergeser ke amber; **protagonis tampak utuh membawa balok kayu jati**; postur tegang terburu-buru. |
| **P08** (00:41.0–00:47.0) | Interior close-up impact: Balok kayu jati menghantam palang pintu darurat dengan keras (*BRAK!*). Ruangan bergetar (Remotion `ImpactMicroShake`). “Tapi begitu balokmu menghantam kayu: BRAK! Suaranya memecah keheningan rumah.” | Warning red/amber; **empty POV — no foreground character**; serpihan kayu berhamburan dari titik benturan palang. |
| **P09** (00:47.0–00:54.0) | Interior sudut depan: Monster di ambang depan memutar lehernya ke belakang, matanya berkilat di sela dahan, melompat menerjang masuk ke dalam ruangan. “Monster di teras langsung mutar lehernya ke belakang. Dalam satu lompatan kilat, sosok hitam itu menerjang dari sela dahan.” | Harsh warning red; **empty POV — no foreground character**; siluet monster menerjang cepat ke arah kamera. |
| **P10** (00:54.0–00:59.6) | Interior aftermath noir: Siluet monster berdiri menjulang di atas tubuh protagonis yang terhempas tak bergerak di lantai kayu; bayangan hitam pekat tanpa detail darah. “Sebelum kamu sempat noleh, cakarnya menghantam telak. Kamu terpental ke lantai kayu, dan pandanganmu gelap.” | Deep noir crimson; **protagonis terbaring tak bergerak di lantai**; filter-safe noir styling, zero gore keywords. Hold hingga 00:59.6. Transisi rewind 00:59.6–01:00.0. |
| **P11** (01:00.0–01:06.0) | Interior reset pasca-rewind: Palet kembali ke slate dingin. Protagonis berdiri membeku memegang balok kayu jati di dekat tungku, menatap pintu darurat. “Balik lagi. Jangan pernah hantam palangnya sembarangan.” | Slate/cyan mist; **protagonis tampak dari samping memegang balok jati**; hening 1.6 s pasca-rewind. |
| **P12** (01:06.0–01:13.0) | Interior sudut ambang depan: Dahan pinus lebat menutupi pandangan langsung dari teras ke dalam rumah, namun telinga monster tetap tegak. “Monster itu nggak bisa lihat ke dalam karena tertutup dahan, tapi dia peka banget sama suara dentuman.” | Deep slate/black; **empty POV — no foreground character**; rimbunnya jarum pinus menghalangi pandangan visual monster. |
| **P13** (01:13.0–01:18.0) | Interior close-up palang pintu darurat: Braket besi karatan mencengkeram palang kayu tebal; mustahil dilepas dengan tangan kosong tanpa hantaman balok. “Satu-satunya jalan ya pintu darurat, dan palangnya harus dihantam balok.” | Slate/charcoal; **empty POV — no foreground character**; palang kayu kokoh menuntut benturan keras. |
| **P14** (01:18.0–01:22.0) | Interior medium: Protagonis menoleh ke arah jendela samping yang basah oleh air hujan badai; mata menyipit menyadari strategi. “Kuncinya: manfaatin suara badai.” | Slate/grey; **protagonis tampak jelas dari profil samping**; refleksi badai di kaca jendela. |
| **P15** (01:22.0–01:26.0) | Interior close-up tangan: Tangan protagonis mencengkeram erat balok kayu jati, mengendap-endap mendekati pintu belakang tanpa derit langkah. “Ambil balok kayu jati tadi.” | Slate/charcoal; **close-up tangan protagonis** menggenggam balok kayu jati solid. |
| **P16** (01:26.0–01:30.0) | Interior full shot: Protagonis berdiri di depan pintu darurat belakang, mengangkat balok kayu di atas bahu, siap mengayun. “Dekati pintu belakang pelan-pelan.” | Slate/charcoal; **protagonis tampak utuh dalam pose siap memukul**; balok terangkat stabil. |
| **P17** (01:30.0–01:35.0) | Interior sudut over-the-shoulder: Pandangan protagonis tertuju lurus ke arah jendela samping, menanti kilatan petir di langit gelap. “Tatap jendela samping. Tunggu kilatan petir.” | Slate/dark blue; **blurred foreground silhouette bahu protagonis**; jendela kaca di latar belakang. |
| **P18** (01:35.0–01:43.0) | Interior dramatis: Kilat menyala putih benderang di luar jendela pada 01:36.0 (Remotion lightning flash overlay). Protagonis menghitung mundur dalam keheningan tegang. “Kilat menyala! Satu... dua... tiga...” | High contrast white/slate; **protagonis mematung menghitung mundur**; kilat menerangi ruangan. |
| **P19** (01:43.0–01:49.0) | Interior impact simultan: Tepat saat guruh raksasa meledak mengguncang pos pantau, balok kayu jati menghantam palang pintu sekuat tenaga (*KABOOM + BRAK!*). Remotion `ImpactMicroShake`. “GURUH MENGGELEGAR! Di detik yang sama: BRAK! Hantam palang kayunya keras-keras!” | Harsh slate/flash; **empty POV — no foreground character**; palang kayu retak dan patah di bawah getaran guruh. |
| **P20** (01:49.0–01:54.0) | Interior medium close: Serpihan palang kayu patah jatuh ke lantai; suara benturan tertelan 100% oleh gemuruh guruh yang memekakkan telinga di seluruh lembah. “Suara hantaman balokmu tenggelam total di balik gemuruh petir.” | Slate/grey; **empty POV — no foreground character**; palang pintu patah tergantung bebas. |
| **P21** (01:54.0–02:02.0) | Eksterior/teras sudut dahan: Monster di ambang depan tetap duduk tenang di sarang dahan pinus, tidak bereaksi karena mengira dentuman berasal dari petir. Dread silence 2.0 s (01:55.0–01:57.0). “Diam dulu dua detik sampai guruh reda. Monster di depan tetap tenang di sarangnya.” | Slate/black; **empty POV — no foreground character**; monster tetap menghadap keluar ke arah badai. |
| **P22** (02:02.0–02:09.0) | Interior/eksterior pintu darurat: Protagonis mendorong daun pintu belakang yang sudah bebas palang; udara dingin tebing dan hujan menyapu masuk. “Palang pintu sudah patah. Dorong pintu daruratnya keluar.” | Slate/mist; **protagonis mendorong pintu keluar**; jalan setapak tebing terlihat di luar. |
| **P23** (02:09.0–02:19.0) | Eksterior wide tebing: Protagonis berlari kencang menuruni jalan setapak tebing berbatu di tengah hujan badai, menjauh dari reruntuhan pos pantau. “Lari menyusuri jalan setapak tebing, tembus badai.” | Slate/foggy blue; **protagonis berlari membelakangi kamera**; tebing curam dan pohon pinus di sekeliling. |
| **P24** (02:19.0–02:34.0) | Eksterior atmosferik wide: Pos pantau tua dengan pohon tumbang di terasnya tampak mengecil di kejauhan di balik kabut tebal dan deru badai. Cut to black pada 02:34.0. “Kamu berhasil lolos hidup-hidup.” | Deep slate/mist; **empty POV — no foreground character**; pondok sunyi di puncak tebing. Clean blackout tail. |

---

## Production and Review Handoff

- **Audio Producer (Agent 02):** Gunakan naskah [narasi.txt](narasi.txt) (252 kata). Generate dalam satu kali ShortZ `gemini-3.8-flash-tts` dengan suara Investigator. Siapkan jeda keheningan yang bersih pada timeline 02:34.0 (154.0 s): 0.4 s rewind (00:59.6–01:00.0), 1.6 s silence pasca-rewind (01:00.0–01:01.6), countdown 3 detik sinkron guruh (01:37.0–01:40.0), dan 2.0 s dread silence pasca-guruh (01:55.0–01:57.0) tanpa mempercepat vocal speed.
- **Image Generator (Agent 03):** Rujuk 24 spesifikasi panel di atas dengan gaya Urban Silhouette Noir (matte `#07080B`, tepi siluet tegas, palet slate/charcoal/petir dingin, aksen warning red hanya di P08–P10). Panel P10 adalah siluet aftermath noir bersih tanpa darah/gore agar lolos filter safety API. Siapkan plate bersih tanpa melukis hujan vertikal di dalam ruangan (hujan hanya di luar).
- **Remotion Assembler (Agent 04):** Komposisi `Skenario02RumahTengahHutan` (1080 × 1920, 30 fps), durasi timeline **02:34.0 (154.0 s / 4620 frame)**, `pipelineVersion: 2`, `schemaVersion: 2`. Terapkan overlay lightning flash di P05 dan P18, `ImpactMicroShake` lateral di P08 dan P19, serta transisi rewind 0.4 s di 00:59.6.
