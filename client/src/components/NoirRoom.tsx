import React, { useState } from "react";

interface SubAction {
  id: string;
  name: string;
  action: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

interface Artifact {
  id: string;
  name?: string;
  src: string;
  left: number; // percentage
  top: number;  // percentage
  width: number; // percentage
  action?: string;
  subActions?: SubAction[];
}

const ARTIFACTS: Artifact[] = [
  { id: "light", name: "Overhead Light", src: "/artifacts/overhead_light.png", left: 48.86, top: 2.08, width: 29.26, action: "TOGGLE_THEME" },
  { id: "cork", name: "Job Board", src: "/artifacts/cork_board.png", left: 17.40, top: 18.88, width: 20.95, action: "OPEN_JOBS" },
  { id: "cabinet", name: "Portfolio", src: "/artifacts/filing_cabinet.png", left: 3.19, top: 42.31, width: 19.88, action: "OPEN_PORTFOLIO" },
  { id: "window", name: "Weather", src: "/artifacts/barred_window.png", left: 61.78, top: 27.99, width: 18.46, action: "OPEN_WEATHER" },
  { id: "coffee", name: "About Me", src: "/artifacts/coffee_bar.png", left: 24.14, top: 44.27, width: 24.85, action: "OPEN_BIO" },
  { 
    id: "long_cabinet", 
    src: "/artifacts/long_short_cabinet.png", 
    left: 24.14, top: 57.29, width: 24.85, 
    subActions: [
      { id: "media", name: "YouTube Widget", action: "OPEN_MEDIA", left: 0, top: 0, width: 50, height: 100 },
      { id: "ai", name: "Claude AI", action: "OPEN_AI", left: 50, top: 0, width: 50, height: 100 }
    ]
  },
  { 
    id: "desk", 
    src: "/artifacts/desk.png", 
    left: 66.05, top: 57.29, width: 17.04, 
    subActions: [
      { id: "mail", name: "Agent Mail", action: "OPEN_MAIL", left: 0, top: 0, width: 50, height: 100 },
      { id: "crm", name: "CRM", action: "OPEN_CRM", left: 50, top: 0, width: 50, height: 100 }
    ]
  },
  { id: "clock", name: "Clock", src: "/artifacts/clock.png", left: 39.77, top: 25.39, width: 4.97, action: "OPEN_CALENDAR" },
  { id: "calendar", name: "Calendar", src: "/artifacts/calendar.png", left: 2.48, top: 26.04, width: 4.61, action: "OPEN_CALENDAR" },
];

interface NoirRoomProps {
  onAction: (action: string) => void;
  className?: string;
}

/**
 * NoirRoom — A plug-and-play template that reconstructs the room
 * using separate artifacts as interactive buttons. Supports multiple click areas (sub-actions) per artifact.
 */
export default function NoirRoom({ onAction, className = "" }: NoirRoomProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-black ${className}`}>
      {/* ── Background Wall/Floor ── */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale-[0.2] contrast-[1.1] brightness-[0.8]"
        style={{ backgroundImage: "url('/room-bg.png')" }}
      />
      
      {/* ── Interactive Artifacts Layer ── */}
      <div className="absolute inset-0">
        {ARTIFACTS.map((art) => {
          const isHovered = hovered === art.id || art.subActions?.some(sub => hovered === sub.id);
          const activeSubAction = art.subActions?.find(sub => hovered === sub.id);
          const displayName = activeSubAction ? activeSubAction.name : art.name || "";

          return (
            <div
              key={art.id}
              className="absolute group transition-all duration-300"
              style={{
                left: `${art.left}%`,
                top: `${art.top}%`,
                width: `${art.width}%`,
                zIndex: isHovered ? 20 : 10,
                // Apply glow to the whole artifact when any part is hovered
                filter: isHovered 
                  ? "drop-shadow(0 0 15px rgba(217,70,239,0.5)) brightness(1.2)" 
                  : "none",
              }}
            >
              <img 
                src={art.src} 
                alt={displayName} 
                className="w-full h-auto block transform transition-transform" 
                style={{ transform: isHovered ? "scale(1.02)" : "scale(1)" }}
              />
              
              {/* ── Sub-Action Overlays ── */}
              {art.subActions ? (
                art.subActions.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => onAction(sub.action)}
                    onMouseEnter={() => setHovered(sub.id)}
                    onMouseLeave={() => setHovered(null)}
                    className="absolute cursor-pointer border-none bg-transparent outline-none"
                    style={{
                      left: `${sub.left}%`,
                      top: `${sub.top}%`,
                      width: `${sub.width}%`,
                      height: `${sub.height}%`,
                    }}
                  />
                ))
              ) : (
                /* ── Single Action Overlay ── */
                <button
                  onClick={() => art.action && onAction(art.action)}
                  onMouseEnter={() => setHovered(art.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="absolute inset-0 w-full h-full cursor-pointer border-none bg-transparent outline-none"
                />
              )}
              
              {/* ── Floating Label ── */}
              <div 
                className={`absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/90 text-[10px] tracking-[0.2em] text-[#d946ef] border border-[#d946ef]/30 whitespace-nowrap pointer-events-none transition-opacity duration-200 ${isHovered ? "opacity-100" : "opacity-0"}`}
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                {displayName.toUpperCase()}
              </div>

              {/* ── Corner Accents on Hover ── */}
              {isHovered && (
                <>
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#d946ef]" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#d946ef]" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#d946ef]" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#d946ef]" />
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Sinister Vignette ── */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />
    </div>
  );
}
