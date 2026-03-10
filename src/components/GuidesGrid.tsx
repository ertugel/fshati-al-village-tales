import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import BookingModal from "./BookingModal";

interface Guide {
  id: string;
  avatar: string;
  name: string;
  specialization: string;
  languages: string;
  zones: string;
  price: string;
  priceNum: number;
}

const guides: Guide[] = [
  { id: "mikel-gashi", avatar: "🧔", name: "Mikel Gashi", specialization: "Hiking & Alps", languages: "🇦🇱 🇬🇧 🇩🇪", zones: "Theth, Valbona", price: "€60-80/day", priceNum: 60 },
  { id: "erion-alla", avatar: "👨‍🏫", name: "Erion Alla", specialization: "UNESCO Heritage", languages: "🇦🇱 🇬🇧 🇮🇹", zones: "Berat, Gjirokastër", price: "€70-90/day", priceNum: 70 },
  { id: "flamur-xheka", avatar: "🧑‍🍳", name: "Flamur Xheka", specialization: "Wine & Gastro", languages: "🇦🇱 🇬🇧 🇫🇷", zones: "Berat, Elbasan", price: "€80-110/day", priceNum: 80 },
  { id: "mirela-tafa", avatar: "👩‍💼", name: "Mirela Tafa", specialization: "Riviera & Coast", languages: "🇦🇱 🇬🇧 🇮🇹", zones: "Vlorë, Sarandë", price: "€60-80/day", priceNum: 60 },
  { id: "vjollca-hoxha", avatar: "🧘‍♀️", name: "Vjollca Hoxha", specialization: "Wellness & Yoga", languages: "🇦🇱 🇬🇧", zones: "Përmet, Tiranë", price: "€60-80/day", priceNum: 60 },
  { id: "taulant-bregu", avatar: "🚴", name: "Taulant Bregu", specialization: "MTB & Cycling", languages: "🇦🇱 🇬🇧 🇩🇪", zones: "Multi-region", price: "€70-100/day", priceNum: 70 },
  { id: "genta-marku", avatar: "👩‍🎓", name: "Genta Marku", specialization: "History & Culture", languages: "🇦🇱 🇬🇧 🇫🇷 🇪🇸", zones: "Tiranë, Korçë", price: "€55-75/day", priceNum: 55 },
  { id: "ardit-hoxha", avatar: "🛶", name: "Ardit Hoxha", specialization: "Kayak & Water", languages: "🇦🇱 🇬🇧", zones: "Shkodër, Ohrid", price: "€65-85/day", priceNum: 65 },
];

const GuidesGrid = () => {
  const [booking, setBooking] = useState<{ id: string; type: "guide"; name: string; price: number } | null>(null);

  return (
    <section id="guides" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">Guida Lokale</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">Certified local guides who bring Albanian stories to life</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {guides.map((g, i) => (
            <motion.div key={g.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <div className="bg-card rounded-2xl border border-border p-5 shadow-card hover:shadow-card-hover transition-all text-center group">
                <Link to={`/guide/${g.id}`}>
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform inline-block">{g.avatar}</div>
                  <h3 className="font-heading text-lg font-bold text-foreground">{g.name}</h3>
                  <p className="text-sm text-sage font-medium mb-2">{g.specialization}</p>
                  <p className="text-lg mb-1">{g.languages}</p>
                  <p className="text-xs text-muted-foreground mb-3">📍 {g.zones}</p>
                  <div className="pt-3 border-t border-border mb-3">
                    <span className="text-base font-bold text-forest">{g.price}</span>
                  </div>
                </Link>
                <button
                  onClick={() => setBooking({ id: g.id, type: "guide", name: g.name, price: g.priceNum })}
                  className="w-full text-sm font-semibold text-cream bg-forest hover:bg-pine px-4 py-2 rounded-full transition-colors"
                >
                  Book Guide
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/guides" className="inline-block rounded-full bg-forest px-8 py-3 text-sm font-semibold text-cream hover:bg-pine transition-colors">
            Shiko të gjithë guidat →
          </Link>
        </div>
      </div>

      {booking && (
        <BookingModal open={!!booking} onClose={() => setBooking(null)} item={booking} />
      )}
    </section>
  );
};

export default GuidesGrid;
