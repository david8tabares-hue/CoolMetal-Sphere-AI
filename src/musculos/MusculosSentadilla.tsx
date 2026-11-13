import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import {
  DURACION_TOTAL_FRAMES,
  ESCENAS,
  FPS,
  FRAMES_BARRIDO,
  FRAMES_POR_ZONA,
  FRAMES_PUENTE_BUCLE,
  GANCHO_ACTIVO,
  RECURSOS,
  REP_COMPLETA,
  ZONAS,
} from "./config";
import { Fondo } from "../serie/componentes/Fondo";
import { InsigniaSerie } from "../serie/componentes/InsigniaSerie";
import { Barrido } from "../serie/componentes/efectos";
import { PuenteBucle } from "../serie/componentes/PuenteBucle";
import { PistaSonido, type TipoEfecto } from "../serie/componentes/PistaSonido";
import { Gancho, IMPACTOS_GANCHO } from "./escenas/Gancho";
import { SiluetaBase } from "./escenas/SiluetaBase";
import { Zonas } from "./escenas/Zonas";
import { Repeticion } from "./escenas/Repeticion";
import { Cierre, CTA } from "./escenas/Cierre";

export type MusculosProps = { indiceGancho: number };

const CORTES = [ESCENAS.silueta, ESCENAS.zonas, ESCENAS.repeticion, ESCENAS.cierre].map((e) => e.desde);

/** Efectos de sonido en los mismos frames que las animaciones. */
const EFECTOS: [TipoEfecto, number][] = (() => {
  const r = REP_COMPLETA;
  const cambiosFase = [r.inicio, r.inicio + r.bajar, r.inicio + r.bajar + r.pausa].map((s) => ESCENAS.repeticion.desde + Math.round(s * FPS));
  return [
    ...CORTES.map((c): [TipoEfecto, number] => ["whoosh", c - FRAMES_BARRIDO / 2]),
    ...IMPACTOS_GANCHO.map((f): [TipoEfecto, number] => ["golpe", ESCENAS.gancho.desde + f]),
    ...ZONAS.map((_, i): [TipoEfecto, number] => ["pop", ESCENAS.zonas.desde + i * FRAMES_POR_ZONA + 2]),
    ...cambiosFase.map((f): [TipoEfecto, number] => ["pop", f]),
    ["golpe", ESCENAS.cierre.desde + CTA + 4],
  ];
})();

export const MusculosSentadilla: React.FC<MusculosProps> = ({ indiceGancho = GANCHO_ACTIVO }) => (
  <AbsoluteFill>
    <Fondo />
    <PistaSonido recursos={RECURSOS} efectos={EFECTOS} />

    <Sequence name="1 · Gancho" from={ESCENAS.gancho.desde} durationInFrames={ESCENAS.gancho.duracion}>
      <Gancho duracion={ESCENAS.gancho.duracion} indice={indiceGancho} />
    </Sequence>
    <Sequence name="2 · Silueta" from={ESCENAS.silueta.desde} durationInFrames={ESCENAS.silueta.duracion}>
      <SiluetaBase duracion={ESCENAS.silueta.duracion} />
    </Sequence>
    <Sequence name="3 · Zonas" from={ESCENAS.zonas.desde} durationInFrames={ESCENAS.zonas.duracion}>
      <Zonas duracion={ESCENAS.zonas.duracion} />
    </Sequence>
    <Sequence name="4 · Repetición" from={ESCENAS.repeticion.desde} durationInFrames={ESCENAS.repeticion.duracion}>
      <Repeticion duracion={ESCENAS.repeticion.duracion} />
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
