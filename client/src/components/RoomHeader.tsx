/*
 * RoomHeader — luxury top navigation bar
 * Dark mahogany background, gold accents, Cormorant Garamond title
 */

import { Search, SlidersHorizontal } from "lucide-react";

interface RoomHeaderProps {
  search: string;
  onSearch: (v: string) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  resultCount: number;
}

export default function RoomHeader({
  search,
  onSearch,
  sidebarOpen,
  onToggleSidebar,
  resultCount,
}: RoomHeaderProps) {
  return (
    <header
      className="relative z-20 flex items-center justify-between px-4 md:px-8 py-3 gap-4"
      style={{
        background: "oklch(0.18 0.03 28 / 0.92)",
        borderBottom: "1px solid oklch(0.72 0.12 75 / 0.4)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Logo / Title */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-sm transition-colors hover:bg-white/10"
          title={sidebarOpen ? "Hide filters" : "Show filters"}
          style={{ color: "oklch(0.72 0.12 75)" }}
        >
          <SlidersHorizontal size={18} />
        </button>
        <div>
          <h1
            className="text-xl md:text-2xl leading-none"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 400,
              color: "oklch(0.92 0.04 75)",
              letterSpacing: "0.06em",
            }}
          >
            The Board Room
          </h1>
          <p
            className="text-xs leading-none mt-0.5 hidden md:block"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "oklch(0.72 0.12 75)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Web Dev Opportunities
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xl relative">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "oklch(0.72 0.12 75)" }}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search opportunities…"
          className="w-full pl-9 pr-4 py-2 text-sm rounded-sm outline-none transition-all"
          style={{
            background: "oklch(0.28 0.03 28 / 0.8)",
            border: "1px solid oklch(0.72 0.12 75 / 0.3)",
            color: "oklch(0.93 0.015 75)",
            fontFamily: "'DM Sans', sans-serif",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "oklch(0.72 0.12 75 / 0.8)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "oklch(0.72 0.12 75 / 0.3)";
          }}
        />
      </div>

      {/* Result count */}
      <div
        className="shrink-0 text-xs hidden sm:block"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          color: "oklch(0.72 0.12 75)",
          letterSpacing: "0.06em",
        }}
      >
        {resultCount} listing{resultCount !== 1 ? "s" : ""}
      </div>
    </header>
  );
}
