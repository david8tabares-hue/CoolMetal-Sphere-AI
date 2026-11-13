import { Easing, interpolate } from "remotion";

export type Fase = "arriba" | "bajar" | "pausa" | "subir";
export type TiemposRep = { inicio: number; bajar: number; pausa: number; subir: number };

const suave = Easing.inOut(Easing.sin);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * Fase de una repetición a partir del frame local (useCurrentFrame de la escena).
 * profundidad: 0 = de pie, 1 = abajo del todo. progreso: 0..1 dentro de la fase.
 */
export const faseRep = (frame: number, fps: number, t: TiemposRep) => {
  const a = t.inicio * fps;
  const b = a + t.bajar * fps;
  const c = b + t.pausa * fps;
  const d = c + t.subir * fps;
  if (frame < a) return { fase: "arriba" as Fase, profundidad: 0, progreso: frame / a, frameEnFase: frame };
  if (frame < b) {
    const p = (frame - a) / (b - a);
    return { fase: "bajar" as Fase, profundidad: suave(p), progreso: p, frameEnFase: frame - a };
  }
  if (frame < c) return { fase: "pausa" as Fase, profundidad: 1, progreso: (frame - b) / (c - b), frameEnFase: frame - b };
  if (frame < d) {
    const p = (frame - c) / (d - c);
    return { fase: "subir" as Fase, profundidad: 1 - suave(p), progreso: p, frameEnFase: frame - c };
  }
  return { fase: "arriba" as Fase, profundidad: 0, progreso: 1, frameEnFase: frame - d };
};

/**
 * Nivel de activación visual (0..1) según la fase: crece al bajar, máximo en la pausa,
 * se mantiene alto al subir y se relaja arriba. Es una ayuda visual, no una medición.
 */
export const activacion = (fase: Fase, progreso: number, frame: number) => {
  switch (fase) {
    case "bajar":
      return interpolate(progreso, [0, 1], [0.2, 0.95], clamp);
    case "pausa":
      return 0.92 + 0.08 * Math.sin(frame / 2.5);
    case "subir":
      return interpolate(progreso, [0, 0.7, 1], [1, 0.9, 0.5], clamp);
    default:
      return 0.12;
  }
};

/** Ángulos (grados) de la postura en función de la profundidad (0 de pie → 1 abajo). */
const POSTURA = {
  tibia: [0, 34], // inclinación de la tibia hacia delante
  muslo: [2, 96], // muslo: vertical → paralelo al suelo
  tronco: [4, 40], // inclinación del tronco hacia delante
  brazo: [78, 94], // brazos extendidos al frente para equilibrar
};

export const LARGOS = { tibia: 190, muslo: 205, tronco: 225, cuello: 30, cabeza: 46, brazo: 205 };
export const GROSOR = { tibia: 62, muslo: 96, tronco: 122, cuello: 44, brazo: 38, gluteo: 58 };
export const TOBILLO = { x: 290, y: 835 };

export type P = { x: number; y: number };
const rad = (g: number) => (g * Math.PI) / 180;
const mezcla = (r: number[], t: number) => r[0] + (r[1] - r[0]) * t;

/** Cinemática directa desde el tobillo (pie fijo en el suelo). Vista lateral, mirando a la derecha. */
export const articulaciones = (profundidad: number) => {
  const ts = rad(mezcla(POSTURA.tibia, profundidad));
  const tm = rad(mezcla(POSTURA.muslo, profundidad));
  const tt = rad(mezcla(POSTURA.tronco, profundidad));
  const tb = rad(mezcla(POSTURA.brazo, profundidad));
  const tobillo = TOBILLO;
  const rodilla = { x: tobillo.x + LARGOS.tibia * Math.sin(ts), y: tobillo.y - LARGOS.tibia * Math.cos(ts) };
  const cadera = { x: rodilla.x - LARGOS.muslo * Math.sin(tm), y: rodilla.y - LARGOS.muslo * Math.cos(tm) };
  const hombro = { x: cadera.x + LARGOS.tronco * Math.sin(tt), y: cadera.y - LARGOS.tronco * Math.cos(tt) };
  const cuello = { x: hombro.x + LARGOS.cuello * Math.sin(tt * 0.6), y: hombro.y - LARGOS.cuello * Math.cos(tt * 0.6) };
  const cabeza = {
    x: cuello.x + (LARGOS.cabeza + 4) * Math.sin(tt * 0.4),
    y: cuello.y - (LARGOS.cabeza + 4) * Math.cos(tt * 0.4),
  };
  const mano = { x: hombro.x + LARGOS.brazo * Math.sin(tb), y: hombro.y + LARGOS.brazo * Math.cos(tb) };
  return { tobillo, rodilla, cadera, hombro, cuello, cabeza, mano };
};
export type Articulaciones = ReturnType<typeof articulaciones>;
