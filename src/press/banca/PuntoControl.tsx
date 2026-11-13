import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORES, FUENTE } from "../config";
import type { P } from "./geometria";

/**
 * Punto de control reutilizable sobre la trayectoria (dentro del SVG de la banca).
 * Aparece con spring en `aparece` (frame local) y late mientras está `activo`.
 */
export const PuntoControl: React.FC<{ en: P; numero: number; aparece: number; activo: boolean }> = ({
  en,
  numero,
  aparece,
  activo,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - aparece, fps, config: { damping: 9, mass: 0.6 } });
  if (frame < aparece) return null;
  const ciclo = ((frame - aparece) % 30) / 30;
  const color = activo ? COLORES.secundario : COLORES.primario;
  // Etiqueta numerada a la derecha del punto, unida con una línea.
  const etiqueta = { x: en.x + 130, y: en.y - 40 };
  return (
    <g opacity={Math.min(1, s * 2)} transform={`translate(${en.x} ${en.y}) scale(${s}) translate(${-en.x} ${-en.y})`}>
      {activo ? (
        <circle cx={en.x} cy={en.y} r={interpolate(ciclo, [0, 1], [22, 70])} fill="none" stroke={color} strokeWidth={5} opacity={1 - ciclo} />
      ) : null}
      <line x1={en.x} y1={en.y} x2={etiqueta.x} y2={etiqueta.y} stroke={color} strokeWidth={4} opacity={activo ? 1 : 0.6} />
      <circle cx={en.x} cy={en.y} r={18} fill={color} stroke={COLORES.fondo} strokeWidth={5} />
      <circle cx={etiqueta.x} cy={etiqueta.y} r={38} fill={color} opacity={activo ? 1 : 0.75} />
      <text x={etiqueta.x} y={etiqueta.y + 16} textAnchor="middle" fontSize={46} fontWeight={800} fontFamily={FUENTE} fill={COLORES.fondo}>
        {numero}
      </text>
    </g>
  );
};
