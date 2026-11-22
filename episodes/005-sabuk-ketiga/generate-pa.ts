// Separate in-world tower voice (`pa-announcer`) for Scenario 05 "Sabuk Ketiga"; the Investigator narration is never touched.
// The entity's "radio tower" line, verbatim from the locked brief: "turun, lewatin awan, izin darurat".
// Named `scenario05-` to avoid the `ep005-` prefix already used by Arc 01 Episode 005.
// Run from the ShortZ directory with its configured Google Cloud credentials.
import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createGeminiCloudProvider} from 'C:/Users/user/Documents/Repo/tiktok-repost/shortz/src/core/tts/gemini-cloud';
import {resolveGoogleCloudProject} from 'C:/Users/user/Documents/Repo/tiktok-repost/shortz/src/core/tts/environment';

async function main() {
  const outputWav = fileURLToPath(new URL('../../public/sfx/sources/scenario05-tower-original.wav', import.meta.url));
  if (existsSync(outputWav)) throw new Error('PA source already exists; preserve it');
  const project = await resolveGoogleCloudProject();
  const provider = createGeminiCloudProvider({project, model:'gemini-3.8-flash-tts', fetchImpl: async (url, init) => {
    const body = JSON.parse(String(init?.body));
    body.contents[0].parts[0].speechMetadata.style = 'Flat, formal Indonesian public announcement, calm and mechanical, natural Indonesian pronunciation, no music or sound effects.';
    return fetch(url, {...init, body: JSON.stringify(body)});
  }});
  try {
    await provider.synthesizeChunk({text:'Turun, lewatin awan, izin darurat.',tag:null,chunkIndex:0,attempt:0,outputWav},{voiceId:'Orus',ffmpegPath:'ffmpeg'});
  } finally {provider.stop();}
  console.log('Created scenario05-tower-original.wav');
}
main().catch(error => {console.error(error.message); process.exitCode=1;});
