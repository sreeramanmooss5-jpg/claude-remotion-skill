// Original, royalty-free bed for MoossReel, synthesized from scratch:
// a tanpura-style drone in D (Pa–Sa–Sa–low Sa pluck cycle) and a soft
// temple-bell chime. No samples, no downloads, deterministic.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SR = 44100;
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "mooss");
mkdirSync(OUT, { recursive: true });

let seed = 7;
const rnd = () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647 - 0.5;
};

const write = (name, out, peakTarget) => {
  let peak = 0;
  for (const s of out) peak = Math.max(peak, Math.abs(s));
  const g = peakTarget / peak;
  const n = out.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++)
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, out[i] * g)) * 32767), 44 + i * 2);
  writeFileSync(join(OUT, name), buf);
};

// ---- tanpura drone, 25.5s ----
{
  const DUR = 25.5;
  const N = Math.round(DUR * SR);
  const out = new Float32Array(N);
  // one pluck: bright harmonic stack whose upper partials swell then fade
  // (the "jawari" buzz), long decay
  const pluck = (t0, f, amp) => {
    const s0 = Math.round(t0 * SR);
    const len = Math.round(4.2 * SR);
    for (let h = 1; h <= 14; h++) {
      const fh = f * h * (1 + 0.0004 * h);
      const ah = amp / Math.pow(h, 0.9);
      const swell = 0.15 + 0.12 * h; // later bloom for higher partials
      let ph = Math.random() * 6.28;
      for (let i = 0; i < len && s0 + i < N; i++) {
        const t = i / SR;
        ph += (2 * Math.PI * fh) / SR;
        const env = Math.min(1, t / 0.012) * Math.exp(-t * 0.9) * (h === 1 ? 1 : (1 - Math.exp(-t / swell)) * Math.exp(-t * 0.25 * h * 0.3));
        out[s0 + i] += Math.sin(ph) * ah * env;
      }
    }
  };
  const Sa = 146.83; // D3
  const cycle = [
    [110.0, 0.8], // Pa (A2)
    [Sa, 0.9],
    [Sa, 0.85],
    [73.42, 1.0], // low Sa (D2)
  ];
  const step = 0.95;
  for (let t = 0, k = 0; t < DUR - 1; t += step, k++) pluck(t, cycle[k % 4][0], cycle[k % 4][1]);
  // soft sustained pad underneath (D–A–D)
  for (const f of [73.42, 110, 146.83, 220]) {
    for (const d of [f * 0.9985, f * 1.0015]) {
      let ph = Math.random() * 6.28;
      for (let i = 0; i < N; i++) {
        ph += (2 * Math.PI * d) / SR;
        out[i] += Math.sin(ph) * 0.05;
      }
    }
  }
  // fades
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    out[i] *= Math.min(1, t / 0.6) * Math.min(1, (DUR - t) / 2.5);
  }
  write("drone.wav", out, 0.8);
}

// ---- temple-bell chime (inharmonic partials, long ring) ----
{
  const DUR = 3.2;
  const N = Math.round(DUR * SR);
  const out = new Float32Array(N);
  const f0 = 587.33; // D5, in key with the drone
  const partials = [
    [0.5, 0.5, 1.2],
    [1, 1, 1.6],
    [2.0, 0.55, 2.2],
    [2.76, 0.4, 3.0],
    [5.4, 0.22, 5.0],
    [8.93, 0.12, 7.0],
  ];
  for (const [r, a, decay] of partials) {
    let ph = 0;
    for (let i = 0; i < N; i++) {
      const t = i / SR;
      ph += (2 * Math.PI * f0 * r * (1 + 0.002 * Math.sin(2 * Math.PI * 4 * t))) / SR;
      out[i] += Math.sin(ph) * a * Math.exp(-t * decay) * Math.min(1, t / 0.003);
    }
  }
  for (let i = 0; i < Math.round(0.01 * SR); i++) out[i] += rnd() * 0.6 * (1 - i / (0.01 * SR));
  write("bell.wav", out, 0.7);
}

// ---- soft airy whoosh for transitions (filtered noise) ----
{
  const DUR = 0.55;
  const N = Math.round(DUR * SR);
  const out = new Float32Array(N);
  let lp = 0, lp2 = 0;
  for (let i = 0; i < N; i++) {
    const t = i / N;
    const env = Math.pow(Math.sin(Math.PI * Math.pow(t, 0.6)), 2);
    const c = 0.03 + 0.16 * Math.sin(Math.PI * t);
    lp += c * (rnd() * 2 - lp);
    lp2 += c * (lp - lp2);
    out[i] = lp2 * env;
  }
  write("air.wav", out, 0.6);
}

console.log("MoossReel audio written to", OUT);
