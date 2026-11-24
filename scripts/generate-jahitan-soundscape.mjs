// Original procedural foley for Arsip 003. No third-party recordings; ear review pending.
import {mkdirSync,existsSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const sr=48000, dir=resolve('public/assets/009-jahitan-langit'); mkdirSync(dir,{recursive:true});
let state=3092026; const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/2147483648-1};
function save(name,a){const p=resolve(dir,name);if(existsSync(p))throw Error('Refusing overwrite: '+p);const b=Buffer.alloc(44+a.length*2);b.write('RIFF');b.writeUInt32LE(36+a.length*2,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(sr,24);b.writeUInt32LE(sr*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(a.length*2,40);for(let i=0;i<a.length;i++)b.writeInt16LE(Math.round(Math.max(-1,Math.min(1,a[i]))*32767),44+i*2);writeFileSync(p,b)}
const bed=new Float32Array(64*sr),drone=new Float32Array(49*sr);let low=0,slow=0;
for(let i=0;i<bed.length;i++){const t=i/sr,w=random();low+=0.07*(w-low);slow+=0.002*(w-slow);const wind=(low-slow)*(0.11+0.03*Math.sin(t*.48));const flap=(w-low)*.045*Math.pow(Math.max(0,Math.sin(t*1.7+Math.sin(t*.27))),12);const rain=(w-low)*.036*Math.pow(Math.max(0,Math.sin(t*23.1+Math.sin(t*2.7))),14);const fire=(w-low)*.055*Math.pow(Math.max(0,Math.sin(t*8.9+Math.sin(t*1.7)*2)),20);const insects=.009*Math.sin(2*Math.PI*3510*t)*Math.pow(Math.max(0,Math.sin(t*22)),5);bed[i]=wind+flap+rain+fire+insects;}
for(let i=0;i<drone.length;i++){const t=i/sr;drone[i]=.17*Math.sin(2*Math.PI*96*t+1.2*Math.sin(t*.12))+.10*Math.sin(2*Math.PI*147*t+.7*Math.sin(t*.19))+.08*Math.sin(2*Math.PI*211*t)+.09*Math.sin(2*Math.PI*47*t);}
save('ambience-pine-canvas-bed.wav',bed);save('tension-canvas-drone.wav',drone);
for(const [name,hz] of [['ui-pop-in.wav',640],['ui-pop-out.wav',480]]){const a=new Float32Array(Math.round(sr*.14));for(let i=0;i<a.length;i++){const t=i/sr;a[i]=.18*Math.sin(2*Math.PI*hz*t)*Math.exp(-t*37)*Math.min(1,t/.004)}save(name,a)}
// Increasingly dense metallic clicks, scrape and resonant low body; synthetic impression only.
const zipper=new Float32Array(Math.round(sr*2.65));let l=0;
for(let i=0;i<zipper.length;i++){const t=i/sr,w=random();l+=.2*(w-l);const phase=(t*18+t*t*3)%1;const click=Math.exp(-phase*35);const env=Math.min(1,t/.1)*Math.min(1,(2.65-t)/.20);zipper[i]=env*(.15*(w-l)*click+.12*Math.sin(2*Math.PI*680*t)*click+.08*Math.sin(2*Math.PI*125*t)*Math.exp(-phase*9)+.04*(w-l));}
save('vn-07-tanpa-nama-zipper.wav',zipper);
