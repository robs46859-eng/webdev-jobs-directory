import { useState, useEffect } from "react";
import { Search, Briefcase, MapPin, Globe, ExternalLink, Filter } from "lucide-react";

interface Job {
  id: number;
  url: string;
  title: string;
  company_name: string;
  category: string;
  job_type: string;
  publication_date: string;
  candidate_required_location: string;
  salary: string;
}

export default function JobFinderWidget() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("https://remotive.com/api/remote-jobs?category=software-dev&limit=10");
        const data = await res.json();
        setJobs(data.jobs);
      } catch (e) {
        console.error("Failed to fetch jobs:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="glass-card flex flex-col h-full min-h-[400px] overflow-hidden md:col-span-1 lg:col-span-1">
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-2">
          <Briefcase size={14} className="text-emerald-400" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80">Opportunity Scanner</h3>
        </div>
        <div className="relative">
          <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-white/20" />
          <input 
            type="text"
            placeholder="Search Intel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-black/40 border border-white/5 rounded-md pl-7 pr-2 py-1 text-[9px] text-white placeholder:text-white/10 focus:outline-none focus:border-emerald-500/50 w-32 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 opacity-20">
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span className="text-[8px] font-black uppercase tracking-widest">Decrypting Postings...</span>
          </div>
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div key={job.id} className="p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group">
              <div className="flex justify-between items-start mb-1">
                <div className="text-[11px] font-bold text-white group-hover:text-emerald-400 transition-colors truncate pr-2">
                  {job.title}
                </div>
                <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white transition-colors">
                  <ExternalLink size={10} />
                </a>
              </div>
              <div className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-2">
                {job.company_name}
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1 text-[8px] font-bold text-white/20 uppercase">
                  <Globe size={8} /> {job.candidate_required_location || "Remote"}
                </div>
                <div className="flex items-center gap-1 text-[8px] font-bold text-emerald-500/60 uppercase">
                  {job.salary || "Competitive"}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-[10px] text-white/20 uppercase font-black">No matches found</div>
        )}
      </div>

      <div className="p-3 bg-black/20 border-t border-white/5 flex justify-between items-center">
        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Feed: Remotive API</span>
        <button className="text-[8px] font-black text-emerald-500/60 hover:text-emerald-400 uppercase tracking-widest transition-colors flex items-center gap-1">
          <Filter size={8} /> Refine Search
        </button>
      </div>
    </div>
  );
}
