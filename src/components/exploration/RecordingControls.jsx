import { useState } from "react";
import { useRecording } from "../../contexts/RecordingContext";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import SaveExplorationModal from "./SaveExplorationModal";

export default function RecordingControls() {
  const { recording, startRecording, stopRecording, resetRecording, getExplorationData } = useRecording();
  const { user } = useAuth();
  const [showSave, setShowSave] = useState(false);
  const navigate = useNavigate();

  if (!user) {
    return (
      <button
        onClick={() => navigate("/auth")}
        className="rounded bg-white/10 px-3 py-1.5 text-xs text-white/70 hover:bg-white/20"
      >
        Log in to record
      </button>
    );
  }

  if (recording.isRecording) {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
        <span className="text-xs text-red-400">Recording</span>
        <span className="text-xs text-white/40">
          {recording.events.length} events
        </span>
        <button
          onClick={stopRecording}
          className="rounded bg-red-600 px-3 py-1.5 text-xs text-white hover:bg-red-700"
        >
          Stop
        </button>
      </div>
    );
  }

  if (recording.events.length > 0 && !recording.isRecording) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/50">
          {recording.events.length} events recorded
        </span>
        <button
          onClick={() => setShowSave(true)}
          className="rounded bg-violet-600 px-3 py-1.5 text-xs text-white hover:bg-violet-700"
        >
          Save
        </button>
        <button
          onClick={resetRecording}
          className="rounded bg-white/10 px-3 py-1.5 text-xs text-white/70 hover:bg-white/20"
        >
          Discard
        </button>
        {showSave && (
          <SaveExplorationModal
            data={getExplorationData()}
            onClose={() => setShowSave(false)}
            onSaved={() => {
              resetRecording();
              setShowSave(false);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <button
      onClick={startRecording}
      className="flex items-center gap-1.5 rounded bg-white/10 px-3 py-1.5 text-xs text-white/70 hover:bg-white/20"
    >
      <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
      Record
    </button>
  );
}
