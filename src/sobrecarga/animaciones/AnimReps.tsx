import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORES, TEXTO_MIN } from "../config";
import { Chispas, useGolpe } from "../componentes/efectos";

export const PRIMER_CAMBIO = 40;
export const CADA = 20;
const R = 150;
const CIRC = 2 * Math.PI * R;

/** Contador con anillo de progreso que sube de `inicio` a `fin`: "más reps". */
export const AnimReps: React.FC<{ inicio: number; fin: number }> = ({ inicio, fin }) => {
  const frame = useCurrentFrame();
  const cambios = Array.from({ length: fin - inicio }, (_, i) => PRIMER_CAMBIO + i * CADA);
  const extra = cambios.filter((c) => frame >= c).length;
  const reps = inicio + extra;
  const golpe = useGolpe(cambios, 1.3);
  // El anillo se llena de forma continua entre cambios.
  const progreso = interpolate(frame, [0, PRIMER_CAMBIO, cambios[cambios.length - 1]], [0, inicio / fin, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ position: "relative", width: 380, height: 380, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={380} height={380} style={{ position: "absolute", transform: "rotate(-90deg)" }}>
        <circle cx={190} cy={190} r={R} fill="none" stroke={COLORES.superficie} strokeWidth={26} />
        <circle
          cx={190}
          cy={190}
          r={R}
          fill="none"
          stroke={extra > 0 ? COLORES.secundario : COLORES.primario}
          strokeWidth={26}
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC * (1 - progreso)}
          style={{ filter: `drop-shadow(0 0 14px ${COLORES.secundario})` }}
        />
      </svg>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1 }}>
        <span
          style={{
            fontSize: 170,
            fontWeight: 800,
            color: extra > 0 ? COLORES.secundario : COLORES.texto,
            transform: `scale(${golpe})`,
            textShadow: extra > 0 ? `0 0 40px ${COLORES.secundario}` : undefined,
          }}
        >
          {reps}
        </span>
        <span style={{ fontSize: TEXTO_MIN, color: COLORES.textoSuave }}>reps</span>
      </div>
      {cambios.map((c, i) => {
        const t = frame - c;
        if (t < 0 || t > 30) return null;
        return (
          <div
            key={c}
            style={{
              position: "absolute",
              right: -40,
              top: 40 - t * 3,
              fontSize: 72,
              fontWeight: 800,
              color: COLORES.secundario,
              opacity: interpolate(t, [0, 5, 30], [0, 1, 0]),
            }}
          >
            +1
            <Chispas en={c} x={40} y={40} semilla={`rep${i}`} cantidad={10} fuerza={20} />
          </div>
        );
      })}
    </div>
  );
};
