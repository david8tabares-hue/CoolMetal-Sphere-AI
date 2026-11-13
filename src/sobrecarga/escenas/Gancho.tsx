import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORES, GANCHOS } from "../config";
import { Escena } from "../componentes/Escena";
import { TextoCinetico } from "../componentes/TextoCinetico";
import { ZonaSegura } from "../componentes/ZonaSegura";
import { Chispas, Destello, NumeroGigante, useGolpe, useSacudida } from "../componentes/efectos";

const IMPACTOS = [6, 48];

/**
 * Escena 1 (0-3 s): gancho. Texto completo desde el frame 0 para frenar el scroll;
 * ese frame 0 es también el último del video (bucle).
 */
export const Gancho: React.FC<{ duracion: number; indice: number }> = ({ duracion, indice }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const gancho = GANCHOS[indice] ?? GANCHOS[0];
  const sacudida = useSacudida(IMPACTOS);
  const golpe = useGolpe(IMPACTOS, 1.25);
  // Glitch RGB en la palabra clave justo después del impacto.
  const t = frame - IMPACTOS[0];
  const glitch = t >= 0 && t < 14 ? (1 - t / 14) * 16 * (t % 2 ? 1 : -1) : 0;
  const sombra = glitch ? `${glitch}px 0 0 ${COLORES.alerta}, ${-glitch}px 0 0 ${COLORES.cian}` : undefined;
  const flecha = spring({ frame: frame - 26, fps, config: { damping: 9 } });
  const alarma = 0.12 + 0.06 * Math.sin(frame / 4);

  return (
    <Escena duracion={duracion} fundidoEntrada={false}>
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(-45deg, ${COLORES.alerta} 0 36px, transparent 36px 110px)`,
          backgroundPosition: `${frame * 5}px 0`,
          opacity: alarma,
        }}
      />
      <AbsoluteFill style={{ background: `radial-gradient(circle, transparent 40%, ${COLORES.alerta}55 100%)` }} />
      <NumeroGigante texto="?" color={COLORES.alerta} />
      <AbsoluteFill style={{ transform: sacudida }}>
        <ZonaSegura gap={60}>
          <TextoCinetico
            texto={gancho.texto}
            resaltar={gancho.resaltar}
            tamano={100}
            instantaneo
            transformResaltado={`scale(${golpe})`}
            sombraResaltado={sombra}
          />
          <div
            style={{
              fontSize: 150,
              lineHeight: 1,
              opacity: flecha,
              transform: `translateY(${interpolate(flecha, [0, 1], [-80, 0]) + Math.sin(frame / 4) * 14}px) scale(${flecha})`,
            }}
          >
            👇
          </div>
        </ZonaSegura>
        <Chispas en={IMPACTOS[0]} x={520} y={900} semilla="gancho" fuerza={36} />
      </AbsoluteFill>
      <Destello impactos={[IMPACTOS[0]]} />
    </Escena>
  );
};
