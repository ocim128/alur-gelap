# Shared foley and ambience

These WAVs are edited source recordings. The table records the original files and changes. For the CC BY excerpts, retain this notice with redistributed audio and credit the excerpts in published cuts that use them.

## rubberduck

Source pack `sfx_100_v2.zip`, [100 CC0 SFX #2](https://opengameart.org/content/100-cc0-sfx-2). [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).

| Library WAV | Original OGG in the pack | Edit |
| --- | --- | --- |
| `traffic-bed` | `sfx100v2_loop_highway.ogg` | Muffled highway tone |
| `night-air` | `sfx100v2_loop_ambient_01.ogg` | Low-pass ambience |
| `engine-idle` | `sfx100v2_loop_machine_01.ogg` | Low-pass mechanical rumble |
| `shoe-left` | `sfx100v2_footstep_01.ogg` | Trimmed and muffled |
| `shoe-right` | `sfx100v2_footstep_02.ogg` | Trimmed and muffled |
| `glass-tick` | `sfx100v2_glass_04.ogg` | Tail trimmed and damped |
| `door-lock` | `sfx100v2_lock_open_01.ogg` | Trimmed and muffled |
| `ignition-click` | `sfx100v2_switch_01.ogg` | Trimmed |
| `console-switch` | `sfx100v2_switch_02.ogg` | Trimmed |
| `metal-resonance` | `sfx100v2_metal_hit_01.ogg` | Trimmed and darkened |

## dklon

Source pack `foley_pack.zip`, [Super Foley Pack](https://opengameart.org/content/super-foley-pack). [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).

| Library WAV | Original WAV in the pack | Edit |
| --- | --- | --- |
| `glass-knock` | `fist_hitting_bottle.wav` | 0.43 s take from 3.157 s, low-pass filter |
| `body-fall` | `body_hit_on_ground.wav` | 0.64 s take from 4.552 s, low-pass filter |
| `coat-shift` | `leather_rustling.wav` | 0.33 s take from 4.280 s, high-pass filter |

Credit text for cuts using these excerpts: **Foley from “Super Foley Pack” by dklon, licensed CC BY 3.0. Excerpts trimmed and filtered.** Include the source and license links above.

## techiew

Source `ambient_horror.ogg`, [Ambient horror](https://opengameart.org/content/ambient-horror). [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).

| Library WAV | Edit |
| --- | --- |
| `sub-drone` | 20 s excerpt from 0.1 s with low-pass filtering and fades |
| `tension-rise` | 4.7 s excerpt from 15.9 s, reversed, filtered and faded |

## Climax derivatives

`prepared/climax-riser.wav` is a filtered, faded and peak-normalized derivative of techiew's CC0 `tension-rise`. `prepared/climax-stinger.wav` layers dklon's CC BY 3.0 `body-fall` with rubberduck's CC0 `metal-resonance` and techiew's CC0 `sub-drone`, filtered, faded and peak-normalized. Rebuild these two files with `node scripts/prep-sfx.mjs --climax`; originals are retained. The dklon attribution above applies to every cut using the stinger. Peak normalization is to approximately ?1 dBFS, not a true-peak guarantee for the finished mix.

## Episode 003 candidate minimarket effects

- `sources/frosty-ham-doorbell-original.wav`: [Doorbell by frosty ham](https://opengameart.org/content/doorbell), [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/); original WAV from the linked page. SHA-256 `705e4cec5d602df88813165bd2bac53cbfdbe593a552b1e7fe41cb7a26e9bc0f`. `prepared/minimarket-doorbell-outside.wav` is high-passed at 180 Hz, low-passed at 2200 Hz and normalized to -1 dBFS sample peak. Candidate: audible ding-dong and perspective suitability still need review.
- `sources/laleksic-door-creak-open-original.wav`: `door_creak_open.wav` from [Various Sound Effects by laleksic](https://opengameart.org/content/various-sound-effects), [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). SHA-256 `67ec6952f3de32852ea5a188e6118546107e4d2ca15b3fd4cab64d8993877227`. `prepared/minimarket-door-creak-outside.wav` is high-passed at 150 Hz, low-passed at 2200 Hz and normalized to -1 dBFS sample peak. Candidate: appropriateness for the glass-door action still needs listening.

These candidates and the existing climax derivatives require listening in the episode mix; sample peak is not a finished-mix true-peak guarantee.

## Episode 004 candidate effects

- `sources/ep004-bottle-slide-preview.mp3`: HQ preview of [Bottle Slide Wood by lucaslara](https://freesound.org/people/lucaslara/sounds/154407/), [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). SHA-256 `5BFA26012324CF5CA9AF90EC80EE3A1E531C8A13E43BC82C70F9A051E6014AF3`. `prepared/ep004-bottle-scrape.wav` trims 0.25?1.65 seconds, filters 180?7000 Hz and fades. The source is a plastic bottle sliding on wood, used as a candidate for tile/concrete; suitability needs listening.
- `sources/ep004-female-breath-preview.mp3`: HQ preview of [breathing_female.wav by Kuroseishin](https://freesound.org/people/Kuroseishin/sounds/95567/), [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). SHA-256 `8B5AE938748E27B08761A5D64B7A29254DAE8A47BABAC74AF1B48B80545CC7C2`. `prepared/ep004-survivor-breath.wav` trims 0?1.4 seconds, filters 140?7000 Hz and fades. Listening in the mix remains pending.

## Episode 005 in-world voices and phone cue

- `sources/ep005-entity-plea-original.wav` and `sources/ep005-entity-whisper-original.wav` were generated for this episode with the configured Google Cloud Gemini 3.8 Flash TTS model and the same Aoede voice, using the exact cue-sheet text and young female, flat / close-whisper style prompts. `prepared/ep005-entity-plea.wav` applies the `behind-wall` profile; `prepared/ep005-entity-whisper.wav` applies `close-whisper`. The source WAVs are retained. AI-generation service terms and publication rights have not been independently verified. ASR recognizes the intended words; delivery, identity consistency and mix have not been reviewed by ear.
- `prepared/ep005-phone-vibration.wav` is a locally synthesized 125 Hz sine with 28 Hz tremolo, band filtering and fades, generated using FFmpeg; no third-party recording is used. Its suitability needs listening.
- The glass taps and climax stinger use the existing dklon/rubberduck/techiew derivatives documented above; the dklon CC BY 3.0 credit applies.

## Episode 006 tunnel footsteps

- `prepared/ep006-step-left.wav` and `prepared/ep006-step-right.wav` derive from rubberduck's CC0 `shoe-left` and `shoe-right` above, with 130–4500 Hz filtering and a 95 ms echo. These derivatives and their wet-concrete suitability require listening in context. Glass taps and the climax use the shared dklon and other derivatives; the CC BY 3.0 attribution above applies.


## Episode 007 PA, siren and station foley

- `sources/ep007-pa-original.wav`: generated through Google Cloud Gemini 3.8 Flash TTS, Orus, for the specified formal Indonesian PA line. `prepared/ep007-pa.wav` applies the `toa-megaphone` profile. The original is retained. ASR recognized the requested sentence; performance and mix have not been reviewed by ear. Google service and voice publication terms have not been independently verified.
- `sources/ep007-tinyworlds-storm-siren.ogg`: [Storm & Siren by TinyWorlds](https://opengameart.org/content/storm-siren), [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/); SHA-256 `3658A27BDE10028531371FFBC2D57810FAD0CECBFF4B2D496714CD4AA7176D99`. `prepared/ep007-siren-loop.wav` uses seconds 38–55, 200–1800 Hz filtering and short end fades; its intelligibility as a distant siren requires listening.
- `sources/ep007-antumdeluge-scrapes.zip`: [Scrapes by AntumDeluge](https://opengameart.org/content/scrapes), CC0 1.0; SHA-256 `9598070DDD77ED99E922DF1D4472A249624ADCD945794D1B6EBA88AC77F6A014`. `sources/ep007-scrape-original.wav` is `scrape-3.wav` from the archive; `prepared/ep007-stone-scrape.wav` filters 150–6000 Hz. Recorded on cinder block; writing suitability requires listening.
- `sources/ep007-rubberduck-metal-wood.zip`: [100 CC0 metal and wood SFX by rubberduck](https://opengameart.org/content/100-cc0-metal-and-wood-sfx), CC0 1.0; SHA-256 `BE6EBA63B03409AC0C77787A956B1503A7C186403D04AEF9725C52644A4B7878`. `sources/ep007-metal-open-original.ogg` is `metal_open_01.ogg` from that pack; `prepared/ep007-gate-open.wav` filters 90–5000 Hz. Heavy gate suitability requires listening.
- The guard steps and flashlight click use the existing rubberduck CC0 library. The shared climax stinger contains dklon's CC BY 3.0 foley; its attribution above applies.

For the Episode 007 assembly, `prepared/ep007-pa-mixready.wav` adds 22 dB to the processed PA and `prepared/ep007-siren-mixready.wav` adds 23.1 dB to the filtered siren loop, placing their source sample peaks near -1 dBFS. Original and intermediate files are retained. Finished loudness and true peak are measured on the exported mix; source normalization is not a listening review.

## Standalone Scenario 03 — Goyangan Dek Enam

- `sfx/rewind-whoosh.wav`: 0.40 s reverse whoosh excerpt from techiew's CC0 1.0 `tension-rise.wav` (seconds 3.2–3.6), filtered 120–5500 Hz with 30 ms / 50 ms entry/exit fades, sample-peak normalized to -1.0 dBFS. Used for the 0.4 s `branchRewind` transition at 70.40–71.52 s.
- `sfx/lifeboat-impact.wav`: 0.75 s heavy metal impact derived from `climax-stinger.wav`, layering dklon's CC BY 3.0 `body-fall`, rubberduck's CC0 `metal-resonance`, and techiew's CC0 `sub-drone`. Peak normalized to -1.0 dBFS. Credit text applies: **Foley from “Super Foley Pack” by dklon, licensed CC BY 3.0. Excerpts trimmed and filtered.** Anchored to `BRAK!` at 117.28–117.96 s.
- `sfx/lock-pin.wav`: 0.40 s composite of rubberduck's CC0 `door-lock.wav` and `ignition-click.wav`, normalized to -1.0 dBFS. Anchored to `KLIK!` at 125.32–126.04 s.
- `sfx/chain-padlock.wav`: 1.15 s metal and chain rattle from rubberduck's CC0 `ep007-metal-open-original.ogg` (`metal_open_01.ogg`), filtered 90–5000 Hz, normalized to -1.0 dBFS.
- `sfx/brake-lever-pull.wav`: 0.23 s mechanical lever snap / ratchet release from rubberduck's CC0 `console-switch.wav` and `ignition-click.wav`, normalized to -1.0 dBFS. Triggered at 111.24 s (P18).
- `sfx/pulley-whirr.wav`: 1.20 s wire cable friction from AntumDeluge's CC0 `ep007-scrape-original.wav` (`scrape-3.wav`), highpass 300 Hz, lowpass 4500 Hz, normalized to -1.0 dBFS. Triggered at 113.52 s (P19 start).
- `sfx/ocean-vortex-suction.wav`: 3.50 s underwater vortex cavitation roar derived from techiew's CC0 `sub-drone.wav` (seconds 2.0–5.5) with 220 Hz lowpass filter and 80 Hz boost, normalized to -1.0 dBFS. Triggered at 58.50 s (P09).
- `sfx/deck-water-flow.wav`: 2.50 s water wash across steel deck plate, synthesized via pink noise with 800 Hz bandpass and 1.5 Hz tremolo, normalized to -1.0 dBFS. Triggered at 16.34 s (P04) and 104.30 s (P16).
- `sfx/blackout-hit.wav`: 0.35 s (350 ms) pure 50 Hz sine sub-drop with 15 ms smooth attack and exponential decay, synthesized locally via FFmpeg, normalized to -1.0 dBFS. Scheduled inside the cut at 153.50–153.85 s with a 150 ms silent margin before the 154.000 s cut to black.
- `sfx/ship-ambience-bed.wav`: 154.000 s continuous ship exterior ambience stem layering rubberduck's CC0 `night-air.wav` and `engine-idle.wav`, peak normalized to -12.0 dBFS.

