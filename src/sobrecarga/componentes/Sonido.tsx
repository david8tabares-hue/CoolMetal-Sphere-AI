import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { ESCENAS, FRAMES_BARRIDO, METODOS, RECURSOS } from "../config";
import { IMPACTOS_GANCHO } from "../escenas/Gancho";
import { FRAME_LLENO, PASOS_BARRA } from "../escenas/QueEs";
import { IMPACTO_METODO } from "../escenas/Metodo";
import { IMPACTOS_PESO } from "../animaciones/AnimPeso";
import { CADA, PRIMER_CAMBIO } from "../animaciones/AnimReps";
import { APARECE_SERIE } from "../animaciones/AnimTecnica";
import { INICIO_LINEA, SELLO } from "../escenas/Ejemplo";
import { CTA } from "../escenas/Cierre";

type Tipo = "whoosh" | "golpe" | "pop";

/** Lista de efectos de sonido: [tipo, frame absoluto]. Se deriva de los mismos frames que la animación. */
const efectos = (): [Tipo, number][] => {
  const cortes = [ESCENAS.queEs, ESCENAS.metodo1, ESCENAS.metodo2, ESCENAS.metodo3, ESCENAS.ejemplo, ESCENAS.cierre];
  const metodos = [ESCENAS.metodo1, ESCENAS.metodo2, ESCENAS.metodo3];
  const reps = METODOS[1].repsFin - METODOS[1].repsInicio;
  return [
    ...cortes.map((e): [Tipo, number] => ["whoosh", e.desde - FRAMES_BARRIDO / 2]),
    ...IMPACTOS_GANCHO.map((f): [Tipo, number] => ["golpe", ESCENAS.gancho.desde + f]),
    ...PASOS_BARRA.map((f): [Tipo, number] => ["pop", ESCENAS.queEs.desde + f]),
    ["golpe", ESCENAS.queEs.desde + FRAME_LLENO],
    ...metodos.map((e): [Tipo, number] => ["golpe", e.desde + IMPACTO_METODO]),
    ...IMPACTOS_PESO.map((f): [Tipo, number] => ["golpe", ESCENAS.metodo1.desde + f]),
    ...Array.from({ length: reps }, (_, i): [Tipo, number] => ["pop", ESCENAS.metodo2.desde + PRIMER_CAMBIO + i * CADA]),
    ["golpe", ESCENAS.metodo3.desde + APARECE_SERIE + 5],
    ["golpe", ESCENAS.ejemplo.desde + SELLO + 4],
    ["pop", ESCENAS.ejemplo.desde + INICIO_LINEA + 24],
    ["golpe", ESCENAS.cierre.desde + CTA + 4],
  ];
};

/** Música de fondo + efectos sincronizados con los impactos. */
export const Sonido: React.FC = () => (
  <>
    {RECURSOS.musica ? <Audio src={staticFile(RECURSOS.musica)} volume={RECURSOS.volumenMusica} /> : null}
    {RECURSOS.efectos
      ? efectos().map(([tipo, frame], i) => (
          <Sequence key={i} name={`sfx ${tipo}`} from={frame} durationInFrames={30} layout="none">
            <Audio src={staticFile(RECURSOS.efectos![tipo])} volume={RECURSOS.volumenEfectos[tipo]} />
          </Sequence>
        ))
      : null}
  </>
);
