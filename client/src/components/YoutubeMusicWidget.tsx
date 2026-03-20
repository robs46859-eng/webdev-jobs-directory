import { Music, Play, SkipBack, SkipForward, Volume2, Repeat, ListMusic } from "lucide-react";

export default function YoutubeMusicWidget() {
  return (
    <div className="glass-card flex flex-col h-full min-h-[300px] overflow-hidden">
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-2">
          <Music size={14} className="text-purple-400" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80">Bat-Audio Frequency</h3>
        </div>
        <ListMusic size={14} className="text-white/20" />
      </div>

      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
        {/* Cover Art Placeholder */}
        <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl border border-white/10 flex items-center justify-center mb-6 relative group overflow-hidden">
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Play size={32} className="text-white" />
          </div>
          <Music size={48} className="text-white/10 group-hover:scale-110 transition-transform duration-500" />
        </div>

        <div className="space-y-1 mb-6">
          <div className="text-sm font-black text-white uppercase tracking-widest">Lo-Fi Noir Beats</div>
          <div className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">Arkham City Nights</div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-8 mb-6">
          <button className="text-white/40 hover:text-white transition-colors"><SkipBack size={18} /></button>
          <button className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all scale-100 hover:scale-110">
            <Play size={24} fill="currentColor" />
          </button>
          <button className="text-white/40 hover:text-white transition-colors"><SkipForward size={18} /></button>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-2">
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-purple-500/60" />
          </div>
          <div className="flex justify-between text-[8px] font-black text-white/20 tracking-tighter uppercase">
            <span>01:42</span>
            <span>03:15</span>
          </div>
        </div>
      </div>

      {/* Quick Settings */}
      <div className="px-6 py-3 bg-black/40 border-t border-white/5 flex justify-between items-center">
        <button className="text-white/20 hover:text-purple-400 transition-colors"><Repeat size={12} /></button>
        <div className="flex items-center gap-3">
          <Volume2 size={12} className="text-white/20" />
          <div className="w-16 h-1 bg-white/10 rounded-full">
            <div className="w-3/4 h-full bg-white/40" />
          </div>
        </div>
      </div>
    </div>
  );
}
