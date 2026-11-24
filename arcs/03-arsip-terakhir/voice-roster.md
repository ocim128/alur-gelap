# Arsip Terakhir — Studio v3 character voice roster

These reusable roles are **in-world character voices**, never narrators. Assign a distinct role to each speaking character in an episode. The owner selected F3 and M1 after listening to the named audition clips on a phone on 2026-11-24; that selection is not approval of a future episode recording or mix.

| Role | Voice | Provider / model | Use and evidence |
| --- | --- | --- | --- |
| `female-expressive-id` | `Leda` (F3) | Google Cloud Agent Platform via ShortZ `gemini-cloud`, `gemini-3.8-flash-tts`, `id-ID` | Bright, quick, expressive Indonesian friend. Owner listened to and selected `out/voice-audition-v3/F3.mp3` (SHA-256 `d4c150514fe480203f97538dba46bd70bc6f0d95781458a737e30e29d3d60adf`) on 2026-11-24. Audition: 4.625 s; ASR alignment passed; ShortZ overall QA failed its formal-narrator WPM heuristic at 169 wpm and warned of a possible onset issue. The owner selected the natural conversational delivery; do not artificially slow or pitch-hack it. For each future 2–6 s voice note, verify ASR alignment, boundaries and actual duration. |
| `male-young-id` | `Puck` (M1) | Google Cloud Agent Platform via ShortZ `gemini-cloud`, `gemini-3.8-flash-tts`, `id-ID` | Young, light, easygoing *anak gunung* voice. Owner listened to and selected `out/voice-audition-v3/M1.mp3` (SHA-256 `956d1dc5730a9c0ac9b6a4aaf555ca8681144f90dc95d4e70e116cbe01780f8c`) on 2026-11-24. Audition: 5.385 s, ASR alignment and overall ShortZ QA passed; report warns of a possible onset issue. Future episode takes need their own checks. |
| `male-masc-id` | `voice_71a5a701-796e-421d-840e-0adc00b0816a` | Google Cloud via ShortZ `gemini-cloud`, `gemini-3.8-flash-tts` | Mature masculine Indonesian male; existing owner-selected voice repurposed for in-world characters. |
| `male-deep-2` | `Charon` | Google Cloud via ShortZ `gemini-cloud`, `gemini-3.8-flash-tts` | Reserve contrasting role; avoid pairing with `male-masc-id` where high vocal contrast is needed. No new selection or listening review claimed. |
| `male-deep-3` | `Orus` | Google Cloud via ShortZ `gemini-cloud`, `gemini-3.8-flash-tts` | Reserve contrasting role; avoid pairing with `male-masc-id` where high vocal contrast is needed. No new selection or listening review claimed. |

## Audition prompts and reproducibility

Both selected auditions used the shared spoken line: “Eh, masih jam setengah tiga, kan? Kok di atas sana udah terang banget?” Their exact requested direction was:

- **F3 / Leda:** “Natural Indonesian female voice note, youthful bright expressive friend, quick conversational rhythm without rushing, spontaneous and playful at first then subtly uneasy at the light. Everyday Indonesian, human and understated, no announcer, no narration, no acting theatrics.”
- **M1 / Puck:** “Natural Indonesian male voice note, young light voiced easygoing camping friend, relaxed anak gunung conversational register, playful at first then subtly uneasy at the light. Everyday Indonesian, human and understated, no announcer, no narration, no acting theatrics.”

Source references: `out/voice-audition-v3/audition.ts`, `line.txt`, `README.md`, `F3-report.json`, `M1-report.json` and their timestamp sidecars. These are ignored, local audition artifacts and are not committed. The existing ShortZ CLI voice whitelist did not include Leda or Puck at audition time; the local audition wrapper added those names and supplied the style direction without changing ShortZ source. Future production must preserve a usable invocation and prompt provenance rather than assuming the stock whitelist accepts them. Auditions were unmastered ShortZ MP3 outputs, not untouched provider WAVs; no speed or pitch change was applied.

## Rights and review status

Google Cloud service and voice terms for commercial publication remain **unverified** for all roles. Voice selection does not establish publication rights. Log each episode take, model, prompt, source, alignment, duration, rights and actual listening status in the episode's asset record. The owner listened to the two named audition files only; **episode audio listening review: none** until a specific episode artifact is actually reviewed.
