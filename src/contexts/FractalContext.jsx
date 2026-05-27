import { createContext, useReducer, useContext, useRef, useCallback } from "react";

const FractalContext = createContext();

const DEFAULTS = {
  mandelbrot: { centerX: -0.5, centerY: 0, zoom: 1 },
  julia: { centerX: 0, centerY: 0, zoom: 1 },
  burning_ship: { centerX: -0.4, centerY: -0.6, zoom: 1 },
  newton: { centerX: 0, centerY: 0, zoom: 1 },
};

const initialState = {
  fractalType: "mandelbrot",
  centerX: -0.5,
  centerY: 0.0,
  zoom: 1.0,
  maxIterations: 256,
  palette: "classic",
  params: {},
};

function fractalReducer(state, action) {
  switch (action.type) {
    case "SET_VIEWPORT":
      return { ...state, ...action.payload };
    case "SET_FRACTAL_TYPE": {
      const defaults = DEFAULTS[action.payload.fractalType] || {};
      return {
        ...state,
        fractalType: action.payload.fractalType,
        centerX: defaults.centerX ?? 0,
        centerY: defaults.centerY ?? 0,
        zoom: defaults.zoom ?? 1,
        params: action.payload.fractalType === "julia"
          ? { c_re: -0.7, c_im: 0.27015 }
          : {},
      };
    }
    case "SET_PARAMS":
      return { ...state, params: { ...state.params, ...action.payload } };
    case "SET_PALETTE":
      return { ...state, palette: action.payload };
    case "SET_MAX_ITERATIONS":
      return { ...state, maxIterations: action.payload };
    case "SET_STATE":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function FractalProvider({ children }) {
  const [state, baseDispatch] = useReducer(fractalReducer, initialState);
  const listenersRef = useRef([]);

  const dispatch = useCallback((action) => {
    baseDispatch(action);
    for (const listener of listenersRef.current) {
      listener(action);
    }
  }, []);

  const subscribe = useCallback((listener) => {
    listenersRef.current.push(listener);
    return () => {
      listenersRef.current = listenersRef.current.filter((l) => l !== listener);
    };
  }, []);

  return (
    <FractalContext.Provider value={{ state, dispatch, subscribe }}>
      {children}
    </FractalContext.Provider>
  );
}

export function useFractal() {
  const ctx = useContext(FractalContext);
  if (!ctx) throw new Error("useFractal must be used within FractalProvider");
  return ctx;
}
