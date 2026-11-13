import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORES, GANCHOS, RETRASO_ZONA, ZONAS, type ZonaId } from "../config";
import { Escena } from "../../serie/componentes/Escena";
import { TextoCinetico } from "../../serie/componentes/TextoCinetico";
import { ZonaSegura } from "../../serie/componentes/ZonaSegura";
import { Chispas, Destello, useGolpe, useSacudida } from "../../serie/componentes/efectos";
import { Silueta } from "../silueta/Silueta";

export const IMPACTOS_GANCHO = [6];
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * Escena 1 (0-3 s): gancho. Texto grande + silueta con zoom suave.
 * El frame 0 tiene todo visible (frena el scroll) y es también el último frame (bucle).
 */
export const Gancho: React.FC<{ duracion: number; indice: number }> = ({ duracion, indice }) => {
  const frame = useCurrentFrame();
  const gancho = GANCHOS[indice] ?? GANCHOS[0];
  const sacudida = useSacudida(IMPACTOS_GANCHO, 16);
  const golpe = useGolpe(IMPACTOS_GANCHO, 1.2);
  const t = frame - IMPACTOS_GANCHO[0];
  const glitch = t >= 0 && t < 12 ? (1 - t / 12) * 14 * (t % 2 ? 1 : -1) : 0;
  const zoom = interpolate(frame, [0, duracion], [1.14, 1], clamp);
  // Avance: las zonas parpadean en cadena tras el impacto (escalonadas por índice).
  const intensidades = Object.fromEntries(
    ZONAS.map((z, i) => [z.id, interpolate(frame - (IMPACTOS_GANCHO[0] + 4 + i * RETRASO_ZONA), [0, 4, 24], [0, 1, 0], clamp)]),
  ) as Record<ZonaId, number>;

  return (
    <Escena duracion={duracion} fundidoEntrada={false}>
      <div style={{ position: "absolute", inset: 0, transform: sacudida }}>
        <ZonaSegura gap={100}>
          <TextoCinetico
            texto={gancho.texto}
            resaltar={gancho.resaltar}
            tamano={94}
            instantaneo
            transformResaltado={`scale(${golpe})`}
            sombraResaltado={glitch ? `${glitch}px 0 0 ${COLORES.alerta}, ${-glitch}px 0 0 ${COLORES.cian}` : undefined}
          />
          <div style={{ transform: `scale(${zoom})`, transformOrigin: "50% 100%" }}>
            <Silueta alto={560} profundidad={0} intensidades={intensidades} />
          </div>
        </ZonaSegura>
        <Chispas en={IMPACTOS_GANCHO[0]} x={520} y={640} semilla="gancho-musculos" fuerza={32} />
      </div>
      <Destello impactos={IMPACTOS_GANCHO} maximo={0.3} />
    </Escena>
  );
};
