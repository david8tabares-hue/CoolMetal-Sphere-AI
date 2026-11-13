import { spring, useCurrentFrame, useVideoConfig } from "remotion";

/** Spring de 0 a 1 que empieza en `retraso` frames. */
export const useEntrada = (retraso = 0, damping = 14) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - retraso, fps, config: { damping } });
};
