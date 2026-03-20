/*
 * WeatherWindow — animated window showing real current weather
 * Noir detective room style — barred window with live weather from Open-Meteo (free, no key)
 * Animates: rain streaks, snow flakes, lightning, clouds, or clear night sky based on weather code
 */
import { useState, useEffect, useRef } from "react";

interface WeatherData {
  temp: number;
  feelsLike: number;
  condition: string;
  code: number;
  windSpeed: number;
  humidity: number;
  city: string;
}

// WMO weather code → condition label + scene type
function decodeWeather(code: number): { label: string; scene: "rain" | "storm" | "snow" | "fog" | "clear" | "cloudy" | "drizzle" } {
  if (code === 0) return { label: "Clear Sky", scene: "clear" };
  if (code <= 2) return { label: "Partly Cloudy", scene: "cloudy" };
  if (code === 3) return { label: "Overcast", scene: "cloudy" };
  if (code <= 49) return { label: "Foggy", scene: "fog" };
  if (code <= 57) return { label: "Drizzle", scene: "drizzle" };
  if (code <= 67) return { label: "Rain", scene: "rain" };
  if (code <= 77) return { label: "Snow", scene: "snow" };
  if (code <= 82) return { label: "Rain Showers", scene: "rain" };
  if (code <= 86) return { label: "Snow Showers", scene: "snow" };
  if (code <= 99) return { label: "Thunderstorm", scene: "storm" };
  return { label: "Unknown", scene: "cloudy" };
}

interface WeatherWindowProps {
  open: boolean;
  onClose: () => void;
  /** compact mode: small inline widget, no modal */
  compact?: boolean;
}

export default function WeatherWindow({ open, onClose, compact = false }: WeatherWindowProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<{ x: number; y: number; speed: number; length: number; opacity: number }[]>([]);

  // Fetch weather using browser geolocation → Open-Meteo (no API key needed)
  useEffect(() => {
    if (!open && !compact) return;
    setLoading(true);
    setError(null);

    const fetchWeather = async (lat: number, lon: number) => {
      try {
        // Reverse geocode city name
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );
        const geoData = await geoRes.json();
        const city =
          geoData.address?.city ||
          geoData.address?.town ||
          geoData.address?.village ||
          geoData.address?.county ||
          "Your City";

        // Fetch weather
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m&temperature_unit=fahrenheit&wind_speed_unit=mph`
        );
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
        setError("Could not fetch weather.");
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => {
          // Fallback: New York City
          fetchWeather(40.7128, -74.006);
        },
        { timeout: 5000 }
      );
    } else {
      fetchWeather(40.7128, -74.006);
    }
  }, [open, compact]);

  // Canvas animation
  useEffect(() => {
    if (!weather || (!open && !compact)) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { scene } = decodeWeather(weather.code);
    const W = canvas.width;
    const H = canvas.height;

    // Initialize particles
    const count = scene === "storm" ? 120 : scene === "rain" ? 90 : scene === "drizzle" ? 50 : scene === "snow" ? 60 : 0;
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      speed: scene === "snow" ? 0.5 + Math.random() * 1 : 4 + Math.random() * 8,
      length: scene === "snow" ? 2 : 8 + Math.random() * 12,
      opacity: 0.3 + Math.random() * 0.5,
    }));

    let lightningTimer = 0;
    let lightningOn = false;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
      if (scene === "clear") {
        skyGrad.addColorStop(0, "#050a18");
        skyGrad.addColorStop(1, "#0d1a30");
      } else if (scene === "storm") {
        skyGrad.addColorStop(0, "#050508");
        skyGrad.addColorStop(1, "#0a0a14");
      } else if (scene === "snow") {
        skyGrad.addColorStop(0, "#0a1020");
        skyGrad.addColorStop(1, "#1a2030");
      } else if (scene === "fog") {
        skyGrad.addColorStop(0, "#1a1e28");
        skyGrad.addColorStop(1, "#2a2e38");
      } else {
        skyGrad.addColorStop(0, "#080c18");
        skyGrad.addColorStop(1, "#101828");
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);

      // Stars (clear only)
      if (scene === "clear") {
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        for (let i = 0; i < 40; i++) {
          const sx = (i * 37 + 11) % W;
          const sy = (i * 53 + 7) % (H * 0.6);
          const r = i % 3 === 0 ? 1.5 : 0.8;
          ctx.beginPath();
          ctx.arc(sx, sy, r, 0, Math.PI * 2);
          ctx.fill();
        }
        // Moon
        ctx.fillStyle = "#e8e0b0";
        ctx.beginPath();
        ctx.arc(W * 0.75, H * 0.2, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#0d1a30";
        ctx.beginPath();
        ctx.arc(W * 0.75 + 5, H * 0.2 - 3, 11, 0, Math.PI * 2);
        ctx.fill();
      }

      // Clouds
      if (["cloudy", "rain", "storm", "drizzle", "fog", "snow"].includes(scene)) {
        const cloudOpacity = scene === "fog" ? 0.5 : 0.3;
        ctx.fillStyle = `rgba(40,50,70,${cloudOpacity})`;
        [[W * 0.1, H * 0.15, 60, 25], [W * 0.4, H * 0.08, 80, 30], [W * 0.7, H * 0.18, 70, 28], [W * 0.25, H * 0.25, 50, 20]].forEach(([cx, cy, rw, rh]) => {
          ctx.beginPath();
          ctx.ellipse(cx, cy, rw, rh, 0, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Fog overlay
      if (scene === "fog") {
        const fogGrad = ctx.createLinearGradient(0, H * 0.3, 0, H);
        fogGrad.addColorStop(0, "rgba(180,190,200,0)");
        fogGrad.addColorStop(1, "rgba(180,190,200,0.25)");
        ctx.fillStyle = fogGrad;
        ctx.fillRect(0, 0, W, H);
      }

      // Lightning flash
      if (scene === "storm") {
        lightningTimer++;
        if (lightningTimer > 120 && Math.random() < 0.02) {
          lightningOn = true;
          lightningTimer = 0;
        }
        if (lightningOn) {
          ctx.fillStyle = "rgba(200,220,255,0.15)";
          ctx.fillRect(0, 0, W, H);
          // Bolt
          ctx.strokeStyle = "rgba(200,220,255,0.9)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          const bx = W * 0.4 + Math.random() * W * 0.3;
          ctx.moveTo(bx, 0);
          ctx.lineTo(bx - 10, H * 0.3);
          ctx.lineTo(bx + 5, H * 0.3);
          ctx.lineTo(bx - 15, H * 0.7);
          ctx.stroke();
          lightningOn = false;
        }
      }

      // Rain / drizzle / storm streaks
      if (["rain", "storm", "drizzle"].includes(scene)) {
        particlesRef.current.forEach((p) => {
          ctx.strokeStyle = `rgba(160,200,255,${p.opacity})`;
          ctx.lineWidth = scene === "drizzle" ? 0.5 : 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.length * 0.3, p.y + p.length);
          ctx.stroke();
          p.y += p.speed;
          p.x -= p.speed * 0.2;
          if (p.y > H) { p.y = -p.length; p.x = Math.random() * W; }
        });
      }

      // Snow flakes
      if (scene === "snow") {
        particlesRef.current.forEach((p) => {
          ctx.fillStyle = `rgba(220,230,255,${p.opacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.length * 0.3, 0, Math.PI * 2);
          ctx.fill();
          p.y += p.speed;
          p.x += Math.sin(p.y * 0.05) * 0.5;
          if (p.y > H) { p.y = -5; p.x = Math.random() * W; }
        });
      }

      // Gotham city silhouette
      ctx.fillStyle = "rgba(5,8,15,0.9)";
      const buildings = [
        [0, H * 0.55, 35, H], [35, H * 0.45, 55, H], [90, H * 0.38, 45, H],
        [135, H * 0.5, 30, H], [165, H * 0.35, 60, H], [225, H * 0.48, 40, H],
        [265, H * 0.3, 55, H], [320, H * 0.42, 35, H], [355, H * 0.36, 65, H],
        [420, H * 0.5, 45, H], [465, H * 0.4, 55, H],
      ];
      buildings.forEach(([bx, by, bw, bh]) => {
        ctx.fillRect(bx, by, bw, bh - by);
      });

      // Building windows
      ctx.fillStyle = "rgba(232,216,64,0.5)";
      [[52, H * 0.4], [58, H * 0.4], [70, H * 0.4], [52, H * 0.48], [70, H * 0.48],
       [170, H * 0.38], [180, H * 0.38], [170, H * 0.46], [180, H * 0.46],
       [268, H * 0.33], [278, H * 0.33], [268, H * 0.41], [278, H * 0.41],
       [360, H * 0.39], [370, H * 0.39], [360, H * 0.47], [370, H * 0.47],
       [468, H * 0.43], [478, H * 0.43]].forEach(([wx, wy]) => {
        ctx.fillRect(wx, wy, 5, 4);
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [weather, open, compact]);

  if (compact) {
    // Compact inline widget for the window hotspot area
    return (
      <div className="relative w-full h-full overflow-hidden rounded-sm" style={{ background: "#050a18" }}>
        <canvas ref={canvasRef} width={200} height={120} className="absolute inset-0 w-full h-full" style={{ objectFit: "cover" }} />
        {/* Bars overlay */}
        <div className="absolute inset-0 pointer-events-none flex" style={{ gap: "14%" }}>
          {[0,1,2,3,4,5].map((i) => (
            <div key={i} className="h-full" style={{ width: "5px", background: "linear-gradient(90deg,#2a3a4a,#3a4a5a,#2a3a4a)", boxShadow: "1px 0 3px rgba(0,0,0,0.6)" }} />
          ))}
        </div>
        <div className="absolute w-full" style={{ height: "6px", top: "50%", background: "linear-gradient(180deg,#2a3a4a,#3a4a5a,#2a3a4a)" }} />
        {/* Weather info overlay */}
        {weather && (
          <div className="absolute bottom-1 left-1 right-1 flex items-end justify-between" style={{ pointerEvents: "none" }}>
            <div>
              <p className="text-xs leading-none" style={{ fontFamily: "'Oswald', sans-serif", color: "#c8d840", fontSize: "0.9rem", fontWeight: 700, textShadow: "0 0 6px rgba(0,0,0,0.9)" }}>
                {weather.temp}°F
              </p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#8a9a6a", fontSize: "0.5rem", textShadow: "0 0 4px rgba(0,0,0,0.9)" }}>
                {weather.condition}
              </p>
            </div>
            <p style={{ fontFamily: "'Special Elite', cursive", color: "#6a7a5a", fontSize: "0.45rem", textShadow: "0 0 4px rgba(0,0,0,0.9)" }}>
              {weather.city}
            </p>
          </div>
        )}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p style={{ fontFamily: "'Special Elite', cursive", color: "#8a9a6a", fontSize: "0.55rem" }}>Scanning...</p>
          </div>
        )}
      </div>
    );
  }

  // Full modal
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
    >
      <div
        className="relative flex flex-col rounded-sm overflow-hidden"
        style={{
          width: "min(560px, 94vw)",
          background: "#0d1018",
          border: "2px solid rgba(200,216,64,0.4)",
          boxShadow: "0 0 60px rgba(0,0,0,0.9)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3" style={{ background: "#1a2030", borderBottom: "2px solid rgba(200,216,64,0.3)" }}>
          <h2 className="text-base fluorescent-text tracking-widest" style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700 }}>
            🌧️ OUTSIDE
          </h2>
          <button onClick={onClose} style={{ color: "#c8d840", fontFamily: "'Oswald', sans-serif", fontSize: "0.7rem", letterSpacing: "0.1em" }}>CLOSE</button>
        </div>

        {/* Window scene */}
        <div className="relative" style={{ height: "280px", background: "#050a18" }}>
          <canvas ref={canvasRef} width={560} height={280} className="absolute inset-0 w-full h-full" />
          {/* Bars */}
          <div className="absolute inset-0 pointer-events-none flex" style={{ gap: "12.5%" }}>
            {[0,1,2,3,4,5,6].map((i) => (
              <div key={i} className="h-full" style={{ width: "6px", background: "linear-gradient(90deg,#2a3a4a,#3a4a5a,#2a3a4a)", boxShadow: "1px 0 4px rgba(0,0,0,0.6)" }} />
            ))}
          </div>
          <div className="absolute w-full" style={{ height: "8px", top: "50%", background: "linear-gradient(180deg,#2a3a4a,#3a4a5a,#2a3a4a)" }} />
          {/* Window frame */}
          <div className="absolute inset-0 pointer-events-none" style={{ border: "8px solid #2a3a4a", boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)" }} />
        </div>

        {/* Weather stats */}
        <div className="px-5 py-4" style={{ background: "#111820", borderTop: "1px solid rgba(200,216,64,0.2)" }}>
          {loading && <p className="text-xs italic" style={{ fontFamily: "'Special Elite', cursive", color: "#666" }}>Scanning the skies...</p>}
          {error && <p className="text-xs" style={{ color: "#c03020", fontFamily: "'DM Sans', sans-serif" }}>{error}</p>}
          {weather && (
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl" style={{ fontFamily: "'Oswald', sans-serif", color: "#c8d840", fontWeight: 700, lineHeight: 1 }}>
                  {weather.temp}°F
                </p>
                <p className="text-sm mt-1" style={{ fontFamily: "'Special Elite', cursive", color: "#8a9a6a" }}>
                  {weather.condition} · {weather.city}
                </p>
                <p className="text-xs mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif", color: "#666" }}>
                  Feels like {weather.feelsLike}°F
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs" style={{ fontFamily: "'Oswald', sans-serif", color: "#8a9420", letterSpacing: "0.08em", fontSize: "0.65rem" }}>
                  WIND <span style={{ color: "#c8c0a8" }}>{weather.windSpeed} mph</span>
                </p>
                <p className="text-xs mt-1" style={{ fontFamily: "'Oswald', sans-serif", color: "#8a9420", letterSpacing: "0.08em", fontSize: "0.65rem" }}>
                  HUMIDITY <span style={{ color: "#c8c0a8" }}>{weather.humidity}%</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
