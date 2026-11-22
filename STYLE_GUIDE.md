# Style guide

Give viewers an unbelievable survival experience in an imagined world. Show the danger, the character’s choice and its consequence clearly enough to follow without prior episodes. Treat continuity as established only when the episode brief explicitly adopts it.

## Studio v2 Standalone Survival Scenarios

- **Standalone anthology.** Every Skenario opens cold with a fresh setting, protagonist silhouette and physical escape puzzle. Resolve the puzzle within the video. Draw on Arc 01's high-stakes survival tone and keep its timeline, cast and handoff out of the new story. Draft **Pilot 01** first.
- **Bahasa Bayi.** Write the way a sharp friend explains a deadly puzzle. Use short sentences and everyday words like `kamu`, `bakal`, `tamat`, `soalnya`, `perhatiin`, `ternyata` and `jangan sampai`. Cut filler, stiff narration and poetic phrasing such as “Hujan memukul jalur,” “Lututmu menghantam tepi beton,” and “Dia menggeleng lalu melihatmu mundur.”
- **Golden spoken voice sample.** “Kamu dikunci di kamar. Salah gerak, tamat. Tiap tiga menit, dia ngintip lalu duduk di kanan, bawa kunci dan pisau. Ada tong dan gang di kiri.” Use its clear, conversational rhythm as a tone reference, and write fresh details for each scenario.
- **Master Style Anchor.** Use the Urban Silhouette Noir reference images in [`docs/style-anchor/`](docs/style-anchor/). Override rain and urban details for dry or clear shots. A dedicated dry/clear variant may be added to that folder with owner approval. Never substitute previous episode panels or transfer their props or lighting to a new setting.
- **One inked medium.** Walls, floors, doors, props and characters share the same hand-inked 2D graphic-novel treatment, flat cel-shaded texture, matte `#07080B` silhouettes, practical rim light and grounded shadows. Keep poses expressive and scene-specific. Avoid photorealistic 3D backgrounds, pasted vector cutouts, stiff symmetrical A-poses and white internal diagram outlines from turnaround sheets.
- **Single-frame composition.** Each panel ID represents one scene at one moment, with no split screens, picture-in-picture, thought projections or multi-timestamp montages. When the protagonist is already visible full-body, specify `empty POV — no foreground character in frame` instead of adding a blurred duplicate.
- **Pitch 3 First.** For a broad request with no specified setting, Agent 01 checks the scenario collection for repeated tropes and pitches three distinct fair-play survival puzzles, each in three lines covering setting, tempting bad decision and opening-planted clue chain. Draft the full brief after the selected direction is known.
- **Answer-Before-Question.** Plant every physical cause of the lethal bad decision and every object or detail needed for the smart escape in the opening, before the choice or danger arrives. Show each clue naturally or establish it casually. Keep clues readable without over-labeling them or announcing their purpose. No hidden flaw or miracle tool can explain the payoff. Map each plant and payoff in the brief's Fair-Play Clue Ledger.
- **Show-What-You-Say Panel Lock.** Time each narrated threat or visible action to a panel that depicts it. A reaction shot can follow the action. An export that substitutes a reaction for the narrated reveal fails QA.
- **Audio theater.** Keep Investigator as the narrator and cue multiple separate world-audio or non-narrator voice beats, such as TOA or radio, survivor dialogue or panic, muffled pleas or whispers. Plan deliberate 1–3 s dread silences. Label speakers or use consistent caption colors for dialogue.
- **V2 delivery.** Target −14 LUFS integrated and ≤ −1.5 dBTP on the compressed delivery; check after AAC encoding. Deliver limited-range Rec.709 video. Cap procedural flashes at 65% opacity and verify exported flash-frame mean luma is below 190 on an 8-bit scale.
- **Urban Silhouette Noir.** Characters are solid matte black ink silhouettes (`#07080B`), defined by sharp rim-light contours and minimal flat graphic ink folds: no skin tone or drawn faces, eyes, noses or eyebrows. Only non-human threats or looming figures in deep shadow may have minimal pale pinpoint eye glints. Use crushed black shadows, flat graphic color blocks and harsh practical light contrast; never use soft painterly shading, 3D gradients or anime, manhwa or webtoon face rendering. Choose 1–2 practical light accents that belong to the new setting; shift to harsh red or amber on bad branches.
- **Panels and motion.** Plan roughly 16–26 purposeful panels for a 2–3 minute cut. Hold atmospheric shots for 5–9 seconds with slow camera motion or practical light flicker. Cut tightly on action and jolt beats. Keep falling rain outdoors or visible beyond a window or doorway. Keep the existing climax and final mix checks, including ±1 frame exported jolt sync.

### V2 beat map

Target 2.0–3.0 minutes, including dialogue, deliberate silences and the final tail.

| Approximate time | Beat |
| --- | --- |
| 0:00–0:30 | Hook within three seconds. Drop into the trap, establish stakes or timer and plant all physical clues naturally. |
| 0:30–1:15 | Name the tempting instinct, as in “Kalau kamu pilih X, kamu langsung tamat. Kenapa?” Trace the cause to the setup and show the lethal outcome in harsh red or amber. |
| 1:15–2:30 | Use `branchRewind` to return to the choice. Chain planted details into a multi-step physical escape, then pressure-test it with a real complication. |
| 2:30–2:50 | Deliver the earned escape or a logical twist that changes how viewers read the opening. |

The sections below record the Arc 01 v1 format and shared craft guidance. The standalone v2 runtime, narrative, palette and hold rules above take precedence. Keep shared Indonesian grounding, within-video continuity, cover, caption, sound and editorial checks where compatible.

## Seven-episode anthology arcs

- **80% standalone FYP / 20% serialized arc.** Sentence one works cold and establishes the immediate emergency and survival rule. Prohibit recap openings such as “Melanjutkan episode kemarin…”. Carry time, inventory and location through `TimestampBadge`, the `PERSEDIAAN` HUD and the opening scene. Show any change from the previous exit state in the episode.
- **One protagonist across seven stages.** Lock the same protagonist’s gender, face, silhouette and clothing continuity across the arc. Finish by Episode 7, then rotate to a new survivor on the same outbreak timeline.
- **Rule-inversion twist.** Establish a rule that solves an immediate survival problem. The reveal exposes the blind spot that following the rule created. Favor grounded outbreak behavior and quiet `niskala` details such as a fixed stare, an eerie smile or a threat patiently testing the rule. Build the scare through observation and anticipation.
- **Canonical continuity.** Read the prior exit state and current stage from the arc record before drafting. After the cut is accepted, update the current episode’s clock, inventory, location and ending hook in that same file. Leave undecided fields unset. [Arc 01 continuity and character paths](arcs/01-kemacetan-terakhir/arc.json)

| Episode | Arc stage |
| --- | --- |
| 01 | Containment |
| 02 | Immediate Escape |
| 03 | Resource Crisis |
| 04 | False Sanctuary |
| 05 | Human Variable |
| 06 | Rule Breakdown |
| 07 | Finale & Handoff to Arc 02 |

Episode 001 Attempt 06 with the smiling teenage passenger reveal is an Arc 01 v1 reference. Its canonical driver and passenger sheets and generation records are under `public/assets/characters/`. Attempts 02–05 are production history.

## Indonesian Grounding Rule

- Default to familiar Indonesian streets and buildings. Use narrow concrete gangs, weathered ruko, `teralis jendela`, and overhead cables on `tiang listrik`.
- Default to right-hand-drive family MPVs and city cars. Give minimarkets manual push-pull glass doors with an overhead ding-dong motion chime, plus a `gudang belakang` beside `tumpukan galon` and drink crates.
- Ground escape routes and public spaces in `tangga darurat`, `jalan samping rel`, `toa stasiun`, and `spanduk pos evakuasi`. Give each detail a purpose in the scene.
- Write the words people would say aloud. Use `pengait sabuk`, `tangga darurat`, `jalur samping rel`, and `meja kasir` in place of stiff or translated terms.

## Episode 002+ factory loop

1. **Write.** Budget strictly **115–130 spoken Indonesian words**. Gemini 3.8 Investigator thriller delivery averages roughly 1.7 words per second; measure each take. Count spoken words only. In the first sentence, establish both the situation and the survival rule within three seconds, as in “Saat macet di tengah wabah, jangan buka kaca.” Context belongs in the hook.
2. **Lock audio.** Reuse the existing prepared Investigator take when available; otherwise generate the entire script in one ShortZ request with `gemini-3.8-flash-tts`. The owner accepts this narrator automatically: listening approval is not a separate gate. Record the measured duration and available word timestamps without claiming unperformed review. Target **60–73 seconds prepared narration** and **62–75 seconds final video**, reserving a tail for the ending. Flag narration or video below 61 seconds or above 78 seconds. Tighten dead air without speeding the voice; preserve dramatic and foley pauses.
3. **Make panels.** Target **10–12 unique 9:16 key panels**, roughly one per 5–6-second story beat. Change the action, framing or tactical overlay within the beat to meet the plain-still limit. Keep each image assignment unique and avoid returning to a shot from a different mood. In Indonesian vehicles, specify **right-hand drive** in the prompt and verify the wheel, driver and dashboard orientation across angles.
4. **Assemble and review.** Specify a punchy, conversational **3–4 word `openingTitle`** in the manifest. Display it from **00:00.0 to 00:01.8** in the **upper center of the centered 3:4 crop**. On a 1080 × 1920 canvas, the centered crop spans y = 240–1680. Use **00:00.2** as the TikTok cover and verify it in the three-column profile preview. A 0.1-second flash thumbnail is prohibited. Run the [validator](scripts/check-episodes.mjs) and [final review](templates/review.md).

The validator enforces 60–73 seconds of prepared narration and 62–75 seconds for new final cuts, and emits a warning for durations below 61 seconds or above 78 seconds. Legacy Episode 001 cuts remain compatible. It also checks the `openingTitle` word count and repeated image paths. Verify title placement and timing in the preview.

## Format and script

Use **Survival-Tactics + Curiosity Gap** in every episode. The final cut runs **62–75 seconds** including its tail. Flat play-by-play narration is prohibited.

| Time | Required story beat |
| --- | --- |
| 0–3 s | Establish both the scenario and the survival rule in the first sentence. |
| 3–12 s | Make a promise and open a loop, for example *“…asalkan kamu tidak melakukan satu kesalahan fatal ini.”* |
| 12–55 s | Present numbered tactical steps in Indonesian, starting with *Pertama… Kedua…* Give each step a concrete survival detail and show it in the shot or diagram. |
| 55–70 s | Build quietly, then land a sharp twist that answers the open loop. Land the twist before the cut ends. |

## Climax tension and final jolt

Starting with Episode 003, preserve the grounded, uncanny `niskala` story and plan a kinetic payoff **after** narration, followed by a hard cut to black. Budget **1.0–1.5 seconds total from the final spoken word to the end**, including the vacuum, jolt and blackout; measure the final video against the 62–75-second target.

1. **Tension ramp:** During the final 3–4 seconds of narration, creep the camera inward, subtly darken the vignette and rise a low-end tension bed beneath the hushed voice.
2. **Silence vacuum:** At the final word or the trigger foley, hard-cut ambient sound for 120–180 ms before the strike. If trigger foley follows the last word, include that delay in the tail budget.
3. **Kinetic jolt:** Strike for 0.7–1.1 s with a dedicated close-up/lunge panel or rapid 1.0 → 1.18 snap-zoom, decaying high-frequency camera shake of ±12–18 px over 280–350 ms, and a stark 1–2-frame flash or chromatic split. Layer a tight sub-boom and a sharp discordant screech or uncanny distorted inhale/shriek; keep it crisp on phone speakers and limit the finished mix to **≤ −1.0 dBTP**, without harsh clipping.
4. **Blackout:** Hard-cut to black for 0.2–0.3 s before the loop. Keep the action and foley motivated by the episode; never spoil a silent rewatch clue with a sound accent.

For Episode 007, place the crowd’s synchronized head-snap jolt after the final narrated word, then show the calm `HARI 5 • MALAM` satpam boot-and-flashlight handoff before blackout. Budget that brief silent handoff inside the same 1.0–1.5-second tail; stage the final narration so this ordering is possible without rewriting the locked take.

## Protagonist and shot purpose

- A visible protagonist must appear in **at least 40% of shots**. Show them during the **first three seconds** to establish whose experience this is and where the threat is. Show at least **two reaction or action shots from 12–55 seconds**. The shot immediately before the final reveal must show the protagonist anticipating or reacting to the threat. An empty object or window must never cut straight to the scare.
- Use second-person Indonesian narration such as `kamu` and `mobilmu` so viewers can occupy the locked survivor’s role. Keep the survivor consistent across angles and episodes and show readable expressions or posture. Interleave eye-line inserts with embodied acting. Detached hands, dashboard inserts and empty windows do not count toward protagonist coverage.
- Every shot must have a readable primary purpose at 270 × 480. Show **character emotion**, **threat proximity**, or a **tactical HUD diagram**. Drop unreadable abstract close-ups. Never return to the same static plate less than **15 seconds** after its previous shot began. A different crop, HUD or filename does not make it a new plate.

## Picture and motion

- Preserve the illustrated raster backgrounds. Never hold a plain still for more than **2.5 seconds**. Use motivated cuts, visible action or animated graphics to direct attention. A quiet beat can still change visually. Caption changes, a static badge and subtle drift alone leave the underlying shot a plain still.
- Use reusable Remotion overlays on top of the artwork. Use `TimestampBadge` in the upper left for time or day, such as `• HARI 1 • 18:42`. Use `TacticalCallout` for a decision, state change or dashed guide such as `INSTING PERTAMA: LARI`, `RADIO MATI` or `GARIS JENDELA`.
- Show supplies with an animated `SupplyChecklist` notepad or card. Show water, food and battery with progress bars when those resources matter to the story. Use `RadarDiagram` or `BlueprintOverlay` for simple SVG schematics of tactics such as crowd movement or a locked door. Introduce graphics where they clarify the action.
- Lock one fresh raster batch per cut in the **gritty, dark-shaded anime/comic** style. The protagonist, hands, props, environment and threats must share the same linework, shading and level of detail. Flat dot-eye characters and cartoon inserts cannot be mixed into the batch. Previous attempts are staging references. Regenerate their plates and poses in the new style.
- Keep manifest media in the matching episode or attempt folder under `public/assets/`. Only shared sound effects and ambience may reference `public/sfx/`. Give the batch the `gritty-dark-anime-comic` style ID and assign that ID to every raster in the manifest. The validator checks paths and duplicate file contents. Confirm actual stylistic consistency in Studio.
- Use the shared sheets as design references for fresh panels. For an arc episode, put its number in the manifest’s `arcEpisode` and list the canonical public-relative sheet paths in `characterSheets`. These fields record continuity for the validator. Rendered plates and cutouts still come from the episode’s own batch.
- Bake characters into the scene or cleanly mask them behind an authored foreground seat, dashboard or other occluder. **Soft bottom-feathered character cutouts are prohibited.** Review seat contact and edges through the movement, especially for poses like the driver at 00:03 and 00:16 in the comparison cut.
- Show constraints and consequences in the picture. In *Kemacetan Terakhir*, the cars visibly block the driver and a hand contacts the headrest before the reveal. Sync the sound cue to the event.
- Lock recurring architecture, prop geometry and identity in an **Immutable Set & Identity Anchor** and keep changing conditions in a **Per-Shot State Table**. Use the relevant anchor verbatim and compare each shot with its own row before generation. Check transitions, floor and doorway scale, peeking sightlines, barrier contact, subtle reflections and exact Indonesian signage in the contact sheet and again in the finished MP4. [Image generator contract](agents/03-image-generator.md) · [QA auditor contract](agents/05-qa-auditor.md)

## Narration, captions and sound

- Write natural conversational Bahasa Indonesia. Keep the delivery masculine and mature, with clear articulation and deliberate pauses. Keep the clean ShortZ Gemini Flash master and word-timing record with the episode.
- Time the captions to the final narration. Aim for **3–4 words per beat**, with an absolute maximum of four. Use **bold uppercase condensed type** with a crisp dark stroke or drop shadow. Place captions in the **lower-middle safe zone above TikTok UI**. Dark semi-transparent pill backgrounds are prohibited.
- Show the narrator's caption text in white by default, with semantic highlights where appropriate, and without a `NARATOR` or `NARRATOR` speaker label. Show a colored speaker label for each non-narrator diegetic voice, such as yellow `PENCULIK`.
- Set semantic color per word in `captions.json`. Use `white` by default, `yellow` for key survival terms and `red` for danger or scare words. Check readability and sync at phone size.
- Use digits and match numeric formatting to the HUD, such as `60%`, `03:00` or `PUKUL 3 PAGI`. Spell numbers as needed in the spoken source and use the numeric form on screen.
- Start with recorded location tone and foley, then add a restrained tension cue where it serves the scene. Leave room for the narration and let a quiet beat hold before a knock or reveal. Use the shared recordings or add new assets with an explicit redistribution license and source credit.
- Keep narration text and sound directions separate. Send only spoken words to ShortZ. Put diegetic sounds such as door knocks in scene SFX cues and reserve audible space for them in the clean voice track. Caption the spoken line from the take. If a sound needs an accessibility caption, mark it as a sound cue timed to the effect.

### Heard-if-mentioned world audio

- **One narrator.** `investigator` is the locked storytelling voice for all Dimensi Niskala episodes. Keep the main narration a single-speaker track; never add multi-speaker narration parsing.
- **Hear what is mentioned.** Audit the final spoken script for every in-scene sound, voice, public announcement, and meaningful stop or silence. Put each in the brief’s mandatory cue sheet with its trigger, separate SFX/bed asset, treatment and mix rule; time it in `manifest.json` and reserve space in the mix. Explicitly mark visual rewatch clues that must have no sound accent.
- **Optional world voices.** Only when the episode explicitly mentions an in-scene voice or PA, generate `entity-female`, a flat, eerie young female voice for supernatural mimicry or close whispers, or `pa-announcer`, a flat, formal Indonesian public-announcement voice for loudspeakers, emergency radio or station TOAs. Treat each as a separate timestamped `voice-sfx` asset, not another main narrator. Record its source and rights; reuse the identical file when an identical repetition is required.
- **Acoustic profiles.** Use `node scripts/prep-sfx.mjs --profile <name> --input <source> --output <new-file>` to create a derivative without overwriting the source. Mix and listen in context; the filters do not set cue timing or levels.

| Profile | Purpose | FFmpeg filter chain |
| --- | --- | --- |
| `behind-wall` | Muffled interior, 300–1800 Hz, subtle room echo | `highpass=f=300,lowpass=f=1800,aecho=0.8:0.2:45:0.15` |
| `close-whisper` | Dry, intimate presence; 140 Hz low-cut | `highpass=f=140,equalizer=f=3200:t=q:w=1:g=2` |
| `toa-megaphone` | Nasal outdoor PA, 500–2800 Hz, light saturation and faint slapback | `highpass=f=500,lowpass=f=2800,asoftclip=type=tanh:threshold=0.8:oversample=2,aecho=0.8:0.25:85:0.18` |

## Finish a cut

Keep one brief, script, asset record and review. Reuse the engine’s graphic components and shared audio to support a production target of **2–3 videos per day**. Run the episode checks, then review the full cut at normal speed and phone size. Record asset provenance, voice rights and required credit before release. Check the actual platform preview and current disclosure rules when publishing is authorized. [Builder implementation ticket](ENGINE_UPGRADE_TICKET.md)
