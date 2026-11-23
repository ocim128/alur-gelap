# Scenario 006 first-view review

## First-view rough cut

Run `npm run dev` and open **Skenario06BioskopRoughCut**. The revised storyboard runs **2:42.27** at 30 fps. Its eSpeak scratch delivery is a pacing estimate; the 145–160 s production target must be measured on the fresh Investigator take. The scratch narration is Indonesian eSpeak NG 1.51, the captions use approximate word placement, and the tape snaps use the shared project cue. The preview tests story and picture readability. Final Investigator performance, caption timing, world audio and art are pending.

The times in this historical table refer to the earlier 227-word scratch cut. The revised cut has different timing.

| Beat | What to watch for |
| --- | --- |
| 00:00–00:02.60 | Rows appear behind the fixed screen during the hook. |
| 00:33–00:48.23 | First attempt at the red exit and the impossible doorway. |
| 00:48.63–01:13.20 | The flashlight marks the closest row. The marked row slides away from the fixed screen in a matched view. The shift is visible before the fall. |
| 02:24.53–02:26.53 | Ranto sees the uninterrupted cinema wall in a silent hold. |
| 02:26.53–02:30.87 | The closing motif pays off his promise. |

Play once at phone size and normal speed, with no setup from the brief. Ask in this order:

1. “Kenapa Ranto akhirnya ke layar?”
2. “Bagian mana yang paling kamu ingat atau kamu suka?”
3. “Ada bagian yang bikin bingung?”

Write the viewer’s words before comparing them with the expected explanation in the brief. Record the first confusing beat, what made an impression, and the revision or retest. Independent viewer evidence is pending.

Producer self-review, visual-state: sampled the opening and matched P08/P09 frames at 270 × 480. The lit screen stays at the same coordinates and the marked row moves away from it before the fall. The shot timing and scratch captions were checked against the script. listening review: none.

## Producer review and handoff — 23 November 2026

**Scope and evidence.** This is a producer's script, source and sampled-frame review, not an unfamiliar viewer's response. The current tool session can inspect stills but cannot actually watch and hear a continuous normal-speed pass. **Normal-speed review: not performed. listening review: none.** Independent viewer feedback and the viewer's actual words: **pending**. Do not treat the observations below as proof of first-view comprehension or enjoyment.

| Finding | Status and evidence | Action / retest |
| --- | --- | --- |
| `visual-state` P08/P09, 00:58.00, 01:04.33 and 01:10.00 | At 270 × 480, the same bright marked row is closer to the fixed screen in [P08](review-p08-frame-1740.png) and farther away in [P09](review-p09-frame-1930.png); the screen's location is consistent. The schematic marker is small. These stills cannot prove the movement reads during playback. | Hold the marker after placement and retain the exact camera/screen reference. Test the moving comparison at normal speed and phone size. |
| `visual-state` P09, 01:04.33 and 01:10.00 | The tiny side-door label, Ranto, threshold and fall overlap; the foot crossing an elevated edge is not clearly depicted in the sampled [comparison](review-p09-frame-1930.png) and [fall](review-p09-frame-2100.png) frames. The brief's previous description was stronger than the evidence. | The revised P09 production direction separates foot, door edge and lower rows with contrast and makes the fall follow the comparison. The current storyboard has **not** been revised to depict this; revise and replay it before calling the shot validated. |
| `experience` cause and effect | Script and planned pictures link marked-row movement against a fixed screen, a draft behind cloth, a shoulder push and discovery of the backstage shutter. The draft suggests space, not proof of an outdoor exit. The red and side exits both need an unmistakable elevated empty threshold. The rough schematic alone has not proved the complete chain. | Test the two door consequences, moving comparison, hem motion and screen tear in sequence with an unfamiliar viewer. Confirm the direction of the fall and whether the route through fabric is inferred. |
| `experience` promise | The opening states Ranto's 07:00 promise; the ending says he still has time, not that the performance was seen. Dawn alone does not show a travel margin or a nearby destination. | P23 direction now requests a readable 05:40 clock and nearby school entrance in the same view. The storyboard does **not** yet show either; retest whether the ending reads as credible opportunity rather than a witnessed reunion. |
| `signal/timing` script and anchors | Canonical count **227**, split count **227**. Scratch captions reproduce all 22 spoken paragraphs in order; P22/P24 are silent. A synthetic call to the actual `buildPlan` resolves 22 spoken panel spans covering 227/227 script words, three rewind boundaries and all four protected pairs. | Synthetic timing is not a fresh ASR or PCM test. Measure the new take, its hook, sound gaps, P22 and tail. A protected beat prevents tightening but does not create the planned two-second hold. |
| `signal/timing` project checks | `npm run check` passed on 2026-11-23: TypeScript and episode checks, 76 Node tests and 16 Python tests; existing archived/comparison warnings were printed. The planned production composition has not been assembled and is not validated by that pass. | Run production checks again when the new measured map and composition exist. |

**Verdict at that review: needs revision and normal-speed review.** This historical assessment predates the storyboard revisions below. The prior `kamu` master in Git commit `5933a40` and the historical public derivatives belong to the earlier script; they are not timing or audio for Ranto.

## Revised storyboard review — 23 November 2026

**Evidence and limits.** Reviewed rendered stills of `Skenario06BioskopRoughCut` at 270 × 480. This session cannot observe continuous picture and sound at normal speed, so the complete producer playback is **not performed**; **listening review: none**. An independent viewer's feedback and actual words remain **pending**. The stills are schematic production evidence, not a first-time-viewer test or final art.

| Finding | Actual observation | Remaining check |
| --- | --- | --- |
| `visual-state` P08/P09 comparison | In [P08 frame 1740](review-updated-1740.png), the marked row sits near the screen. In [P09 frame 2075](review-final-2075.png), it sits farther away while the screen stays fixed in the same view. | Play the motion at normal speed and ask an unfamiliar viewer what moved and what remained fixed. |
| `visual-state` P09 threshold and fall | [Frame 1940](review-final-1940.png) shows a contrasting open doorway, bright sill and lower rows; [frame 2130](review-final-2130.png) shows a foot extending below the sill; by [frame 2190](review-final-2190.png) Ranto is lower in the opening near the rows. This is a schematic cutaway in one frame, and the figure is still small on a phone. | Confirm the step, drop, physical geography and narration alignment at normal speed. Still frames cannot establish that the motion reads. |
| `visual-state` P23 promise | [Frame 4460](review-updated-4460.png) shows a readable 05:40 and a school entrance with `SEKOLAH` in the same alley view. It suggests time and a nearby destination, without showing attendance. | Check phone-size readability in motion and whether a viewer understands the promise's payoff. |
| `signal/timing` assets and checks | The script remains **227 canonical / 227 split words**. Storyboard duration, captions, scratch track and rewind timing were not edited. `npm run check` passed: 76 Node tests and 16 Python tests, with existing archived/comparison warnings. | The scratch captions remain estimates. The new Investigator hook, P22 narration-free hold and final timing require a fresh PCM-verified map. |

**Current verdict: not yet ready for Agent 02's narration lock.** The requested shots have been implemented and sampled, but the first-view normal-speed producer review remains open under the studio handoff, and brief status remains `ready` rather than `pass`. No new Investigator take, final panel batch, mix, independent audience feedback or post-export QA is claimed. After the normal-speed review and story gate, Agent 02 can create the fresh take and measured map; Agent 03 should carry the P09/P23 readability requirements into final artwork.

## Assets and reproduction

- The original schematic artwork lives in `src/Skenario06BioskopRoughCut.tsx`. It uses basic shapes and the existing project rewind sound at `public/sfx/shared/tape-snap-rewind.wav`.
- Scratch speech is synthesized from `narasi.txt` with the Indonesian eSpeak NG voice, then timed and encoded with FFmpeg. To regenerate the checked-in scratch MP3 and timing JSON, run `python scripts/build-bioskop-rough-audio.py --output-dir public/assets/006-bioskop-rough-cut-flow-v2 --timing-output episodes/006-bioskop-tanpa-pintu/rough-cut-flow-v2.json` with eSpeak NG and FFmpeg on PATH. Use `--espeak <path>` for a separate eSpeak NG installation.
- The planned production composition is `Skenario06BioskopTanpaPintu`. Use the fresh Investigator take and measured edit map for its review. Final asset and voice rights remain to be documented.

## Narration revision — 24 November 2026

The owner reported the generated narration sounded bad. The accompanying audit identifies excessive sentence fragmentation as a text-based hypothesis. The revised script joins related actions, clarifies the false-exit hook and ties the light motif to the daughter’s stage fright. It has 243 canonical words. The previous 227-word Investigator master and its reports remain in this folder. A separate revised scratch cut and approximate captions have been generated; its 162.27-second duration is a provisional estimate. The new raw Investigator master is available, with a fresh timing map and a normal-speed listening comparison still pending. No new listening review or independent viewer feedback is claimed.

### Revised Investigator candidate

The new raw master `narration-investigator-flow-v2.mp3` is 144.54 s. ShortZ generated 12 chunks and reported 2 verified and 10 failed. Some failures concern its generic WPM threshold; others flag word mismatches or a chunk-end truncation. The ASR transcript suggests targeted checks around 00:18.54 (kainnya), 01:42.62 (nyusurin), 02:01.56 (bahu), and the flagged chunk ending. These are ASR suspicions, not proof of mispronunciation or clipping. The hook ends at 2.62 s in ASR timestamps; the audio-based hook gate and P22 gap remain unverified. The raw master has not been prepared, speed-adjusted or reviewed by listening. listening review: none.

**Later update, 24 November 2026:** At the owner?s request the earlier masters and their sidecars were removed after the replacement candidate was generated. The preceding take-specific review is historical; see `audio-handoff-20261124-v3.md` for the current files and unresolved checks.
