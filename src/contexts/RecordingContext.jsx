import { createContext, useReducer, useContext, useEffect, useRef } from "react";
import { useFractal } from "./FractalContext";

const RecordingContext = createContext();

const initialState = {
  isRecording: false,
  startTime: null,
  events: [],
  initialState: null,
};

function recordingReducer(state, action) {
  switch (action.type) {
    case "START":
      return {
        isRecording: true,
        startTime: Date.now(),
        events: [],
        initialState: action.payload,
      };
    case "STOP":
      return { ...state, isRecording: false };
    case "PUSH_EVENT":
      return { ...state, events: [...state.events, action.payload] };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const THROTTLE_MS = 50;

export function RecordingProvider({ children }) {
  const [recording, dispatch] = useReducer(recordingReducer, initialState);
  const { state: fractalState, subscribe } = useFractal();
  const lastEventTimeRef = useRef(0);

  useEffect(() => {
    return subscribe((action) => {
      if (!recording.isRecording || !recording.startTime) return;

      const now = Date.now();
      if (now - lastEventTimeRef.current < THROTTLE_MS) return;
      lastEventTimeRef.current = now;

      dispatch({
        type: "PUSH_EVENT",
        payload: {
          timestamp: now - recording.startTime,
          action: action.type,
          payload: action.payload,
        },
      });
    });
  }, [subscribe, recording.isRecording, recording.startTime]);

  function startRecording() {
    dispatch({ type: "START", payload: { ...fractalState } });
  }

  function stopRecording() {
    dispatch({ type: "STOP" });
  }

  function resetRecording() {
    dispatch({ type: "RESET" });
  }

  function getExplorationData() {
    return {
      initialState: recording.initialState,
      events: recording.events,
      duration: recording.events.length > 0
        ? recording.events[recording.events.length - 1].timestamp
        : 0,
      fractalType: recording.initialState?.fractalType || "mandelbrot",
    };
  }

  return (
    <RecordingContext.Provider
      value={{
        recording,
        startRecording,
        stopRecording,
        resetRecording,
        getExplorationData,
      }}
    >
      {children}
    </RecordingContext.Provider>
  );
}

export function useRecording() {
  const ctx = useContext(RecordingContext);
  if (!ctx) throw new Error("useRecording must be used within RecordingProvider");
  return ctx;
}
