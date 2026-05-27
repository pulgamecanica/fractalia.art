import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `px-3 py-1.5 rounded text-sm transition ${
      isActive(path)
        ? "bg-violet-600/20 text-violet-300"
        : "text-white/60 hover:text-white hover:bg-white/5"
    }`;

  return (
    <nav className="flex items-center justify-between border-b border-white/10 px-4 py-3">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-lg font-semibold text-white">
          Fractalia<span className="text-violet-400">.art</span>
        </Link>
        <div className="flex gap-1">
          <Link to="/explore" className={linkClass("/explore")}>
            Explorer
          </Link>
          <Link to="/gallery" className={linkClass("/gallery")}>
            Gallery
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {user ? (
          <>
            <Link to="/profile" className={linkClass("/profile")}>
              {user.name || user.email}
            </Link>
            <button
              onClick={logout}
              className="rounded px-3 py-1.5 text-sm text-white/40 hover:text-white"
            >
              Log out
            </button>
          </>
        ) : (
          <Link
            to="/auth"
            className="rounded bg-violet-600 px-3 py-1.5 text-sm text-white hover:bg-violet-700"
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}
