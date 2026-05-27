import { useState, useEffect } from "react";
import { databases, Query } from "../lib/appwrite";
import { Link } from "react-router-dom";

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_EXPLORATIONS_COLLECTION_ID;

export default function GalleryPage() {
  const [explorations, setExplorations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!DB_ID || !COLLECTION_ID) {
      setLoading(false);
      return;
    }
    databases
      .listDocuments(DB_ID, COLLECTION_ID, [
        Query.equal("isPublic", true),
        Query.orderDesc("$createdAt"),
        Query.limit(50),
      ])
      .then((res) => setExplorations(res.documents))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-white">Gallery</h1>

      {loading ? (
        <p className="text-white/50">Loading...</p>
      ) : explorations.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
          <p className="mb-2 text-white/60">No explorations yet.</p>
          <Link to="/explore" className="text-violet-400 hover:underline">
            Be the first to create one!
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {explorations.map((exp) => (
            <Link
              key={exp.$id}
              to={`/replay/${exp.$id}`}
              className="group rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-violet-500/30 hover:bg-white/10"
            >
              <div className="mb-3 flex h-32 items-center justify-center rounded-lg bg-black/40 text-3xl">
                {exp.fractalType === "mandelbrot"
                  ? "🌀"
                  : exp.fractalType === "julia"
                  ? "💎"
                  : exp.fractalType === "burning_ship"
                  ? "🔥"
                  : "⚡"}
              </div>
              <h3 className="font-medium text-white group-hover:text-violet-300">
                {exp.title}
              </h3>
              {exp.description && (
                <p className="mt-1 text-xs text-white/40 line-clamp-2">
                  {exp.description}
                </p>
              )}
              <div className="mt-2 flex items-center gap-2 text-xs text-white/30">
                <span>{exp.fractalType}</span>
                <span>&middot;</span>
                <span>{(exp.duration / 1000).toFixed(0)}s</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
