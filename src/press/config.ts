// ─────────────────────────────────────────────────────────────
// Configuración central del video "Rango de movimiento en press de banca".
// Textos, tiempos, puntos de control, trayectorias y ganchos.
// Colores de marca, fuente, zona segura y nombre de la serie: src/serie/tema.ts
// ─────────────────────────────────────────────────────────────
export * from "../serie/tema";

// ── Formato ──────────────────────────────────────────────────
export const FPS = 30;
export const ANCHO = 1080;
export const ALTO = 1920;
export const seg = (segundos: number) => Math.round(segundos * FPS);

// ── Duración de cada escena (en segundos) ────────────────────
export const SEG_POR_PUNTO = 4;
export const DURACION_SEG = {
  gancho: 3,
  trayectoria: 7,
  puntos: SEG_POR_PUNTO * 3, // 12 s
  error: 7,
  cierre: 5,
} as const;

export const FRAMES_PUENTE_BUCLE = 12;
export const FRAMES_SALIDA_CIERRE = 10;

export const ESCENAS = (() => {
  const orden = [
    ["gancho", DURACION_SEG.gancho],
    ["trayectoria", DURACION_SEG.trayectoria],
    ["puntos", DURACION_SEG.puntos],
    ["error", DURACION_SEG.error],
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
export const FRAMES_POR_PUNTO = seg(SEG_POR_PUNTO);
export const DURACION_TOTAL_FRAMES = ESCENAS.cierre.desde + ESCENAS.cierre.duracion; // 34 s = 1020 frames

// ── Tiempos internos (frames locales de cada escena) ─────────
export const TIEMPOS = {
  /** Escena 2: la barra sube y la línea se dibuja detrás. */
  trazo: { inicio: 20, fin: 140 },
  /** Escena 4: trayectoria con error, flecha y luego la corregida. */
  error: { trazoInicio: 12, trazoFin: 80, flecha: 84, correccionInicio: 118, correccionFin: 178 },
};

// ── Trayectorias (vista lateral, la cabeza a la izquierda) ───
// Coordenadas del SVG de la banca (viewBox en banca/geometria.ts).
// Forma ilustrativa: arco suave desde el pecho hasta encima de los hombros.
// No representa ángulos ni medidas reales.
export const TRAYECTORIA_CORRECTA = "M 360 505 C 356 425 300 330 262 268";
export const TRAYECTORIA_ERROR = "M 360 505 C 362 440 386 368 412 312";

// ── Puntos de control (en el orden de la repetición) ─────────
// posicion: 0 = pecho, 1 = brazos estirados (fracción de la longitud del path).
export const PUNTOS = [
  { posicion: 1, titulo: "Baja con control", frase: "Sin dejarla caer: mandas tú, no la gravedad" },
  { posicion: 0, titulo: "Pausa controlada", frase: "Toca el pecho sin rebotar" },
  { posicion: 0.5, titulo: "Sube parejo", frase: "Sin tirones, de vuelta hacia los hombros" },
] as const;

// ── Textos ───────────────────────────────────────────────────
export const GANCHOS = [
  { texto: "Así se ve el recorrido real de tu press de banca", resaltar: "recorrido real" },
  { texto: "¿Tu barra sube en línea recta? Mira esto", resaltar: "línea recta" },
  { texto: "El recorrido que casi nadie controla", resaltar: "casi nadie controla" },
] as const;
export const GANCHO_ACTIVO = 0;

export const TRAYECTORIA_TEXTO = {
  titulo: "Del pecho a brazos estirados",
  resaltar: "brazos estirados",
  nota: "Fíjate: no es una línea recta",
};

export const ERROR_TEXTO = {
  etiqueta: "Error común",
  titulo: "Se escapa hacia la barriga",
  frase: "Aquí se pierde la técnica 😬",
  correccion: "Así sí: vuelve sobre los hombros",
};

export const CIERRE = {
  mensaje: "Una barra que sube recta se ve simple, pero el recorrido importa",
  resaltar: "el recorrido importa",
  cta: "Guárdalo para tu próximo entrenamiento",
  ctaIcono: "📌",
  /** Opcional: p. ej. "Usa el código itsdavid26". null = no se muestra. */
  codigo: null as string | null,
};

// ── Recursos (en /public) ────────────────────────────────────
export const RECURSOS = {
  /** Música original: python3 scripts/generar_audio.py --perfil press */
  musica: "audio/musica-press.mp3" as string | null,
  volumenMusica: 0.35,
  efectos: {
    whoosh: "audio/whoosh.mp3",
    golpe: "audio/golpe.mp3",
    pop: "audio/pop.mp3",
  } as { whoosh: string; golpe: string; pop: string } | null,
  volumenEfectos: { whoosh: 0.3, golpe: 0.32, pop: 0.2 },
};
