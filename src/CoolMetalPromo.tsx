import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const CoolMetalPromo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 12 } });
  const textOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0b1d33 0%, #0078ff 100%)",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        color: "white",
      }}
    >
      <div
        style={{
          width: 420,
          height: 420,
          borderRadius: "50%",
          transform: `scale(${scale})`,
          background: "radial-gradient(circle at 30% 30%, #ffffff, #b8c4cf 35%, #5b6875 75%, #2b333b)",
          boxShadow: "0 0 120px rgba(160, 220, 255, 0.6)",
        }}
      />
      <div style={{ opacity: textOpacity, textAlign: "center", marginTop: 100 }}>
        <div style={{ fontSize: 90, fontWeight: "bold" }}>CoolMetal Sphere</div>
        <div style={{ fontSize: 56, marginTop: 24 }}>Tu bebida fría en 15 segundos ❄️</div>
      </div>
    </AbsoluteFill>
  );
};
