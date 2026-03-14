import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";

const services = [
  {
    emoji: "🚗", title: "Car Rental",
    description: "SUV 4×4 for the Alps, economy for the city. 5-15% commission per booking.",
    partners: ["Albania Airport RC", "ARA Albania", "RentFromLocals", "Europcar", "SIXT", "Enterprise"],
  },
  {
    emoji: "📱", title: "eSIM & Internet",
    description: "Stay connected from day one. Activates before your flight.",
    partners: ["Holafly", "Airalo", "SafetyWing eSIM", "Saily/NordVPN"], badge: "Commission",
  },
  {
    emoji: "🛡️", title: "Travel Insurance",
    description: "Covers adventure activities. Can activate after departure.",
    partners: ["SafetyWing (€2/day)", "World Nomads", "Heymondo", "AXA", "Allianz"], badge: "Recurring",
  },
];

const AffiliateServices = () => {
  const { t } = useLanguage();

  return (
    <section id="services" className="py-20 gradient-forest-ocean">
      <div className="container mx-auto px-4">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-cream mb-3">{t("sections.services_title")}</h2>
          <p className="text-cream/60 max-w-lg mx-auto">{t("sections.services_sub")}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div key={s.title} className="bg-pine/40 backdrop-blur-sm rounded-2xl p-6 border border-seafoam/20 hover:border-seafoam/40 transition-all"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{s.emoji}</span>
                <div>
                  <h3 className="font-heading text-xl font-bold text-cream">{s.title}</h3>
                  {s.badge && <span className="text-xs bg-seafoam/20 text-seafoam px-2 py-0.5 rounded-full">{s.badge} commission</span>}
                </div>
              </div>
              <p className="text-sm text-cream/70 mb-5">{s.description}</p>
              <div className="flex flex-wrap gap-2">
                {s.partners.map((p) => <span key={p} className="text-xs bg-forest/60 text-cream/80 px-3 py-1.5 rounded-full">{p}</span>)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AffiliateServices;
