# Standalone Scenario 03 — Goyangan Dek Enam

**Status: ready.** Showrunner brief and script completed for Scenario 03 ("Goyangan Dek Enam"). 263-word localized Bahasa Bayi narration in `narasi.txt`, Fair-Play Clue Ledger fully planted in P01–P06 before 00:31, filter-safe noir aftermath in P09–P10, and 24-panel single-frame layout strictly aligned to a 02:34.0 (154.0 s) timeline. Simplified everyday Indonesian terms applied (no maritime/mechanical jargon). Ready for review before handoff to Agent 02 (Audio Producer) and Agent 03 (Image Generator).

---

## Standalone Scenario

- **Collection:** [Skenario Bertahan](../../arcs/02-skenario-bertahan/arc.json), Scenario 03. Independent cruise ship midnight ocean setting, fresh survivor silhouette, and unique pendulum inertia / ship-roll physical survival puzzle; zero continuity or characters from Arc 01, Pilot 01, or Scenario 02.
- **Premise:** Seorang penumpang kapal terjebak di lorong luar kapal di Dek 6 saat kapal pesiar berlayar di tengah samudra malam dalam cuaca badai. Pintu akses ke lorong kabin dalam telah digembok rantai badai dari luar demi keamanan cuaca. Kapal mengalami kemiringan oleng (*roll* berkala 7 derajat ke kiri dan kanan setiap lima detik) dihempas gelombang ombak. Sesosok entitas bayangan anomali berdiri di lorong luar yang sempit, memojokkan survivor ke arah pagar pembatas luar. Di tengah samudra lepas, tidak ada jalan untuk kabur. Insting manusiawi survivor yang panik adalah menyambar jaket pelampung oranye di dinding dan melompat ke laut, namun kecepatan kapal 18 knot menciptakan pusaran arus hisap baling-baling raksasa di bawah kapal yang langsung menelan siapapun yang melompat ke ombak gelap. Kuncinya: survivor menyadari hukum fisika bandul gravitasi kapal—semua benda gantung (deretan jaket pelampung, kabel kawat sekoci) berayun serentak barengan mengikuti goyangan kapal, sementara entitas tersebut berdiri tegak kaku melawan gravitasi karena meniru postur manusia. Survivor memancing entitas masuk ke celah sempit di balik badan sekoci seberat 3 ton; saat genangan air dek menandai puncak kemiringan kapal, survivor menarik tuas rem sekoci. Sekoci berayun kencang menghantam dan menjepit entitas ke dinding besi, lalu survivor menancapkan besi pengunci ke roda katrol, menguncinya permanen hingga fajar tiba.
- **Opening State:** Tengah malam badai di samudra lepas. Lorong luar kapal basah oleh tempias air hujan dan kabut laut. Pintu kabin digembok rantai dari luar; kapal oleng kiri-kanan tiap 5 detik. Lima detail terlihat di pembuka: (1) pintu kabin digembok rantai badai, (2) deretan jaket pelampung oranye dan kabel sekoci yang berayun barengan, (3) rambu peringatan bahaya pusaran baling-baling di pagar pembatas, (4) tuas rem sekoci dengan besi pengunci di dekat tiang sekoci, dan (5) genangan air di lantai yang mengalir bolak-balik teratur.
- **Resolution (Non-Escape / Trapping):** Survivor memanfaatkan siklus oleng kapal dan fisika bandul gravitasi. Menarik tuas rem sekoci tepat di puncak kemiringan kapal, membiarkan sekoci 3 ton berayun kencang menghantam entitas ke dinding besi (*BRAK!*), lalu menancapkan besi pengunci ke roda katrol (*KLIK!*). Entitas terjepit tak berdaya di balik badan sekoci; survivor duduk di lantai dek menanti matahari terbit.
- **Runtime and Count:** Target **145–160 s** (timeline terukur: **02:34.0 / 154.0 s**), narasi [narasi.txt](narasi.txt) berjumlah **263 kata** dalam Bahasa Bayi santai, dibawakan oleh narator tunggal Investigator (~1.7 kata/detik) dengan jeda terencana: 0.4 s rewind, 1.6 s post-rewind dread silence, 2.0 s dread silence pasca-jepitan sekoci, serta 4.0 s blackout tail.
- **Assembly Intent:** Proposed composition `Skenario03GoyanganDekEnam`, 1080 × 1920, 30 fps; manifest `pipelineVersion: 2`, `schemaVersion: 2`, `art.styleId: urban-silhouette-noir`, `script.format: decision-consequence`, `script.engine: branch-rewind`.
- **Remotion 2.5D Plate Prep & Procedural Effects:**
  1. **Outdoor-Only Sea Rain & Mist Overlay (`P01`–`P24`):** Partikel rintik hujan miring dan kabut laut dingin menyapu sepanjang lorong luar kapal.
  2. **Camera Roll Oscillation (`P01`–`P24`):** Efek rotasi kamera dinamis halus `±2–3°` bolak-balik setiap 5 detik untuk mensimulasikan kemiringan oleng kapal di tengah ombak.
  3. **ImpactMicroShake (`P19`):** Getaran kamera lateral `±6–8 px` jitter pada frame hantaman sekoci seberat 3 ton ke dinding besi.
  4. **Branch-Rewind Glitch Overlay (`P10` → `P11`):** Transisi 0.4 s `branchRewind` (00:59.6–01:00.0) menggunakan efek scanline tape snap, chromatic aberration glitch, dan reverse whoosh.

---

## Draft Silhouette Profile

**Protagonist (Survivor):**
- Penumpang kapal usia 20-an, tinggi 165–170 cm, postur sigap.
- Busana: Jaket *windbreaker* gelap tahan angin laut dengan tudung kepala (*hoodie*), celana kargo gelap basah, dan sepatu bertapak karet anti-selip.
- Siluet Urban Silhouette Noir: Matte `#07080B`, garis luar siluet tegas dengan aksen *rim light* dingin dari lampu natrium dek dan percikan buih laut; wajah siluet polos tanpa detail mata atau hidung.

**Entity ("Siluet Anomali Dek"):**
- Sosok humanoid gelap jangkung tak berwajah yang menyusup ke lorong luar kapal pesiar.
- Karakteristik: Meniru postur berdiri tegak manusia dan bentuk jaket pelampung gantung di dinding besi.
- Cacat Fisik / Kelemahan Non-Audio: Karena meniru postur manusia yang berpijak kaku di lantai, tubuhnya melawan gravitasi dan tetap tegak lurus (`berdiri tegak`), kontras dengan seluruh objek gantung di kapal yang berayun bebas mengikuti kemiringan oleng kapal.

---

## Spatial & Camera Layout

**Lorong Luar Kapal (Dek 6):**
- Koridor dek terbuka berlantai pelat besi bermotif selebar 3 meter, memanjang di sisi luar kapal pesiar.
- **Sisi Dalam (Dinding Besi Kapal):** Dinding besi putih kusam dengan deretan jendela bulat kapal tertutup rapat. Pintu geser menuju lorong kabin dalam tertutup dan terikat rantai besi tebal berkarat dengan gembok badai (`pintu digembok rantai`). Di sampingnya, tergantung berjejer belasan jaket pelampung oranye pada kait dinding.
- **Sisi Luar (Pagar Pembatas & Laut Lepas):** Pagar teralis besi setinggi dada menghadap langsung ke samudra hitam lepas. Terpasang papan peringatan bahaya: *"BAHAYA PUSARAN BALING-BALING — JANGAN MELOMPAT SAAT KAPAL BERLAYAR"*. Di bawahnya terbentang ombak gelap dan pusaran arus kapal yang melaju kencang membelah laut.
- **Area Atas (Tiang & Sekoci Penyelamat):** Di atas kepala, tergantung sekoci penyelamat darurat oranye-gelap seberat 3 ton pada tiang gantungan besi. Tali kabel sekoci menjulur ke unit katrol manual di lantai yang dilengkapi tuas rem sekoci dan besi pengunci pada roda katrol.
- **Area Lantai:** Genangan air hujan mengalir bolak-balik dari sisi dinding ke sisi pagar secara teratur setiap 5 detik mengikuti goyangan kapal.

**Sightlines & Sudut Kamera:**
- Kamera sudut lorong luar memperlihatkan perspektif memanjang: deretan jaket pelampung oranye di kiri, tiang dan sekoci gantung di atas, dan pagar laut di kanan.
- Sudut kamera berorientasi tunggal: setiap panel adalah **komposisi tunggal satu frame (single-frame composition)** tanpa pembagian layar (split-screen) atau montase.
- Ketentuan `empty POV — no foreground character in frame` diterapkan di setiap panel di mana figur protagonis sudah tampak utuh atau berada di luar sudut bidik kamera guna mencegah duplikasi figur latar depan yang buram.

---

## Script, Decision, and Fair Play

**Opening (00:00.0–00:31.0):** “Kapalnya terus oleng, tapi bayangan di depanmu berdiri tegak.” Pembuka langsung menghujam bahaya spesifik episode dalam 3 detik tanpa klise “Salah gerak, tamat”. Pintu kabin terkunci rantai badai, kapal oleng tiap 5 detik, genangan air mengalir teratur, jaket pelampung dan kabel sekoci berayun barengan, tuas rem sekoci berbesi pengunci terlihat di dekat tiang, dan rambu bahaya pusaran baling-baling kapal terpampang di pagar. Seluruh 5 petunjuk fisik ditanamkan tuntas dalam 31 detik pertama.

**Bad Branch (00:31.0–01:00.0):** Sosok hitam melangkah pelan di lorong sempit, memojokkan survivor ke pagar pembatas. Jalan mundur habis, pintu kabin terkunci mati. Insting panik paling wajar: menyambar jaket pelampung di dinding dan nekat melompat ke laut untuk berenang. Begitu tubuh menyentuh ombak gelap, pusaran baling-baling kapal yang melaju kencang langsung menyedot tubuhnya ke bawah kapal. Dalam 3 detik, tubuhnya lenyap ditelan ombak gelap (filter-safe noir aftermath, zero gore keywords). Layar menggelap. Transisi `branchRewind` 0.4 s (00:59.6–01:00.0) mengembalikan waktu ke saat survivor berdiri di depan pagar.

**Survival Branch (01:00.0–02:34.0):** Balik lagi. Jangan pernah melompat ke laut saat kapal berlayar. Perhatikan sekeliling: semua benda gantung di kapal ikut berayun mengikuti ombak, hanya sosok itu yang berdiri tegak melawan gravitasi. Kuncinya: manfaatkan beban sekoci 3 ton di tiang atasmu. Survivor memancing sosok itu masuk ke celah sempit di balik badan sekoci. Memperhatikan genangan air di dek yang mulai mengalir deras ke kanan menandai puncak kemiringan kapal—tepat pada detik itu, survivor menarik tuas rem sekoci sekuat tenaga! Sekoci 3 ton terlepas, mengayun kencang dan *BRAK!* menghantam tubuh entitas telak ke dinding besi. Sebelum sekoci mantul balik lagi, survivor langsung menancapkan besi pengunci ke roda katrol (*KLIK!*). Besi terkunci mati, entitas terjepit rapat di balik badan sekoci tanpa celah gerak. Survivor duduk di lantai dek mengatur napas hingga fajar menyingsing.

---

### Fair-Play Clue Ledger

Seluruh 5 petunjuk fisik ditanamkan secara natural pada panel P01–P06 sebelum 00:31:

| ID | Panel & Detail Spoken Alami (Setup P01–P06) | Payoff (Bad Outcome atau Smart Escape) |
| --- | --- | --- |
| **C1 — Pintu Kabin Digembok Rantai Badai** | **P03 (00:10.0–00:15.0):** Pintu masuk ke lorong kabin terkunci rapat oleh rantai besi dan gembok badai dari luar. “Pintu masuk ke lorong kabin digembok rantai dari luar karena badai.” | **P07–P08 (00:31.0–00:47.0):** Menjelaskan mengapa survivor terpojok di lorong luar sempit tanpa jalan mundur ke dalam kabin kapal. |
| **C2 — Jaket Pelampung & Kabel Sekoci Berayun Barengan** | **P04 (00:15.0–00:20.0):** Di dinding besi, deretan jaket pelampung oranye dan kabel sekoci berayun barengan mengikuti kemiringan oleng kapal. “Di dinding, deretan jaket pelampung berayun barengan sama kabel sekoci.” | **P12–P13 (01:06.0–01:19.0):** Menjadi kunci visual utama untuk mendeteksi entitas imposter yang berdiri tegak melawan gravitasi bumi. |
| **C3 — Rambu Bahaya Pusaran Baling-Baling Kapal** | **P06 (00:25.0–00:31.0):** Papan peringatan bahaya di pagar pembatas: pusaran baling-baling kapal bakal menyedot apapun yang melompat ke laut. “Di pagar pembatas, ada tanda bahaya: pusaran baling-baling kapal bakal nyedot apapun yang lompat ke laut.” | **P09–P10 (00:47.0–00:59.6):** Menjadi penyebab fisik kematian fatal survivor saat nekat melompat ke laut di bad branch. |
| **C4 — Tuas Rem Sekoci & Besi Pengunci di Tiang Sekoci** | **P05 (00:20.0–00:25.0):** Tuas rem tangan di dekat tiang sekoci dengan besi pengunci tebal di sampingnya. “Di dekat tiang sekoci, ada tuas rem dengan besi pengunci.” | **P18–P21 (01:42.0–02:08.0):** Menjadi alat eksekusi utama untuk melepaskan ayunan sekoci 3 ton dan menguncinya permanen saat menjepit entitas. |
| **C5 — Genangan Air Dek Bolak-Balik Teratur (Ritme 5 Detik)** | **P04 (00:15.0–00:20.0):** Genangan air hujan di lantai dek mengalir bolak-balik teratur tiap 5 detik mengikuti oleng ombak kapal. “Genangan air di lantai bolak-balik teratur.” | **P16–P17 (01:31.0–01:42.0):** Menjadi indikator *timing real-time* bagi survivor untuk menarik tuas rem tepat saat kapal mencapai puncak kemiringan. |

---

## Audio Handoff and Mandatory Cue Sheet

Narator Investigator adalah satu-satunya pencerita (*white captions* tanpa label `NARATOR`). Seluruh SFX dunia kapal dan keheningan terencana ditempatkan presisi pada timeline terukur **02:34.0 (154.0 s)**:

| Waktu Terukur | Aset / Cue Type | Perlakuan Akustik | Mix & Pacing Rule |
| --- | --- | --- | --- |
| 00:00.0–00:04.0 | Judul `GOYANGAN DEK ENAM`, deru angin samudra malam, deburan ombak membentur bawah kapal | Ambien eksterior basah samudra | Level ambien −22 LUFS; hook 3 detik langsung menghentak; cover TikTok pada 00:00.2. |
| 00:04.0–00:10.0 | Suara decit struktur besi kapal berayun (*creak-groan*), deru mesin kapal di lambung bawah | Low-frequency mechanical drone | Menegaskan ritme kemiringan oleng kapal tiap 5 detik di P02. |
| 00:10.0–00:15.0 | Gemerincing rantai besi basah dan benturan gembok besi ke daun pintu (*clink-clank*) | Foley logam dingin | Menegaskan pintu lorong kabin terkunci rantai dari luar di P03. |
| 00:15.0–00:20.0 | Gemercik air mengalir di lantai besi (*slosh-swish*), gesekan jaket pelampung berayun | Foley air bolak-balik & gesekan kain | Menanamkan ritme genangan air dan ayunan pelampung barengan di P04. |
| 00:20.0–00:25.0 | Dentang logam berat pada roda katrol sekoci, derit kabel kawat penahan | Foley katrol mekanis basah | Menunjukkan tuas rem sekoci dan besi pengunci di P05. |
| 00:25.0–00:31.0 | Gemuruh arus pusaran air di bawah kapal (*deep water churn*), angin kencang menerpa pagar | Deep sub churn & wind whistle | Menegaskan rambu bahaya hisapan baling-baling kapal di P06. |
| 00:31.0–00:38.0 | Langkah kaki basah mendekat lambat di pelat besi (*wet thud-step*), gesekan udara dingin | Eerie quiet approach | Membangun kepanikan terpojok di lorong luar yang sempit di P07. |
| 00:38.0–00:47.0 | Suara sentakan jaket pelampung ditarik dari dinding, derit langkah tergesa ke pagar | Tense foley, napas terengah | Survivor panik bersiap melompat ke laut di P08. |
| 00:47.0–00:53.0 | Dentuman deburan air laut (*SPLASH-CRASH*), disusul raungan hisapan baling-baling (*UNDERWATER ROAR*) | Harsh underwater vortex suction | Peringatan bahaya terbukti nyata di P09; pencahayaan red noir. |
| 00:53.0–00:59.6 | Buih ombak gelap berputar meredam suara, keheningan pekat laut samudra | Distorsi red noir aftermath | Tubuh lenyap ditelan ombak gelap di P10. Narasi selesai pada 00:58.0; hold visual hingga 00:59.6. |
| 00:59.6–01:00.0 | `branchRewind` tape snap / chromatic reverse glitch | Efek transisi non-diegetik | Tepat 0.4 detik; memutar balik waktu ke pilihan awal. |
| 01:00.0–01:01.6 | **1.6 s Post-Rewind Dread Silence** | Mute total ambien & vokal | Keheningan mutlak pasca-rewind di P11 sebelum instruksi selamat dimulai. |
| 01:01.6–01:13.0 | Desau angin laut dingin, derit ritmis kabel kawat sekoci berayun teratur | Cold exterior ship ambience | Survivor menyadari ayunan seluruh benda gantung di P11–P12. |
| 01:13.0–01:24.0 | Langkah kaku bergeming di lantai, dengung berat sekoci gantung di atas kepala | Eerie stillness vs low engine hum | Membedakan entitas yang berdiri tegak (P13) dan beban sekoci 3 ton (P14). |
| 01:24.0–01:31.0 | Gesekan sepatu karet melangkah mundur hati-hati ke celah sempit di balik badan sekoci | Controlled wet foley | Survivor memancing entitas masuk ke jebakan sempit di P15. |
| 01:31.0–01:37.0 | Suara gemercik air dek mengalir deras ke kanan (*SWOOSH*), tangan mencengkeram tuas besi | Water rush & metal grip | Peringatan detik puncak kemiringan kapal di P16. |
| 01:37.0–01:42.0 | Derak struktur kapal mencapai kemiringan maksimal, bisik narator: *Sekarang!* | Tension peak, subtle riser | Menandai momen eksekusi pada 01:40.0 di P17. |
| 01:42.0–01:47.0 | Sentakan tuas besi ditarik sekuat tenaga (*CLACK-RATCHET!*) | Harsh mechanical release | Tuas rem sekoci ditarik di P18. |
| 01:47.0–01:54.0 | Desing kabel kawat terlepas bebas (*WHIRRR!*), disusul hantaman masif sekoci: *BRAK!* | Massive 3-ton metal impact | Hantaman sekoci menghancurkan ruang gerak entitas di P19; Remotion `ImpactMicroShake`. |
| 01:54.0–02:00.0 | Gesekan besi pengunci ditancapkan cepat ke roda katrol (*CLINK-SCRAPE*) | Fast metallic action | Survivor mengunci posisi sekoci di P20 sebelum mantul balik lagi. |
| 02:00.0–02:08.0 | Suara penguncian mekanis besi pengunci: *KLIK!*, dengusan tercekik entitas yang terjepit | Heavy mechanical lock sound | Besi pengunci terkunci mati di P21; entitas terjepit permanen. |
| 02:08.0–02:15.0 | **2.0 s Dread Silence** (02:09.0–02:11.0), deru angin laut malam, tarikan napas berat survivor | Atmospheric sea wind & heavy breath | Keheningan lega memastikan entitas tak berdaya di P22. |
| 02:15.0–02:22.0 | Deburan ombak stabil di bawah kapal, langkah lemas duduk bersandar ke dinding besi | Calming exterior ocean tone | Survivor duduk di dek menunggu fajar di P23. |
| 02:22.0–02:34.0 | Tension lift 3 s terakhir; 150 ms hening; 1 restrained low sub-hit pada cut to black | Sub-bass −14 LUFS, ≤ −1 dBTP | Potong bersih ke hitam (blackout) pada 02:34.0 tanpa teks sisa. |

---

## Panel Plan — Single-Frame Show-What-You-Say Lock

**24 panel 9:16 independen.** Format Urban Silhouette Noir (matte `#07080B`, palet abu-abu besi kapal, aksen lampu natrium/kabut cyan dingin; panel P08–P10 warning red/amber). Setiap panel adalah frame utuh tanpa pembagian layar. Penggunaan `empty POV — no foreground character in frame` diterapkan di setiap bidikan di mana figur karakter sudah terlihat utuh atau di luar sudut pandang kamera guna mencegah figur buram ganda.

| ID / Waktu Terukur | Subjek Frame & Jangkar Narasi | Palet, Sudut & Foreground Treatment |
| --- | --- | --- |
| **P01** (00:00.0–00:04.0) | Eksterior wide lorong luar kapal pesiar yang miring dihempas ombak samudra malam. Siluet protagonis berdiri tegap menatap ke depan koridor. “Kapalnya terus oleng, tapi bayangan di depanmu berdiri tegak.” | Slate/navy; kabut laut dingin; hujan rintik; **protagonis terlihat jelas dari belakang**. Judul `GOYANGAN DEK ENAM` (00:00.0–00:01.8, safe zone). Cover TikTok 00:00.2. |
| **P02** (00:04.0–00:10.0) | Lorong luar memanjang: Horizon laut di luar pagar tampak miring tajam memperlihatkan kapal oleng ke kiri lalu ke kanan secara teratur. “Di lorong luar kapal, ombak bikin kapal miring ke kiri dan kanan tiap lima detik.” | Charcoal/slate; kemiringan horizon `3°`; **empty POV — no foreground character**; lorong luar basah memanjang. |
| **P03** (00:10.0–00:15.0) | Dinding besi dalam: Pintu geser menuju lorong kabin tertutup rapat dan terikat rantai besi tebal berkarat dengan gembok gantung badai. “Pintu masuk ke lorong kabin digembok rantai dari luar karena badai.” | Deep slate/iron grey; **empty POV — no foreground character**; rantai besi melilit gagang pintu. |
| **P04** (00:15.0–00:20.0) | Sudut lantai dek dan dinding besi: Genangan air hujan mengalir bolak-balik di lantai pelat besi; di dinding, deretan jaket pelampung oranye berayun barengan bersama kabel sekoci di atasnya. “Genangan air di lantai bolak-balik teratur. Di dinding, deretan jaket pelampung berayun barengan sama kabel sekoci.” | Slate/cyan mist; **empty POV — no foreground character**; genangan air memantulkan lampu natrium; jaket pelampung miring serentak. |
| **P05** (00:20.0–00:25.0) | Tiang gantung sekoci: Di dekat tiang sekoci, tampak unit katrol manual dengan tuas rem tangan dan besi pengunci tebal pada dudukannya. “Di dekat tiang sekoci, ada tuas rem dengan besi pengunci.” | Charcoal/iron; **empty POV — no foreground character**; tuas rem sekoci dan besi pengunci tampak kontras tajam. |
| **P06** (00:25.0–00:31.0) | Pagar pembatas dek menghadap laut: Papan rambu darurat bergambar pusaran baling-baling kapal terpampang jelas di pagar; di bawahnya tampak deburan arus ombak gelap yang ganas. “Di pagar pembatas, ada tanda bahaya: pusaran baling-baling kapal bakal nyedot apapun yang lompat ke laut.” | Slate/dark navy; **empty POV — no foreground character**; rambu peringatan reflektif di pagar dan buih ombak gelap di bawah. |
| **P07** (00:31.0–00:38.0) | Lorong luar medium: Sosok siluet hitam jangkung melangkah pelan tanpa suara di lorong sempit, memojokkan protagonis ke arah pagar pembatas. “Sosok hitam itu melangkah pelan, memojokkan kamu ke pagar.” | Charcoal/shadow bergeser ke amber; **protagonis tampak terpojok memunggungi pagar**; siluet monster mendekat. |
| **P08** (00:38.0–00:47.0) | Pagar pembatas dramatis: Protagonis yang panik menyambar jaket pelampung oranye di dinding, menaiki teralis pagar pembatas bersiap melompat ke laut bebas. “Pintu kabin terkunci, jalan mundur habis. Instingmu: sambar jaket pelampung di dinding, lalu nekat lompat ke laut. Wajar, kan?” | Warning amber/red; **protagonis memanjat pagar memegang jaket pelampung**; ekspresi siluet tegang panik. |
| **P09** (00:47.0–00:53.0) | Samudra lepas sudut bawah (Bad Outcome): Siluet tubuh protagonis menghantam air laut dan langsung terpelintir ke bawah, tersedot ke dalam pusaran arus baling-baling raksasa di bawah kapal. “Tapi begitu nyebur ke ombak gelap: pusaran baling-baling langsung nyedot tubuhmu ke bawah kapal.” | Harsh warning red/black; **empty POV — no foreground character**; siluet tersedot ke pusaran bawah kapal. |
| **P10** (00:53.0–00:59.6) | Aftermath noir samudra: Permukaan laut berombak gelap pekat; siluet tubuh lenyap ditelan ombak gelap tanpa jejak darah (filter-safe noir). “Dalam tiga detik, kamu lenyap ditelan ombak gelap. Tamat.” | Deep noir crimson meredup ke hitam pekat; **empty POV — no foreground character**; ombak gelap berputar kosong. Hold hingga 00:59.6. Transisi rewind 00:59.6–01:00.0. |
| **P11** (01:00.0–01:06.0) | Reset pasca-rewind: Palet kembali ke slate dingin. Protagonis berdiri membeku di depan pagar dek, melepaskan cengkeraman dari pagar pembatas. 1.6 s dread silence pasca-rewind. “Balik lagi. Jangan pernah lompat ke laut saat kapal berlayar.” | Slate/navy mist; **protagonis tampak utuh berdiri mundur dari pagar**; hening 1.6 s pasca-rewind. |
| **P12** (01:06.0–01:13.0) | Medium dek memperhatikan lingkungan: Kamera menangkap deretan jaket pelampung dan kabel sekoci yang berayun 7 derajat ke kiri dan kanan seirama oleng kapal. “Perhatiin sekelilingmu lagi. Semua benda gantung ikut oleng karena ombak. Jaket pelampung berayun, kabel sekoci berayun.” | Slate/grey; **empty POV — no foreground character**; semua objek gantung berayun miring serentak barengan. |
| **P13** (01:13.0–01:19.0) | Medium shot entitas: Siluet entitas berdiri tegak lurus sempurna di atas dek yang miring, kakinya terpancang kaku melawan gravitasi kapal. “Cuma sosok itu yang berdiri tegak melawan gravitasi.” | Deep matte black/slate; **empty POV — no foreground character**; kontras visual postur tegak entitas di atas lantai dek yang miring. |
| **P14** (01:19.0–01:24.0) | Sudut rendah menghadap sekoci: Sekoci penyelamat oranye-gelap seberat 3 ton tergantung kokoh di tiang gantung tepat di atas kepala. “Kuncinya: manfaatin beban sekoci tiga ton di atasmu.” | Charcoal/steel; **empty POV — no foreground character**; massa berat sekoci 3 ton tampak dominan di tiang gantung. |
| **P15** (01:24.0–01:31.0) | Lorong celah sempit: Protagonis sengaja melangkah mundur, memancing entitas masuk ke celah sempit antara dinding besi dan badan sekoci. “Pancing sosok itu mendekat ke celah sempit di balik badan sekoci.” | Slate/shadow; **protagonis melangkah mundur ke celah sempit**; entitas mengikuti masuk ke titik jebakan. |
| **P16** (01:31.0–01:37.0) | Close-up tangan dan genangan air: Tangan protagonis mencengkeram erat tuas rem sekoci; di kakinya, air dek mulai mengalir deras ke kanan tanda kapal mulai oleng maksimal. “Tanganmu di tuas rem sekoci. Lihat genangan air: mulai ngalir deras ke kanan.” | Slate/charcoal; **close-up tangan protagonis** pada tuas rem; genangan air mengalir cepat di lantai pelat besi. |
| **P17** (01:37.0–01:42.0) | Sudut dramatis kemiringan: Garis lantai dek mencapai kemiringan puncak ke arah dinding besi kapal. “Kapal mencapai puncak kemiringan! Sekarang!” | High contrast slate/cyan; **protagonis dalam pose tegang bersiap menarik tuas**; kemiringan dek tampak ekstrem. |
| **P18** (01:42.0–01:47.0) | Action close-up tuas rem: Tangan protagonis menarik tuas rem sekoci sekuat tenaga ke bawah (*CLACK!*). “Tarik tuas rem sekuat tenaga!” | Slate/amber spark; **empty POV — no foreground character**; tuas rem terlepas dari penahan katrol. |
| **P19** (01:47.0–01:54.0) | Impact masif sekoci: Kabel kawat terlepas bebas, sekoci seberat 3 ton mengayun kencang mengikuti gravitasi dan—BRAK! Menghantam tubuh entitas telak ke dinding besi (Remotion `ImpactMicroShake`). “Kabel lepas, sekoci tiga ton mengayun dan—BRAK! Menghantam tubuhnya ke dinding besi!” | Harsh slate/flash; **empty POV — no foreground character**; badan sekoci menjepit siluet entitas ke dinding besi kapal. |
| **P20** (01:54.0–02:00.0) | Action close-up besi pengunci: Tangan protagonis dengan cepat menancapkan besi pengunci ke roda katrol sebelum sekoci sempat mantul balik lagi. “Sebelum sekoci mantul, langsung tancapkan besi pengunci ke roda katrol!” | Slate/iron; **close-up tangan protagonis** menancapkan pasak besi silinder ke celah roda katrol. |
| **P21** (02:00.0–02:08.0) | Medium shot jebakan terkunci: Besi pengunci terpasak mati (*KLIK!*). Sekoci 3 ton terkunci kaku menekan entitas rapat di balik badan sekoci tanpa celah sedikit pun. “KLIK! Besi terkunci. Sosok itu terjepit rapat di balik badan sekoci, nggak bisa bergerak.” | Slate/charcoal; **empty POV — no foreground character**; siluet entitas terjepit kokoh di balik badan sekoci oranye. |
| **P22** (02:08.0–02:15.0) | Atmosferik dek pasca-eksekusi: Dua detik keheningan mutlak (02:09.0–02:11.0). Protagonis berdiri mengatur napas memburu di samping sekoci yang menahan entitas tanpa celah. “Dua detik hening. Napasmu memburu. Sekoci menahannya tanpa ampun.” | Slate/mist; **protagonis tampak membungkuk mengatur napas** di samping sekoci pengunci; kabut laut menyapu tenang. |
| **P23** (02:15.0–02:22.0) | Medium shot rileks: Protagonis menarik napas lega, duduk bersandar di pelat besi lantai dek yang basah, menatap ke arah ufuk timur menanti fajar. “Tarik napas lega. Duduk di lantai dek, tunggu fajar tiba.” | Slate/soft amber horizon; **protagonis duduk bersandar di lantai dek**; postur santai lega. |
| **P24** (02:22.0–02:34.0) | Eksterior wide kapal pesiar: Kapal pesiar membelah samudra gelap malam di kejauhan dengan lampu-lampu lambung yang tenang; deburan ombak berangsur stabil menuju fajar. Cut to black pada 02:34.0. “Kamu berhasil bertahan hidup.” | Deep navy/slate; **empty POV — no foreground character**; siluet megah kapal pesiar berlayar aman di tengah laut. Clean blackout tail. |

---

## Production and Review Handoff

- **Audio Producer (Agent 02):** Gunakan naskah [narasi.txt](narasi.txt) (263 kata). Generate dalam satu kali ShortZ `gemini-3.8-flash-tts` dengan suara Investigator. Siapkan jeda keheningan yang bersih pada timeline 02:34.0 (154.0 s): 0.4 s rewind (00:59.6–01:00.0), 1.6 s silence pasca-rewind (01:00.0–01:01.6), dan 2.0 s dread silence pasca-jepitan sekoci (02:09.0–02:11.0) tanpa mempercepat vocal speed.
- **Image Generator (Agent 03):** Rujuk 24 spesifikasi panel di atas dengan gaya Urban Silhouette Noir (matte `#07080B`, tepi siluet tegas, palet slate/charcoal/navy mist dingin, aksen warning red hanya di P08–P10). Panel P10 adalah siluet aftermath noir bersih tanpa darah/gore agar lolos filter safety API. Siapkan plate bersih untuk lorong luar kapal yang basah dengan pencahayaan natrium kapal.
- **Remotion Assembler (Agent 04):** Komposisi `Skenario03GoyanganDekEnam` (1080 × 1920, 30 fps), durasi timeline **02:34.0 (154.0 s / 4620 frame)**, `pipelineVersion: 2`, `schemaVersion: 2`. Terapkan overlay rain/sea-mist di seluruh panel luar ruangan, osilasi rotasi kamera dinamis `±2–3°` tiap 5 detik untuk mensimulasikan kapal oleng, `ImpactMicroShake` lateral di P19, serta transisi rewind 0.4 s di 00:59.6.
