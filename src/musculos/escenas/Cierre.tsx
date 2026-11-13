import React from "react";
import { CIERRE, FRAMES_PUENTE_BUCLE, FRAMES_SALIDA_CIERRE } from "../config";
import { CierreSerie } from "../../serie/componentes/CierreSerie";

export const CTA = 45;

/** Escena 5 (29-34 s): frase de cierre + CTA. Se desvanece y da paso al gancho (bucle). */
export const Cierre: React.FC<{ duracion: number }> = ({ duracion }) => (
  <CierreSerie
    duracion={duracion}
    datos={CIERRE}
    ctaEn={CTA}
    framesPuente={FRAMES_PUENTE_BUCLE}
    framesSalida={FRAMES_SALIDA_CIERRE}
    tamanoMensaje={88}
  />
);
