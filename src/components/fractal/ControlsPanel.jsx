import { useFractal } from "../../contexts/FractalContext";

const FRACTAL_TYPES = [
  { value: "mandelbrot", label: "Mandelbrot" },
  { value: "julia", label: "Julia" },
  { value: "burning_ship", label: "Burning Ship" },
  { value: "newton", label: "Newton" },
];

const PALETTES = [
  { value: "classic", label: "Classic", colors: ["#000", "#00248f", "#fbff00"] },
  { value: "fire", label: "Fire", colors: ["#000", "#ff3300", "#ffff00"] },
  { value: "ocean", label: "Ocean", colors: ["#000066", "#0099cc", "#fff"] },
  { value: "psychedelic", label: "Psychedelic", colors: ["#ff0000", "#00ff00", "#0000ff"] },
  { value: "grayscale", label: "Grayscale", colors: ["#000", "#888", "#fff"] },
];

export default function ControlsPanel() {
  const { state, dispatch } = useFractal();

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-white/5 p-4 backdrop-blur-md">
      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-white/60">
          Fractal
        </label>
        <div className="grid grid-cols-2 gap-1">
          {FRACTAL_TYPES.map((f) => (
            <button
              key={f.value}
              onClick={() =>
                dispatch({
                  type: "SET_FRACTAL_TYPE",
                  payload: { fractalType: f.value },
                })
              }
              className={`rounded px-2 py-1.5 text-xs transition ${
                state.fractalType === f.value
                  ? "bg-violet-600 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {state.fractalType === "julia" && (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium uppercase tracking-wider text-white/60">
            Julia Constant
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">Re</span>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.01"
              value={state.params.c_re ?? -0.7}
              onChange={(e) =>
                dispatch({
                  type: "SET_PARAMS",
                  payload: { c_re: parseFloat(e.target.value) },
                })
              }
              className="flex-1 accent-violet-500"
            />
            <span className="w-12 text-right text-xs text-white/70">
              {(state.params.c_re ?? -0.7).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">Im</span>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.01"
              value={state.params.c_im ?? 0.27015}
              onChange={(e) =>
                dispatch({
                  type: "SET_PARAMS",
                  payload: { c_im: parseFloat(e.target.value) },
                })
              }
              className="flex-1 accent-violet-500"
            />
            <span className="w-12 text-right text-xs text-white/70">
              {(state.params.c_im ?? 0.27015).toFixed(2)}
            </span>
          </div>
        </div>
      )}

      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-white/60">
          Palette
        </label>
        <div className="flex flex-wrap gap-1">
          {PALETTES.map((p) => (
            <button
              key={p.value}
              onClick={() => dispatch({ type: "SET_PALETTE", payload: p.value })}
              className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs transition ${
                state.palette === p.value
                  ? "bg-violet-600 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              <div className="flex h-3 w-6 overflow-hidden rounded-sm">
                {p.colors.map((c, i) => (
                  <div key={i} className="flex-1" style={{ background: c }} />
                ))}
              </div>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-white/60">
          Max Iterations: {state.maxIterations}
        </label>
        <input
          type="range"
          min="32"
          max="2048"
          step="32"
          value={state.maxIterations}
          onChange={(e) =>
            dispatch({
              type: "SET_MAX_ITERATIONS",
              payload: parseInt(e.target.value),
            })
          }
          className="w-full accent-violet-500"
        />
      </div>

      <div className="text-xs text-white/40">
        <div>Center: ({state.centerX.toFixed(6)}, {state.centerY.toFixed(6)})</div>
        <div>Zoom: {state.zoom.toFixed(2)}x</div>
      </div>
    </div>
  );
}
