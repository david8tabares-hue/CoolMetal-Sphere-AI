import type { ZonaId } from "../config";
import { GROSOR, LARGOS, type Articulaciones, type P } from "./movimiento";

const sub = (a: P, b: P) => ({ x: a.x - b.x, y: a.y - b.y });
const add = (a: P, b: P) => ({ x: a.x + b.x, y: a.y + b.y });
const mul = (a: P, k: number) => ({ x: a.x * k, y: a.y * k });
const unit = (a: P) => {
  const l = Math.hypot(a.x, a.y) || 1;
  return { x: a.x / l, y: a.y / l };
};
/** Normal "frontal" de un segmento p→q (vista lateral mirando a la derecha). */
export const normal = (p: P, q: P) => {
  const d = unit(sub(q, p));
  return { x: -d.y, y: d.x };
};
const f = (n: number) => n.toFixed(1);

/** Cápsula (rectángulo con extremos redondos) entre p y q, como path SVG. */
export const capsula = (p: P, q: P, ancho: number) => {
  const n = normal(p, q);
  const r = ancho / 2;
  const a = add(p, mul(n, r));
  const b = add(q, mul(n, r));
  const c = add(q, mul(n, -r));
  const d = add(p, mul(n, -r));
  return `M${f(a.x)},${f(a.y)} L${f(b.x)},${f(b.y)} A${f(r)},${f(r)} 0 0 0 ${f(c.x)},${f(c.y)} L${f(d.x)},${f(d.y)} A${f(r)},${f(r)} 0 0 0 ${f(a.x)},${f(a.y)} Z`;
};

export const circulo = (c: P, r: number) =>
  `M${f(c.x - r)},${f(c.y)} a${f(r)},${f(r)} 0 1 0 ${f(2 * r)},0 a${f(r)},${f(r)} 0 1 0 ${f(-2 * r)},0 Z`;

const lerp = (p: P, q: P, t: number) => add(p, mul(sub(q, p), t));

/** Tramo de un segmento (de t0 a t1), desplazado hacia la cara frontal (+) o trasera (−). */
const banda = (p: P, q: P, t0: number, t1: number, desplazamiento: number, ancho: number) => {
  const n = normal(p, q);
  const a = add(lerp(p, q, t0), mul(n, desplazamiento));
  const b = add(lerp(p, q, t1), mul(n, desplazamiento));
  return { d: capsula(a, b, ancho), centro: lerp(a, b, 0.5) };
};

/** Centro del glúteo: detrás de la cadera, entre tronco y muslo. */
export const centroGluteo = (j: Articulaciones) => {
  const nT = normal(j.cadera, j.hombro);
  const nM = normal(j.rodilla, j.cadera);
  return add(j.cadera, add(mul(nT, -GROSOR.tronco * 0.27), mul(nM, -GROSOR.muslo * 0.18)));
};

/** Piezas del cuerpo (contorno + relleno), en orden de dibujo. */
export const piezasCuerpo = (j: Articulaciones) => {
  const pie = capsula({ x: j.tobillo.x - 30, y: j.tobillo.y + 22 }, { x: j.tobillo.x + 92, y: j.tobillo.y + 24 }, 34);
  return {
    detras: [
      capsula(j.tobillo, j.rodilla, GROSOR.tibia),
      pie,
      circulo(centroGluteo(j), GROSOR.gluteo),
      capsula(j.rodilla, j.cadera, GROSOR.muslo),
      capsula(j.cadera, j.hombro, GROSOR.tronco),
      capsula(j.hombro, j.cuello, GROSOR.cuello),
      circulo(j.cabeza, LARGOS.cabeza),
    ],
    delante: [capsula(j.hombro, j.mano, GROSOR.brazo)],
  };
};

/** Cada zona muscular es una pieza independiente: forma + centro (para el pulso). */
export const zonas = (j: Articulaciones): Record<ZonaId, { d: string; centro: P }> => {
  const gm = GROSOR.muslo;
  const gt = GROSOR.tronco;
  const cg = centroGluteo(j);
  return {
    cuadriceps: banda(j.rodilla, j.cadera, 0.12, 0.86, gm * 0.2, gm * 0.56),
    isquios: banda(j.rodilla, j.cadera, 0.14, 0.8, -gm * 0.21, gm * 0.5),
    gluteos: { d: circulo(cg, GROSOR.gluteo * 0.78), centro: cg },
    core: banda(j.cadera, j.hombro, 0.14, 0.6, gt * 0.22, gt * 0.46),
    lumbar: banda(j.cadera, j.hombro, 0.16, 0.52, -gt * 0.22, gt * 0.44),
  };
};
