import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login, signup, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate("/explore");
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
      navigate("/explore");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl bg-white/5 p-8 backdrop-blur-md"
      >
        <h1 className="mb-6 text-center text-2xl font-semibold text-white">
          {isLogin ? "Sign In" : "Create Account"}
        </h1>

        {!isLogin && (
          <div className="mb-4">
            <label className="mb-1 block text-xs text-white/60">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:ring-1 focus:ring-violet-500"
              required
            />
          </div>
        )}

        <div className="mb-4">
          <label className="mb-1 block text-xs text-white/60">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:ring-1 focus:ring-violet-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-xs text-white/60">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-white/10 px-4 py-2.5 text-sm text-white outline-none focus:ring-1 focus:ring-violet-500"
            minLength={8}
            required
          />
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-900/40 px-3 py-2 text-xs text-red-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mb-4 w-full rounded-lg bg-violet-600 py-2.5 font-medium text-white hover:bg-violet-700 disabled:opacity-50"
        >
          {loading ? "..." : isLogin ? "Sign In" : "Create Account"}
        </button>

        <p className="text-center text-sm text-white/50">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-violet-400 hover:underline"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </form>
    </div>
  );
}
