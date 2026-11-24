# 03 · Image Generator

## Mission & Scope

For **Studio v3 (*Arsip Terakhir*)**, generate **3–6 raw amateur phone photos or CCTV stills** per episode — styled as authentic low-light handheld photos or security camera captures (sensor noise, harsh phone flash, slight blur, natural clutter), **not** 2D illustrations or silhouette panels.

## Required Inputs & Preconditions

Read the approved `episodes/<slug>/brief.md` (especially the Clue Ledger and Visuals list), `episodes/<slug>/chat-script.json`, `STYLE_GUIDE.md` ([Studio v3](../STYLE_GUIDE.md#studio-v3--arsip-terakhir)) and `pipeline-state.json`. Require `brief` approved before generating final stills.

## Allowed Write Scope

The assigned episode's stills under `public/assets/<episode>/`, `episodes/<slug>/sources/prompts.md`, `episodes/<slug>/assets.md`, contact previews and the episode's `images` pipeline state. Preserve all archived 001–006 and Arc 01 assets.

## Hard Prohibitions (NEVER)

Never produce illustrated, anime, comic or Urban Silhouette Noir plates for Studio v3. Never include gore, real identifiable people, real phone numbers, copyrighted app screenshots, or real place names/signage that could defame anyone. Never highlight or circle a fair-play clue with artificial glow or arrows.

## Studio v3 · Execution Steps & Output Artifacts

1. **Generate 3–6 amateur phone-photo or CCTV stills:**
   - Match the episode's Indonesian setting (pos ronda, kos hallway, minimarket shift malam, KKN house, etc.) with grounded local props and natural imperfection: smartphone flash falloff, ISO grain, fluorescent/sodium-vapor cast, slightly crooked handheld framing, or grainy monochrome/IR CCTV lens perspective.
   - Keep every still strictly **gore-free**.
   - **Fair-play visual clue readability:** Verify that any Clue Ledger detail (for example, four pairs of sandals outside a pos ronda where only three men are on watch) is clearly countable and readable at **phone size** inside a chat photo bubble and during its tap-to-expand zoom, while blending naturally into the photograph.
   - **Brand & defamation safety:** Ensure signs, banners, license plates and storefronts use generic or clearly fictional wording (e.g., `POS RONDA RT 07` without a real village/kecamatan name that could defame a real community).
2. **Inspect at phone size and log provenance:**
   - Inspect every generated still at phone width (~270–360 px) and zoomed crop. Regenerate if the planted clue is obscured, miscounted or looks overly polished/illustrated (at most twice per still; record retries).
   - Record every file path, prompt summary, generation tool, date, dimensions, and rights/provenance in `episodes/<slug>/assets.md` and `episodes/<slug>/sources/prompts.md`.
3. **Update `pipeline-state.json`:**
   - Set `images` to `ready` for review or record the structured stage verdict/exceptions per [stage records](README.md#stage-records).

---

## Archived · Studio v2 / v1 Image Generator contract (Urban Silhouette Noir / 24 panels)

> Archived on 2026-11-24. Grandfathered for Episodes 001–005 and Arc 01; Scenario 006 is paused. Do not apply Urban Silhouette Noir or 24-panel rules to Studio v3 episodes.

- **Master Style Anchor.** Use the original Urban Silhouette Noir references in [`docs/style-anchor/`](../docs/style-anchor/) for style. Character sheets establish identity and continuity. Never substitute prior episode panels or transfer their sets, props or lighting into a new episode. Flag missing anchors.
- **Style-Anchor Weather Guard.** The reference images can leak rain streaks, wet glass, wet pavement, urban signage and street lights into dry or clear scenes. Explicitly override these details in each affected prompt and reject leaked details in the outputs. If the override repeatedly fails, document a dry/clear variant under `docs/style-anchor/` for owner selection. Use it once approved and record its path and applicable shot states in `sources/prompts.md`.
- **Word count.** [Agent 01](01-showrunner.md) owns the script length. Once the brief and narration are accepted, proceed with the locked script.

## Allowed Write Scope

The assigned episode's fresh `public/assets/<episode>/` image batch, `panels-contact.jpg`, `sources/prompts.md`, asset/rights record and `images` pipeline state. Save standalone thumbnail JPGs in `out/<slug>/`. Preserve existing sheets, previous attempts and approved outputs.

## Hard Prohibitions (NEVER)

Never mix old-attempt panels or styles, invent missing geography, reuse a panel across moods, render unreadable abstract filler, alter locked characters, or reveal a silent rewatch clue with an audio/visual accent. Replace failed panels in place only within the current batch before handoff. Preserve previous attempts and approved assets.

## Execution Steps & Output Artifacts

0. **Separate fixed facts from shot state before generating.** Copy the approved **Immutable Set & Identity Anchor** and **Per-Shot State Table** into `episodes/<slug>/sources/prompts.md`. Preserve the aircraft or room type, fixed seating and geography, character silhouettes and rim colors, and fixed prop geometry. Use only relevant fixed facts, verbatim, in each prompt, including retries. Keep changing facts in the shot row for every panel P01–P24 and any separate jolt plate. Include vantage, visible people and positions, anomaly presence, key prop states, lighting, weather, exact narrated action and external Remotion effects.
   - **Reject contradictory prompts before generation.** Check each draft against both the anchor and the current shot row. Remove inherited states, such as an anomaly hand after the anomaly has departed or glowing instruments in a dark cockpit. If the shot row and anchor conflict, resolve the discrepancy with the approved brief before generating. Check adjacent rows for intended continuity and explicit rewind resets.
1. **Risk & Transition Gate.** Get the owner's approval for both checks before generating the remaining 9:16 WebP panels. Record the selected plate versions, review evidence and decisions in `sources/prompts.md`.
   - **Visual Style & Identity Check.** Review the character and prop sheet and hook plate together for style, silhouettes, rim colors, prop geometry and hook readability.
   - **Continuity & Hardest-Mechanics Gate.** Select the 4–6 highest-risk panels and review their transitions together at phone size. Cover the hardest physical interaction, a key prop change, the climax payoff and the ending → jolt pair. Include the before and after plates needed to judge each change. Resolve failed checks or record an explicit owner exception before expanding the batch.
   - Generate the remaining plates in small continuity groups. Apply the spatial checks below to each prompt. Specify vantage, crop, hinge and contact side, and the angle of any reflective clue. Keep floors and the bottom of doorframes out of waist-up portraits.
   - Render walls, floors, doors, props and characters in the same hand-inked 2D graphic-novel medium. Characters must be solid matte black ink silhouettes (`#07080B`) with zero skin tone and no drawn faces, eyes, noses or eyebrows, defined only by sharp rim-light contours and minimal flat graphic ink folds. Only non-human threats or looming figures in deep shadow may show minimal pale pinpoint eye glints. Use crushed black shadows, flat graphic color blocks and harsh practical light contrast; no soft painterly shading, 3D gradients or anime, manhwa or webtoon face rendering. Do not paste flat vector characters onto photorealistic 3D backgrounds or copy stiff symmetric A-poses and white internal diagram outlines from turnaround sheets. Choose 1–2 practical light accents appropriate to this setting and use harsh red/amber for a bad branch.
   - Make each panel ID one clean single frame. Exclude split screens, picture-in-picture insets, thought projections and multi-timestamp montages. When the protagonist already appears full-body, use `empty POV — no foreground character in frame` instead of a blurred foreground duplicate.
   - Use neutral visual descriptions for non-graphic image prompts, such as `tall silhouetted man`, `bob-haired woman` and `dramatic 2D mystery comic panel, zero blood, zero graphic contact`. Avoid loaded crime or gore terms such as `captor`, `captive`, `stab`, `murder`, `dead` and `victim`. Omit weapon props from pure action close-ups such as a hand turning a key. Preserve the approved story and use the appropriate setting and character identity.
   - Keep falling rain outdoors or visible beyond glass and doorways. Covered interiors and tunnels may have wet surfaces. Every prompt specifies either a blurred foreground silhouette for depth or `empty POV — no foreground character in frame`.
   - **No baked-in timed effects.** When Remotion controls a transient event, do not paint it into the static plate: omit lightning bolts, flash glare and rain streaks inside dry rooms. Supply a clean, temporally neutral background so overlays can appear only at their scheduled frames.
   - Apply the **Show-What-You-Say Panel Lock**. Every narrated threat or visible action needs a panel depicting it during the line. Resolve missing coverage before handoff.
   - Follow the scenario's fresh character design and the **Fair-Play Clue Ledger**. Make every visual setup clue readable at phone size through its silhouette shape, placement or a practical light accent. Let it blend naturally into the setting and keep it out of unreadable black shadow. Check each ledger entry before generating the payoff panels.
2. Keep vehicle geometry consistent. Indonesian vehicles are RHD, with the wheel and driver door on the right and seatbelt over the driver's right shoulder. Keep the windshield and rearview mirror in front of the driver and wheel, and use an interior 3/4 passenger-side angle to show both driver and mirror. Keep one-way traffic aligned, vehicle door hinges at the front A-pillar and truck side mirrors on the front cab. Carry prop states such as an unbuckled belt across cuts.
3. Audit each continuity group and the final `panels-contact.jpg` at phone size as **before → after** pairs. Log state changes, pass/fail and evidence in `sources/prompts.md`. After replacing a plate, recheck both adjacent transitions and every previously passing fact the edit could affect. Label each visual defect `absent` (required detail missing), `present_unreadable_at_phone_size` (detail is there but cannot be read) or `present_conflicting_state` (visible detail contradicts the anchor, shot row or transition). Use the five checks below. Check anatomy with scale, clue readability with reflection and text, and silhouette, hair and clothing with the identity anchor.
   - **Location and prop anchors across Reveal → Jolt.** Compare consecutive panels, including the reveal and `panel-final-jolt.webp`, against the verbatim location anchor. Check door and gate construction, frames, handles, flooring, lighting and hero props. Carry deliberate changes in prop state across cuts.
   - **Floor and door scale.** In medium and close shots, crop out the floor and bottom doorframe. When a full-height doorway or gate and the ground are visible, show every standing figure head to shoe at roughly 70–80% of the doorway or gate height. Check for limbs cut off at floor level and stretched anatomy, especially forearms.
   - **Camera vantage continuity.** Compare each hiding or peeking shot with the next shot of what the protagonist sees. Keep the established oblique sightline from the corner, landing, pillar or car unless the protagonist visibly steps out. Apply the same check across Reveal → Jolt.
   - **Barrier and reflection physics.** Check that hands contact reachable surfaces on the correct side of doors, stairs, railings, windows, gates and glass. Check hinges, swing direction and open or closed state. For mirrors and reflective glass, confirm the plane faces the reflected subject at a plausible angle and the subtle clue reads at phone size without glow, artificial highlights or sound accents.
   - **Indonesian text spelling.** Compare script-mandated signs and lettering with the exact approved text. Check for garbled, missing or substituted letters, including in `PINTU KELUAR`, `JANGAN IKUT BARISAN` and required minimarket or station signs.
4. Allow stylized mirror exaggeration when RHD, reflected sightlines and phone readability hold up. Treat broken anatomy or legs, indoor rain, unrequested figures, incorrect plot-bearing signage and Show-What-You-Say mismatches as failures. Regenerate only the failing panel and rebuild `panels-contact.jpg`. Try at most **twice per panel**. Record unresolved defects and retry counts and include the prompts, transition audit and rights record in the handoff.

## Studio v2 · Episode Thumbnails and Covers

1. **Start from the episode.** Read its approved brief, narration and Fair-Play Clue Ledger, then inspect the selected panels or latest cut. Generate thumbnails once the relevant artwork and character identities are locked. For a thumbnail-only request on an existing episode, use those same inputs and the latest owner-selected thumbnail, if available. Use the installed ImageGen skill for raster generation and edits.
2. **Write the hook from a first-time viewer's point of view.** Use short, conversational Indonesian. Make the stakes, choice or visible anomaly understandable without the title, captions or earlier episodes. Give a countdown an objective and pair words like `dia` with a clearly identifiable figure. Use the opening premise and keep hidden mechanics, escape solutions and final reveals out of the text and artwork. Match any wording the owner supplies verbatim. Owner-selected examples include `3 MENIT KABUR DARI PENCULIK` for 001, `JANGAN SAMPAI DIA TAHU KAMU DI SINI` for 002 and `DIA NGGAK OLENG` for 003. Apply the underlying approach to each new scenario.
3. **Match the actual episode art.** Use the same episode's final panels or locked character sheets as identity and scene references. Check the silhouette, proportions, head, distinctive features, clothing and relevant props for both the survivor and the threat. Retain Urban Silhouette Noir and the episode's lighting. Show one readable scene whose composition makes the headline meaningful. When revising only the text, use the most recently selected artwork as the edit target.
4. **Deliver two layouts.** Export a **1280 × 720 JPG (16:9)** as `out/<slug>/thumbnail-youtube.jpg` and one shared **1080 × 1920 JPG (9:16)** as `out/<slug>/cover-social-9x16.jpg` for Instagram Reels, TikTok and Facebook Reels. Recompose the vertical artwork and type for the narrower frame. Keep the full headline and the identifying visual in the centered 3:4 region (y = 240–1680 on the vertical canvas). Make separate platform variants only when the target placement requires a different asset. Save revisions with a version suffix, such as `thumbnail-youtube-v2.jpg`.
5. **Review and hand off the stills.** Open the saved JPGs at phone size, including a centered 3:4 crop of the vertical cover. Verify exact text, spelling, contrast, crop, dimensions and character fidelity. Record the final copy, paths, reference panels, generation tool and any open issue in the episode's prompt and asset/rights records. Link the JPGs in the handoff. [TikTok's documented cover picker](https://support.tiktok.com/id/using-tiktok/creating-videos/editing-posting-and-deleting) selects a frame from the video. If the target upload flow requires that, flag it to Agent 04 for a separately authorized video variant. Agent 03 delivers the stills and leaves video assembly and publication to their respective roles.

## Handoff Update (pipeline-state.json)

Use `ready` while the full batch awaits technical review. After the transition audit, record the technical result and the owner's separate disposition using the [stage record contract](README.md#stage-records). Keep `technicalVerdict` and `status` at `fail` for a batch with unresolved defects, even when the owner allows handoff. For each accepted exception, record the affected panel or pair, defect label, evidence and the exact check Agent 04 or 05 must perform. Mark dependent renders stale when assets change.
