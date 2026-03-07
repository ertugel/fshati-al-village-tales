import { useState } from "react";
import { motion } from "framer-motion";

const initialMessages = [
  { flag: "🇩🇪", name: "Klaus", text: "Just arrived in Theth — the views are unreal! Any restaurant tips?", time: "2 min ago" },
  { flag: "🇮🇹", name: "Sofia", text: "Mrizi i Zanave was the best meal of my life 🍽️", time: "5 min ago" },
  { flag: "🇬🇧", name: "James", text: "Is the Valbona-Theth trail doable in November?", time: "8 min ago" },
  { flag: "🇦🇱", name: "Guide Mikel", text: "Yes James! November is still good, just bring layers. I can guide you 🏔️", time: "7 min ago" },
];

const CommunityChat = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { flag: "🧳", name: "You", text: input.trim(), time: "Just now" },
    ]);
    setInput("");
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
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse-dot" />
              <span className="text-sm text-muted-foreground">24 online now</span>
            </div>
          </motion.div>

          <motion.div
            className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="p-4 bg-forest/5 border-b border-border flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-dot" />
              <span className="text-sm font-medium text-foreground">Live Chat</span>
            </div>
            <div className="p-4 h-72 overflow-y-auto space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.name === "You" ? "justify-end" : ""}`}>
                  {m.name !== "You" && <span className="text-lg shrink-0">{m.flag}</span>}
                  <div className={`rounded-xl px-3 py-2 max-w-[80%] ${m.name === "You" ? "bg-forest text-cream" : "bg-sand"}`}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-xs font-semibold ${m.name === "You" ? "text-seafoam" : "text-forest"}`}>{m.name}</span>
                      <span className={`text-xs ${m.name === "You" ? "text-cream/50" : "text-muted-foreground"}`}>{m.time}</span>
                    </div>
                    <p className="text-sm">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-border flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Type a message..."
                className="flex-1 rounded-xl bg-background px-4 py-2.5 text-sm outline-none border border-border focus:ring-2 focus:ring-sage/50"
              />
              <button
                onClick={send}
                className="rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-cream hover:bg-pine transition-colors"
              >
                Send
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CommunityChat;
