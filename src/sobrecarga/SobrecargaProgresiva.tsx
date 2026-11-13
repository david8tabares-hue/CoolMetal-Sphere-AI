import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import {
  DURACION_TOTAL_FRAMES,
  ESCENAS,
  FRAMES_BARRIDO,
  FRAMES_PUENTE_BUCLE,
  GANCHO_ACTIVO,
} from "./config";
import { Fondo } from "../serie/componentes/Fondo";
import { Sonido } from "./componentes/Sonido";
import { PuenteBucle } from "../serie/componentes/PuenteBucle";
import { InsigniaSerie } from "../serie/componentes/InsigniaSerie";
import { Barrido } from "../serie/componentes/efectos";
import { Gancho } from "./escenas/Gancho";
import { QueEs } from "./escenas/QueEs";
import { Metodo } from "./escenas/Metodo";
import { Ejemplo } from "./escenas/Ejemplo";
import { Cierre } from "./escenas/Cierre";

export type SobrecargaProps = { indiceGancho: number };


// Cortes entre escenas donde va un barrido (no en el bucle).
const CORTES = [ESCENAS.queEs, ESCENAS.metodo1, ESCENAS.metodo2, ESCENAS.metodo3, ESCENAS.ejemplo, ESCENAS.cierre].map(
  (e) => e.desde,
);

export const SobrecargaProgresiva: React.FC<SobrecargaProps> = ({ indiceGancho = GANCHO_ACTIVO }) => (
  <AbsoluteFill>
    <Fondo />
    <Sonido />

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
      <PuenteBucle duracion={FRAMES_PUENTE_BUCLE}>
        <Gancho duracion={ESCENAS.gancho.duracion} indice={indiceGancho} />
      </PuenteBucle>
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
