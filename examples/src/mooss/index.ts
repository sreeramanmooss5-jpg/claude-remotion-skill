// Stand-alone entry for MoossReel: renders without the other examples'
// Google Fonts requests, so it works fully offline.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MoossReel, MOOSS_FPS, MOOSS_TOTAL_F } from "./MoossReel";

const Root: React.FC = () =>
  React.createElement(Composition, {
    id: "MoossReel",
    component: MoossReel,
    durationInFrames: MOOSS_TOTAL_F,
    fps: MOOSS_FPS,
    width: 1080,
    height: 1920,
  });

registerRoot(Root);
