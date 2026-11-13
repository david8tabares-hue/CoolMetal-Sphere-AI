import React from "react";
import type { P } from "./geometria";

/** Flecha (línea + punta) de `desde` a `hasta`, dibujada según `progreso` (0..1). */
export const Flecha: React.FC<{ desde: P; hasta: P; color: string; progreso: number }> = ({ desde, hasta, color, progreso }) => {
  const p = Math.min(1, Math.max(0, progreso));
  const fin = { x: desde.x + (hasta.x - desde.x) * p, y: desde.y + (hasta.y - desde.y) * p };
  const ang = Math.atan2(hasta.y - desde.y, hasta.x - desde.x);
  const t = 34;
  const punta = [
    fin,
    { x: fin.x - t * Math.cos(ang - 0.45), y: fin.y - t * Math.sin(ang - 0.45) },
    { x: fin.x - t * Math.cos(ang + 0.45), y: fin.y - t * Math.sin(ang + 0.45) },
  ];
  if (p <= 0) return null;
  return (
    <g style={{ filter: `drop-shadow(0 0 10px ${color})` }}>
      <line x1={desde.x} y1={desde.y} x2={fin.x} y2={fin.y} stroke={color} strokeWidth={10} strokeLinecap="round" />
      <polygon points={punta.map((q) => `${q.x},${q.y}`).join(" ")} fill={color} />
    </g>
  );
};
