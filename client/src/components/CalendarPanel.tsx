/*
 * CalendarPanel — deadline tracker with monthly calendar view
 * Noir detective room style — clipboard calendar aesthetic
 * Features: monthly grid, add/remove deadlines, today highlight, overdue warnings
 */
import { useState, useEffect } from "react";
import { X, Plus, Trash2, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";

interface Deadline {
  id: string;
  date: string; // YYYY-MM-DD
  label: string;
  type: "followup" | "deadline" | "interview" | "other";
  jobId?: number;
}

const TYPE_COLORS: Record<Deadline["type"], { color: string; bg: string; label: string }> = {
  followup: { color: "#e8a020", bg: "#3a2a0a", label: "FOLLOW-UP" },
  deadline: { color: "#c03020", bg: "#3a0a0a", label: "DEADLINE" },
  interview: { color: "#4080ff", bg: "#0a1a3a", label: "INTERVIEW" },
  other: { color: "#c8d840", bg: "#2a3010", label: "OTHER" },
};

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];

interface CalendarPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function CalendarPanel({ open, onClose }: CalendarPanelProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [deadlines, setDeadlines] = useState<Deadline[]>(() => {
    try { return JSON.parse(localStorage.getItem("boardroom-deadlines") || "[]"); } catch { return []; }
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState<Deadline["type"]>("followup");
  const [view, setView] = useState<"calendar" | "list">("calendar");

  useEffect(() => {
    localStorage.setItem("boardroom-deadlines", JSON.stringify(deadlines));
  }, [deadlines]);

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  const dateStr = (day: number) =>
    `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const getDeadlinesForDate = (day: number) =>
    deadlines.filter((d) => d.date === dateStr(day));

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      viewMonth === today.getMonth() &&
      viewYear === today.getFullYear()
    );
  };

  const isPast = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(23, 59, 59);
    return d < today;
  };

  const addDeadline = () => {
    if (!selectedDate || !newLabel) return;
    setDeadlines((prev) => [
      ...prev,
      { id: Date.now().toString(), date: selectedDate, label: newLabel, type: newType },
    ]);
    setNewLabel("");
  };

  const removeDeadline = (id: string) => {
    setDeadlines((prev) => prev.filter((d) => d.id !== id));
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const upcomingDeadlines = deadlines
    .filter((d) => new Date(d.date) >= new Date(today.toDateString()))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 10);

  const overdueDeadlines = deadlines.filter((d) => {
    const dd = new Date(d.date);
    dd.setHours(23, 59, 59);
    return dd < today;
  });

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.8)" }}
      onClick={onClose}
    >
      <div
        className="relative flex flex-col rounded-sm overflow-hidden"
        style={{
          width: "min(720px, 96vw)",
          maxHeight: "92vh",
          background: "#0d1018",
          border: "2px solid rgba(200,216,64,0.4)",
          boxShadow: "0 0 60px rgba(0,0,0,0.9), 0 0 20px rgba(200,216,64,0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-5 py-3 shrink-0"
          style={{ background: "#1a2030", borderBottom: "2px solid rgba(200,216,64,0.3)" }}
        >
          <div className="flex items-center gap-3">
            <span style={{ fontSize: "1.2rem" }}>📅</span>
            <div>
              <h2
                className="text-base fluorescent-text tracking-widest"
                style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700 }}
              >
                CASE CALENDAR
              </h2>
              <p className="text-xs" style={{ color: "#8a9420", fontFamily: "'DM Sans', sans-serif" }}>
                {deadlines.length} events · {overdueDeadlines.length > 0 && (
                  <span style={{ color: "#c03020" }}>{overdueDeadlines.length} overdue</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView(view === "calendar" ? "list" : "calendar")}
              className="text-xs px-2 py-1 rounded-sm"
              style={{
                fontFamily: "'Oswald', sans-serif",
                letterSpacing: "0.06em",
                color: "#c8d840",
                background: "rgba(200,216,64,0.08)",
                border: "1px solid rgba(200,216,64,0.3)",
                fontSize: "0.6rem",
              }}
            >
              {view === "calendar" ? "LIST VIEW" : "CALENDAR"}
            </button>
            <button onClick={onClose} style={{ color: "#c8d840" }}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* ── Left: Calendar or List ── */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {view === "calendar" ? (
              <>
                {/* Month nav */}
                <div
                  className="flex items-center justify-between px-5 py-2 shrink-0"
                  style={{ borderBottom: "1px solid rgba(200,216,64,0.15)" }}
                >
                  <button onClick={prevMonth} style={{ color: "#c8d840" }}>
                    <ChevronLeft size={16} />
                  </button>
                  <h3
                    className="text-sm tracking-widest"
                    style={{ fontFamily: "'Oswald', sans-serif", color: "#c8d840", letterSpacing: "0.15em" }}
                  >
                    {MONTHS[viewMonth]} {viewYear}
                  </h3>
                  <button onClick={nextMonth} style={{ color: "#c8d840" }}>
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 px-3 pt-2 shrink-0">
                  {DAYS.map((d) => (
                    <div
                      key={d}
                      className="text-center py-1 text-xs"
                      style={{ fontFamily: "'Oswald', sans-serif", color: "#8a9420", fontSize: "0.6rem", letterSpacing: "0.08em" }}
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="flex-1 overflow-y-auto px-3 pb-3">
                  <div className="grid grid-cols-7 gap-0.5">
                    {cells.map((day, i) => {
                      if (!day) return <div key={i} className="h-14" />;
                      const ds = dateStr(day);
                      const dayDeadlines = getDeadlinesForDate(day);
                      const selected = selectedDate === ds;
                      const todayCell = isToday(day);
                      const past = isPast(day);

                      return (
                        <div
                          key={i}
                          onClick={() => setSelectedDate(selected ? null : ds)}
                          className="h-14 p-1 rounded-sm cursor-pointer transition-all flex flex-col"
                          style={{
                            background: selected
                              ? "rgba(200,216,64,0.15)"
                              : todayCell
                              ? "rgba(200,216,64,0.08)"
                              : "rgba(26,32,48,0.6)",
                            border: selected
                              ? "1px solid rgba(200,216,64,0.6)"
                              : todayCell
                              ? "1px solid rgba(200,216,64,0.3)"
                              : "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          <span
                            className="text-xs"
                            style={{
                              fontFamily: "'Oswald', sans-serif",
                              color: todayCell ? "#c8d840" : past ? "#555" : "#a8a090",
                              fontWeight: todayCell ? 700 : 400,
                              fontSize: "0.7rem",
                            }}
                          >
                            {day}
                          </span>
                          <div className="flex flex-wrap gap-0.5 mt-0.5">
                            {dayDeadlines.slice(0, 2).map((dd) => (
                              <div
                                key={dd.id}
                                className="w-2 h-2 rounded-full"
                                style={{ background: TYPE_COLORS[dd.type].color }}
                                title={dd.label}
                              />
                            ))}
                            {dayDeadlines.length > 2 && (
                              <span className="text-xs" style={{ color: "#888", fontSize: "0.55rem" }}>
                                +{dayDeadlines.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Selected date events + add form */}
                {selectedDate && (
                  <div
                    className="shrink-0 px-4 py-3"
                    style={{ borderTop: "1px solid rgba(200,216,64,0.2)", background: "#111820" }}
                  >
                    <p
                      className="text-xs mb-2 tracking-widest"
                      style={{ fontFamily: "'Oswald', sans-serif", color: "#c8d840", letterSpacing: "0.1em" }}
                    >
                      {selectedDate}
                    </p>
                    {/* Existing events for selected date */}
                    {deadlines.filter((d) => d.date === selectedDate).map((d) => (
                      <div key={d.id} className="flex items-center justify-between mb-1">
                        <span
                          className="text-xs px-1.5 py-0.5 rounded-sm mr-2"
                          style={{
                            fontFamily: "'Oswald', sans-serif",
                            background: TYPE_COLORS[d.type].bg,
                            color: TYPE_COLORS[d.type].color,
                            border: `1px solid ${TYPE_COLORS[d.type].color}`,
                            fontSize: "0.55rem",
                            letterSpacing: "0.06em",
                          }}
                        >
                          {TYPE_COLORS[d.type].label}
                        </span>
                        <span className="flex-1 text-xs truncate" style={{ fontFamily: "'DM Sans', sans-serif", color: "#c8c0a8" }}>
                          {d.label}
                        </span>
                        <button onClick={() => removeDeadline(d.id)}>
                          <Trash2 size={11} style={{ color: "#c03020" }} />
                        </button>
                      </div>
                    ))}
                    {/* Add new */}
                    <div className="flex gap-2 mt-2">
                      <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value as Deadline["type"])}
                        className="text-xs px-1 py-1 rounded-sm"
                        style={{ background: "#1a2030", border: "1px solid rgba(200,216,64,0.3)", color: "#c8d840", fontFamily: "'Oswald', sans-serif", fontSize: "0.6rem" }}
                      >
                        <option value="followup">FOLLOW-UP</option>
                        <option value="deadline">DEADLINE</option>
                        <option value="interview">INTERVIEW</option>
                        <option value="other">OTHER</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Event label..."
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addDeadline()}
                        className="flex-1 text-xs px-2 py-1 rounded-sm"
                        style={{ background: "#1a2030", border: "1px solid rgba(200,216,64,0.3)", color: "#e8e0c8", fontFamily: "'DM Sans', sans-serif" }}
                      />
                      <button
                        onClick={addDeadline}
                        className="px-2 py-1 rounded-sm"
                        style={{ background: "rgba(200,216,64,0.15)", border: "1px solid rgba(200,216,64,0.4)", color: "#c8d840" }}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* List view */
              <div className="flex-1 overflow-y-auto p-4">
                {overdueDeadlines.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle size={13} style={{ color: "#c03020" }} />
                      <span className="text-xs tracking-widest" style={{ fontFamily: "'Oswald', sans-serif", color: "#c03020", letterSpacing: "0.1em" }}>
                        OVERDUE
                      </span>
                    </div>
                    {overdueDeadlines.map((d) => (
                      <div key={d.id} className="flex items-center gap-2 mb-1.5 p-2 rounded-sm" style={{ background: "rgba(192,48,32,0.1)", border: "1px solid rgba(192,48,32,0.3)" }}>
                        <span className="text-xs" style={{ fontFamily: "'Oswald', sans-serif", color: "#c03020", minWidth: "80px", fontSize: "0.6rem" }}>{d.date}</span>
                        <span className="text-xs px-1 py-0.5 rounded-sm" style={{ background: TYPE_COLORS[d.type].bg, color: TYPE_COLORS[d.type].color, border: `1px solid ${TYPE_COLORS[d.type].color}`, fontSize: "0.55rem", fontFamily: "'Oswald', sans-serif" }}>{TYPE_COLORS[d.type].label}</span>
                        <span className="flex-1 text-xs truncate" style={{ fontFamily: "'DM Sans', sans-serif", color: "#c8c0a8" }}>{d.label}</span>
                        <button onClick={() => removeDeadline(d.id)}><Trash2 size={11} style={{ color: "#c03020" }} /></button>
                      </div>
                    ))}
                  </div>
                )}
                <div>
                  <p className="text-xs tracking-widest mb-2" style={{ fontFamily: "'Oswald', sans-serif", color: "#8a9420", letterSpacing: "0.1em" }}>UPCOMING</p>
                  {upcomingDeadlines.length === 0 ? (
                    <p className="text-xs italic" style={{ fontFamily: "'Special Elite', cursive", color: "#666" }}>No upcoming events. Click a date on the calendar to add one.</p>
                  ) : (
                    upcomingDeadlines.map((d) => (
                      <div key={d.id} className="flex items-center gap-2 mb-1.5 p-2 rounded-sm" style={{ background: "rgba(26,32,48,0.8)", border: "1px solid rgba(200,216,64,0.1)" }}>
                        <span className="text-xs" style={{ fontFamily: "'Oswald', sans-serif", color: "#8a9420", minWidth: "80px", fontSize: "0.6rem" }}>{d.date}</span>
                        <span className="text-xs px-1 py-0.5 rounded-sm" style={{ background: TYPE_COLORS[d.type].bg, color: TYPE_COLORS[d.type].color, border: `1px solid ${TYPE_COLORS[d.type].color}`, fontSize: "0.55rem", fontFamily: "'Oswald', sans-serif" }}>{TYPE_COLORS[d.type].label}</span>
                        <span className="flex-1 text-xs truncate" style={{ fontFamily: "'DM Sans', sans-serif", color: "#c8c0a8" }}>{d.label}</span>
                        <button onClick={() => removeDeadline(d.id)}><Trash2 size={11} style={{ color: "#c03020" }} /></button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Right sidebar: type legend ── */}
          <div
            className="w-36 shrink-0 flex flex-col p-3 gap-2"
            style={{ borderLeft: "1px solid rgba(200,216,64,0.15)", background: "#0a0f18" }}
          >
            <p className="text-xs tracking-widest mb-1" style={{ fontFamily: "'Oswald', sans-serif", color: "#8a9420", fontSize: "0.55rem", letterSpacing: "0.1em" }}>EVENT TYPES</p>
            {Object.entries(TYPE_COLORS).map(([type, c]) => (
              <div key={type} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                <span className="text-xs" style={{ fontFamily: "'Oswald', sans-serif", color: c.color, fontSize: "0.6rem", letterSpacing: "0.06em" }}>{c.label}</span>
              </div>
            ))}
            <div className="mt-auto pt-3" style={{ borderTop: "1px solid rgba(200,216,64,0.1)" }}>
              <p className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif", color: "#666", fontSize: "0.6rem" }}>
                Click any date to add an event
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
