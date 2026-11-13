import React from "react";
import { COLORES } from "../config";
import { BANCA, CUERPO, DISCO, SUELO, VIEWBOX, capsula, codo, type P } from "./geometria";

const C = { cuerpo: "#2B2E3F", contorno: "rgba(255,255,255,0.85)", banca: "#3A3D52", disco: "#202230" };

/**
 * Vista lateral: banca, persona tumbada (cabeza a la izquierda) y barra en `barra`.
 * El brazo se calcula con cinemática inversa para que la mano siga a la barra.
 * - capasMedio: se dibujan sobre el cuerpo y bajo el brazo (trayectorias).
 * - capasArriba: encima de todo (puntos de control, flechas).
 */
export const EscenaBanca: React.FC<{
  ancho: number;
  barra: P;
  capasMedio?: React.ReactNode;
  capasArriba?: React.ReactNode;
  opacidadPersona?: number;
}> = ({ ancho, barra, capasMedio, capasArriba, opacidadPersona = 1 }) => {
  const { codo: e, mano } = codo(CUERPO.hombro, barra);
  const trazo = { stroke: C.contorno, strokeWidth: 4, strokeLinejoin: "round" as const };
  return (
    <svg
      width={ancho}
      height={(ancho * VIEWBOX.alto) / VIEWBOX.ancho}
      viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.ancho} ${VIEWBOX.alto}`}
      style={{ overflow: "visible" }}
    >
      {/* Disco de la barra (detrás de todo) */}
      <circle cx={mano.x} cy={mano.y} r={DISCO.r} fill={C.disco} stroke="rgba(255,255,255,0.35)" strokeWidth={6} opacity={0.9} />
      <circle cx={mano.x} cy={mano.y} r={DISCO.r * 0.62} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={4} />
      {/* Suelo y banca */}
      <line x1={VIEWBOX.x + 20} x2={VIEWBOX.x + VIEWBOX.ancho - 20} y1={SUELO} y2={SUELO} stroke="rgba(255,255,255,0.25)" strokeWidth={4} strokeDasharray="14 12" />
      <rect x={185} y={BANCA.arriba + BANCA.grosor} width={26} height={SUELO - BANCA.arriba - BANCA.grosor} fill={C.banca} />
      <rect x={612} y={BANCA.arriba + BANCA.grosor} width={26} height={SUELO - BANCA.arriba - BANCA.grosor} fill={C.banca} />
      <rect x={150} y={SUELO - 14} width={100} height={14} rx={7} fill={C.banca} />
      <rect x={575} y={SUELO - 14} width={100} height={14} rx={7} fill={C.banca} />
      <rect x={BANCA.x0} y={BANCA.arriba} width={BANCA.x1 - BANCA.x0} height={BANCA.grosor} rx={14} fill={C.banca} stroke="rgba(255,255,255,0.3)" strokeWidth={3} />
      {/* Persona */}
      <g opacity={opacidadPersona}>
        <path d={capsula(CUERPO.rodilla, CUERPO.tobillo, 54)} fill={C.cuerpo} {...trazo} />
        <path d={capsula(CUERPO.tobillo, CUERPO.dedos, 30)} fill={C.cuerpo} {...trazo} />
        <path d={capsula(CUERPO.torso.hasta, CUERPO.rodilla, 72)} fill={C.cuerpo} {...trazo} />
        <path d={capsula(CUERPO.torso.desde, CUERPO.torso.hasta, CUERPO.torso.grosor)} fill={C.cuerpo} {...trazo} />
        <ellipse cx={CUERPO.pecho.x} cy={CUERPO.pecho.y} rx={CUERPO.pecho.rx} ry={CUERPO.pecho.ry} fill={C.cuerpo} {...trazo} />
        <circle cx={CUERPO.cabeza.x} cy={CUERPO.cabeza.y} r={CUERPO.cabeza.r} fill={C.cuerpo} {...trazo} />
      </g>
      {capasMedio}
      {/* Brazo (sigue a la barra) */}
      <g opacity={opacidadPersona}>
        <path d={capsula(CUERPO.hombro, e, 38)} fill={C.cuerpo} {...trazo} />
        <path d={capsula(e, mano, 32)} fill={C.cuerpo} {...trazo} />
      </g>
      {/* Extremo de la barra y mano */}
      <circle cx={mano.x} cy={mano.y} r={22} fill={COLORES.texto} stroke={COLORES.secundario} strokeWidth={6} />
      {capasArriba}
    </svg>
  );
};
