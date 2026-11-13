// ─────────────────────────────────────────────────────────────
// Configuración central del video "Músculos de la sentadilla".
// Cambia aquí textos, colores de zonas, tiempos, zonas y ganchos.
// Colores de marca, fuente, zona segura y nombre de la serie: src/serie/tema.ts
// ─────────────────────────────────────────────────────────────
export * from "../serie/tema";

// ── Formato ──────────────────────────────────────────────────
export const FPS = 30;
export const ANCHO = 1080;
export const ALTO = 1920;

/** Convierte segundos a frames usando los fps del video. */
export const seg = (segundos: number) => Math.round(segundos * FPS);

// ── Zonas musculares ─────────────────────────────────────────
// El orden define la secuencia de la escena 3. Frases sin cifras ni datos científicos.
export const ZONAS = [
  { id: "cuadriceps", nombre: "Cuádriceps", frase: "Frenan la bajada y te empujan hacia arriba" },
  { id: "gluteos", nombre: "Glúteos", frase: "El motor para salir del fondo" },
  { id: "isquios", nombre: "Isquiotibiales", frase: "Ayudan a controlar cadera y rodilla" },
  { id: "core", nombre: "Core", frase: "Tu faja natural: el tronco firme como un bloque" },
  { id: "lumbar", nombre: "Espalda baja", frase: "Mantiene la espalda recta, sin redondearse" },
] as const;
export type ZonaId = (typeof ZONAS)[number]["id"];

// ── Duración de cada escena (en segundos) ────────────────────
export const SEG_POR_ZONA = 3.4;
export const DURACION_SEG = {
  gancho: 3,
  silueta: 3,
  zonas: SEG_POR_ZONA * ZONAS.length, // 17 s
  repeticion: 6,
  cierre: 5,
} as const;

/** Frames finales en los que aparece el primer frame del gancho (bucle). */
export const FRAMES_PUENTE_BUCLE = 12;
/** Frames previos al puente en los que el cierre se desvanece. */
export const FRAMES_SALIDA_CIERRE = 10;

// Tiempos calculados en frames (no editar: se derivan de lo anterior).
export const ESCENAS = (() => {
  const orden = [
    ["gancho", DURACION_SEG.gancho],
    ["silueta", DURACION_SEG.silueta],
    ["zonas", DURACION_SEG.zonas],
    ["repeticion", DURACION_SEG.repeticion],
    ["cierre", DURACION_SEG.cierre],
  ] as const;
  let desde = 0;
  const res = {} as Record<(typeof orden)[number][0], { desde: number; duracion: number }>;
  for (const [nombre, s] of orden) {
    const duracion = seg(s);
    res[nombre] = { desde, duracion };
    desde += duracion;
  }
  return res;
})();
export const FRAMES_POR_ZONA = seg(SEG_POR_ZONA);
export const DURACION_TOTAL_FRAMES = ESCENAS.cierre.desde + ESCENAS.cierre.duracion; // 34 s = 1020 frames

// ── Fases de una repetición (segundos desde el inicio de la rep) ──
// Rep lenta de cada zona (escena 3) y rep completa (escena 4).
export const REP_ZONA = { inicio: 0.3, bajar: 1.0, pausa: 0.6, subir: 1.0 };
export const REP_COMPLETA = { inicio: 0.5, bajar: 2.0, pausa: 1.0, subir: 2.0 };
export const TEXTO_FASE = { arriba: "Arriba", bajar: "Bajar", pausa: "Pausa", subir: "Subir" } as const;
export const ICONO_FASE = { arriba: "●", bajar: "▼", pausa: "❚❚", subir: "▲" } as const;
/** Retraso (frames) entre zonas cuando se encienden juntas (escalonado por índice). */
export const RETRASO_ZONA = 4;

// ── Colores de la silueta ────────────────────────────────────
export const COLORES_SILUETA = {
  cuerpo: "#2B2E3F",
  contorno: "rgba(255,255,255,0.85)",
  zonaReposo: "#6B7080", // gris neutro en reposo
  // Al activarse: color primario de la marca (COLORES.primario en tema.ts).
};

// ── Textos ───────────────────────────────────────────────────
export const GANCHOS = [
  { texto: "Tu sentadilla trabaja más músculos de los que crees", resaltar: "más músculos" },
  { texto: "Esto es lo que se activa cuando bajas", resaltar: "se activa" },
  { texto: "No solo son tus piernas", resaltar: "No solo" },
] as const;
/** Índice del gancho por defecto (0, 1 o 2). */
export const GANCHO_ACTIVO = 0;

export const SILUETA_TEXTO = { titulo: "Mira lo que pasa por dentro", resaltar: "por dentro" };
export const REPETICION_TEXTO = { titulo: "Todo junto 🔥", resaltar: "Todo junto" };

export const CIERRE = {
  mensaje: "Más músculos de los que crees, y cada uno tiene su papel",
  resaltar: "su papel",
  cta: "Guárdalo para tu próximo entrenamiento",
  ctaIcono: "📌",
  /** Opcional: p. ej. "Usa el código itsdavid26". null = no se muestra. */
  codigo: null as string | null,
};

// ── Recursos (en /public) ────────────────────────────────────
export const RECURSOS = {
  /** Música original generada con: python3 scripts/generar_audio.py --perfil musculos */
  musica: "audio/musica-musculos.mp3" as string | null,
  volumenMusica: 0.35, // volumen bajo, como pide el brief
  efectos: {
    whoosh: "audio/whoosh.mp3",
    golpe: "audio/golpe.mp3",
    pop: "audio/pop.mp3",
  } as { whoosh: string; golpe: string; pop: string } | null,
  volumenEfectos: { whoosh: 0.3, golpe: 0.32, pop: 0.2 },
};
