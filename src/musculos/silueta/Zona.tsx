import React from "react";
import { interpolate, interpolateColors } from "remotion";
import { COLORES, COLORES_SILUETA } from "../config";

/**
 * Una zona muscular: gris neutro en reposo → color primario al activarse.
 * `acumulada` deja un tono suave en zonas que ya se explicaron.
 */
export const Zona: React.FC<{ d: string; intensidad: number; acumulada: number; opacidad: number }> = ({
  d,
  intensidad,
  acumulada,
  opacidad,
}) => {
  const nivel = Math.max(intensidad, acumulada * 0.4);
  const color = interpolateColors(nivel, [0, 1], [COLORES_SILUETA.zonaReposo, COLORES.primario]);
  const brillo = interpolate(intensidad, [0, 1], [0, 26], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <path
      d={d}
      fill={color}
      opacity={opacidad * interpolate(nivel, [0, 1], [0.7, 1])}
      style={{ filter: brillo > 0.5 ? `drop-shadow(0 0 ${brillo}px ${COLORES.primario})` : undefined }}
    />
  );
};
