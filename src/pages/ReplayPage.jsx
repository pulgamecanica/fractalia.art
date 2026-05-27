import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { databases } from "../lib/appwrite";
import { useFractal } from "../contexts/FractalContext";
import FractalCanvas from "../components/fractal/FractalCanvas";

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_EXPLORATIONS_COLLECTION_ID;

export default function ReplayPage() {
  const { id } = useParams();
  const { dispatch } = useFractal();
  const [exploration, setExploration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef(null);
  const eventIndexRef = useRef(0);

  useEffect(() => {
    if (!DB_ID || !COLLECTION_ID) {
      setLoading(false);
      return;
    }
    databases
      .getDocument(DB_ID, COLLECTION_ID, id)
      .then((doc) => {
        const exp = {
          ...doc,
          events: JSON.parse(doc.events),
          initialState: JSON.parse(doc.initialState),
        };
        setExploration(exp);
        dispatch({ type: "SET_STATE", payload: exp.initialState });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, dispatch]);

  function play() {
    if (!exploration || eventIndexRef.current >= exploration.events.length) {
      eventIndexRef.current = 0;
      dispatch({ type: "SET_STATE", payload: exploration.initialState });
    }
    setPlaying(true);
    scheduleNext();
  }

  function scheduleNext() {
    const events = exploration.events;
    const idx = eventIndexRef.current;
    if (idx >= events.length) {
      setPlaying(false);
      return;
    }

    const prevTime = idx > 0 ? events[idx - 1].timestamp : 0;
    const delay = (events[idx].timestamp - prevTime) / speed;

    timerRef.current = setTimeout(() => {
      const event = events[eventIndexRef.current];
      dispatch({ type: event.action, payload: event.payload });
      eventIndexRef.current += 1;
      setProgress(
        exploration.duration > 0
          ? event.timestamp / exploration.duration
          : 0
      );

      if (eventIndexRef.current < events.length) {
        scheduleNext();
      } else {
        setPlaying(false);
        setProgress(1);
      }
    }, delay);
  }

  function pause() {
    setPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }

  function restart() {
    pause();
    eventIndexRef.current = 0;
    setProgress(0);
    if (exploration) {
      dispatch({ type: "SET_STATE", payload: exploration.initialState });
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-57px)] items-center justify-center text-white/50">
        Loading exploration...
      </div>
    );
  }

  if (!exploration) {
    return (
      <div className="flex min-h-[calc(100vh-57px)] flex-col items-center justify-center gap-4 text-white/50">
        <p>Exploration not found.</p>
        <Link to="/gallery" className="text-violet-400 hover:underline">
          Back to Gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-57px)] flex-col">
      <div className="flex-1">
        <FractalCanvas />
      </div>
      <div className="flex items-center gap-4 border-t border-white/10 bg-[#0a0a0f] px-4 py-3">
        <h2 className="font-medium text-white">{exploration.title}</h2>

        <div className="flex items-center gap-2">
          {playing ? (
            <button
              onClick={pause}
              className="rounded bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
            >
              Pause
            </button>
          ) : (
            <button
              onClick={play}
              className="rounded bg-violet-600 px-3 py-1 text-sm text-white hover:bg-violet-700"
            >
              {progress >= 1 ? "Replay" : progress > 0 ? "Resume" : "Play"}
            </button>
          )}
          <button
            onClick={restart}
            className="rounded bg-white/10 px-3 py-1 text-sm text-white/70 hover:bg-white/20"
          >
            Restart
          </button>
        </div>

        <div className="flex-1">
          <div className="h-1 rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-violet-500 transition-all"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        <select
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="rounded bg-white/10 px-2 py-1 text-xs text-white/70"
        >
          <option value={0.5}>0.5x</option>
          <option value={1}>1x</option>
          <option value={2}>2x</option>
          <option value={4}>4x</option>
        </select>

        <span className="text-xs text-white/40">
          {exploration.events.length} events &middot;{" "}
          {(exploration.duration / 1000).toFixed(0)}s
        </span>
      </div>
    </div>
  );
}
