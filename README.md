# alur-gelap

A Remotion project for illustrated Indonesian survival-fantasy videos. The current Studio v2 direction is a standalone anthology of 2–3 minute survival scenarios. [Kamar Terkunci](episodes/001-kamar-terkunci/brief.md) is the first pilot; the earlier *Kemacetan Terakhir* episodes are Arc 01 production history and tone references.

## Preview and check

Use a Node version supported by [package.json](package.json), such as Node 22.13 or newer in the Node 22 line. From the repository root:

```powershell
npm ci
npm run dev
npm run check
npm run build
```

The terminal prints the Remotion Studio URL. Open `Skenario01KamarTerkunci` for the v2 pilot. Its [assembly handoff](episodes/001-kamar-terkunci/assembly-handoff.md) and [pipeline state](episodes/001-kamar-terkunci/pipeline-state.json) record the output, historical findings and outstanding review limitations. The pilot uses a custom component and a prepared mix; it does not expose the sound and caption toggles available on the older data-driven compositions.

For Arc 01 comparisons, Studio also lists `KemacetanTerakhirMotionComic`, `KemacetanTerakhirMotionComicRecut`, and other registered compositions. `npm run build` runs the checks before bundling. Checks validate source and schema constraints; they do not replace playback, listening, rights review or independent QA.

Creating a composition, rendering an export and publishing are separate actions. When a render is requested, select the intended composition and output path in Studio or use the Remotion CLI. Do not overwrite an existing export unless that is intended; publishing requires separate authorization.

For a standard delivery, `npm run render -- <composition-id> <delivery.mp4>` renders then compresses automatically using ShortZ's balanced preset. FFmpeg and FFprobe must be on PATH. In PowerShell quote optional Remotion flags, for example `'--concurrency=3'`. For a separately mastered MP4, run `npm run compress -- <master.mp4>` after mastering; the command creates a neighboring `_compressed.mp4` without overwriting the master or an existing delivery. Recheck audio sync, loudness and silence on the compressed file because AAC encoding can change them.

## Start a standalone episode

1. Read [AGENTS.md](AGENTS.md), the [v2 style guide](STYLE_GUIDE.md#studio-v2-standalone-survival-scenarios), the [studio role contracts](agents/README.md), the [scenario record](arcs/02-skenario-bertahan/arc.json) and [decision history](archive/playbook/experiments.md). For a broad request with no setting, the showrunner contract calls for three distinct pitches before a full brief.
2. Keep the episode directly under `episodes/<slug>/`. Maintain a brief, script, asset and rights record, review and `pipeline-state.json` using the [templates](templates/). Plant the trap causes and escape tools in the opening, record their payoffs in the Fair-Play Clue Ledger, and map spoken action and world audio to the picture. Follow the stage prerequisites and handoffs in the role contracts.
3. For assembly, use the [pilot manifest](episodes/001-kamar-terkunci/manifest.json), [captions](episodes/001-kamar-terkunci/captions.json), [custom composition](src/Skenario01KamarTerkunci.tsx) and [assembler contract](agents/04-remotion-assembler.md#studio-v2-assembly-contract) as references. Set both `schemaVersion: 2` and `pipelineVersion: 2`, use `urban-silhouette-noir` and a `decision-consequence` script, and register a unique composition ID in [Root.tsx](src/Root.tsx). The pilot has episode-specific timings, overlays and a prepared mix; adapt them to the new episode rather than assuming its component is a generic player.
4. Run `npm run check` and perform the visual, audio and export checks required by the assembler and QA contracts. Record the composition ID, dependencies, provenance, rights and actual review evidence in the episode handoff. A passing automated check is not a publishing approval.

Manifest asset paths are relative to `public/`; scene and audio positions are in frames. Generic data-driven `Episode` compositions use narration-relative caption milliseconds, while the pilot's custom component reads its captions on the composition timeline. Verify timing against the component used by the episode. The [style guide](STYLE_GUIDE.md) covers the artwork, voice and review requirements.

## Archive and maintenance

The archived [Arc 01 Episode 001 brief](episodes/arc1/001-kemacetan-terakhir/brief.md), [recut manifest](episodes/arc1/001-kemacetan-terakhir/recut-v2/manifest.json) and [captions](episodes/arc1/001-kemacetan-terakhir/recut-v2/captions.json) document the earlier format. Its schema version 2 is distinct from Studio `pipelineVersion: 2`; use the pilot and current contracts for new standalone scenarios. The [earlier playbook](archive/playbook/) retains prior workflow and decision history. Archived directed prompt records use repository-root-relative paths for assets in this repository; external references remain as originally recorded.

See the [maintenance log](MAINTENANCE.md) for completed repository improvements, evidence and follow-ups.
