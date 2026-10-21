// MoossReel — 25s 9:16 Malayalam health-awareness Reel for
// Ashtavaidyan Pulamanthole Mooss. All timing comes from timeline.json and
// the measured VO lengths in vo-durations.json.
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { clamp, mt } from "./theme3";
import timeline from "./timeline.json";
import voDur from "./vo-durations.json";
import { HerbalBRoll, Kolam, PalmLeaf, Urali } from "./Herbal";
import {
  Figure,
  IconCapsule,
  IconCheck,
  IconHeart,
  IconHourglass,
  IconPerson,
  IconPulse,
  IconQuestion,
  MlWords,
  Subtitles,
} from "./Type";
import { Grain } from "../components/Layers";
import { BrandEmblem, BrandWordmark } from "../brand/MoossBrand";

const C = mt.colors;
export const MOOSS_FPS = timeline.fps;
export const MOOSS_TOTAL_F = Math.round(timeline.fps * timeline.totalS);

type SceneKey = keyof typeof timeline.scenes;
const sceneF = (k: SceneKey, fps: number) => {
  const [a, b] = timeline.scenes[k];
  return { from: Math.round(a * fps), dur: Math.round((b - a) * fps) };
};
// VO i, in frames relative to the scene it belongs to
const voIn = (i: number, scene: SceneKey, fps: number) => ({
  start: Math.round(timeline.vo[i].start * fps) - sceneF(scene, fps).from,
  dur: Math.round(voDur[i] * fps),
});
// frame (scene-relative) at which a phrase is spoken inside VO i
const spokenAt = (i: number, scene: SceneKey, phrase: string, fps: number) => {
  const s = timeline.vo[i].speak;
  const v = voIn(i, scene, fps);
  return Math.round(v.start + (Math.max(0, s.indexOf(phrase)) / s.length) * v.dur);
};

// ---------- shared scene wrapper: fast exit (scale-through + blur) ----------
const SceneExit: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [dur - 10, dur], [0, 1], { ...clamp, easing: mt.ease.in });
  return (
    <AbsoluteFill style={{ opacity: 1 - t, transform: `scale(${1 + t * 0.07})`, filter: `blur(${t * 10}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

const useIn = (delay: number, cfg: keyof typeof mt.spring = "smooth") => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: mt.spring[cfg] });
};

// soft dark pool behind text so it always reads over the B-roll
const Scrim: React.FC<{ top: number; h: number }> = ({ top, h }) => (
  <div
    style={{
      position: "absolute",
      left: -100,
      right: -100,
      top,
      height: h,
      background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${C.scrim}, transparent 100%)`,
    }}
  />
);

// =====================================================================
// HOOK — the "viral post" + the question
// =====================================================================
const Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const q = spokenAt(0, "hook", "നിങ്ങൾക്കും", fps);
  const phone = useIn(0, "snappy");
  const stamp = useIn(q + 2, "bouncy");
  const likes = interpolate(spring({ frame: frame - 4, fps, config: { damping: 30, stiffness: 50 } }), [0, 1], [0, 48.2]);
  const heartPop = 1 + 0.25 * Math.max(0, Math.sin((frame / 6) * Math.PI)) * (frame < 30 ? 1 : 0);
  const shrink = interpolate(frame, [q - 6, q + 10], [1, 0.92], { ...clamp, easing: mt.ease.inOut });
  const breathe = Math.sin(frame / 14) * 6;
  return (
    <SceneExit dur={dur}>
      <Scrim top={160} h={460} />
      <Scrim top={1100} h={360} />
      {/* line 1 */}
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <MlWords text="സോഷ്യൽ മീഡിയയിൽ കണ്ട മരുന്ന്" delay={1} per={4} size={72} maxWidth={900} />
      </div>
      {/* phone card with a trending "post" */}
      <div
        style={{
          position: "absolute",
          left: 540 - 230,
          top: 470,
          width: 460,
          height: 640,
          borderRadius: 54,
          border: `3px solid ${C.creamDim}66`,
          background: "linear-gradient(160deg, rgba(22,64,43,0.92), rgba(7,20,14,0.95))",
          boxShadow: "0 50px 90px -30px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.08)",
          opacity: phone,
          transform: `translateY(${interpolate(phone, [0, 1], [380, 0]) + breathe}px) rotate(${interpolate(phone, [0, 1], [-9, -2])}deg) scale(${interpolate(phone, [0, 1], [0.8, 1]) * shrink})`,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: 20, left: 190, width: 80, height: 10, borderRadius: 6, background: `${C.creamDim}55` }} />
        {/* the "medicine" in the post: an amber bottle with a leaf label */}
        <div style={{ position: "absolute", top: 70, left: 30, right: 30, height: 380, borderRadius: 30, background: `radial-gradient(circle at 50% 40%, ${C.leaf}, ${C.bgAlt})`, overflow: "hidden" }}>
          <svg viewBox="0 0 100 160" width={170} height={272} style={{ position: "absolute", left: 115, top: 52 }}>
            <defs>
              <linearGradient id="amber" x1="0" x2="1">
                <stop offset="0" stopColor="#5a2d08" />
                <stop offset="0.45" stopColor="#b8641c" />
                <stop offset="0.6" stopColor="#d98a3a" />
                <stop offset="1" stopColor="#4a2306" />
              </linearGradient>
            </defs>
            <rect x="36" y="4" width="28" height="20" rx="4" fill="#2b2b2b" />
            <path d="M34 24 H66 V36 Q86 44 86 64 V146 Q86 156 76 156 H24 Q14 156 14 146 V64 Q14 44 34 36 Z" fill="url(#amber)" />
            <rect x="20" y="78" width="60" height="50" rx="6" fill={C.cream} />
            <path d="M50 86 C60 96 60 110 50 120 C40 110 40 96 50 86 Z" fill={C.leaf} />
            <path d="M24 60 Q22 100 26 140" stroke="#ffe2b0" strokeOpacity="0.5" strokeWidth="3" fill="none" />
          </svg>
        </div>
        {/* engagement row */}
        <div style={{ position: "absolute", top: 478, left: 40, display: "flex", alignItems: "center", gap: 18, color: C.cream }}>
          <div style={{ transform: `scale(${heartPop})`, color: C.cream }}>
            <IconHeart size={58} fill={`${C.cream}`} />
          </div>
          <span style={{ fontFamily: mt.fonts.latin, fontWeight: 700, fontSize: 52, fontVariantNumeric: "tabular-nums" }}>
            {likes.toFixed(1)}K
          </span>
        </div>
        <div style={{ position: "absolute", top: 565, left: 40, width: 300, height: 14, borderRadius: 8, background: `${C.creamDim}44` }} />
        <div style={{ position: "absolute", top: 592, left: 40, width: 200, height: 14, borderRadius: 8, background: `${C.creamDim}2a` }} />
      </div>
      {/* question badge stamps onto the post */}
      <div
        style={{
          position: "absolute",
          left: 700,
          top: 500,
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: C.cream,
          color: C.ink,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 20px 40px -10px rgba(0,0,0,0.7)",
          opacity: stamp,
          transform: `scale(${interpolate(stamp, [0, 1], [2.2, 1])}) rotate(${interpolate(stamp, [0, 1], [30, 8])}deg)`,
        }}
      >
        <IconQuestion size={110} />
      </div>
      {/* line 2 — the hook question */}
      <div style={{ position: "absolute", top: 1150, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <MlWords text="നിങ്ങൾക്കും അനുയോജ്യമാണോ?" delay={q - 2} per={5} size={84} hero={["നിങ്ങൾക്കും"]} maxWidth={980} />
      </div>
    </SceneExit>
  );
};

// =====================================================================
// S1 — one person helped ≠ everyone
// =====================================================================
const FIG_LAYOUT = [
  { h: 150, badge: "q" }, { h: 190, badge: "c" }, { h: 120, badge: "q" },
  { h: 175, badge: "q" }, { h: 0, badge: "" }, { h: 200, badge: "c" },
  { h: 130, badge: "c" }, { h: 185, badge: "q" }, { h: 160, badge: "q" },
];
const S1: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = voIn(1, "s1", fps);
  const split = spokenAt(1, "s1", "എല്ലാവർക്കും", fps);
  const hero = useIn(0, "bouncy");
  const check = useIn(12, "bouncy");
  const toGrid = interpolate(frame, [split - 8, split + 8], [0, 1], { ...clamp, easing: mt.ease.inOut });
  const line1Dim = interpolate(frame, [split - 6, split + 6], [1, 0], { ...clamp, easing: mt.ease.inOut });
  const cell = 212;
  const gridTop = 600;
  const float = (i: number) => Math.sin(frame / 18 + i) * 4;
  return (
    <SceneExit dur={dur}>
      <Scrim top={150} h={460} />
      <div style={{ position: "absolute", top: 240, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div style={{ opacity: interpolate(line1Dim, [0, 1], [0.55, 1]), transform: `scale(${interpolate(line1Dim, [0, 1], [0.78, 1])})` }}>
          <MlWords text="ഒരാൾക്ക് ഗുണം ചെയ്ത മരുന്ന്" delay={2} size={70} font={mt.fonts.mlHead} />
        </div>
        <MlWords text="എല്ലാവർക്കും അനുയോജ്യമാകണമെന്നില്ല" delay={split - 2} per={5} size={66} hero={["എല്ലാവർക്കും"]} maxWidth={1000} />
      </div>
      {/* the grid of different people */}
      {FIG_LAYOUT.map((f, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const cx = 540 + (col - 1) * cell;
        const cy = gridTop + row * cell + cell / 2 + 60;
        if (i === 4) {
          // the one person it worked for: centre → grid centre
          const s = interpolate(toGrid, [0, 1], [1.7, 1]);
          const y = interpolate(toGrid, [0, 1], [930, cy]);
          return (
            <div key={i} style={{ position: "absolute", left: cx, top: y, transform: `translate(-50%, -50%) scale(${s * hero}) translateY(${float(i)}px)`, opacity: hero }}>
              <div style={{ position: "relative", color: C.leafLight }}>
                <Figure h={170} color={C.creamDim} />
                <div style={{ position: "absolute", right: -46, top: -10, width: 70, height: 70, borderRadius: "50%", background: C.leaf, color: C.cream, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${check})`, border: `2px solid ${C.cream}55` }}>
                  <IconCheck size={50} draw={check} />
                </div>
              </div>
            </div>
          );
        }
        const p = spring({ frame: frame - split - 2 - i * 3, fps, config: mt.spring.snappy });
        return (
          <div key={i} style={{ position: "absolute", left: cx, top: cy, opacity: p, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.4, 1])}) translateY(${interpolate(p, [0, 1], [40, 0]) + float(i)}px)` }}>
            <div style={{ position: "relative", height: 200, display: "flex", alignItems: "flex-end" }}>
              <Figure h={f.h} color={i % 2 ? `${C.leafLight}` : `${C.leaf}`} />
              <div style={{ position: "absolute", right: -40, top: 200 - f.h - 30, width: 54, height: 54, borderRadius: "50%", background: f.badge === "c" ? C.leaf : C.bgAlt, color: C.cream, border: `2px solid ${C.cream}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {f.badge === "c" ? <IconCheck size={38} /> : <IconQuestion size={38} />}
              </div>
            </div>
          </div>
        );
      })}
      <Subtitles chunks={timeline.vo[1].subs} start={v.start} dur={v.dur} until={dur - 4} />
    </SceneExit>
  );
};

// =====================================================================
// S2 — the four considerations, on palm-leaf manuscripts
// =====================================================================
const FACTORS = [
  { label: "പ്രായം", Icon: IconHourglass },
  { label: "ആരോഗ്യനില", Icon: IconPulse },
  { label: "മറ്റ് മരുന്നുകൾ", Icon: IconCapsule },
  { label: "വ്യക്തിഗത ആവശ്യങ്ങൾ", Icon: IconPerson },
];
const S2: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = voIn(2, "s2", fps);
  const head = spokenAt(2, "s2", "പരിഗണിച്ചാണ്", fps);
  return (
    <SceneExit dur={dur}>
      <Scrim top={150} h={420} />
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <MlWords text="പരിഗണിച്ചാണ് ചികിത്സ തിരഞ്ഞെടുക്കേണ്ടത്" delay={head - 4} per={5} size={68} font={mt.fonts.mlHead} hero={["ചികിത്സ"]} maxWidth={940} />
      </div>
      {FACTORS.map(({ label, Icon }, i) => {
        const at = spokenAt(2, "s2", label, fps) - 5;
        const p = spring({ frame: frame - at, fps, config: mt.spring.smooth });
        const tick = spring({ frame: frame - head - 6 - i * 5, fps, config: mt.spring.snappy });
        const y = 520 + i * 182;
        const float = Math.sin(frame / 22 + i * 1.3) * 3;
        return (
          <div key={label} style={{ position: "absolute", left: 90, top: y, opacity: p, transform: `translateX(${interpolate(p, [0, 1], [220, 0])}px) rotate(${interpolate(p, [0, 1], [3, i % 2 ? 0.6 : -0.6])}deg) translateY(${float}px)` }}>
            <PalmLeaf w={900} h={150}>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 56px", gap: 30, color: C.ink }}>
                <div style={{ width: 92, height: 92, borderRadius: "50%", border: `3px solid ${C.ink}aa`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={60} />
                </div>
                <span style={{ fontFamily: mt.fonts.mlHead, fontWeight: 700, fontSize: 58, lineHeight: 1.3, flex: 1 }}>{label}</span>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.forest, color: C.cream, display: "flex", alignItems: "center", justifyContent: "center", opacity: tick, transform: `scale(${interpolate(tick, [0, 1], [0.3, 1])})` }}>
                  <IconCheck size={44} draw={tick} />
                </div>
              </div>
            </PalmLeaf>
          </div>
        );
      })}
      <Subtitles chunks={timeline.vo[2].subs} start={v.start} dur={v.dur} until={dur - 4} />
    </SceneExit>
  );
};

// =====================================================================
// S3 — not self-treatment: seek a qualified doctor
// =====================================================================
const S3: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = voIn(3, "s3", fps);
  const turn = spokenAt(3, "s3", "യോഗ്യനായ", fps);
  const strike = interpolate(frame, [turn - 12, turn - 2], [0, 1], { ...clamp, easing: mt.ease.out });
  const vessel = useIn(4, "smooth");
  const ring = interpolate(frame, [0, dur], [0, 40]);
  return (
    <SceneExit dur={dur}>
      <Scrim top={150} h={560} />
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", opacity: interpolate(strike, [0, 1], [1, 0.55]) }}>
          <MlWords text="സ്വയം ചികിത്സിക്കാതെ" delay={2} size={64} color={C.creamDim} />
          <div style={{ position: "absolute", left: -10, right: -10, top: "52%", height: 6, borderRadius: 4, background: C.cream, transformOrigin: "0% 50%", transform: `scaleX(${strike})` }} />
        </div>
      </div>
      <div style={{ position: "absolute", top: 350, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <MlWords text="യോഗ്യനായ ഡോക്ടറുടെ നിർദേശം തേടുക" delay={turn - 2} per={5} size={82} font={mt.fonts.mlHead} hero={["ഡോക്ടറുടെ"]} maxWidth={900} />
      </div>
      {/* urali with a slow kolam halo */}
      <div style={{ position: "absolute", left: 540, top: 1010, transform: "translate(-50%, -50%)" }}>
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -54%)", opacity: 0.55 * vessel }}>
          <Kolam size={520} draw={vessel} rot={ring} />
        </div>
        <div style={{ opacity: vessel, transform: `translateY(${interpolate(vessel, [0, 1], [120, 0])}px) scale(${interpolate(vessel, [0, 1], [0.85, 1]) * (1 + Math.sin(frame / 24) * 0.012)})` }}>
          <Urali w={440} />
        </div>
      </div>
      <Subtitles chunks={timeline.vo[3].subs} start={v.start} dur={v.dur} until={dur - 4} />
    </SceneExit>
  );
};

// =====================================================================
// CTA — brand lockup + follow
// =====================================================================
const CTA: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = interpolate(frame, [0, 40], [0, 1], { ...clamp, easing: mt.ease.out });
  const mark = useIn(6, "bouncy");
  const name = useIn(20, "smooth");
  const rule = interpolate(frame, [26, 46], [0, 1], { ...clamp, easing: mt.ease.out });
  const pill = useIn(44, "bouncy");
  const discl = useIn(70, "smooth");
  const pulse = 1 + Math.sin(frame / 10) * 0.02 * (frame > 60 ? 1 : 0);
  const fadeOut = interpolate(frame, [dur - 14, dur], [1, 0], { ...clamp, easing: mt.ease.in });
  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <Scrim top={240} h={1200} />
      {/* emblem */}
      <div style={{ position: "absolute", left: 540, top: 520, transform: "translate(-50%, -50%)" }}>
        <Kolam size={440} draw={draw} rot={frame * 0.25} />
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%, -50%) scale(${mark})` }}>
          <BrandEmblem size={300} />
        </div>
      </div>
      {/* official wordmark */}
      <div style={{ position: "absolute", top: 780, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ opacity: name, transform: `translateY(${interpolate(name, [0, 1], [36, 0])}px) scale(${interpolate(name, [0, 1], [0.94, 1])})` }}>
          <BrandWordmark width={880} />
        </div>
        <div style={{ marginTop: 30, width: 520 * rule, height: 2, background: `linear-gradient(90deg, transparent, ${C.goldLight}, transparent)` }} />
      </div>
      {/* follow */}
      <div style={{ position: "absolute", top: 1070, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <MlWords text="ആരോഗ്യവിവരങ്ങൾക്കായി" delay={32} size={58} weight={600} />
        <div style={{ opacity: pill, transform: `scale(${interpolate(pill, [0, 1], [0.6, 1]) * pulse})`, padding: "14px 56px 10px", borderRadius: 999, background: `linear-gradient(180deg, ${C.goldLight}, ${C.gold})`, color: C.ink, fontFamily: mt.fonts.mlBody, fontWeight: 700, fontSize: 60, lineHeight: 1.35, boxShadow: `${mt.glow(C.gold)}, 0 18px 40px -14px rgba(0,0,0,0.8)` }}>
          Follow ചെയ്യൂ
        </div>
      </div>
      {/* responsible-use note */}
      <div style={{ position: "absolute", top: 1360, left: 80, right: 80, textAlign: "center", fontFamily: mt.fonts.mlBody, fontWeight: 500, fontSize: 34, lineHeight: 1.45, color: C.creamDim, opacity: discl * 0.95, transform: `translateY(${interpolate(discl, [0, 1], [16, 0])}px)` }}>
        പൊതുവായ അറിവിന് മാത്രം · ചികിത്സയ്ക്ക് ഡോക്ടറെ സമീപിക്കുക
      </div>
    </AbsoluteFill>
  );
};

// small logo medallion, top centre, on every scene before the CTA
const Watermark: React.FC<{ until: number }> = ({ until }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - 4, fps, config: mt.spring.smooth });
  const out = interpolate(frame, [until - 10, until], [1, 0], { ...clamp, easing: mt.ease.in });
  if (frame > until) return null;
  return (
    <div style={{ position: "absolute", left: 540, top: 150, transform: `translate(-50%, -50%) translateY(${interpolate(p, [0, 1], [-20, 0])}px) scale(${interpolate(p, [0, 1], [0.8, 1])})`, opacity: p * out }}>
      <BrandEmblem size={104} ring={`${C.gold}cc`} />
    </div>
  );
};

// =====================================================================
// grade, vignette, light sweep
// =====================================================================
const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: C.gold, mixBlendMode: "soft-light", opacity: 0.12 }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.25), transparent 18%, transparent 80%, rgba(0,0,0,0.35))" }} />
  </AbsoluteFill>
);
const Vignette: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse 75% 60% at 50% 48%, transparent 55%, rgba(0,0,0,0.45) 100%)" }} />
);
// gold light sweeps diagonally across each cut
const LightSweep: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at - 9, at + 7], [0, 1], { ...clamp, easing: mt.ease.inOut });
  if (t <= 0 || t >= 1) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -600, left: interpolate(t, [0, 1], [-1400, 1500]), width: 700, height: 3200, transform: "rotate(18deg)", background: `linear-gradient(90deg, transparent, ${C.gold}55, ${C.goldLight}99, ${C.gold}55, transparent)`, filter: "blur(30px)", opacity: Math.sin(t * Math.PI) }} />
    </AbsoluteFill>
  );
};

// =====================================================================
// audio
// =====================================================================
const Sfx: React.FC<{ at: number; src: string; vol: number }> = ({ at, src, vol }) => (
  <Sequence from={Math.max(0, at)} layout="none">
    <Audio src={staticFile(src)} volume={vol} />
  </Sequence>
);

const Soundtrack: React.FC<{ cuts: number[] }> = ({ cuts }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const voWin = timeline.vo.map((v, i) => [Math.round(v.start * fps), Math.round((v.start + voDur[i]) * fps)]);
  const s = (k: SceneKey) => sceneF(k, fps).from;
  const hookQ = spokenAt(0, "hook", "നിങ്ങൾക്കും", fps);
  const split = s("s1") + spokenAt(1, "s1", "എല്ലാവർക്കും", fps);
  const s2Head = s("s2") + spokenAt(2, "s2", "പരിഗണിച്ചാണ്", fps);
  const s3Turn = s("s3") + spokenAt(3, "s3", "യോഗ്യനായ", fps);
  return (
    <>
      <Audio
        src={staticFile("mooss/drone.wav")}
        volume={(f) => {
          const talking = voWin.some(([a, b]) => f >= a - 4 && f <= b + 4);
          const base = talking ? 0.16 : 0.3;
          return base * interpolate(f, [durationInFrames - 30, durationInFrames], [1, 0], clamp);
        }}
      />
      {timeline.vo.map((v, i) => (
        <Sfx key={i} at={Math.round(v.start * fps)} src={`mooss/vo${i}.wav`} vol={1} />
      ))}
      {/* hook */}
      <Sfx at={0} src="sfx/bass.wav" vol={0.55} />
      <Sfx at={0} src="mooss/air.wav" vol={0.35} />
      {[6, 12, 18, 24].map((f) => <Sfx key={f} at={f} src="sfx/tick.wav" vol={0.12} />)}
      <Sfx at={hookQ - 1} src="sfx/bass.wav" vol={0.5} />
      <Sfx at={hookQ} src="mooss/bell.wav" vol={0.28} />
      {/* cuts */}
      {cuts.map((c) => <Sfx key={c} at={c - 8} src="mooss/air.wav" vol={0.4} />)}
      {/* s1 */}
      <Sfx at={s("s1") + 10} src="sfx/pop.wav" vol={0.3} />
      {[0, 1, 2, 3].map((i) => <Sfx key={i} at={split + i * 6} src="sfx/pop.wav" vol={0.14} />)}
      {/* s2 cards + ticks */}
      {FACTORS.map(({ label }) => (
        <Sfx key={label} at={s("s2") + spokenAt(2, "s2", label, fps) - 7} src="mooss/air.wav" vol={0.22} />
      ))}
      {FACTORS.map((_, i) => <Sfx key={i} at={s2Head + 4 + i * 5} src="sfx/tick.wav" vol={0.14} />)}
      {/* s3 */}
      <Sfx at={s3Turn - 13} src="sfx/whoosh.wav" vol={0.18} />
      <Sfx at={s3Turn} src="mooss/bell.wav" vol={0.16} />
      {/* cta */}
      <Sfx at={s("cta") + 4} src="mooss/bell.wav" vol={0.32} />
      <Sfx at={s("cta") + 42} src="sfx/pop.wav" vol={0.25} />
    </>
  );
};

// =====================================================================
export const MoossReel: React.FC = () => {
  const { fps } = useVideoConfig();
  const order: SceneKey[] = ["hook", "s1", "s2", "s3", "cta"];
  const scenes = { hook: Hook, s1: S1, s2: S2, s3: S3, cta: CTA };
  const cuts = order.slice(1).map((k) => sceneF(k, fps).from);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {/* 1–2: background + herbal B-roll plate */}
      <HerbalBRoll cuts={cuts} />
      {/* 3: graphics + type */}
      {order.map((k) => {
        const { from, dur } = sceneF(k, fps);
        const Scene = scenes[k];
        return (
          <Sequence key={k} from={from} durationInFrames={dur} name={k}>
            <Scene dur={dur} />
          </Sequence>
        );
      })}
      <Watermark until={sceneF("cta", fps).from} />
      {cuts.map((c) => <LightSweep key={c} at={c} />)}
      {/* 4: grade — 5: grain + vignette */}
      <Grade />
      <Grain />
      <Vignette />
      <Soundtrack cuts={cuts} />
    </AbsoluteFill>
  );
};
