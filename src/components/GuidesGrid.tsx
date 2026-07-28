import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import BookingModal from "./BookingModal";

type Guide = Tables<"guides">;

const priceLabel = (g: Guide) =>
  g.price_max && g.price_max > g.price_per_day
    ? `€${g.price_per_day}-${g.price_max}/day`
    : `€${g.price_per_day}/day`;

const GuidesGrid = () => {
  const [booking, setBooking] = useState<{ id: string; type: "guide"; name: string; price: number } | null>(null);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("guides")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(8);
      setGuides(data || []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <section id="guides" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">{t("sections.guides_title")}</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">{t("sections.guides_sub")}</p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 rounded-2xl border border-border bg-card animate-pulse" />
            ))}
          </div>
        ) : guides.length === 0 ? (
          <p className="text-center text-muted-foreground">—</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {guides.map((g, i) => (
              <motion.div key={g.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <div className="bg-card rounded-2xl border border-border p-5 shadow-card hover:shadow-card-hover transition-all text-center group">
                  <Link to={`/guide/${g.id}`}>
                    <div className="text-5xl mb-3 group-hover:scale-110 transition-transform inline-block">{g.avatar_emoji || "🧭"}</div>
                    <h3 className="font-heading text-lg font-bold text-foreground">{g.name}</h3>
                    <p className="text-sm text-sage font-medium mb-2">{g.specialization}</p>
                    <p className="text-lg mb-1">{(g.languages || []).join(" ")}</p>
                    <p className="text-xs text-muted-foreground mb-3">📍 {(g.zones || []).join(", ")}</p>
                    <div className="pt-3 border-t border-border mb-3">
                      <span className="text-base font-bold text-forest">{priceLabel(g)}</span>
                    </div>
                  </Link>
                  <button onClick={() => setBooking({ id: g.id, type: "guide", name: g.name, price: Number(g.price_per_day) })}
                    className="w-full text-sm font-semibold text-cream bg-forest hover:bg-pine px-4 py-2 rounded-full transition-colors">
                    {t("guides.book")}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/guides" className="inline-block rounded-full bg-forest px-8 py-3 text-sm font-semibold text-cream hover:bg-pine transition-colors">
            {t("guides.view_all")}
          </Link>
        </div>
      </div>
      {booking && <BookingModal open={!!booking} onClose={() => setBooking(null)} item={booking} />}
    </section>
  );
};

export default GuidesGrid;
