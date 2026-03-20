import { useState, useEffect } from "react";
import { Cloud, CloudRain, Sun, CloudLightning, Wind, Thermometer } from "lucide-react";

interface WeatherData {
  temp: number;
  condition: string;
  code: number;
  humidity: number;
  windSpeed: number;
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph`);
      const data = await res.json();
      const c = data.current;
      setWeather({
        temp: Math.round(c.temperature_2m),
        condition: decodeWeather(c.weather_code),
        code: c.weather_code,
        humidity: c.relative_humidity_2m,
        windSpeed: Math.round(c.wind_speed_10m),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const decodeWeather = (code: number) => {
    if (code === 0) return "Clear Skies";
    if (code <= 3) return "Partly Cloudy";
    if (code <= 48) return "Foggy";
    if (code <= 67) return "Rainy";
    if (code <= 77) return "Snowy";
    if (code <= 99) return "Stormy";
    return "Unknown";
  };

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="w-8 h-8 text-yellow-500" />;
    if (code <= 3) return <Cloud className="w-8 h-8 text-blue-300" />;
    if (code <= 67) return <CloudRain className="w-8 h-8 text-blue-400" />;
    if (code <= 99) return <CloudLightning className="w-8 h-8 text-purple-400" />;
    return <Cloud className="w-8 h-8 text-gray-400" />;
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(40.7128, -74.006) // Fallback to NYC
      );
    } else {
      fetchWeather(40.7128, -74.006);
    }
  }, []);

  if (loading) return (
    <div className="glass-card p-6 flex items-center justify-center h-full min-h-[150px]">
      <div className="w-6 h-6 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="glass-card p-6 flex flex-col h-full min-h-[150px]">
      <h3 className="text-[10px] tracking-[0.4em] text-white/40 mb-2 uppercase font-black italic">Gotham Atmospheric Monitor</h3>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-4">
          {getWeatherIcon(weather?.code || 0)}
          <div>
            <div className="text-3xl font-bold text-white tracking-tighter">{weather?.temp}°F</div>
            <div className="text-[10px] text-white/50 uppercase font-bold tracking-widest">{weather?.condition}</div>
          </div>
        </div>
        <div className="text-right space-y-1">
          <div className="flex items-center gap-1 justify-end text-[10px] text-white/30 uppercase font-black">
            <Wind size={10} /> {weather?.windSpeed} MPH
          </div>
          <div className="flex items-center gap-1 justify-end text-[10px] text-white/30 uppercase font-black">
            <Thermometer size={10} /> {weather?.humidity}% HUM
          </div>
        </div>
      </div>
    </div>
  );
}
