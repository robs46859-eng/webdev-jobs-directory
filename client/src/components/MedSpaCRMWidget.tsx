import { useState } from "react";
import { Users, Search, Plus, Filter, MoreHorizontal, Calendar, Star, Phone, Mail, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function MedSpaCRMWidget() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { data, isLoading, error } = trpc.crm.list.useQuery({
    search: search || undefined,
    status: filterStatus === "all" ? undefined : filterStatus,
    limit: 50,
  });

  const leads = data?.leads || [];

  return (
    <div className="glass-card flex flex-col h-full min-h-[400px] overflow-hidden md:col-span-2 lg:col-span-3">
      {/* CRM Header */}
      <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Users size={20} className="text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">MedSpa Client Nexus</h3>
            <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">Live CRM Database Connection</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
            <input 
              type="text"
              placeholder="Search Database..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-black/40 border border-white/5 rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder:text-white/10 focus:outline-none focus:border-purple-500/50 w-64 transition-all"
            />
          </div>
          <button className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 p-2 rounded-lg transition-colors border border-purple-500/20">
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* CRM Tools */}
      <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between bg-black/20">
        <div className="flex gap-4">
          {["all", "new", "booked", "replied", "unsubscribed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-all border ${
                filterStatus === status 
                  ? "bg-white/10 text-white border-white/20" 
                  : "text-white/20 border-transparent hover:text-white/40"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-white/20">
          <Filter size={10} /> Export Data
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-x-auto custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Accessing Encrypted Records...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 text-red-400 text-[10px] font-black uppercase tracking-widest">
            Database Connection Error: {error.message}
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-black/40">
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Client Info</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Location</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Last Contact</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Status</th>
                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/5 flex items-center justify-center text-[10px] font-black text-white/60">
                        {lead.firstName?.[0]}{lead.lastName?.[0]}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">{lead.firstName} {lead.lastName}</div>
                        <div className="text-[9px] text-white/20 font-black uppercase">{lead.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-white/80">{lead.location || "Remote"}</div>
                    <div className="text-[9px] text-white/20 uppercase font-black tracking-tighter mt-1">{lead.companyName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-[10px] text-white/40 font-black uppercase">
                      <Calendar size={12} className="text-white/20" /> 
                      {lead.lastContactedAt ? new Date(lead.lastContactedAt).toLocaleDateString() : "Never"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                      lead.status === "booked" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      lead.status === "new" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                      lead.status === "replied" ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
                      "bg-white/5 text-white/40 border-white/10"
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-white/5 rounded-md text-white/20 hover:text-white transition-all"><Phone size={12} /></button>
                      <button className="p-1.5 hover:bg-white/5 rounded-md text-white/20 hover:text-white transition-all"><Mail size={12} /></button>
                      <button className="p-1.5 hover:bg-white/5 rounded-md text-white/20 hover:text-white transition-all"><MoreHorizontal size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* CRM Footer */}
      <div className="p-4 bg-black/40 border-t border-white/5 flex justify-between items-center">
        <div className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">
          Live Database Connection Active // Total Records: {data?.total || 0}
        </div>
      </div>
    </div>
  );
}
