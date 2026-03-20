import { X } from "lucide-react";

interface HelpOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function HelpOverlay({ open, onClose }: HelpOverlayProps) {
  if (!open) return null;

  const shortcuts = [
    { key: "B", action: "Blueprint Board", description: "View all job listings" },
    { key: "C", action: "Case Board", description: "Track job applications" },
    { key: "F", action: "Filing Cabinet", description: "Manage portfolio & bio" },
    { key: "E", action: "Email Compose", description: "Write & send emails" },
    { key: "L", action: "Calendar", description: "Track deadlines & events" },
    { key: "W", action: "Weather", description: "Check Gotham weather" },
    { key: "S", action: "Storage Cabinet", description: "Email & calendar toggle" },
    { key: "?", action: "Help", description: "Show this overlay" },
    { key: "Esc", action: "Close Panel", description: "Close any open panel" },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Help Modal */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl p-8 rounded-lg"
        style={{
          background: "rgba(10,15,24,0.95)",
          border: "2px solid rgba(217,70,239,0.4)",
          boxShadow: "0 0 40px rgba(217,70,239,0.3)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:opacity-70 transition-opacity"
          style={{ color: "#d946ef" }}
        >
          <X size={24} />
        </button>

        {/* Title */}
        <h2
          className="text-3xl font-bold mb-6"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            color: "#ffffff",
            textShadow: "0 0 20px rgba(217,70,239,0.6)",
          }}
        >
          KEYBOARD SHORTCUTS
        </h2>

        {/* Shortcuts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.key}
              className="flex items-start gap-4 p-3 rounded"
              style={{
                background: "rgba(217,70,239,0.05)",
                border: "1px solid rgba(217,70,239,0.2)",
              }}
            >
              {/* Key Badge */}
              <div
                className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded font-bold text-sm"
                style={{
                  background: "rgba(217,70,239,0.15)",
                  border: "1px solid rgba(217,70,239,0.4)",
                  color: "#d946ef",
                  fontFamily: "'Oswald', sans-serif",
                  textShadow: "0 0 8px rgba(217,70,239,0.4)",
                }}
              >
                {shortcut.key}
              </div>

              {/* Description */}
              <div className="flex-1 min-w-0">
                <p
                  className="font-semibold text-sm"
                  style={{
                    color: "#d946ef",
                    fontFamily: "'Oswald', sans-serif",
                    letterSpacing: "0.05em",
                  }}
                >
                  {shortcut.action}
                </p>
                <p
                  className="text-xs mt-1"
                  style={{
                    color: "rgba(217,70,239,0.6)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {shortcut.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p
          className="text-xs mt-6 text-center"
          style={{
            color: "rgba(217,70,239,0.5)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Press <span style={{ color: "#d946ef", fontWeight: "bold" }}>ESC</span> or click outside to close
        </p>
      </div>
    </>
  );
}
