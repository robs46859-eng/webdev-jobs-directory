import { useState } from "react";
import { Play, Terminal, ExternalLink, Loader2, Search } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function YoutubeDevWidget() {
  const [query, setQuery] = useState("React TypeScript tutorial 2026");
  const { data, isLoading, error } = trpc.youtube.search.useQuery({
    query: query,
    maxResults: 1
  });

  const video = data?.items?.[0];

  return (
    <div className="glass-card flex flex-col h-full min-h-[300px] overflow-hidden">
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-blue-400" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80">Dev Intelligence</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-white/20" />
            <input 
              type="text" 
              className="bg-black/40 border border-white/5 rounded-md pl-6 pr-2 py-0.5 text-[8px] text-white focus:outline-none focus:border-blue-500/50 w-32"
              placeholder="Search Intelligence..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') setQuery((e.target as HTMLInputElement).value);
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 bg-black/40 relative group">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Establishing Satellite Link...</span>
          </div>
        ) : video ? (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${video.id.videoId}`}
            title={video.snippet.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="grayscale hover:grayscale-0 transition-all duration-700 opacity-60 hover:opacity-100"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-[10px] text-white/20 uppercase font-black">Signal Lost</div>
        )}
        <div className="absolute inset-0 pointer-events-none border-[12px] border-black/20 group-hover:border-transparent transition-all" />
      </div>

      <div className="p-4 bg-black/60">
        <div className="text-[10px] font-bold text-white/90 uppercase tracking-widest mb-1 truncate">
          {video?.snippet?.title || "No Active Feed"}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-[8px] text-blue-400 font-black uppercase tracking-tighter">
            Channel: {video?.snippet?.channelTitle || "Unknown"}
          </div>
          <div className="flex-1 h-[1px] bg-white/5" />
          <div className="text-[8px] text-white/20 font-black uppercase tracking-widest">LIVE INTEL</div>
        </div>
      </div>
    </div>
  );
}
