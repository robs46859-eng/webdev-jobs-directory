import DashboardLayout from "@/components/DashboardLayout";
import ClockWidget from "@/components/ClockWidget";
import WeatherWidget from "@/components/WeatherWidget";
import GoogleCalendarWidget from "@/components/GoogleCalendarWidget";
import EmailWidget from "@/components/EmailWidget";
import YoutubeDevWidget from "@/components/YoutubeDevWidget";
import YoutubeMusicWidget from "@/components/YoutubeMusicWidget";
import JobFinderWidget from "@/components/JobFinderWidget";
import MedSpaCRMWidget from "@/components/MedSpaCRMWidget";

export default function Dashboard() {
  return (
    <DashboardLayout>
      {/* Top Row: System Status & Intelligence */}
      <div className="md:col-span-1">
        <ClockWidget />
      </div>
      <div className="md:col-span-1">
        <WeatherWidget />
      </div>
      <div className="md:col-span-1">
        <GoogleCalendarWidget />
      </div>
      
      {/* Middle Row: CRM Shell (Large) */}
      <MedSpaCRMWidget />

      {/* Middle Row: Communication & Jobs */}
      <EmailWidget />
      <JobFinderWidget />
      
      {/* Bottom Row: Intelligence & Entertainment */}
      <div className="md:col-span-1">
        <YoutubeDevWidget />
      </div>
      <div className="md:col-span-1 lg:col-span-2">
        <YoutubeMusicWidget />
      </div>

      {/* Grid Fillers */}
      <div className="glass-card p-4 flex items-center justify-center min-h-[60px] md:col-span-3">
        <div className="text-[8px] text-white/10 uppercase font-black tracking-[1em] animate-pulse">
          Secure Uplink: Established // Encryption: AES-256 // Signal: Strong
        </div>
      </div>
    </DashboardLayout>
  );
}
