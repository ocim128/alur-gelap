# Asset and rights record ? ARSIP #003

## Still photos

Generated with the built-in OpenAI image generator on 2026-11-25; JPEG conversions preserve the generated image. Publication rights and applicable terms are **not independently verified**. No identifiable real people or third-party source photographs were intentionally used. Each still was examined at 540 ? 960 in `sources/still-previews/`; this is a creator inspection, not human audience evidence. The first still took three attempts (initial seam resembled wires; second stitched but single row; third edit has two rows); all other stills took one attempt. The final phone size and zoom framing still require MP4 inspection.

| File | SHA-256 |
| --- | --- |
| `still-01-sky-seam.jpg` | `bdcaeca73a4da3368f14cc2d7e81f631305ee2a24174447516d779ee3b7e1923` |
| `still-02-smoke.jpg` | `45274295bdb76104f9867ea7988686b201283bd8a6cd187905b1d34373688531` |
| `still-03-canvas.jpg` | `18a49d41d63b5b776d2014353af969372fb3e3a026458b4ea6e1b25b838ef1a7` |
| `still-04-zipper.jpg` | `9e1765b4fa11856527c7dc6cdef2c0403c3346d03ea20264d06dde2a379e1f32` |
| `still-05-outside-zipper.jpg` | `967ad0d7f8acb5089b80ea25ac5145531c3ad3dee1189b15f01376b62f55f773` |

Prompt summaries and image attempts: [sources/prompts.md](sources/prompts.md). Generated 1086 ? 1448 portrait originals; previews are letterboxed, not a claim about crop behavior in chat.

## Audio

`listening review: none`. Synthetic ambience, drone, UI pops and zipper were generated using `scripts/generate-jahitan-soundscape.mjs`; synthetic voice-note environmental beds and voice mixing use `scripts/prepare-jahitan-voices.mjs`. No third-party recordings were used in these synth effects. Their perceptual realism, the zipper reading, and audio clue audibility are not verified by listening. Voice sources: Google Cloud / ShortZ `gemini-3.8-flash-tts`, Puck for Bima, Leda for Nadia, `voice_71a5a701-796e-421d-840e-0adc00b0816a` for Gilang, with unverified service and voice publication rights. No pitch or speed alteration was used. Raw ShortZ MP3, ASR, and timestamp sidecars retained in `sources/`; they are ShortZ-processed outputs, not untouched provider WAVs. See `generate-voices.ts` for exact wording and style. Some prompt punctuation was simplified, and `gue`/`enggak` replaced written abbreviations on retry, without changing intended wording.

| Event | Source take | Delivery | PCM duration | ASR and limitations |
| --- | --- | --- | --- | --- |
| m5 | `vn-01-retake.mp3` | `vn-01-bima-rain.wav` | 3.705 s | `ga`?`gak` only; onset warning |
| m10 | `vn-02-source.mp3` | `vn-02-bima-seam.wav` | 4.205 s | `gw`?`gue` only; onset warning; synthetic metallic rattle in final 0.4 s |
| m13 | `vn-03-source.mp3` | `vn-03-bima-zipper.wav` | 2.565 s | `gw`?`gue` only; onset warning |
| m15 | `vn-04-retake2.mp3` | `vn-04-bima-outside.wav` | 4.825 s | `enggak`?`nggak` only; onset warning; dry synthetic bed |
| m17 | `vn-05-retake3.mp3` | `vn-05-nadia-outside.wav` | 4.880 s | Small ASR on full source recognizes all words; `gak`?`ga` spelling only. Intentional cut at 4.880 s inside `nemu` (source ASR 4.64?5.12 s). Onset and cutoff require human review. |
| m19 | `vn-06-source.mp3` | `vn-06-gilang-last.wav` | 2.300 s | `gw`?`gue` only; onset warning; padded to include synthetic environment |
| m22 | procedural synthetic | `vn-07-tanpa-nama-zipper.wav` | 2.650 s | No human voice; zipper recognizability requires listening. |

The default preparation invocation is `node scripts/prepare-jahitan-voices.mjs` after restoring the retained selected source MP3s into an empty destination; it refuses to overwrite. The earlier rejected take and independent base-ASR spot check remain in `sources/`. The ShortZ reports mark all selected takes failed under their literal alignment/WPM gates; equivalent spelling does not prove pronunciation. Do not treat ASR or signal checks as listening. Per-file hashes below bind the derivatives:

| Audio file | SHA-256 |
| --- | --- |
| `ambience-pine-canvas-bed.wav` | `92058d51c9486e4826996f28fda91d8baa662b1025db39bca7e759ff90ceb33e` |
| `tension-canvas-drone.wav` | `29a51f2730d599538a959040b79273b6b7f35fafb3a1d42dc903095462a077a8` |
| `ui-pop-in.wav` | `7999dd3d5dd9e9d141cd4907881700ef431b38e208f493672d0f835a0552157a` |
| `ui-pop-out.wav` | `f4749986a67f84b4c56701eac516ffd83ccda5ef94f03224eeb1d3ec313ee1ed` |
| `vn-01-bima-rain.wav` | `a2076a49dc3cf553dd1030bcd2fd715670b93ce98ca2e5453f2afbfa61db410e` |
| `vn-02-bima-seam.wav` | `d2e1511c7dcd1c7871717453887041646c0179def6509db6f9fdb37dbaf507b0` |
| `vn-03-bima-zipper.wav` | `59c22e2ccc3b5ebeb38a863844776f8f50483b467b0cad8349968d5be8bd797a` |
| `vn-04-bima-outside.wav` | `3a8c7a96d594e0724b456805ce2a73d79adf07e8f0c082abe2b572e8a6072508` |
| `vn-05-nadia-outside.wav` | `1a1c1bd29470e818963f291e48a4a41d337aa216242c868fd64eb24fe1d9cde5` |
| `vn-06-gilang-last.wav` | `a99dd1ffdf27de7983040ca54b1bb28f2f77603fb6e5cfae989d7b7e589a534b` |
| `vn-07-tanpa-nama-zipper.wav` | `4ec328fc456313d62dcf9bc908d3df61990379df3d310afc432716f65b1ca29d` |
