// ShortZ wrapper: the current CLI whitelist omits the approved prebuilt voices.
// Run from this repository with ShortZ's tsx executable, once per character.
import {runTtsCommand} from 'C:/Users/user/Documents/Repo/tiktok-repost/shortz/src/cli/tts.ts';
import {GEMINI_TTS_VOICES} from 'C:/Users/user/Documents/Repo/tiktok-repost/shortz/src/shared/tts/gemini.ts';
import {GEMINI_DELIVERY_STYLES} from 'C:/Users/user/Documents/Repo/tiktok-repost/shortz/src/core/tts/gemini-tts.ts';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const voices: Record<string, {voice: string; style: string; line: string}> = {
  aji: {voice: 'Puck', style: 'Natural Indonesian young male in-world voice note, casual easygoing anak gunung, close handheld phone, surprised but conversational; no narrator or announcer.', line: 'Terang banget, tapi dinginnya kayak es.'},
  salsa: {voice: 'Leda', style: 'Natural Indonesian young female in-world voice note, bright expressive friend suddenly alarmed, naturally quick conversational rhythm, close handheld phone; no narrator or announcer.', line: 'Burung pagi? Wir, cahayanya turun ke sini!'},
  nino: {voice: 'voice_71a5a701-796e-421d-840e-0adc00b0816a', style: 'Natural Indonesian mature masculine in-world voice note, eerily calm and conversational, close handheld phone; no narrator or announcer.', line: 'Kok nggak capek ya? Kayak siang, tapi nggak ada angetnya.'},
};
const id = process.argv[2];
const item = voices[id];
if (!item) throw new Error('Expected aji, salsa or nino');
const variant = process.argv[3] ?? 'source';
if (!['source', 'retake', 'retake2'].includes(variant)) throw new Error('Expected source, retake or retake2');
if (!GEMINI_TTS_VOICES.includes(item.voice as never)) (GEMINI_TTS_VOICES as unknown as string[]).push(item.voice);
GEMINI_DELIVERY_STYLES.tactical = item.style + (variant === 'retake' ? ' Speak all words distinctly with a natural conversational rhythm and complete final consonants.' : variant === 'retake2' ? ' Speak naturally as a friend; articulate every syllable, start gently and finish the final word fully.' : '');
const output = path.join(path.dirname(fileURLToPath(import.meta.url)), `vn-${id}-${variant}.mp3`);
void runTtsCommand(['--provider', 'gemini-cloud', '--model', 'gemini-3.8-flash-tts', '--voice', item.voice, '--text', item.line, '--output', output, '--no-master']).then((code) => {process.exitCode = code;});
