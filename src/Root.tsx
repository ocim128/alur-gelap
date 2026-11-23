import {Skenario03GoyanganDekEnam, Skenario03MotionCoverageTest} from './Skenario03GoyanganDekEnam';
import {Skenario04TanganPilotKemarin} from './Skenario04TanganPilotKemarin';
import {Skenario05SabukKetiga} from './Skenario05SabukKetiga';
import scenario05Manifest from '../episodes/005-sabuk-ketiga/manifest.json';
import pilot04Manifest from '../episodes/004-tangan-pilot-kemarin/manifest.json';
import deckManifest from '../episodes/003-goyangan-dek-enam/manifest.json';
import {Skenario01KamarTerkunci} from './Skenario01KamarTerkunci';
import {Skenario02RumahTengahHutan} from './Skenario02RumahTengahHutan';
import {Composition, staticFile, type CalculateMetadataFunction} from "remotion";
import {Episode, type PreviewOptions} from "./Episode";
import type {CaptionBeat, EpisodeManifest, EpisodeManifestV2} from "./manifest-types";
import kemacetan from "../episodes/arc1/001-kemacetan-terakhir/manifest.json";
import kemacetanCaptions from "../episodes/arc1/001-kemacetan-terakhir/captions.json";
import recut from "../episodes/arc1/001-kemacetan-terakhir/recut-v2/manifest.json";
import recutCaptions from "../episodes/arc1/001-kemacetan-terakhir/recut-v2/captions.json";
import alternate from "../episodes/arc1/001-kemacetan-terakhir/recut-v2-alternate/manifest.json";
import alternateCaptions from "../episodes/arc1/001-kemacetan-terakhir/recut-v2-alternate/captions.json";
import attempt05 from "../episodes/arc1/001-kemacetan-terakhir/attempt-05/manifest.json";
import attempt05Captions from "../episodes/arc1/001-kemacetan-terakhir/attempt-05/captions.json";
import attempt06 from "../episodes/arc1/001-kemacetan-terakhir/attempt-06/manifest.json";
import attempt06Captions from "../episodes/arc1/001-kemacetan-terakhir/attempt-06/captions.json";
import episode02 from "../episodes/arc1/002-kabur-dari-mobil/manifest.json";
import episode02Captions from "../episodes/arc1/002-kabur-dari-mobil/captions.json";
import episode03 from "../episodes/arc1/003-bel-minimarket/manifest.json";
import episode03Captions from "../episodes/arc1/003-bel-minimarket/captions.json";
import episode04 from "../episodes/arc1/004-alarm-di-tangga/manifest.json";
import episode04Captions from "../episodes/arc1/004-alarm-di-tangga/captions.json";
import episode05 from "../episodes/arc1/005-suara-dari-rumah-kosong/manifest.json";
import episode05Captions from "../episodes/arc1/005-suara-dari-rumah-kosong/captions.json";
import episode06 from "../episodes/arc1/006-gema-di-underpass/manifest.json";
import episode06Captions from "../episodes/arc1/006-gema-di-underpass/captions.json";
import episode07 from "../episodes/arc1/007-pos-evakuasi-sunyi/manifest.json";
import episode07Captions from "../episodes/arc1/007-pos-evakuasi-sunyi/captions.json";
import pilotManifest from "../episodes/001-kamar-terkunci/manifest.json";
import forestManifest from "../episodes/002-rumah-tengah-hutan/manifest.json";

// Use for new episode registrations: the source file, not a fixed cap or the
// editable manifest's potentially stale narration.duration, sets the runtime.
export const audioFirstMetadata = (manifest: EpisodeManifest | EpisodeManifestV2): CalculateMetadataFunction<PreviewOptions> => async ({props, abortSignal}) => {
  const seconds = await new Promise<number>((resolve, reject) => {
    const audio = document.createElement("audio");
    const cleanup = () => {
      audio.removeEventListener("loadedmetadata", onMetadata);
      audio.removeEventListener("error", onError);
      abortSignal.removeEventListener("abort", onAbort);
      audio.removeAttribute("src");
      audio.load();
    };
    const onMetadata = () => {const duration = audio.duration; cleanup(); if (Number.isFinite(duration) && duration > 0) resolve(duration); else reject(new Error("Invalid narration duration"));};
    const onError = () => {cleanup(); reject(new Error(`Cannot read narration metadata: ${manifest.narration.asset}`));};
    const onAbort = () => {cleanup(); reject(new DOMException("Metadata request aborted", "AbortError"));};
    audio.preload = "metadata";
    audio.addEventListener("loadedmetadata", onMetadata);
    audio.addEventListener("error", onError);
    abortSignal.addEventListener("abort", onAbort, {once: true});
    if (abortSignal.aborted) {onAbort(); return;}
    audio.src = staticFile(manifest.narration.asset);
    audio.load();
  });
  return {
    durationInFrames: Math.max(manifest.narration.at + Math.ceil((seconds + 1.2) * manifest.fps), manifest.finalJolt ? Math.round(manifest.finalJolt.triggerSec * manifest.fps) + Math.round(manifest.finalJolt.durationSec * manifest.fps) + Math.round((manifest.finalJolt.handoffSec ?? 0) * manifest.fps) + Math.round(manifest.finalJolt.blackoutSec * manifest.fps) : 0),
    props: {...props, narrationDurationInFrames: Math.ceil(seconds * manifest.fps)},
  };
};

const KemacetanTerakhir = (options: PreviewOptions) => <Episode
  manifest={kemacetan satisfies EpisodeManifest}
  captions={kemacetanCaptions}
  {...options}
/>;
const KemacetanRecut = (options: PreviewOptions) => <Episode
  manifest={recut as EpisodeManifestV2}
  captions={recutCaptions as CaptionBeat[]}
  {...options}
/>;
const KemacetanAlternate = (options: PreviewOptions) => <Episode manifest={alternate as EpisodeManifestV2} captions={alternateCaptions as CaptionBeat[]} {...options} />;
const KemacetanAttempt05 = (options: PreviewOptions) => <Episode manifest={attempt05 as EpisodeManifestV2} captions={attempt05Captions as CaptionBeat[]} {...options} />;
const KemacetanAttempt06 = (options: PreviewOptions) => <Episode manifest={attempt06 as EpisodeManifestV2} captions={attempt06Captions as CaptionBeat[]} {...options} />;
const Arc01Episode02 = (options: PreviewOptions) => <Episode manifest={episode02 as EpisodeManifestV2} captions={episode02Captions as CaptionBeat[]} {...options} />;
const Arc01Episode03 = (options: PreviewOptions) => <Episode manifest={episode03 as EpisodeManifestV2} captions={episode03Captions as CaptionBeat[]} {...options} />;
const Arc01Episode04 = (options: PreviewOptions) => <Episode manifest={episode04 as EpisodeManifestV2} captions={episode04Captions as CaptionBeat[]} {...options} />;
const Arc01Episode05 = (options: PreviewOptions) => <Episode manifest={episode05 as EpisodeManifestV2} captions={episode05Captions as CaptionBeat[]} {...options} />;
const Arc01Episode06 = (options: PreviewOptions) => <Episode manifest={episode06 as EpisodeManifestV2} captions={episode06Captions as CaptionBeat[]} {...options} />;
const Arc01Episode07 = (options: PreviewOptions) => <Episode manifest={episode07 as EpisodeManifestV2} captions={episode07Captions as CaptionBeat[]} {...options} />;

export const Root = () => <><Composition
  id="KemacetanTerakhirMotionComic"
  component={KemacetanTerakhir}
  width={1080}
  height={1920}
  fps={kemacetan.fps}
  durationInFrames={kemacetan.duration}
  defaultProps={{showCaptions: true, soundOn: true}}
/>
<Composition id="KemacetanTerakhirMotionComicRecut" component={KemacetanRecut} width={1080} height={1920} fps={recut.fps} durationInFrames={recut.duration} defaultProps={{showCaptions: true, soundOn: true}} />
<Composition id="KemacetanTerakhirMotionComicAlternate" component={KemacetanAlternate} width={1080} height={1920} fps={alternate.fps} durationInFrames={alternate.duration} defaultProps={{showCaptions: true, soundOn: true}} />
<Composition id="KemacetanTerakhirMotionComicAttempt05" component={KemacetanAttempt05} width={1080} height={1920} fps={attempt05.fps} durationInFrames={attempt05.duration} defaultProps={{
  showCaptions: true,
  soundOn: true,
  narrationOn: true,
  effectsOn: true,
}} />
<Composition id="KemacetanTerakhirMotionComicAttempt06" component={KemacetanAttempt06} width={1080} height={1920} fps={attempt06.fps} durationInFrames={attempt06.duration} calculateMetadata={audioFirstMetadata(attempt06 as EpisodeManifestV2)} defaultProps={{
  showCaptions: true,
  soundOn: true,
  narrationOn: true,
  effectsOn: true,
}} />
<Composition id="Arc01Episode02" component={Arc01Episode02} width={1080} height={1920} fps={episode02.fps} durationInFrames={episode02.duration} calculateMetadata={audioFirstMetadata(episode02 as EpisodeManifestV2)} defaultProps={{showCaptions: true, soundOn: true, narrationOn: true, effectsOn: true}} />
<Composition id="Arc01Episode03" component={Arc01Episode03} width={1080} height={1920} fps={episode03.fps} durationInFrames={episode03.duration} calculateMetadata={audioFirstMetadata(episode03 as EpisodeManifestV2)} defaultProps={{showCaptions: true, soundOn: true, narrationOn: true, effectsOn: true}} />
<Composition id="Arc01Episode04" component={Arc01Episode04} width={1080} height={1920} fps={episode04.fps} durationInFrames={episode04.duration} calculateMetadata={audioFirstMetadata(episode04 as EpisodeManifestV2)} defaultProps={{showCaptions: true, soundOn: true, narrationOn: true, effectsOn: true}} />
<Composition id="Arc01Episode05" component={Arc01Episode05} width={1080} height={1920} fps={episode05.fps} durationInFrames={episode05.duration} calculateMetadata={audioFirstMetadata(episode05 as EpisodeManifestV2)} defaultProps={{showCaptions: true, soundOn: true, narrationOn: true, effectsOn: true}} />
<Composition id="Arc01Episode06" component={Arc01Episode06} width={1080} height={1920} fps={episode06.fps} durationInFrames={episode06.duration} calculateMetadata={audioFirstMetadata(episode06 as EpisodeManifestV2)} defaultProps={{showCaptions: true, soundOn: true, narrationOn: true, effectsOn: true}} />
<Composition id="Arc01Episode07" component={Arc01Episode07} width={1080} height={1920} fps={episode07.fps} durationInFrames={episode07.duration} calculateMetadata={audioFirstMetadata(episode07 as EpisodeManifestV2)} defaultProps={{showCaptions: true, soundOn: true, narrationOn: true, effectsOn: true}} />
<Composition id="Skenario01KamarTerkunci" component={Skenario01KamarTerkunci} width={1080} height={1920} fps={pilotManifest.fps} durationInFrames={pilotManifest.duration} />
<Composition id="Skenario02RumahTengahHutan" component={Skenario02RumahTengahHutan} width={1080} height={1920} fps={forestManifest.fps} durationInFrames={forestManifest.duration} />
<Composition id="Skenario03GoyanganDekEnam" component={Skenario03GoyanganDekEnam} width={1080} height={1920} fps={deckManifest.fps} durationInFrames={deckManifest.duration} />
<Composition id="Skenario03MotionCoverageTest" component={Skenario03MotionCoverageTest} width={1080} height={1920} fps={deckManifest.fps} durationInFrames={deckManifest.duration} />
<Composition id="Skenario04TanganPilotKemarin" component={Skenario04TanganPilotKemarin} width={1080} height={1920} fps={pilot04Manifest.fps} durationInFrames={pilot04Manifest.duration} />
<Composition id="Skenario05SabukKetiga" component={Skenario05SabukKetiga} width={1080} height={1920} fps={scenario05Manifest.fps} durationInFrames={scenario05Manifest.duration} />
</>;
