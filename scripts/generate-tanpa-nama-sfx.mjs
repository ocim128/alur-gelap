/**
 * Deterministic in-repo synthesizer for the Arsip Terakhir "Tanpa Nama"
 * signature notification ping (public/sfx/shared/tanpa-nama-ping.wav).
 *
 * Pure mathematical synthesis (no third-party recordings, no stock packs,
 * no WhatsApp/Telegram/Line imitation). Plays ONLY when a Tanpa Nama event arrives.
 */
import {mkdirSync, writeFileSync} from "node:fs";
import {dirname, resolve} from "node:path";
import {fileURLToPath} from "node:url";

const SAMPLE_RATE = 48000;
const DURATION_SEC = 0.42;
const NUM_SAMPLES = Math.round(SAMPLE_RATE * DURATION_SEC);
const TARGET_PEAK = Math.pow(10, -8.0 / 20); // -8.0 dBFS peak headroom for stereo AAC delivery

export function synthesizeTanpaNamaPing() {
  const samples = new Float64Array(NUM_SAMPLES);
  let maxAbs = 0;

  for (let i = 0; i < NUM_SAMPLES; i++) {
    const t = i / SAMPLE_RATE;
    let value = 0;

    // Pulse 1: cold hollow metallic ping (F#5 + subtle C6 overtone + damped 110 Hz body thud)
    {
      const attack = Math.min(1, t / 0.003);
      const env = attack * Math.exp(-t * 17.5);
      const bodyEnv = attack * Math.exp(-t * 42);
      const f1 = Math.sin(2 * Math.PI * 740.0 * t);
      const f2 = 0.24 * Math.sin(2 * Math.PI * 1046.5 * t + 0.35);
      const f3 = 0.14 * Math.sin(2 * Math.PI * 1480.0 * t) * Math.exp(-t * 28);
      const thud = 0.22 * Math.sin(2 * Math.PI * 110.0 * t) * bodyEnv;
      value += (f1 + f2 + f3) * env + thud;
    }

    // Pulse 2: lower descending cold echo (D5 with -3.8 Hz subtle eerie detune beating)
    const t2 = t - 0.115;
    if (t2 >= 0) {
      const attack2 = Math.min(1, t2 / 0.004);
      const env2 = attack2 * Math.exp(-t2 * 11.5);
      const d5a = Math.sin(2 * Math.PI * 587.33 * t2);
      const d5b = 0.48 * Math.sin(2 * Math.PI * 583.53 * t2 + 0.6);
      const coldHarm = 0.12 * Math.sin(2 * Math.PI * 1174.66 * t2) * Math.exp(-t2 * 22);
      value += 0.72 * (d5a + d5b + coldHarm) * env2;
    }

    // Smooth 35 ms end fade to exact zero (no click)
    const remaining = DURATION_SEC - t;
    if (remaining < 0.035) {
      const fade = Math.max(0, remaining / 0.035);
      value *= fade * fade;
    }

    samples[i] = value;
    const abs = Math.abs(value);
    if (abs > maxAbs) maxAbs = abs;
  }

  const scale = maxAbs > 0 ? TARGET_PEAK / maxAbs : 1;
  const dataSize = NUM_SAMPLES * 2;
  const buf = Buffer.alloc(44 + dataSize);

  buf.write("RIFF", 0, "ascii");
  buf.writeUInt32LE(36 + dataSize, 4);
  buf.write("WAVE", 8, "ascii");
  buf.write("fmt ", 12, "ascii");
  buf.writeUInt32LE(16, 16); // PCM fmt chunk size
  buf.writeUInt16LE(1, 20); // PCM format
  buf.writeUInt16LE(1, 22); // mono
  buf.writeUInt32LE(SAMPLE_RATE, 24);
  buf.writeUInt32LE(SAMPLE_RATE * 2, 28);
  buf.writeUInt16LE(2, 32); // block align
  buf.writeUInt16LE(16, 34); // 16-bit
  buf.write("data", 36, "ascii");
  buf.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < NUM_SAMPLES; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i] * scale));
    buf.writeInt16LE(Math.round(clamped * 32767), 44 + i * 2);
  }

  return buf;
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const outPath = resolve(process.cwd(), process.argv[2] ?? "public/sfx/shared/tanpa-nama-ping.wav");
  mkdirSync(dirname(outPath), {recursive: true});
  const wav = synthesizeTanpaNamaPing();
  writeFileSync(outPath, wav);
  console.log(`Generated ${outPath} (${wav.length} bytes, ${DURATION_SEC.toFixed(2)} s @ ${SAMPLE_RATE} Hz mono 16-bit)`);
}
