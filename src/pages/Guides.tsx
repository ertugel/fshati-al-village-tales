import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const guides = [
  { id: "mikel-gashi", avatar: "🧔", name: "Mikel Gashi", specialization: "Hiking & Alps", languages: "🇦🇱 🇬🇧 🇩🇪", zones: "Theth, Valbona", price: "€60-80/day", rating: 4.9 },
  { id: "erion-alla", avatar: "👨‍🏫", name: "Erion Alla", specialization: "UNESCO Heritage", languages: "🇦🇱 🇬🇧 🇮🇹", zones: "Berat, Gjirokastër", price: "€70-90/day", rating: 4.8 },
  { id: "flamur-xheka", avatar: "🧑‍🍳", name: "Flamur Xheka", specialization: "Wine & Gastro", languages: "🇦🇱 🇬🇧 🇫🇷", zones: "Berat, Elbasan", price: "€80-110/day", rating: 4.7 },
  { id: "mirela-tafa", avatar: "👩‍💼", name: "Mirela Tafa", specialization: "Riviera & Coast", languages: "🇦🇱 🇬🇧 🇮🇹", zones: "Vlorë, Sarandë", price: "€60-80/day", rating: 4.8 },
  { id: "vjollca-hoxha", avatar: "🧘‍♀️", name: "Vjollca Hoxha", specialization: "Wellness & Yoga", languages: "🇦🇱 🇬🇧", zones: "Përmet, Tiranë", price: "€60-80/day", rating: 4.6 },
  { id: "taulant-bregu", avatar: "🚴", name: "Taulant Bregu", specialization: "MTB & Cycling", languages: "🇦🇱 🇬🇧 🇩🇪", zones: "Multi-region", price: "€70-100/day", rating: 4.7 },
  { id: "genta-marku", avatar: "👩‍🎓", name: "Genta Marku", specialization: "History & Culture", languages: "🇦🇱 🇬🇧 🇫🇷 🇪🇸", zones: "Tiranë, Korçë", price: "€55-75/day", rating: 4.9 },
  { id: "ardit-hoxha", avatar: "🛶", name: "Ardit Hoxha", specialization: "Kayak & Water", languages: "🇦🇱 🇬🇧", zones: "Shkodër, Ohrid", price: "€65-85/day", rating: 4.5 },
];

const Guides = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">Guida Lokale</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">Certified local guides who bring Albanian stories to life</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {guides.map((g, i) => (
            <motion.div key={g.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/guide/${g.id}`} className="bg-card rounded-2xl border border-border p-5 shadow-card hover:shadow-card-hover transition-all text-center group block">
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform inline-block">{g.avatar}</div>
                <h3 className="font-heading text-lg font-bold text-foreground">{g.name}</h3>
                <p className="text-sm text-sage font-medium mb-2">{g.specialization}</p>
                <p className="text-lg mb-1">{g.languages}</p>
                <p className="text-xs text-muted-foreground mb-3">📍 {g.zones}</p>
                <div className="flex items-center justify-center gap-1 mb-3">
                  <span className="text-amber-400">★</span>
                  <span className="text-sm font-medium">{g.rating}</span>
                </div>
                <div className="pt-3 border-t border-border">
                  <span className="text-base font-bold text-forest">{g.price}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default Guides;
