import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import BookingModal from "./BookingModal";

interface Tour {
  emoji: string;
  title: string;
  duration: string;
  price: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  zone: string;
}

const tabs = [
  { key: "day", label: "Day Tours" },
  { key: "3-4", label: "3-4 Days" },
  { key: "5-7", label: "5-7 Days" },
  { key: "10-11", label: "10-11 Days" },
];

const tours: Record<string, Tour[]> = {
  day: [
    { emoji: "🏞️", title: "Osum Canyon", duration: "1 day", price: "€60", description: "Hike through Albania's Grand Canyon with turquoise river pools.", difficulty: "Medium", zone: "Berat" },
    { emoji: "🚣", title: "Rafting Osumi", duration: "1 day", price: "€65", description: "White-water rafting through stunning canyon walls.", difficulty: "Hard", zone: "Çorovodë" },
    { emoji: "🏛️", title: "Berat City Walk", duration: "Half day", price: "€15", description: "Guided UNESCO walking tour through the City of a Thousand Windows.", difficulty: "Easy", zone: "Berat" },
    { emoji: "⛴️", title: "Lake Koman Ferry", duration: "1 day", price: "€85", description: "Scenic ferry through fjord-like landscapes of northern Albania.", difficulty: "Easy", zone: "Shkodër" },
    { emoji: "🏖️", title: "Butrint + Ksamil", duration: "1 day", price: "€45", description: "Ancient ruins and pristine island beaches in one trip.", difficulty: "Easy", zone: "Sarandë" },
    { emoji: "🍳", title: "Cooking Class", duration: "Half day", price: "€35", description: "Learn to make byrek, tavë kosi and other Albanian classics.", difficulty: "Easy", zone: "Tiranë" },
  ],
  "3-4": [
    { emoji: "🏔️", title: "Albania in 3 Days", duration: "3 days", price: "€550", description: "Best highlights: Berat, Gjirokastër, Blue Eye in one trip.", difficulty: "Medium", zone: "Multi-region" },
    { emoji: "🏛️", title: "UNESCO Cities", duration: "3 days", price: "€380", description: "Berat and Gjirokastër — two UNESCO heritage cities.", difficulty: "Easy", zone: "South" },
    { emoji: "⛰️", title: "Alps Trek 4D", duration: "4 days", price: "€480", description: "Theth–Valbona crossing with local mountain guides.", difficulty: "Hard", zone: "Northern Alps" },
  ],
  "5-7": [
    { emoji: "🧘", title: "Wellness Retreat 5D", duration: "5 days", price: "€900", description: "Thermal baths, yoga, organic cuisine in Përmet.", difficulty: "Easy", zone: "Përmet" },
    { emoji: "🍷", title: "Wine & Gastro 5D", duration: "5 days", price: "€750", description: "Albania's best wineries, olive groves, and farm stays.", difficulty: "Easy", zone: "Multi-region" },
  ],
  "10-11": [
    { emoji: "🗺️", title: "North to South 11D", duration: "11 days", price: "€1,480", description: "Complete Albania — Alps to Riviera, cities to villages.", difficulty: "Medium", zone: "Full country" },
  ],
};

const difficultyColor: Record<string, string> = {
  Easy: "bg-seafoam/30 text-forest",
  Medium: "bg-amber-100 text-amber-800",
  Hard: "bg-red-100 text-red-700",
};

const ToursSection = () => {
  const [active, setActive] = useState("day");
  const [booking, setBooking] = useState<{ id: string; type: "tour"; name: string; price: number } | null>(null);

  return (
    <section id="tours" className="py-20 bg-sand/50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">
            Turne & Eksperienca
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            From half-day adventures to complete country explorations
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                active === t.key
                  ? "bg-forest text-cream"
                  : "bg-card text-muted-foreground border border-border hover:bg-sand"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tour Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {tours[active]?.map((tour) => (
              <div
                key={tour.title}
                className="bg-card rounded-2xl border border-border p-5 shadow-card hover:shadow-card-hover transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{tour.emoji}</span>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${difficultyColor[tour.difficulty]}`}>
                    {tour.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span>⏱ {tour.duration}</span>
                  <span>•</span>
                  <span>📍 {tour.zone}</span>
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-1">{tour.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{tour.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-sage">{tour.price}</span>
                  <button
                    onClick={() => setBooking({ id: crypto.randomUUID(), type: "tour", name: tour.title, price: parseFloat(tour.price.replace(/[^0-9]/g, "")) })}
                    className="text-sm font-semibold text-forest bg-seafoam/30 hover:bg-seafoam/50 px-4 py-1.5 rounded-full transition-colors"
                  >
                    Rezervo
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="text-center mt-10">
          <Link to="/tours" className="inline-block rounded-full bg-forest px-8 py-3 text-sm font-semibold text-cream hover:bg-pine transition-colors">
            Shiko të gjitha turnet →
          </Link>
        </div>
      </div>

      {booking && (
        <BookingModal
          open={!!booking}
          onClose={() => setBooking(null)}
          item={booking}
        />
      )}
    </section>
  );
};

export default ToursSection;
