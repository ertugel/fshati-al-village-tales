import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

const FLAGS = ["🇦🇱","🇩🇪","🇬🇧","🇮🇹","🇫🇷","🇺🇸","🇦🇺","🇨🇭","🇳🇱","🇸🇪","🇳🇴","🇩🇰","🇵🇱","🇪🇸"];

interface ChatMessage {
  id: string;
  created_at: string;
  username: string;
  country_flag: string;
  message: string;
  is_admin: boolean;
  is_pinned: boolean;
}

const CommunityChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState(() => localStorage.getItem("chat_username") || "");
  const [flag, setFlag] = useState(() => localStorage.getItem("chat_flag") || "🇦🇱");
  const [showModal, setShowModal] = useState(false);
  const [onlineCount, setOnlineCount] = useState(() => Math.floor(Math.random() * 17) + 18);
  const chatRef = useRef<HTMLDivElement>(null);
  const [tempName, setTempName] = useState("");
  const [tempFlag, setTempFlag] = useState("🇦🇱");

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await (supabase
        .from("chat_messages" as any)
        .select("*")
        .order("created_at", { ascending: true })
        .limit(50) as any);
      if (data) setMessages(data as ChatMessage[]);
    };
    fetchMessages();
  }, []);

  // Subscribe to realtime
  useEffect(() => {
    const channel = supabase
      .channel("chat_realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Random online count
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(Math.floor(Math.random() * 17) + 18);
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const handleJoin = () => {
    if (!tempName.trim()) return;
    localStorage.setItem("chat_username", tempName.trim());
    localStorage.setItem("chat_flag", tempFlag);
    setUsername(tempName.trim());
    setFlag(tempFlag);
    setShowModal(false);
  };

  const send = useCallback(async () => {
    if (!input.trim() || input.length > 300) return;
    if (!username) { setShowModal(true); return; }

    const msg = input.trim();
    setInput("");
    await supabase.from("chat_messages").insert({
      username,
      country_flag: flag,
      message: msg,
    });
  }, [input, username, flag]);

  const pinnedMessages = messages.filter((m) => m.is_pinned);
  const regularMessages = messages.filter((m) => !m.is_pinned);

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <section className="py-20 bg-sand/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
              Komuniteti i Udhëtarëve
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Connect with fellow travelers and local guides. Ask questions, share tips, and plan together in real-time.
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">{onlineCount} online now</span>
            </div>
          </motion.div>

          <motion.div
            className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="p-4 bg-forest/5 border-b border-border flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-foreground">Live Chat</span>
              <span className="ml-auto text-xs text-muted-foreground">{messages.length} mesazhe</span>
            </div>

            <div ref={chatRef} className="p-4 h-80 overflow-y-auto space-y-2">
              {/* Pinned messages */}
              {pinnedMessages.map((m) => (
                <div key={m.id} className="rounded-xl px-3 py-2 bg-yellow-50 border border-yellow-200 mb-2">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="text-xs">📌</span>
                    <span className="text-xs font-semibold text-forest">{m.country_flag} {m.username}</span>
                    {m.is_admin && <span className="text-xs bg-yellow-400/80 text-yellow-900 px-1.5 rounded font-bold">⭐ Admin</span>}
                  </div>
                  <p className="text-sm text-foreground">{m.message}</p>
                </div>
              ))}

              {/* Regular messages */}
              {regularMessages.map((m) => {
                const isOwn = m.username === username;
                return (
                  <div key={m.id} className={`flex gap-2 ${isOwn ? "justify-end" : ""}`}>
                    {!isOwn && <span className="text-lg shrink-0">{m.country_flag}</span>}
                    <div
                      className={`rounded-xl px-3 py-2 max-w-[80%] ${
                        isOwn ? "text-cream" : ""
                      }`}
                      style={{
                        backgroundColor: isOwn ? "#1C3D2E" : "#F8F4ED",
                        color: isOwn ? "#F8F4ED" : undefined,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-xs font-semibold ${isOwn ? "text-accent" : "text-forest"}`}>
                          {m.username}
                        </span>
                        {m.is_admin && (
                          <span className="text-xs bg-yellow-400/80 text-yellow-900 px-1.5 rounded font-bold">⭐ Admin</span>
                        )}
                        <span className={`text-xs ${isOwn ? "opacity-50" : "text-muted-foreground"}`}>
                          {formatTime(m.created_at)}
                        </span>
                      </div>
                      <p className="text-sm">{m.message}</p>
                    </div>
                  </div>
                );
              })}

              {messages.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">
                  Asnjë mesazh ende. Bëhu i pari! 💬
                </p>
              )}
            </div>

            <div className="p-3 border-t border-border">
              {!username ? (
                <Button onClick={() => setShowModal(true)} className="w-full bg-forest hover:bg-pine text-cream">
                  Hyr në Chat
                </Button>
              ) : (
                <div className="space-y-1">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value.slice(0, 300))}
                      onKeyDown={(e) => e.key === "Enter" && send()}
                      placeholder="Shkruaj mesazhin..."
                      className="flex-1"
                      maxLength={300}
                    />
                    <Button onClick={send} size="icon" className="bg-forest hover:bg-pine text-cream shrink-0">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  {input.length > 200 && (
                    <p className="text-xs text-muted-foreground text-right">{input.length}/300</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Username Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-heading text-center">Hyr në Chat</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium text-foreground">Emri juaj</label>
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="P.sh. Arben"
                className="mt-1"
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Flamuri</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {FLAGS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setTempFlag(f)}
                    className={`text-2xl p-1 rounded-lg transition-all ${
                      tempFlag === f ? "bg-forest/10 ring-2 ring-forest scale-110" : "hover:bg-muted"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={handleJoin} className="w-full bg-forest hover:bg-pine text-cream" disabled={!tempName.trim()}>
              Hyr në Chat
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CommunityChat;
