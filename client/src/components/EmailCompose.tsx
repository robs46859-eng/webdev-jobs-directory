/*
 * EmailCompose — full email compose panel
 * Noir detective room style — dark background, fluorescent accents
 * Features: To, Subject, Body fields, send simulation, draft save
 */
import { useState, useEffect } from "react";
import { X, Send, Save, Trash2, ChevronDown } from "lucide-react";
import type { JobPosting } from "@/lib/jobs-data";

interface Draft {
  id: string;
  to: string;
  subject: string;
  body: string;
  savedAt: string;
  jobTitle?: string;
}

interface EmailComposeProps {
  open: boolean;
  onClose: () => void;
  prefillJob?: JobPosting | null;
}

export default function EmailCompose({ open, onClose, prefillJob }: EmailComposeProps) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);
  const [showDrafts, setShowDrafts] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>(() => {
    try { return JSON.parse(localStorage.getItem("boardroom-drafts") || "[]"); } catch { return []; }
  });

  // Prefill from a job posting
  useEffect(() => {
    if (prefillJob) {
      setTo("");
      setSubject(prefillJob.emailSubject);
      setBody(prefillJob.emailBody);
      setSent(false);
    }
  }, [prefillJob]);

  useEffect(() => {
    localStorage.setItem("boardroom-drafts", JSON.stringify(drafts));
  }, [drafts]);

  const saveDraft = () => {
    if (!subject && !body) return;
    const draft: Draft = {
      id: Date.now().toString(),
      to, subject, body,
      savedAt: new Date().toLocaleString(),
      jobTitle: prefillJob?.title,
    };
    setDrafts((prev) => [draft, ...prev.slice(0, 19)]);
  };

  const loadDraft = (d: Draft) => {
    setTo(d.to);
    setSubject(d.subject);
    setBody(d.body);
    setShowDrafts(false);
  };

  const deleteDraft = (id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  };

  const handleSend = () => {
    if (!subject || !body) return;
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const clearForm = () => {
    setTo(""); setSubject(""); setBody(""); setSent(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center transition-all duration-300"
      style={{
        background: open ? "rgba(0,0,0,0.75)" : "rgba(0,0,0,0)",
        pointerEvents: open ? "all" : "none",
        opacity: open ? 1 : 0,
      }}
      onClick={onClose}
    >
      <div
        className="relative flex flex-col rounded-sm overflow-hidden"
        style={{
          width: "min(680px, 95vw)",
          maxHeight: "90vh",
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
            {/* CRT monitor icon */}
            <div
              className="w-8 h-7 flex items-center justify-center rounded-sm"
              style={{ background: "#2a3a20", border: "1px solid rgba(200,216,64,0.4)" }}
            >
              <span style={{ fontSize: "1rem" }}>📧</span>
            </div>
            <div>
              <h2
                className="text-base fluorescent-text tracking-widest"
                style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700 }}
              >
                COMPOSE MESSAGE
              </h2>
              {prefillJob && (
                <p className="text-xs" style={{ color: "#8a9420", fontFamily: "'DM Sans', sans-serif" }}>
                  Re: {prefillJob.title}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Drafts toggle */}
            <button
              onClick={() => setShowDrafts((v) => !v)}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-sm"
              style={{
                fontFamily: "'Oswald', sans-serif",
                letterSpacing: "0.06em",
                color: "#c8d840",
                background: showDrafts ? "rgba(200,216,64,0.15)" : "transparent",
                border: "1px solid rgba(200,216,64,0.3)",
                fontSize: "0.6rem",
              }}
            >
              DRAFTS ({drafts.length}) <ChevronDown size={10} />
            </button>
            <button onClick={onClose} style={{ color: "#c8d840" }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Drafts dropdown ── */}
        {showDrafts && (
          <div
            className="shrink-0 overflow-y-auto"
            style={{
              maxHeight: "180px",
              background: "#111820",
              borderBottom: "1px solid rgba(200,216,64,0.2)",
            }}
          >
            {drafts.length === 0 ? (
              <p className="text-xs px-5 py-3 italic" style={{ color: "#666", fontFamily: "'Special Elite', cursive" }}>
                No saved drafts yet.
              </p>
            ) : (
              drafts.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between px-5 py-2 border-b"
                  style={{ borderColor: "rgba(200,216,64,0.1)" }}
                >
                  <button
                    onClick={() => loadDraft(d)}
                    className="flex-1 text-left"
                  >
                    <p className="text-xs" style={{ fontFamily: "'Oswald', sans-serif", color: "#c8d840", letterSpacing: "0.04em" }}>
                      {d.subject || "(no subject)"}
                    </p>
                    <p className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif", color: "#666" }}>
                      {d.savedAt} {d.jobTitle ? `· ${d.jobTitle}` : ""}
                    </p>
                  </button>
                  <button onClick={() => deleteDraft(d.id)}>
                    <Trash2 size={12} style={{ color: "#c03020" }} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Form ── */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* To field */}
          <div
            className="flex items-center gap-3 px-5 py-2.5 shrink-0"
            style={{ borderBottom: "1px solid rgba(200,216,64,0.15)" }}
          >
            <label
              className="text-xs w-16 shrink-0 tracking-widest"
              style={{ fontFamily: "'Oswald', sans-serif", color: "#8a9420", letterSpacing: "0.1em" }}
            >
              TO
            </label>
            <input
              type="email"
              placeholder="recipient@example.com"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#e8e0c8" }}
            />
          </div>

          {/* Subject field */}
          <div
            className="flex items-center gap-3 px-5 py-2.5 shrink-0"
            style={{ borderBottom: "1px solid rgba(200,216,64,0.15)" }}
          >
            <label
              className="text-xs w-16 shrink-0 tracking-widest"
              style={{ fontFamily: "'Oswald', sans-serif", color: "#8a9420", letterSpacing: "0.1em" }}
            >
              SUBJECT
            </label>
            <input
              type="text"
              placeholder="Subject line..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#e8e0c8" }}
            />
          </div>

          {/* Body */}
          <div className="flex-1 px-5 py-3 flex flex-col min-h-0">
            <textarea
              placeholder="Write your message here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="flex-1 w-full bg-transparent outline-none resize-none text-sm leading-relaxed"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "#c8c0a8",
                minHeight: "200px",
              }}
            />
          </div>
        </div>

        {/* ── Footer actions ── */}
        <div
          className="flex items-center justify-between px-5 py-3 shrink-0"
          style={{ background: "#111820", borderTop: "1px solid rgba(200,216,64,0.2)" }}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={saveDraft}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-sm transition-all"
              style={{
                fontFamily: "'Oswald', sans-serif",
                letterSpacing: "0.08em",
                color: "#c8d840",
                background: "rgba(200,216,64,0.08)",
                border: "1px solid rgba(200,216,64,0.3)",
                fontSize: "0.65rem",
              }}
            >
              <Save size={11} /> SAVE DRAFT
            </button>
            <button
              onClick={clearForm}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-sm transition-all"
              style={{
                fontFamily: "'Oswald', sans-serif",
                letterSpacing: "0.08em",
                color: "#888",
                background: "transparent",
                border: "1px solid #444",
                fontSize: "0.65rem",
              }}
            >
              <Trash2 size={11} /> CLEAR
            </button>
          </div>

          <button
            onClick={handleSend}
            disabled={!subject || !body}
            className="flex items-center gap-2 px-4 py-2 rounded-sm transition-all"
            style={{
              fontFamily: "'Oswald', sans-serif",
              letterSpacing: "0.1em",
              background: sent ? "rgba(64,200,64,0.2)" : "rgba(200,216,64,0.15)",
              color: sent ? "#40c840" : (!subject || !body ? "#666" : "#c8d840"),
              border: `1px solid ${sent ? "#40c840" : (!subject || !body ? "#444" : "rgba(200,216,64,0.5)")}`,
              boxShadow: sent ? "0 0 12px rgba(64,200,64,0.3)" : "none",
              cursor: !subject || !body ? "not-allowed" : "pointer",
            }}
          >
            <Send size={13} />
            {sent ? "MESSAGE SENT!" : "SEND"}
          </button>
        </div>
      </div>
    </div>
  );
}
