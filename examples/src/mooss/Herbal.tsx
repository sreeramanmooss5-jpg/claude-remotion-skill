// Procedural herbal B-roll and traditional Ayurveda textures — no stock
// footage, no people. Everything is SVG/CSS so it stays sharp at 1080×1920.
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { clamp, mt } from "./theme3";

const C = mt.colors;

// ---------- leaf shapes ----------
let uid = 0;
const useId = (p: string) => React.useMemo(() => `${p}${uid++}`, [p]);

// Lanceolate leaf (tulsi / neem leaflet family) with midrib, veins and a
// gold rim light on one edge to suggest back-lit macro photography.
export const Leaf: React.FC<{
  w: number;
  tone?: number; // 0 dark .. 1 light
  rim?: number; // rim-light strength 0..1
  style?: React.CSSProperties;
}> = ({ w, tone = 0.5, rim = 0.5, style }) => {
  const id = useId("lf");
  const h = w * 2.6;
  const top = tone > 0.5 ? C.leafLight : C.leaf;
  const veins = Array.from({ length: 9 }).map((_, i) => {
    const y = 38 + i * 24;
    const spread = 34 - Math.abs(i - 4) * 3;
    return (
      <g key={i} stroke={C.bg} strokeOpacity={0.35} strokeWidth={1.1} fill="none">
        <path d={`M50 ${y} Q ${50 - spread * 0.6} ${y - 10} ${50 - spread} ${y - 26}`} />
        <path d={`M50 ${y} Q ${50 + spread * 0.6} ${y - 10} ${50 + spread} ${y - 26}`} />
      </g>
    );
  });
  return (
    <svg viewBox="0 0 100 260" width={w} height={h} style={style}>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="0.55" stopColor={C.forest} />
          <stop offset="1" stopColor={C.bg} />
        </linearGradient>
        <linearGradient id={`${id}r`} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor={C.goldLight} stopOpacity={0.9 * rim} />
          <stop offset="0.25" stopColor={C.gold} stopOpacity={0.25 * rim} />
          <stop offset="0.6" stopColor={C.gold} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d="M50 2 C 88 52, 97 150, 50 258 C 3 150, 12 52, 50 2 Z" fill={`url(#${id}g)`} />
      <path d="M50 2 C 88 52, 97 150, 50 258 C 3 150, 12 52, 50 2 Z" fill={`url(#${id}r)`} />
      {veins}
      <path d="M50 6 L50 252" stroke={C.goldLight} strokeOpacity={0.28 + 0.3 * rim} strokeWidth={1.6} />
    </svg>
  );
};

// Compound sprig: a rachis with paired leaflets (neem-like silhouette).
export const Sprig: React.FC<{
  len: number;
  tone?: number;
  rim?: number;
  sway?: number;
  style?: React.CSSProperties;
}> = ({ len, tone = 0.5, rim = 0.4, sway = 0, style }) => {
  const pairs = 6;
  return (
    <div style={{ position: "absolute", width: len * 0.5, height: len, ...style }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          width: 4,
          height: len,
          marginLeft: -2,
          borderRadius: 4,
          background: `linear-gradient(${C.leafLight}, ${C.forest})`,
        }}
      />
      {Array.from({ length: pairs }).map((_, i) => {
        const y = len * (0.08 + (i / pairs) * 0.82);
        const lw = len * (0.1 - i * 0.006);
        return (
          <React.Fragment key={i}>
            {[-1, 1].map((side) => (
              <div
                key={side}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: y,
                  transformOrigin: "50% 0%",
                  transform: `rotate(${side * (62 + sway * Math.sin(i))}deg)`,
                }}
              >
                <Leaf w={lw} tone={tone} rim={rim} style={{ marginLeft: -lw / 2, display: "block" }} />
              </div>
            ))}
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: "50%", top: -len * 0.02, transform: "translateX(-50%) rotate(180deg)" }}>
        <Leaf w={len * 0.1} tone={tone} rim={rim} />
      </div>
    </div>
  );
};

// ---------- atmosphere ----------
export const LightRays: React.FC<{ strength?: number }> = ({ strength = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen", pointerEvents: "none" }}>
      {Array.from({ length: 6 }).map((_, i) => {
        const o = (0.05 + 0.04 * Math.sin(frame / (38 + i * 7) + i)) * strength;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: -300,
              left: 520 + i * 120,
              width: 70 + (i % 3) * 50,
              height: 2600,
              transformOrigin: "50% 0%",
              transform: `rotate(${28 + i * 3.2 + Math.sin(frame / 90) * 1.5}deg)`,
              background: `linear-gradient(180deg, ${C.goldLight}, transparent 70%)`,
              opacity: o,
              filter: "blur(18px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Dust: React.FC<{ count?: number }> = ({ count = 46 }) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => {
        const x = random(`dx${i}`) * 1080;
        const speed = 0.4 + random(`ds${i}`) * 1.1;
        const y = (random(`dy${i}`) * (height + 200) - frame * speed) % (height + 200);
        const yy = y < -100 ? y + height + 200 : y;
        const size = 2 + random(`dz${i}`) * 7;
        const near = size > 6.5;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.sin(frame / 40 + i) * 18,
              top: yy,
              width: size,
              height: size,
              borderRadius: "50%",
              background: C.goldLight,
              opacity: 0.18 + 0.4 * random(`do${i}`) * (0.6 + 0.4 * Math.sin(frame / 20 + i)),
              filter: near ? "blur(3px)" : undefined,
              boxShadow: `0 0 ${size * 2}px ${C.gold}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Bokeh: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: 14 }).map((_, i) => {
        const s = 90 + random(`bs${i}`) * 220;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: random(`bx${i}`) * 1180 - 100,
              top: random(`by${i}`) * 2000 - 40 + Math.sin(frame / 70 + i) * 14,
              width: s,
              height: s,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${i % 3 === 0 ? C.gold : C.leafLight}55, transparent 68%)`,
              filter: "blur(10px)",
              opacity: 0.35 + 0.25 * Math.sin(frame / 50 + i * 2),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- the continuous B-roll plate ----------
// One herbal "set" lives under the whole reel; a virtual camera pushes and
// pans differently in each scene and punches in on every cut.
export const HerbalBRoll: React.FC<{ cuts: number[] }> = ({ cuts }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const idx = cuts.filter((c) => frame >= c).length; // 0 = before first cut
  const segStart = idx === 0 ? 0 : cuts[idx - 1];
  const segEnd = cuts[idx] ?? segStart + fps * 6;
  const prog = interpolate(frame, [segStart, segEnd], [0, 1], { ...clamp, easing: mt.ease.inOut });
  const dir = idx % 2 === 0 ? 1 : -1;
  const punch = idx === 0 ? 0 : 1 - spring({ frame: frame - segStart, fps, config: mt.spring.smooth });
  const scale = 1.06 + 0.06 * (dir > 0 ? prog : 1 - prog) + punch * 0.07;
  const panX = dir * interpolate(prog, [0, 1], [-30, 30]);
  const panY = interpolate(prog, [0, 1], [10, -24]);
  const flashBlur = punch * 10;

  const t = frame / fps;
  const layer = (depth: number): React.CSSProperties => ({
    position: "absolute",
    inset: 0,
    transform: `translate(${panX * depth}px, ${panY * depth}px) scale(${1 + (scale - 1) * depth})`,
  });

  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      {/* deep mesh */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(1200px 1400px at 70% 18%, ${C.forest} 0%, transparent 60%),
                       radial-gradient(900px 1100px at 15% 88%, ${C.bgAlt} 0%, transparent 70%),
                       linear-gradient(180deg, ${C.bg}, #0A1C13 55%, ${C.bg})`,
        }}
      />
      <div style={{ ...layer(0.35), filter: `blur(${flashBlur * 0.5}px)` }}>
        <Bokeh />
      </div>
      {/* mid-ground sprigs, slightly soft (shallow depth of field) */}
      <div style={{ ...layer(0.7), filter: `blur(${2.2 + flashBlur * 0.6}px)` }}>
        <Sprig len={760} tone={0.3} rim={0.5} sway={4}
          style={{ left: -150, top: 120, transform: `rotate(${38 + Math.sin(t * 0.9) * 2}deg)` }} />
        <Sprig len={680} tone={0.6} rim={0.7} sway={3}
          style={{ left: 820, top: 980, transform: `rotate(${-150 + Math.sin(t * 0.8 + 1) * 2}deg)` }} />
        <Sprig len={520} tone={0.4} rim={0.4}
          style={{ left: 880, top: -40, transform: `rotate(${-28 + Math.sin(t * 1.1 + 2) * 2.5}deg)` }} />
      </div>
      {/* foreground leaves: big, out of focus, framing the shot */}
      <div style={{ ...layer(1.25), filter: `blur(${14 + flashBlur}px)` }}>
        <div style={{ position: "absolute", left: -220, top: 1380, transform: `rotate(${58 + Math.sin(t * 0.7) * 3}deg)` }}>
          <Leaf w={330} tone={0.2} rim={0.3} />
        </div>
        <div style={{ position: "absolute", left: 880, top: 260, transform: `rotate(${-122 + Math.sin(t * 0.6 + 2) * 3}deg)` }}>
          <Leaf w={260} tone={0.3} rim={0.5} />
        </div>
      </div>
      <LightRays />
      <Dust />
    </AbsoluteFill>
  );
};

// ---------- traditional textures ----------
// Palm-leaf manuscript (thaliyola) strip: tan fibre, inscribed lines, string hole.
export const PalmLeaf: React.FC<{
  w: number;
  h: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ w, h, children, style }) => (
  <div
    style={{
      position: "relative",
      width: w,
      height: h,
      borderRadius: `${h * 0.5}px / ${h * 0.42}px`,
      background: `repeating-linear-gradient(180deg, rgba(90,60,20,0.10) 0 2px, transparent 2px 7px),
                   linear-gradient(180deg, ${C.palm} 0%, #CBA862 55%, ${C.palmDark} 100%)`,
      boxShadow: `inset 0 2px 0 rgba(255,240,200,0.45), inset 0 -6px 14px rgba(70,45,10,0.35), 0 24px 40px -18px rgba(0,0,0,0.75)`,
      overflow: "hidden",
      ...style,
    }}
  >
    {/* fibre streaks */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `repeating-linear-gradient(90deg, rgba(110,75,25,0.07) 0 1px, transparent 1px 23px, rgba(255,240,200,0.08) 23px 24px, transparent 24px 61px)`,
      }}
    />
    {/* string hole */}
    <div
      style={{
        position: "absolute",
        left: w * 0.5 - 9,
        top: h * 0.5 - 9,
        width: 18,
        height: 18,
        borderRadius: "50%",
        background: "radial-gradient(circle, #2a1c0a 40%, #6b4c1d 75%, transparent 80%)",
        opacity: 0.0,
      }}
    />
    {children}
  </div>
);

// Kolam / mandala ring in gold line-work.
export const Kolam: React.FC<{ size: number; draw?: number; rot?: number; opacity?: number }> = ({
  size,
  draw = 1,
  rot = 0,
  opacity = 1,
}) => {
  const petals = 16;
  const circ = 2 * Math.PI * 46;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ opacity, transform: `rotate(${rot}deg)` }}>
      <g fill="none" stroke={C.gold} strokeLinecap="round">
        <circle cx="50" cy="50" r="46" strokeWidth={0.5} strokeDasharray={circ} strokeDashoffset={circ * (1 - draw)} />
        <circle cx="50" cy="50" r="41" strokeWidth={0.25} strokeDasharray="0.6 1.6" opacity={draw} />
        {Array.from({ length: petals }).map((_, i) => {
          const a = (360 / petals) * i;
          const p = Math.max(0, Math.min(1, draw * 1.6 - i / petals * 0.6));
          return (
            <g key={i} transform={`rotate(${a} 50 50)`} opacity={p}>
              <path d="M50 12 C 55 20, 55 26, 50 32 C 45 26, 45 20, 50 12 Z" strokeWidth={0.45} />
              <circle cx="50" cy="8.5" r="0.9" fill={C.gold} stroke="none" />
            </g>
          );
        })}
        <circle cx="50" cy="50" r="17" strokeWidth={0.4} opacity={draw} />
        {Array.from({ length: 8 }).map((_, i) => (
          <path key={i} transform={`rotate(${i * 45} 50 50)`} d="M50 33 Q 53 41 50 47 Q 47 41 50 33 Z"
            strokeWidth={0.35} opacity={Math.max(0, draw * 2 - 1)} />
        ))}
      </g>
    </svg>
  );
};

// Bronze urali (Ayurvedic mixing vessel) with a pestle and herbs.
export const Urali: React.FC<{ w: number }> = ({ w }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "relative", width: w, height: w * 0.78 }}>
      {/* steam wisps */}
      {[0, 1, 2].map((i) => {
        const cyc = ((frame + i * 26) % 80) / 80;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: w * (0.34 + i * 0.13),
              top: w * 0.05 - cyc * w * 0.38,
              width: w * 0.12,
              height: w * 0.32,
              borderRadius: "50%",
              background: `radial-gradient(ellipse, rgba(244,235,214,0.30), transparent 70%)`,
              filter: "blur(14px)",
              opacity: Math.sin(cyc * Math.PI) * 0.9,
              transform: `translateX(${Math.sin(cyc * 6 + i) * 18}px) scaleX(${1 + cyc})`,
            }}
          />
        );
      })}
      <svg viewBox="0 0 200 156" width={w} height={w * 0.78} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <linearGradient id="bronze" x1="0" x2="1">
            <stop offset="0" stopColor="#4a3313" />
            <stop offset="0.35" stopColor="#b98a3c" />
            <stop offset="0.55" stopColor="#e6c27a" />
            <stop offset="0.8" stopColor="#8a6224" />
            <stop offset="1" stopColor="#3d2a0f" />
          </linearGradient>
          <radialGradient id="inside" cx="0.5" cy="0.4" r="0.6">
            <stop offset="0" stopColor="#2c6a47" />
            <stop offset="1" stopColor="#0d2418" />
          </radialGradient>
          <linearGradient id="pestle" x1="0" x2="1">
            <stop offset="0" stopColor="#5b4020" />
            <stop offset="0.5" stopColor="#a47a3c" />
            <stop offset="1" stopColor="#4a3215" />
          </linearGradient>
        </defs>
        {/* pestle behind rim */}
        <rect x="118" y="8" width="13" height="78" rx="6" fill="url(#pestle)" transform="rotate(24 124 60)" />
        {/* bowl body */}
        <path d="M14 66 Q 18 136 100 142 Q 182 136 186 66 Z" fill="url(#bronze)" />
        {/* foot */}
        <ellipse cx="100" cy="146" rx="36" ry="7" fill="#3d2a0f" />
        {/* herbs inside */}
        <ellipse cx="100" cy="66" rx="86" ry="17" fill="url(#inside)" />
        {Array.from({ length: 14 }).map((_, i) => (
          <ellipse key={i} cx={36 + i * 9.5} cy={64 + Math.sin(i * 1.7) * 6} rx="6" ry="2.6"
            fill={i % 3 ? "#4e8f63" : "#2c6a47"} transform={`rotate(${i * 37} ${36 + i * 9.5} ${64 + Math.sin(i * 1.7) * 6})`} />
        ))}
        {/* rim */}
        <ellipse cx="100" cy="66" rx="88" ry="18" fill="none" stroke="#e9cf8a" strokeWidth="3" opacity="0.9" />
        {/* handles */}
        <path d="M10 70 q -10 4 0 12" stroke="#b98a3c" strokeWidth="5" fill="none" />
        <path d="M190 70 q 10 4 0 12" stroke="#b98a3c" strokeWidth="5" fill="none" />
        {/* specular */}
        <path d="M40 92 Q 60 128 100 132" stroke="#fff3cf" strokeOpacity="0.35" strokeWidth="3" fill="none" />
      </svg>
    </div>
  );
};
