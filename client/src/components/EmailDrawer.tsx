/*
 * EmailDrawer — noir slide-in panel from the right
 * Dark detective room aesthetic — dark background, fluorescent accents
 * Shows full job details + email subject + body with copy-to-clipboard
 */
import { useState } from "react";
import { X, Copy, Check, ExternalLink } from "lucide-react";
import type { JobPosting } from "@/lib/jobs-data";

const PLATFORM_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  "Upwork": { bg: "#1a3a1a", color: "#40c840", border: "#40c840" },
  "Freelancer.com": { bg: "#1a1a3a", color: "#4080ff", border: "#4080ff" },
  "PeoplePerHour": { bg: "#3a2a0a", color: "#e8a020", border: "#e8a020" },
};

interface EmailDrawerProps {
  job: JobPosting | null;
  open: boolean;
  onClose: () => void;
}

export default function EmailDrawer({ job, open, onClose }: EmailDrawerProps) {
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);

  const copyText = (text: string, type: "subject" | "body") => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === "subject") {
        setCopiedSubject(true);
        setTimeout(() => setCopiedSubject(false), 2000);
      } else {
        setCopiedBody(true);
        setTimeout(() => setCopiedBody(false), 2000);
      }
    });
  };

  const pc = job ? (PLATFORM_COLORS[job.platform] ?? PLATFORM_COLORS["Upwork"]) : null;

  return (
    <div
      className="fixed top-0 right-0 h-full z-40 flex flex-col transition-transform duration-300 ease-in-out"
      style={{
        width: "min(500px, 95vw)",
        transform: open ? "translateX(0)" : "translateX(100%)",
        background: "#0d1018",
        borderLeft: "3px solid rgba(200,216,64,0.4)",
        boxShadow: open ? "-8px 0 48px rgba(0,0,0,0.8)" : "none",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 shrink-0"
        style={{
          background: "#1a2030",
          borderBottom: "2px solid rgba(200,216,64,0.3)",
        }}
      >
        <div>
          <h2
            className="text-lg fluorescent-text tracking-widest"
            style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700 }}
          >
            EMAIL TEMPLATE
          </h2>
          <p className="text-xs mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif", color: "#8a9420" }}>
            Personalise &amp; send
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-sm transition-colors hover:bg-white/10"
          style={{ color: "#c8d840" }}
        >
          <X size={18} />
        </button>
      </div>

      {job && (
        <div className="flex-1 overflow-y-auto">
          {/* Job summary */}
          <div
            className="px-5 py-4"
            style={{ borderBottom: "1px solid rgba(200,216,64,0.15)" }}
          >
            {pc && (
              <span
                className="text-xs px-2 py-0.5 rounded-sm font-medium inline-block mb-3"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  background: pc.bg,
                  color: pc.color,
                  border: `1px solid ${pc.border}`,
                  fontSize: "0.65rem",
                }}
              >
                {job.platform}
              </span>
            )}
            <h3
              className="text-xl leading-snug mb-2"
              style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, color: "#e8e0c8", letterSpacing: "0.04em" }}
            >
              {job.title}
            </h3>
            <p
              className="text-sm leading-relaxed mb-3"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#8a8a7a" }}
            >
              {job.description}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif", color: "#666" }}>
                📍 {job.location}
              </span>
              <span className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif", color: "#666" }}>
                · {job.applicationMethod}
              </span>
            </div>
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-xs transition-opacity hover:opacity-70"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "#c8d840",
                letterSpacing: "0.04em",
              }}
            >
              <ExternalLink size={12} /> View Original Posting
            </a>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "rgba(200,216,64,0.2)", margin: "0 20px" }} />

          {/* Email subject */}
          <div className="px-5 pt-4 pb-3">
            <div className="flex items-center justify-between mb-2">
              <label
                className="text-xs uppercase tracking-widest"
                style={{ fontFamily: "'Oswald', sans-serif", color: "#8a9420", letterSpacing: "0.12em" }}
              >
                Subject Line
              </label>
              <button
                onClick={() => copyText(job.emailSubject, "subject")}
                className="flex items-center gap-1 text-xs px-2 py-1 rounded-sm transition-all"
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  background: copiedSubject ? "rgba(200,216,64,0.2)" : "rgba(200,216,64,0.08)",
                  color: "#c8d840",
                  border: "1px solid rgba(200,216,64,0.3)",
                  letterSpacing: "0.06em",
                  fontSize: "0.6rem",
                }}
              >
                {copiedSubject ? <Check size={11} /> : <Copy size={11} />}
                {copiedSubject ? "COPIED!" : "COPY"}
              </button>
            </div>
            <div
              className="p-3 rounded-sm text-sm"
              style={{
                background: "#1a2030",
                border: "1px solid rgba(200,216,64,0.2)",
                fontFamily: "'DM Sans', sans-serif",
                color: "#e8e0c8",
              }}
            >
              {job.emailSubject}
            </div>
          </div>

          {/* Email body */}
          <div className="px-5 pb-8">
            <div className="flex items-center justify-between mb-2">
              <label
                className="text-xs uppercase tracking-widest"
                style={{ fontFamily: "'Oswald', sans-serif", color: "#8a9420", letterSpacing: "0.12em" }}
              >
                Email Body
              </label>
              <button
                onClick={() => copyText(job.emailBody, "body")}
                className="flex items-center gap-1 text-xs px-2 py-1 rounded-sm transition-all"
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  background: copiedBody ? "rgba(200,216,64,0.2)" : "rgba(200,216,64,0.08)",
                  color: "#c8d840",
                  border: "1px solid rgba(200,216,64,0.3)",
                  letterSpacing: "0.06em",
                  fontSize: "0.6rem",
                }}
              >
                {copiedBody ? <Check size={11} /> : <Copy size={11} />}
                {copiedBody ? "COPIED!" : "COPY"}
              </button>
            </div>
            <pre
              className="p-4 rounded-sm text-sm leading-relaxed whitespace-pre-wrap"
              style={{
                background: "#1a2030",
                border: "1px solid rgba(200,216,64,0.2)",
                fontFamily: "'DM Sans', sans-serif",
                color: "#c8c0a8",
                fontSize: "0.8rem",
              }}
            >
              {job.emailBody}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
