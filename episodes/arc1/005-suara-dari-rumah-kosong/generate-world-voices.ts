// Separate in-world voice effects; never touches the Investigator narration.
// Run from the ShortZ directory with its tsx and configured Cloud credentials.
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {existsSync} from 'node:fs';
import {createGeminiCloudProvider} from 'C:/Users/user/Documents/Repo/tiktok-repost/shortz/src/core/tts/gemini-cloud';
import {resolveGoogleCloudProject} from 'C:/Users/user/Documents/Repo/tiktok-repost/shortz/src/core/tts/environment';

async function main() {
  const project = await resolveGoogleCloudProject();
  const outputDir = fileURLToPath(new URL('../../../public/sfx/sources', import.meta.url));
  const cues = [
    {file: 'ep005-entity-plea-original.wav', text: 'Tolong... buka pintunya...', style: 'Young Indonesian female voice, eerily flat and repetitive, soft, natural Indonesian pronunciation, no music or sound effects.'},
    {file: 'ep005-entity-whisper-original.wav', text: 'Kalau kaca diketuk... kenapa kamu masih menoleh?', style: 'Young Indonesian female voice, close intimate breathy whisper, eerily flat, natural Indonesian pronunciation, no music or sound effects.'},
  ];
  const provider = createGeminiCloudProvider({project, model: 'gemini-3.8-flash-tts', fetchImpl: async (url, init) => {
    const body = JSON.parse(String(init?.body));
    body.generationConfig.speechConfig.voiceConfig.voice = 'Aoede';
    body.contents[0].parts[0].speechMetadata.style = cues.find(cue => cue.text === body.contents[0].parts[0].text)?.style;
    return fetch(url, {...init, body: JSON.stringify(body)});
  }});
  for (const [index, cue] of cues.entries()) {
    const outputWav = resolve(outputDir, cue.file);
    if (existsSync(outputWav)) {console.log(`Preserving existing ${cue.file}`); continue;}
    await provider.synthesizeChunk({text: cue.text, tag: null, chunkIndex: index, attempt: 0, outputWav}, {voiceId: 'Charon', ffmpegPath: 'ffmpeg'});
    console.log(`Created ${cue.file}`);
  }
  provider.stop();
}
main().catch(error => {console.error(error.message); process.exitCode = 1;});
