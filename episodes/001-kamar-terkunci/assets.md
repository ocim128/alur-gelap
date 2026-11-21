# Image asset record

- **Status:** draft batch failed self-audit; do not use as an approved assembly batch. See [generation and audit record](sources/prompts.md).
- **Plates:** `public/assets/001-kamar-terkunci/p01.webp` through `p24.webp`. Each is a distinct 936 × 1664 lossless WebP. P01 was approved by the owner; P02–P24 are unapproved drafts. P04 is a prop-free substitute and does not establish the required key and knife.
- **Contact sheets:** `panels-contact.jpg` and `panels-contact-01-06.jpg`, `panels-contact-07-12.jpg`, `panels-contact-13-18.jpg`, `panels-contact-19-24.jpg` in this episode directory. Built with `sources/build-contact.py`.
- **Unselected hatch candidate:** `public/assets/001-kamar-terkunci/p03-hatch-audit-candidate.webp`; it does not resolve phone-size face readability. The original P03 draft remains selected on the contact sheets.
- **Scoped audit correction:** P16 was replaced with a generated blue-corner towel-spread candidate; the previous selected P16 is preserved at `sources/scoped-retry-before/p16.webp`. P14 and P19 candidates remain separately saved and unselected. See `sources/scoped-audit-retry.md` for provenance and exact prompts.
- **Orchestrator direction:** The owner approved 22 plates and waived the prior P02, P03, P08 and P14 findings without changing those assets. P19 was subsequently replaced with the owner's floor-seated staging; its prior selected version is retained at `sources/orchestrator-before/p19.webp`. P04 is unchanged and its visual prop setup remains missing. See `sources/orchestrator-p19.md`.
- **Provenance:** built-in image generation, based on the owner-approved character profile and P01, with Attempt 07 as earlier style reference. Source images were 941 × 1672 PNGs; each was mechanically center-cropped to 936 × 1664 and encoded losslessly as WebP. The tool's generated originals remain in its generated-images directory; correction attempts are recorded in `sources/`.
- **Rights and dependencies:** No external stock source was supplied for these plates. Applicable generated-image terms and publication rights have not been independently reviewed. Sound, narration, composition and other external dependencies remain unestablished; no claim of publication clearance is made.

## Assembly assets and audio

The review draft uses the selected P01–P24, `narration-prepared.mp3`, `narration-timestamps.json`, and the separate `captor-muffled.wav`; their provenance and limitations are described above and in the audio handoff. `assembly-handoff.md` records the shared effects, locally synthesized blackout hit, credit requirements, and pending rights verification. Cue positions and gains are in `manifest.json`; `mix.py` builds a non-destructive mix. No publication rights or listening approval are implied.
