import init, { render_fractal } from "fractal-engine";

let initialized = false;

export async function initFractalEngine() {
  if (!initialized) {
    await init();
    initialized = true;
  }
}

export function renderFractal({
  fractalType,
  centerX,
  centerY,
  zoom,
  width,
  height,
  maxIterations,
  palette,
  params,
}) {
  return render_fractal(
    fractalType,
    centerX,
    centerY,
    zoom,
    width,
    height,
    maxIterations,
    palette,
    JSON.stringify(params || {})
  );
}
