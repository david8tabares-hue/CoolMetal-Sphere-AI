import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORES } from "../tema";

type Palabra = { texto: string; resaltada: boolean; palabras: number; indice: number };

const dividir = (texto: string, resaltar?: string): Palabra[] => {
  const ini = resaltar ? texto.indexOf(resaltar) : -1;
  const fin = ini + (resaltar?.length ?? 0);
  const res: Palabra[] = [];
  let pos = 0;
  for (const w of texto.split(" ")) {
    const a = texto.indexOf(w, pos);
    const b = a + w.length;
    pos = b;
    const resaltada = ini >= 0 && a < fin && b > ini;
    const previa = res[res.length - 1];
    // Las palabras resaltadas consecutivas forman un solo bloque de marcador.
    if (resaltada && previa?.resaltada) {
      previa.texto += ` ${w}`;
      previa.palabras += 1;
    } else {
      res.push({ texto: w, resaltada, palabras: 1, indice: res.reduce((n, p) => n + p.palabras, 0) });
    }
  }
  return res;
};

/**
 * Texto que entra palabra a palabra (spring) con la parte `resaltar` en marcador amarillo.
 * `instantaneo` lo muestra completo desde el frame 0 (para el gancho y el bucle).
 */
export const TextoCinetico: React.FC<{
  texto: string;
  resaltar?: string;
  tamano: number;
  inicio?: number;
  escalonado?: number;
  instantaneo?: boolean;
  peso?: number;
  interlineado?: number;
  estiloPalabra?: React.CSSProperties;
  /** transform extra para las palabras resaltadas (golpes, glitch…). */
  transformResaltado?: string;
  sombraResaltado?: string;
}> = ({
  texto,
  resaltar,
  tamano,
  inicio = 0,
  escalonado = 3,
  instantaneo = false,
  peso = 800,
  interlineado = 1.12,
  estiloPalabra,
  transformResaltado = "",
  sombraResaltado,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const palabras = dividir(texto, resaltar);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        columnGap: tamano * 0.26,
        rowGap: tamano * (interlineado - 1) + 6,
        fontSize: tamano,
        fontWeight: peso,
        lineHeight: interlineado,
      }}
    >
      {palabras.map((p, i) => {
        const s = instantaneo
          ? 1
          : spring({ frame: frame - (inicio + p.indice * escalonado), fps, config: { damping: 12, mass: 0.6 } });
        const marcador = instantaneo
          ? 1
          : spring({ frame: frame - (inicio + p.indice * escalonado + 5), fps, config: { damping: 16 } });
        const base: React.CSSProperties = {
          display: "inline-block",
          opacity: Math.min(1, s * 2),
          transform: `translateY(${(1 - s) * 70}px) scale(${interpolate(s, [0, 1], [0.4, 1])}) rotate(${(1 - s) * -10}deg)`,
          ...estiloPalabra,
        };
        if (!p.resaltada) return <span key={i} style={base}>{p.texto}</span>;
        return (
          <span key={i} style={{ ...base, transform: `${base.transform} ${transformResaltado}` }}>
            <span
              style={{
                display: "inline-block",
                padding: `0 ${tamano * 0.14}px`,
                borderRadius: tamano * 0.14,
                transform: "rotate(-2deg)",
                whiteSpace: "nowrap",
                color: marcador > 0.5 ? COLORES.fondo : COLORES.secundario,
                background: `linear-gradient(${COLORES.secundario}, ${COLORES.secundario}) no-repeat`,
                backgroundSize: `${marcador * 100}% 100%`,
                textShadow: sombraResaltado,
                boxShadow: marcador > 0.5 ? `0 0 ${tamano * 0.4}px rgba(255,210,63,0.45)` : undefined,
              }}
            >
              {p.texto}
            </span>
          </span>
        );
      })}
    </div>
  );
};
