import { AIChatBox, type Message } from "./AIChatBox";
import { X } from "lucide-react";
import { useState } from "react";

interface AIAssistantModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AIAssistantModal({ open, onClose }: AIAssistantModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: "You are Claude, a helpful AI assistant in a noir-style web developer directory. Be concise, professional, and slightly mysterious." },
    { role: "assistant", content: "How can I assist you in the shadows today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = (content: string) => {
    setMessages((prev) => [...prev, { role: "user", content }]);
    setIsLoading(true);
    
    // Mock AI response for now since we don't have the tRPC backend set up in this turn
    setTimeout(() => {
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: `I've processed your request regarding "${content}". In this city, information is the only currency that matters. What else do you need to know?` 
      }]);
      setIsLoading(false);
    }, 1500);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#0a0c10] border border-[#d946ef]/30 rounded-sm overflow-hidden shadow-[0_0_50px_rgba(217,70,239,0.2)] flex flex-col"
        style={{ height: "min(700px, 85vh)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#111820] border-b border-[#d946ef]/20">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#d946ef] animate-pulse shadow-[0_0_8px_#d946ef]" />
            <h2 className="text-sm font-bold tracking-[0.2em] text-[#d946ef]" style={{ fontFamily: "'Oswald', sans-serif" }}>
              CLAUDE AI ASSISTANT
            </h2>
          </div>
          <button onClick={onClose} className="text-[#d946ef]/50 hover:text-[#d946ef] transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Chat Box */}
        <div className="flex-1 overflow-hidden p-4">
          <AIChatBox
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            height="100%"
            className="border-none bg-transparent shadow-none"
            placeholder="Whisper your request..."
          />
        </div>

        {/* Footer info */}
        <div className="px-6 py-2 bg-[#050608] border-t border-[#d946ef]/10 flex justify-between items-center">
          <p className="text-[9px] uppercase tracking-widest text-[#d946ef]/30" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Encrypted Connection Established
          </p>
          <div className="flex gap-1">
            {[1,2,3,4].map(i => <div key={i} className="w-1 h-1 bg-[#d946ef]/20 rounded-full" />)}
          </div>
        </div>
      </div>
    </div>
  );
}
