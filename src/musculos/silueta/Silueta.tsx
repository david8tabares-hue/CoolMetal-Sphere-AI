import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORES, COLORES_SILUETA, ZONAS, type ZonaId } from "../config";
import { articulaciones } from "./movimiento";
import { piezasCuerpo, zonas as formasZonas } from "./geometria";
import { Zona } from "./Zona";

/** Recorte ajustado al cuerpo en todas las posturas (de pie y abajo). */
export const VIEWBOX = { x: 80, y: 70, ancho: 500, alto: 820 };

/**
 * Silueta de perfil haciendo sentadilla, con cada zona muscular como pieza independiente.
 * - profundidad: 0 de pie → 1 abajo.
 * - intensidades: activación 0..1 de cada zona (color primario).
 * - dibujo: 0..1 progreso del trazo del contorno; relleno: 0..1 opacidad del cuerpo.
 */
export const Silueta: React.FC<{
  alto: number;
  profundidad: number;
  intensidades?: Partial<Record<ZonaId, number>>;
  acumuladas?: Partial<Record<ZonaId, number>>;
  dibujo?: number;
  relleno?: number;
  zonasVisibles?: number | Partial<Record<ZonaId, number>>;
  pulso?: ZonaId | null;
}> = ({ alto, profundidad, intensidades = {}, acumuladas = {}, dibujo = 1, relleno = 1, zonasVisibles = 1, pulso = null }) => {
  const frame = useCurrentFrame();
  const j = articulaciones(profundidad);
  const cuerpo = piezasCuerpo(j);
  const formas = formasZonas(j);
  const pieza = (d: string, i: number) => (
    <path
      key={i}
      d={d}
      pathLength={1}
      fill={COLORES_SILUETA.cuerpo}
      fillOpacity={relleno}
      stroke={COLORES_SILUETA.contorno}
      strokeWidth={4}
      strokeLinejoin="round"
      strokeDasharray={1}
      strokeDashoffset={1 - dibujo}
    />
  );
  const visible = (id: ZonaId) => (typeof zonasVisibles === "number" ? zonasVisibles : (zonasVisibles[id] ?? 0));
  // Anillo que late sobre la zona destacada.
  const ciclo = (frame % 30) / 30;

  return (
    <svg
      width={(alto * VIEWBOX.ancho) / VIEWBOX.alto}
      height={alto}
      viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.ancho} ${VIEWBOX.alto}`}
      style={{ overflow: "visible" }}
    >
      <line x1={120} x2={560} y1={j.tobillo.y + 42} y2={j.tobillo.y + 42} stroke="rgba(255,255,255,0.25)" strokeWidth={4} strokeDasharray="14 12" opacity={dibujo} />
      {cuerpo.detras.map(pieza)}
      {ZONAS.map((z) => (
        <Zona
          key={z.id}
          d={formas[z.id].d}
          intensidad={intensidades[z.id] ?? 0}
          acumulada={acumuladas[z.id] ?? 0}
          opacidad={visible(z.id)}
        />
      ))}
      {pulso ? (
        <circle
          cx={formas[pulso].centro.x}
          cy={formas[pulso].centro.y}
          r={interpolate(ciclo, [0, 1], [30, 95])}
          fill="none"
          stroke={COLORES.secundario}
          strokeWidth={6}
          opacity={interpolate(ciclo, [0, 1], [0.9, 0])}
        />
      ) : null}
      {cuerpo.delante.map((d, i) => pieza(d, 100 + i))}
    </svg>
  );
};
