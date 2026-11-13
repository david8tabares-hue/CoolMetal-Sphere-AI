import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORES } from "../tema";

/**
 * Fondo animado con manchas de color en órbita.
 * El movimiento es periódico sobre la duración total → el bucle no salta.
 */
export const Fondo: React.FC = () => {
  const frame = useCurrentFrame();
  // Periodo = duración de la composición → el bucle no salta.
  const { durationInFrames: DURACION_TOTAL_FRAMES } = useVideoConfig();
  const th = (frame / DURACION_TOTAL_FRAMES) * Math.PI * 2;
  const mancha = (x: number, y: number, r: number, color: string, opacidad: number) => (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
        opacity: opacidad,
      }}
    />
  );
  return (
    <AbsoluteFill style={{ background: COLORES.fondo, overflow: "hidden" }}>
      {mancha(540 + 320 * Math.cos(th), 600 + 260 * Math.sin(th), 800, COLORES.primario, 0.33)}
      {mancha(540 + 360 * Math.cos(th * 2 + 2), 1350 + 240 * Math.sin(th * 2 + 2), 850, COLORES.acento, 0.4)}
      {mancha(540 + 280 * Math.sin(th * 3), 1000 + 300 * Math.cos(th), 520, COLORES.secundario, 0.12)}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.045) 2px, transparent 2px)",
          backgroundSize: "90px 90px",
          backgroundPosition: `0 ${(frame * 90 * 4) / DURACION_TOTAL_FRAMES}px`,
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, transparent 45%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};
