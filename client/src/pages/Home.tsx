/*
 * THE BOARD ROOM — Home Page
 */

import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { jobs, type JobPosting, type JobStatus, ALL_PLATFORMS, ALL_TAGS } from "@/lib/jobs-data";
import BlueprintBoard from "@/components/BlueprintBoard";
import CorkBoard from "@/components/CorkBoard";
import FilingCabinet from "@/components/FilingCabinet";
import EmailDrawer from "@/components/EmailDrawer";
import CrmPanel from "@/components/CrmPanel";
import HelpOverlay from "@/components/HelpOverlay";
import WeatherWindow from "@/components/WeatherWindow";
import MediaCenter from "@/components/MediaCenter";
import DeskWidget from "@/components/DeskWidget";
import CalendarPanel from "@/components/CalendarPanel";
import AIAssistantModal from "@/components/AIAssistantModal";
import NoirRoom from "@/components/NoirRoom";

export type JobNote = {
  jobId: number;
  status: JobStatus;
  note: string;
};

export default function Home() {
  const { toggleTheme } = useTheme();
  const [boardOpen, setBoardOpen] = useState(false);
  const [corkOpen, setCorkOpen] = useState(false);
  const [cabinetOpen, setCabinetOpen] = useState(false);
  const [activeCabinetDrawer, setActiveCabinetDrawer] = useState<"portfolio" | "bio" | "rates" | null>(null);
  const [crmOpen, setCrmOpen] = useState(false);
  const [weatherOpen, setWeatherOpen] = useState(false);
  const [radioOpen, setRadioOpen] = useState(false);
  const [deskOpen, setDeskOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [jobNotes, setJobNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem("boardroom-notes") || "[]"); } catch { return []; }
  });

  const openJob = (job: JobPosting) => { setSelectedJob(job); setDrawerOpen(true); };
  const closeDrawer = () => { setDrawerOpen(false); setTimeout(() => setSelectedJob(null), 300); };

  const updateJobNote = (jobId: number, status: JobStatus, note: string) => {
    setJobNotes((prev: any) => {
      const existing = prev.find((n: any) => n.jobId === jobId);
      if (existing) return prev.map((n: any) => n.jobId === jobId ? { ...n, status, note } : n);
      return [...prev, { jobId, status, note }];
    });
  };

  const filteredJobs = jobs.filter((j) => {
    const matchSearch = !search ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.description.toLowerCase().includes(search.toLowerCase()) ||
      j.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchPlatform = selectedPlatforms.length === 0 || selectedPlatforms.includes(j.platform);
    const matchTag = selectedTags.length === 0 || j.tags.some((t) => selectedTags.includes(t));
    return matchSearch && matchPlatform && matchTag;
  });

  const handleAction = (action: string) => {
    switch (action) {
      case "TOGGLE_THEME": toggleTheme?.(); break;
      case "OPEN_JOBS": setCorkOpen(true); break;
      case "OPEN_PORTFOLIO": 
        setActiveCabinetDrawer("portfolio");
        setCabinetOpen(true);
        break;
      case "OPEN_BIO":
        setActiveCabinetDrawer("bio");
        setCabinetOpen(true);
        break;
      case "OPEN_WEATHER": setWeatherOpen(true); break;
      case "OPEN_AI": setAiOpen(true); break;
      case "OPEN_MAIL": setDeskOpen(true); break;
      case "OPEN_CALENDAR": setCalendarOpen(true); break;
      case "OPEN_MEDIA": setRadioOpen(true); break;
      case "OPEN_CRM": setCrmOpen(true); break;
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden select-none bg-black">
      
      {/* ── Plug & Play Noir Room Template ── */}
      <NoirRoom onAction={handleAction} />

      {/* ── Title Overlays ── */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-[0.2em] text-white drop-shadow-[0_0_20px_rgba(217,70,239,0.5)]" style={{ fontFamily: "'Oswald', sans-serif" }}>
          ARKHAM DIRECTORY
        </h1>
      </div>

      {/* ── Modals & Panels ── */}
      <BlueprintBoard
        open={boardOpen}
        onToggle={() => setBoardOpen((v) => !v)}
        jobs={filteredJobs}
        allJobs={jobs}
        search={search}
        onSearch={setSearch}
        selectedPlatforms={selectedPlatforms}
        onTogglePlatform={(p: string) => setSelectedPlatforms((prev) =>
          prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
        )}
        selectedTags={selectedTags}
        onToggleTag={(t: string) => setSelectedTags((prev) =>
          prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
        )}
        onClearFilters={() => { setSelectedPlatforms([]); setSelectedTags([]); setSearch(""); }}
        onSelectJob={openJob}
        jobNotes={jobNotes}
        platforms={ALL_PLATFORMS as unknown as string[]}
        tags={ALL_TAGS}
      />

      <CorkBoard
        open={corkOpen}
        onToggle={() => setCorkOpen((v) => !v)}
        jobs={jobs}
        jobNotes={jobNotes}
        onUpdateNote={updateJobNote}
        onOpenJob={openJob}
      />

      <FilingCabinet
        open={cabinetOpen}
        onToggle={() => setCabinetOpen((v) => !v)}
        initialDrawer={activeCabinetDrawer}
      />

      <EmailDrawer job={selectedJob} open={drawerOpen} onClose={closeDrawer} />
      {drawerOpen && <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" onClick={closeDrawer} />}

      <CrmPanel
        open={crmOpen}
        onClose={() => setCrmOpen(false)}
      />

      <WeatherWindow
        open={weatherOpen}
        onClose={() => setWeatherOpen(false)}
      />

      <MediaCenter
        open={radioOpen}
        onClose={() => setRadioOpen(false)}
      />

      <DeskWidget
        open={deskOpen}
        onClose={() => setDeskOpen(false)}
      />

      <CalendarPanel
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
      />

      <AIAssistantModal 
        open={aiOpen}
        onClose={() => setAiOpen(false)}
      />

      <HelpOverlay
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
      />

      {/* ── Quick Access Toolbar ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-6 py-4"
        style={{ background: "rgba(5,5,10,0.85)", borderTop: "1px solid rgba(217,70,239,0.15)", backdropFilter: "blur(12px)" }}
      >
        {[
          { label: "BLUEPRINT", icon: "📋", action: () => setBoardOpen((v) => !v) },
          { label: "CASES", icon: "📌", action: () => setCorkOpen((v) => !v) },
          { label: "FILES", icon: "🗄️", action: () => setCabinetOpen(true) },
          { label: "MAIL", icon: "📧", action: () => setDeskOpen(true) },
          { label: "MEDIA", icon: "📻", action: () => setRadioOpen(true) },
          { label: "AI", icon: "✨", action: () => setAiOpen(true) },
        ].map((item: any) => (
          <button
            key={item.label}
            onClick={item.action}
            className="flex flex-col items-center gap-1 text-[#d946ef] hover:text-white transition-all group"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
            <span className="text-[8px] tracking-widest font-black" style={{ fontFamily: "'Oswald', sans-serif" }}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
