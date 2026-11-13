import React from "react";
import { AbsoluteFill, Freeze, interpolate, useCurrentFrame } from "remotion";

/**
 * Funde hacia el frame 0 exacto de la primera escena (congelado) durante `duracion` frames.
 * Colócalo en una Sequence al final del video → el último frame es igual al primero (bucle).
 */
export const PuenteBucle: React.FC<{ duracion: number; children: React.ReactNode }> = ({ duracion, children }) => {
  const frame = useCurrentFrame();
  const opacidad = interpolate(frame, [0, duracion - 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: opacidad }}>
      <Freeze frame={0}>{children}</Freeze>
    </AbsoluteFill>
  );
};
