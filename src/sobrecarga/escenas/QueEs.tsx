import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORES, QUE_ES, TEXTO_MIN } from "../config";
import { Escena } from "../../serie/componentes/Escena";
import { TextoCinetico } from "../../serie/componentes/TextoCinetico";
import { ZonaSegura } from "../../serie/componentes/ZonaSegura";
import { Chispas, Destello, useGolpe, useSacudida } from "../../serie/componentes/efectos";

const ANCHO_BARRA = 820;
const INICIO = 34;
const PASO = 16;
/** Frames en que sube cada escalón de la barra y en que queda llena. */
export const PASOS_BARRA = Array.from({ length: QUE_ES.pasosBarra }, (_, i) => INICIO + i * PASO);
export const FRAME_LLENO = PASOS_BARRA[PASOS_BARRA.length - 1] + 14;

/** Escena 2 (3-8 s): definición + barra de energía que se carga por escalones. */
export const QueEs: React.FC<{ duracion: number }> = ({ duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pasos = PASOS_BARRA;
  const relleno =
    pasos.reduce((acc, p) => acc + spring({ frame: frame - p, fps, config: { damping: 15 } }), 0) / pasos.length;
  const lleno = FRAME_LLENO;
  const sacudida = useSacudida([lleno], 16);
  const golpePct = useGolpe(pasos, 1.25);
  const etiqueta = frame >= lleno ? QUE_ES.etiquetaBarraLlena : QUE_ES.etiquetaBarra;

  return (
    <Escena duracion={duracion}>
      <div style={{ position: "absolute", inset: 0, transform: sacudida }}>
        <ZonaSegura gap={56}>
          <TextoCinetico
            texto={QUE_ES.titulo.toUpperCase()}
            tamano={104}
            escalonado={5}
            interlineado={1.02}
            estiloPalabra={{
              background: `linear-gradient(90deg, ${COLORES.primario}, ${COLORES.secundario})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          />
          <TextoCinetico texto={QUE_ES.definicion} resaltar="un poquito más" tamano={72} inicio={12} escalonado={2} peso={600} />
          <div style={{ display: "flex", flexDirection: "column", gap: 20, width: ANCHO_BARRA, marginTop: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: TEXTO_MIN }}>
              <span style={{ whiteSpace: "nowrap", color: frame >= lleno ? COLORES.secundario : COLORES.textoSuave }}>{etiqueta}</span>
              <span style={{ fontSize: 72, fontWeight: 800, color: COLORES.secundario, transform: `scale(${golpePct})`, display: "inline-block" }}>
                {Math.round(relleno * 100)}%
              </span>
            </div>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  height: 110,
                  borderRadius: 55,
                  background: COLORES.superficie,
                  border: `5px solid rgba(255,255,255,0.35)`,
                  overflow: "hidden",
                  boxShadow: `0 0 ${20 + relleno * 50}px ${COLORES.primario}88`,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${relleno * 100}%`,
                    backgroundImage: `repeating-linear-gradient(-45deg, rgba(255,255,255,0.22) 0 20px, transparent 20px 40px), linear-gradient(90deg, ${COLORES.primario}, ${COLORES.secundario})`,
                    backgroundPosition: `${frame * 3}px 0, 0 0`,
                  }}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  top: -10,
                  left: interpolate(relleno, [0, 1], [-20, ANCHO_BARRA - 110]),
                  fontSize: 120,
                  lineHeight: 1,
                  transform: `scale(${0.7 + relleno * 0.5}) rotate(${Math.sin(frame / 3) * 8}deg)`,
                }}
              >
                💪
              </div>
              <Chispas en={lleno} x={ANCHO_BARRA - 40} y={55} semilla="barra" fuerza={34} />
            </div>
          </div>
        </ZonaSegura>
      </div>
      <Destello impactos={[lleno]} maximo={0.3} />
    </Escena>
  );
};
