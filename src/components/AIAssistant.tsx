import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const quickChips = [
  { emoji: "🏔️", label: "Best destinations in Albania" },
  { emoji: "📅", label: "Plan a 5-day itinerary" },
  { emoji: "💰", label: "Budget tips for Albania" },
  { emoji: "🥾", label: "Best hiking trails" },
  { emoji: "🍽️", label: "Traditional Albanian food" },
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: Message[];
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (msg: string) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok) {
    const data = await resp.json().catch(() => ({}));
    onError(data.error || "Failed to get response");
    return;
  }

  if (!resp.body) { onError("No response body"); return; }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, newlineIndex);
      buffer = buffer.slice(newlineIndex + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;
      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") { onDone(); return; }
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onDelta(content);
      } catch {
        buffer = line + "\n" + buffer;
        break;
      }
    }
  }
  onDone();
}

const AIAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "👋 Përshëndetje! I'm **Fshati AI**, your Albanian travel assistant. Ask me about destinations, tours, itineraries, or anything about traveling in Albania!" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length === allMessages.length + 1) {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    await streamChat({
      messages: allMessages.filter((m) => m.content),
      onDelta: upsertAssistant,
      onDone: () => setIsLoading(false),
      onError: (msg) => {
        toast.error(msg);
        setIsLoading(false);
      },
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-forest text-cream shadow-lg hover:bg-pine transition-colors flex items-center justify-center text-2xl"
        aria-label="AI Assistant"
      >
        {open ? "✕" : "🤖"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] bg-card rounded-2xl border border-border shadow-xl overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{ height: "520px" }}
          >
            <div className="p-4 bg-forest text-cream flex items-center gap-3">
              <span className="text-2xl">🤖</span>
              <div>
                <h3 className="font-heading text-lg font-bold">Fshati AI</h3>
                <p className="text-xs text-cream/60">Powered by AI · Your travel assistant</p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      m.role === "user"
                        ? "bg-forest text-cream"
                        : "bg-sand text-foreground"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none [&>p]:m-0 [&>ul]:mt-1 [&>ol]:mt-1">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : (
                      m.content
                    )}
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="bg-sand text-foreground rounded-2xl px-4 py-2.5 text-sm">
                    <span className="animate-pulse">Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="px-4 pb-2 flex gap-1.5 flex-wrap">
              {quickChips.map((c) => (
                <button
                  key={c.label}
                  onClick={() => send(c.label)}
                  disabled={isLoading}
                  className="text-xs bg-sand rounded-full px-3 py-1.5 text-muted-foreground hover:bg-seafoam/30 transition-colors disabled:opacity-50"
                >
                  {c.emoji} {c.label.split(" ").slice(0, 2).join(" ")}
                </button>
              ))}
            </div>

            <div className="p-3 border-t border-border flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send(input)}
                placeholder="Ask about Albania..."
                disabled={isLoading}
                className="flex-1 rounded-xl bg-background px-4 py-2.5 text-sm outline-none border border-border focus:ring-2 focus:ring-sage/50 disabled:opacity-50"
              />
              <button
                onClick={() => send(input)}
                disabled={isLoading || !input.trim()}
                className="rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-cream hover:bg-pine transition-colors disabled:opacity-50"
              >
                →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
