/*
 * JobCard — a single job posting card on the whiteboard
 * Cream/white card with gold border on hover, platform badge, tags
 */

import { ExternalLink, Mail } from "lucide-react";
import type { JobPosting } from "@/lib/jobs-data";

interface JobCardProps {
  job: JobPosting;
  onClick: () => void;
  isSelected: boolean;
}

const PLATFORM_BADGE: Record<string, { bg: string; color: string; border: string }> = {
  "Upwork": { bg: "oklch(0.93 0.06 145)", color: "oklch(0.30 0.10 145)", border: "oklch(0.75 0.08 145)" },
  "Freelancer.com": { bg: "oklch(0.93 0.04 250)", color: "oklch(0.30 0.10 250)", border: "oklch(0.72 0.08 250)" },
  "PeoplePerHour": { bg: "oklch(0.95 0.07 75)", color: "oklch(0.40 0.10 60)", border: "oklch(0.78 0.09 75)" },
};

export default function JobCard({ job, onClick, isSelected }: JobCardProps) {
  const badge = PLATFORM_BADGE[job.platform] ?? PLATFORM_BADGE["Upwork"];

  return (
    <div
      className="job-card rounded-sm p-4 cursor-pointer flex flex-col gap-3"
      onClick={onClick}
      style={{
        border: isSelected
          ? "1px solid oklch(0.72 0.12 75)"
          : "1px solid oklch(0.88 0.04 75)",
        boxShadow: isSelected
          ? "0 4px 20px oklch(0.72 0.12 75 / 0.20)"
          : "0 1px 4px oklch(0 0 0 / 0.06)",
        background: isSelected ? "oklch(0.99 0.01 80)" : "oklch(1 0 0 / 0.94)",
      }}
    >
      {/* Top row: platform badge + app method */}
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-xs px-2 py-0.5 rounded-sm font-medium"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            background: badge.bg,
            color: badge.color,
            border: `1px solid ${badge.border}`,
          }}
        >
          {job.platform}
        </span>
        <span
          className="text-xs truncate"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "oklch(0.60 0.02 75)" }}
        >
          {job.applicationMethod.includes("Contest")
            ? "Contest"
            : job.applicationMethod.includes("Bid")
            ? "Bid"
            : "Apply"}
        </span>
      </div>

      {/* Title */}
      <h3
        className="text-base leading-snug text-stone-800"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
      >
        {job.title}
      </h3>

      {/* Description snippet */}
      <p
        className="text-xs text-stone-500 line-clamp-2 leading-relaxed"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {job.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {job.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-1.5 py-0.5 rounded-sm"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              background: "oklch(0.94 0.02 75)",
              color: "oklch(0.45 0.04 60)",
              border: "1px solid oklch(0.88 0.03 75)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer: location + actions */}
      <div className="flex items-center justify-between pt-1 border-t border-stone-100">
        <span
          className="text-xs text-stone-400"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {job.location}
        </span>
        <div className="flex items-center gap-2">
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1 rounded-sm transition-colors hover:bg-stone-100"
            title="View posting"
          >
            <ExternalLink size={13} style={{ color: "oklch(0.55 0.04 75)" }} />
          </a>
          <button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-sm transition-all btn-gold"
            title="View email template"
          >
            <Mail size={11} />
            Email
          </button>
        </div>
      </div>
    </div>
  );
}
