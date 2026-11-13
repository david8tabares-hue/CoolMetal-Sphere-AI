import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { COLORES, EFECTOS, FUENTE } from "../config";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Sacudida de cámara que decae tras cada frame de impacto. Devuelve un `transform`. */
export const useSacudida = (impactos: number[], intensidad = EFECTOS.sacudida) => {
  const frame = useCurrentFrame();
  let x = 0;
  let y = 0;
  let r = 0;
  for (const i of impactos) {
    const t = frame - i;
    if (t < 0 || t > 20) continue;
    const a = intensidad * Math.exp(-t / 4);
    x += a * Math.sin(t * 2.7);
    y += a * Math.cos(t * 3.3) * 0.7;
    r += a * 0.06 * Math.sin(t * 2.1);
  }
  return `translate(${x}px, ${y}px) rotate(${r}deg)`;
};

/** Escala de "golpe" 1 → pico → 1 alrededor de cada impacto. */
export const useGolpe = (impactos: number[], pico = 1.2) => {
  const frame = useCurrentFrame();
  return impactos.reduce(
    (acc, i) => acc * interpolate(frame, [i, i + 3, i + 12], [1, pico, 1], clamp),
    1,
  );
};

/** Explosión de chispas (posición relativa al contenedor con position: relative). */
export const Chispas: React.FC<{
  en: number;
  x: number;
  y: number;
  semilla: string;
  cantidad?: number;
  fuerza?: number;
  colores?: string[];
}> = ({
  en,
  x,
  y,
  semilla,
  cantidad = EFECTOS.chispas,
  fuerza = 28,
  colores = [COLORES.secundario, COLORES.primario, COLORES.texto],
}) => {
  const frame = useCurrentFrame();
  const t = frame - en;
  const VIDA = 34;
  if (t < 0 || t > VIDA) return null;
  const opacidad = interpolate(t, [0, 10, VIDA], [1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, pointerEvents: "none" }}>
      {Array.from({ length: cantidad }).map((_, i) => {
        const ang = random(`${semilla}-a-${i}`) * Math.PI * 2;
        const vel = (0.5 + random(`${semilla}-v-${i}`)) * fuerza;
        const d = vel * 8 * (1 - Math.exp(-t / 7));
        const px = x + Math.cos(ang) * d;
        const py = y + Math.sin(ang) * d + 0.35 * t * t * 0.5;
        const largo = (20 + random(`${semilla}-l-${i}`) * 40) * (1 - t / VIDA);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px,
              top: py,
              width: largo,
              height: 8,
              borderRadius: 4,
              background: colores[i % colores.length],
              opacity: opacidad,
              transform: `translate(-50%, -50%) rotate(${ang}rad)`,
              boxShadow: `0 0 12px ${colores[i % colores.length]}`,
            }}
          />
        );
      })}
    </div>
  );
};

/** Flash blanco breve en cada impacto. */
export const Destello: React.FC<{ impactos: number[]; maximo?: number }> = ({ impactos, maximo = EFECTOS.destello }) => {
  const frame = useCurrentFrame();
  const o = Math.max(0, ...impactos.map((i) => interpolate(frame - i, [0, 1, 8], [0, maximo, 0], clamp)));
  if (o <= 0) return null;
  return <AbsoluteFill style={{ background: "white", opacity: o, pointerEvents: "none" }} />;
};

/** Número/símbolo gigante con contorno, detrás del contenido. */
export const NumeroGigante: React.FC<{ texto: string; color?: string }> = ({ texto, color = COLORES.primario }) => {
  const frame = useCurrentFrame();
  const escala = interpolate(frame, [0, 180], [1.15, 1], clamp);
  const entrada = interpolate(frame, [0, 10], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      <div
        style={{
          fontFamily: FUENTE,
          fontWeight: 800,
          fontSize: 1100,
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: `8px ${color}`,
          opacity: 0.16 * entrada,
          transform: `translate(120px, 40px) scale(${escala}) rotate(-8deg)`,
        }}
      >
        {texto}
      </div>
    </AbsoluteFill>
  );
};

/** Barrido diagonal de color que tapa el corte entre dos escenas (centrado en el corte). */
export const Barrido: React.FC<{ duracion: number }> = ({ duracion }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, duracion - 1], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const x = interpolate(p, [0, 1], [-2700, 1500]);
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: -200,
          left: x - 160,
          width: 2400,
          height: 2400,
          background: COLORES.secundario,
          transform: "skewX(-20deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -200,
          left: x,
          width: 2200,
          height: 2400,
          background: `linear-gradient(90deg, ${COLORES.primario}, ${COLORES.alerta})`,
          transform: "skewX(-20deg)",
        }}
      />
    </AbsoluteFill>
  );
};
