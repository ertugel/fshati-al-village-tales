import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/hooks/useLanguage";
import BookingModal from "./BookingModal";

interface Destination {
  id: string; emoji: string; name: string; zone: string; description: string;
  price: number; price_unit: string; rating: number; review_count: number;
  badge: string | null; featured: boolean; image_gradient: string | null; type: string | null;
  image_url: string | null;
}

const badgeColors: Record<string, string> = {
  UNESCO: "bg-ocean text-cream", Bestseller: "bg-sage text-cream",
  Organic: "bg-seafoam text-forest", Bregdet: "bg-ocean text-cream",
  "Wine Estate": "bg-[hsl(var(--accent))] text-cream",
};

const Stars = ({ rating, count }: { rating: number; count: number }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.floor(rating) ? "text-amber-400" : "text-border"}>★</span>
    ))}
    <span className="text-xs text-muted-foreground ml-1">{rating} ({count})</span>
  </div>
);

const DestinationsGrid = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<{ id: string; type: "accommodation"; name: string; price: number } | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from("destinations").select("*").eq("status", "active")
        .order("featured", { ascending: false }).order("rating", { ascending: false });
      if (error) setError(error.message);
      else setDestinations((data as Destination[]) || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const getBadgeLabel = (badge: string) => {
    const key = `badge.${badge}` as any;
    return t(key) || badge;
  };

  return (
    <section id="destinations" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">{t("sections.destinations_title")}</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">{t("sections.destinations_sub")}</p>
        </motion.div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-5 space-y-3"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-1/2" /></div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <p className="text-destructive">{t("dest.error")}: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((d, i) => (
              <motion.div key={d.id} className={d.featured && i === 0 ? "md:col-span-2" : ""} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="group rounded-2xl overflow-hidden border border-border bg-card shadow-card hover:shadow-card-hover transition-all h-full flex flex-col">
                  <Link to={`/destination/${d.id}`}>
                    <div className={`relative ${d.featured && i === 0 ? "h-64" : "h-48"} flex items-center justify-center overflow-hidden`} style={!d.image_url ? { background: d.image_gradient || "linear-gradient(135deg,#1a4a2e,#0d2b3e)" } : undefined}>
                      {d.image_url ? (
                        <img src={d.image_url} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                      ) : (
                        <span className={`${d.featured && i === 0 ? "text-7xl" : "text-5xl"} group-hover:scale-110 transition-transform`}>{d.emoji}</span>
                      )}
                      {d.badge && (
                        <span className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full ${badgeColors[d.badge] || "bg-muted text-foreground"}`}>{getBadgeLabel(d.badge)}</span>
                      )}
                    </div>
                    <div className="p-5 pb-2 flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <Stars rating={d.rating} count={d.review_count} />
                        <span className="text-xs text-muted-foreground">{d.zone}</span>
                      </div>
                      <h3 className="font-heading text-xl font-bold text-foreground mb-1">{d.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{d.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-sage">€{d.price}/{d.price_unit}</span>
                        <span className="text-sm font-semibold text-forest bg-seafoam/30 px-4 py-1.5 rounded-full">{t("dest.view")}</span>
                      </div>
                    </div>
                  </Link>
                  <div className="px-5 pb-5 pt-2 mt-auto">
                    <button
                      onClick={() => setBooking({ id: d.id, type: "accommodation", name: d.name, price: d.price })}
                      className="w-full text-sm font-semibold text-cream bg-forest hover:bg-pine px-4 py-2.5 rounded-full transition-colors"
                    >
                      {t("dest.book")}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/destinations" className="inline-block rounded-full bg-forest px-8 py-3 text-sm font-semibold text-cream hover:bg-pine transition-colors">
            {t("dest.view_all")}
          </Link>
        </div>
      </div>

      {booking && <BookingModal open={!!booking} onClose={() => setBooking(null)} item={booking} />}
    </section>
  );
};

export default DestinationsGrid;
