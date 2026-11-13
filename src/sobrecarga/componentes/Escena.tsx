import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FRAMES_FUNDIDO } from "../config";

/** Envoltorio de escena: zoom de entrada (spring) y fundido de salida (interpolate). */
export const Escena: React.FC<{
  duracion: number;
  children: React.ReactNode;
  fundidoEntrada?: boolean;
  fundidoSalida?: boolean;
  /** Frame en el que termina el fundido de salida (por defecto, el final de la escena). */
  finSalida?: number;
  framesSalida?: number;
}> = ({ duracion, children, fundidoEntrada = true, fundidoSalida = true, finSalida = duracion, framesSalida = FRAMES_FUNDIDO }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = fundidoEntrada ? spring({ frame, fps, config: { damping: 18 } }) : 1;
  const salida = fundidoSalida
    ? interpolate(frame, [finSalida - framesSalida, finSalida], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;
  return (
    <AbsoluteFill style={{ opacity: salida, transform: `scale(${interpolate(zoom, [0, 1], [1.12, 1])})` }}>
      {children}
    </AbsoluteFill>
  );
};
