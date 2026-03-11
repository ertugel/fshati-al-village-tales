import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import BookingModal from "./BookingModal";

interface Tour {
  id: string;
  emoji: string | null;
  title: string;
  duration: string;
  price: number;
  description: string | null;
  difficulty: string | null;
  zone: string | null;
  duration_category: string;
}

const tabs = [
  { key: "day", label: "Day Tours", dbKey: "day" },
  { key: "3-4", label: "3-4 Days", dbKey: "3-4days" },
  { key: "5-7", label: "5-7 Days", dbKey: "5-7days" },
  { key: "10-11", label: "10-11 Days", dbKey: "10-11days" },
];

const difficultyColor: Record<string, string> = {
  Easy: "bg-seafoam/30 text-forest",
  Medium: "bg-amber-100 text-amber-800",
  Hard: "bg-red-100 text-red-700",
};

const ToursSection = () => {
  const [active, setActive] = useState("day");
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<{ id: string; type: "tour"; name: string; price: number } | null>(null);

  const activeDbKey = tabs.find((t) => t.key === active)?.dbKey || "day";

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("tours")
        .select("*")
        .eq("duration_category", activeDbKey)
        .order("created_at", { ascending: false });
      setTours((data as Tour[]) || []);
      setLoading(false);
    };
    fetchTours();
  }, [activeDbKey]);

  return (
    <section id="tours" className="py-20 bg-sand/50">
      <div className="container mx-auto px-4">
        <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">Turne & Eksperienca</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">From half-day adventures to complete country explorations</p>
        </motion.div>

        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                active === t.key ? "bg-forest text-cream" : "bg-card text-muted-foreground border border-border hover:bg-sand"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-2xl border border-border p-5">
                <Skeleton className="h-8 w-8 rounded mb-3" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full mb-4" />
                <Skeleton className="h-8 w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {tours.length === 0 ? (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  Nuk ka turne në këtë kategori ende.
                </div>
              ) : (
                tours.map((tour) => (
                  <div key={tour.id} className="bg-card rounded-2xl border border-border p-5 shadow-card hover:shadow-card-hover transition-all group">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-3xl">{tour.emoji}</span>
                      {tour.difficulty && (
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${difficultyColor[tour.difficulty] || "bg-muted text-foreground"}`}>
                          {tour.difficulty}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <span>⏱ {tour.duration}</span>
                      <span>•</span>
                      <span>📍 {tour.zone}</span>
                    </div>
                    <h3 className="font-heading text-lg font-bold text-foreground mb-1">{tour.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{tour.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-sage">€{tour.price}</span>
                      <button
                        onClick={() => setBooking({ id: tour.id, type: "tour", name: tour.title, price: tour.price })}
                        className="text-sm font-semibold text-forest bg-seafoam/30 hover:bg-seafoam/50 px-4 py-1.5 rounded-full transition-colors"
                      >
                        Book Tour
                      </button>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        )}

        <div className="text-center mt-10">
          <Link to="/tours" className="inline-block rounded-full bg-forest px-8 py-3 text-sm font-semibold text-cream hover:bg-pine transition-colors">
            Shiko të gjitha turnet →
          </Link>
        </div>
      </div>

      {booking && <BookingModal open={!!booking} onClose={() => setBooking(null)} item={booking} />}
    </section>
  );
};

export default ToursSection;
