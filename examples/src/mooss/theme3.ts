// MoossReel theme — forest green base, antique gold hero. Single source of truth.
import { Easing, continueRender, delayRender, staticFile } from "remotion";

// Fonts are self-hosted from public/mooss/fonts (all SIL Open Font Licence,
// from Google Fonts), so the reel renders offline and identically everywhere.
const ML = "U+0D00-0D7F, U+200C-200D, U+25CC, U+0964-0965";
const LATIN =
  "U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-200B, U+200E-206F, U+20AC, U+2122, U+2212";
const FACES: [string, string, string, string][] = [
  ["Noto Serif Malayalam", "NotoSerifMalayalam-ml.woff2", ML, "100 900"],
  ["Noto Serif Malayalam", "NotoSerifMalayalam-latin.woff2", LATIN, "100 900"],
  ["Anek Malayalam", "AnekMalayalam-ml.woff2", ML, "100 800"],
  ["Anek Malayalam", "AnekMalayalam-latin.woff2", LATIN, "100 800"],
  ["Cormorant Garamond", "CormorantGaramond-latin.woff2", LATIN, "300 700"],
];
if (typeof document !== "undefined") {
  const handle = delayRender("MoossReel fonts");
  Promise.all(
    FACES.map(([family, file, unicodeRange, weight]) => {
      const face = new FontFace(family, `url(${staticFile(`mooss/fonts/${file}`)}) format("woff2")`, {
        unicodeRange,
        weight,
        display: "block",
      });
      return face.load().then((f) => document.fonts.add(f));
    }),
  )
    .then(() => continueRender(handle))
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
}

export const mt = {
  colors: {
    bg: "#07140E",
    bgAlt: "#0D2418",
    forest: "#16402B",
    leaf: "#2C6A47",
    leafLight: "#4E8F63",
    gold: "#C9A24A", // THE hero color — max one element per frame
    goldLight: "#E9CF8A",
    goldDeep: "#8C6A26",
    cream: "#F4EBD6",
    creamDim: "#C9BFA6",
    palm: "#D8B878",
    palmDark: "#A9853F",
    ink: "#3B2A12",
    scrim: "rgba(4, 14, 9, 0.62)",
  },
  fonts: {
    mlHead: "'Noto Serif Malayalam', 'Manjari', serif",
    mlBody: "'Anek Malayalam', 'Manjari', sans-serif",
    latin: "'Cormorant Garamond', serif",
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
  },
  glow: (c: string) => `0 0 40px ${c}66, 0 0 90px ${c}33`,
} as const;

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
