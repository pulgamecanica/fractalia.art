import { useRef, useEffect, useState } from "react";
import { useFractal } from "../../contexts/FractalContext";
import { useCanvasInteraction } from "../../hooks/useCanvasInteraction";
import { initFractalEngine, renderFractal } from "../../lib/fractalEngine";

export default function FractalCanvas() {
  const canvasRef = useRef(null);
  const { state, dispatch } = useFractal();
  const [engineReady, setEngineReady] = useState(false);
  const renderPendingRef = useRef(false);

  useCanvasInteraction(canvasRef, { state, dispatch });

  useEffect(() => {
    initFractalEngine().then(() => setEngineReady(true));
  }, []);

  useEffect(() => {
    if (!engineReady) return;
    if (renderPendingRef.current) return;
    renderPendingRef.current = true;

    requestAnimationFrame(() => {
      renderPendingRef.current = false;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const container = canvas.parentElement;
      const width = container.clientWidth;
      const height = container.clientHeight;
      canvas.width = width;
      canvas.height = height;

      const pixels = renderFractal({
        fractalType: state.fractalType,
        centerX: state.centerX,
        centerY: state.centerY,
        zoom: state.zoom,
        width,
        height,
        maxIterations: state.maxIterations,
        palette: state.palette,
        params: state.params,
      });

      const ctx = canvas.getContext("2d");
      const imageData = new ImageData(
        new Uint8ClampedArray(pixels),
        width,
        height
      );
      ctx.putImageData(imageData, 0, 0);
    });
  }, [engineReady, state]);

  if (!engineReady) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-black text-white/50">
        Loading fractal engine...
      </div>
    );
  }

  return <canvas ref={canvasRef} className="block h-full w-full" />;
}
