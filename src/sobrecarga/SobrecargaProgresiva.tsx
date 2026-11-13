import React from "react";
import { AbsoluteFill, Audio, Freeze, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import {
  DURACION_TOTAL_FRAMES,
  ESCENAS,
  FRAMES_BARRIDO,
  FRAMES_PUENTE_BUCLE,
  GANCHO_ACTIVO,
  RECURSOS,
} from "./config";
import { Fondo } from "./componentes/Fondo";
import { InsigniaSerie } from "./componentes/InsigniaSerie";
import { Barrido } from "./componentes/efectos";
import { Gancho } from "./escenas/Gancho";
import { QueEs } from "./escenas/QueEs";
import { Metodo } from "./escenas/Metodo";
import { Ejemplo } from "./escenas/Ejemplo";
import { Cierre } from "./escenas/Cierre";

export type SobrecargaProps = { indiceGancho: number };

/** Últimos frames: aparece el frame 0 exacto del gancho → el bucle no salta. */
const PuenteBucle: React.FC<{ indiceGancho: number }> = ({ indiceGancho }) => {
  const frame = useCurrentFrame();
  const opacidad = interpolate(frame, [0, FRAMES_PUENTE_BUCLE - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity: opacidad }}>
      <Freeze frame={0}>
        <Gancho duracion={ESCENAS.gancho.duracion} indice={indiceGancho} />
      </Freeze>
    </AbsoluteFill>
  );
};

// Cortes entre escenas donde va un barrido (no en el bucle).
const CORTES = [ESCENAS.queEs, ESCENAS.metodo1, ESCENAS.metodo2, ESCENAS.metodo3, ESCENAS.ejemplo, ESCENAS.cierre].map(
  (e) => e.desde,
);

export const SobrecargaProgresiva: React.FC<SobrecargaProps> = ({ indiceGancho = GANCHO_ACTIVO }) => (
  <AbsoluteFill>
    <Fondo />
    {RECURSOS.musica ? <Audio src={staticFile(RECURSOS.musica)} volume={RECURSOS.volumenMusica} /> : null}

    <Sequence name="1 · Gancho" from={ESCENAS.gancho.desde} durationInFrames={ESCENAS.gancho.duracion}>
      <Gancho duracion={ESCENAS.gancho.duracion} indice={indiceGancho} />
    </Sequence>
    <Sequence name="2 · Qué es" from={ESCENAS.queEs.desde} durationInFrames={ESCENAS.queEs.duracion}>
      <QueEs duracion={ESCENAS.queEs.duracion} />
    </Sequence>
    <Sequence name="3a · Más peso" from={ESCENAS.metodo1.desde} durationInFrames={ESCENAS.metodo1.duracion}>
      <Metodo duracion={ESCENAS.metodo1.duracion} indice={0} />
    </Sequence>
    <Sequence name="3b · Más reps" from={ESCENAS.metodo2.desde} durationInFrames={ESCENAS.metodo2.duracion}>
      <Metodo duracion={ESCENAS.metodo2.duracion} indice={1} />
    </Sequence>
    <Sequence name="3c · Series/técnica" from={ESCENAS.metodo3.desde} durationInFrames={ESCENAS.metodo3.duracion}>
      <Metodo duracion={ESCENAS.metodo3.duracion} indice={2} />
    </Sequence>
    <Sequence name="4 · Ejemplo" from={ESCENAS.ejemplo.desde} durationInFrames={ESCENAS.ejemplo.duracion}>
      <Ejemplo duracion={ESCENAS.ejemplo.duracion} />
    </Sequence>
    <Sequence name="5 · Cierre" from={ESCENAS.cierre.desde} durationInFrames={ESCENAS.cierre.duracion}>
      <Cierre duracion={ESCENAS.cierre.duracion} />
    </Sequence>
    <Sequence name="Puente de bucle" from={DURACION_TOTAL_FRAMES - FRAMES_PUENTE_BUCLE} durationInFrames={FRAMES_PUENTE_BUCLE}>
      <PuenteBucle indiceGancho={indiceGancho} />
    </Sequence>

    {/* Insignia fija: idéntica en el primer y el último frame. */}
    <InsigniaSerie />

    {/* Barridos encima de todo, centrados en cada corte. */}
    {CORTES.map((c) => (
      <Sequence key={c} name="Barrido" from={c - FRAMES_BARRIDO / 2} durationInFrames={FRAMES_BARRIDO}>
        <Barrido duracion={FRAMES_BARRIDO} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
