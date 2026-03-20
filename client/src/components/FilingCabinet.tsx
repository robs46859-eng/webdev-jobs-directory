/*
 * FilingCabinet — 3-drawer cabinet for personal info
 * Drawer 1: Portfolio Links
 * Drawer 2: Bio / About Me
 * Drawer 3: Rate Card
 * Each drawer slides open with noir animation
 */
import { useState, useEffect } from "react";
import { X, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

type Drawer = "portfolio" | "bio" | "rates" | null;

interface PortfolioLink { id: string; label: string; url: string; }
interface RateItem { id: string; service: string; rate: string; notes: string; }

const defaultBio = "I'm a freelance web developer specializing in WordPress, React, and custom HTML/CSS builds. I deliver clean, fast, and responsive websites on time and within budget.";

export default function FilingCabinet({ open, onToggle, initialDrawer = null }: { open: boolean; onToggle: () => void; initialDrawer?: Drawer }) {
  const [activeDrawer, setActiveDrawer] = useState<Drawer>(initialDrawer);

  useEffect(() => {
    if (open && initialDrawer) {
      setActiveDrawer(initialDrawer);
    }
  }, [open, initialDrawer]);

  // Portfolio links
  const [links, setLinks] = useState<PortfolioLink[]>(() => {
    try { return JSON.parse(localStorage.getItem("boardroom-portfolio") || "[]"); } catch { return []; }
  });
  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");

  // Bio
  const [bio, setBio] = useState(() => localStorage.getItem("boardroom-bio") || defaultBio);

  // Rates
  const [rates, setRates] = useState<RateItem[]>(() => {
    try { return JSON.parse(localStorage.getItem("boardroom-rates") || "[]"); } catch { return []; }
  });
  const [newService, setNewService] = useState("");
  const [newRate, setNewRate] = useState("");
  const [newRateNotes, setNewRateNotes] = useState("");

  // Persist
  useEffect(() => { localStorage.setItem("boardroom-portfolio", JSON.stringify(links)); }, [links]);
  useEffect(() => { localStorage.setItem("boardroom-bio", bio); }, [bio]);
  useEffect(() => { localStorage.setItem("boardroom-rates", JSON.stringify(rates)); }, [rates]);

  const addLink = () => {
    if (!newLabel || !newUrl) return;
    setLinks((prev) => [...prev, { id: Date.now().toString(), label: newLabel, url: newUrl }]);
    setNewLabel(""); setNewUrl("");
  };

  const addRate = () => {
    if (!newService || !newRate) return;
    setRates((prev) => [...prev, { id: Date.now().toString(), service: newService, rate: newRate, notes: newRateNotes }]);
    setNewService(""); setNewRate(""); setNewRateNotes("");
  };

  const toggleDrawer = (d: Drawer) => setActiveDrawer((prev) => prev === d ? null : d);

  const DRAWERS = [
    { id: "portfolio" as Drawer, label: "PORTFOLIO LINKS", number: "01", color: "#40c840" },
    { id: "bio" as Drawer, label: "BIO / ABOUT ME", number: "02", color: "#e8a020" },
    { id: "rates" as Drawer, label: "RATE CARD", number: "03", color: "#4080ff" },
  ];

  return (
    <>
      {/* Cabinet toggle — bottom left of screen */}
      <button
        onClick={onToggle}
        className="absolute z-20 transition-all duration-300"
        style={{
          bottom: "48px",
          left: open ? "calc(280px - 16px)" : "8px",
          background: "#4a5030",
          border: "2px solid #c8d840",
          color: "#c8d840",
          padding: "6px 10px",
          borderRadius: "2px",
          boxShadow: "0 0 10px rgba(200,216,64,0.25)",
          fontFamily: "'Oswald', sans-serif",
          fontSize: "0.6rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase", opacity: '0',
        }}
        title={open ? "Close Filing Cabinet" : "Open Filing Cabinet"}
      >
        {open ? "◀ CLOSE" : "▶ FILES"}
      </button>

      {/* Cabinet panel */}
      <div
        className="absolute bottom-10 left-0 z-20 flex flex-col transition-transform duration-500 ease-in-out"
        style={{
          width: "280px",
          maxHeight: "calc(100vh - 80px)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          background: "linear-gradient(180deg, #6a7050 0%, #5a6040 40%, #4a5030 100%)",
          border: "3px solid #3a4020",
          boxShadow: open ? "8px 0 30px rgba(0,0,0,0.6)" : "none",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        {/* Cabinet top */}
        <div
          className="flex items-center justify-between px-4 py-3 shrink-0"
          style={{ background: "#3a4020", borderBottom: "2px solid #c8d840" }}
        >
          <h2
            className="text-base tracking-widest fluorescent-text"
            style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700 }}
          >
            FILING CABINET
          </h2>
          <button onClick={onToggle} style={{ color: "#c8d840" }}>
            <X size={16} />
          </button>
        </div>

        {/* Drawers */}
        <div className="flex-1 overflow-y-auto">
          {DRAWERS.map((drawer) => (
            <div key={drawer.id}>
              {/* Drawer face */}
              <button
                onClick={() => toggleDrawer(drawer.id)}
                className="w-full flex items-center justify-between px-4 py-3 cabinet-drawer transition-all"
                style={{
                  borderBottom: "2px solid #3a4020",
                  background: activeDrawer === drawer.id
                    ? "linear-gradient(180deg, #7a8060 0%, #6a7050 100%)"
                    : "linear-gradient(180deg, #6a7050 0%, #5a6040 100%)",
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Drawer number label */}
                  <span
                    className="text-xs w-6 h-6 flex items-center justify-center rounded-sm"
                    style={{
                      background: "#3a4020",
                      color: drawer.color,
                      border: `1px solid ${drawer.color}`,
                      fontFamily: "'Oswald', sans-serif",
                      fontSize: "0.6rem",
                    }}
                  >
                    {drawer.number}
                  </span>
                  <span
                    className="text-xs tracking-widest"
                    style={{ fontFamily: "'Oswald', sans-serif", color: "#c8d840", letterSpacing: "0.1em" }}
                  >
                    {drawer.label}
                  </span>
                </div>
                {/* Handle */}
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-3 rounded-sm"
                    style={{ background: "#8a9060", border: "1px solid #3a4020", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)" }}
                  />
                  {activeDrawer === drawer.id ? <ChevronUp size={12} style={{ color: "#c8d840" }} /> : <ChevronDown size={12} style={{ color: "#c8d840" }} />}
                </div>
              </button>

              {/* Drawer content */}
              {activeDrawer === drawer.id && (
                <div
                  className="px-4 py-3"
                  style={{ background: "rgba(20,25,10,0.9)", borderBottom: "2px solid #3a4020" }}
                >
                  {/* Portfolio Links */}
                  {drawer.id === "portfolio" && (
                    <div className="flex flex-col gap-2">
                      {links.length === 0 && (
                        <p className="text-xs italic" style={{ fontFamily: "'Special Elite', cursive", color: "#888" }}>
                          No portfolio links yet. Add some below.
                        </p>
                      )}
                      {links.map((link) => (
                        <div key={link.id} className="flex items-center gap-2">
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-xs truncate hover:underline"
                            style={{ fontFamily: "'DM Sans', sans-serif", color: "#40c840" }}
                          >
                            {link.label}
                          </a>
                          <button onClick={() => setLinks((prev) => prev.filter((l) => l.id !== link.id))}>
                            <Trash2 size={11} style={{ color: "#c03020" }} />
                          </button>
                        </div>
                      ))}
                      <div className="flex flex-col gap-1 mt-2 pt-2" style={{ borderTop: "1px solid #3a4020" }}>
                        <input
                          type="text"
                          placeholder="Label (e.g. Portfolio Site)"
                          value={newLabel}
                          onChange={(e) => setNewLabel(e.target.value)}
                          className="text-xs px-2 py-1 rounded-sm w-full"
                          style={{ background: "#1a2010", border: "1px solid #3a4020", color: "#c8d840", fontFamily: "'DM Sans', sans-serif" }}
                        />
                        <input
                          type="text"
                          placeholder="URL"
                          value={newUrl}
                          onChange={(e) => setNewUrl(e.target.value)}
                          className="text-xs px-2 py-1 rounded-sm w-full"
                          style={{ background: "#1a2010", border: "1px solid #3a4020", color: "#c8d840", fontFamily: "'DM Sans', sans-serif" }}
                        />
                        <button
                          onClick={addLink}
                          className="flex items-center justify-center gap-1 text-xs py-1 rounded-sm btn-noir"
                        >
                          <Plus size={11} /> ADD LINK
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Bio */}
                  {drawer.id === "bio" && (
                    <div className="flex flex-col gap-2">
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={6}
                        className="text-xs p-2 rounded-sm w-full resize-none"
                        style={{
                          fontFamily: "'Special Elite', cursive",
                          background: "#1a2010",
                          border: "1px solid #3a4020",
                          color: "#c8d840",
                          lineHeight: "1.6",
                        }}
                      />
                      <p className="text-xs" style={{ color: "#888", fontFamily: "'DM Sans', sans-serif" }}>
                        Auto-saved. Use this in your email templates.
                      </p>
                    </div>
                  )}

                  {/* Rate Card */}
                  {drawer.id === "rates" && (
                    <div className="flex flex-col gap-2">
                      {rates.length === 0 && (
                        <p className="text-xs italic" style={{ fontFamily: "'Special Elite', cursive", color: "#888" }}>
                          No rates added yet.
                        </p>
                      )}
                      {rates.map((r) => (
                        <div
                          key={r.id}
                          className="flex items-start justify-between gap-2 p-2 rounded-sm"
                          style={{ background: "#1a2010", border: "1px solid #3a4020" }}
                        >
                          <div>
                            <p className="text-xs font-medium" style={{ fontFamily: "'Oswald', sans-serif", color: "#c8d840", letterSpacing: "0.06em" }}>
                              {r.service}
                            </p>
                            <p className="text-xs" style={{ fontFamily: "'Special Elite', cursive", color: "#40c840" }}>
                              {r.rate}
                            </p>
                            {r.notes && (
                              <p className="text-xs italic" style={{ fontFamily: "'Special Elite', cursive", color: "#888" }}>
                                {r.notes}
                              </p>
                            )}
                          </div>
                          <button onClick={() => setRates((prev) => prev.filter((x) => x.id !== r.id))}>
                            <Trash2 size={11} style={{ color: "#c03020" }} />
                          </button>
                        </div>
                      ))}
                      <div className="flex flex-col gap-1 mt-2 pt-2" style={{ borderTop: "1px solid #3a4020" }}>
                        <input
                          type="text"
                          placeholder="Service (e.g. WordPress Site)"
                          value={newService}
                          onChange={(e) => setNewService(e.target.value)}
                          className="text-xs px-2 py-1 rounded-sm w-full"
                          style={{ background: "#1a2010", border: "1px solid #3a4020", color: "#c8d840", fontFamily: "'DM Sans', sans-serif" }}
                        />
                        <input
                          type="text"
                          placeholder="Rate (e.g. $500–$1,500)"
                          value={newRate}
                          onChange={(e) => setNewRate(e.target.value)}
                          className="text-xs px-2 py-1 rounded-sm w-full"
                          style={{ background: "#1a2010", border: "1px solid #3a4020", color: "#c8d840", fontFamily: "'DM Sans', sans-serif" }}
                        />
                        <input
                          type="text"
                          placeholder="Notes (optional)"
                          value={newRateNotes}
                          onChange={(e) => setNewRateNotes(e.target.value)}
                          className="text-xs px-2 py-1 rounded-sm w-full"
                          style={{ background: "#1a2010", border: "1px solid #3a4020", color: "#c8d840", fontFamily: "'DM Sans', sans-serif" }}
                        />
                        <button
                          onClick={addRate}
                          className="flex items-center justify-center gap-1 text-xs py-1 rounded-sm btn-noir"
                        >
                          <Plus size={11} /> ADD RATE
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
