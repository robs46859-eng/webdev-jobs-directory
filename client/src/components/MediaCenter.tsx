/*
 * MediaCenter — YouTube Music & Video Player
 */
import { useState, useRef, useCallback } from "react";
import { X, Search, Play, Radio, Loader2, Music, Youtube } from "lucide-react";
import { trpc } from "@/lib/trpc";
import YouTubePlayer from "./YouTubePlayer";

interface MediaCenterProps {
  open: boolean;
  onClose: () => void;
}

export default function MediaCenter({ open, onClose }: MediaCenterProps) {
  const [query, setQuery] = useState("noir jazz music");
  const [searchTrigger, setSearchTrigger] = useState("noir jazz music");
  const [playingVideoId, setPlayingVideoId] = useState<string | null>("n_S8S6Xv5hY"); 
  const [playingTitle, setPlayingTitle] = useState("Noir Night Jazz");
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
    <div className="fixed inset-0 z-[110] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative z-[120] w-full max-w-2xl mx-4 rounded-sm overflow-hidden flex flex-col"
        style={{
          maxHeight: "90vh",
          background: "#0d1018",
          border: "2px solid rgba(217,70,239,0.3)",
          boxShadow: "0 0 60px rgba(0,0,0,0.9)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ background: "#111820", borderBottom: "1px solid rgba(217,70,239,0.15)" }}
        >
          <div className="flex items-center gap-3">
            <Radio size={16} style={{ color: "#d946ef" }} />
            <div>
              <h2
                className="text-sm tracking-[0.2em]"
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontWeight: 700,
                  color: "#d946ef",
                }}
              >
                MEDIA CENTER
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={onClose} className="text-[#d946ef]/60 hover:text-[#d946ef]">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Player Area */}
        {playingVideoId && (
          <div className="bg-black aspect-video w-full">
            <YouTubePlayer videoId={playingVideoId} title={playingTitle} />
          </div>
        )}

        {/* Search Bar */}
        <div
          className="flex gap-3 px-6 py-4 shrink-0"
          style={{ borderBottom: "1px solid rgba(217,70,239,0.1)" }}
        >
          <div
            className="flex items-center gap-3 flex-1 px-4 py-2 bg-[#050608] border border-[#d946ef]/20 rounded-sm"
          >
            <Search size={14} style={{ color: "#d946ef" }} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search frequencies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-xs text-[#e8e0c8]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!query.trim() || isLoading}
            className="px-6 py-2 bg-[#d946ef] text-white text-[10px] font-bold tracking-widest rounded-sm hover:brightness-110 transition-all"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            {isLoading ? <Loader2 size={12} className="animate-spin" /> : "SEARCH"}
          </button>
        </div>

        {/* Quick Channels */}
        <div
          className="flex gap-2 px-6 py-3 shrink-0 overflow-x-auto no-scrollbar"
          style={{ borderBottom: "1px solid rgba(217,70,239,0.05)" }}
        >
          {["noir jazz", "synthwave", "lo-fi study", "90s grunge", "rain sounds"].map(
            (genre) => (
              <button
                key={genre}
                onClick={() => {
                  setQuery(genre);
                  setSearchTrigger(genre);
                }}
                className={`px-3 py-1.5 rounded-sm shrink-0 transition-all text-[9px] font-bold tracking-[0.1em] border ${searchTrigger === genre ? "bg-[#d946ef]/10 text-[#d946ef] border-[#d946ef]/30" : "text-gray-500 border-white/5 hover:border-white/10"}`}
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                {genre.toUpperCase()}
              </button>
            )
          )}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0a0c10]">
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={24} className="animate-spin text-[#d946ef]" />
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#d946ef]/5">
              {results.map((item: any) => {
                const videoId = item.id?.videoId;
                const snippet = item.snippet || {};
                const thumb = snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || "";
                const title = snippet.title || "(untitled)";
                const channel = snippet.channelTitle || "";

                return (
                  <div
                    key={videoId}
                    onClick={() => playVideo(videoId, title)}
                    className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition-all hover:bg-[#d946ef]/5 ${playingVideoId === videoId ? "bg-[#d946ef]/10" : "bg-[#0a0c10]"}`}
                  >
                    <div className="w-24 aspect-video rounded-sm overflow-hidden shrink-0 relative border border-white/5">
                      {thumb && (
                        <img src={thumb} alt="" className="w-full h-full object-cover" />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                        <Play size={18} fill="currentColor" className="text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-bold tracking-wide line-clamp-2 ${playingVideoId === videoId ? "text-[#d946ef]" : "text-[#e8e0c8]"}`}
                        style={{ fontFamily: "'Oswald', sans-serif" }}
                        dangerouslySetInnerHTML={{ __html: title }}
                      />
                      <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">{channel}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!isLoading && results.length === 0 && searchTrigger && (
            <div className="flex flex-col items-center justify-center py-20 opacity-30">
              <Youtube size={48} />
              <p className="text-[10px] uppercase tracking-[0.2em] mt-4">Static... no frequency found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
