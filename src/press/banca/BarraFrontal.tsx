import React from "react";
import { COLORES } from "../config";

/** Barra con discos vista de frente (para el gancho). */
export const BarraFrontal: React.FC<{ ancho: number }> = ({ ancho }) => {
  const disco = (x: number, alto: number, w: number, color: string) => (
    <rect x={x} y={150 - alto / 2} width={w} height={alto} rx={10} fill={color} stroke="rgba(255,255,255,0.35)" strokeWidth={4} />
  );
  return (
    <svg width={ancho} height={(ancho * 300) / 900} viewBox="0 0 900 300" style={{ overflow: "visible" }}>
      <rect x={20} y={138} width={860} height={24} rx={12} fill="url(#barra)" />
      <defs>
        <linearGradient id="barra" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f2f4f8" />
          <stop offset="1" stopColor="#8a8fa0" />
        </linearGradient>
      </defs>
      {disco(110, 260, 46, COLORES.primario)}
      {disco(160, 210, 40, COLORES.secundario)}
      {disco(744, 260, 46, COLORES.primario)}
      {disco(700, 210, 40, COLORES.secundario)}
      <rect x={210} y={130} width={18} height={40} rx={4} fill="#c9ccd6" />
      <rect x={672} y={130} width={18} height={40} rx={4} fill="#c9ccd6" />
    </svg>
  );
};
