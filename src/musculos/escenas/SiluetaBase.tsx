import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { RETRASO_ZONA, SILUETA_TEXTO, ZONAS, type ZonaId } from "../config";
import { Escena } from "../../serie/componentes/Escena";
import { TextoCinetico } from "../../serie/componentes/TextoCinetico";
import { ZonaSegura } from "../../serie/componentes/ZonaSegura";
import { Silueta } from "../silueta/Silueta";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const TRAZO = { inicio: 4, fin: 58 };
export const RELLENO = { inicio: 40, fin: 66 };
export const ZONAS_APARECEN = 60;

/** Escena 2 (3-6 s): la silueta se dibuja con una línea que se completa; luego aparecen las zonas en gris. */
export const SiluetaBase: React.FC<{ duracion: number }> = ({ duracion }) => {
  const frame = useCurrentFrame();
  const dibujo = interpolate(frame, [TRAZO.inicio, TRAZO.fin], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const relleno = interpolate(frame, [RELLENO.inicio, RELLENO.fin], [0, 1], clamp);
  const visibles = Object.fromEntries(
    ZONAS.map((z, i) => [z.id, interpolate(frame, [ZONAS_APARECEN + i * RETRASO_ZONA, ZONAS_APARECEN + 8 + i * RETRASO_ZONA], [0, 1], clamp)]),
  ) as Record<ZonaId, number>;

  return (
    <Escena duracion={duracion}>
      <ZonaSegura gap={40}>
        <TextoCinetico texto={SILUETA_TEXTO.titulo} resaltar={SILUETA_TEXTO.resaltar} tamano={88} escalonado={3} />
        <Silueta alto={740} profundidad={0} dibujo={dibujo} relleno={relleno} zonasVisibles={visibles} />
      </ZonaSegura>
    </Escena>
  );
};
