import { getLength, getPointAtLength } from "@remotion/paths";

export type P = { x: number; y: number };

/** Recorte del dibujo de la banca (unidades del SVG). */
export const VIEWBOX = { x: 70, y: 150, ancho: 760, alto: 650 };

export const SUELO = 780;
export const BANCA = { x0: 130, x1: 700, arriba: 600, grosor: 30 };
export const CUERPO = {
  cabeza: { x: 178, y: 568, r: 38 },
  hombro: { x: 250, y: 562 },
  torso: { desde: { x: 245, y: 578 }, hasta: { x: 500, y: 582 }, grosor: 84 },
  pecho: { x: 335, y: 548, rx: 82, ry: 30 },
  rodilla: { x: 640, y: 552 },
  tobillo: { x: 692, y: 752 },
  dedos: { x: 745, y: 766 },
};
export const BRAZO = { superior: 150, antebrazo: 150 };
export const DISCO = { r: 96 };

/** Longitud real del path (con @remotion/paths, igual en Studio y en el render). */
export const largo = (d: string) => getLength(d);
/** Punto a una fracción (0..1) de la longitud del path. */
export const puntoEn = (d: string, fraccion: number): P => {
  const l = getLength(d);
  const p = getPointAtLength(d, Math.min(1, Math.max(0, fraccion)) * l);
  return p ? { x: p.x, y: p.y } : { x: 0, y: 0 };
};

/**
 * Cinemática inversa de 2 segmentos: codo para llevar la mano del hombro a la barra.
 * Se elige la solución con el codo hacia el suelo (como al bajar la barra).
 */
export const codo = (hombro: P, mano: P): { codo: P; mano: P } => {
  const { superior: a, antebrazo: b } = BRAZO;
  const dx = mano.x - hombro.x;
  const dy = mano.y - hombro.y;
  let d = Math.hypot(dx, dy);
  const max = a + b - 0.5;
  let m = mano;
  if (d > max) {
    m = { x: hombro.x + (dx / d) * max, y: hombro.y + (dy / d) * max };
    d = max;
  }
  const base = Math.atan2(m.y - hombro.y, m.x - hombro.x);
  const ang = Math.acos(Math.min(1, (a * a + d * d - b * b) / (2 * a * d)));
  const c1 = { x: hombro.x + a * Math.cos(base + ang), y: hombro.y + a * Math.sin(base + ang) };
  const c2 = { x: hombro.x + a * Math.cos(base - ang), y: hombro.y + a * Math.sin(base - ang) };
  return { codo: c1.y > c2.y ? c1 : c2, mano: m };
};

/** Cápsula (segmento con extremos redondos) como path SVG. */
export const capsula = (p: P, q: P, ancho: number) => {
  const l = Math.hypot(q.x - p.x, q.y - p.y) || 1;
  const n = { x: -(q.y - p.y) / l, y: (q.x - p.x) / l };
  const r = ancho / 2;
  const f = (v: number) => v.toFixed(1);
  const A = { x: p.x + n.x * r, y: p.y + n.y * r };
  const B = { x: q.x + n.x * r, y: q.y + n.y * r };
  const C = { x: q.x - n.x * r, y: q.y - n.y * r };
  const D = { x: p.x - n.x * r, y: p.y - n.y * r };
  return `M${f(A.x)},${f(A.y)} L${f(B.x)},${f(B.y)} A${f(r)},${f(r)} 0 0 0 ${f(C.x)},${f(C.y)} L${f(D.x)},${f(D.y)} A${f(r)},${f(r)} 0 0 0 ${f(A.x)},${f(A.y)} Z`;
};
