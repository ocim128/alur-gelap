# Agent instructions for alur-gelap

- Before working on content, read [README.md](README.md), [STYLE_GUIDE.md](STYLE_GUIDE.md), and the relevant episode brief and [decision history](archive/playbook/experiments.md). Earlier guidance lives in [the archived playbook](archive/playbook/). The owner's current instructions override these working assumptions.
- Make new videos with the Remotion project in this repository root. Follow the applicable installed Remotion skills. Preserve existing user files and the reference video.
- For a cartoon character design or acting test, follow the project [cartoon character development skill](.agents/skills/cartoon-character-development/SKILL.md).
- Indonesian chat text and short in-world voice notes are the owner's current Studio v3 choices; by owner decision on 2026-11-24, the masculine Indonesian male voice is now used as an in-world character voice (not a narrator). The owner wants viewers to have an unbelievable, grounded experience. Make assumptions explicit and do not invent established canon, results, permissions or feedback.
- For an episode, maintain a brief, script (`chat-script.json` for v3), asset and rights record, and review using the templates. Record the composition ID and any external dependencies. Update the decision log when evidence exists.
- Creating a video, rendering an export and publishing are distinct actions. Follow the owner's request and applicable Remotion skill instructions. Do not post, schedule, message people or change accounts without authorization.

## Studio v3 · Arsip Terakhir

Use the [v3 style guide](STYLE_GUIDE.md#studio-v3--arsip-terakhir) and [studio contracts](agents/README.md). Start from [Arsip Terakhir](arcs/03-arsip-terakhir/arc.json). Keep physical episode folders directly under `episodes/<slug>/`, cite episodes by their full path (`episodes/007-grup-ronda-rt07` vs `episodes/arc1/005-suara-dari-rumah-kosong`), and set `pipelineVersion: 3` in `chat-script.json`.

**No narrator.** Each video is a found-phone or found-footage archive. The viewer reconstructs what happened from artifacts: a group chat, short character voice notes, photos sent in the chat, CCTV stills, call logs, notifications, and status lines such as `"terakhir dilihat 03.12"`. Nobody explains the story.

- **Length & specs:** **45–75 s**, **1080 × 1920**, **30 fps**.
- **Hook:** The first message or artifact is on screen at **00:00.0**, readable within **2 s**, and contains an impossible detail (for example, `"Siapa yang barusan ketuk pintu kamar 4? Kita kan cuma bertiga."`).
- **Beat shape:** Normal → odd detail → escalation → silence or reveal. **No rewind loops.**
- **Fantasy rule:** Exactly **one** entity or rule, never explained aloud. The viewer infers it.
- **Fair-play clue:** Plant at least one visual clue in the **first 40%** (for example, inside a sent photo) that explains the ending so viewers rewatch to find it. Record it in the brief's **Clue Ledger** with timestamps and message IDs.
- **Survival angle:** Someone survives (or nearly does) because they noticed the clue or obeyed the rule. Never present this as real-world safety advice.
- **Ending:** The final artifact recasts everything — an unread last message, a new voice note from an unknown sender, or a photo that should not exist. No `"Kamu berhasil bertahan hidup."` No recap.
- **Language:** Everyday spoken Indonesian chat style (singkatan, typo ringan, `"wkwk"`, lowercase), consistent per character, with a distinct texting voice for each character. Ground settings locally: kos, minimarket shift malam, ronda, KKN, rumah nenek, ojol, etc.
- **Audio:** Voice notes are short in-world character lines (**2–6 s** each) made with TTS. Use the masculine Indonesian voice for one male character (a character, not a narrator). Add notification sounds, typing, ambience, and deliberate silence. **No music that explains the mood.**
- **Visuals:** Mostly Remotion-rendered UI built in code (all motion driven by `useCurrentFrame()`, no CSS animations). Generate **3–6 amateur phone photos or CCTV stills** per episode (noise, flash, low light — not illustrations). Keep everything **gore-free**.
- **Labels & brand safety:** Every video shows a small **`FIKSI`** tag, and the caption or description states it is fiction. Use a generic, original chat app design — **do not copy WhatsApp, Telegram, or Line branding, colors, or icons**. No real people, real phone numbers, or real place names that could defame anyone.
- **Captions & safe zone:** **No narration captions.** On-screen text is the chat; voice notes get a short subtitle under the bubble. All text must be readable on a phone (**minimum ~42 px** at 1080 width) and stay inside the platform UI safe zone (**avoid the bottom ~22% and the right ~12%**).
- **Reading pace:** Hold each new message for at least **~180 ms per word + 600 ms** (minimum **1.2 s**). Scroll the chat like a real phone.

## Archived v2 · Arc 02 (grandfathered for Episodes 001–005)

> Archived on 2026-11-24 when the owner switched production to Studio v3 (*Arsip Terakhir*). Studio v2 (`triple-branch-rewind`, Investigator narrator, 24 panels, word bands, Urban Silhouette Noir, Perspective & Naming) is **grandfathered for published Episodes 001–005**. Unfinished `episodes/006-bioskop-tanpa-pintu` is **paused** with its files preserved untouched. Do not use these rules for new episodes.

Use the [v2 style guide](STYLE_GUIDE.md#studio-v2-standalone-survival-scenarios) and [studio contracts](agents/README.md). Start with [Standalone Pilot 01](arcs/02-skenario-bertahan/arc.json). Each Skenario has its own setting, protagonist silhouette, escape puzzle and resolution. Arc 01 is a tone reference. Keep physical episode folders directly under `episodes/<slug>/`, and cite episodes by their full `arc/slug` path (`episodes/arc1/005-suara-dari-rumah-kosong` vs `episodes/005-sabuk-ketiga`).

From Studio v2 Scenario 006 onward, `@skenarium` defaulted to named third-person narration; Episodes 001–005 are grandfathered as second-person. Use one two-syllable, TTS-safe protagonist name, introduced by approximately 00:10; keep the hook pronoun-free, name the protagonist on first mention in each loop, then use `dia` / `-nya` with clear referents, and bookend the name in the closing line. An owner-authorized `kamu` override is allowed only for a blank-vessel concept and must be logged in the brief. Follow [Perspective & Naming](STYLE_GUIDE.md#perspective--naming).

Plan a 2–3 minute cut with a hook in the first three seconds (≤6 canonical words, measured ≤3.0 s, trim fallback pre-authorized in the brief) and short, everyday spoken Indonesian. From Scenario 04 onward the standard was **`triple-branch-rewind`**: three bad-branch loops with 0.4 s tape-snap rewinds, 145–160 s total, **225–245 canonical spoken words for new scenarios** (hyphenated compounds count as one; Episodes 001–005 keep the grandfathered 245–265 band), 24 panels, and the Multi-Loop Reset Rule — each rewind returns to its decision point with only protagonist knowledge carried forward. Plant every trap cause and escape tool in the opening and record its payoff in the Fair-Play Clue Ledger; follow the [TTS-safe lexicon](STYLE_GUIDE.md#studio-v2-standalone-survival-scenarios) and keep all-caps comic SFX out of `narasi.txt`. Timing precedence: a brief's timings are provisional story order only — the PCM-verified `audio-edit-map.json` (from `scripts/prepare-narration.mjs`) is the composition timeline authority, and manifest, captions, cuts, mix and verifier consume it. Use [Urban Silhouette Noir](experiments/attempt-07-silhouette-noir/brief.md) and set `pipelineVersion: 2` at assembly.

## Archived Arc 01 continuity

## Archived v1 · Arc 01 factory loop

Use the [studio role contracts and pipeline state](agents/README.md) for new episode handoffs. The orchestrator contract is currently human-operated; it does not authorize agents to publish.

The owner accepts the Gemini 3.8 Flash TTS Investigator narrator automatically; a separate listening approval is not a prerequisite for production. For Arc 01, reuse each episode's existing prepared narration and timing files and skip Agent 02. Record this owner acceptance without claiming a listening review occurred. Agent 04 supplies any missing cue-sheet foley or in-world voice SFX during assembly; final mix measurements and the normal QA gate still apply.

1. Write **115–130 spoken Indonesian words**. Sentence one establishes both the scenario and the survival rule within three seconds. For Arc 01 v1 only, use second-person narration with the arc’s locked survivor.
2. Reuse an existing prepared Investigator take when available; otherwise generate the whole script in **one ShortZ `gemini-3.8-flash-tts` invocation**. Record the master, measured duration and available word timestamps before generating visuals or building the timeline. Target 60–73 seconds of prepared narration and a 62–75-second final video; flag narration or video below 61 seconds or above 78 seconds. Never change vocal speed to meet the budget.
3. Plan **10–12 unique 9:16 panels** and assign each to a story beat. Keep Indonesian vehicle interiors right-hand drive across all angles.
4. Assemble against the locked narration. Set the manifest’s `openingTitle` to 3–4 punchy words and show it from 00:00.0 to 00:01.8 in the upper-center 3:4 safe zone. Use frame 00:00.2 for the cover and prohibit flash-frame thumbnails. Match caption numbers to the HUD, run the validator and complete the [final review](templates/review.md).

- **Heard if mentioned:** Keep `investigator` as the sole storytelling narrator across Dimensi Niskala; do not add multi-speaker parsing to its narration track. List every narrated in-world sound, voice, and meaningful sound cut in the brief’s mandatory cue sheet, then time and mix it as a separate manifest SFX or bed cue. Protect deliberately silent visual clues.
- Generate `entity-female` (flat, eerie young female mimicry or close whisper) or `pa-announcer` (flat, formal Indonesian public announcement) as separate optional `voice-sfx` assets only when the episode explicitly mentions an in-scene voice or PA. Use the [acoustic profiles](STYLE_GUIDE.md#heard-if-mentioned-world-audio) as appropriate; retain and review the original narrator master and timing.
