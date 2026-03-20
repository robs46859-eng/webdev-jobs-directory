import { useState, useEffect } from "react";
import { Calendar, Lock, LogIn } from "lucide-react";

/**
 * GOOGLE CALENDAR OAUTH BOILERPLATE
 * 
 * To use this in production:
 * 1. Create a project in Google Cloud Console.
 * 2. Enable Google Calendar API.
 * 3. Create OAuth 2.0 Client ID.
 * 4. Add 'https://www.googleapis.com/auth/calendar.readonly' scope.
 */

const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
const TARGET_EMAIL = "robcofamily@gmail.com";

export default function GoogleCalendarWidget() {
  const [events, setEvents] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  // Note: This is a conceptual implementation of the Google Identity Services SDK
  const handleAuth = () => {
    setLoading(true);
    // In a real app, you would use the @react-oauth/google library or the raw gapi/gis script
    console.log("Initiating OAuth for", TARGET_EMAIL);
    
    // Simulating successful auth and fetch for demonstration
    setTimeout(() => {
      setIsAuthenticated(true);
      setLoading(false);
      setEvents([
        { id: 1, summary: "Wayne Manor Gala", start: { dateTime: new Date().toISOString() } },
        { id: 2, summary: "Batcave Maintenance", start: { dateTime: new Date(Date.now() + 86400000).toISOString() } },
        { id: 3, summary: "Arkham Patrol", start: { dateTime: new Date(Date.now() + 172800000).toISOString() } },
      ]);
    }, 1500);
  };

  if (!isAuthenticated) {
    return (
      <div className="glass-card p-6 flex flex-col items-center justify-center h-full min-h-[200px] text-center">
        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
          <Calendar className="text-white/40" />
        </div>
        <h3 className="text-sm font-bold text-white mb-1 uppercase tracking-widest">Wayne Family Calendar</h3>
        <p className="text-[10px] text-white/40 mb-4 max-w-[200px] leading-relaxed">
          Authentication required for <span className="text-white/60 font-black">{TARGET_EMAIL}</span>
        </p>
        <button 
          onClick={handleAuth}
          disabled={loading}
          className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full transition-all flex items-center gap-2"
        >
          {loading ? <div className="w-3 h-3 border border-white/20 border-t-white rounded-full animate-spin" /> : <LogIn size={12} />}
          Authenticate
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 flex flex-col h-full min-h-[200px]">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-[10px] tracking-[0.4em] text-white/40 mb-1 uppercase font-black">Family Intelligence</h3>
          <div className="text-xs font-bold text-white tracking-widest uppercase">{TARGET_EMAIL}</div>
        </div>
        <div className="p-2 bg-white/5 rounded-lg">
          <Calendar size={14} className="text-white/40" />
        </div>
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[150px] pr-2 custom-scrollbar">
        {events.map((event) => (
          <div key={event.id} className="group cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="w-1 h-8 bg-blue-500/40 rounded-full group-hover:bg-blue-500 transition-colors" />
              <div>
                <div className="text-[11px] font-bold text-white/90 uppercase tracking-wide group-hover:text-white transition-colors">
                  {event.summary}
                </div>
                <div className="text-[9px] text-white/30 uppercase font-black tracking-widest mt-0.5">
                  {new Date(event.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — {new Date(event.start.dateTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
