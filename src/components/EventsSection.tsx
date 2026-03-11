import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface Event {
  id: string;
  emoji: string | null;
  title: string;
  start_date: string;
  end_date: string | null;
  location: string;
  zone: string | null;
  price_note: string | null;
  description: string | null;
  featured: boolean | null;
}

const EventsSection = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("status", "upcoming")
        .order("start_date", { ascending: true });
      setEvents((data as Event[]) || []);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  if (!loading && events.length === 0) return null;

  return (
    <section id="events" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">Evente & Festivale</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">Discover upcoming cultural events, festivals and experiences across Albania</p>
        </motion.div>

        {loading ? (
          <div className="flex gap-5 overflow-x-auto pb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-[300px] rounded-2xl p-6" style={{ background: "linear-gradient(135deg,#1a4a2e,#0d2b3e)" }}>
                <Skeleton className="h-10 w-10 rounded mb-3 bg-white/10" />
                <Skeleton className="h-5 w-3/4 mb-2 bg-white/10" />
                <Skeleton className="h-3 w-full bg-white/10" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
            {events.map((ev, i) => (
              <motion.div
                key={ev.id}
                className="min-w-[300px] max-w-[340px] rounded-2xl p-6 text-cream flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#1C3D2E,#0d2b3e)" }}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="text-4xl block mb-3">{ev.emoji}</span>
                <h3 className="font-heading text-lg font-bold mb-1">{ev.title}</h3>
                <p className="text-sm text-cream/70 mb-2">
                  📅 {format(new Date(ev.start_date), "dd MMM yyyy")}
                  {ev.end_date && ` — ${format(new Date(ev.end_date), "dd MMM")}`}
                </p>
                <p className="text-sm text-cream/70 mb-1">📍 {ev.location}</p>
                <p className="text-sm text-cream/60 mb-4 line-clamp-2">{ev.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-seafoam">{ev.price_note}</span>
                  <button className="text-sm font-semibold bg-cream/10 hover:bg-cream/20 text-cream px-4 py-1.5 rounded-full transition-colors">
                    Shiko Detajet
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;
