import React from "react";
import { CIERRE, FRAMES_PUENTE_BUCLE, FRAMES_SALIDA_CIERRE } from "../config";
import { CierreSerie } from "../../serie/componentes/CierreSerie";

export const CTA = 62;

/** Escena 5 (32-38 s): mensaje principal + CTA. Se desvanece y da paso al gancho (bucle). */
export const Cierre: React.FC<{ duracion: number }> = ({ duracion }) => (
  <CierreSerie
    duracion={duracion}
    datos={CIERRE}
    ctaEn={CTA}
    framesPuente={FRAMES_PUENTE_BUCLE}
    framesSalida={FRAMES_SALIDA_CIERRE}
  />
);
