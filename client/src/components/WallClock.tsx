/*
 * WallClock — analog clock in noir comic style
 * Fluorescent green hands, dark face, bold tick marks
 */
import { useState, useEffect } from "react";

export default function WallClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const s = time.getSeconds();
  const m = time.getMinutes();
  const h = time.getHours() % 12;

  const secDeg = s * 6;
  const minDeg = m * 6 + s * 0.1;
  const hrDeg = h * 30 + m * 0.5;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="80" height="80" viewBox="0 0 80 80">
        {/* Clock body */}
        <circle cx="40" cy="40" r="38" fill="#1a2030" stroke="#3a4a5a" strokeWidth="3" />
        <circle cx="40" cy="40" r="35" fill="#1a2030" stroke="#c8d840" strokeWidth="1" opacity="0.4" />

        {/* Tick marks */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x1 = 40 + 30 * Math.cos(angle);
          const y1 = 40 + 30 * Math.sin(angle);
          const x2 = 40 + 34 * Math.cos(angle);
          const y2 = 40 + 34 * Math.sin(angle);
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#c8d840" strokeWidth={i % 3 === 0 ? 2 : 1} opacity="0.7" />
          );
        })}

        {/* Hour hand */}
        <line
          x1="40" y1="40"
          x2={40 + 18 * Math.cos((hrDeg - 90) * Math.PI / 180)}
          y2={40 + 18 * Math.sin((hrDeg - 90) * Math.PI / 180)}
          stroke="#e8e0c8" strokeWidth="3" strokeLinecap="round"
        />

        {/* Minute hand */}
        <line
          x1="40" y1="40"
          x2={40 + 25 * Math.cos((minDeg - 90) * Math.PI / 180)}
          y2={40 + 25 * Math.sin((minDeg - 90) * Math.PI / 180)}
          stroke="#e8e0c8" strokeWidth="2" strokeLinecap="round"
        />

        {/* Second hand */}
        <line
          x1="40" y1="40"
          x2={40 + 28 * Math.cos((secDeg - 90) * Math.PI / 180)}
          y2={40 + 28 * Math.sin((secDeg - 90) * Math.PI / 180)}
          stroke="#c8d840" strokeWidth="1" strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 3px rgba(200,216,64,0.8))" }}
        />

        {/* Center dot */}
        <circle cx="40" cy="40" r="3" fill="#c8d840" />
      </svg>
      <span
        className="text-xs tracking-widest"
        style={{ fontFamily: "'Oswald', sans-serif", color: "#c8d840", fontSize: "0.6rem" }}
      >
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
    </div>
  );
}
