import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORES, EJEMPLO, TEXTO_MIN } from "../config";
import { Escena } from "../componentes/Escena";
import { TextoCinetico } from "../componentes/TextoCinetico";
import { ZonaSegura } from "../componentes/ZonaSegura";
import { Chispas, useSacudida } from "../componentes/efectos";
import { formatear } from "../componentes/formato";

const ALTO_MAX = 360;
const ANCHO_BARRA = 150;
const HUECO = 36;
const ALTO_ETIQUETA = 84;
const ALTO_SEMANA = 80;
const HUECO_COLUMNA = 10;
export const SELLO = 20;
const INICIO_BARRAS = 26;
export const INICIO_LINEA = 90;

/** Escena 4 (26-32 s): ejemplo ilustrativo semana a semana (números de EJEMPLO). */
export const Ejemplo: React.FC<{ duracion: number }> = ({ duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sacudida = useSacudida([SELLO + 4], 14);
  const sello = spring({ frame: frame - SELLO, fps, config: { damping: 10, mass: 0.7 } });
  const nota = spring({ frame: frame - 120, fps, config: { damping: 14 } });
  const tendencia = spring({ frame: frame - (INICIO_LINEA + 24), fps, config: { damping: 9 } });
  const n = EJEMPLO.semanas.length;
  const max = Math.max(...EJEMPLO.semanas.map((s) => s.valor));
  const ancho = n * ANCHO_BARRA + (n - 1) * HUECO;
  // Espacio extra arriba para la línea de tendencia.
  const altoGrafico = ALTO_MAX + ALTO_ETIQUETA + ALTO_SEMANA + 2 * HUECO_COLUMNA + 40;

  const crec = EJEMPLO.semanas.map((_, i) =>
    spring({ frame: frame - (INICIO_BARRAS + i * 12), fps, config: { damping: 13 } }),
  );
  // Puntos de la línea de tendencia (por encima de cada valor).
  const puntos = EJEMPLO.semanas.map((s, i) => ({
    x: i * (ANCHO_BARRA + HUECO) + ANCHO_BARRA / 2,
    // Encima de la etiqueta de valor de cada barra.
    y: altoGrafico - ALTO_SEMANA - 2 * HUECO_COLUMNA - (s.valor / max) * ALTO_MAX - ALTO_ETIQUETA - 22,
  }));
  const camino = puntos.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" ");
  const largo = puntos.slice(1).reduce((acc, p, i) => acc + Math.hypot(p.x - puntos[i].x, p.y - puntos[i].y), 0);
  const dibujo = interpolate(frame, [INICIO_LINEA, INICIO_LINEA + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ultimo = puntos[puntos.length - 1];

  return (
    <Escena duracion={duracion}>
      <div style={{ position: "absolute", inset: 0, transform: sacudida }}>
        <ZonaSegura gap={30}>
          <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
            <TextoCinetico texto={EJEMPLO.titulo} tamano={92} escalonado={4} />
            <div
              style={{
                fontSize: TEXTO_MIN,
                fontWeight: 800,
                padding: "4px 22px",
                border: `6px solid ${COLORES.secundario}`,
                borderRadius: 14,
                color: COLORES.secundario,
                opacity: Math.min(1, sello * 2),
                transform: `rotate(-12deg) scale(${interpolate(sello, [0, 1], [3, 1])})`,
              }}
            >
              {EJEMPLO.etiqueta}
            </div>
          </div>
          <div style={{ position: "relative", width: ancho, height: altoGrafico }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", gap: HUECO }}>
              {EJEMPLO.semanas.map((s, i) => {
                const c = crec[i];
                const esUltima = i === n - 1;
                return (
                  <div key={s.semana} style={{ width: ANCHO_BARRA, display: "flex", flexDirection: "column", alignItems: "center", gap: HUECO_COLUMNA }}>
                    <div
                      style={{
                        fontSize: TEXTO_MIN + (esUltima ? 12 : 0),
                        fontWeight: 800,
                        height: ALTO_ETIQUETA,
                        display: "flex",
                        alignItems: "flex-end",
                        opacity: Math.min(1, c * 2),
                        color: esUltima ? COLORES.secundario : COLORES.texto,
                        textShadow: esUltima ? `0 0 24px ${COLORES.secundario}` : undefined,
                      }}
                    >
                      {formatear(s.valor * Math.min(1, c))}
                    </div>
                    <div
                      style={{
                        width: ANCHO_BARRA,
                        height: (s.valor / max) * ALTO_MAX * c,
                        borderRadius: "20px 20px 0 0",
                        background: `linear-gradient(180deg, ${COLORES.secundario}, ${COLORES.primario})`,
                        opacity: interpolate(i, [0, n - 1], [0.55, 1]),
                        boxShadow: esUltima ? `0 0 50px ${COLORES.primario}` : undefined,
                      }}
                    />
                    <div style={{ fontSize: TEXTO_MIN, color: COLORES.textoSuave, height: ALTO_SEMANA }}>{s.semana}</div>
                  </div>
                );
              })}
            </div>
            <svg width={ancho} height={altoGrafico} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              <path
                d={camino}
                fill="none"
                stroke={COLORES.texto}
                strokeWidth={8}
                strokeLinecap="round"
                strokeDasharray={largo}
                strokeDashoffset={largo * (1 - dibujo)}
              />
              <polygon
                points={`${ultimo.x + 34},${ultimo.y - 20} ${ultimo.x - 6},${ultimo.y - 22} ${ultimo.x + 20},${ultimo.y + 14}`}
                fill={COLORES.texto}
                opacity={dibujo >= 1 ? 1 : 0}
              />
            </svg>
            <Chispas en={INICIO_LINEA + 24} x={ultimo.x + 20} y={ultimo.y - 10} semilla="tendencia" />
          </div>
          <div
            style={{
              fontSize: TEXTO_MIN + 6,
              fontWeight: 800,
              padding: "6px 26px",
              borderRadius: 18,
              background: `linear-gradient(135deg, ${COLORES.primario}, ${COLORES.alerta})`,
              boxShadow: `0 0 30px ${COLORES.primario}`,
              transform: `scale(${tendencia}) rotate(-3deg)`,
            }}
          >
            {EJEMPLO.tendencia} 📈
          </div>
          <div style={{ fontSize: TEXTO_MIN, color: COLORES.textoSuave, opacity: nota, lineHeight: 1.15 }}>{EJEMPLO.nota}</div>
        </ZonaSegura>
      </div>
    </Escena>
  );
};
