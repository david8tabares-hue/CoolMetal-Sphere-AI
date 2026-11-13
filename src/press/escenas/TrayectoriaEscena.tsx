import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORES, TEXTO_MIN, TIEMPOS, TRAYECTORIA_CORRECTA, TRAYECTORIA_TEXTO } from "../config";
import { Escena } from "../../serie/componentes/Escena";
import { TextoCinetico } from "../../serie/componentes/TextoCinetico";
import { ZonaSegura } from "../../serie/componentes/ZonaSegura";
import { EscenaBanca } from "../banca/EscenaBanca";
import { Trayectoria } from "../banca/Trayectoria";
import { puntoEn } from "../banca/geometria";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Escena 2 (3-10 s): la barra sube del pecho a brazos estirados y la línea se dibuja detrás (strokeDashoffset). */
export const TrayectoriaEscena: React.FC<{ duracion: number }> = ({ duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progreso = interpolate(frame, [TIEMPOS.trazo.inicio, TIEMPOS.trazo.fin], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const nota = spring({ frame: frame - (TIEMPOS.trazo.fin + 6), fps, config: { damping: 10 } });

  return (
    <Escena duracion={duracion}>
      <ZonaSegura gap={34}>
        <TextoCinetico texto={TRAYECTORIA_TEXTO.titulo} resaltar={TRAYECTORIA_TEXTO.resaltar} tamano={92} escalonado={3} />
        <EscenaBanca
          ancho={790}
          barra={puntoEn(TRAYECTORIA_CORRECTA, progreso)}
          capasMedio={<Trayectoria d={TRAYECTORIA_CORRECTA} progreso={progreso} color={COLORES.primario} ancho={14} />}
        />
        <div
          style={{
            fontSize: TEXTO_MIN,
            color: COLORES.secundario,
            opacity: nota,
            transform: `scale(${interpolate(nota, [0, 1], [0.6, 1])})`,
          }}
        >
          {TRAYECTORIA_TEXTO.nota}
        </div>
      </ZonaSegura>
    </Escena>
  );
};
