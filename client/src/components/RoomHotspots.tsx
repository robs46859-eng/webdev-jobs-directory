/*
 * RoomHotspots — invisible clickable zones overlaid on the room background
 * Each hotspot maps to a real object in the noir room image.
 *
 * Image layout (2752×1536, 16:9):
 *   - Corkboard:       left ~14%–38%, top ~15%–55%
 *   - Filing cabinet:  left ~0%–12%, top ~42%–95%
 *   - Barred window:   left ~57%–76%, top ~22%–55%
 *   - Blueprint board toggle: center ~42%–52%, top ~30%–70% (the wall gap)
 *
 * Hotspots use percentage-based positioning so they scale with the viewport.
 */

import { useState } from "react";

type HotspotId = "corkboard" | "cabinet" | "window" | "blueprint";

interface Hotspot {
  id: HotspotId;
  label: string;
  icon: string;
  left: string;
  top: string;
  width: string;
  height: string;
  cursor: string;
  tooltip: string;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: "corkboard",
    label: "CASE BOARD",
    icon: "📌",
    left: "14%",
    top: "15%",
    width: "24%",
    height: "40%",
    cursor: "pointer",
    tooltip: "Open Case Board",
  },
  {
    id: "cabinet",
    label: "FILING CABINET",
    icon: "🗄️",
    left: "0%",
    top: "42%",
    width: "13%",
    height: "50%",
    cursor: "pointer",
    tooltip: "Open Filing Cabinet",
  },
  {
    id: "window",
    label: "CITY VIEW",
    icon: "🌧️",
    left: "57%",
    top: "22%",
    width: "19%",
    height: "33%",
    cursor: "zoom-in",
    tooltip: "Look Outside",
  },
  {
    id: "blueprint",
    label: "BLUEPRINT BOARD",
    icon: "📋",
    left: "38%",
    top: "25%",
    width: "19%",
    height: "50%",
    cursor: "pointer",
    tooltip: "Open Blueprint Board",
  },
];

interface RoomHotspotsProps {
  onCorkboard: () => void;
  onCabinet: () => void;
  onBlueprint: () => void;
  windowOpen: boolean;
  onWindowClose: () => void;
}

export default function RoomHotspots({
  onCorkboard,
  onCabinet,
  onBlueprint,
  windowOpen,
  onWindowClose,
}: RoomHotspotsProps) {
  const [hovered, setHovered] = useState<HotspotId | null>(null);
  const [windowPeek, setWindowPeek] = useState(false);

  const handleClick = (id: HotspotId) => {
    if (id === "corkboard") onCorkboard();
    else if (id === "cabinet") onCabinet();
    else if (id === "blueprint") onBlueprint();
    else if (id === "window") setWindowPeek(true);
  };

  return (
    <>
      {/* Hotspot overlay zones */}
      {HOTSPOTS.map((h) => (
        <div
          key={h.id}
          onClick={() => handleClick(h.id)}
          onMouseEnter={() => setHovered(h.id)}
          onMouseLeave={() => setHovered(null)}
          className="absolute z-10 group transition-all duration-200"
          style={{
            left: h.left,
            top: h.top,
            width: h.width,
            height: h.height,
            cursor: h.cursor,
            background: hovered === h.id ? "rgba(200,216,64,0.08)" : "transparent",
            border: hovered === h.id ? "2px solid rgba(200,216,64,0.5)" : "2px solid transparent",
            borderRadius: "2px",
            transition: "all 0.15s ease",
          }}
        >
          {/* Hover tooltip */}
          {hovered === h.id && (
            <div
              className="absolute left-1/2 -translate-x-1/2 -top-8 whitespace-nowrap px-2 py-1 rounded-sm pointer-events-none z-50"
              style={{
                background: "rgba(10,20,40,0.95)",
                border: "1px solid rgba(200,216,64,0.5)",
                color: "#c8d840",
                fontFamily: "'Oswald', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
                boxShadow: "0 0 12px rgba(200,216,64,0.2)",
              }}
            >
              {h.icon} {h.tooltip}
            </div>
          )}

          {/* Subtle corner brackets on hover */}
          {hovered === h.id && (
            <>
              <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: "#c8d840" }} />
              <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: "#c8d840" }} />
              <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: "#c8d840" }} />
              <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: "#c8d840" }} />
            </>
          )}
        </div>
      ))}

      {/* Window peek modal */}
      {windowPeek && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.85)" }}
          onClick={() => setWindowPeek(false)}
        >
          <div
            className="relative flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "520px", width: "90%" }}
          >
            {/* Barred window frame */}
            <div
              className="relative w-full rounded-sm overflow-hidden"
              style={{
                background: "#0a1020",
                border: "6px solid #3a4a5a",
                boxShadow: "0 0 40px rgba(0,0,0,0.9), inset 0 0 20px rgba(0,0,30,0.5)",
              }}
            >
              {/* Rainy city skyline */}
              <div
                className="w-full flex items-center justify-center"
                style={{
                  height: "260px",
                  background: "linear-gradient(180deg, #0a0f1a 0%, #1a2a3a 40%, #0d1a2a 100%)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* City silhouette */}
                <svg viewBox="0 0 520 260" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMax meet">
                  {/* Buildings */}
                  <rect x="0" y="160" width="40" height="100" fill="#0d1520" />
                  <rect x="10" y="140" width="20" height="20" fill="#0d1520" />
                  <rect x="45" y="120" width="60" height="140" fill="#0a1018" />
                  <rect x="55" y="100" width="10" height="20" fill="#0a1018" />
                  <rect x="110" y="150" width="35" height="110" fill="#0d1520" />
                  <rect x="150" y="100" width="50" height="160" fill="#0a1018" />
                  <rect x="160" y="80" width="10" height="20" fill="#0a1018" />
                  <rect x="205" y="130" width="45" height="130" fill="#0d1520" />
                  <rect x="255" y="90" width="55" height="170" fill="#0a1018" />
                  <rect x="265" y="70" width="8" height="20" fill="#0a1018" />
                  <rect x="315" y="140" width="40" height="120" fill="#0d1520" />
                  <rect x="360" y="110" width="50" height="150" fill="#0a1018" />
                  <rect x="415" y="155" width="35" height="105" fill="#0d1520" />
                  <rect x="455" y="125" width="65" height="135" fill="#0a1018" />
                  {/* Window lights */}
                  {[
                    [52,125],[58,125],[70,125],[52,140],[70,140],
                    [155,110],[165,110],[155,125],[165,125],
                    [258,100],[268,100],[258,115],[268,115],
                    [363,120],[373,120],[363,135],
                    [460,135],[470,135],[480,135],[460,150],
                  ].map(([x, y], i) => (
                    <rect key={i} x={x} y={y} width="6" height="5" fill="#e8d840" opacity="0.6" />
                  ))}
                  {/* Rain streaks */}
                  {Array.from({ length: 40 }).map((_, i) => {
                    const x = (i * 13.3) % 520;
                    const y = (i * 17) % 200;
                    return (
                      <line key={i} x1={x} y1={y} x2={x - 2} y2={y + 18}
                        stroke="rgba(160,200,255,0.25)" strokeWidth="1" />
                    );
                  })}
                </svg>

                {/* Bars overlay */}
                <div className="absolute inset-0 flex" style={{ pointerEvents: "none" }}>
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-full"
                      style={{
                        width: "6px",
                        background: "linear-gradient(90deg, #2a3a4a, #3a4a5a, #2a3a4a)",
                        marginLeft: i === 0 ? "8%" : "auto",
                        flex: i === 0 ? "none" : "1",
                        boxShadow: "1px 0 3px rgba(0,0,0,0.5)",
                      }}
                    />
                  ))}
                </div>

                {/* Horizontal bar */}
                <div
                  className="absolute w-full"
                  style={{
                    height: "8px",
                    top: "50%",
                    background: "linear-gradient(180deg, #2a3a4a, #3a4a5a, #2a3a4a)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
                  }}
                />
              </div>

              {/* Window sill */}
              <div
                className="w-full py-2 px-4 flex items-center justify-between"
                style={{ background: "#1a2030", borderTop: "3px solid #3a4a5a" }}
              >
                <span
                  className="text-xs tracking-widest"
                  style={{ fontFamily: "'Special Elite', cursive", color: "#8a9a6a", fontSize: "0.7rem" }}
                >
                  Gotham City — 9:40 PM — Rain expected all night
                </span>
                <span className="text-xs" style={{ color: "#4a6a4a", fontFamily: "'DM Sans', sans-serif" }}>🌧️</span>
              </div>
            </div>

            <button
              onClick={() => setWindowPeek(false)}
              className="text-xs px-4 py-1.5 rounded-sm transition-all"
              style={{
                fontFamily: "'Oswald', sans-serif",
                letterSpacing: "0.1em",
                background: "rgba(200,216,64,0.1)",
                color: "#c8d840",
                border: "1px solid rgba(200,216,64,0.4)",
              }}
            >
              CLOSE WINDOW
            </button>
          </div>
        </div>
      )}
    </>
  );
}
