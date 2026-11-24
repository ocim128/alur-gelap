# Episode brief (Studio v3 · Arsip Terakhir) — ARSIP #002: Pagi Jam Dua

## Archive Overview

- **Collection:** [Arsip Terakhir](../../arcs/03-arsip-terakhir/arc.json) · [Tanpa Nama ledger](../../arcs/03-arsip-terakhir/lore.md).
- **Public archive:** `ARSIP #002` (`archiveNumber: 2`, strip `ARSIP #002 · @skenarium`); `pipelineVersion: 3`.
- **Composition ID:** `Arsip02PagiJamDua` — registered in `src/Root.tsx`.
- **Runtime and format:** 70.87 s / 2,126 frames at 30 fps, 1080 × 1920.
- **Setting:** Pos 1 and Pos 2 on the fictional Gunung Rona Kecil, around 02.41. The mountain name is a production label, not a real-world location. Four friends' camping group: Wira owns the phone; Aji and Nino are together on the ridge at Pos 2 from the opening; Salsa is near camp. Aji's opening photograph shows the pair, using a plausible camera support or timer so both hikers and their feet are in frame.
- **Premise:** Wira's recovered chat opens on Aji's photograph of a bright-blue morning at night. Light comes down the ridge toward the camp; the friends stop answering one by one.
- **Survival angle (fiction only):** Wira stays in his zipped tent while the light approaches, then leaves to check on Salsa. The missing-person evidence establishes his disappearance; survival is not claimed and the sequence is not safety advice.

## Local Entity / Rule & `Tanpa Nama` (Never Explained Aloud)

- **Private production rule:** A heatless, false morning illuminated from overhead descends the mountain and envelops the trail and camp. Those who walk into it disappear; neither its cause nor mechanism is explained. There is no creature, voice mimicry or object-counting rule.
- **Viewer inference:** The clock and daylight contradict each other; Aji describes cold, Salsa hears morning birds and sees light descending, the photographs track its boundary from ridge to camp, and the group stops responding. A tiny shadow directly under each hiker hints that the illumination is overhead, not sunrise.
- **Tragic choice:** Wira remains zipped inside. After the empty yellow-tent photo, a calm text attributed to Salsa (`m16a`) asks him to come out; Wira replies he is leaving (`m17`). The retrospective `m18` label says he is missing. The text's authorship is not resolved or explained, and no vocal mimicry is introduced. The label does not assert a mechanism or death.
- **Series presence:** `Tanpa Nama` sends only `m19`, an uncaptioned final photo, with fixed grey default avatar and exclusive signature ping. No earlier appearance, phone number, explanation, solution, or self-description is scripted. The appearance is proposed, not approved canon; see the ledger.

## Characters & Texting Voices

| ID | Display name | Phone owner | Name color | Voice role | Texting and vocal personality |
| --- | --- | --- | --- | --- | --- |
| `wira` | Wira | Yes | `#C4B5FD` | none | `gw`, brief direct questions; becomes urgently practical. |
| `aji` | Aji | No | `#FDBA74` | `male-young-id` → Puck | Casual `woy`, `wkwk`; youthful *anak gunung* voice, amazed but puzzled by cold. |
| `nino` | Nino | No | `#6EE7B7` | `male-masc-id` | Grounded masculine Indonesian voice, unnervingly calm about the cold. |
| `salsa` | Salsa | No | `#F9A8D4` | `female-expressive-id` → Leda | Uses `aku`, addresses friends by name; bright expressive VN turns alarmed, followed by an eerie calm text. |
| `unknown` | Tanpa Nama | No | fixed series grey | none | Uncaptioned photo only. |

No speaking characters share a voice role. Nino's role is `voice_71a5a701-796e-421d-840e-0adc00b0816a`. The owner selected Leda and Puck from separate phone auditions; source details, prompts, technical caveats and unverified commercial terms are in the [voice roster](../../arcs/03-arsip-terakhir/voice-roster.md). F3's 169 wpm narrator-heuristic flag does not require slowing or pitch changes: keep natural delivery, check ASR alignment and a 2–6 s clip. The v1 Aji and Nino takes are retained; the v2 Salsa take is generated separately.

## Frame-Zero Hook (00:00.0)

At frame 0, Aji's photo and `02.41` stamp are already visible alongside the phone clock and six-word caption **“udah pagi di pos 2 woy”**. Two hikers and tiny shadows immediately under their feet are visible against a bright blue mountain sky. The caption and timestamp must be legible within two seconds; the clue itself also needs a phone-size still review. `startClock` is `02:41:20`; the clock rolls to `02.42` at frame 1200.

## Beat Map (No Rewind Loops)

| Time | Frames, start inclusive / end exclusive | Phase | Events | What happens |
| --- | --- | --- | --- | --- |
| 00:00–00:13.50 | 0–405 | Hook / camp normality collides with odd detail | `m1–m3` | Aji's blue-sky photo at 02.41; Wira asks whether Aji and Nino are at Pos 2; Aji says it is bright but cold. |
| 00:13.50–00:27.53 | 405–826 | Odd detail and movement | `m5–m7` | The white boundary appears on the ridge; Salsa hears birds and sees light coming down; Nino sounds eerily calm. |
| 00:27.53–00:42.87 | 826–1286 | Escalation | `m8–m12` | Aji confirms he and Nino are at Pos 2 and sends its white-lit trail. They stop answering. Salsa heads up to check and take a photo; Wira asks her to return. |
| 00:42.87–01:02.53 | 1286–1876 | Camp reached / fatal choice | `m13–m17` | Wira is zipped in; Salsa's yellow tent is open and empty. As light reaches camp, a calm message from her account asks Wira outside; he says he will leave. |
| 01:02.53–01:10.87 | 1876–2126 | Silence / reveal | `m18–m19` | Retrospective missing-person evidence; Tanpa Nama's ping and uncaptioned photo. |

## Timing Table

Times derive from event frame divided by 30; each event remains at least until the next one. Final event holds to end of cut.

| Start | Frame | Event | Visible artifact / subtitle |
| --- | --- | --- | --- |
| 00:00.00 | 0 | `m1` | Aji photo: `udah pagi di pos 2 woy` |
| 00:04.00 | 120 | `m2` | Wira: `ji lo sama nino di pos 2? ini jam 2.41` |
| 00:06.67 | 200 | `m3` | Aji VN: `Terang banget, tapi dinginnya kayak es.` |
| 00:13.50 | 405 | `m5` | Wira photo: `liat itu turun` |
| 00:17.50 | 525 | `m6` | Salsa VN: `Kok ada suara burung? Wir, cahayanya turun ke sini!` |
| 00:22.00 | 660 | `m7` | Nino VN: `Kok nggak capek ya? Kayak siang, tapi nggak ada angetnya.` |
| 00:27.53 | 826 | `m8` | Aji: `iya gw sama nino di pos 2 wkwk` |
| 00:30.20 | 906 | `m9` | Aji photo: `nih` |
| 00:34.20 | 1026 | `m10` | Wira: `ji? nin? jawab dong` |
| 00:36.87 | 1106 | `m11` | Salsa: `aku naik dikit cek mereka, foto bentar` |
| 00:39.87 | 1196 | `m12` | Wira: `sal jangan naik, balik ke tenda` |
| 00:42.87 | 1286 | `m13` | Wira: `sal? gw masih di tenda, resleting ketutup` |
| 00:45.87 | 1376 | `m14` | Wira photo: `tenda kuning lo kebuka sal` |
| 00:50.20 | 1506 | `m15` | Wira: `sal jawab, cahaya udah sampe sini` |
| 00:53.20 | 1596 | `m16` | Wira photo: `terang banget` |
| 00:56.20 | 1686 | `m16a` | Salsa: `keluar aja wir, udah pagi` |
| 00:58.87 | 1766 | `m17` | Wira: `sal? gw keluar bentar` |
| 01:02.53 | 1876 | `m18` | Evidence: `Wira, Salsa, Aji, Nino hilang · 03.49` |
| 01:05.87 | 1976 | `m19` | Tanpa Nama uncaptioned photo; holds through 01:10.87. |

## One-Watch Comprehension Plan (Q1–Q4) & Archive Metadata

- **Q1:** `HP milik: Wira` and outgoing bubbles identify the owner.
- **Q2:** Full daylight at 02.41, unexpectedly cold, with morning birds and a white light boundary descending to camp.
- **Q3:** Aji and Nino are together at Pos 2 and stop replying; Salsa goes to check, her tent is open and empty, and a later calm text arrives from her account. All are named missing in the evidence label. Exact disappearance mechanics and authorship of that text are not shown.
- **Q4:** Wira, previously zipped inside, says he is leaving in response to Salsa's text after the light arrives; the evidence label names him missing. The final silhouette is deliberately unidentified.
- **Two factual metadata lines:** identity strip `HP milik: Wira`; retrospective end label `Wira, Salsa, Aji, Nino hilang · 03.49`. The second is evidence discovered after the 02.41–02.42 chat, not a new chat timestamp. Both need ≥42 px within the critical safe zone.

## Cold-Read Result (Model Proxy — NOT Audience Evidence)

**v2 strict fresh-context gate, 2026-11-25:** A fresh-context model sub-agent was instructed to read only [the retained strict input](sources/cold-read-input.md), exported from the v2 script with `node scripts/export-cold-read-input.mjs episodes/008-pagi-jam-dua --out episodes/008-pagi-jam-dua/sources/cold-read-input.md`. It contains only on-screen text, subtitles, metadata and literal still descriptions. This gate occurred **after the v1 assets already existed but before generating the replacement v2 assets**; it cannot retroactively establish the missing retained pre-v1 gate evidence identified by Agent 05. The owner explicitly requested this post-asset re-check. It is a model proxy, not audience evidence or approval.

- **v2 script SHA-256:** `087eb49702c170bb95b0eed058eecabe2f80140147523ed9161e863c18671587`

> Q1. The archive is from Wira’s phone; the evidence label explicitly identifies him as its owner.
>
> Q2. At around 02.41, an unnaturally bright, cold daylight appeared at Pos 2 and descended toward the tents, even though it was still the middle of the night. Aji and Nino stopped responding after showing the light.
>
> Q3. The evidence label says Salsa, Aji, and Nino were missing by 03.49. Aji and Nino were last established at Pos 2; Salsa went uphill to check on them and her tent was later seen empty. Her later message telling Wira it was morning is suspicious, but the material does not establish who or what sent it.
>
> Q4. Wira said he would go outside after Salsa’s message, and the evidence label says he too was missing by 03.49. He probably went out into the strange light and disappeared; the distant figure in the final photo might be him, but its identity and his exact fate are not established.

The answers identify Wira, the abnormal light, the others' missing status and Wira's likely disappearance. This supports the text gate only; actual images, audio and first-watch comprehension still need review.

### Previous v1 model-proxy result (historical; strict input was not retained)

- **Status:** Pass as a text-and-literal-still model proxy, not audience evidence or a phone-size image review. This is a new fresh-context review of the revised voice-assignment, opening and Salsa-message script.
- **Script SHA-256:** `c8ef58ec335d18400d38900449e316d0ddae42bcda7593aac7b429fbaa38836f`

> **Q1 — Whose phone is this?** Wira’s; the evidence label identifies it as his.
>
> **Q2 — What was wrong?** Bright daylight appeared on the mountain at 02.41 and moved downhill toward the tents. It was unnaturally cold despite looking like daytime. Aji and Nino seemed comfortable in it, and Salsa later called it morning too.
>
> **Q3 — What happened to the others?** Aji and Nino stopped responding after reaching Pos 2. Salsa went up to check on them; her tent was then found open and empty. The label says all three disappeared, but their exact fates are unknown. Salsa’s later message could mean she returned or was still able to use the chat, though it may also have been sent by something imitating her.
>
> **Q4 — What probably happened to Wira?** He left the tent after Salsa’s message and disappeared as well. The final photo may show him walking into the bright fog, but the figure is too indistinct to identify. It is also unclear who took the photo.
>
The reviewer identifies the four missing people and Wira's action. Their alternative interpretation of the calm text is not established as fact; the script introduces no voice mimicry and does not resolve its authorship. The label establishes missing status, not death, and the final figure and photographer remain unidentified. The proxy input does not represent the actual generated stills, sound or playback.

## Fair-Play Clue Ledger

| Clue | Plant | Payoff | Phone-size execution |
| --- | --- | --- | --- |
| Short, directly underneath shadows betray overhead light despite the apparent morning. | `m1`, 00:00 / frame 0, 0% of runtime. | `m16`, 00:53.20 / frame 1596: short shadow directly under the tent pole inside the incoming white boundary. | Compose boots and shadows visibly in the opening bubble; `m1` zoom starts at offset 42 (01.40 s), after the crisp hook. `m16` zoom targets pole base and shadow; `m9` zoom clarifies the Pos 2 whiteout. No arrow or explanatory text; validate actual crops and ≤6-frame overlay fades. |

## Ending (Recasts Everything, No Recap)

`m19` is an uncaptioned photo sent by Tanpa Nama after the missing-person evidence. A small, back-facing unidentified figure is centered within a luminous white haze; recognizable dark tent and ridge edges keep it legible as a place, not an empty or broken image. Its presence in a newly sent photograph after the group is missing recasts the archive without identifying the figure or the photographer. No narrator, recap, or survival declaration.

## Reading-Pace Budget

The script contains 19 events: 9 text messages, 3 voice notes, 6 photos, and 1 evidence label. Applying `max(1.2 s, 0.18 s × words + 0.6 s)` to each text-bearing event yields a script-validated minimum hold versus 2,126 frames / 70.87 s planned. Each event's actual hold is checked independently by `check-v3.mjs`. Voice durations are measured from the retained and regenerated WAVs; no handwritten `durationSec` is used.

## Visuals List (3–6 Amateur Phone Photos / CCTV Stills)

All are phone photos, gore-free, handheld and intended as imperfect low-light captures. The descriptions below exactly match the script's blind inputs; names and relationships must be inferred from chat or visible labels, not embedded into a supposedly literal description. The retained v1 images exist; m16 was replaced for v2 following the v1 audit.

| Asset path under `public/` | Event ID | Literal description |
| --- | --- | --- |
| `assets/008-pagi-jam-dua/still-01-pos2.jpg` | `m1` | Dua pendaki berdiri di punggungan di bawah langit biru cerah; bayangan kecil berada tepat di bawah kaki mereka. |
| `assets/008-pagi-jam-dua/still-02-lereng.jpg` | `m5` | Dari balik jaring tenda terlihat jalur berkabut gelap dan batas cahaya putih terang melintang di lereng atas. |
| `assets/008-pagi-jam-dua/still-03-pos2-putih.jpg` | `m9` | Jalur berbatu dan papan Pos 2 tampak terendam cahaya putih sangat terang; tepi cahaya dan kontur tanah masih terlihat. |
| `assets/008-pagi-jam-dua/still-04-tenda-salsa.jpg` | `m14` | Dari balik jaring tenda terlihat tenda kubah kuning terbuka dan kosong dengan lampu kepala menyala di dalamnya; jalur dan kabut terang terlihat di belakangnya. |
| `assets/008-pagi-jam-dua/still-05-camp.jpg` | `m16` | Dari balik jaring tenda terlihat tenda kuning terbuka dan batas cahaya putih di tanah; bayangan pendek berada tepat di bawah tiang tenda. |
| `assets/008-pagi-jam-dua/still-06-sosok.jpg` | `m19` | Sebuah sosok kecil membelakangi kamera di tengah kabut putih terang; tepi tenda dan garis punggungan gelap terlihat di kedua sisi. |

**Visual progression for the eventual image handoff:** `m1` has a readable blue sky, clearly lit figures and immediately underneath shadows. `m5` establishes a horizontal bright boundary high above a recognizable dark ridge; `m9` retains the Pos 2 sign and textured trail inside its much brighter white field, with the field's edge still visible; `m14` keeps the distinctive yellow dome tent, glowing headlamp and trail readable; `m16` places the boundary across camp with dark foreground, the same tent and pole-shadow payoff. `m19` retains dark tent/ridge contours surrounding the white haze and the single, clearly legible central silhouette. Use the same identifiable ridge/camp geometry where applicable; keep edges, foreground texture and graded falloff, never a blank white rectangle, illustration, creature or gore. Wira's `m5`, `m14` and `m16` are shot through a closed mesh window, consistent with `m13` and the later decision to unzip. No photo from Salsa is delivered after her intention to take one; her later calm message is text only.

## Audio & Sound-Design Cue Sheet (No Melodic Music)

Frame ranges are start-inclusive/end-exclusive. All levels are mix targets to verify on actual assets; `>= -50 dBFS` is an active-floor requirement outside `silenceDrops`, not a measurement or a license to raise true-peak beyond delivery limits. Voice-note recordings must measure 2–6 s each and remain within their allocated holds. Planned sources are dependencies, not generated files; source and rights records go in `assets.md` and `public/sfx/LICENSES.md` at the asset stage. **listening review: none.**

| Cue | Frames | Time | Type | Planned content / target |
| --- | --- | --- | --- | --- |
| `bed` | 0–1876; 1976–2126 | 00:00–01:02.53; 01:05.87–01:10.87 | location bed | High-altitude night wind, tent-canvas flaps and occasional gravel; audible on phone speakers. Continuous bed supports active floor. |
| `crickets` / `birds` | 0–45; 45–525, then recede | 00:00–00:01.50; 00:01.50–00:17.50 | diegetic clue within bed | Crickets cut abruptly at frame 45 while dawn birds swell at 02.41; no melody. Their contrast with the continuing wind should be audible on a phone. |
| `tension` | 120–1876 | 00:04–01:02.53 | non-melodic tension | Rising low rumble with 90–220 Hz harmonics, modest at start and phone-audible through escalation; no melodic music. |
| `m3` | 200–405 | 00:06.67–00:13.50 | voice-note hold | Aji (`male-young-id` / Puck): `Terang banget, tapi dinginnya kayak es.` Wind and light gravel; youthful, initially casual. Actual clip must be 2–6 s. |
| `m6` | 525–660 | 00:17.50–00:22 | voice-note hold | Salsa (`female-expressive-id` / Leda): `Kok ada suara burung? Wir, cahayanya turun ke sini!` Close breath, canvas and birds; a startled reaction, not narration. |
| `m7` | 660–826 | 00:22–00:27.53 | voice-note hold | Nino (`male-masc-id`): `Kok nggak capek ya? Kayak siang, tapi nggak ada angetnya.` Wind and gravel; controlled, eerily calm masculine delivery. Fit the measured 2–6 s take within this 5.53 s hold; no speed hack. |
| `ui` | arrival frames 120–1766 for ordinary messages | 00:04–00:58.87 | UI SFX | Regular incoming/outgoing pops only for ordinary character events. Opening is already visible, with no required arrival pop. |
| `silence-1` | 1876–1976 | 01:02.53–01:05.87 | silence-drop | Hard drop at `m18` evidence to near-silence; explicitly listed in `audio.silenceDrops`. |
| `m19-ping` | 1976 | 01:05.87 | Tanpa Nama signature | `public/sfx/shared/tanpa-nama-ping.wav` only at Tanpa Nama's `m19` arrival. Bed returns after the silence window. |

## Series Identity, Brand Safety & Upload Disclosure

- Solid `ARSIP #002 · @skenarium` identity strip under the header; no on-screen `FIKSI`. All story text, header and evidence ≥42 px, inside `x >= 0`, `x + width <= 950`, `y >= 192`, `y + height <= 1497`; frame-based motion, overlay transitions ≤6 frames. Check the actual render, not just constants.
- Use the original generic `Pesan` design; no WhatsApp, Telegram or Line branding, colors or icons. No realistic numbers, real identifiable people or defamatory place names.
- Upload is a separate action. A future caption draft must include `#fiksi` and `#ceritahorror`, and the platform AI-generated-content label must be enabled at upload.
- Asset provenance and rights are recorded in `assets.md` and the review in `review.md`. The owner selected separate voice auditions; episode listening approval and publication have not been recorded.
