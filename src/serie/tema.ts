import { loadFont } from "@remotion/google-fonts/Poppins";

// ─────────────────────────────────────────────────────────────
// Tema compartido de la serie "Técnica en 30 segundos".
// Colores, tipografía, zona segura y efectos comunes a todos los videos.
// ─────────────────────────────────────────────────────────────

/** Nombre de la serie (aparece en la insignia superior de todos los videos). */
export const SERIE = "Técnica en 30 segundos";
/** PLACEHOLDER: ruta del logo dentro de /public (p. ej. "logo.png"). null = sin logo. */
export const LOGO: string | null = null;

/** Frames de fundido de salida de cada escena. */
export const FRAMES_FUNDIDO = 6;
/** Frames que dura el barrido diagonal entre escenas. */
export const FRAMES_BARRIDO = 16;

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
