// Reproducible, original synthetic location bed and UI sounds for Arsip 002.
// No external recordings. Listening and plausibility remain unverified.
import {mkdirSync, writeFileSync, existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {generateTensionDrone} from './generate-ronda-soundscape.mjs';

const sr = 48000;
const dir = resolve('public/assets/008-pagi-jam-dua');
mkdirSync(dir, {recursive: true});
function save(name, data) {
  const path = resolve(dir, name);
  if (existsSync(path)) throw new Error(`Refusing to overwrite ${path}`);
  const b = Buffer.alloc(44 + data.length * 2);
  b.write('RIFF'); b.writeUInt32LE(36 + data.length * 2, 4); b.write('WAVEfmt ', 8);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
  b.writeUInt32LE(sr, 24); b.writeUInt32LE(sr * 2, 28); b.writeUInt16LE(2, 32);
  b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(data.length * 2, 40);
  for (let i = 0; i < data.length; i++) b.writeInt16LE(Math.round(Math.max(-1, Math.min(1, data[i])) * 32767), 44 + i * 2);
  writeFileSync(path, b);
}
let state = 8022026;
const random = () => {state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 2147483648 - 1;};
const samples = new Float64Array(Math.round(69.667 * sr));
let low = 0, slow = 0;
for (let i = 0; i < samples.length; i++) {
  const t = i / sr, white = random();
  low += 0.055 * (white - low); slow += 0.003 * (white - slow);
  // Rough wind with slowly shifting gusts and a steady nonzero airy floor.
  const wind = (low - slow) * (0.20 + 0.09 * Math.sin(t * 0.64) + 0.05 * Math.sin(t * 1.41));
  // Irregular canvas rustle and sparse, short gravel scrapes.
  const flap = (white - low) * 0.035 * Math.pow(Math.max(0, Math.sin(t * 2.15 + Math.sin(t * 0.19))), 7);
  const gravel = (white - low) * 0.045 * Math.exp(-((t % 7.1) * 14));
  // Distant insects fade to a dead cut by 1.5 s; they never return.
  const cricketGain = Math.max(0, Math.min(1, (1.5 - t) / 0.12));
  const cricket = cricketGain * 0.018 * Math.sin(2 * Math.PI * 4020 * t) * Math.max(0, Math.sin(t * 90));
  // A chorus of irregular short frequency-swept, nonmusical bird-like chirps.
  let birds = 0;
  for (let j = 0; j < 5; j++) {
    const cycle = 1.17 + j * 0.29, local = (t + j * 0.37) % cycle;
    if (local < 0.13) {
      const env = Math.sin(Math.PI * local / 0.13);
      const phase = 2 * Math.PI * ((1800 + j * 230) * local + (2300 + j * 150) * local * local);
      birds += 0.012 * env * Math.sin(phase);
    }
  }
  const birdSwell = Math.max(0, Math.min(1, (t - 0.9) / 2.2));
  samples[i] = wind + flap + gravel + cricket + birds * birdSwell;
}
save('ambience-gunung.wav', samples);
save('tension-cahaya.wav', generateTensionDrone(57.34, true));
for (const [name, hz] of [['ui-pop-in.wav', 640], ['ui-pop-out.wav', 480]]) {
  const a = new Float64Array(Math.round(sr * 0.14));
  for (let i = 0; i < a.length; i++) {const t = i / sr; a[i] = 0.18 * Math.sin(2 * Math.PI * hz * t) * Math.exp(-t * 37) * Math.min(1, t / 0.004);}
  save(name, a);
}
