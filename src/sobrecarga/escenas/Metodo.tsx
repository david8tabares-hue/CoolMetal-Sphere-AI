import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORES, METODOS, TEXTO_MIN } from "../config";
import { Escena } from "../../serie/componentes/Escena";
import { TextoCinetico } from "../../serie/componentes/TextoCinetico";
import { ZonaSegura } from "../../serie/componentes/ZonaSegura";
import { Chispas, NumeroGigante, useSacudida } from "../../serie/componentes/efectos";
import { AnimPeso } from "../animaciones/AnimPeso";
import { AnimReps } from "../animaciones/AnimReps";
import { AnimTecnica } from "../animaciones/AnimTecnica";

export const IMPACTO_METODO = 8;

/** Escena 3 (8-26 s): una de las 3 formas de aplicar la sobrecarga progresiva. */
export const Metodo: React.FC<{ duracion: number; indice: 0 | 1 | 2 }> = ({ duracion, indice }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const metodo = METODOS[indice];
  const sacudida = useSacudida([IMPACTO_METODO]);
  const numero = spring({ frame, fps, config: { damping: 9, mass: 0.7 } });
  const extra = spring({ frame: frame - 100, fps, config: { damping: 14 } });

  const animacion =
    indice === 0 ? (
      <AnimPeso incremento={METODOS[0].incrementoKg} />
    ) : indice === 1 ? (
      <AnimReps inicio={METODOS[1].repsInicio} fin={METODOS[1].repsFin} />
    ) : (
      <AnimTecnica seriesInicio={METODOS[2].seriesInicio} segundosBajada={METODOS[2].segundosBajada} />
    );

  return (
    <Escena duracion={duracion}>
      <NumeroGigante texto={String(metodo.numero)} />
      <div style={{ position: "absolute", inset: 0, transform: sacudida }}>
        <ZonaSegura gap={40}>
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: 130,
                height: 130,
                borderRadius: 65,
                background: `linear-gradient(135deg, ${COLORES.primario}, ${COLORES.alerta})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 86,
                fontWeight: 800,
                boxShadow: `0 0 50px ${COLORES.primario}`,
                opacity: Math.min(1, numero * 2),
                transform: `scale(${interpolate(numero, [0, 1], [2.6, 1])}) rotate(${(1 - numero) * 90}deg)`,
              }}
            >
              {metodo.numero}
            </div>
            <Chispas en={IMPACTO_METODO} x={65} y={65} semilla={`num${indice}`} fuerza={30} />
          </div>
          <TextoCinetico texto={metodo.titulo} resaltar={metodo.resaltar} tamano={indice === 2 ? 84 : 100} inicio={6} escalonado={4} interlineado={1.05} />
          {animacion}
          <TextoCinetico texto={metodo.texto} tamano={64} inicio={26} escalonado={2} peso={600} />
          {metodo.extra ? (
            <div
              style={{
                fontSize: TEXTO_MIN,
                lineHeight: 1.2,
                color: COLORES.textoSuave,
                opacity: extra,
                transform: `translateY(${(1 - extra) * 30}px)`,
              }}
            >
              {metodo.extra}
            </div>
          ) : null}
        </ZonaSegura>
      </div>
    </Escena>
  );
};
