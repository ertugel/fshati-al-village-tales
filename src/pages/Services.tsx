import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const services = [
  {
    emoji: "🚗", title: "Car Rental", description: "SUV 4×4 for the Alps, economy for the city. Compare prices from top providers and book the perfect vehicle for your Albanian adventure.",
    partners: [
      { name: "Albania Airport RC", url: "#" }, { name: "ARA Albania", url: "#" }, { name: "RentFromLocals", url: "#" },
      { name: "Europcar", url: "#" }, { name: "SIXT", url: "#" }, { name: "Enterprise", url: "#" },
    ],
    tips: ["4x4 recommended for Northern Alps roads", "Book 2+ weeks in advance for summer", "International license required", "Fuel stations sparse in rural areas"],
  },
  {
    emoji: "📱", title: "eSIM & Internet", description: "Stay connected from day one. Activate your eSIM before landing — no physical SIM swap needed. Works with most modern phones.",
    partners: [
      { name: "Holafly", url: "#" }, { name: "Airalo", url: "#" }, { name: "SafetyWing eSIM", url: "#" }, { name: "Saily/NordVPN", url: "#" },
    ],
    tips: ["Check phone eSIM compatibility first", "Holafly offers unlimited data plans", "Buy before your flight for instant activation", "Coverage is good in cities, limited in remote Alps"],
  },
  {
    emoji: "🛡️", title: "Travel Insurance", description: "Essential coverage for adventure activities including hiking, rafting, and mountain sports. Can be activated even after departure.",
    partners: [
      { name: "SafetyWing (€2/day)", url: "#" }, { name: "World Nomads", url: "#" }, { name: "Heymondo", url: "#" },
      { name: "AXA", url: "#" }, { name: "Allianz", url: "#" },
    ],
    tips: ["Ensure adventure sports are covered", "SafetyWing allows post-departure purchase", "Medical evacuation coverage recommended for Alps", "Check COVID policy before purchasing"],
  },
  {
    emoji: "🚐", title: "Airport Transfers", description: "Pre-book reliable transfers from Tirana International Airport to any destination in Albania. Comfortable vehicles with English-speaking drivers.",
    partners: [
      { name: "Albania Transfer", url: "#" }, { name: "GoAlbania", url: "#" }, { name: "Welcome Pickups", url: "#" },
    ],
    tips: ["Book 24h+ in advance", "Prices fixed — no meter worries", "Flight monitoring included", "Child seats available on request"],
  },
];

const Services = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">Shërbime Udhëtimi</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">Everything you need for a seamless Albanian adventure</p>
        </motion.div>

        <div className="space-y-8">
          {services.map((s, i) => (
            <motion.div key={s.title} className="bg-card rounded-2xl border border-border p-8 shadow-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl">{s.emoji}</span>
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground">{s.title}</h2>
                  <p className="text-muted-foreground">{s.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-3">Partnerët</h3>
                  <div className="flex flex-wrap gap-2">
                    {s.partners.map((p) => (
                      <a key={p.name} href={p.url} className="flex items-center gap-1.5 text-sm bg-sand px-4 py-2 rounded-full text-foreground hover:bg-seafoam/30 transition-colors">
                        {p.name} <ExternalLink className="h-3 w-3" />
                      </a>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-3">Këshilla</h3>
                  <ul className="space-y-2">
                    {s.tips.map((tip) => (
                      <li key={tip} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-sage mt-0.5">✓</span> {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default Services;
