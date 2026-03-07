import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const quickChips = [
  { emoji: "🏔️", label: "Destinations" },
  { emoji: "📅", label: "5-day itinerary" },
  { emoji: "📱", label: "eSIM" },
  { emoji: "🛡️", label: "Insurance" },
  { emoji: "🚗", label: "Car Rental" },
];

const responses: Record<string, string> = {
  destination: "🏔️ Top destinations: **Theth Alps** (hiking paradise), **Berat** (UNESCO city), **Albanian Riviera** (crystal beaches), **Përmet** (thermal baths). Each offers unique rural experiences!",
  itinerary: "📅 **5-Day Albania Itinerary:**\nDay 1: Tirana → Berat (UNESCO)\nDay 2: Berat → Përmet (thermal baths)\nDay 3: Përmet → Gjirokastër\nDay 4: Gjirokastër → Ksamil/Butrint\nDay 5: Riviera → Vlorë → Tirana\nBudget: ~€400-600/person",
  esim: "📱 Get an **eSIM before your flight!** We recommend:\n• Holafly — unlimited data, €19/5 days\n• Airalo — flexible plans from €5\n• Saily by NordVPN — great coverage\nActivates instantly, no physical SIM needed!",
  insurance: "🛡️ **Travel insurance** is essential for Albania's adventures:\n• SafetyWing — €2/day, covers hiking\n• World Nomads — rafting/climbing covered\n• Heymondo — 24/7 assistance\nCan activate even after departure!",
  car: "🚗 **Car rental tips:**\n• SUV/4×4 recommended for Alps & rural roads\n• Economy fine for coast & cities\n• Book via our partners: Europcar, SIXT, RentFromLocals\n• International license required\n• Budget: €25-60/day",
  default: "👋 Përshëndetje! I'm your Fshati.al travel assistant. Ask me about destinations, itineraries, eSIM, insurance, car rental, or budget planning for Albania!",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.match(/destinat|theth|berat|alp|beach|riviera|where/)) return responses.destination;
  if (lower.match(/itinerar|day|plan|route|schedule/)) return responses.itinerary;
  if (lower.match(/esim|sim|internet|data|connect/)) return responses.esim;
  if (lower.match(/insur|safety|cover|protect/)) return responses.insurance;
  if (lower.match(/car|rent|drive|suv|4x4/)) return responses.car;
  return responses.default;
}

interface Message {
  role: "user" | "assistant";
  text: string;
}

const AIAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: responses.default },
  ]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", text: text.trim() };
    const botMsg: Message = { role: "assistant", text: getResponse(text) };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-forest text-cream shadow-lg hover:bg-pine transition-colors flex items-center justify-center text-2xl"
        aria-label="AI Assistant"
      >
        {open ? "✕" : "🤖"}
      </button>

      {/* Chat modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-card rounded-2xl border border-border shadow-xl overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{ height: "480px" }}
          >
            {/* Header */}
            <div className="p-4 bg-forest text-cream flex items-center gap-3">
              <span className="text-2xl">🤖</span>
              <div>
                <h3 className="font-heading text-lg font-bold">Fshati AI</h3>
                <p className="text-xs text-cream/60">Your Albanian travel assistant</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line ${
                      m.role === "user"
                        ? "bg-forest text-cream"
                        : "bg-sand text-foreground"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick chips */}
            <div className="px-4 pb-2 flex gap-1.5 flex-wrap">
              {quickChips.map((c) => (
                <button
                  key={c.label}
                  onClick={() => send(c.label)}
                  className="text-xs bg-sand rounded-full px-3 py-1.5 text-muted-foreground hover:bg-seafoam/30 transition-colors"
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send(input)}
                placeholder="Ask about Albania..."
                className="flex-1 rounded-xl bg-background px-4 py-2.5 text-sm outline-none border border-border focus:ring-2 focus:ring-sage/50"
              />
              <button
                onClick={() => send(input)}
                className="rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-cream hover:bg-pine transition-colors"
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
