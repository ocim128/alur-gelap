import {writeFile} from 'node:fs/promises';
import {transcribeChunk, stopAsrWorker} from 'C:/Users/user/Documents/Repo/tiktok-repost/shortz/src/core/tts/asr';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

async function main() {
  const repo = fileURLToPath(new URL('../../..', import.meta.url));
  const workerPath = resolve('resources/tts/asr_worker.py');
  const result: Record<string, unknown> = {};
  try {
    for (const name of ['plea', 'whisper']) {
      result[name] = await transcribeChunk(`${repo}/public/sfx/prepared/ep005-entity-${name}.wav`, {workerPath, model: 'small'});
      console.log(`Transcribed ${name}`);
    }
    await writeFile(`${repo}/episodes/arc1/005-suara-dari-rumah-kosong/world-voice-asr.json`, JSON.stringify(result, null, 2) + '\n', {flag: 'wx'});
  } finally {stopAsrWorker();}
}
main().catch(error => {console.error(error.message); process.exitCode = 1;});
