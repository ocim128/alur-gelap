# Scenario 04 — Rec.709 evidence handoff for Agent 05 re-audit

## Audit target and recovery

The fresh audit [audit-owner-polish-2026-11-23.md](audit-owner-polish-2026-11-23.md) covers `out/004-tangan-pilot-kemarin/skenario04-owner-polish-final-master_compressed.mp4`, SHA-256 `7ce728108139b5fb5f4ff2f2140bbd6c97aa1d3b435d49d19c8f980f693b7b56`. Its FAIL is an evidence gap, not a finding that its color is wrong. The audited file remains unchanged. The earlier handoff's named `out/skenario04-owner-polish-picture.mp4`, `out/skenario04-owner-polish-rec709-master.mp4`, and `out/skenario04-owner-polish-final-master.mp4` could not be found in the workspace or the surrounding `tiktok-video` repository tree. The historical reports were not overwritten. Their paths or old tags alone do not prove the audited file's pixel conversion.

The user authorized a fresh reviewable delivery if those sources could not be recovered. No image, script, narration, caption, edit map, source image exception, or creative setting was changed. The same `Skenario04TanganPilotKemarin` composition, owner-approved plates, manifest/captions, and existing mono `assembly-mix-polish.wav` were used. The accepted narration MP3 remains SHA-256 `8d270aca0541c9595deb0e99f21404cef5859ded77d98d49fc12b682b0fa3b8c`.

## New retained artifacts

| Role | Repository path | SHA-256 |
| --- | --- | --- |
| Fresh pre-conversion Remotion render | `out/004-tangan-pilot-kemarin/skenario04-rec709-proof-source.mp4` | `31c6afd06c19c92d0a1216f80b74ad2eca9d2cb365bebc5d3c2f48d5f6ad664f` |
| Lossless converted master | `out/004-tangan-pilot-kemarin/skenario04-rec709-proof-master.mp4` | `24fdb3d40c4ad757d8d41451616bbd8fc0140daaac9777c4877914ebe91fa935` |
| Compressed review delivery | `out/004-tangan-pilot-kemarin/skenario04-rec709-proof-review.mp4` | `2ac9179086bc5b381723ab6c8a877ad845e26ea84e91b65f31c66f98fdbc593b` |

The fresh render probes as 1080 × 1920 / 30 fps, `yuvj420p`, full (`pc`) range, `bt470bg` matrix. Its primaries and transfer are not tagged. The master and review delivery probe as 1080 × 1920 / 30 fps, `yuv420p`, limited (`tv`) range, BT.709 matrix, primaries and transfer. **Interpretation limitation:** the known input range and BT.601-family matrix were converted explicitly; BT.709 SDR primaries and transfer are assumed for the untagged source. This evidence does not establish the source's untagged primaries or transfer, and it does not retroactively prove the old audited file's conversion.

## Reproducible pixel conversion and evidence

The fresh render was created with `npx remotion render src/index.ts Skenario04TanganPilotKemarin out/004-tangan-pilot-kemarin/skenario04-rec709-proof-source.mp4 --concurrency=6`. From the repository root, [build-rec709-proof.py](build-rec709-proof.py) created the lossless master with this explicit pixel filter before output tags were applied:

```text
scale=in_range=full:in_color_matrix=bt601:out_range=limited:out_color_matrix=bt709,format=yuv420p
```

The lossless x264 master uses CRF 0; its audio is encoded from the existing mono polish mix. The review copy is encoded from that exact master at H.264 CRF 28 with 128 kb/s mono AAC. The full FFmpeg argument arrays, source probe, input mix hash, output hashes and FFmpeg version are recorded in [rec709-pixel-proof.json](verification/rec709-pixel-proof.json). The script refuses existing output names. It records 15 sampled frames with Y/U/V per-plane comparisons: the converted source and lossless master are byte-identical in every sampled plane, source-to-converted samples change as expected, and lossy delivery-to-master differences are reported rather than assumed zero.

[verify-rec709-fullstream.py](verify-rec709-fullstream.py) independently decodes **every one of 4,650 source frames** through that same explicit conversion and compares frame timestamps, byte counts and per-frame checksums with the decoded lossless master. [rec709-fullstream-proof.json](verification/rec709-fullstream-proof.json) binds the exact source, master, review delivery and the two retained `framemd5` files by SHA-256: **4,650 reference frames, 4,650 master frames, zero mismatches**. The report includes both reproducible decode command arrays. The review delivery's pixels are lossy; its 15 sampled comparisons to the master are in the pixel-proof report. The build command that actually created the compressed delivery is recorded there, binding the delivery hash to the retained master used in the conversion chain.

## New compressed-delivery checks

The updated [verify-export.py](verify-export.py) passed on the new review delivery and wrote [rec709-proof-delivery-check.json](verification/rec709-proof-delivery-check.json), bound to its exact filename and SHA-256. It refuses to overwrite reports, scans the ending around the first detected visual transition, measures AAC silence rather than claiming digital zero, and generated listening-check clips for the copilot beat, each rewind and the final word/jolt.

- `npm run check`: PASS, 64 Node tests and 14 Python tests. `check-audio-boundaries.py`: PASS; the padded stem reconstructs every original narration PCM sample, and all three rewind windows and the 1.6 s dread window are exact zero in the narration stem.
- The copilot voice source correlates at **24.966667 s**, 0 ms detected onset offset; narration-stem RMS over its 0.715 s is −65.03 dBFS. The final export shows yellow `COPILOT / GANTIAN, BANG?` in [frame 750](verification/rec709-proof-copilot-start.png) and [frame 770](verification/rec709-proof-frame-770.png), followed by `KAMU TOLAK.` at [25.8 s](verification/rec709-proof-narrator-resume.png). The compressed export also shows [COPILOT NANGKEP.](verification/rec709-proof-copilot-nangkep.png) and [JADIIN](verification/rec709-proof-jadiin.png).
- Rewind frames **1316–1328**, **1773–1785**, **2232–2244** have snap correlations at 0 ms measured onset offset. Dread silence is **74.800–76.400 s**; decoded AAC measures −97.93 dBFS RMS with residue, not exact zero.
- The 150 ms vacuum is **153.516667–153.666667 s**, measured −58.36 dBFS RMS and −30.67 dBFS peak after AAC. Frame **4610** is the first detected visual transition in the scanned ending window; decoded stinger onset is **153.662833 s**, **−3.833 ms** relative to that frame. The last significant source signal correlates at 0 ms lag to the export, 167.896 ms before the stinger; this is signal evidence, not a phonetic listening verdict. The flash maximum sampled mean luma is 39.48; blackout starts at frame 4642.
- Compressed integrated loudness is **−14.3 LUFS**, true peak **−2.2 dBTP**. [Cover](verification/rec709-proof-cover.png), [jolt](verification/rec709-proof-jolt.png), and [blackout](verification/rec709-proof-black.png) stills are supplied.

## Owner exceptions and review limits

The image record remains `technicalVerdict: fail`, `ownerDisposition: approved_with_exceptions`, `handoffAllowed: true`; owner-accepted P05, P09, P23, P14 and P22 exceptions remain unchanged. At 270 × 480, sampled [P05](verification/rec709-proof-p05.png), [P09](verification/rec709-proof-p09.png) and [P23](verification/rec709-proof-p23.png) retain the same accepted conditions; this sampled-frame check is not a new image technical pass. No images were regenerated.

**Human listening:** `listening review: none` for SHA-256 `2ac9179086bc5b381723ab6c8a877ad845e26ea84e91b65f31c66f98fdbc593b`. The owner's earlier `sampai` approval belongs to a different export and is not inherited. Review the generated copilot/narrator, rewind and ending clips, plus the complete mix, in the new delivery.

**Rights and release:** Image/voice service terms and account/platform publication rights remain unverified. This handoff requests a fresh independent Agent 05 re-audit; it is not a QA pass or publication authorization.
