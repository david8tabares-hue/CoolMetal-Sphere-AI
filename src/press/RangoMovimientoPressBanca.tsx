import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import {
  DURACION_TOTAL_FRAMES,
  ESCENAS,
  FRAMES_BARRIDO,
  FRAMES_POR_PUNTO,
  FRAMES_PUENTE_BUCLE,
  GANCHO_ACTIVO,
  PUNTOS,
  RECURSOS,
  TIEMPOS,
} from "./config";
import { Fondo } from "../serie/componentes/Fondo";
import { InsigniaSerie } from "../serie/componentes/InsigniaSerie";
import { Barrido } from "../serie/componentes/efectos";
import { PuenteBucle } from "../serie/componentes/PuenteBucle";
import { PistaSonido, type TipoEfecto } from "../serie/componentes/PistaSonido";
import { Gancho, IMPACTOS_GANCHO } from "./escenas/Gancho";
import { TrayectoriaEscena } from "./escenas/TrayectoriaEscena";
import { PuntosControl } from "./escenas/PuntosControl";
import { ErrorComun } from "./escenas/ErrorComun";
import { Cierre, CTA } from "./escenas/Cierre";

export type PressProps = { indiceGancho: number };

const CORTES = [ESCENAS.trayectoria, ESCENAS.puntos, ESCENAS.error, ESCENAS.cierre].map((e) => e.desde);

/** Efectos de sonido en los mismos frames que las animaciones. */
const EFECTOS: [TipoEfecto, number][] = [
  ...CORTES.map((c): [TipoEfecto, number] => ["whoosh", c - FRAMES_BARRIDO / 2]),
  ...IMPACTOS_GANCHO.map((f): [TipoEfecto, number] => ["golpe", ESCENAS.gancho.desde + f]),
  ["pop", ESCENAS.trayectoria.desde + TIEMPOS.trazo.fin],
  ...PUNTOS.map((_, i): [TipoEfecto, number] => ["pop", ESCENAS.puntos.desde + i * FRAMES_POR_PUNTO + 4]),
  ["golpe", ESCENAS.error.desde + TIEMPOS.error.flecha + 6],
  ["pop", ESCENAS.error.desde + TIEMPOS.error.correccionFin],
  ["golpe", ESCENAS.cierre.desde + CTA + 4],
];

export const RangoMovimientoPressBanca: React.FC<PressProps> = ({ indiceGancho = GANCHO_ACTIVO }) => (
  <AbsoluteFill>
    <Fondo />
    <PistaSonido recursos={RECURSOS} efectos={EFECTOS} />

    <Sequence name="1 · Gancho" from={ESCENAS.gancho.desde} durationInFrames={ESCENAS.gancho.duracion}>
      <Gancho duracion={ESCENAS.gancho.duracion} indice={indiceGancho} />
    </Sequence>
    <Sequence name="2 · Trayectoria" from={ESCENAS.trayectoria.desde} durationInFrames={ESCENAS.trayectoria.duracion}>
      <TrayectoriaEscena duracion={ESCENAS.trayectoria.duracion} />
    </Sequence>
    <Sequence name="3 · Puntos de control" from={ESCENAS.puntos.desde} durationInFrames={ESCENAS.puntos.duracion}>
      <PuntosControl duracion={ESCENAS.puntos.duracion} />
    </Sequence>
    <Sequence name="4 · Error común" from={ESCENAS.error.desde} durationInFrames={ESCENAS.error.duracion}>
      <ErrorComun duracion={ESCENAS.error.duracion} />
    </Sequence>
    <Sequence name="5 · Cierre" from={ESCENAS.cierre.desde} durationInFrames={ESCENAS.cierre.duracion}>
      <Cierre duracion={ESCENAS.cierre.duracion} />
    </Sequence>
    <Sequence name="Puente de bucle" from={DURACION_TOTAL_FRAMES - FRAMES_PUENTE_BUCLE} durationInFrames={FRAMES_PUENTE_BUCLE}>
      <PuenteBucle duracion={FRAMES_PUENTE_BUCLE}>
        <Gancho duracion={ESCENAS.gancho.duracion} indice={indiceGancho} />
      </PuenteBucle>
    </Sequence>

    <InsigniaSerie />
    {CORTES.map((c) => (
      <Sequence key={c} name="Barrido" from={c - FRAMES_BARRIDO / 2} durationInFrames={FRAMES_BARRIDO}>
        <Barrido duracion={FRAMES_BARRIDO} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
