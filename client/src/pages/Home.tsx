/*
 * THE BOARD ROOM — Home Page
 * Noir comic detective room (Batman TAS style)
 *
 * Simplified approach:
 *   - Room background stays clean and intact
 *   - Only essential hotspots: corkboard, filing cabinet, blueprint board, window
 *   - All interactive panels (email, calendar, weather) accessible from bottom hint bar
 *   - No floating widgets on the scene
 */

import { useState, useEffect } from "react";
import { jobs, type JobPosting, type JobStatus, ALL_PLATFORMS, ALL_TAGS } from "@/lib/jobs-data";
import BlueprintBoard from "@/components/BlueprintBoard";
import CorkBoard from "@/components/CorkBoard";
import FilingCabinet from "@/components/FilingCabinet";
import WallClock from "@/components/WallClock";
import EmailDrawer from "@/components/EmailDrawer";
import CrmPanel from "@/components/CrmPanel";
import HelpOverlay from "@/components/HelpOverlay";
import WeatherWindow from "@/components/WeatherWindow";
import RetroRadio from "@/components/RetroRadio";
import DeskWidget from "@/components/DeskWidget";

// Asset URLs
const ROOM_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663452403431/KPXZebPSGaZWYwAsdwVntt/noir-room-bg-KiFVNE7F7Szawos5eGtkQj.webp";
const EMAIL_DESK = "https://d2xsxph8kpxj0f.cloudfront.net/310519663452403431/KPXZebPSGaZWYwAsdwVntt/email-desk-large-Spzo6fv8pmPePcsuqJsriS.webp";
const WORKDESK = "https://d2xsxph8kpxj0f.cloudfront.net/310519663452403431/KPXZebPSGaZWYwAsdwVntt/workdesk-nofloor-QeaHejybYahXSi5EwHuVpS.webp";

export type JobNote = {
  jobId: number;
  status: JobStatus;
  note: string;
};

const GLOW_STYLE: React.CSSProperties = {
  filter: "drop-shadow(0 0 14px rgba(217,70,239,0.75)) brightness(1.18)",
  cursor: "pointer",
  transition: "filter 0.2s ease",
};
const IDLE_STYLE: React.CSSProperties = {
  filter: "none",
  cursor: "pointer",
  transition: "filter 0.2s ease",
};

function CornerBrackets() {
  const s: React.CSSProperties = { position: "absolute", width: "12px", height: "12px", borderColor: "#d946ef" };
  return (
    <>
      <span style={{ ...s, top: 0, left: 0, borderTop: "2px solid", borderLeft: "2px solid" }} />
      <span style={{ ...s, top: 0, right: 0, borderTop: "2px solid", borderRight: "2px solid" }} />
      <span style={{ ...s, bottom: 0, left: 0, borderBottom: "2px solid", borderLeft: "2px solid" }} />
      <span style={{ ...s, bottom: 0, right: 0, borderBottom: "2px solid", borderRight: "2px solid" }} />
    </>
  );
}

function Tooltip({ label }: { label: string }) {
  return (
    <div
      className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded-sm z-20 pointer-events-none"
      style={{
        background: "rgba(10,20,40,0.96)",
        border: "1px solid rgba(217,70,239,0.5)",
        color: "#d946ef",
        fontFamily: "'Oswald', sans-serif",
        fontSize: "0.62rem",
        letterSpacing: "0.1em",
        boxShadow: "0 0 10px rgba(217,70,239,0.2)",
      }}
    >
      {label}
    </div>
  );
}

export default function Home() {
  const [boardOpen, setBoardOpen] = useState(false);
  const [corkOpen, setCorkOpen] = useState(false);
  const [cabinetOpen, setCabinetOpen] = useState(false);
  const [crmOpen, setCrmOpen] = useState(false);
  const [weatherOpen, setWeatherOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [radioOpen, setRadioOpen] = useState(false);
  const [deskOpen, setDeskOpen] = useState(false);

  const [hovered, setHovered] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [jobNotes, setJobNotes] = useState<JobNote[]>(() => {
    try { return JSON.parse(localStorage.getItem("boardroom-notes") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("boardroom-notes", JSON.stringify(jobNotes));
  }, [jobNotes]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?") {
        e.preventDefault();
        setHelpOpen((v) => !v);
      } else if (e.key === "Escape") {
        setHelpOpen(false);
        setBoardOpen(false);
        setCorkOpen(false);
        setCabinetOpen(false);
        setCrmOpen(false);
        setWeatherOpen(false);
        setRadioOpen(false);
      } else if (e.key.toLowerCase() === "b") {
        setBoardOpen((v) => !v);
      } else if (e.key.toLowerCase() === "c") {
        setCorkOpen((v) => !v);
      } else if (e.key.toLowerCase() === "f") {
        setCabinetOpen((v) => !v);
      } else if (e.key.toLowerCase() === "e") {
        setDeskOpen((v) => !v);
      } else if (e.key.toLowerCase() === "l") {
        setCrmOpen((v) => !v);
      } else if (e.key.toLowerCase() === "w") {
        setWeatherOpen((v) => !v);
      } else if (e.key.toLowerCase() === "r") {
        setRadioOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openJob = (job: JobPosting) => { setSelectedJob(job); setDrawerOpen(true); };
  const closeDrawer = () => { setDrawerOpen(false); setTimeout(() => setSelectedJob(null), 300); };

  const updateJobNote = (jobId: number, status: JobStatus, note: string) => {
    setJobNotes((prev) => {
      const existing = prev.find((n) => n.jobId === jobId);
      if (existing) return prev.map((n) => n.jobId === jobId ? { ...n, status, note } : n);
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

  const h = (id: string) => setHovered(id);
  const uh = () => setHovered(null);
  const isH = (id: string) => hovered === id;

  return (
    <div className="relative w-full h-screen overflow-hidden select-none">

      {/* ── Room background ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${ROOM_BG})` }}
      />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.45) 100%)" }}
      />


      {/* ── Title ── */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
        <h1 className="text-5xl md:text-6xl" style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900, color: "#ffffff", textShadow: "0 0 30px rgba(217,70,239,0.8), 0 0 60px rgba(217,70,239,0.4)", letterSpacing: "0.12em" }}>
          ARKHAM
        </h1>
      </div>

      {/* ── Wall Clock ── */}
      <div className="absolute top-3 right-5 z-10">
        <WallClock />
      </div>

      {/* ══════════════════════════════════════════
          ROOM HOTSPOT 1: CORKBOARD (back-left wall)
          ~14%–38% left, ~15%–55% top
      ══════════════════════════════════════════ */}
      <div
        className="absolute z-10"
        style={{ left: "14%", top: "15%", width: "24%", height: "40%", ...(isH("corkboard") ? GLOW_STYLE : IDLE_STYLE) }}
        onMouseEnter={() => h("corkboard")} onMouseLeave={uh}
        onClick={() => setCorkOpen((v) => !v)}
      >
        {isH("corkboard") && <CornerBrackets />}
      </div>

      {/* ══════════════════════════════════════════
          ROOM HOTSPOT 2: FILING CABINET (far left)
          ~0%–12% left, ~42%–95% top
      ══════════════════════════════════════════ */}
      <div
        className="absolute z-10"
        style={{ left: "0%", top: "42%", width: "13%", height: "52%", ...(isH("cabinet") ? GLOW_STYLE : IDLE_STYLE) }}
        onMouseEnter={() => h("cabinet")} onMouseLeave={uh}
        onClick={() => setCabinetOpen((v) => !v)}
      >
        {isH("cabinet") && <CornerBrackets />}
      </div>

      {/* ══════════════════════════════════════════
          ROOM HOTSPOT 3: BLUEPRINT BOARD (center wall gap)
          ~48%–58% left, ~28%–72% top
      ══════════════════════════════════════════ */}
      <div
        className="absolute z-10"
        style={{ left: "48%", top: "28%", width: "10%", height: "44%", ...(isH("blueprint") ? GLOW_STYLE : IDLE_STYLE) }}
        onMouseEnter={() => h("blueprint")} onMouseLeave={uh}
        onClick={() => setBoardOpen((v) => !v)}
      >
        {isH("blueprint") && <CornerBrackets />}
      </div>

      {/* ══════════════════════════════════════════
          ROOM HOTSPOT 4: WINDOW (barred window with weather)
          ~57%–76% left, ~22%–55% top
      ══════════════════════════════════════════ */}
      <div
        className="absolute z-10 overflow-hidden rounded-sm"
        style={{
          left: "57%", top: "22%",
          width: "19%", height: "33%",
          ...(isH("window") ? { ...GLOW_STYLE, border: "3px solid rgba(200,216,64,0.4)" } : { ...IDLE_STYLE, border: "3px solid transparent" }),
        }}
        onMouseEnter={() => h("window")} onMouseLeave={uh}
        onClick={() => setWeatherOpen(true)}
      >
        {isH("window") && <CornerBrackets />}
      </div>

      {/* ══════════════════════════════════════════
          WORKDESK IMAGE — below the window, offset left from email cabinet
          Positioned at ~52-82% left, ~55-95% top
      ══════════════════════════════════════════ */}
      <div
        className="absolute z-3 pointer-events-none overflow-hidden"
        style={{
          left: "46%", bottom: "-8%",
          width: "52%", height: "50%",
        }}
      >
        <img
          src={WORKDESK}
          alt="Workdesk"
          className="w-full h-full object-contain drop-shadow-2xl"
          style={{
            filter: "brightness(0.85) contrast(1.1)",
          }}
        />
      </div>

      {/* ══════════════════════════════════════════
          ROOM HOTSPOT 5: WORKDESK (clickable area over the desk)
          Opens compose email widget
          Aligned with the desk image
      ══════════════════════════════════════════ */}
      <div
        className="absolute z-10"
        style={{
          left: "48%", top: "45%",
          width: "48%", height: "40%",
          ...(isH("desk") ? GLOW_STYLE : IDLE_STYLE),
        }}
        onMouseEnter={() => h("desk")} onMouseLeave={uh}
        onClick={() => setDeskOpen(true)}
      >
        {isH("desk") && <CornerBrackets />}
      </div>

      {/* ══════════════════════════════════════════
          ROOM HOTSPOT 6: RETRO RADIO (between filing cabinet and blueprint)
          Opens music player with 2000s skater music
          ~35-50% left, ~65-85% top
      ══════════════════════════════════════════ */}
      <div
        className="absolute z-10"
        style={{
          left: "35%", top: "75%",
          width: "15%", height: "20%",
          ...(isH("radio") ? GLOW_STYLE : IDLE_STYLE),
        }}
        onMouseEnter={() => h("radio")} onMouseLeave={uh}
        onClick={() => setRadioOpen(true)}
      >
        {isH("radio") && <CornerBrackets />}
      </div>

      {/* ══════════════════════════════════════════
          ROOM HOTSPOT 6: 4-DOOR CABINET (right wall, invisible)
          Opens CRM Panel
          ~76-100% left, ~35-85% top
      ══════════════════════════════════════════ */}
      <div
        className="absolute z-10"
        style={{
          left: "76%", top: "35%",
          width: "24%", height: "50%",
          ...(isH("storage-cabinet") ? GLOW_STYLE : IDLE_STYLE),
        }}
        onMouseEnter={() => h("storage-cabinet")} onMouseLeave={uh}
        onClick={() => setCrmOpen((v) => !v)}
      >
        {isH("storage-cabinet") && <CornerBrackets />}
      </div>

      {/* ══════════════════════════════════════════
          PANELS
      ══════════════════════════════════════════ */}
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
      />

      <EmailDrawer job={selectedJob} open={drawerOpen} onClose={closeDrawer} />
      {drawerOpen && <div className="fixed inset-0 z-30 bg-black/30" onClick={closeDrawer} />}

      <CrmPanel
        open={crmOpen}
        onClose={() => setCrmOpen(false)}
      />

      <WeatherWindow
        open={weatherOpen}
        onClose={() => setWeatherOpen(false)}
      />

      <RetroRadio
        open={radioOpen}
        onClose={() => setRadioOpen(false)}
      />

      <DeskWidget
        open={deskOpen}
        onClose={() => setDeskOpen(false)}
      />

      <HelpOverlay
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
      />

      {/* ══════════════════════════════════════════
          BOTTOM HINT BAR — All controls here
      ══════════════════════════════════════════ */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center gap-5 py-1.5 px-4"
        style={{ background: "rgba(10,15,24,0.82)", borderTop: "1px solid rgba(217,70,239,0.2)" }}
      >
        {[

          { label: "BLUEPRINT BOARD", icon: "📋", action: () => setBoardOpen((v) => !v), hideLabel: true },
          { label: "CASE BOARD", icon: "📌", action: () => setCorkOpen((v) => !v), hideLabel: true },
          { label: "FILING CABINET", icon: "🗄️", action: () => setCabinetOpen((v) => !v), hideLabel: true },
          { label: "EMAIL INBOX", icon: "📧", action: () => setDeskOpen(true), hideLabel: false },
          { label: "CRM", icon: "📊", action: () => setCrmOpen(true), hideLabel: false },
          { label: "WEATHER", icon: "🌧️", action: () => setWeatherOpen(true), hideLabel: false },
        ].map((item: any) => (
          <button
            key={item.label}
            onClick={item.action}
            className="flex items-center gap-1 text-xs tracking-widest transition-all hover:opacity-80"
            style={{ fontFamily: "'Oswald', sans-serif", color: "#d946ef", letterSpacing: "0.07em", fontSize: "0.6rem" }}
          >
            <span>{item.icon}</span>
            {!item.hideLabel && item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
