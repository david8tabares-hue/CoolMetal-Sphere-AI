import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORES } from "../config";
import { Chispas, useGolpe, useSacudida } from "../../serie/componentes/efectos";
import { formatear } from "../../serie/componentes/formato";

// Frames (relativos a la escena) en que cae cada disco. El primero es el peso inicial.
const DISCOS = [
  { alto: 250, ancho: 50, cae: 6 },
  { alto: 205, ancho: 44, cae: 52 },
  { alto: 160, ancho: 38, cae: 92 },
];
export const IMPACTOS_PESO = DISCOS.slice(1).map((d) => d.cae + 6);

/** Barra con discos que caen con impacto: "más peso". */
export const AnimPeso: React.FC<{ incremento: number }> = ({ incremento }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sacudida = useSacudida(IMPACTOS_PESO, 18);
  const golpe = useGolpe(IMPACTOS_PESO, 1.35);
  const extra = DISCOS.slice(1).filter((d) => frame >= d.cae + 6).length;
  const etiqueta = spring({ frame: frame - IMPACTOS_PESO[0], fps, config: { damping: 10 } });

  const lado = (dir: 1 | -1) => (
    <div style={{ display: "flex", flexDirection: dir === 1 ? "row" : "row-reverse", alignItems: "center", gap: 6 }}>
      {DISCOS.map((d, i) => {
        const s = spring({ frame: frame - d.cae, fps, config: { damping: 11, mass: 0.6 } });
        return (
          <div
            key={i}
            style={{
              width: d.ancho,
              height: d.alto,
              borderRadius: 10,
              background: i === 0 ? "linear-gradient(#4a4a68, #2d2d44)" : `linear-gradient(${COLORES.secundario}, ${COLORES.primario})`,
              border: "4px solid rgba(255,255,255,0.3)",
              boxShadow: i === 0 ? undefined : `0 0 30px ${COLORES.primario}aa`,
              opacity: Math.min(1, s * 2),
              transform: `translateY(${interpolate(s, [0, 1], [-700, 0])}px)`,
            }}
          />
        );
      })}
    </div>
  );

  return (
    <div style={{ position: "relative", height: 330, width: 840, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", transform: sacudida }}>
        {lado(-1)}
        <div style={{ width: 400, height: 28, borderRadius: 14, background: "linear-gradient(#f0f2f7, #8c90a0)" }} />
        {lado(1)}
      </div>
      {extra > 0 ? (
        <div
          style={{
            position: "absolute",
            top: -40,
            left: "50%",
            fontSize: 90,
            fontWeight: 800,
            color: COLORES.secundario,
            textShadow: `0 0 30px ${COLORES.secundario}`,
            transform: `translateX(-50%) scale(${etiqueta * golpe})`,
          }}
        >
          +{formatear(extra * incremento)} kg
        </div>
      ) : null}
      {IMPACTOS_PESO.map((f, i) => (
        <React.Fragment key={f}>
          <Chispas en={f} x={110} y={260} semilla={`pi${i}`} cantidad={14} />
          <Chispas en={f} x={730} y={260} semilla={`pd${i}`} cantidad={14} />
        </React.Fragment>
      ))}
    </div>
  );
};
