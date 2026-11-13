import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORES, TEXTO_MIN } from "../config";
import { Chispas, useSacudida } from "../../serie/componentes/efectos";

export const APARECE_SERIE = 30;
const INICIO_BAJADA = 62;
const ANCHO_PISTA = 680;

/** Una serie extra (golpe) + bajada lenta con tortuga: "más series o mejor técnica". */
export const AnimTecnica: React.FC<{ seriesInicio: number; segundosBajada: number }> = ({ seriesInicio, segundosBajada }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const finBajada = INICIO_BAJADA + segundosBajada * fps;
  const nueva = spring({ frame: frame - APARECE_SERIE, fps, config: { damping: 8, mass: 0.6 } });
  const sacudida = useSacudida([APARECE_SERIE + 5], 16);
  const progreso = interpolate(frame, [INICIO_BAJADA, finBajada], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const segundos = Math.min(segundosBajada, Math.floor(progreso * segundosBajada + 0.0001));
  const hecho = frame >= finBajada;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
      <div style={{ position: "relative", display: "flex", gap: 22, transform: sacudida }}>
        {Array.from({ length: seriesInicio + 1 }).map((_, i) => {
          const esNueva = i === seriesInicio;
          const s = esNueva ? nueva : spring({ frame: frame - i * 5, fps, config: { damping: 12 } });
          return (
            <div
              key={i}
              style={{
                width: 140,
                height: 140,
                borderRadius: 26,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: TEXTO_MIN + 6,
                fontWeight: 800,
                background: esNueva ? `linear-gradient(135deg, ${COLORES.secundario}, ${COLORES.primario})` : COLORES.superficie,
                color: esNueva ? COLORES.fondo : COLORES.texto,
                border: `5px solid ${esNueva ? COLORES.secundario : COLORES.primario}`,
                boxShadow: esNueva ? `0 0 40px ${COLORES.secundario}` : undefined,
                transform: esNueva ? `scale(${interpolate(nueva, [0, 1], [2.4, 1])})` : `scale(${s})`,
                opacity: esNueva ? Math.min(1, nueva * 2) : 1,
              }}
            >
              {esNueva ? "+1" : `S${i + 1}`}
            </div>
          );
        })}
        <Chispas en={APARECE_SERIE + 5} x={seriesInicio * 162 + 70} y={70} semilla="serie" />
      </div>
      <div style={{ fontSize: TEXTO_MIN, color: COLORES.textoSuave }}>
        Bajada lenta:{" "}
        <span style={{ color: hecho ? COLORES.secundario : COLORES.texto, fontWeight: 800, fontSize: 76 }}>
          {segundos} s {hecho ? "✅" : ""}
        </span>
      </div>
      <div style={{ position: "relative", width: ANCHO_PISTA, height: 24, borderRadius: 12, background: COLORES.superficie, marginTop: 40 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: progreso * ANCHO_PISTA,
            borderRadius: 12,
            background: `linear-gradient(90deg, ${COLORES.primario}, ${COLORES.secundario})`,
            boxShadow: `0 0 24px ${COLORES.primario}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -96,
            left: progreso * ANCHO_PISTA - 55,
            fontSize: 110,
            lineHeight: 1,
            transform: `scaleX(-1) translateY(${Math.abs(Math.sin(frame / 5)) * -10}px)`,
          }}
        >
          🐢
        </div>
        <Chispas en={finBajada} x={ANCHO_PISTA} y={12} semilla="tortuga" />
      </div>
    </div>
  );
};
