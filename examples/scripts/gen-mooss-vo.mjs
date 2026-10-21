// Malayalam voice-over for the MoossReel composition, made offline with
// espeak-ng (GPL engine; its output audio carries no licence restriction).
// Each line is re-synthesized at the speech rate that fits its time slot in
// src/mooss/timeline.json, so no time-stretching artifacts are added.
// Needs: espeak-ng (with the "ml" voice) and ffmpeg on PATH.
// To use a human recording instead, drop vo0..vo4.wav into public/mooss/ and
// update src/mooss/vo-durations.json with their lengths.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "mooss");
const TMP = join(OUT, ".tmp");
mkdirSync(TMP, { recursive: true });
const timeline = JSON.parse(readFileSync(join(ROOT, "src/mooss/timeline.json"), "utf8"));

const dur = (f) =>
  Number(
    execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f])
      .toString()
      .trim(),
  );

// synth + trim leading/trailing silence
const synth = (text, rate, out) => {
  const raw = join(TMP, "raw.wav");
  execFileSync("espeak-ng", ["-v", "ml", "-s", String(rate), "-p", "38", "-g", "1", "-w", raw, text]);
  execFileSync("ffmpeg", [
    "-v", "error", "-y", "-i", raw, "-af",
    "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse",
    out,
  ]);
  return dur(out);
};

const durations = [];
timeline.vo.forEach((line, i) => {
  const trimmed = join(TMP, `t${i}.wav`);
  let rate = 165;
  let d = synth(line.speak, rate, trimmed);
  for (let k = 0; k < 4 && d > line.max; k++) {
    rate = Math.ceil((rate * d) / (line.max * 0.98));
    d = synth(line.speak, rate, trimmed);
  }
  if (d > line.max) throw new Error(`vo${i} is ${d.toFixed(2)}s, slot is ${line.max}s`);
  // warm it up: cut rumble and fizz, gentle compression, small room
  execFileSync("ffmpeg", [
    "-v", "error", "-y", "-i", trimmed, "-af",
    "highpass=f=90,lowpass=f=7200,equalizer=f=220:t=q:w=1:g=3,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,aecho=0.85:0.5:38:0.10,aresample=44100,volume=12dB,alimiter=limit=0.89",
    "-ac", "1", join(OUT, `vo${i}.wav`),
  ]);
  durations.push(Number(d.toFixed(3)));
  console.log(`vo${i}: rate ${rate}, ${d.toFixed(2)}s / slot ${line.max}s`);
});

writeFileSync(join(ROOT, "src/mooss/vo-durations.json"), JSON.stringify(durations) + "\n");
rmSync(TMP, { recursive: true, force: true });
