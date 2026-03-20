/*
 * RetroRadio — YouTube Music Player
 * Noir detective room style — real YouTube search and embedded playback
 */
import { useState, useRef, useCallback } from "react";
import { X, Search, Play, Radio, Loader2, Music, Youtube } from "lucide-react";
import { trpc } from "@/lib/trpc";
import YouTubePlayer from "./YouTubePlayer";

interface RetroRadioProps {
  open: boolean;
  onClose: () => void;
}

export default function RetroRadio({ open, onClose }: RetroRadioProps) {
  const [query, setQuery] = useState("2000s skater punk rock");
  const [searchTrigger, setSearchTrigger] = useState("");
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [playingTitle, setPlayingTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: searchData, isLoading } = trpc.youtube.search.useQuery(
    { query: searchTrigger, maxResults: 12 },
    { enabled: !!searchTrigger }
  );

  const { data: authStatus } = trpc.youtube.status.useQuery();

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      setSearchTrigger(query.trim());
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.stopPropagation();
      handleSearch();
    }
  };

  const playVideo = (videoId: string, title: string) => {
    setPlayingVideoId(videoId);
    setPlayingTitle(title);
  };

  const results = searchData?.items ?? [];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative z-50 w-full max-w-xl mx-4 rounded-sm overflow-hidden flex flex-col"
        style={{
          maxHeight: "85vh",
          background: "#0d1018",
          border: "2px solid rgba(217,70,239,0.4)",
          boxShadow: "0 0 60px rgba(0,0,0,0.9), 0 0 20px rgba(217,70,239,0.1)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3 shrink-0"
          style={{ background: "#1a2030", borderBottom: "2px solid rgba(217,70,239,0.3)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-7 flex items-center justify-center rounded-sm"
              style={{ background: "#3a2a0a", border: "1px solid rgba(217,70,239,0.4)" }}
            >
              <Radio size={14} style={{ color: "#d946ef" }} />
            </div>
            <div>
              <h2
                className="text-base tracking-widest"
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontWeight: 700,
                  color: "#d946ef",
                  textShadow: "0 0 10px rgba(217,70,239,0.3)",
                }}
              >
                RETRO RADIO
              </h2>
              <p className="text-xs" style={{ color: "#c084fc", fontFamily: "'DM Sans', sans-serif" }}>
                YouTube Music Player
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {!authStatus?.authenticated && (
              <a
                href="/api/auth/youtube"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm transition-all text-xs"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.4)",
                  color: "#ef4444",
                  fontFamily: "'Oswald', sans-serif",
                }}
              >
                <Youtube size={14} />
                SIGN IN
              </a>
            )}
            <button onClick={onClose} style={{ color: "#d946ef" }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Now Playing */}
        {playingVideoId && <YouTubePlayer videoId={playingVideoId} title={playingTitle} />}

        {/* Search Bar */}
        <div
          className="flex gap-2 px-4 py-3 shrink-0"
          style={{ borderBottom: "1px solid rgba(217,70,239,0.15)" }}
        >
          <div
            className="flex items-center gap-2 flex-1 px-3 py-2 rounded-sm"
            style={{ background: "#1a2030", border: "1px solid rgba(217,70,239,0.2)" }}
          >
            <Search size={13} style={{ color: "#d946ef" }} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search YouTube..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-xs"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#e8e0c8" }}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!query.trim() || isLoading}
            className="px-3 py-2 rounded-sm transition-all flex items-center gap-1.5"
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.08em",
              background: "rgba(217,70,239,0.15)",
              color: "#d946ef",
              border: "1px solid rgba(217,70,239,0.4)",
            }}
          >
            {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Search size={12} />}
            SEARCH
          </button>
        </div>

        {/* Quick Genre Buttons */}
        <div
          className="flex gap-1.5 px-4 py-2 shrink-0 overflow-x-auto"
          style={{ borderBottom: "1px solid rgba(217,70,239,0.1)" }}
        >
          {["2000s skater punk", "lo-fi hip hop", "synthwave", "jazz noir", "90s grunge", "vaporwave"].map(
            (genre) => (
              <button
                key={genre}
                onClick={() => {
                  setQuery(genre);
                  setSearchTrigger(genre);
                }}
                className="px-2 py-1 rounded-sm shrink-0 transition-all"
                style={{
                  fontSize: "0.55rem",
                  fontFamily: "'Oswald', sans-serif",
                  letterSpacing: "0.06em",
                  color: searchTrigger === genre ? "#d946ef" : "#888",
                  background: searchTrigger === genre ? "rgba(217,70,239,0.1)" : "transparent",
                  border: `1px solid ${searchTrigger === genre ? "rgba(217,70,239,0.3)" : "rgba(255,255,255,0.06)"}`,
                }}
              >
                {genre.toUpperCase()}
              </button>
            )
          )}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {!searchTrigger && !playingVideoId && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Music size={32} style={{ color: "#444" }} />
              <p
                className="text-xs text-center"
                style={{ fontFamily: "'Special Elite', cursive", color: "#666" }}
              >
                Search for music or pick a genre above.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-10">
              <Loader2 size={20} className="animate-spin" style={{ color: "#d946ef" }} />
            </div>
          )}

          {!isLoading &&
            results.map((item: any) => {
              const videoId = item.id?.videoId;
              const snippet = item.snippet || {};
              const thumb = snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || "";
              const title = snippet.title || "(untitled)";
              const channel = snippet.channelTitle || "";

              return (
                <div
                  key={videoId}
                  onClick={() => playVideo(videoId, title)}
                  className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-all hover:bg-white/[0.03]"
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    background: playingVideoId === videoId ? "rgba(217,70,239,0.08)" : "transparent",
                  }}
                >
                  <div className="w-20 h-12 rounded-sm overflow-hidden shrink-0 relative">
                    {thumb && (
                      <img src={thumb} alt="" className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Play size={16} style={{ color: "#fff" }} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs font-semibold truncate"
                      style={{
                        fontFamily: "'Oswald', sans-serif",
                        color: playingVideoId === videoId ? "#d946ef" : "#e8e0c8",
                        letterSpacing: "0.02em",
                      }}
                      dangerouslySetInnerHTML={{ __html: title }}
                    />
                    <p
                      className="text-xs truncate mt-0.5"
                      style={{ fontFamily: "'DM Sans', sans-serif", color: "#888", fontSize: "0.65rem" }}
                    >
                      {channel}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
