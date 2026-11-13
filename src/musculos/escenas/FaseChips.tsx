import React from "react";
import { interpolate, interpolateColors, spring, useVideoConfig } from "remotion";
import { COLORES, ICONO_FASE, TEXTO_FASE, TEXTO_MIN } from "../config";
import type { Fase } from "../silueta/movimiento";

const FASES = ["bajar", "pausa", "subir"] as const;

/** Indicador Bajar · Pausa · Subir con la fase actual encendida (rebote con spring). */
export const FaseChips: React.FC<{ fase: Fase; frameEnFase: number }> = ({ fase, frameEnFase }) => {
  const { fps } = useVideoConfig();
  const rebote = spring({ frame: frameEnFase, fps, config: { damping: 9, mass: 0.6 } });
  return (
    <div style={{ display: "flex", gap: 18 }}>
      {FASES.map((f) => {
        const activa = f === fase ? 1 : 0;
        return (
          <div
            key={f}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 24px",
              borderRadius: 999,
              fontSize: TEXTO_MIN,
              fontWeight: 800,
              background: interpolateColors(activa, [0, 1], ["rgba(255,255,255,0.08)", COLORES.primario]),
              color: interpolateColors(activa, [0, 1], [COLORES.textoSuave, COLORES.texto]),
              boxShadow: activa ? `0 0 34px ${COLORES.primario}` : undefined,
              transform: `scale(${activa ? interpolate(rebote, [0, 1], [1.25, 1.06]) : 0.94})`,
            }}
          >
            <span style={{ fontSize: TEXTO_MIN - 6 }}>{ICONO_FASE[f]}</span>
            {TEXTO_FASE[f]}
          </div>
        );
      })}
    </div>
  );
};
