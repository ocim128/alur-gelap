# Scenario 006 first-view review

## First-view rough cut

Run `npm run dev` and open **Skenario06BioskopRoughCut**. The storyboard runs **2:32.37** at 30 fps. The scratch narration is Indonesian eSpeak NG 1.51, the captions use approximate word placement, and the tape snaps use the shared project cue. The preview tests story and picture readability. Final Investigator performance, caption timing, world audio and art are pending.

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

## Assets and reproduction

- The original schematic artwork lives in `src/Skenario06BioskopRoughCut.tsx`. It uses basic shapes and the existing project rewind sound at `public/sfx/shared/tape-snap-rewind.wav`.
- Scratch speech is synthesized from `narasi.txt` with the Indonesian eSpeak NG voice, then timed and encoded with FFmpeg. To regenerate the checked-in scratch MP3 and timing JSON, run `python scripts/build-bioskop-rough-audio.py` with eSpeak NG and FFmpeg on PATH. Use `--espeak <path>` for a separate eSpeak NG installation.
- The planned production composition is `Skenario06BioskopTanpaPintu`. Use the fresh Investigator take and measured edit map for its review. Final asset and voice rights remain to be documented.
