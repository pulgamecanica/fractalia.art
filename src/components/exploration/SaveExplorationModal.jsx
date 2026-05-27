import { useState } from "react";
import { databases, ID } from "../../lib/appwrite";
import { useAuth } from "../../contexts/AuthContext";

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_EXPLORATIONS_COLLECTION_ID;

export default function SaveExplorationModal({ data, onClose, onSaved }) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleSave(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    setError(null);

    try {
      await databases.createDocument(DB_ID, COLLECTION_ID, ID.unique(), {
        userId: user.$id,
        title: title.trim(),
        description: description.trim(),
        events: JSON.stringify(data.events),
        initialState: JSON.stringify(data.initialState),
        duration: data.duration,
        fractalType: data.fractalType,
        isPublic,
      });
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <form
        onSubmit={handleSave}
        className="w-full max-w-md rounded-xl bg-[#1a1a24] p-6 shadow-2xl"
      >
        <h2 className="mb-4 text-lg font-medium text-white">
          Save Exploration
        </h2>

        <div className="mb-3">
          <label className="mb-1 block text-xs text-white/60">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded bg-white/10 px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-violet-500"
            placeholder="My fractal journey"
            required
          />
        </div>

        <div className="mb-3">
          <label className="mb-1 block text-xs text-white/60">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded bg-white/10 px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-violet-500"
            rows={3}
            placeholder="A deep dive into the Mandelbrot set..."
          />
        </div>

        <label className="mb-4 flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="accent-violet-500"
          />
          Public (visible in gallery)
        </label>

        <div className="mb-2 text-xs text-white/40">
          {data.events.length} events &middot;{" "}
          {(data.duration / 1000).toFixed(1)}s duration
        </div>

        {error && (
          <div className="mb-3 rounded bg-red-900/40 px-3 py-2 text-xs text-red-300">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded px-4 py-2 text-sm text-white/60 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !title.trim()}
            className="rounded bg-violet-600 px-4 py-2 text-sm text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
