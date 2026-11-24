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

Archived Studio v2 / v1 Image Generator contract lives in [archive/agents-v2-v1/03-image-generator.md](../archive/agents-v2-v1/03-image-generator.md).

## Handoff Update (pipeline-state.json)

Use `ready` while the full batch awaits technical review. After the transition audit, record the technical result and the owner's separate disposition using the [stage record contract](README.md#stage-records). Keep `technicalVerdict` and `status` at `fail` for a batch with unresolved defects, even when the owner allows handoff. For each accepted exception, record the affected panel or pair, defect label, evidence and the exact check Agent 04 or 05 must perform. Mark dependent renders stale when assets change.
