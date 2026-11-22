// ASR spot-verification of the Scenario 05 tower PA take (evidence record only — not a listening review).
// Run from the ShortZ directory so its configured Python/ASR environment resolves.
import {transcribeChunk, stopAsrWorker} from 'C:/Users/user/Documents/Repo/tiktok-repost/shortz/src/core/tts/asr';
import {resolve} from 'node:path';

async function main() {
  const wavPath = resolve('C:/Users/user/Documents/Repo/tiktok-repost/tiktok-video/Survival-Fantasy-Content/public/sfx/sources/scenario05-tower-original.wav');
  const result = await transcribeChunk(wavPath, {
    workerPath: resolve('C:/Users/user/Documents/Repo/tiktok-repost/shortz/resources/tts/asr_worker.py'),
    model: 'small'
  });
  console.log(JSON.stringify(result, null, 2));
  stopAsrWorker();
}
main().catch(error => {console.error(error.message); process.exitCode=1;});
