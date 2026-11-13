import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CIERRE, COLORES, FRAMES_PUENTE_BUCLE, FRAMES_SALIDA_CIERRE, TEXTO_MIN } from "../config";
import { Escena } from "../componentes/Escena";
import { TextoCinetico } from "../componentes/TextoCinetico";
import { ZonaSegura } from "../componentes/ZonaSegura";
import { Chispas, Destello, useSacudida } from "../componentes/efectos";

const ESCALONADO = 3;
export const CTA = 62;

/** Escena 5 (32-38 s): mensaje principal + CTA. Se desvanece y da paso al gancho (bucle). */
export const Cierre: React.FC<{ duracion: number }> = ({ duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Impacto cuando aparece la parte resaltada del mensaje.
  const idxResaltado = CIERRE.mensaje.slice(0, CIERRE.mensaje.indexOf(CIERRE.resaltar)).split(" ").length - 1;
  const impactoMensaje = idxResaltado * ESCALONADO + 6;
  const sacudida = useSacudida([impactoMensaje, CTA + 4]);
  const cta = spring({ frame: frame - CTA, fps, config: { damping: 9, mass: 0.7 } });
  const pulso = frame > CTA + 20 ? 1 + 0.045 * Math.max(0, Math.sin(((frame - CTA - 20) / 22) * Math.PI)) : 1;
  const brillo = ((frame - CTA) % 45) / 45; // 0..1, barrido de brillo repetido

  return (
    <Escena duracion={duracion} finSalida={duracion - FRAMES_PUENTE_BUCLE} framesSalida={FRAMES_SALIDA_CIERRE}>
      <div style={{ position: "absolute", inset: 0, transform: sacudida }}>
        <ZonaSegura gap={80}>
          <TextoCinetico texto={CIERRE.mensaje} resaltar={CIERRE.resaltar} tamano={86} escalonado={ESCALONADO} />
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                gap: 24,
                padding: "30px 44px",
                borderRadius: 36,
                background: `linear-gradient(135deg, ${COLORES.primario}, ${COLORES.alerta})`,
                boxShadow: `0 0 ${40 + 30 * (pulso - 1) * 20}px ${COLORES.primario}`,
                fontSize: 64,
                fontWeight: 800,
                lineHeight: 1.15,
                opacity: Math.min(1, cta * 2),
                transform: `scale(${interpolate(cta, [0, 1], [2.2, 1]) * pulso})`,
              }}
            >
              <span style={{ fontSize: 96, transform: `rotate(${Math.sin(frame / 5) * 12}deg)`, display: "inline-block" }}>
                {CIERRE.ctaIcono}
              </span>
              <span>{CIERRE.cta}</span>
              {frame > CTA ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.5) 50%, transparent 65%)",
                    transform: `translateX(${interpolate(brillo, [0, 1], [-120, 120])}%)`,
                  }}
                />
              ) : null}
            </div>
            <Chispas en={CTA + 4} x={420} y={110} semilla="cta" cantidad={30} fuerza={40} />
          </div>
          {CIERRE.codigo ? (
            <div style={{ fontSize: TEXTO_MIN, fontWeight: 800, color: COLORES.secundario, opacity: cta }}>{CIERRE.codigo}</div>
          ) : null}
        </ZonaSegura>
      </div>
      <Destello impactos={[CTA + 4]} maximo={0.35} />
    </Escena>
  );
};
