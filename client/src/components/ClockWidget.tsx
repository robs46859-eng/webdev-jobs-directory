import { useState, useEffect } from "react";

export default function ClockWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass-card p-6 flex flex-col items-center justify-center h-full min-h-[150px]">
      <h3 className="text-[10px] tracking-[0.4em] text-white/40 mb-2 uppercase font-black">Arkham Standard Time</h3>
      <div className="text-4xl font-bold text-white tracking-tighter tabular-nums">
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </div>
      <div className="text-[10px] tracking-widest text-white/30 mt-2 uppercase">
        {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
    </div>
  );
}
