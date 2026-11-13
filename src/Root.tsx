import React from "react";
import { Composition, Folder } from "remotion";
import { CoolMetalPromo } from "./CoolMetalPromo";
import { SobrecargaProgresiva } from "./sobrecarga/SobrecargaProgresiva";
import { ALTO, ANCHO, DURACION_TOTAL_FRAMES, FPS, GANCHO_ACTIVO, GANCHOS } from "./sobrecarga/config";

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
    </Folder>
  </>
);
