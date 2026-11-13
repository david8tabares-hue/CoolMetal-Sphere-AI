import React from "react";
import { Composition, Folder } from "remotion";
import { CoolMetalPromo } from "./CoolMetalPromo";
import { SobrecargaProgresiva } from "./sobrecarga/SobrecargaProgresiva";
import { ALTO, ANCHO, DURACION_TOTAL_FRAMES, FPS, GANCHO_ACTIVO, GANCHOS } from "./sobrecarga/config";
import { MusculosSentadilla } from "./musculos/MusculosSentadilla";
import * as Musculos from "./musculos/config";
import { RangoMovimientoPressBanca } from "./press/RangoMovimientoPressBanca";
import * as Press from "./press/config";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="CoolMetalPromo"
      component={CoolMetalPromo}
      durationInFrames={150}
      fps={30}
      width={1080}
      height={1920}
    />
    <Folder name="TecnicaEn30Segundos">
      <Composition
        id="SobrecargaProgresiva"
        component={SobrecargaProgresiva}
        durationInFrames={DURACION_TOTAL_FRAMES}
        fps={FPS}
        width={ANCHO}
        height={ALTO}
        defaultProps={{ indiceGancho: GANCHO_ACTIVO }}
      />
      {/* Variantes de gancho para pruebas A/B. */}
      {GANCHOS.map((_, i) => (
        <Composition
          key={i}
          id={`SobrecargaProgresiva-Gancho${i + 1}`}
          component={SobrecargaProgresiva}
          durationInFrames={DURACION_TOTAL_FRAMES}
          fps={FPS}
          width={ANCHO}
          height={ALTO}
          defaultProps={{ indiceGancho: i }}
        />
      ))}
      <Composition
        id="MusculosSentadilla"
        component={MusculosSentadilla}
        durationInFrames={Musculos.DURACION_TOTAL_FRAMES}
        fps={Musculos.FPS}
        width={Musculos.ANCHO}
        height={Musculos.ALTO}
        defaultProps={{ indiceGancho: Musculos.GANCHO_ACTIVO }}
      />
      {Musculos.GANCHOS.map((_, i) => (
        <Composition
          key={i}
          id={`MusculosSentadilla-Gancho${i + 1}`}
          component={MusculosSentadilla}
          durationInFrames={Musculos.DURACION_TOTAL_FRAMES}
          fps={Musculos.FPS}
          width={Musculos.ANCHO}
          height={Musculos.ALTO}
          defaultProps={{ indiceGancho: i }}
        />
      ))}
      <Composition
        id="RangoMovimientoPressBanca"
        component={RangoMovimientoPressBanca}
        durationInFrames={Press.DURACION_TOTAL_FRAMES}
        fps={Press.FPS}
        width={Press.ANCHO}
        height={Press.ALTO}
        defaultProps={{ indiceGancho: Press.GANCHO_ACTIVO }}
      />
      {Press.GANCHOS.map((_, i) => (
        <Composition
          key={i}
          id={`RangoMovimientoPressBanca-Gancho${i + 1}`}
          component={RangoMovimientoPressBanca}
          durationInFrames={Press.DURACION_TOTAL_FRAMES}
          fps={Press.FPS}
          width={Press.ANCHO}
          height={Press.ALTO}
          defaultProps={{ indiceGancho: i }}
        />
      ))}
    </Folder>
  </>
);
