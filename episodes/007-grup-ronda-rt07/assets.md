# Asset & Rights Record (Studio v3 · Arsip Terakhir) — 007 · Grup Ronda RT 07

## v4 audio revision (2026-11-24)

The six approved stills remain byte-for-byte unchanged from v3. This v4 audio revision uses new filenames so the v3 media remain available. No new stills were generated.

| Asset | SHA-256 | Source and processing |
| --- | --- | --- |
| `public/assets/007-grup-ronda-rt07/vn-02-hendra-odd-v4.mp3` | `0458b8810e374f1a320b5cc3f9a9139588d55331d348faa898f92c6a409a999f` | 3.565 s; `scripts/generate-ronda-v4-vn.py` combines the retained Hendra TTS master, CC0 `night-air.wav`, and `sources/sfx-m6-laugh-src.mp3`. A 0.42 s band-limited excerpt is placed at 1.63–2.05 s in the speech gap. Before encoding, its 300–2500 Hz RMS was set 7 dB below speech RMS measured at 0.88–1.60 s; the common output gain preserves their ratio. Listening on a phone remains pending. |
| `public/assets/007-grup-ronda-rt07/tension-ronda-drone-v4.wav` | `d1cea5fc8bf63619b7697c433cfc69b707f19fc3d2663e6a1bcfce6b00ad67c2` | 38.2 s; synthesized with `node scripts/generate-ronda-soundscape.mjs --drone-v4`, adding non-melodic 90–220 Hz room pressure and harmonics to the sub rumble. Phone-speaker audibility remains pending listening. |

Google Cloud speech and generated-laugh commercial/publication terms remain unverified. The owner listened to v3 on a phone and reported that crickets worked, the scary factor was acceptable for now, and the m6 laugh was missed; this is feedback on v3 only. **v4: `listening review: none`.**

## Checkpoint 6b revision — current assets (2026-11-24)

The entries below supersede the v2 measurements and asset references retained in the historical sections below. Current timeline: 66.5 s / 1995 frames. `listening review: none`.

| Current CCTV still | Event | SHA-256 | Attempts, provenance and visual count |
| --- | --- | --- | --- |
| `still-03a-cctv-hendra-photo.jpg` | m14a | `708fbc52af29eafc1f7a9c546f2e9971f969221d9a4551acfc38f44eafcc2842` | Built-in imagegen, 1 new attempt in this session; earlier generator attempt 2 rejected for five glasses. 1080×1920 JPEG. At 540×960: one man, one hooded figure with black face; four glasses, three full and one half-full; one phone in man's hands. No composite. |
| `still-03b-cctv-standing.jpg` | m14b | `c2ccbd26df418d4780a1e2132da5e7c7c8419e89299e9693574aa015e992562b` | Built-in imagegen, 1 attempt, editing 03a as fixed-angle reference. One recoiling man and one standing hooded figure, four glasses; horizontal static. 1080×1920 JPEG. No composite. |
| `still-03c-cctv-empty.jpg` | m14c | `277912e9092ebd2316025e50696a26bfb722bce10f3458c839982718ed442077` | Built-in imagegen, 2 attempts: initial edit of 03a, then a targeted edit moving phone higher for framing. At 540×960: no people; four glasses, three full and one half-full; one lit phone on floor. 1080×1920 JPEG. No manual composite. |

Verification copies live under `episodes/007-grup-ronda-rt07/sources/verify-540p/`; prompt summaries are in `sources/prompts.md`. The 03b and 03c images are AI edits based on 03a; while the view and props are closely matched, generative edits can alter details. Image-generation commercial/publication terms remain unverified.

| Current audio | SHA-256 | 6b revision |
| --- | --- | --- |
| `ambience-ronda-bed.wav` | `8e772f127a1e03fafd4bacb0c3896aa61ea3e1574c4e274b4055f0ec976b33f2` | 66.50 s; synthesized via `scripts/generate-ronda-soundscape.mjs`. |
| `tension-ronda-drone.wav` | `bf558a92d0adc38fab1b0ed322b592774d7c00b335ef79c533ace93f3188ce32` | 38.20 s; synthesized in the same script. |
| `vn-01-bayu.mp3` | `0b5d62820fc5f9d2bfaf8b26e2ec642c54015f522b70339ecb444148071a4802` | 4.925 s, remixed environment. |
| `vn-02-hendra-odd.mp3` | `25d449c995ef9afd9ed31e8cd3f92da2289bb8d74031b8de0ad1e29ce084f3b5` | 3.565 s, remixed; faint generated chuckle at 1.52–2.59 s, source in `sources/sfx-m6-laugh-src.mp3`. |
| `vn-03-darto-panic.mp3` | `9e69dd34ea061a69f861f01e71a8a2acfc24690a081c45f8c2240a6d0ceff0d6` | 3.680 s, remixed with alley wind and CC0 footsteps, intentional hard cutoff. |
| `vn-04-unknown-bayu.mp3` | `6a16101428976c7a3ce47d23a46531d92904bb64d0ce999648545ce0383b0fe5` | 2.375 s; derived from m4 source tail, remixed. |

`sfx/shared/tanpa-nama-ping.wav` is reserved for Tanpa Nama events m16 and m17 in the current script. Sound sources and licensing notes are in `public/sfx/LICENSES.md`; TTS and generator publication terms remain unverified.

## Historical v2 asset record

- **Episode folder:** `episodes/007-grup-ronda-rt07/`
- **Composition ID:** `Arsip01GrupRondaRT07`
- **Pipeline Version:** `3` (`chat-script.json`, 64.00 s / 1920 frames @ 30 fps)
- **Date prepared:** `2026-11-24`
- **Listening review:** `listening review: none` *(ASR alignment reports and acoustic metrics were checked; no human ear-check has been performed.)*
- **Music:** None. Zero mood-explaining music tracks are used anywhere in the episode.

## 1. Visual Assets (Amateur Phone Photos & CCTV Stills)

All four stills were generated via the `image-generator` subagent on `2026-11-24` in raw low-light / direct-flash amateur smartphone photo or monochrome IR CCTV style (gore-free, zero illustrations). Every still with a countable clue or required sign text was downscaled to **540 × 960** (`episodes/007-grup-ronda-rt07/sources/verify-540p/`) and visually inspected before acceptance.

| Asset (`public/assets/007-grup-ronda-rt07/...`) | Event | Format / Size | SHA-256 | Attempts | Composite? | 540×960 Verification Gate | Source & Rights Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `still-01-pos-aman.jpg` | `m3` | JPEG 1:1 (`865,365` B) | `d0409fce257ca41b8b28b16ef7c8aed5b17d7fc4d6996da0584128c8b4a71da7` | **1** | None | **Passed:** Counted **exact 4** clear coffee glasses on the wooden pos ronda bench (3 full on left, 1 half-drunk on right with splatter) next to blue thermos (`sources/verify-540p/still-01-pos-aman.jpg`). | AI-generated via `image-generator` (`2026-11-24`). Commercial/publication terms of the generator have not been independently verified. |
| `still-02-gang-gelap.jpg` | `m8` | JPEG 1:1 (`893,451` B) | `b4b448cb7d8cf8da684ba04e22aed981ccb0dcb2c8b31dd681f604dfe4349d14` | **2** (`v2` refined by subagent) | None | **Passed:** Grainy low-light *gang kampung* with distant dark-jacketed figure facing the wall; gore-free, reads cleanly at phone size. | AI-generated via `image-generator` (`2026-11-24`, v1 rejected in favor of v2 framing). Commercial/publication terms have not been independently verified. |
| `still-03-cctv-pos.jpg` | `m14` | JPEG 9:16 (`778,674` B) | `a7d1846b6de00b928ba7162555e56a988db330534e5d5aeb4f6be3f36385c8c6` | **1** | None | **Passed:** Monochrome IR CCTV view of empty pos ronda; counted **exact 4 empty coffee glasses** on bench + glowing smartphone face-up on floor (`sources/verify-540p/still-03-cctv-pos.jpg`). | AI-generated via `image-generator` (`2026-11-24`). Commercial/publication terms have not been independently verified. |
| `still-04-portal-barat.jpg` | `m15` | JPEG 1:1 (`958,384` B) | `4481d9146e0dd4100b4f5c96f9fc5da2a13e914358eb980bc3049c62483aee82` | **1** | None *(no sign composite required)* | **Passed:** Hand-painted white sign reading **`PORTAL BARAT`** on the red-and-white village pipe barrier is accurately spelled and clearly legible at 540×960 (`sources/verify-540p/still-04-portal-barat.jpg`). | AI-generated via `image-generator` (`2026-11-24`). Commercial/publication terms have not been independently verified. |

## 2. In-World Voice Notes (2–6 s Each, No Narrator)

All speech takes were generated with Google Cloud `gemini-3.8-flash-tts` via the repository's ShortZ TTS pipeline on `2026-11-24`. Raw masters and ASR alignment sidecars are retained in `episodes/007-grup-ronda-rt07/sources/`. No pitch or speed hacks were applied. The masculine Indonesian male voice (`voice_71a5a701-796e-421d-840e-0adc00b0816a`) is used strictly as an in-world character (`bayu` / mimic in `m16`), never as a narrator.

| Asset (`public/assets/007-grup-ronda-rt07/...`) | Event & Character | Measured Duration | SHA-256 | Source Master & Derivation / Processing | ASR & Quality Notes | Rights Status |
| --- | --- | --- | --- | --- | --- | --- |
| `vn-01-bayu.mp3` | `m4` (`bayu`, `selfId`) | **`4.925 s`** | `ab2727823e39ea3ec5c1a7fac4e4faee3bac472be0b62e27d3810e85be62526e` | Generated from `sources/vn-01-bayu-src.mp3` (`voice_71a5a701-796e-421d-840e-0adc00b0816a`, Gemini 3.8 Flash TTS). Line: `"Gue di portal barat bentar, nanti balik ke pos. Pos aman."` Filtered: `highpass=f=120,lowpass=f=6800,volume=1.15,alimiter=limit=0.56:attack=0.1:release=40:level=disabled` (measured `-19.4 LUFS`, `-4.3 dBTP`). | ShortZ exit `0`: `finalAlignment.passed: true`, similarity `1.0`. `listening review: none`. | Google Cloud TTS; service & voice publication terms not independently verified. |
| `vn-02-hendra-odd.mp3` | `m6` (`hendra`, odd delivery) | **`3.565 s`** | `fe0bedc0c74d61bfbae26c06644d9f89abc78977981af5135e2a01f4061a61bd` | Generated from `sources/vn-02-hendra-src.mp3` (`Charon`, Gemini 3.8 Flash TTS, ShortZ `[tactical]` flat/over-even style prompt; no pitch/speed hacks). Line: `"Hah... aku di pos, Pak. Aku dari tadi di pos."` Filtered: `highpass=f=140,lowpass=f=6200,volume=1.10,alimiter=limit=0.56:attack=0.1:release=40:level=disabled` (measured `-18.9 LUFS`, `-4.3 dBTP`). | ShortZ exit `2` due solely to Whisper compound tokenization (`"di pos"` transcribed as `"dipost"`/`"dipos"`; `wordRatio: 1`, `similarity: 0.974`, `LRA: 1.3 LU`). `listening review: none`. | Google Cloud TTS; service & voice publication terms not independently verified. |
| `vn-03-darto-panic.mp3` | `m9` (`darto`, panicked cutoff) | **`3.625 s`** | `67a6385ab09a109bd52fa19c26935d8bdc1edb5fc4286cccac9377063565c3ac` | Generated from `sources/vn-03-darto-src.mp3` (`Orus`, Gemini 3.8 Flash TTS, ShortZ `[hook]` urgent delivery). Spoken source: `"Mas Bayu jawab dong! Dia nengok ke sini, dia lari ke sini!"` Trimmed mid-word at `3.680 s` (word `"lari"` spans `3.54–3.76 s`) with a 3 ms hard digital cutoff (`afade=t=out:st=3.677:d=0.003`), filtered `highpass=f=130,lowpass=f=6800,volume=1.05,alimiter=limit=0.56:attack=0.1:release=40:level=disabled` (measured `-16.9 LUFS`, `-4.5 dBTP`). No scream, no gore sound. | ShortZ `finalAlignment.passed: true`, `mismatches: []`, `similarity: 0.981` (exit `2` only on generic WPM/tail heuristic; end is intentionally hard-cut at `3.680 s`). `listening review: none`. | Google Cloud TTS; service & voice publication terms not independently verified. |
| `vn-04-unknown-bayu.mp3` | `m16` (`unknown`, Bayu mimic) | **`2.375 s`** | `f5d53cc6e0e8f5f9198592f6005a7543bb16dfe05e21f2fc9d27e293b4c70495` | **Derived directly from `episodes/007-grup-ronda-rt07/sources/vn-01-bayu-src.mp3` — NOT a fresh TTS take.** Extracted the `"Pos aman."` tail (`3.550–4.925 s`), applied flatter EQ (`highpass=f=240,lowpass=f=2800,equalizer=f=1200:t=q:w=1.2:g=-2`), added `0.45 s` lead-in (`adelay=450\|450`) and `0.55 s` tail (`apad=pad_dur=0.55`) to reach `2.375 s` (`>= 2.0 s`), mixed subtle room tone (`volume=0.03` from CC0 `public/sfx/night-air.wav`), and leveled via `volume=0.65,alimiter=limit=0.52:attack=0.1:release=40:level=disabled` (measured `-25.8 LUFS`, `-5.4 dBTP`). | Derived from verified `m4` source (`similarity: 1.0`). Two-peak waveform visible on `m16` bubble (`Pos` + `aman`). `listening review: none`. | Derivative of `vn-01-bayu-src.mp3` (Google Cloud TTS, terms unverified) + CC0 1.0 `night-air.wav`. |

## 3. Ambience & UI SFX (No Music)

| Asset (`public/assets/007-grup-ronda-rt07/...`) | Role | Measured Duration | SHA-256 | Source & Processing | License / Attribution |
| --- | --- | --- | --- | --- | --- |
| `ambience-night-village.wav` | Continuous low-level night air bed (`gain: 0.22` in script) | `10.080 s` (loop) | `7445cdf8a6d081390f546a92f9288afcac7a73e150a48fbbe4a3aa9c52c9999d` | Derived from `public/sfx/night-air.wav` (`sfx100v2_loop_ambient_01.ogg` in `sfx_100_v2.zip` by `rubberduck`, [100 CC0 SFX #2](https://opengameart.org/content/100-cc0-sfx-2)). Filtered `highpass=f=120,lowpass=f=4200,volume=0.45` (`-43.0 LUFS`, `-22.5 dBTP`). | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) (no attribution required). |
| `ui-pop-in.wav` | Incoming chat message subtle pop (regular characters only) | `0.075 s` | `2f657be9a99b949ea4e4e338915311031fb8dde69663496f5662dfd1732362da` | Locally synthesized original sine-transient UI pop (copied & attenuated `volume=0.55`, peak `-16.4 dBTP` from `public/assets/arsip-demo/ui-pop-in.wav`). Non-trademarked; does not imitate WhatsApp/Telegram/Line sounds. | Original repo-synthesized asset; no third-party recording. |
| `ui-pop-out.wav` | Outgoing chat message subtle pop (`bayu` only) | `0.065 s` | `6d37327f69b9986fc0e6770f3db8145a800097944306c0dc7d2089c19d7836ca` | Locally synthesized original sine-transient UI pop (copied & attenuated `volume=0.55`, peak `-16.4 dBTP` from `public/assets/arsip-demo/ui-pop-out.wav`). Non-trademarked. | Original repo-synthesized asset; no third-party recording. |
| `sfx/shared/tanpa-nama-ping.wav` *(shared)* | Exclusive `Tanpa Nama` signature notification ping (`m15` and `m16` ONLY) | `0.420 s` | `188fecbc64386c3a4abf2a03333d71080e600c5d4386eb9c9adb46ec56cbb82f` | Deterministically synthesized in-repo from pure math via `scripts/generate-tanpa-nama-sfx.mjs` (`48000 Hz` mono 16-bit PCM, true peak `-8.0 dBFS`, cold two-pulse detuned metallic dyad). Zero third-party samples or WhatsApp/Telegram/Line imitation. Logged in `public/sfx/LICENSES.md`. | Original repo-synthesized asset; full rights owned by repo. |

## 4. Prior & Archived Renders (Preserved Untouched)

- `out/arsip01-grup-ronda-rt07.mp4` (`v1`, SHA-256 `28eb83e2e659075d3151557fb161b53400895912a4a97e04070504ead49b83ea`): Checkpoint 4 delivery preserved untouched; superseded by `v2` (`out/007-grup-ronda-rt07/arsip001-grup-ronda-rt07-v2.mp4`) after owner decisions (series identity strip `ARSIP #001 · @skenarium`, `Tanpa Nama` avatar + signature ping, hard-cut overlays, played voice-note state).
- `out/007-grup-ronda-rt07/arsip01-grup-ronda-rt07-v1-tp-fail.mp4` and `out/007-grup-ronda-rt07/arsip01-grup-ronda-rt07-v2-tp-fail.mp4`: earlier Checkpoint 4 render attempts archived untouched after failing the `<= -1.5 dBTP` ceiling prior to tightening per-clip limiter headroom.
