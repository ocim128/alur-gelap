# Scenario 03 — signal-gate correction and phone-review request

**For Agent 05:** reassess the corrected standard signal gate and its warning for the exact previously audited v4 file, SHA-256 `1313e05b92b905d0c6cb7235ff200980bf9ebd8de1b032a6ae89cf52a4bb8c5b`. The fresh v4 audit's overall **FAIL** remains: P04/P12/P13 motion and the pre-impact boat travel are unchanged. No new export, listening review, approval, or completed motion repair is claimed.

## Compression gate

The old `measureSignalSanity` scaled to 64×360 and converted to `gray` before comparing the maximum against 235/251. The new regression in `scripts/compress-video.test.mjs` creates a lossless, TV-tagged YUV frame with raw Y values 16 and 235: direct Y extraction returns those values, while FFmpeg's old `format=gray` path produces 255 for its legal white. That proves the old measurement could reject correct limited-range values. A second lossless fixture with only two extreme samples reports a **warning**, and a third frame containing a broad 0–255 ramp tagged limited **fails**. These are actual encoded fixtures decoded by FFmpeg, not merely tests of a mocked histogram. Compressor integration tests still exercise the output gate and explicit color planning.

`scripts/compress-video.mjs` now samples the **full-resolution decoded Y plane** using `extractplanes=y`, with no spatial scaling or color conversion. It reports per-frame and total counts below 16, above 235, and in 0–4 or 251–255. This project's conservative **review heuristic** fails a sampled frame if at least 1% of its pixels are in those extreme bands, or at least 5% are outside 16–235; lesser excursions return `warning` and are not concealed. These thresholds are an operational sanity gate, not a broadcast legal-range standard or proof of source mislabeling. A warning passes the compressor's blocking check with the warning exposed in its measurement. Twelve sampled frames cannot certify unsampled frames or establish whether any particular excursion is visually objectionable.

The [v4 raw-Y report](verification/raw-y-gate-v4.json) binds the file and checker to SHA-256 hashes. It sampled 12 frames of 2,073,600 pixels: 28,513 samples below 16, 19,880 above 235 and 846 in the extreme bands. The maximum per-frame outside-nominal count was 7,213 (0.348%); the maximum extreme-band count was 157 (0.0076%). The corrected gate returns **warning** rather than `fail` or `ok`. This resolves the old single-maximum interpretation for this sampled gate; it does not certify strict range compliance. The prior rejected attempt remains in [compress-review-color-v4.log](verification/compress-review-color-v4.log). Source hash, explicit range/matrix conversion, untagged source primaries/transfer assumption, and independent sampled comparison remain documented in [review-color-v4-handoff.md](review-color-v4-handoff.md).

Reproduce the raw-Y check against this file from the repository root (the output prints the full report):

```powershell
node --input-type=module -e "import {measureSignalSanity} from './scripts/compress-video.mjs'; console.log(JSON.stringify(measureSignalSanity('out/003-goyangan-dek-enam/Skenario03GoyanganDekEnam-review-color-v4-2026-11-23.mp4',{durationSec:158,fps:30}),null,2))"
node --test scripts/compress-video.test.mjs
npm run check
```

`npm run check` passed 67 Node tests and 14 Python tests; the complete [log](verification/check-raw-y-gate-final.log) is retained. The existing v4 timing, silence, impact, blackout, loudness and true-peak evidence remains in its [handoff](review-color-v4-handoff.md); no re-encode was made. Accepted narration and selected plates remain untouched; P19 starts at frame 3518 / 117.266667 s on the impact with the owner's four-handed reveal. Missing layers and boat travel remain routed to Agent 03 and the human orchestrator in [agent03-fresh-coordination.md](agent03-fresh-coordination.md); proceed only after the requested direction and coverage are supplied.

## Human phone review — requested, pending

A request was presented to the user for both items below. The owner subsequently stated, “any human/orchestrator review is approved,” authorizing continuation through review gates. That statement did not report a phone viewing, listening pass, specific review observations, or supply the missing coverage. **listening review: none** for the v4 filename and hash; real-time phone viewing is not recorded. The clip is a review aid; the complete v4 MP4 above is the audit target.

1. On a phone, play [P16 phone clip](verification/review-v4-p16-phone.mp4) at **1× speed with sound**. Can the viewer see water rush **to the right**, without being told the answer? If it does not read, route clean water layer/continuous states to Agent 03 and the orchestrator.
2. Play the [complete v4 delivery](../../out/003-goyangan-dek-enam/Skenario03GoyanganDekEnam-review-color-v4-2026-11-23.mp4) at **1× speed with sound**. Record reviewer and date, device, whether the complete cut was watched/listened to, and timestamped observations on captions, rewind, deliberate silences, the restored `hening` release, water/boat cues, impact, blackout and overall mix. Accepted source narration is not a final-mix listening review.
3. After real feedback arrives, record the actual findings and named file/hash before sending to Agent 05. Do not infer a pass or overwrite earlier audit history. Image/TTS service terms and platform rights remain unverified; retain the dklon CC BY 3.0 credit and obtain separate publication authorization if publication is later requested.
