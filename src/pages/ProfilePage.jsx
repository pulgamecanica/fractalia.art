import { useState, useEffect } from "react";
import { databases, Query } from "../lib/appwrite";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_EXPLORATIONS_COLLECTION_ID;

export default function ProfilePage() {
  const { user } = useAuth();
  const [explorations, setExplorations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !DB_ID || !COLLECTION_ID) {
      setLoading(false);
      return;
    }
    databases
      .listDocuments(DB_ID, COLLECTION_ID, [
        Query.equal("userId", user.$id),
        Query.orderDesc("$createdAt"),
      ])
      .then((res) => setExplorations(res.documents))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  async function handleDelete(id) {
    await databases.deleteDocument(DB_ID, COLLECTION_ID, id);
    setExplorations((prev) => prev.filter((e) => e.$id !== id));
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-semibold text-white">
        {user?.name || "Profile"}
      </h1>
      <p className="mb-6 text-sm text-white/40">{user?.email}</p>

      <h2 className="mb-4 text-lg text-white/80">My Explorations</h2>

      {loading ? (
        <p className="text-white/50">Loading...</p>
      ) : explorations.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="mb-2 text-white/60">No explorations yet.</p>
          <Link to="/explore" className="text-violet-400 hover:underline">
            Start exploring!
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {explorations.map((exp) => (
            <div
              key={exp.$id}
              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4"
            >
              <div>
                <Link
                  to={`/replay/${exp.$id}`}
                  className="font-medium text-white hover:text-violet-300"
                >
                  {exp.title}
                </Link>
                <div className="mt-1 text-xs text-white/40">
                  {exp.fractalType} &middot; {(exp.duration / 1000).toFixed(0)}s
                  &middot; {exp.isPublic ? "Public" : "Private"}
                </div>
              </div>
              <button
                onClick={() => handleDelete(exp.$id)}
                className="rounded px-3 py-1 text-xs text-red-400 hover:bg-red-900/30"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
