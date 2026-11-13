/** Formatea números al estilo español (coma decimal). */
export const formatear = (n: number, decimales = 1) =>
  n.toLocaleString("es-ES", { maximumFractionDigits: decimales, minimumFractionDigits: 0 });
