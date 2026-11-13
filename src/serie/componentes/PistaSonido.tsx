import React from "react";
import { Audio, Sequence, staticFile } from "remotion";

export type TipoEfecto = "whoosh" | "golpe" | "pop";
export type RecursosSonido = {
  musica: string | null;
  volumenMusica: number;
  efectos: Record<TipoEfecto, string> | null;
  volumenEfectos: Record<TipoEfecto, number>;
};

/** Música de fondo + efectos colocados en frames concretos (sincronizados con la animación). */
export const PistaSonido: React.FC<{ recursos: RecursosSonido; efectos: [TipoEfecto, number][] }> = ({ recursos, efectos }) => (
  <>
    {recursos.musica ? <Audio src={staticFile(recursos.musica)} volume={recursos.volumenMusica} /> : null}
    {recursos.efectos
      ? efectos.map(([tipo, frame], i) => (
          <Sequence key={i} name={`sfx ${tipo}`} from={frame} durationInFrames={30} layout="none">
            <Audio src={staticFile(recursos.efectos![tipo])} volume={recursos.volumenEfectos[tipo]} />
          </Sequence>
        ))
      : null}
  </>
);
