import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { COLORES, FUENTE, PESO_TEXTO, RECURSOS, SERIE, TEXTO_MIN, ZONA_SEGURA } from "../config";

/** Insignia fija con el nombre de la serie (y el logo, si existe). */
export const InsigniaSerie: React.FC = () => (
  <AbsoluteFill style={{ alignItems: "center", paddingTop: ZONA_SEGURA.arriba }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "10px 36px",
        borderRadius: 999,
        background: COLORES.superficie,
        border: `3px solid ${COLORES.primario}`,
        fontFamily: FUENTE,
        fontWeight: PESO_TEXTO,
        fontSize: TEXTO_MIN,
        color: COLORES.texto,
        marginRight: ZONA_SEGURA.derecha - ZONA_SEGURA.izquierda,
      }}
    >
      {RECURSOS.logo ? (
        <Img src={staticFile(RECURSOS.logo)} style={{ height: 70, width: 70, objectFit: "contain" }} />
      ) : null}
      {SERIE}
    </div>
  </AbsoluteFill>
);
