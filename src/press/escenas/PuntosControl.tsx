import React from "react";
import { Easing, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORES, FRAMES_POR_PUNTO, PUNTOS, TRAYECTORIA_CORRECTA } from "../config";
import { Escena } from "../../serie/componentes/Escena";
import { TextoCinetico } from "../../serie/componentes/TextoCinetico";
import { ZonaSegura } from "../../serie/componentes/ZonaSegura";
import { EscenaBanca } from "../banca/EscenaBanca";
import { Trayectoria } from "../banca/Trayectoria";
import { PuntoControl } from "../banca/PuntoControl";
import { puntoEn } from "../banca/geometria";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const suave = Easing.inOut(Easing.sin);
const ALTO_TEXTO = 300;

/**
 * Posición de la barra (fracción del path) en cada momento: una repetición a cámara lenta
 * que pasa por los puntos en orden: arriba → baja con control → pausa en el pecho → sube.
 */
const posicionBarra = (frame: number) => {
  const F = FRAMES_POR_PUNTO;
  if (frame < F) return interpolate(frame, [20, F], [1, 0], { ...clamp, easing: suave });
  if (frame < 2 * F) return 0;
  return interpolate(frame, [2 * F + 10, 3 * F - 10], [0, 1], { ...clamp, easing: suave });
};

/** Título + frase de un punto (rebote con spring). */
const TextoPunto: React.FC<{ indice: number }> = ({ indice }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = PUNTOS[indice];
  const s = spring({ frame, fps, config: { damping: 8, mass: 0.6 } });
  const salida = interpolate(frame, [FRAMES_POR_PUNTO - 6, FRAMES_POR_PUNTO], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, opacity: salida }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <span
          style={{
            width: 96,
            height: 96,
            borderRadius: 48,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: COLORES.secundario,
            color: COLORES.fondo,
            fontSize: 64,
            fontWeight: 800,
            transform: `scale(${s})`,
          }}
        >
          {indice + 1}
        </span>
        <span
          style={{
            fontSize: 92,
            fontWeight: 800,
            lineHeight: 1.05,
            color: COLORES.primario,
            textShadow: `0 0 30px ${COLORES.primario}88`,
            display: "inline-block",
            opacity: Math.min(1, s * 2),
            transform: `translateY(${(1 - s) * 60}px) scale(${interpolate(s, [0, 1], [0.4, 1])})`,
          }}
        >
          {p.titulo}
        </span>
      </div>
      <TextoCinetico texto={p.frase} tamano={64} inicio={8} escalonado={2} peso={600} />
    </div>
  );
};

/** Escena 3 (10-22 s): tres puntos de control que aparecen en secuencia sobre la trayectoria. */
export const PuntosControl: React.FC<{ duracion: number }> = ({ duracion }) => {
  const frame = useCurrentFrame();
  const actual = Math.min(PUNTOS.length - 1, Math.floor(frame / FRAMES_POR_PUNTO));
  const barra = puntoEn(TRAYECTORIA_CORRECTA, posicionBarra(frame));

  return (
    <Escena duracion={duracion}>
      <ZonaSegura gap={30}>
        <div style={{ position: "relative", width: "100%", height: ALTO_TEXTO }}>
          {PUNTOS.map((p, i) => (
            <Sequence key={i} name={`Punto ${i + 1} · ${p.titulo}`} from={i * FRAMES_POR_PUNTO} durationInFrames={FRAMES_POR_PUNTO} layout="none">
              <TextoPunto indice={i} />
            </Sequence>
          ))}
        </div>
        <EscenaBanca
          ancho={860}
          barra={barra}
          capasMedio={<Trayectoria d={TRAYECTORIA_CORRECTA} progreso={1} color={COLORES.primario} ancho={12} opacidad={0.55} brillo={false} />}
          capasArriba={PUNTOS.map((p, i) => (
            <PuntoControl
              key={i}
              en={puntoEn(TRAYECTORIA_CORRECTA, p.posicion)}
              numero={i + 1}
              aparece={i * FRAMES_POR_PUNTO + 4}
              activo={i === actual}
            />
          ))}
        />
      </ZonaSegura>
    </Escena>
  );
};
