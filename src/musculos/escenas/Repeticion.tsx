import React from "react";
import { interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORES, ICONO_FASE, REPETICION_TEXTO, REP_COMPLETA, RETRASO_ZONA, TEXTO_FASE, TEXTO_MIN, ZONAS, type ZonaId } from "../config";
import { Escena } from "../../serie/componentes/Escena";
import { TextoCinetico } from "../../serie/componentes/TextoCinetico";
import { ZonaSegura } from "../../serie/componentes/ZonaSegura";
import { Silueta } from "../silueta/Silueta";
import { activacion, faseRep } from "../silueta/movimiento";

/** Escena 4 (23-29 s): una repetición completa; todas las zonas se encienden y apagan con la fase. */
export const Repeticion: React.FC<{ duracion: number }> = ({ duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rep = faseRep(frame, fps, REP_COMPLETA);
  // Cada zona sigue la fase con un pequeño retraso por índice (efecto cascada).
  const intensidades = Object.fromEntries(
    ZONAS.map((z, i) => {
      const r = faseRep(frame - i * RETRASO_ZONA, fps, REP_COMPLETA);
      return [z.id, activacion(r.fase, r.progreso, frame)];
    }),
  ) as Record<ZonaId, number>;
  const rebote = spring({ frame: rep.frameEnFase, fps, config: { damping: 8, mass: 0.6 } });
  const esTitulo = frame < REP_COMPLETA.inicio * fps;

  return (
    <Escena duracion={duracion}>
      <ZonaSegura gap={28}>
        <div style={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {esTitulo ? (
            <TextoCinetico texto={REPETICION_TEXTO.titulo} resaltar={REPETICION_TEXTO.resaltar} tamano={96} escalonado={3} />
          ) : (
            <div
              style={{
                fontSize: 120,
                fontWeight: 800,
                color: COLORES.primario,
                textShadow: `0 0 40px ${COLORES.primario}`,
                transform: `scale(${interpolate(rebote, [0, 1], [1.5, 1])})`,
                opacity: Math.min(1, rebote * 2),
              }}
            >
              {ICONO_FASE[rep.fase]} {TEXTO_FASE[rep.fase].toUpperCase()}
            </div>
          )}
        </div>
        <Silueta alto={620} profundidad={rep.profundidad} intensidades={intensidades} />
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, maxWidth: 860 }}>
          {ZONAS.map((z) => {
            const n = intensidades[z.id];
            return (
              <div
                key={z.id}
                style={{
                  padding: "4px 22px",
                  borderRadius: 999,
                  fontSize: TEXTO_MIN,
                  fontWeight: 800,
                  background: interpolateColors(n, [0.12, 1], ["rgba(255,255,255,0.08)", COLORES.primario]),
                  boxShadow: `0 0 ${n * 30}px ${COLORES.primario}`,
                  color: interpolateColors(n, [0.12, 1], [COLORES.textoSuave, COLORES.texto]),
                }}
              >
                {z.nombre}
              </div>
            );
          })}
        </div>
      </ZonaSegura>
    </Escena>
  );
};
