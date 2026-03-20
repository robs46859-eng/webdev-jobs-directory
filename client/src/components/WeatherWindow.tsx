/*
 * WeatherWindow — alluring, sexy, and sinister weather display
 * Noir detective room style — barred window with live weather
 */
import { useState, useEffect, useRef } from "react";
import { X, CloudRain, Wind, Droplets, Thermometer } from "lucide-react";

interface WeatherData {
  temp: number;
  feelsLike: number;
  condition: string;
  code: number;
  windSpeed: number;
  humidity: number;
  city: string;
}

function decodeWeather(code: number): { label: string; scene: "rain" | "storm" | "snow" | "fog" | "clear" | "cloudy" | "drizzle" } {
  if (code === 0) return { label: "Dead Calm", scene: "clear" };
  if (code <= 2) return { label: "Vague Skies", scene: "cloudy" };
  if (code === 3) return { label: "Heavy Gloom", scene: "cloudy" };
  if (code <= 49) return { label: "Blind Fog", scene: "fog" };
  if (code <= 57) return { label: "Cold Mist", scene: "drizzle" };
  if (code <= 67) return { label: "Bleak Rain", scene: "rain" };
  if (code <= 77) return { label: "White Death", scene: "snow" };
  if (code <= 82) return { label: "Downpour", scene: "rain" };
  if (code <= 86) return { label: "Blizzard", scene: "snow" };
  if (code <= 99) return { label: "Wrath of God", scene: "storm" };
  return { label: "Void", scene: "cloudy" };
}

interface WeatherWindowProps {
  open: boolean;
  onClose: () => void;
  compact?: boolean;
}

export default function WeatherWindow({ open, onClose, compact = false }: WeatherWindowProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<{ x: number; y: number; speed: number; length: number; opacity: number }[]>([]);

  useEffect(() => {
    if (!open && !compact) return;
    setLoading(true);
    setError(null);

    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
        const geoData = await geoRes.json();
        const city = geoData.address?.city || geoData.address?.town || geoData.address?.village || "Unknown District";

        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m&temperature_unit=fahrenheit&wind_speed_unit=mph`);
        const data = await res.json();
        const c = data.current;
        setWeather({
          temp: Math.round(c.temperature_2m),
          feelsLike: Math.round(c.apparent_temperature),
          condition: decodeWeather(c.weather_code).label,
          code: c.weather_code,
          windSpeed: Math.round(c.wind_speed_10m),
          humidity: c.relative_humidity_2m,
          city,
        });
      } catch {
        setError("The sky is silent.");
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude), () => fetchWeather(40.7128, -74.006));
    } else {
      fetchWeather(40.7128, -74.006);
    }
  }, [open, compact]);

  useEffect(() => {
    if (!weather || (!open && !compact)) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { scene } = decodeWeather(weather.code);
    const W = canvas.width;
    const H = canvas.height;

    const count = scene === "storm" ? 150 : scene === "rain" ? 100 : 40;
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      speed: 15 + Math.random() * 20,
      length: 20 + Math.random() * 30,
      opacity: 0.1 + Math.random() * 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Deep, alluring background
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "#050005");
      grad.addColorStop(0.5, "#0a000a");
      grad.addColorStop(1, "#150015");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Sinister red glow from below or above
      const glow = ctx.createRadialGradient(W/2, H, 0, W/2, H, H);
      glow.addColorStop(0, "rgba(255, 0, 0, 0.05)");
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      // Rain streaks - long, fast, clinical
      if (["rain", "storm", "drizzle"].includes(scene)) {
        ctx.lineWidth = 1;
        particlesRef.current.forEach(p => {
          ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.length * 0.1, p.y + p.length);
          ctx.stroke();
          p.y += p.speed;
          p.x -= p.speed * 0.1;
          if (p.y > H) { p.y = -p.length; p.x = Math.random() * W; }
        });
      }

      // Building silhouettes - simplified and sharp
      ctx.fillStyle = "#000000";
      [[0, 150, 40], [50, 120, 60], [130, 180, 50], [200, 100, 70], [280, 140, 50]].forEach(([x, y, w]) => {
        ctx.fillRect(x, y, w, H - y);
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [weather, open, compact]);

  if (compact) {
    return (
      <div className="relative w-full h-full group overflow-hidden bg-black cursor-pointer" onClick={() => (window as any).setWeatherOpen(true)}>
        <canvas ref={canvasRef} width={300} height={200} className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
        
        {/* Bars */}
        <div className="absolute inset-0 flex justify-around px-2 pointer-events-none">
          {[1,2,3,4].map(i => (
            <div key={i} className="w-[1px] h-full bg-white/5 shadow-[0_0_10px_rgba(255,255,255,0.05)]" />
          ))}
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          {weather && (
            <>
              <p className="text-3xl font-black text-white/90 tracking-tighter" style={{ fontFamily: "'Inter', sans-serif" }}>
                {weather.temp}°
              </p>
              <p className="text-[8px] uppercase tracking-[0.3em] text-red-600/80 font-bold" style={{ fontFamily: "'Inter', sans-serif" }}>
                {weather.condition}
              </p>
            </>
          )}
          {loading && <div className="w-1 h-1 bg-red-600 animate-ping rounded-full" />}
        </div>
      </div>
    );
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="relative w-full max-w-lg aspect-[4/5] bg-[#050005] border border-white/5 overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Window View */}
        <div className="relative flex-1 bg-black">
          <canvas ref={canvasRef} width={600} height={800} className="absolute inset-0 w-full h-full object-cover" />
          
          {/* Barred Window Overlay */}
          <div className="absolute inset-0 grid grid-cols-4 gap-0 pointer-events-none">
            {[1,2,3].map(i => <div key={i} className="border-r border-white/10 shadow-[2px_0_10px_rgba(0,0,0,0.8)]" />)}
          </div>
          <div className="absolute inset-y-0 left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.8)]" />

          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
        </div>

        {/* Data Panel */}
        <div className="p-8 space-y-8 bg-black/40 backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-[10px] uppercase tracking-[0.5em] text-red-600 font-black">CURRENT STATE</h2>
              <p className="text-5xl font-black text-white tracking-tighter" style={{ fontFamily: "'Inter', sans-serif" }}>
                {weather?.temp || "--"}°
              </p>
              <p className="text-xs text-white/40 font-medium italic">{weather?.city || "Finding your location..."}</p>
            </div>
            <button onClick={onClose} className="p-2 text-white/20 hover:text-white transition-colors">
              <X size={20} strokeWidth={1} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-white/30 group-hover:text-red-600 group-hover:border-red-600/30 transition-all">
                  <CloudRain size={14} strokeWidth={1} />
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-widest text-white/30">Condition</p>
                  <p className="text-xs text-white/80 font-bold">{weather?.condition || "Unknown"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-white/30 group-hover:text-red-600 group-hover:border-red-600/30 transition-all">
                  <Wind size={14} strokeWidth={1} />
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-widest text-white/30">Wind</p>
                  <p className="text-xs text-white/80 font-bold">{weather?.windSpeed || "0"} mph</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-white/30 group-hover:text-red-600 group-hover:border-red-600/30 transition-all">
                  <Droplets size={14} strokeWidth={1} />
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-widest text-white/30">Humidity</p>
                  <p className="text-xs text-white/80 font-bold">{weather?.humidity || "0"}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-white/30 group-hover:text-red-600 group-hover:border-red-600/30 transition-all">
                  <Thermometer size={14} strokeWidth={1} />
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-widest text-white/30">Feels Like</p>
                  <p className="text-xs text-white/80 font-bold">{weather?.feelsLike || "--"}°</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="px-8 py-4 border-t border-white/5 bg-black/60 flex justify-between items-center">
          <p className="text-[8px] uppercase tracking-[0.3em] text-white/20">Updated in real-time</p>
          <div className="flex gap-1">
            {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-red-600/40 rounded-full" />)}
          </div>
        </div>
      </div>
    </div>
  );
}
