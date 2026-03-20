import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen w-full dashboard-bg p-4 md:p-8 flex items-center justify-center">
      <div className="glass-panel w-full max-w-7xl h-full min-h-[85vh] p-6 md:p-10 flex flex-col relative overflow-hidden">
        {/* Animated Accent Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] pointer-events-none" />
        
        {/* Header */}
        <header className="mb-10 flex items-center justify-between border-b border-white/5 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-white tracking-[0.2em] italic">Bat-Dashboard</h1>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.5em] font-black">Strategic Command & Control Center</p>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
              <span className="text-white/40 text-xs">ID</span>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
          <p className="text-[8px] uppercase tracking-[0.5em] text-white/20 font-black italic">Wayne Enterprises Security Protocols Active</p>
          <div className="flex gap-2">
            {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-white/20 rounded-full" />)}
          </div>
        </footer>
      </div>
    </div>
  );
}
