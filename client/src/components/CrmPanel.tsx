/*
 * CrmPanel — Captivate Med Spa CRM
 * Noir detective room style — replaces the old CalendarPanel
 * Features: lead list, search, filter by status/location, view email sequences, send emails, AI personalization
 */
import { useState, useMemo } from "react";
import { X, Search, Send, ChevronLeft, ChevronRight, Users, Mail, MapPin, Building2, ExternalLink, Loader2, Sparkles, RotateCcw } from "lucide-react";
import { trpc } from "@/lib/trpc";

const STATUS_COLORS: Record<string, { color: string; bg: string; label: string }> = {
  new: { color: "#4080ff", bg: "#0a1a3a", label: "NEW" },
  step1_sent: { color: "#e8a020", bg: "#3a2a0a", label: "STEP 1" },
  step2_sent: { color: "#c084fc", bg: "#2a1a3a", label: "STEP 2" },
  step3_sent: { color: "#d946ef", bg: "#3a0a3a", label: "STEP 3" },
  replied: { color: "#40c840", bg: "#0a3a0a", label: "REPLIED" },
  booked: { color: "#00d4ff", bg: "#0a2a3a", label: "BOOKED" },
  unsubscribed: { color: "#666", bg: "#1a1a1a", label: "UNSUB" },
};

interface CrmPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function CrmPanel({ open, onClose }: CrmPanelProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "email1" | "email2" | "email3">("info");
  const [sendingStep, setSendingStep] = useState<string | null>(null);
  const [rewritingStep, setRewritingStep] = useState<string | null>(null);
  const [draftEmail, setDraftEmail] = useState<{ subject: string; body: string } | null>(null);
  const [tonePreference, setTonePreference] = useState<"professional" | "friendly" | "urgent" | "casual">("professional");
  const LIMIT = 15;

  const stableSearch = useMemo(() => search, [search]);
  const stableStatus = useMemo(() => statusFilter, [statusFilter]);
  const stableLocation = useMemo(() => locationFilter, [locationFilter]);

  const { data: leadsData, isLoading, refetch } = trpc.crm.list.useQuery(
    { search: stableSearch || undefined, status: stableStatus, location: stableLocation, limit: LIMIT, offset: page * LIMIT },
    { enabled: open }
  );
  const { data: locations } = trpc.crm.locations.useQuery(undefined, { enabled: open });
  const { data: stats } = trpc.crm.stats.useQuery(undefined, { enabled: open });
  const { data: selectedLead } = trpc.crm.getById.useQuery(
    { id: selectedLeadId! },
    { enabled: !!selectedLeadId }
  );

  const rewriteEmail = trpc.crm.rewriteEmail.useMutation({
    onSuccess: (data) => {
      setRewritingStep(null);
      setDraftEmail({ subject: data.subject, body: data.body });
    },
    onError: (err) => {
      setRewritingStep(null);
      alert(`Rewrite failed: ${err.message}`);
    },
  });

  const sendEmail = trpc.crm.sendEmail.useMutation({
    onSuccess: (data) => {
      setSendingStep(null);
      setDraftEmail(null);
      setSelectedLeadId(null);
      refetch();
      alert(`Email sent successfully!`);
    },
    onError: (err) => {
      setSendingStep(null);
      console.error("Send error:", err);
      alert(`Send failed: ${err.message}`);
    },
  });

  const updateStatus = trpc.crm.updateStatus.useMutation({
    onSuccess: () => refetch(),
  });

  const leads = leadsData?.leads ?? [];
  const total = leadsData?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);

  const totalLeads = stats ? Object.values(stats).reduce((a, b) => a + b, 0) : 0;

  const handleRewriteEmail = (leadId: number, step: "1" | "2" | "3") => {
    setRewritingStep(step);
    rewriteEmail.mutate({ leadId, step, tone: tonePreference });
  };

  const handleSendEmail = (leadId: number, step: "1" | "2" | "3") => {
    if (!confirm(`Send email step ${step} to this lead?`)) return;
    setSendingStep(step);
    sendEmail.mutate({
      leadId,
      step,
      customSubject: draftEmail?.subject,
      customBody: draftEmail?.body,
    });
  };

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
          width: "min(960px, 96vw)",
          maxHeight: "92vh",
          background: "#0d1018",
          border: "2px solid rgba(217,70,239,0.4)",
          boxShadow: "0 0 60px rgba(0,0,0,0.9), 0 0 20px rgba(217,70,239,0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-5 py-3 shrink-0"
          style={{ background: "#1a2030", borderBottom: "2px solid rgba(217,70,239,0.3)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-7 flex items-center justify-center rounded-sm"
              style={{ background: "#2a1a3a", border: "1px solid rgba(217,70,239,0.4)" }}>
              <Users size={16} style={{ color: "#d946ef" }} />
            </div>
            <div>
              <h2 className="text-base tracking-widest"
                style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: "#d946ef", textShadow: "0 0 10px rgba(217,70,239,0.3)" }}>
                CAPTIVATE CRM
              </h2>
              <p className="text-xs" style={{ color: "#c084fc", fontFamily: "'DM Sans', sans-serif" }}>
                {totalLeads} leads · Med Spa Automation
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: "#d946ef" }}><X size={18} /></button>
        </div>

        {/* ── Stats Bar ── */}
        {stats && (
          <div className="flex gap-2 px-5 py-2 shrink-0 overflow-x-auto"
            style={{ borderBottom: "1px solid rgba(217,70,239,0.15)", background: "#111820" }}>
            {Object.entries(STATUS_COLORS).map(([key, c]) => (
              <button
                key={key}
                onClick={() => { setStatusFilter(statusFilter === key ? "all" : key); setPage(0); }}
                className="flex items-center gap-1.5 px-2 py-1 rounded-sm shrink-0 transition-all"
                style={{
                  background: statusFilter === key ? c.bg : "transparent",
                  border: `1px solid ${statusFilter === key ? c.color : "rgba(255,255,255,0.08)"}`,
                  fontSize: "0.6rem",
                  fontFamily: "'Oswald', sans-serif",
                  letterSpacing: "0.06em",
                  color: c.color,
                }}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
                {c.label} ({stats[key] || 0})
              </button>
            ))}
          </div>
        )}

        {/* ── Search & Filters ── */}
        <div className="flex gap-2 px-5 py-2 shrink-0"
          style={{ borderBottom: "1px solid rgba(217,70,239,0.15)" }}>
          <div className="flex items-center gap-2 flex-1 px-3 py-1.5 rounded-sm"
            style={{ background: "#1a2030", border: "1px solid rgba(217,70,239,0.2)" }}>
            <Search size={13} style={{ color: "#d946ef" }} />
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="flex-1 bg-transparent outline-none text-xs"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "#e8e0c8" }}
            />
          </div>
          <select
            value={locationFilter}
            onChange={(e) => { setLocationFilter(e.target.value); setPage(0); }}
            className="text-xs px-2 py-1 rounded-sm"
            style={{ background: "#1a2030", border: "1px solid rgba(217,70,239,0.2)", color: "#d946ef", fontFamily: "'Oswald', sans-serif", fontSize: "0.6rem" }}
          >
            <option value="all">ALL LOCATIONS</option>
            {locations?.map((loc) => (
              <option key={loc} value={loc}>{loc.toUpperCase()}</option>
            ))}
          </select>
        </div>

        {/* ── Content ── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left: Lead List */}
          <div className="flex-1 flex flex-col overflow-hidden" style={{ borderRight: selectedLeadId ? "1px solid rgba(217,70,239,0.15)" : "none" }}>
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 size={20} className="animate-spin" style={{ color: "#d946ef" }} />
                </div>
              ) : leads.length === 0 ? (
                <p className="text-xs italic px-5 py-8 text-center" style={{ fontFamily: "'Special Elite', cursive", color: "#666" }}>
                  No leads found matching your filters.
                </p>
              ) : (
                leads.map((lead) => {
                  const sc = STATUS_COLORS[lead.status] || STATUS_COLORS.new;
                  return (
                    <div
                      key={lead.id}
                      onClick={() => { setSelectedLeadId(lead.id); setActiveTab("info"); setDraftEmail(null); }}
                      className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-all"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                        background: selectedLeadId === lead.id ? "rgba(217,70,239,0.08)" : "transparent",
                      }}
                    >
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: sc.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate" style={{ fontFamily: "'Oswald', sans-serif", color: "#e8e0c8", letterSpacing: "0.03em" }}>
                          {lead.firstName} {lead.lastName}
                        </p>
                        <p className="text-xs truncate" style={{ fontFamily: "'DM Sans', sans-serif", color: "#888", fontSize: "0.65rem" }}>
                          {lead.companyName} · {lead.location}
                        </p>
                      </div>
                      <span className="text-xs px-1.5 py-0.5 rounded-sm shrink-0"
                        style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.color}`, fontSize: "0.5rem", fontFamily: "'Oswald', sans-serif", letterSpacing: "0.06em" }}>
                        {sc.label}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-2 shrink-0"
                style={{ borderTop: "1px solid rgba(217,70,239,0.15)", background: "#111820" }}>
                <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
                  style={{ color: page === 0 ? "#444" : "#d946ef" }}>
                  <ChevronLeft size={14} />
                </button>
                <span className="text-xs" style={{ fontFamily: "'Oswald', sans-serif", color: "#c084fc", fontSize: "0.6rem" }}>
                  PAGE {page + 1} / {totalPages}
                </span>
                <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}
                  style={{ color: page >= totalPages - 1 ? "#444" : "#d946ef" }}>
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Right: Lead Detail */}
          {selectedLeadId && selectedLead && (
            <div className="w-96 shrink-0 flex flex-col overflow-hidden" style={{ background: "#0a0f18" }}>
              {/* Lead Header */}
              <div className="px-4 py-3 shrink-0" style={{ borderBottom: "1px solid rgba(217,70,239,0.15)" }}>
                <h3 className="text-sm font-bold" style={{ fontFamily: "'Oswald', sans-serif", color: "#d946ef", letterSpacing: "0.05em" }}>
                  {selectedLead.firstName} {selectedLead.lastName}
                </h3>
                <p className="text-xs" style={{ fontFamily: "'DM Sans', sans-serif", color: "#888" }}>
                  {selectedLead.jobTitle}
                </p>
              </div>

              {/* Tabs */}
              <div className="flex shrink-0" style={{ borderBottom: "1px solid rgba(217,70,239,0.15)" }}>
                {[
                  { key: "info", label: "INFO" },
                  { key: "email1", label: "STEP 1" },
                  { key: "email2", label: "STEP 2" },
                  { key: "email3", label: "STEP 3" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className="flex-1 py-2 text-xs transition-all"
                    style={{
                      fontFamily: "'Oswald', sans-serif",
                      fontSize: "0.6rem",
                      letterSpacing: "0.08em",
                      color: activeTab === tab.key ? "#d946ef" : "#666",
                      borderBottom: activeTab === tab.key ? "2px solid #d946ef" : "2px solid transparent",
                      background: activeTab === tab.key ? "rgba(217,70,239,0.05)" : "transparent",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {activeTab === "info" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail size={12} style={{ color: "#c084fc" }} />
                      <a href={`mailto:${selectedLead.email}`} className="text-xs underline" style={{ color: "#e8e0c8", fontFamily: "'DM Sans', sans-serif" }}>
                        {selectedLead.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 size={12} style={{ color: "#c084fc" }} />
                      <span className="text-xs" style={{ color: "#e8e0c8", fontFamily: "'DM Sans', sans-serif" }}>
                        {selectedLead.companyName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={12} style={{ color: "#c084fc" }} />
                      <span className="text-xs" style={{ color: "#e8e0c8", fontFamily: "'DM Sans', sans-serif" }}>
                        {selectedLead.location}
                      </span>
                    </div>
                    {selectedLead.website && (
                      <div className="flex items-center gap-2">
                        <ExternalLink size={12} style={{ color: "#c084fc" }} />
                        <a href={`https://${selectedLead.website}`} target="_blank" rel="noopener" className="text-xs underline" style={{ color: "#e8e0c8", fontFamily: "'DM Sans', sans-serif" }}>
                          {selectedLead.website}
                        </a>
                      </div>
                    )}
                    {selectedLead.linkedin && (
                      <div className="flex items-center gap-2">
                        <ExternalLink size={12} style={{ color: "#c084fc" }} />
                        <a href={`https://${selectedLead.linkedin}`} target="_blank" rel="noopener" className="text-xs underline" style={{ color: "#4080ff", fontFamily: "'DM Sans', sans-serif" }}>
                          LinkedIn
                        </a>
                      </div>
                    )}

                    {/* Status Update */}
                    <div className="pt-3 mt-3" style={{ borderTop: "1px solid rgba(217,70,239,0.1)" }}>
                      <label className="text-xs tracking-widest block mb-1.5"
                        style={{ fontFamily: "'Oswald', sans-serif", color: "#c084fc", fontSize: "0.55rem", letterSpacing: "0.1em" }}>
                        STATUS
                      </label>
                      <select
                        value={selectedLead.status}
                        onChange={(e) => updateStatus.mutate({ id: selectedLead.id, status: e.target.value as any })}
                        className="w-full text-xs px-2 py-1.5 rounded-sm"
                        style={{ background: "#1a2030", border: "1px solid rgba(217,70,239,0.3)", color: "#d946ef", fontFamily: "'Oswald', sans-serif", fontSize: "0.65rem" }}
                      >
                        <option value="new">NEW</option>
                        <option value="step1_sent">STEP 1 SENT</option>
                        <option value="step2_sent">STEP 2 SENT</option>
                        <option value="step3_sent">STEP 3 SENT</option>
                        <option value="replied">REPLIED</option>
                        <option value="booked">BOOKED</option>
                        <option value="unsubscribed">UNSUBSCRIBED</option>
                      </select>
                    </div>
                  </div>
                )}

                {(activeTab === "email1" || activeTab === "email2" || activeTab === "email3") && (() => {
                  const step = activeTab.replace("email", "") as "1" | "2" | "3";
                  const subjectKey = `subject${step}` as keyof typeof selectedLead;
                  const bodyKey = `body${step}` as keyof typeof selectedLead;
                  const originalSubject = selectedLead[subjectKey] as string | null;
                  const originalBody = selectedLead[bodyKey] as string | null;
                  const displaySubject = draftEmail?.subject || originalSubject;
                  const displayBody = draftEmail?.body || originalBody;

                  return (
                    <div className="space-y-3">
                      {/* Tone Selector */}
                      {!draftEmail && (
                        <div>
                          <label className="text-xs tracking-widest block mb-1.5"
                            style={{ fontFamily: "'Oswald', sans-serif", color: "#c084fc", fontSize: "0.55rem", letterSpacing: "0.1em" }}>
                            AI TONE
                          </label>
                          <div className="grid grid-cols-2 gap-1.5">
                            {(["professional", "friendly", "urgent", "casual"] as const).map((tone) => (
                              <button
                                key={tone}
                                onClick={() => setTonePreference(tone)}
                                className="px-2 py-1 rounded-sm text-xs transition-all"
                                style={{
                                  fontFamily: "'Oswald', sans-serif",
                                  fontSize: "0.55rem",
                                  letterSpacing: "0.06em",
                                  background: tonePreference === tone ? "rgba(217,70,239,0.2)" : "rgba(217,70,239,0.08)",
                                  color: "#d946ef",
                                  border: `1px solid ${tonePreference === tone ? "rgba(217,70,239,0.5)" : "rgba(217,70,239,0.2)"}`,
                                }}
                              >
                                {tone.toUpperCase()}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Original or Draft Subject */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs tracking-widest"
                            style={{ fontFamily: "'Oswald', sans-serif", color: "#c084fc", fontSize: "0.55rem", letterSpacing: "0.1em" }}>
                            {draftEmail ? "✨ AI DRAFT SUBJECT" : "ORIGINAL SUBJECT"}
                          </label>
                          {draftEmail && (
                            <button
                              onClick={() => setDraftEmail(null)}
                              className="text-xs px-1.5 py-0.5 rounded-sm transition-all"
                              style={{ background: "rgba(217,70,239,0.1)", color: "#c084fc", fontSize: "0.5rem" }}
                            >
                              <RotateCcw size={10} className="inline mr-0.5" /> RESET
                            </button>
                          )}
                        </div>
                        <p className="text-xs p-2 rounded-sm" style={{ background: "#1a2030", color: "#e8e0c8", fontFamily: "'DM Sans', sans-serif", border: "1px solid rgba(217,70,239,0.1)" }}>
                          {displaySubject || "(empty)"}
                        </p>
                      </div>

                      {/* Original or Draft Body */}
                      <div>
                        <label className="text-xs tracking-widest block mb-1"
                          style={{ fontFamily: "'Oswald', sans-serif", color: "#c084fc", fontSize: "0.55rem", letterSpacing: "0.1em" }}>
                          {draftEmail ? "✨ AI DRAFT BODY" : "ORIGINAL BODY"}
                        </label>
                        <div className="text-xs p-3 rounded-sm whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto"
                          style={{ background: "#1a2030", color: draftEmail ? "#d4af37" : "#c8c0a8", fontFamily: "'DM Sans', sans-serif", border: `1px solid ${draftEmail ? "rgba(212,175,55,0.3)" : "rgba(217,70,239,0.1)"}` }}>
                          {displayBody || "(empty)"}
                        </div>
                      </div>

                      {/* AI Rewrite or Send Button */}
                      {!draftEmail ? (
                        <button
                          onClick={() => handleRewriteEmail(selectedLead.id, step)}
                          disabled={!originalSubject || !originalBody || rewritingStep === step}
                          className="w-full flex items-center justify-center gap-2 py-2 rounded-sm transition-all mt-4"
                          style={{
                            fontFamily: "'Oswald', sans-serif",
                            letterSpacing: "0.1em",
                            fontSize: "0.7rem",
                            background: "rgba(212,175,55,0.15)",
                            color: (!originalSubject || !originalBody) ? "#666" : "#d4af37",
                            border: `1px solid ${(!originalSubject || !originalBody) ? "#444" : "rgba(212,175,55,0.5)"}`,
                            cursor: (!originalSubject || !originalBody) ? "not-allowed" : "pointer",
                          }}
                        >
                          {rewritingStep === step ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <Sparkles size={13} />
                          )}
                          {rewritingStep === step ? "PERSONALIZING..." : "✨ PERSONALIZE WITH AI"}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSendEmail(selectedLead.id, step)}
                          disabled={!displaySubject || !displayBody || sendingStep === step}
                          className="w-full flex items-center justify-center gap-2 py-2 rounded-sm transition-all mt-4"
                          style={{
                            fontFamily: "'Oswald', sans-serif",
                            letterSpacing: "0.1em",
                            fontSize: "0.7rem",
                            background: "rgba(217,70,239,0.15)",
                            color: (!displaySubject || !displayBody) ? "#666" : "#d946ef",
                            border: `1px solid ${(!displaySubject || !displayBody) ? "#444" : "rgba(217,70,239,0.5)"}`,
                            cursor: (!displaySubject || !displayBody) ? "not-allowed" : "pointer",
                          }}
                        >
                          {sendingStep === step ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <Send size={13} />
                          )}
                          {sendingStep === step ? "SENDING..." : `SEND PERSONALIZED STEP ${step}`}
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
