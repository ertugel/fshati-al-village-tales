import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

interface Guide {
  id: string;
  name: string;
  specialization: string | null;
  languages: string[] | null;
  zones: string[] | null;
  price_per_day: number | null;
  price_max: number | null;
  rating: number | null;
  avatar_emoji: string | null;
}

const priceLabel = (g: Guide) => {
  if (!g.price_per_day) return "Kontakto";
  if (g.price_max && g.price_max !== g.price_per_day) return `€${g.price_per_day}-${g.price_max}/day`;
  return `€${g.price_per_day}/day`;
};

const Guides = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("guides")
        .select("id, name, specialization, languages, zones, price_per_day, price_max, rating, avatar_emoji")
        .eq("is_active", true)
        .order("rating", { ascending: false });
      if (!error && data) setGuides(data as Guide[]);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Guida Lokale Shqipëri — Certifikuar ATOA | Fshati.al"
        description="Guida lokale të certifikuara. Alpinizëm, UNESCO, Wine Tours, Adventure. Rezervo guidën tënde nga €60/ditë."
        path="/guides"
      />
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">Guida Lokale</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">Certified local guides who bring Albanian stories to life</p>
          </motion.div>

          {loading ? (
            <p className="text-center text-muted-foreground py-12">Duke ngarkuar guidat…</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {guides.map((g, i) => (
                <motion.div key={g.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/guide/${g.id}`} className="bg-card rounded-2xl border border-border p-5 shadow-card hover:shadow-card-hover transition-all text-center group block">
                    <div className="text-5xl mb-3 group-hover:scale-110 transition-transform inline-block">{g.avatar_emoji || "🧭"}</div>
                    <h3 className="font-heading text-lg font-bold text-foreground">{g.name}</h3>
                    <p className="text-sm text-sage font-medium mb-2">{g.specialization}</p>
                    {g.languages && g.languages.length > 0 && (
                      <p className="text-xs text-muted-foreground mb-1">{g.languages.join(" · ")}</p>
                    )}
                    {g.zones && g.zones.length > 0 && (
                      <p className="text-xs text-muted-foreground mb-3">📍 {g.zones.join(", ")}</p>
                    )}
                    <div className="flex items-center justify-center gap-1 mb-3">
                      <span className="text-amber-400">★</span>
                      <span className="text-sm font-medium">{g.rating ?? "—"}</span>
                    </div>
                    <div className="pt-3 border-t border-border">
                      <span className="text-base font-bold text-forest">{priceLabel(g)}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
          {!loading && guides.length === 0 && <p className="text-center text-muted-foreground py-12">No guides available yet.</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Guides;
