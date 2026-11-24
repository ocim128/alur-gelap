/**
 * Deterministic in-repo synthesizer for ARSIP #001 (Grup Ronda RT 07)
 * non-melodic, mostly diegetic sound design:
 *   1. public/assets/007-grup-ronda-rt07/ambience-ronda-bed.wav (66.5 s @ 48 kHz mono 16-bit)
 *      - Tropical Indonesian night crickets (dual-band organic stridulation chorus)
 *      - Warm night wind breeze (slowly breathing bandpass noise)
 *      - Distant village dog barks (~7.0 s and ~26.5 s)
 *      - Far bamboo kentongan ronda knocks (~14.6 s, "tok-tok... tok")
 *      - Far passing motorbike hum (~21.5–26.0 s, Doppler swell & fade)
 *      Target RMS: -24.5 dBFS (so at gain 0.42 in chat-script.json, mix bed is ~-32 dBFS,
 *      clearly audible on phone speakers and well above the -50 dBFS floor).
 *   2. public/assets/007-grup-ronda-rt07/tension-ronda-drone.wav (38.2 s @ 48 kHz mono 16-bit)
 *      - Non-melodic dark sub rumble (44–88 Hz filtered brown noise + slow beating pressure)
 *      - Hollow dark air friction (160–340 Hz), ZERO melodic notes or chords.
 *      Target RMS: -18.0 dBFS (ramped by ArsipPlayer from gain 0.08 to 0.48, then hard-cut at frame 1650).
 *
 * Pure mathematical synthesis (zero third-party recordings, zero stock packs).
 */
import {mkdirSync, writeFileSync} from "node:fs";
import {dirname, resolve} from "node:path";
import {fileURLToPath} from "node:url";

const SAMPLE_RATE = 48000;

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return (s / 0xffffffff) * 2 - 1;
  };
}

function writeMonoWav(filePath, floatSamples) {
  const numSamples = floatSamples.length;
  const dataSize = numSamples * 2;
  const buf = Buffer.alloc(44 + dataSize);
  buf.write("RIFF", 0, "ascii");
  buf.writeUInt32LE(36 + dataSize, 4);
  buf.write("WAVE", 8, "ascii");
  buf.write("fmt ", 12, "ascii");
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SAMPLE_RATE, 24);
  buf.writeUInt32LE(SAMPLE_RATE * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36, "ascii");
  buf.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < numSamples; i++) {
    const v = Math.max(-1, Math.min(1, floatSamples[i]));
    buf.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
  }
  mkdirSync(dirname(filePath), {recursive: true});
  writeFileSync(filePath, buf);
}

function normalizeRms(samples, targetRmsDbfs, peakCeilingDbfs = -6.0) {
  let sumSq = 0;
  let peak = 0;
  for (let i = 0; i < samples.length; i++) {
    const v = samples[i];
    sumSq += v * v;
    const a = Math.abs(v);
    if (a > peak) peak = a;
  }
  const curRms = Math.sqrt(sumSq / Math.max(1, samples.length));
  const targetRms = Math.pow(10, targetRmsDbfs / 20);
  const peakCeiling = Math.pow(10, peakCeilingDbfs / 20);
  let gain = curRms > 0 ? targetRms / curRms : 1;
  if (peak * gain > peakCeiling) {
    gain = peakCeiling / peak;
  }
  for (let i = 0; i < samples.length; i++) {
    samples[i] *= gain;
  }
  // Smooth 15 ms edge fades
  const fadeSamples = Math.round(0.015 * SAMPLE_RATE);
  for (let i = 0; i < fadeSamples && i < samples.length; i++) {
    const f = i / fadeSamples;
    samples[i] *= f;
    samples[samples.length - 1 - i] *= f;
  }
  return samples;
}

/** Simple 1-pole lowpass / highpass helpers for smooth organic filtering. */
function makeOnePoleLP(cutoffHz) {
  const rc = 1 / (2 * Math.PI * cutoffHz);
  const dt = 1 / SAMPLE_RATE;
  const a = dt / (rc + dt);
  let y = 0;
  return (x) => {
    y += a * (x - y);
    return y;
  };
}

function makeOnePoleHP(cutoffHz) {
  const rc = 1 / (2 * Math.PI * cutoffHz);
  const dt = 1 / SAMPLE_RATE;
  const a = rc / (rc + dt);
  let y = 0;
  let prevX = 0;
  return (x) => {
    y = a * (y + x - prevX);
    prevX = x;
    return y;
  };
}

export function generateRondaBed(durationSec = 66.5) {
  const n = Math.round(durationSec * SAMPLE_RATE);
  const out = new Float64Array(n);
  const rng = makeRng(70072026);

  // Wind bandpass filters (200 - 1100 Hz)
  const windLP = makeOnePoleLP(1100);
  const windHP = makeOnePoleHP(190);
  // Air floor filter (60 - 450 Hz)
  const airLP = makeOnePoleLP(420);
  const airHP = makeOnePoleHP(65);
  // Dog bark filter
  const barkLP = makeOnePoleLP(1500);
  const barkHP = makeOnePoleHP(320);

  // Bark events (startSec, durationSec, baseFreq)
  const barks = [
    {start: 7.0, dur: 0.22, f0: 470, amp: 0.26},
    {start: 7.55, dur: 0.2, f0: 445, amp: 0.22},
    {start: 26.6, dur: 0.24, f0: 430, amp: 0.24},
    {start: 27.2, dur: 0.19, f0: 410, amp: 0.19},
    {start: 27.65, dur: 0.21, f0: 435, amp: 0.15},
  ];

  // Far bamboo kentongan knocks ("tok-tok... tok") around 14.6 s
  const kentonganHits = [
    {start: 14.6, amp: 0.28},
    {start: 14.94, amp: 0.24},
    {start: 15.52, amp: 0.26},
  ];

  // Motorbike passing far road 21.5 - 26.2 s
  const bikeStart = 21.5;
  const bikeEnd = 26.2;
  let bikePhase = 0;

  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const white = rng();

    // 1. Continuous Indonesian village night crickets (two distinct distant stridulation rhythms)
    // Cricket A (~4350 Hz, 3-pulse burst every 0.78 s)
    const c1Cycle = t % 0.78;
    let c1Env = 0;
    if (c1Cycle < 0.34) {
      const pulse = (c1Cycle % 0.085) / 0.085;
      c1Env = pulse < 0.65 ? Math.sin((pulse / 0.65) * Math.PI) : 0;
      c1Env *= 0.75 + 0.25 * Math.sin(2 * Math.PI * 0.17 * t);
    }
    const cricketA = c1Env * (0.65 * Math.sin(2 * Math.PI * 4320 * t) + 0.35 * Math.sin(2 * Math.PI * 4385 * t + 0.8));

    // Cricket B (continuous distant high nocturnal chorus ~3780 Hz + ~5120 Hz subtle shimmer)
    const c2Pulse = 0.5 + 0.5 * Math.sin(2 * Math.PI * 24.5 * t);
    const c2Drift = 0.55 + 0.45 * Math.sin(2 * Math.PI * 0.11 * t + 1.2);
    const cricketB =
      (0.32 + 0.68 * c2Pulse) *
      c2Drift *
      (0.6 * Math.sin(2 * Math.PI * 3780 * t) + 0.25 * Math.sin(2 * Math.PI * 5140 * t));

    // 2. Warm breathing night breeze + steady outdoor air bed (keeps floor warm & phone-audible)
    const breezeMod = 0.65 + 0.35 * Math.sin(2 * Math.PI * 0.16 * t + 0.4) * Math.sin(2 * Math.PI * 0.07 * t);
    const wind = windHP(windLP(white)) * breezeMod * 0.62;
    const outdoorAir = airHP(airLP(white)) * 0.58;

    let sample = cricketA * 0.16 + cricketB * 0.095 + wind + outdoorAir;

    // 3. Distant village dog barks (muffled far-field formant-swept burst)
    let barkRaw = 0;
    for (const b of barks) {
      const dt = t - b.start;
      if (dt >= 0 && dt < b.dur) {
        const u = dt / b.dur;
        const env = Math.sin(u * Math.PI) * Math.exp(-u * 1.4);
        const pitch = b.f0 * (1.0 - 0.32 * u);
        const tone =
          Math.sin(2 * Math.PI * pitch * dt) +
          0.5 * Math.sin(2 * Math.PI * pitch * 2.04 * dt) +
          0.45 * white;
        barkRaw += tone * env * b.amp;
      }
      // Faint outdoor village echo 140 ms later
      const dte = t - (b.start + 0.14);
      if (dte >= 0 && dte < b.dur) {
        const u = dte / b.dur;
        const env = Math.sin(u * Math.PI) * Math.exp(-u * 1.6);
        const pitch = b.f0 * (1.0 - 0.32 * u);
        barkRaw += (Math.sin(2 * Math.PI * pitch * dte) + 0.3 * white) * env * b.amp * 0.32;
      }
    }
    sample += barkHP(barkLP(barkRaw));

    // 4. Far hollow bamboo kentongan knocks
    for (const k of kentonganHits) {
      const dt = t - k.start;
      if (dt >= 0 && dt < 0.22) {
        const env = Math.min(1, dt / 0.002) * Math.exp(-dt * 28);
        const body =
          Math.sin(2 * Math.PI * 465 * dt) +
          0.55 * Math.sin(2 * Math.PI * 990 * dt) * Math.exp(-dt * 18) +
          0.25 * Math.sin(2 * Math.PI * 1640 * dt) * Math.exp(-dt * 35);
        sample += body * env * k.amp;
      }
    }

    // 5. Distant scooter/motorbike passing on outer road (smooth Doppler curve)
    if (t >= bikeStart && t <= bikeEnd) {
      const u = (t - bikeStart) / (bikeEnd - bikeStart);
      const env = Math.sin(u * Math.PI);
      const doppler = 1.0 + 0.12 * (0.5 - u);
      const freq = 108 * doppler;
      bikePhase += (2 * Math.PI * freq) / SAMPLE_RATE;
      const engine =
        0.55 * Math.sin(bikePhase) +
        0.35 * Math.sin(bikePhase * 2) +
        0.2 * Math.sin(bikePhase * 3) +
        0.12 * Math.sin(bikePhase * 4);
      sample += engine * env * env * 0.18;
    }

    out[i] = sample;
  }

  return normalizeRms(out, -24.5, -6.5);
}

export function generateTensionDrone(durationSec = 38.2) {
  const n = Math.round(durationSec * SAMPLE_RATE);
  const out = new Float64Array(n);
  const rng = makeRng(90012026);

  const subLP = makeOnePoleLP(92);
  const subHP = makeOnePoleHP(34);
  const airLP = makeOnePoleLP(310);
  const airHP = makeOnePoleHP(140);

  let brown = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const white = rng();
    brown = Math.max(-1, Math.min(1, brown * 0.996 + white * 0.08));

    // Strictly non-melodic sub rumble + slow beating pressure throb (zero musical notes/chords)
    const rumble = subHP(subLP(brown)) * 2.2;
    const throb =
      (0.55 * Math.sin(2 * Math.PI * 46.0 * t) + 0.45 * Math.sin(2 * Math.PI * 47.3 * t + 0.7)) *
      (0.55 + 0.45 * Math.sin(2 * Math.PI * 0.23 * t));
    const darkAir = airHP(airLP(white)) * (0.4 + 0.35 * Math.sin(2 * Math.PI * 0.31 * t));

    out[i] = rumble * 0.58 + throb * 0.28 + darkAir * 0.26;
  }

  return normalizeRms(out, -18.0, -6.0);
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const outDir = resolve(process.cwd(), "public/assets/007-grup-ronda-rt07");
  const bedPath = resolve(outDir, "ambience-ronda-bed.wav");
  const dronePath = resolve(outDir, "tension-ronda-drone.wav");
  const bed = generateRondaBed(66.5);
  const drone = generateTensionDrone(38.2);
  writeMonoWav(bedPath, bed);
  writeMonoWav(dronePath, drone);
  console.log(`Generated ${bedPath} (${(bed.length / SAMPLE_RATE).toFixed(2)} s)`);
  console.log(`Generated ${dronePath} (${(drone.length / SAMPLE_RATE).toFixed(2)} s)`);
}
