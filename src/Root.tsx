import React from "react";
import { Composition } from "remotion";
import { CoolMetalPromo } from "./CoolMetalPromo";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="CoolMetalPromo"
    component={CoolMetalPromo}
    durationInFrames={150}
    fps={30}
    width={1080}
    height={1920}
  />
);
