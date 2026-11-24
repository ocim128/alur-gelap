import {runTtsCommand} from 'C:/Users/user/Documents/Repo/tiktok-repost/shortz/src/cli/tts.ts';
import {GEMINI_TTS_VOICES} from 'C:/Users/user/Documents/Repo/tiktok-repost/shortz/src/shared/tts/gemini.ts';
import {GEMINI_DELIVERY_STYLES} from 'C:/Users/user/Documents/Repo/tiktok-repost/shortz/src/core/tts/gemini-tts.ts';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const voices: Record<string, {voice: string; style: string; line: string}> = {
 '01': {voice:'Puck',style:'Natural Indonesian young male camper speaking conversationally into his phone, lightly puzzled, no narrator.',line:'Gil, hujannya bunyi di atas, ga nyampe tanah.'},
 '02': {voice:'Puck',style:'Natural Indonesian young male camper speaking conversationally into his phone, following something, no narrator.',line:'Iya. Ada jalur jahitannya ke bawah. Gw ikutin dulu.'},
 '03': {voice:'Puck',style:'Natural Indonesian young male camper speaking conversationally into his phone, puzzled and curious, no narrator.',line:'Gede banget. Gw buka dikit ya.'},
 '04': {voice:'Puck',style:'Natural Indonesian young male camper speaking conversationally into his phone, quietly unsettled, no narrator.',line:'Gil... di luar kosong. Ga ada angin, ga ada apa-apa.'},
 '05': {voice:'Leda',style:'Natural Indonesian young female voice note, bright expressive friend now frightened, natural quick conversational rhythm without artificial slowing, close phone, no narrator. Final word interrupts abruptly.',line:'Bima? ... Gil, di sini gelap banget. Gw ga nemu—'},
 '06': {voice:'voice_71a5a701-796e-421d-840e-0adc00b0816a',style:'Natural Indonesian masculine character, quietly determined conversational voice note close to phone, no narrator.',line:'Gw nyusul bentar.'}
};
const id=process.argv[2], item=voices[id]; const variant=process.argv[3] ?? 'source'; if (!['source','retake','retake2','retake3'].includes(variant)) throw Error('Invalid variant'); if(!item) throw Error('Expected 01–06');
if (!GEMINI_TTS_VOICES.includes(item.voice as never)) (GEMINI_TTS_VOICES as unknown as string[]).push(item.voice);
GEMINI_DELIVERY_STYLES.tactical=item.style + (variant === 'retake3' ? ' Address Gil with a short final L, no extra vowel. Articulate nemu clearly.' : '') + (variant !== 'source' ? ' Speak naturally in one flowing conversational utterance, with short pauses, and clearly articulate every word and name.' : '');
const output=path.join(path.dirname(fileURLToPath(import.meta.url)),`vn-${id}-${variant}.mp3`);
void runTtsCommand(['--provider','gemini-cloud','--model','gemini-3.8-flash-tts','--voice',item.voice,'--text',variant === 'retake3' && id === '05' ? 'Bima, Gil, di sini gelap banget, gue gak nemu' : variant === 'retake2' && id === '05' ? 'Bima, Gil, di sini gelap banget, gue enggak nemu' : variant === 'retake2' && id === '04' ? 'Gil, di luar kosong, enggak ada angin, enggak ada apa-apa' : variant === 'retake' && id === '05' ? 'Bima, Gil, di sini gelap banget, gw ga nemu' : item.line,'--output',output,'--no-master']).then(code=>{process.exitCode=code;});
