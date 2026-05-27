import { Outlet } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { FractalProvider } from "./contexts/FractalContext";
import { RecordingProvider } from "./contexts/RecordingContext";
import Navbar from "./components/layout/Navbar";

export default function App() {
  return (
    <AuthProvider>
      <FractalProvider>
        <RecordingProvider>
          <div className="flex min-h-screen flex-col bg-[#0a0a0f]">
            <Navbar />
            <Outlet />
          </div>
        </RecordingProvider>
      </FractalProvider>
    </AuthProvider>
  );
}
