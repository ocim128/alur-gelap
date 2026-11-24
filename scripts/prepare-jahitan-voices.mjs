// Generate original synthetic environment under each voice note; no third-party recordings.
import {spawnSync} from 'node:child_process';
import {mkdirSync,existsSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve('episodes/009-jahitan-langit/sources'), out=resolve('public/assets/009-jahitan-langit'), sr=48000;
let state=721989; const rand=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0; return state/2147483648-1};
const rows=[['01','bima-rain','retake'],['02','bima-seam','source'],['03','bima-zipper','source'],['04','bima-outside',process.argv[2]||'retake2'],['05','nadia-outside',process.argv[3]||'retake3'],['06','gilang-last','source']];
function wav(p,a){if(existsSync(p))throw Error('Refusing overwrite '+p);const b=Buffer.alloc(44+a.length*2);b.write('RIFF');b.writeUInt32LE(36+a.length*2,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(sr,24);b.writeUInt32LE(sr*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(a.length*2,40);for(let i=0;i<a.length;i++)b.writeInt16LE(Math.round(Math.max(-1,Math.min(1,a[i]))*32767),44+2*i);writeFileSync(p,b)}
for(const [id,name,variant] of rows){if(process.argv[4] && process.argv[4] !== id) continue;const src=resolve(root,`vn-${id}-${variant}.mp3`),dest=resolve(out,`vn-${id}-${name}.wav`),envp=resolve(root,`vn-${id}-environment.wav`);if(existsSync(dest)||existsSync(envp))throw Error('Refusing overwrite');const pr=spawnSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',src],{encoding:'utf8'});if(pr.status!==0)throw Error(pr.stderr);const original=Number(pr.stdout.trim()),duration=id==='06'?2.30:id==='05'?(variant==='retake3'?4.88:2.82):original;const a=new Float32Array(Math.round(duration*sr));let l=0;
 for(let i=0;i<a.length;i++){const t=i/sr,w=rand();l+=.12*(w-l);const hi=w-l, floor=(l*.012);let f=floor;
 if(id==='01') f+=hi*.045*Math.pow(Math.max(0,Math.sin(t*26+Math.sin(t*2))),12); // rain on fabric
 if(id==='02'){const step=Math.exp(-((t*2.1)%1)*14); f+=hi*.055*step; const tail=Math.max(0,Math.min(1,(t-duration+.4)/.08));const click=Math.exp(-((t*24)%1)*28);f+=tail*(hi*.05+Math.sin(2*Math.PI*1200*t)*.035)*click;}
 if(id==='03'){const hit=Math.exp(-((t*.9)%1)*18);f+=hit*(hi*.06+Math.sin(2*Math.PI*410*t)*.04);f+=hi*.009*Math.pow(Math.max(0,Math.sin(t*1.2)),4);}
 if(id==='06'){f+=hi*.035*Math.pow(Math.max(0,Math.sin(t*13+Math.sin(t))),12);f+=hi*.025*Math.pow(Math.max(0,Math.sin(t*2.3)),10);f+=hi*.035*Math.exp(-((t*2.2)%1)*18)*Math.max(0,(t-1)/1.3);}
 a[i]=f; }
 wav(envp,a);
 // Normalize the source speech without changing rate or pitch, then add original foley.
 const filter=`[0:a]highpass=f=110,lowpass=f=7000,loudnorm=I=-18:TP=-3:LRA=7,apad=whole_dur=${duration}[v];[1:a]volume=0.8[e];[v][e]amix=inputs=2:duration=first:normalize=0,atrim=duration=${duration}`;
 const r=spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-n','-i',src,'-i',envp,'-filter_complex',filter,'-ar','48000','-ac','1','-c:a','pcm_s16le',dest],{encoding:'utf8'});if(r.status!==0)throw Error(r.stderr);console.log(id,variant,duration.toFixed(3),dest);
}
