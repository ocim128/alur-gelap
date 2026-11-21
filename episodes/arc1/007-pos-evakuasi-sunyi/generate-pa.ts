// Separate in-world PA voice; the Investigator narration is never touched.
// Run from the ShortZ directory with its configured Google Cloud credentials.
import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createGeminiCloudProvider} from 'C:/Users/user/Documents/Repo/tiktok-repost/shortz/src/core/tts/gemini-cloud';
import {resolveGoogleCloudProject} from 'C:/Users/user/Documents/Repo/tiktok-repost/shortz/src/core/tts/environment';

async function main() {
  const outputWav = fileURLToPath(new URL('../../../public/sfx/sources/ep007-pa-original.wav', import.meta.url));
  if (existsSync(outputWav)) throw new Error('PA source already exists; preserve it');
  const project = await resolveGoogleCloudProject();
  const provider = createGeminiCloudProvider({project, model:'gemini-3.8-flash-tts', fetchImpl: async (url, init) => {
    const body = JSON.parse(String(init?.body));
    body.contents[0].parts[0].speechMetadata.style = 'Flat, formal Indonesian public announcement, calm and mechanical, natural Indonesian pronunciation, no music or sound effects.';
    return fetch(url, {...init, body: JSON.stringify(body)});
  }});
  try {
    await provider.synthesizeChunk({text:'Nomor antrean empat puluh dua... silakan masuk...',tag:null,chunkIndex:0,attempt:0,outputWav},{voiceId:'Orus',ffmpegPath:'ffmpeg'});
  } finally {provider.stop();}
  console.log('Created ep007-pa-original.wav');
}
main().catch(error => {console.error(error.message); process.exitCode=1;});
