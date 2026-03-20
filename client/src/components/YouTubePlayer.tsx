import { useState } from "react";
import { Volume2, Video, Music, Upload, Play, Pause } from "lucide-react";

interface YouTubePlayerProps {
  videoId: string;
  title: string;
}

export default function YouTubePlayer({ videoId: initialVideoId, title: initialTitle }: YouTubePlayerProps) {
  const [mode, setMode] = useState<"video" | "music" | "upload">("video");
  const [videoId, setVideoId] = useState(initialVideoId);
  const [title, setTitle] = useState(initialTitle);
  const [isPaused, setIsPaused] = useState(false);
  const [uploadUrl, setUploadUrl] = useState("");

  const handleUpload = () => {
    if (!uploadUrl) return;
    // Extract video ID from URL if it's a YT link
    const match = uploadUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|\/v\/|\/embed\/))([^?&"'>]+)/);
    if (match) {
      setVideoId(match[1]);
      setTitle("Custom Video");
      setMode("video");
    } else {
      // Treat as generic audio/video if possible, or just mock
      setTitle("Uploaded Content");
      setMode("video");
    }
  };

  const getEmbedUrl = () => {
    let url = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    if (mode === "music") {
      // Loop and playlist for continuous play
      url += `&loop=1&playlist=${videoId}`;
    }
    if (isPaused) {
      // Note: Iframe doesn't easily pause from outside without API, but we can mock or use postMessage
      // For now, we'll just reload with autoplay=0 if paused
      url = url.replace("autoplay=1", "autoplay=0");
    }
    return url;
  };

  return (
    <div className="shrink-0 flex flex-col h-full bg-[#0a0c10] border border-[#d946ef]/20 rounded-sm overflow-hidden shadow-2xl">
      {/* Header Controls */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#111820] border-b border-[#d946ef]/10">
        <div className="flex gap-2">
          <button
            onClick={() => setMode("video")}
            className={`p-1.5 rounded-sm transition-all ${mode === "video" ? "bg-[#d946ef]/20 text-[#d946ef]" : "text-gray-500 hover:text-gray-300"}`}
            title="Video Mode"
          >
            <Video size={14} />
          </button>
          <button
            onClick={() => setMode("music")}
            className={`p-1.5 rounded-sm transition-all ${mode === "music" ? "bg-[#d946ef]/20 text-[#d946ef]" : "text-gray-500 hover:text-gray-300"}`}
            title="Music Mode (Continuous)"
          >
            <Music size={14} />
          </button>
          <button
            onClick={() => setMode("upload")}
            className={`p-1.5 rounded-sm transition-all ${mode === "upload" ? "bg-[#d946ef]/20 text-[#d946ef]" : "text-gray-500 hover:text-gray-300"}`}
            title="Upload Content"
          >
            <Upload size={14} />
          </button>
        </div>
        <div className="flex items-center gap-2">
           <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 text-[#d946ef] hover:bg-[#d946ef]/10 rounded-full transition-all"
          >
            {isPaused ? <Play size={14} /> : <Pause size={14} fill="currentColor" />}
          </button>
        </div>
      </div>

      {mode === "upload" ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-[#111820] border-2 border-dashed border-[#d946ef]/30 flex items-center justify-center text-[#d946ef]/50">
            <Upload size={32} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#d946ef] mb-1" style={{ fontFamily: "'Oswald', sans-serif" }}>UPLOAD CONTENT</h3>
            <p className="text-[10px] text-gray-500 max-w-[200px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Paste a YouTube URL or select a local file to play in the theater.</p>
          </div>
          <div className="w-full space-y-2">
            <input
              type="text"
              placeholder="Paste URL here..."
              className="w-full text-xs px-3 py-2 bg-[#0a0c10] border border-[#d946ef]/20 rounded-sm text-[#e8e0c8] focus:outline-none focus:border-[#d946ef]"
              value={uploadUrl}
              onChange={(e) => setUploadUrl(e.target.value)}
            />
            <button
              onClick={handleUpload}
              className="w-full py-2 bg-[#d946ef] text-white text-[10px] font-bold tracking-widest rounded-sm hover:brightness-110 transition-all"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              LOAD CONTENT
            </button>
          </div>
        </div>
      ) : (
        <div className="relative w-full flex-1 bg-black">
          <div className="relative w-full h-0" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={getEmbedUrl()}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 flex items-center gap-2 px-3 py-1.5"
            style={{ background: "rgba(17, 24, 32, 0.9)", borderTop: "1px solid rgba(217,70,239,0.15)" }}
          >
            <Volume2 size={12} style={{ color: "#d946ef" }} />
            <p
              className="text-[10px] truncate flex-1 font-medium tracking-wide"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#e8e0c8" }}
            >
              {mode === "music" ? "NOW STREAMING: " : ""}{title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
