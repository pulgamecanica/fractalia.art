import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-57px)] flex-col items-center justify-center px-4">
      <h1 className="mb-4 text-5xl font-bold text-white">
        Fractalia<span className="text-violet-400">.art</span>
      </h1>
      <p className="mb-8 max-w-lg text-center text-lg text-white/60">
        Explore infinite fractal worlds powered by Rust and WebAssembly.
        Record your journeys and share them with others.
      </p>
      <div className="flex gap-4">
        <Link
          to="/explore"
          className="rounded-lg bg-violet-600 px-6 py-3 font-medium text-white transition hover:bg-violet-700"
        >
          Start Exploring
        </Link>
        <Link
          to="/gallery"
          className="rounded-lg border border-white/20 px-6 py-3 font-medium text-white/80 transition hover:bg-white/5"
        >
          View Gallery
        </Link>
      </div>
      <div className="mt-16 grid max-w-2xl grid-cols-2 gap-6 text-sm text-white/50 md:grid-cols-4">
        {["Mandelbrot", "Julia", "Burning Ship", "Newton"].map((name) => (
          <div
            key={name}
            className="rounded-lg border border-white/10 bg-white/5 p-4 text-center"
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}
