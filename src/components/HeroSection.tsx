import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const stats = [
  { value: "300+", label: "Destinacione" },
  { value: "50+", label: "Guida Lokale" },
  { value: "7", label: "Paketa Tematike" },
  { value: "12K+", label: "Turistë/Vit" },
];

const typeOptions = [
  { value: "agritourism", label: "Agroturizëm" },
  { value: "boutique-hotel", label: "Boutique Hotel" },
  { value: "wine-tasting", label: "Wine Tasting" },
  { value: "day-tour", label: "Day Tour" },
  { value: "package", label: "Paketë" },
];

const Particle = ({ delay, x, y }: { delay: number; x: number; y: number }) => (
  <motion.div
    className="absolute w-1.5 h-1.5 rounded-full bg-seafoam/30"
    style={{ left: `${x}%`, top: `${y}%` }}
    animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
    transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay }}
  />
);

const HeroSection = () => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3,
      }))
    );
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location.trim()) params.set("location", location.trim());
    if (type) params.set("type", type);
    if (date) params.set("date", date);
    navigate(`/destinations?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero">
      {particles.map((p) => (
        <Particle key={p.id} delay={p.delay} x={p.x} y={p.y} />
      ))}

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 220" fill="none" className="w-full" preserveAspectRatio="none">
          <path d="M0 220V140L120 100L240 130L360 80L480 120L600 60L720 110L840 50L960 90L1080 70L1200 100L1320 80L1440 120V220H0Z" fill="hsl(40 33% 95%)" />
          <path d="M0 220V160L180 130L360 150L540 110L720 140L900 100L1080 130L1260 110L1440 150V220H0Z" fill="hsl(40 33% 95%)" fillOpacity="0.6" />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-4 pt-24 pb-32">
        <motion.div className="max-w-3xl mx-auto text-center" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-cream leading-tight mb-6">
            Ku çdo fshat tregon{" "}
            <span className="italic text-seafoam">një histori</span>
          </h1>
          <p className="text-lg md:text-xl text-cream/70 max-w-2xl mx-auto mb-10 font-body">
            Agritourism, local guides and thematic tours — everything to discover authentic Albania
          </p>

          <motion.div
            className="bg-card/95 backdrop-blur-md rounded-2xl p-3 shadow-card-hover flex flex-col md:flex-row gap-3 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <input
              type="text"
              placeholder="🏔️ Destinacioni..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 rounded-xl bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border focus:ring-2 focus:ring-sage/50"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 rounded-xl bg-background px-4 py-3 text-sm text-foreground outline-none border border-border focus:ring-2 focus:ring-sage/50"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="flex-1 rounded-xl bg-background px-4 py-3 text-sm text-foreground outline-none border border-border focus:ring-2 focus:ring-sage/50 appearance-none"
            >
              <option value="">Lloji...</option>
              {typeOptions.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <button
              onClick={handleSearch}
              className="rounded-xl bg-forest px-6 py-3 text-sm font-semibold text-cream hover:bg-pine transition-colors whitespace-nowrap"
            >
              Kërko
            </button>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-4xl font-heading font-bold text-cream">{s.value}</div>
                <div className="text-sm text-cream/60 mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
