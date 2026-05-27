import FractalCanvas from "../components/fractal/FractalCanvas";
import ControlsPanel from "../components/fractal/ControlsPanel";
import RecordingControls from "../components/exploration/RecordingControls";

export default function ExplorerPage() {
  return (
    <div className="flex h-[calc(100vh-57px)]">
      <div className="relative flex-1">
        <FractalCanvas />
        <div className="absolute bottom-4 left-4">
          <RecordingControls />
        </div>
      </div>
      <div className="w-72 overflow-y-auto border-l border-white/10 p-4">
        <ControlsPanel />
      </div>
    </div>
  );
}
