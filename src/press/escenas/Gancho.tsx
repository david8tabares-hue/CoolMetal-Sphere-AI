import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORES, GANCHOS } from "../config";
import { Escena } from "../../serie/componentes/Escena";
import { TextoCinetico } from "../../serie/componentes/TextoCinetico";
import { ZonaSegura } from "../../serie/componentes/ZonaSegura";
import { Chispas, Destello, useGolpe, useSacudida } from "../../serie/componentes/efectos";
import { BarraFrontal } from "../banca/BarraFrontal";

export const IMPACTOS_GANCHO = [6];
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Escena 1 (0-3 s): texto grande + barra en el centro con zoom suave. Frame 0 = último frame (bucle). */
export const Gancho: React.FC<{ duracion: number; indice: number }> = ({ duracion, indice }) => {
  const frame = useCurrentFrame();
  const gancho = GANCHOS[indice] ?? GANCHOS[0];
  const sacudida = useSacudida(IMPACTOS_GANCHO, 16);
  const golpe = useGolpe(IMPACTOS_GANCHO, 1.2);
  const t = frame - IMPACTOS_GANCHO[0];
  const glitch = t >= 0 && t < 12 ? (1 - t / 12) * 14 * (t % 2 ? 1 : -1) : 0;
  const zoom = interpolate(frame, [0, duracion], [1.15, 1], clamp);
  // La barra "respira" arriba y abajo, como en una repetición.
  const vaiven = Math.sin((frame / duracion) * Math.PI * 2) * 18;

  return (
    <Escena duracion={duracion} fundidoEntrada={false}>
      <div style={{ position: "absolute", inset: 0, transform: sacudida }}>
        <ZonaSegura gap={110}>
          <TextoCinetico
            texto={gancho.texto}
            resaltar={gancho.resaltar}
            tamano={96}
            instantaneo
            transformResaltado={`scale(${golpe})`}
            sombraResaltado={glitch ? `${glitch}px 0 0 ${COLORES.alerta}, ${-glitch}px 0 0 ${COLORES.cian}` : undefined}
          />
          <div style={{ transform: `translateY(${vaiven}px) scale(${zoom})` }}>
            <BarraFrontal ancho={820} />
          </div>
        </ZonaSegura>
        <Chispas en={IMPACTOS_GANCHO[0]} x={520} y={1080} semilla="gancho-press" fuerza={32} />
      </div>
      <Destello impactos={IMPACTOS_GANCHO} maximo={0.3} />
    </Escena>
  );
};
