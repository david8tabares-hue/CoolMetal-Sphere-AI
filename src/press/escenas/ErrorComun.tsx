import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORES, ERROR_TEXTO, TEXTO_MIN, TIEMPOS, TRAYECTORIA_CORRECTA, TRAYECTORIA_ERROR } from "../config";
import { Escena } from "../../serie/componentes/Escena";
import { ZonaSegura } from "../../serie/componentes/ZonaSegura";
import { Chispas, useSacudida } from "../../serie/componentes/efectos";
import { EscenaBanca } from "../banca/EscenaBanca";
import { Trayectoria } from "../banca/Trayectoria";
import { Flecha } from "../banca/Flecha";
import { puntoEn } from "../banca/geometria";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const T = TIEMPOS.error;

/** Escena 4 (22-29 s): la trayectoria se desvía (rojo + flecha) y luego aparece la corregida. */
export const ErrorComun: React.FC<{ duracion: number }> = ({ duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pError = interpolate(frame, [T.trazoInicio, T.trazoFin], [0, 1], clamp);
  const pFlecha = interpolate(frame, [T.flecha, T.flecha + 10], [0, 1], clamp);
  const pBien = interpolate(frame, [T.correccionInicio, T.correccionFin], [0, 1], clamp);
  const corrigiendo = frame >= T.correccionInicio;
  const sacudida = useSacudida([T.flecha + 6], 16);
  const etiqueta = spring({ frame, fps, config: { damping: 12 } });
  const titulo = spring({ frame: frame - (corrigiendo ? T.correccionInicio : T.flecha), fps, config: { damping: 9, mass: 0.6 } });
  // La barra sigue la trayectoria con error y, al corregir, vuelve a recorrer la buena.
  const barra = corrigiendo
    ? puntoEn(TRAYECTORIA_CORRECTA, pBien)
    : puntoEn(TRAYECTORIA_ERROR, pError);
  // Flecha que apunta al tramo que se inclina de más.
  const tramo = puntoEn(TRAYECTORIA_ERROR, 0.72);
  const color = corrigiendo ? COLORES.primario : COLORES.alerta;

  return (
    <Escena duracion={duracion}>
      <div style={{ position: "absolute", inset: 0, transform: sacudida }}>
        <ZonaSegura gap={30}>
          <div style={{ height: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
            <div
              style={{
                fontSize: TEXTO_MIN,
                fontWeight: 800,
                padding: "6px 28px",
                borderRadius: 999,
                background: corrigiendo ? COLORES.primario : COLORES.alerta,
                transform: `scale(${etiqueta})`,
              }}
            >
              {corrigiendo ? "✅ Corregido" : `⚠️ ${ERROR_TEXTO.etiqueta}`}
            </div>
            <div
              style={{
                fontSize: 84,
                fontWeight: 800,
                lineHeight: 1.08,
                color,
                textShadow: `0 0 30px ${color}88`,
                opacity: frame >= T.flecha ? Math.min(1, titulo * 2) : 0,
                transform: `scale(${interpolate(titulo, [0, 1], [0.5, 1])})`,
              }}
            >
              {corrigiendo ? ERROR_TEXTO.correccion : ERROR_TEXTO.titulo}
            </div>
            {!corrigiendo ? (
              <div style={{ fontSize: TEXTO_MIN, color: COLORES.textoSuave, opacity: frame >= T.flecha ? titulo : 0 }}>{ERROR_TEXTO.frase}</div>
            ) : null}
          </div>
          <div style={{ position: "relative" }}>
            <EscenaBanca
              ancho={860}
              barra={barra}
              capasMedio={
                <>
                  <Trayectoria d={TRAYECTORIA_ERROR} progreso={pError} color={COLORES.alerta} ancho={14} opacidad={corrigiendo ? 0.4 : 1} brillo={!corrigiendo} />
                  {corrigiendo ? <Trayectoria d={TRAYECTORIA_CORRECTA} progreso={pBien} color={COLORES.primario} ancho={14} /> : null}
                </>
              }
              capasArriba={
                <Flecha
                  desde={{ x: tramo.x + 210, y: tramo.y - 70 }}
                  hasta={{ x: tramo.x + 30, y: tramo.y - 8 }}
                  color={COLORES.alerta}
                  progreso={pFlecha * (corrigiendo ? interpolate(frame, [T.correccionInicio, T.correccionInicio + 10], [1, 0], clamp) : 1)}
                />
              }
            />
            <Chispas en={T.flecha + 6} x={560} y={170} semilla="error" colores={[COLORES.alerta, COLORES.secundario, COLORES.texto]} />
          </div>
        </ZonaSegura>
      </div>
    </Escena>
  );
};
