/*
 * CorkBoard — sticky note job tracker
 * Slides in from the left side of the screen
 * Shows jobs with status (Applied, Followed Up, Won) and personal notes
 */
import { useState } from "react";
import { X, Pin, ChevronLeft, ChevronRight } from "lucide-react";
import type { JobPosting, JobNote, JobStatus } from "@/lib/jobs-data";

const STATUSES: { value: JobStatus; label: string; color: string; bg: string }[] = [
  { value: "none", label: "UNTOUCHED", color: "#888", bg: "#2a2a2a" },
  { value: "applied", label: "APPLIED", color: "#40c840", bg: "#1a3a1a" },
  { value: "followed", label: "FOLLOWED UP", color: "#e8a020", bg: "#3a2a0a" },
  { value: "won", label: "WON", color: "#4080ff", bg: "#1a1a3a" },
];

const STICKY_COLORS = ["#e8d840", "#d8f040", "#f0e040", "#e0d030"];

interface CorkBoardProps {
  open: boolean;
  onToggle: () => void;
  jobs: JobPosting[];
  jobNotes: JobNote[];
  onUpdateNote: (jobId: number, status: JobStatus, note: string) => void;
  onOpenJob: (job: JobPosting) => void;
}

export default function CorkBoard({ open, onToggle, jobs, jobNotes, onUpdateNote, onOpenJob }: CorkBoardProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNote, setEditNote] = useState("");
  const [editStatus, setEditStatus] = useState<JobStatus>("none");
  const [filterStatus, setFilterStatus] = useState<JobStatus | "all">("all");

  const getNoteForJob = (jobId: number): JobNote | undefined =>
    jobNotes.find((n) => n.jobId === jobId);

  const startEdit = (job: JobPosting) => {
    const existing = getNoteForJob(job.id);
    setEditingId(job.id);
    setEditNote(existing?.note ?? "");
    setEditStatus(existing?.status ?? "none");
  };

  const saveEdit = (jobId: number) => {
    onUpdateNote(jobId, editStatus, editNote);
    setEditingId(null);
  };

  const trackedJobs = jobs.filter((j) => {
    const n = getNoteForJob(j.id);
    if (filterStatus === "all") return true;
    return (n?.status ?? "none") === filterStatus;
  });

  const stats = {
    applied: jobNotes.filter((n) => n.status === "applied").length,
    followed: jobNotes.filter((n) => n.status === "followed").length,
    won: jobNotes.filter((n) => n.status === "won").length,
  };

  return (
    <>
      {/* Toggle handle — positioned on right edge of corkboard area */}
      <button
        onClick={onToggle}
        className="absolute z-20 flex items-center gap-1 transition-all duration-300"
        style={{
          top: "30%",
          right: open ? "calc(100% - 340px - 16px)" : "calc(100% - 16px)",
          transform: "translateY(-50%)",
          background: "#5a3a08",
          border: "2px solid #e8a020",
          color: "#e8a020",
          padding: "8px 4px",
          borderRadius: "2px",
          boxShadow: "0 0 12px rgba(232,160,32,0.3)",
          fontFamily: "'Oswald', sans-serif",
          fontSize: "0.6rem",
          letterSpacing: "0.1em",
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          zIndex: 25, opacity: '0',
        }}
        title={open ? "Close Case Board" : "Open Case Board"}
      >
        {open ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        <span style={{ marginTop: "4px" }}>CASE BOARD</span>
      </button>

      {/* Panel — slides in from the right */}
      <div
        className="absolute top-0 right-0 h-full z-20 flex flex-col transition-transform duration-500 ease-in-out"
        style={{
          width: "340px",
          transform: open ? "translateX(0)" : "translateX(100%)",
          background: "#8B6914",
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23704f0a' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          borderLeft: "4px solid #5a3a08",
          boxShadow: open ? "-8px 0 40px rgba(0,0,0,0.7)" : "none",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 shrink-0"
          style={{ background: "rgba(50,25,0,0.85)", borderBottom: "2px solid rgba(232,160,32,0.4)" }}
        >
          <div>
            <h2
              className="text-lg tracking-widest"
              style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: "#e8a020",
                textShadow: "0 0 8px rgba(232,160,32,0.5)" }}
            >
              CASE BOARD
            </h2>
            <p className="text-xs" style={{ color: "#a87010", fontFamily: "'DM Sans', sans-serif" }}>
              {stats.applied} applied · {stats.followed} followed · {stats.won} won
            </p>
          </div>
          <button onClick={onToggle} style={{ color: "#e8a020" }}>
            <X size={18} />
          </button>
        </div>

        {/* Status filter tabs */}
        <div
          className="flex gap-1 px-3 py-2 shrink-0 overflow-x-auto"
          style={{ background: "rgba(50,25,0,0.7)", borderBottom: "1px solid rgba(232,160,32,0.2)" }}
        >
          {[{ value: "all" as const, label: "ALL", color: "#e8a020" }, ...STATUSES].map((s) => (
            <button
              key={s.value}
              onClick={() => setFilterStatus(s.value)}
              className="text-xs px-2 py-1 rounded-sm whitespace-nowrap transition-all"
              style={{
                fontFamily: "'Oswald', sans-serif",
                letterSpacing: "0.06em",
                background: filterStatus === s.value ? "rgba(232,160,32,0.2)" : "transparent",
                color: filterStatus === s.value ? s.color : "#888",
                border: `1px solid ${filterStatus === s.value ? s.color : "#555"}`,
                fontSize: "0.6rem",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Sticky notes grid */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-2 gap-2">
            {trackedJobs.map((job, i) => {
              const noteData = getNoteForJob(job.id);
              const status = noteData?.status ?? "none";
              const statusInfo = STATUSES.find((s) => s.value === status)!;
              const isEditing = editingId === job.id;
              const stickyColor = STICKY_COLORS[i % STICKY_COLORS.length];

              return (
                <div
                  key={job.id}
                  className="sticky-note p-2 rounded-sm relative"
                  style={{
                    background: stickyColor,
                    transform: `rotate(${(i % 5 - 2) * 1.2}deg)`,
                    minHeight: "120px",
                  }}
                >
                  {/* Pin */}
                  <div
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: "#c03020", border: "1px solid #901010", boxShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
                  >
                    <Pin size={8} color="white" />
                  </div>

                  {isEditing ? (
                    <div className="flex flex-col gap-1.5 mt-2">
                      {/* Status select */}
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as JobStatus)}
                        className="text-xs p-1 rounded-sm w-full"
                        style={{ fontFamily: "'Special Elite', cursive", background: "rgba(255,255,255,0.5)", border: "1px solid rgba(0,0,0,0.2)", fontSize: "0.65rem" }}
                      >
                        {STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                      {/* Note textarea */}
                      <textarea
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        placeholder="Add a note..."
                        rows={3}
                        className="text-xs p-1 rounded-sm w-full resize-none"
                        style={{ fontFamily: "'Special Elite', cursive", background: "rgba(255,255,255,0.5)", border: "1px solid rgba(0,0,0,0.2)", fontSize: "0.65rem" }}
                      />
                      <div className="flex gap-1">
                        <button
                          onClick={() => saveEdit(job.id)}
                          className="flex-1 text-xs py-0.5 rounded-sm"
                          style={{ background: "rgba(0,0,0,0.15)", fontFamily: "'Oswald', sans-serif", fontSize: "0.6rem", letterSpacing: "0.06em" }}
                        >
                          SAVE
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 text-xs py-0.5 rounded-sm"
                          style={{ background: "rgba(0,0,0,0.08)", fontFamily: "'Oswald', sans-serif", fontSize: "0.6rem", letterSpacing: "0.06em" }}
                        >
                          CANCEL
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1 mt-2">
                      {/* Status badge */}
                      <span
                        className="text-xs px-1 py-0.5 rounded-sm self-start"
                        style={{
                          fontFamily: "'Oswald', sans-serif",
                          background: statusInfo.bg,
                          color: statusInfo.color,
                          border: `1px solid ${statusInfo.color}`,
                          fontSize: "0.55rem",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {statusInfo.label}
                      </span>
                      {/* Job title */}
                      <p
                        className="text-xs leading-tight line-clamp-2"
                        style={{ fontFamily: "'Special Elite', cursive", color: "#2a1a00", fontSize: "0.7rem" }}
                      >
                        {job.title}
                      </p>
                      {/* Note */}
                      {noteData?.note && (
                        <p
                          className="text-xs leading-tight line-clamp-2 italic"
                          style={{ fontFamily: "'Special Elite', cursive", color: "#4a3a10", fontSize: "0.65rem" }}
                        >
                          {noteData.note}
                        </p>
                      )}
                      {/* Actions */}
                      <div className="flex gap-1 mt-auto pt-1">
                        <button
                          onClick={() => startEdit(job)}
                          className="text-xs px-1 py-0.5 rounded-sm flex-1"
                          style={{ background: "rgba(0,0,0,0.12)", fontFamily: "'Oswald', sans-serif", fontSize: "0.55rem", color: "#2a1a00" }}
                        >
                          EDIT
                        </button>
                        <button
                          onClick={() => onOpenJob(job)}
                          className="text-xs px-1 py-0.5 rounded-sm flex-1"
                          style={{ background: "rgba(0,0,0,0.12)", fontFamily: "'Oswald', sans-serif", fontSize: "0.55rem", color: "#2a1a00" }}
                        >
                          EMAIL
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {trackedJobs.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 gap-2">
              <p className="text-sm tracking-widest" style={{ fontFamily: "'Oswald', sans-serif", color: "#a87010" }}>
                NO CASES
              </p>
              <p className="text-xs text-center" style={{ color: "#7a5010", fontFamily: "'Special Elite', cursive" }}>
                Open a job from the Blueprint Board and track your progress here
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
