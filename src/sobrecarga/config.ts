import { loadFont } from "@remotion/google-fonts/Poppins";

// ─────────────────────────────────────────────────────────────
// Configuración central del video "Sobrecarga progresiva".
// Cambia aquí textos, colores, tiempos, ejemplo numérico y gancho.
// ─────────────────────────────────────────────────────────────

// ── Formato ──────────────────────────────────────────────────
export const FPS = 30;
export const ANCHO = 1080;
export const ALTO = 1920;

/** Convierte segundos a frames usando los fps del video. */
export const seg = (segundos: number) => Math.round(segundos * FPS);

// ── Duración de cada escena (en segundos) ────────────────────
export const DURACION_SEG = {
  gancho: 3,
  queEs: 5,
  metodo: 6, // se usa 3 veces (una por forma de aplicarla)
  ejemplo: 6,
  cierre: 6,
} as const;

/** Frames finales en los que aparece el primer frame del gancho (bucle). */
export const FRAMES_PUENTE_BUCLE = 12;
/** Frames previos al puente en los que el cierre se desvanece (evita textos superpuestos). */
export const FRAMES_SALIDA_CIERRE = 10;
/** Frames de fundido de entrada/salida de cada escena. */
export const FRAMES_FUNDIDO = 6;
/** Frames que dura el barrido diagonal entre escenas. */
export const FRAMES_BARRIDO = 16;

// Tiempos calculados en frames (no editar: se derivan de lo anterior).
export const ESCENAS = (() => {
  const orden = [
    ["gancho", DURACION_SEG.gancho],
    ["queEs", DURACION_SEG.queEs],
    ["metodo1", DURACION_SEG.metodo],
    ["metodo2", DURACION_SEG.metodo],
    ["metodo3", DURACION_SEG.metodo],
    ["ejemplo", DURACION_SEG.ejemplo],
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

export const DURACION_TOTAL_FRAMES =
  ESCENAS.cierre.desde + ESCENAS.cierre.duracion; // 38 s = 1140 frames

// ── Marca ────────────────────────────────────────────────────
// PLACEHOLDER: reemplaza por tus colores de marca.
export const COLORES = {
  primario: "#FF5A1F",
  secundario: "#FFD23F",
  texto: "#FFFFFF",
  textoSuave: "rgba(255,255,255,0.78)",
  fondo: "#14141F",
  fondo2: "#262640",
  superficie: "rgba(255,255,255,0.08)",
  alerta: "#FF2E4D",
  cian: "#3DF5FF",
  acento: "#6C3BFF",
} as const;

/** Intensidad de los efectos de impacto. */
export const EFECTOS = {
  sacudida: 22, // px de la sacudida de cámara
  chispas: 22, // partículas por explosión
  destello: 0.5, // opacidad máxima del flash blanco
};

// Fuente fija (se carga desde Google Fonts) para que el render sea igual en cualquier equipo.
const { fontFamily } = loadFont("normal", { weights: ["600", "800"], subsets: ["latin", "latin-ext"] });
export const FUENTE = fontFamily;
export const PESO_TITULO = 800;
export const PESO_TEXTO = 600;

/** Zona segura vertical (deja libre la UI de TikTok/Reels/Shorts). */
export const ZONA_SEGURA = { arriba: 250, abajo: 400, izquierda: 90, derecha: 130 } as const;

/** Tamaño mínimo de texto exigido por el brief. */
export const TEXTO_MIN = 60;

// ── Recursos (en /public) ────────────────────────────────────
// PLACEHOLDER: pon la ruta relativa a /public, p. ej. "logo.png" o "musica.mp3".
export const RECURSOS = {
  logo: null as string | null,
  /** Música original generada con scripts/generar_audio.py (120 BPM, drop en el segundo 3). */
  musica: "audio/musica.mp3" as string | null,
  volumenMusica: 0.55,
  /** Efectos sincronizados con los impactos visuales. null = sin efectos. */
  efectos: {
    whoosh: "audio/whoosh.mp3",
    golpe: "audio/golpe.mp3",
    pop: "audio/pop.mp3",
  } as { whoosh: string; golpe: string; pop: string } | null,
  volumenEfectos: { whoosh: 0.35, golpe: 0.4, pop: 0.22 },
};

// ── Textos ───────────────────────────────────────────────────
export const SERIE = "Técnica en 30 segundos";

export const GANCHOS = [
  { texto: "Llevas meses haciendo lo mismo y no creces. Este es el motivo", resaltar: "no creces" },
  { texto: "Si tu rutina no cambia, tu cuerpo tampoco", resaltar: "tu cuerpo tampoco" },
  { texto: "El secreto que nadie te explica en el gym", resaltar: "nadie te explica" },
] as const;

/** Índice del gancho por defecto (0, 1 o 2). */
export const GANCHO_ACTIVO = 0;

export const QUE_ES = {
  titulo: "Sobrecarga progresiva",
  definicion: "Pedirle a tu cuerpo un poquito más cada semana",
  etiquetaBarra: "Cargando músculo…",
  etiquetaBarraLlena: "¡Músculo cargado!",
  pasosBarra: 5,
};

export const METODOS = [
  {
    numero: 1,
    titulo: "Más peso",
    resaltar: "peso",
    incrementoKg: 2.5,
    texto: "Sube un poco cuando ya te sale fácil",
    extra: "Sin pasarte: el ego no levanta por ti",
  },
  {
    numero: 2,
    titulo: "Más repeticiones",
    resaltar: "repeticiones",
    texto: "Mismo peso, un par de reps más",
    extra: "",
    repsInicio: 8,
    repsFin: 12,
  },
  {
    numero: 3,
    titulo: "Más series o mejor técnica",
    resaltar: "mejor técnica",
    texto: "Una serie extra o bajar lento y controlado",
    extra: "",
    seriesInicio: 3,
    segundosBajada: 3,
  },
] as const;

// PLACEHOLDER: números de EJEMPLO, no son resultados reales ni datos científicos.
export const EJEMPLO = {
  titulo: "Sentadilla",
  etiqueta: "EJEMPLO",
  unidad: "kg",
  semanas: [
    { semana: "S1", valor: 40 },
    { semana: "S2", valor: 42.5 },
    { semana: "S3", valor: 45 },
    { semana: "S4", valor: 47.5 },
  ],
  tendencia: "+2,5 kg/semana",
  nota: "Números de ejemplo, no datos reales",
};

export const CIERRE = {
  mensaje: "Si haces lo mismo cada semana, tu cuerpo no tiene motivo para cambiar",
  resaltar: "no tiene motivo",
  cta: "Guárdalo para tu próximo entrenamiento",
  ctaIcono: "📌",
  /** Opcional: p. ej. "Usa el código itsdavid26". null = no se muestra. */
  codigo: null as string | null,
};
