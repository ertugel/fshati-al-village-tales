import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar, ChevronDown, Search } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useLanguage } from "@/hooks/useLanguage";

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
  const { settings } = useSiteSettings();
  const { t, lang } = useLanguage();

  const stats = [
    { value: "300+", label: t("stats.destinations") },
    { value: "50+", label: t("stats.guides") },
    { value: "7", label: t("stats.packages") },
    { value: "12K+", label: t("stats.tourists") },
  ];

  const typeOptions = [
    { value: "agritourism", label: t("hero.type.agritourism") },
    { value: "boutique-hotel", label: t("hero.type.boutique") },
    { value: "wine-tasting", label: t("hero.type.wine") },
    { value: "day-tour", label: t("hero.type.daytour") },
    { value: "package", label: t("hero.type.package") },
  ];

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

  // Use site settings if available, otherwise use translation
  const headline = settings.hero_headline && settings.hero_headline !== "Ku çdo fshat tregon një histori"
    ? settings.hero_headline
    : t("hero.headline");
  const subtext = settings.hero_sub && settings.hero_sub !== "Agroturizme, guida lokale dhe ture tematike"
    ? settings.hero_sub
    : t("hero.sub");

  // Italic highlight for both languages
  const italicWord = lang === "sq" ? "një histori" : "a story";
  const parts = headline.split(new RegExp(`(${italicWord})`, "i"));

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
            {parts.length > 1 ? (
              <>
                {parts[0]}
                <span className="italic text-seafoam">{parts[1]}</span>
                {parts[2]}
              </>
            ) : (
              headline
            )}
          </h1>
          <p className="text-lg md:text-xl text-cream/70 max-w-2xl mx-auto mb-10 font-body">
            {subtext}
          </p>

          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="relative group">
              {/* Decorative glow */}
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-seafoam/10 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-sky/10 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-700" />

              <div className="relative bg-cream/10 backdrop-blur-2xl border border-cream/20 rounded-[2.5rem] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.3)] p-2 flex flex-col md:flex-row items-center transition-all duration-500 hover:shadow-[0_48px_100px_-24px_rgba(0,0,0,0.4)]">

                {/* Destination */}
                <div className="flex-[1.5] w-full group/field relative flex flex-col justify-center px-6 md:px-8 py-4 rounded-[2.2rem] hover:bg-cream/5 transition-all duration-300">
                  <label className="text-[10px] font-bold text-cream/50 uppercase tracking-[0.15em] mb-1 group-hover/field:text-seafoam transition-colors flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" />
                    {t("hero.where_label")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("hero.search_placeholder")}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="bg-transparent border-none outline-none text-cream placeholder:text-cream/30 text-sm font-semibold w-full focus:ring-0 p-0"
                  />
                </div>

                <div className="hidden md:block w-px h-12 bg-cream/10" />

                {/* Date */}
                <div className="flex-1 w-full group/field relative flex flex-col justify-center px-6 md:px-8 py-4 rounded-[2.2rem] hover:bg-cream/5 transition-all duration-300">
                  <label className="text-[10px] font-bold text-cream/50 uppercase tracking-[0.15em] mb-1 group-hover/field:text-seafoam transition-colors flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    {t("hero.when_label")}
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-transparent border-none outline-none text-cream text-sm font-semibold w-full focus:ring-0 p-0 appearance-none"
                    style={{ colorScheme: "dark" }}
                  />
                </div>

                <div className="hidden md:block w-px h-12 bg-cream/10" />

                {/* Category */}
                <div className="flex-1 w-full group/field relative flex flex-col justify-center px-6 md:px-8 py-4 rounded-[2.2rem] hover:bg-cream/5 transition-all duration-300">
                  <label className="text-[10px] font-bold text-cream/50 uppercase tracking-[0.15em] mb-1 group-hover/field:text-seafoam transition-colors flex items-center gap-1.5">
                    <ChevronDown className="w-3 h-3" />
                    {t("hero.category_label")}
                  </label>
                  <div className="relative">
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="bg-transparent border-none outline-none text-cream text-sm font-semibold w-full focus:ring-0 p-0 appearance-none cursor-pointer pr-6"
                    >
                      <option value="">{t("hero.search_type")}</option>
                      {typeOptions.map((to) => (
                        <option key={to.value} value={to.value}>{to.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/30 pointer-events-none" />
                  </div>
                </div>

                {/* Search Button */}
                <div className="p-1 w-full md:w-auto">
                  <button
                    onClick={handleSearch}
                    className="w-full md:w-auto h-12 md:h-14 px-8 bg-cream text-forest rounded-[2rem] font-bold text-sm tracking-tight flex items-center justify-center gap-3 transition-all duration-300 hover:bg-seafoam hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 group/btn"
                  >
                    <span>{t("hero.search_btn")}</span>
                    <div className="bg-forest/10 p-1.5 rounded-full group-hover/btn:bg-forest/20 transition-colors">
                      <Search className="w-4 h-4 text-forest" />
                    </div>
                  </button>
                </div>

              </div>
            </div>
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
