/*
 * FilterPanel — dark mahogany sidebar with gold accents
 * Collapsible. Platform toggles + tag chips.
 */

import { X } from "lucide-react";

interface FilterPanelProps {
  open: boolean;
  platforms: string[];
  selectedPlatforms: string[];
  onTogglePlatform: (p: string) => void;
  tags: string[];
  selectedTags: string[];
  onToggleTag: (t: string) => void;
  onClear: () => void;
}

const PLATFORM_DOT: Record<string, string> = {
  "Upwork": "bg-emerald-400",
  "Freelancer.com": "bg-blue-400",
  "PeoplePerHour": "bg-amber-400",
};

export default function FilterPanel({
  open,
  platforms,
  selectedPlatforms,
  onTogglePlatform,
  tags,
  selectedTags,
  onToggleTag,
  onClear,
}: FilterPanelProps) {
  const hasFilters = selectedPlatforms.length > 0 || selectedTags.length > 0;

  return (
    <aside
      className="shrink-0 overflow-y-auto transition-all duration-300"
      style={{
        width: open ? "220px" : "0px",
        minWidth: open ? "220px" : "0px",
        background: "oklch(0.18 0.03 28 / 0.92)",
        borderRight: "1px solid oklch(0.72 0.12 75 / 0.25)",
        backdropFilter: "blur(12px)",
        overflow: open ? "auto" : "hidden",
      }}
    >
      <div className="p-5 min-w-[220px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <span
            className="text-xs uppercase tracking-widest"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "oklch(0.72 0.12 75)" }}
          >
            Filters
          </span>
          {hasFilters && (
            <button
              onClick={onClear}
              className="flex items-center gap-1 text-xs transition-opacity hover:opacity-70"
              style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'DM Sans', sans-serif" }}
            >
              <X size={11} /> Clear
            </button>
          )}
        </div>

        {/* Gold rule */}
        <div className="gold-rule mb-5" />

        {/* Platforms */}
        <div className="mb-6">
          <p
            className="text-xs uppercase tracking-widest mb-3"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "oklch(0.60 0.04 75)" }}
          >
            Platform
          </p>
          <div className="flex flex-col gap-2">
            {platforms.map((p) => {
              const active = selectedPlatforms.includes(p);
              return (
                <button
                  key={p}
                  onClick={() => onTogglePlatform(p)}
                  className="flex items-center gap-2.5 text-left text-sm py-1.5 px-2 rounded-sm transition-all"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    background: active ? "oklch(0.72 0.12 75 / 0.15)" : "transparent",
                    color: active ? "oklch(0.92 0.04 75)" : "oklch(0.75 0.02 75)",
                    border: active ? "1px solid oklch(0.72 0.12 75 / 0.4)" : "1px solid transparent",
                  }}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${PLATFORM_DOT[p] || "bg-gray-400"}`} />
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gold rule */}
        <div className="gold-rule mb-5" />

        {/* Tags */}
        <div>
          <p
            className="text-xs uppercase tracking-widest mb-3"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "oklch(0.60 0.04 75)" }}
          >
            Category
          </p>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => {
              const active = selectedTags.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => onToggleTag(t)}
                  className="text-xs px-2 py-1 rounded-sm transition-all"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    background: active ? "oklch(0.72 0.12 75)" : "oklch(0.28 0.03 28)",
                    color: active ? "oklch(0.15 0.02 30)" : "oklch(0.70 0.02 75)",
                    border: active ? "1px solid oklch(0.72 0.12 75)" : "1px solid oklch(0.40 0.03 28)",
                    fontWeight: active ? 500 : 400,
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
