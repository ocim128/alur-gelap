import {writeFile} from 'node:fs/promises';
import {transcribeChunk, stopAsrWorker} from 'C:/Users/user/Documents/Repo/tiktok-repost/shortz/src/core/tts/asr';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
async function main() {
  const repo=fileURLToPath(new URL('../../..', import.meta.url));
  try {
    const result=await transcribeChunk(`${repo}/public/sfx/prepared/ep007-pa.wav`, {workerPath:resolve('resources/tts/asr_worker.py'),model:'small'});
    await writeFile(`${repo}/episodes/arc1/007-pos-evakuasi-sunyi/pa-asr.json`,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
    console.log('PA ASR saved');
  } finally {stopAsrWorker();}
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
