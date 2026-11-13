import React from "react";
import { interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORES, FRAMES_POR_ZONA, REP_ZONA, ZONAS, type ZonaId } from "../config";
import { Escena } from "../../serie/componentes/Escena";
import { TextoCinetico } from "../../serie/componentes/TextoCinetico";
import { ZonaSegura } from "../../serie/componentes/ZonaSegura";
import { Silueta } from "../silueta/Silueta";
import { activacion, faseRep } from "../silueta/movimiento";
import { FaseChips } from "./FaseChips";

const ALTO_TEXTO = 300;

/** Nombre (rebote con spring) + frase corta de una zona. */
const EtiquetaZona: React.FC<{ indice: number }> = ({ indice }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zona = ZONAS[indice];
  const rebote = spring({ frame, fps, config: { damping: 8, mass: 0.6 } });
  const salida = interpolate(frame, [FRAMES_POR_ZONA - 6, FRAMES_POR_ZONA], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, opacity: salida }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
        <span style={{ fontSize: 60, color: COLORES.secundario, opacity: rebote }}>
          {indice + 1}/{ZONAS.length}
        </span>
        <span
          style={{
            fontSize: 100,
            fontWeight: 800,
            lineHeight: 1.05,
            color: COLORES.primario,
            textShadow: `0 0 30px ${COLORES.primario}88`,
            display: "inline-block",
            opacity: Math.min(1, rebote * 2),
            transform: `translateY(${(1 - rebote) * 60}px) scale(${interpolate(rebote, [0, 1], [0.4, 1])})`,
          }}
        >
          {zona.nombre}
        </span>
      </div>
      <TextoCinetico texto={zona.frase} tamano={64} inicio={8} escalonado={2} peso={600} />
    </div>
  );
};

/** Escena 3 (6-23 s): cada zona se ilumina en secuencia siguiendo la fase de una repetición lenta. */
export const Zonas: React.FC<{ duracion: number }> = ({ duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const indice = Math.min(ZONAS.length - 1, Math.floor(frame / FRAMES_POR_ZONA));
  const local = frame - indice * FRAMES_POR_ZONA;
  const rep = faseRep(local, fps, REP_ZONA);
  const actual = ZONAS[indice].id;
  const intensidades = { [actual]: activacion(rep.fase, rep.progreso, frame) } as Partial<Record<ZonaId, number>>;
  // Las zonas ya explicadas quedan con un tono suave: "trabajan más músculos de los que crees".
  const acumuladas = Object.fromEntries(ZONAS.slice(0, indice).map((z) => [z.id, 1])) as Partial<Record<ZonaId, number>>;

  return (
    <Escena duracion={duracion}>
      <ZonaSegura gap={34}>
        <div style={{ position: "relative", width: "100%", height: ALTO_TEXTO }}>
          {ZONAS.map((z, i) => (
            <Sequence key={z.id} name={`Zona · ${z.nombre}`} from={i * FRAMES_POR_ZONA} durationInFrames={FRAMES_POR_ZONA} layout="none">
              <EtiquetaZona indice={i} />
            </Sequence>
          ))}
        </div>
        <Silueta alto={640} profundidad={rep.profundidad} intensidades={intensidades} acumuladas={acumuladas} pulso={actual} />
        <FaseChips fase={rep.fase} frameEnFase={rep.frameEnFase} />
      </ZonaSegura>
    </Escena>
  );
};
