import { useState } from "react";
import { Mail, Inbox, Send, Archive, RefreshCw, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function EmailWidget() {
  const { data, isLoading, refetch, isRefetching } = trpc.email.listThreads.useQuery({
    limit: 20
  });

  const threads = data?.data || [];

  return (
    <div className="glass-card flex flex-col h-full min-h-[300px] overflow-hidden md:col-span-2 lg:col-span-2">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-2">
          <Mail size={16} className="text-white/60" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80">Agentmail Nexus</h3>
        </div>
        <button 
          onClick={() => refetch()}
          disabled={isLoading || isRefetching}
          className={`p-2 hover:bg-white/5 rounded-full transition-colors ${(isLoading || isRefetching) ? "animate-spin" : ""}`}
        >
          <RefreshCw size={14} className="text-white/40" />
        </button>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 py-10">
            <Loader2 className="w-6 h-6 text-white/20 animate-spin" />
            <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white/10">Synchronizing Uplink...</span>
          </div>
        ) : threads.length > 0 ? (
          threads.map((thread: any) => (
            <div 
              key={thread.id} 
              className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors group relative`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-[11px] font-bold tracking-wide text-white/80 group-hover:text-white transition-colors">
                  {thread.lastMessage?.from?.[0]?.name || thread.lastMessage?.from?.[0]?.email || "Unknown"}
                </span>
                <span className="text-[9px] text-white/20 font-black uppercase">
                  {new Date(thread.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="text-[10px] font-bold mb-1 truncate text-white/60">
                {thread.subject || "No Subject"}
              </div>
              <div className="text-[10px] text-white/30 truncate leading-relaxed">
                {thread.lastMessage?.preview || "No preview available"}
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-[10px] text-white/10 uppercase font-black tracking-widest">
            Inbox Securely Clear
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-white/5 flex justify-center gap-6 bg-black/20">
        <button className="flex flex-col items-center gap-1 group">
          <Inbox size={14} className="text-white/20 group-hover:text-white transition-colors" />
          <span className="text-[7px] font-black uppercase tracking-widest text-white/10 group-hover:text-white/40">Inbox</span>
        </button>
        <button className="flex flex-col items-center gap-1 group">
          <Send size={14} className="text-white/20 group-hover:text-white transition-colors" />
          <span className="text-[7px] font-black uppercase tracking-widest text-white/10 group-hover:text-white/40">Sent</span>
        </button>
        <button className="flex flex-col items-center gap-1 group">
          <Archive size={14} className="text-white/20 group-hover:text-white transition-colors" />
          <span className="text-[7px] font-black uppercase tracking-widest text-white/10 group-hover:text-white/40">Vault</span>
        </button>
      </div>
    </div>
  );
}
