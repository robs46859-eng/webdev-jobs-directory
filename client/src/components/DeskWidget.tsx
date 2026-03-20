/*
 * DeskWidget — Real Email Inbox (Smithgroup via AgentMail)
 * Noir detective room style — replaces the old compose-only widget
 * Features: list threads, read messages, compose new email, reply
 */
import { useState } from "react";
import { X, Mail, Send, Inbox, ArrowLeft, RefreshCw, Plus, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface DeskWidgetProps {
  open: boolean;
  onClose: () => void;
}

export default function DeskWidget({ open, onClose }: DeskWidgetProps) {
  const [view, setView] = useState<"inbox" | "thread" | "compose">("inbox");
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  // Compose state
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const { data: threadsData, isLoading: threadsLoading, refetch: refetchThreads } = trpc.email.listThreads.useQuery(
    { limit: 20 },
    { enabled: open }
  );

  const { data: messagesData, isLoading: messagesLoading } = trpc.email.getMessages.useQuery(
    { threadId: selectedThreadId! },
    { enabled: !!selectedThreadId && view === "thread" }
  );

  const sendMutation = trpc.email.send.useMutation({
    onSuccess: () => {
      setTo(""); setSubject(""); setBody("");
      setView("inbox");
      refetchThreads();
    },
    onError: (err) => alert(`Send failed: ${err.message}`),
  });

  const handleSend = () => {
    if (!to || !subject || !body) return;
    sendMutation.mutate({ to, subject, body });
  };

  const openThread = (threadId: string) => {
    setSelectedThreadId(threadId);
    setView("thread");
  };

  if (!open) return null;

  const threads = threadsData?.threads ?? [];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-50 w-full max-w-2xl mx-4 rounded-sm overflow-hidden flex flex-col"
        style={{
          maxHeight: "85vh",
          background: "#0d1018",
          border: "2px solid rgba(217,70,239,0.4)",
          boxShadow: "0 0 60px rgba(0,0,0,0.9), 0 0 20px rgba(217,70,239,0.1)",
        }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 shrink-0"
          style={{ background: "#1a2030", borderBottom: "2px solid rgba(217,70,239,0.3)" }}>
          <div className="flex items-center gap-3">
            {view !== "inbox" && (
              <button onClick={() => setView("inbox")} style={{ color: "#d946ef" }}>
                <ArrowLeft size={16} />
              </button>
            )}
            <div className="w-8 h-7 flex items-center justify-center rounded-sm"
              style={{ background: "#2a3a20", border: "1px solid rgba(217,70,239,0.4)" }}>
              <Mail size={14} style={{ color: "#d946ef" }} />
            </div>
            <div>
              <h2 className="text-base tracking-widest"
                style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: "#d946ef", textShadow: "0 0 10px rgba(217,70,239,0.3)" }}>
                {view === "compose" ? "COMPOSE" : view === "thread" ? "THREAD" : "SMITHGROUP INBOX"}
              </h2>
              <p className="text-xs" style={{ color: "#c084fc", fontFamily: "'DM Sans', sans-serif" }}>
                robert@smithgroup.io
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {view === "inbox" && (
              <>
                <button onClick={() => refetchThreads()} className="p-1.5 rounded-sm transition-all"
                  style={{ color: "#d946ef", background: "rgba(217,70,239,0.08)", border: "1px solid rgba(217,70,239,0.2)" }}>
                  <RefreshCw size={13} />
                </button>
                <button onClick={() => setView("compose")} className="p-1.5 rounded-sm transition-all"
                  style={{ color: "#d946ef", background: "rgba(217,70,239,0.08)", border: "1px solid rgba(217,70,239,0.2)" }}>
                  <Plus size={13} />
                </button>
              </>
            )}
            <button onClick={onClose} style={{ color: "#d946ef" }}><X size={18} /></button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* INBOX VIEW */}
          {view === "inbox" && (
            <>
              {threadsLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 size={20} className="animate-spin" style={{ color: "#d946ef" }} />
                </div>
              ) : threads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Inbox size={32} style={{ color: "#444" }} />
                  <p className="text-xs" style={{ fontFamily: "'Special Elite', cursive", color: "#666" }}>
                    Inbox is empty. Compose a new message.
                  </p>
                </div>
              ) : (
                threads.map((thread: any) => (
                  <div
                    key={thread.thread_id || thread.id}
                    onClick={() => openThread(thread.thread_id || thread.id)}
                    className="flex items-start gap-3 px-5 py-3 cursor-pointer transition-all hover:bg-white/[0.03]"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: "rgba(217,70,239,0.1)", border: "1px solid rgba(217,70,239,0.2)" }}>
                      <Mail size={12} style={{ color: "#d946ef" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ fontFamily: "'Oswald', sans-serif", color: "#e8e0c8", letterSpacing: "0.03em" }}>
                        {thread.subject || "(no subject)"}
                      </p>
                      <p className="text-xs truncate mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif", color: "#888", fontSize: "0.65rem" }}>
                        {thread.participants?.map((p: any) => p.email || p).join(", ") || ""}
                      </p>
                      <p className="text-xs mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif", color: "#555", fontSize: "0.6rem" }}>
                        {thread.updated_at ? new Date(thread.updated_at).toLocaleString() : ""}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {/* THREAD VIEW */}
          {view === "thread" && (
            <>
              {messagesLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 size={20} className="animate-spin" style={{ color: "#d946ef" }} />
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {(messagesData?.messages ?? []).map((msg: any, i: number) => (
                    <div key={msg.message_id || i} className="p-3 rounded-sm"
                      style={{ background: "#111820", border: "1px solid rgba(217,70,239,0.1)" }}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold" style={{ fontFamily: "'Oswald', sans-serif", color: "#c084fc", fontSize: "0.65rem" }}>
                          {msg.from?.email || msg.from || "Unknown"}
                        </p>
                        <p className="text-xs" style={{ color: "#555", fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem" }}>
                          {msg.created_at ? new Date(msg.created_at).toLocaleString() : ""}
                        </p>
                      </div>
                      <div className="text-xs whitespace-pre-wrap leading-relaxed"
                        style={{ fontFamily: "'DM Sans', sans-serif", color: "#c8c0a8" }}>
                        {msg.body || msg.text || ""}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* COMPOSE VIEW */}
          {view === "compose" && (
            <div className="flex flex-col p-0">
              <div className="flex items-center gap-3 px-5 py-2.5"
                style={{ borderBottom: "1px solid rgba(217,70,239,0.15)" }}>
                <label className="text-xs w-16 shrink-0 tracking-widest"
                  style={{ fontFamily: "'Oswald', sans-serif", color: "#c084fc", letterSpacing: "0.1em" }}>TO</label>
                <input type="email" placeholder="recipient@example.com" value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "#e8e0c8" }} />
              </div>
              <div className="flex items-center gap-3 px-5 py-2.5"
                style={{ borderBottom: "1px solid rgba(217,70,239,0.15)" }}>
                <label className="text-xs w-16 shrink-0 tracking-widest"
                  style={{ fontFamily: "'Oswald', sans-serif", color: "#c084fc", letterSpacing: "0.1em" }}>SUBJECT</label>
                <input type="text" placeholder="Subject line..." value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "#e8e0c8" }} />
              </div>
              <div className="px-5 py-3 flex-1">
                <textarea placeholder="Write your message here..." value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full bg-transparent outline-none resize-none text-sm leading-relaxed"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: "#c8c0a8", minHeight: "200px" }} />
              </div>
            </div>
          )}
        </div>

        {/* Footer for compose */}
        {view === "compose" && (
          <div className="flex items-center justify-end px-5 py-3 shrink-0"
            style={{ background: "#111820", borderTop: "1px solid rgba(217,70,239,0.2)" }}>
            <button
              onClick={handleSend}
              disabled={!to || !subject || !body || sendMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 rounded-sm transition-all"
              style={{
                fontFamily: "'Oswald', sans-serif",
                letterSpacing: "0.1em",
                background: "rgba(217,70,239,0.15)",
                color: (!to || !subject || !body) ? "#666" : "#d946ef",
                border: `1px solid ${(!to || !subject || !body) ? "#444" : "rgba(217,70,239,0.5)"}`,
                cursor: (!to || !subject || !body) ? "not-allowed" : "pointer",
              }}
            >
              {sendMutation.isPending ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
              {sendMutation.isPending ? "SENDING..." : "SEND"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
