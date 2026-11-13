import React from "react";
import { AbsoluteFill } from "remotion";
import { FUENTE, COLORES, PESO_TEXTO, ZONA_SEGURA } from "../tema";

/** Contenedor que coloca el contenido dentro de la zona segura vertical. */
export const ZonaSegura: React.FC<{
  children: React.ReactNode;
  justify?: React.CSSProperties["justifyContent"];
  gap?: number;
}> = ({ children, justify = "center", gap = 48 }) => (
  <AbsoluteFill
    style={{
      paddingTop: ZONA_SEGURA.arriba + 130, // deja sitio a la insignia de la serie
      paddingBottom: ZONA_SEGURA.abajo,
      paddingLeft: ZONA_SEGURA.izquierda,
      paddingRight: ZONA_SEGURA.derecha,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: justify,
      gap,
      fontFamily: FUENTE,
      fontWeight: PESO_TEXTO,
      color: COLORES.texto,
      textAlign: "center",
    }}
  >
    {children}
  </AbsoluteFill>
);
