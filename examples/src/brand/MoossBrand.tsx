// Ashtavaidyan Pulamanthole Mooss — official logo, for every Mooss video.
// Source file: public/brand/mooss-logo-full.jpg (supplied by the client).
// The logo is teal/green on white, so on dark footage it always sits on a
// white/cream surface rather than being recoloured.
import React from "react";
import { Img, staticFile } from "remotion";

export const BRAND = {
  full: "brand/mooss-logo-full.jpg",
  emblem: "brand/mooss-emblem.png", // round tree mark + "MOOSS"
  wordmark: "brand/mooss-wordmark.png", // Ashtavaidyan / PULAMANTHOLE MOOSS / tagline
};

// Round white medallion holding the emblem.
export const BrandEmblem: React.FC<{ size: number; ring?: string; style?: React.CSSProperties }> = ({
  size,
  ring = "rgba(233, 207, 138, 0.9)",
  style,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: "#FFFFFF",
      boxShadow: `0 0 0 ${Math.max(2, size * 0.018)}px ${ring}, 0 ${size * 0.08}px ${size * 0.2}px -${size * 0.06}px rgba(0,0,0,0.75)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      ...style,
    }}
  >
    <Img src={staticFile(BRAND.emblem)} style={{ width: "74%", height: "74%", objectFit: "contain" }} />
  </div>
);

// Wordmark on a soft white card.
export const BrandWordmark: React.FC<{ width: number; style?: React.CSSProperties }> = ({ width, style }) => (
  <div
    style={{
      width,
      padding: `${width * 0.035}px ${width * 0.05}px`,
      borderRadius: width * 0.04,
      background: "#FFFFFF",
      boxShadow: "0 30px 60px -24px rgba(0,0,0,0.8), inset 0 -2px 0 rgba(0,0,0,0.05)",
      ...style,
    }}
  >
    <Img src={staticFile(BRAND.wordmark)} style={{ width: "100%", display: "block" }} />
  </div>
);
