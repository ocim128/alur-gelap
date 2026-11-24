// Run from ShortZ's directory using its tsx executable. Preserves all v1 takes.
import {runTtsCommand} from 'C:/Users/user/Documents/Repo/tiktok-repost/shortz/src/cli/tts.ts';
import {GEMINI_TTS_VOICES} from 'C:/Users/user/Documents/Repo/tiktok-repost/shortz/src/shared/tts/gemini.ts';
import {GEMINI_DELIVERY_STYLES} from 'C:/Users/user/Documents/Repo/tiktok-repost/shortz/src/core/tts/gemini-tts.ts';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const attempt = process.argv[2] ?? '1';
if (!/^[1-9]\d*$/.test(attempt)) throw new Error('Attempt must be a positive integer');
if (!GEMINI_TTS_VOICES.includes('Leda' as never)) (GEMINI_TTS_VOICES as unknown as string[]).push('Leda');
GEMINI_DELIVERY_STYLES.tactical = 'Natural Indonesian young female character voice note, bright expressive friend suddenly alarmed, spontaneous natural conversational rhythm, complete all syllables, clean beginnings and endings; close phone microphone, no narrator or announcer. ' + (Number(attempt) >= 17 ? 'Allow a relaxed natural breath before speaking and finish the last syllable fully, then pause briefly.' : '') + ' Variation ' + attempt;
const output = path.join(path.dirname(fileURLToPath(import.meta.url)), `vn-salsa-v2-attempt-${attempt}.mp3`);
void runTtsCommand(['--provider', 'gemini-cloud', '--model', 'gemini-3.8-flash-tts', '--voice', 'Leda', '--text', 'Kok ada suara burung? Wir, cahayanya turun ke sini!', '--output', output, '--no-master']).then((code) => {process.exitCode = code;});
