/*
 * BlueprintBoard — collapsible blueprint board mounted on the wall
 * Slides out from the wall like a hidden panel
 * Contains: search bar, platform/tag filters, job cards grid
 */
import { useState } from "react";
import { Search, X, ChevronRight, ChevronLeft, Filter } from "lucide-react";
import type { JobPosting, JobNote, JobStatus } from "@/lib/jobs-data";

const BLUEPRINT_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663452403431/KPXZebPSGaZWYwAsdwVntt/blueprint-board-ASzNMbmNZG2RFqoMjKEk6w.webp";

const PLATFORM_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  "Upwork": { bg: "#1a3a1a", color: "#40c840", border: "#40c840" },
  "Freelancer.com": { bg: "#1a1a3a", color: "#4080ff", border: "#4080ff" },
  "PeoplePerHour": { bg: "#3a2a0a", color: "#e8a020", border: "#e8a020" },
};

const STATUS_COLORS: Record<JobStatus, string> = {
  none: "#555",
  applied: "#40c840",
  followed: "#e8a020",
  won: "#4080ff",
};

interface BlueprintBoardProps {
  open: boolean;
  onToggle: () => void;
  jobs: JobPosting[];
  allJobs: JobPosting[];
  search: string;
  onSearch: (s: string) => void;
  selectedPlatforms: string[];
  onTogglePlatform: (p: string) => void;
  selectedTags: string[];
  onToggleTag: (t: string) => void;
  onClearFilters: () => void;
  onSelectJob: (j: JobPosting) => void;
  jobNotes: JobNote[];
  platforms: string[];
  tags: string[];
}

export default function BlueprintBoard({
  open, onToggle, jobs, allJobs, search, onSearch,
  selectedPlatforms, onTogglePlatform, selectedTags, onToggleTag,
  onClearFilters, onSelectJob, jobNotes, platforms, tags,
}: BlueprintBoardProps) {
  const [showFilters, setShowFilters] = useState(false);

  const getNoteStatus = (jobId: number): JobStatus => {
    return jobNotes.find((n) => n.jobId === jobId)?.status ?? "none";
  };

  return (
    <>
      {/* ── Wall toggle handle ── */}
      <button
        onClick={onToggle}
        className="absolute z-20 flex items-center gap-1 transition-all duration-300"
        style={{
          top: "50%",
          left: open ? "calc(75% - 16px)" : "calc(50% - 16px)",
          transform: "translateY(-50%)",
          background: "#1a2a4a",
          border: "2px solid #c8d840",
          color: "#c8d840",
          padding: "8px 4px",
          borderRadius: "2px",
          boxShadow: "0 0 12px rgba(200,216,64,0.3)",
          fontFamily: "'Oswald', sans-serif",
          fontSize: "0.6rem",
          letterSpacing: "0.1em",
          writingMode: "vertical-rl",
          textOrientation: "mixed", opacity: '0',
        }}
        title={open ? "Collapse Board" : "Open Blueprint Board"}
      >
        {open ? <ChevronLeft size={14} style={{opacity: '0'}} /> : <ChevronRight size={14} style={{opacity: '0'}} />}
        <span style={{ marginTop: "4px" }}>BLUEPRINT</span>
      </button>

      {/* ── Board panel ── */}
      <div
        className="absolute top-0 left-0 h-full z-20 flex flex-col transition-transform duration-500 ease-in-out"
        style={{
          width: "75%",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          backgroundImage: `url(${BLUEPRINT_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRight: "4px solid #3a4a5a",
          boxShadow: open ? "8px 0 40px rgba(0,0,0,0.7)" : "none",
        }}
      >
        {/* Blueprint overlay tint */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "rgba(10,20,40,0.55)" }}
        />

        {/* ── Header ── */}
        <div
          className="relative z-10 flex items-center justify-between px-5 py-3 shrink-0"
          style={{
            background: "rgba(10,20,40,0.85)",
            borderBottom: "2px solid rgba(200,216,64,0.4)",
          }}
        >
          <div>
            <h2
              className="text-xl fluorescent-text tracking-widest"
              style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700 }}
            >
              ACTIVE OPPORTUNITIES
            </h2>
            <p className="text-xs" style={{ color: "#8a9420", fontFamily: "'DM Sans', sans-serif" }}>
              {jobs.length} of {allJobs.length} postings
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-sm transition-all"
              style={{
                fontFamily: "'Oswald', sans-serif",
                background: showFilters ? "rgba(200,216,64,0.2)" : "transparent",
                color: "#c8d840",
                border: "1px solid rgba(200,216,64,0.4)",
                letterSpacing: "0.08em",
              }}
            >
              <Filter size={11} /> FILTERS
            </button>
            <button onClick={onToggle} style={{ color: "#c8d840" }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Search bar ── */}
        <div
          className="relative z-10 px-5 py-2 shrink-0"
          style={{ background: "rgba(10,20,40,0.7)", borderBottom: "1px solid rgba(200,216,64,0.2)" }}
        >
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#c8d840" }} />
            <input
              type="text"
              placeholder="Search opportunities..."
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2 text-sm rounded-sm outline-none"
              style={{
                background: "rgba(26,42,74,0.8)",
                border: "1px solid rgba(200,216,64,0.3)",
                color: "#e8e0c8",
                fontFamily: "'DM Sans', sans-serif",
              }}
            />
          </div>
        </div>

        {/* ── Filter panel ── */}
        {showFilters && (
          <div
            className="relative z-10 px-5 py-3 shrink-0 flex flex-wrap gap-4"
            style={{ background: "rgba(10,20,40,0.8)", borderBottom: "1px solid rgba(200,216,64,0.2)" }}
          >
            {/* Platforms */}
            <div>
              <p className="text-xs mb-1.5 tracking-widest" style={{ fontFamily: "'Oswald', sans-serif", color: "#8a9420" }}>PLATFORM</p>
              <div className="flex gap-2">
                {platforms.map((p) => {
                  const c = PLATFORM_COLORS[p];
                  const active = selectedPlatforms.includes(p);
                  return (
                    <button
                      key={p}
                      onClick={() => onTogglePlatform(p)}
                      className="text-xs px-2 py-1 rounded-sm transition-all"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        background: active ? c?.bg : "rgba(26,42,74,0.6)",
                        color: active ? c?.color : "#888",
                        border: `1px solid ${active ? c?.border : "#444"}`,
                      }}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Tags */}
            <div className="flex-1 min-w-0">
              <p className="text-xs mb-1.5 tracking-widest" style={{ fontFamily: "'Oswald', sans-serif", color: "#8a9420" }}>CATEGORY</p>
              <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                {tags.map((t) => {
                  const active = selectedTags.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => onToggleTag(t)}
                      className="text-xs px-1.5 py-0.5 rounded-sm transition-all"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        background: active ? "rgba(200,216,64,0.2)" : "rgba(26,42,74,0.6)",
                        color: active ? "#c8d840" : "#888",
                        border: `1px solid ${active ? "rgba(200,216,64,0.5)" : "#444"}`,
                      }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
            {(selectedPlatforms.length > 0 || selectedTags.length > 0 || search) && (
              <button
                onClick={onClearFilters}
                className="text-xs self-end px-2 py-1"
                style={{ color: "#c03020", fontFamily: "'DM Sans', sans-serif", border: "1px solid #c03020", borderRadius: "2px" }}
              >
                Clear All
              </button>
            )}
          </div>
        )}

        {/* ── Job cards grid ── */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4">
          {jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <p className="text-lg tracking-widest" style={{ fontFamily: "'Oswald', sans-serif", color: "#c8d840" }}>
                NO LEADS FOUND
              </p>
              <p className="text-sm" style={{ color: "#888", fontFamily: "'DM Sans', sans-serif" }}>
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
              {jobs.map((job) => {
                const pc = PLATFORM_COLORS[job.platform];
                const status = getNoteStatus(job.id);
                return (
                  <div
                    key={job.id}
                    onClick={() => onSelectJob(job)}
                    className="blueprint-card rounded-sm p-3 cursor-pointer"
                  >
                    {/* Platform badge + status */}
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-sm font-medium"
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          background: pc?.bg,
                          color: pc?.color,
                          border: `1px solid ${pc?.border}`,
                          fontSize: "0.65rem",
                        }}
                      >
                        {job.platform}
                      </span>
                      {status !== "none" && (
                        <span
                          className="text-xs px-1.5 py-0.5 rounded-sm"
                          style={{
                            fontFamily: "'Oswald', sans-serif",
                            color: STATUS_COLORS[status],
                            border: `1px solid ${STATUS_COLORS[status]}`,
                            background: `${STATUS_COLORS[status]}22`,
                            fontSize: "0.6rem",
                            letterSpacing: "0.08em",
                          }}
                        >
                          {status.toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3
                      className="text-sm leading-snug text-stone-800 mb-1.5"
                      style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 500, fontSize: "0.85rem" }}
                    >
                      {job.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-2"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {job.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {job.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-1.5 py-0.5 rounded-sm"
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            background: "#f0ece0",
                            color: "#5a4a30",
                            border: "1px solid #d4c890",
                            fontSize: "0.65rem",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-1.5 border-t border-stone-200">
                      <span className="text-xs text-stone-400" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem" }}>
                        {job.location}
                      </span>
                      <span
                        className="text-xs btn-noir px-2 py-0.5 rounded-sm"
                        style={{ fontSize: "0.6rem" }}
                      >
                        EMAIL →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
