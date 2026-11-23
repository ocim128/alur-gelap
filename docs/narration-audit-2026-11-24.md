# Audit narasi Studio v2 - 24 November 2026

## Lingkup dan bukti

Keluhan pemilik: tanda baca dan pembawaan cerita terasa berlebihan, tidak jelas, dan asing untuk pendengar Indonesia. Audit ini membaca `episodes/001-kamar-terkunci/narasi.txt` sampai `episodes/006-bioskop-tanpa-pintu/narasi.txt`, kontrak penulisan dan audio, kode ShortZ lokal, serta berkas produksi 006. Fokusnya 006 karena skenario terbaru; bukan asumsi bahwa keluhan hanya tentang episode itu. Penilaian bahasa di bawah adalah pembacaan penulis, bukan survei warga Indonesia atau penilaian pendengar independen. **listening review: none**; audio tidak diputar dalam audit ini.

## Temuan

1. **Terlalu banyak potongan pendek, terutama 004-006.** Hitung perkiraan dengan memisah kalimat pada `.`, `!`, atau `?` dan menghitung kata berhuruf/angka, termasuk kata berulang bertanda hubung sebagai satu. Hasil: 004 = 56 segmen, 30 berisi paling banyak empat kata; 005 = 61 segmen, 37; 006 = 59 segmen, 41. Pada 006 ada 59 titik dan lima koma untuk 227 kata. Ini sinyal untuk ditinjau, bukan batas kualitas otomatis. Koma tidak berlebihan secara jumlah pada 006; isu utamanya rangkaian titik dan fragmen. Cara TTS mengucapkannya tetap harus didengar.
2. **Urutan panel sering terasa seperti daftar instruksi.** Di 006: "Ranto naik ke panggung. Dia dorong kain layar. Kainnya berat. Lututnya hampir lemas. Dia dorong lagi pakai bahu." Rangkaian ini punya aksi yang bisa dipahami, tetapi pola subjek-aksi berulang memutus aliran cerita. "Kakinya udah lewat ambang" juga terdengar kaku dan belum menjelaskan dengan cepat bahwa dia sudah telanjur melangkah ke ruang kosong.
3. **Motif dan geografi bisa membingungkan.** "Pesannya ke anaknya cuma satu. Ikutin cahayanya" belum jelas sebagai pesan siapa kepada siapa atau mengapa kalimat itu wajar diucapkan. Hook "Bioskop ini nggak punya pintu" secara harfiah bertabrakan dengan pintu balkon, pintu merah dan pintu darurat di cerita; mungkin maksudnya tidak ada pintu yang membawa keluar. Ini masalah konsep dan penyusunan kalimat, bukan masalah tanda baca semata. Hook pengganti harus tetap diuji terhadap gambar dan batas maksimal 6 kata / 3 detik.
4. **Instruksi produksi memberi tekanan ke arah stakato.** Kontrak showrunner meminta kalimat pendek, beat per panel, satu aksi per kalimat untuk anchor efek tertentu, pola tiga rewind dan motif berulang. Semua punya tujuan, tetapi jika diterapkan ke setiap kalimat bersamaan, penulis dapat terdorong menyusun daftar aksi. Ini inferensi dari aturan dan teks, bukan bukti proses berpikir penulis. Aturan satu aksi hanya berlaku pada kalimat yang menjadi anchor transient SFX; tidak perlu digeneralisasi ke seluruh narasi.
5. **Persetujuan suara bukan bukti kualitas pembawaan.** Keputusan pemilik otomatis menerima suara Investigator; itu tidak menghapus kebutuhan mencatat apakah pembawaan, jeda dan sambungan pernah didengar. ASR membandingkan kata, dan verifikasi PCM membuktikan hal teknis, bukan kewajaran intonasi atau cerita.

## Contoh perbaikan untuk dibahas

Contoh ini bukan naskah final atau pengganti `narasi.txt`. Kalimat perlu dicocokkan dengan gambar, hitungan kata, hook, reset dan TTS sebelum dipakai.

| Sebelumnya | Arah revisi | Alasan |
| --- | --- | --- |
| "Di bawah, baris kursi nambah sendiri. Makin dekat ke balkon." | "Di bawah, barisan kursi terus bertambah dan makin dekat ke balkon." | Hubungkan perubahan dengan arah ancamannya. |
| "Pintu kebuka. Di baliknya, studio yang sama. Lantainya hilang. Ranto jatuh. Tamat." | "Pintunya terbuka ke ruang yang sama, tapi tak ada lantai di baliknya. Ranto jatuh. Tamat." | Hubungan pintu, ruang kosong dan jatuh lebih jelas; akhir loop tetap terpisah. |
| "Kakinya udah lewat ambang. Dia jatuh. Tamat." | "Ranto telanjur melangkah ke ruang kosong dan jatuh. Tamat." | Ganti bahasa spasial yang kaku dengan akibat yang langsung terbaca; pastikan panel memang menunjukkan ruang kosong. |
| "Ranto naik ke panggung. Dia dorong kain layar. Kainnya berat. Lututnya hampir lemas. Dia dorong lagi pakai bahu." | "Ranto naik ke panggung dan mendorong kain layar. Kainnya berat, sampai lututnya hampir lemas. Dia coba lagi pakai bahu." | Satukan aksi yang terkait, tetapi simpan momen usaha kedua. Diksi `mendorong` bisa diganti `dorong` jika lebih enak saat dibacakan. |
| "Ranto belok kanan. Dia nunduk lewat bawah pintu. Udara dingin kena mukanya." | "Ranto belok kanan dan nunduk lewat bawah pintu besi. Udara dingin langsung kena mukanya." | Aksi mengalir, tempatnya jelas; efek kata `langsung` tetap perlu diuji saat dibaca. |

Untuk motif anak, tetapkan dahulu situasi dan maksud pesan secara masuk akal, lalu tulis ulang sesuai fakta itu; jangan menciptakan riwayat baru hanya untuk mempertahankan tiga pengulangan. Untuk hook, "Pintu keluar bioskop ini palsu" adalah hipotesis lima kata yang perlu diuji terhadap seluruh cerita dan hook audio; bukan fakta yang sudah disetujui atau klaim durasi.

## Bagaimana naskah menjadi audio

1. Per [kontrak showrunner](../agents/01-showrunner.md), peran 01 menulis cerita, brief dan `narasi.txt`; dokumen ini adalah instruksi untuk pekerjaan manusia/agen, bukan generator naskah otomatis yang berjalan sendiri. Audit tidak menemukan bukti prompt atau proses persis saat naskah 006 ditulis, sehingga asal tiap pilihan kata tidak dapat dipastikan.
2. Per [kontrak audio](../agents/02-audio-producer.md), satu pemanggilan ShortZ mengirim seluruh naskah dengan `gemini-3.8-flash-tts` dan Investigator. Dalam kode ShortZ lokal `src/core/tts/chunks.ts`, teks dipecah berdasarkan tanda akhir kalimat lalu dikelompokkan maksimum tiga kalimat dan 300 karakter; whitespace termasuk paragraf diratakan. Sintesis dilakukan per chunk, lalu hasilnya disambung. [Laporan 006](../episodes/006-bioskop-tanpa-pintu/narration-investigator-report.json) mencatat 20 chunk, 4 verified dan 16 failed, dengan durasi rencana 140,98 detik. Status gagal mencakup berbagai flag ASR, timing dan kecepatan; bukan bukti bahwa 16 chunk terdengar salah. Isi laporan perlu diklasifikasikan dan bagian yang dicurigai perlu didengar.
3. [Konfigurasi 006](../episodes/006-bioskop-tanpa-pintu/narration-prep.json) merencanakan pemangkasan jeda antarkata di atas 0,9 detik menjadi 0,55 detik, kecuali bagian yang dilindungi, dan mengganti tiga jeda rewind. [Skrip persiapan](../scripts/prepare-narration.mjs) menghitungnya dari timestamp; kandidat potongan bukan otomatis sunyi secara perseptual. Ini konfigurasi rencana: audit ini tidak menetapkan bahwa konfigurasi tersebut sudah diterapkan pada master 006 yang baru. Periksa `tighteningCuts` di peta yang benar dan dengarkan sebelum/sesudah bila tersedia.
4. Rough cut 006 adalah jalur lain: [skrip scratch](../scripts/build-bioskop-rough-audio.py) memecah pada paragraf, membuat eSpeak Indonesia per panel, lalu memakai FFmpeg `atempo` untuk mencocokkan durasi sementara. Hasil scratch tidak mewakili performa final Investigator. Produksi tetap mengikuti larangan mengubah kecepatan vokal untuk memenuhi durasi.

## Tindak lanjut

- Pada draft berikutnya, baca utuh dengan suara keras: jaga hubungan sebab-akibat, variasikan panjang kalimat, dan pilih diksi yang terasa wajar. Pakai tanda baca sesuai makna; jangan tetapkan kuota koma atau gabungkan semua kalimat.
- Tinjau cerita dan hook sebelum lock; uji satu kali pada pendengar yang belum tahu ceritanya jika tersedia, lalu catat kata-kata dan bagian yang membingungkan tanpa mengklaim hasil yang belum ada.
- Saat audio tersedia, bandingkan master dan hasil persiapan pada kecepatan normal di sambungan chunk dan jeda yang dipotong. Bedakan hasil dengar dari laporan ASR dan pengukuran. Pertahankan penerimaan otomatis suara yang sudah diberikan pemilik.
- Naskah 006 dan aset yang ada tidak diubah oleh audit ini: teks terhubung ke [brief](../episodes/006-bioskop-tanpa-pintu/brief.md), scratch, caption, anchor panel dan rencana audio. Jika direvisi, buat revisi terkoordinasi, tandai turunan lama sebagai kedaluwarsa, bangun ulang yang diperlukan, dan ukur hook serta peta PCM baru. Jangan menyebut audio atau hasil turunan lama cocok dengan teks baru.
