import React from "react";
import { largo } from "./geometria";

/**
 * Trayectoria animada con strokeDasharray / strokeDashoffset.
 * La longitud real del path se mide con getLength (@remotion/paths):
 * dasharray = longitud, dashoffset = longitud × (1 − progreso).
 */
export const Trayectoria: React.FC<{
  d: string;
  progreso: number;
  color: string;
  ancho?: number;
  opacidad?: number;
  brillo?: boolean;
}> = ({ d, progreso, color, ancho = 12, opacidad = 1, brillo = true }) => {
  const l = largo(d);
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={ancho}
      strokeLinecap="round"
      strokeDasharray={l}
      strokeDashoffset={l * (1 - Math.min(1, Math.max(0, progreso)))}
      opacity={opacidad}
      style={brillo ? { filter: `drop-shadow(0 0 14px ${color})` } : undefined}
    />
  );
};
