// Malayalam kinetic type + subtitles + line icons for MoossReel.
// Malayalam notes: words are split only on spaces (never inside a grapheme
// cluster), letter-spacing stays 0 so conjunct shaping is untouched, and
// line-height is generous for above/below vowel signs.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, mt } from "./theme3";

const C = mt.colors;

export const MlWords: React.FC<{
  text: string;
  delay?: number;
  per?: number;
  size: number;
  hero?: string[];
  font?: string;
  weight?: number;
  color?: string;
  maxWidth?: number;
  style?: React.CSSProperties;
}> = ({
  text,
  delay = 0,
  per = 4,
  size,
  hero = [],
  font = mt.fonts.mlBody,
  weight = 700,
  color = C.cream,
  maxWidth = 960,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: Math.round(size * 0.28),
        rowGap: 0,
        maxWidth,
        fontFamily: font,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.42,
        color,
        textAlign: "center",
        ...style,
      }}
    >
      {text.split(" ").map((w, i) => {
        const p = spring({ frame: frame - delay - i * per, fps, config: mt.spring.snappy });
        const isHero = hero.includes(w);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [size * 0.45, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
              filter: `blur(${interpolate(p, [0, 1], [8, 0], clamp)}px)`,
              color: isHero ? C.gold : undefined,
              textShadow: isHero ? mt.glow(C.gold) : "0 4px 24px rgba(0,0,0,0.55)",
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

// Subtitles: chunk timing is proportional to spoken length within the
// measured VO duration (commas count as a short pause).
export const Subtitles: React.FC<{
  chunks: string[];
  start: number; // frame the VO starts (relative to parent)
  dur: number; // VO length in frames
  until: number; // last frame to show
}> = ({ chunks, start, dur, until }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!chunks.length) return null;
  const weights = chunks.map((c) => c.replace(/\s/g, "").length + (/[,.]$/.test(c) ? 3 : 0));
  const total = weights.reduce((a, b) => a + b, 0);
  let acc = 0;
  const starts = weights.map((w) => {
    const s = start + (acc / total) * dur;
    acc += w;
    return Math.round(s) - 2; // land a hair early: reads as in sync
  });
  let active = -1;
  starts.forEach((s, i) => {
    if (frame >= s) active = i;
  });
  if (active < 0 || frame > until) return null;
  const local = frame - starts[active];
  const p = spring({ frame: local, fps, config: mt.spring.snappy });
  const out = interpolate(frame, [until - 6, until], [1, 0], { ...clamp, easing: mt.ease.in });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1318,
        display: "flex",
        justifyContent: "center",
        opacity: out,
      }}
    >
      <div
        style={{
          maxWidth: 960,
          padding: "14px 34px 12px",
          borderRadius: 22,
          background: "rgba(4, 14, 9, 0.74)",
          border: `1px solid ${C.gold}40`,
          boxShadow: "0 18px 40px -16px rgba(0,0,0,0.8)",
          fontFamily: mt.fonts.mlBody,
          fontWeight: 600,
          fontSize: 50,
          lineHeight: 1.45,
          color: C.cream,
          textAlign: "center",
          opacity: p,
          transform: `translateY(${interpolate(p, [0, 1], [16, 0])}px) scale(${interpolate(p, [0, 1], [0.97, 1])})`,
        }}
      >
        {chunks[active]}
      </div>
    </div>
  );
};

// ---------- line icons (stroke = currentColor) ----------
const Svg: React.FC<{ size: number; children: React.ReactNode; sw?: number }> = ({ size, children, sw = 2.4 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} fill="none" stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export const IconCheck: React.FC<{ size: number; draw?: number }> = ({ size, draw = 1 }) => (
  <Svg size={size} sw={4}>
    <path d="M12 25 L21 34 L37 15" strokeDasharray="40" strokeDashoffset={40 * (1 - draw)} />
  </Svg>
);
export const IconQuestion: React.FC<{ size: number }> = ({ size }) => (
  <Svg size={size} sw={4}>
    <path d="M17 17 a7 7 0 1 1 9.5 6.5 c-2 1 -2.5 2.2 -2.5 4.5" />
    <circle cx="24" cy="35" r="0.6" fill="currentColor" />
  </Svg>
);
export const IconHourglass: React.FC<{ size: number }> = ({ size }) => (
  <Svg size={size}>
    <path d="M14 7 H34 M14 41 H34 M16 7 C16 18 32 20 32 24 C32 28 16 30 16 41 M32 7 C32 18 16 20 16 24 C16 28 32 30 32 41" />
    <path d="M20 37 L28 37 L24 31 Z" fill="currentColor" stroke="none" />
  </Svg>
);
export const IconPulse: React.FC<{ size: number }> = ({ size }) => (
  <Svg size={size}>
    <path d="M24 41 C10 31 5 24 5 17 a9 9 0 0 1 19 -3 a9 9 0 0 1 19 3 c0 7 -5 14 -19 24 Z" />
    <path d="M9 24 H17 L20 18 L25 30 L28 24 H39" />
  </Svg>
);
export const IconCapsule: React.FC<{ size: number }> = ({ size }) => (
  <Svg size={size}>
    <rect x="6" y="17" width="26" height="13" rx="6.5" transform="rotate(-35 19 23.5)" />
    <path d="M15 15 L22 28" />
    <path d="M30 40 C30 30 36 25 43 24 C43 32 38 39 30 40 Z M30 40 L38 30" />
  </Svg>
);
export const IconPerson: React.FC<{ size: number }> = ({ size }) => (
  <Svg size={size}>
    <circle cx="24" cy="15" r="7" />
    <path d="M10 41 C10 31 16 26 24 26 C32 26 38 31 38 41" />
    <path d="M36 9 l3 -3 M40 15 h4 M36 21 l3 3" />
  </Svg>
);
export const IconHeart: React.FC<{ size: number; fill?: string }> = ({ size, fill }) => (
  <Svg size={size}>
    <path d="M24 40 C10 30 6 23 6 17 a9 9 0 0 1 18 -3 a9 9 0 0 1 18 3 c0 6 -4 13 -18 23 Z" fill={fill} />
  </Svg>
);

// Abstract person glyph (no faces, no actors) — varying height reads as
// different ages/body types.
export const Figure: React.FC<{ h: number; color: string }> = ({ h, color }) => (
  <svg viewBox="0 0 60 120" width={h * 0.5} height={h}>
    <circle cx="30" cy="22" r="15" fill={color} />
    <path d="M6 120 C6 70 14 46 30 46 C46 46 54 70 54 120 Z" fill={color} />
  </svg>
);
