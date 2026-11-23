# Scenario 05 — color conversion evidence

The earlier `Skenario05SabukKetiga-owner-polish-master_compressed.mp4` has SHA-256 `aab03276b04601d61b483fd5b01038d49f6752d03a20379a158429a8bf00dd12`. A search of the episode and output folders found that its named pre-conversion render and master are no longer present. This is missing evidence, not proof of a defect in that old file.

The fresh source is the retained 4,693-frame JPEG/JFIF sequence `out/005-sabuk-ketiga/Skenario05-roll-color-jpeg-source/`. Sampled frames probe as 1080 × 1920 `yuvj420p`, full-range (`pc`), `bt470bg` matrix. Remotion's installed Chromium launcher explicitly uses `--force-color-profile=srgb`; the encoded display-referred RGB is therefore treated as sRGB transfer with BT.709/sRGB primaries, while JFIF uses the full-range BT.601-family YCbCr matrix. [Frame manifest](source-manifest-roll-color.json) records a SHA-256 for each source JPEG.

Both the retained new master and compressed review were encoded directly from that source sequence using this pixel filter **before** BT.709 tags were written:

```text
zscale=matrixin=bt470bg:rangein=full:primariesin=bt709:transferin=iec61966-2-1:matrix=bt709:range=limited:primaries=bt709:transfer=bt709,format=yuv420p
```

[Conversion record](color-conversion-roll-color.json) binds source manifest, audio, ffmpeg version, exact command arguments, master hash and review MP4 hash. [Review pixel comparison](color-pixel-roll-color-v2.json) and [master pixel comparison](color-pixel-master-roll-color.json) independently bind to their respective MP4 hashes. Six source frames were converted again and compared with decoded MP4 Y, Cb and Cr block averages. Maximum block mean absolute error was **0.935 code values for the review** and **0.394 for the master**, consistent with lossy encoding. A separate numerical luma calculation using sRGB decoding, the display-referred BT.1886 inverse EOTF and the BT.709 matrix differed from the compressed output by at most **0.987 code values** across the six tested frames. These are sampled pixel comparisons, not an exhaustive per-pixel match.

The initially written `color-pixel-roll-color.json` is retained unchanged as history but its field named `independentBt709LumaMae` used the scene-referred BT.709 camera OETF, which does not model the display-referred transfer used by this `zscale` path. Its `pass` only gated the separate ffmpeg-reference plane comparison. Do not use that field as proof of the transfer conversion. The corrected v2 report uses the independent display-referred model and gates it as well. The distinction follows [zimg's transfer-function selection](https://github.com/sekrit-twc/zimg/blob/master/src/zimg/colorspace/gamma.cpp), which selects BT.1886 for display-referred REC_709.
