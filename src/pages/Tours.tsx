import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import TourCardBody from "@/components/TourCardBody";
import { difficultyClass, type TourListItem } from "@/lib/tours";

const Tours = () => {
  const [tours, setTours] = useState<TourListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [zone, setZone] = useState("All");
  const [difficulty, setDifficulty] = useState("All");

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("tours")
        .select("id, title, duration, duration_category, price, difficulty, zone, description, emoji")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (!error && data) setTours(data);
      setLoading(false);
    };
    load();
  }, []);

  const tabs = useMemo(() => {
    const cats = Array.from(new Set(tours.map((t) => t.duration_category)));
    return [{ key: "all", label: "Të gjitha" }, ...cats.map((c) => ({ key: c, label: c }))];
  }, [tours]);

  const zones = useMemo(
    () => ["All", ...(Array.from(new Set(tours.map((t) => t.zone).filter(Boolean))) as string[]).sort()],
    [tours]
  );
  const difficulties = useMemo(
    () => ["All", ...(Array.from(new Set(tours.map((t) => t.difficulty).filter(Boolean))) as string[])],
    [tours]
  );

  const filtered = tours.filter((t) => {
    if (activeTab !== "all" && t.duration_category !== activeTab) return false;
    if (zone !== "All" && t.zone !== zone) return false;
    if (difficulty !== "All" && t.difficulty !== difficulty) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Ture në Shqipëri — 1 deri 11 Ditë | Fshati.al"
        description="Ture të guiduara nga Theth, Berat, Gjirokastra dhe Riviera. Guida lokale të certifikuara ATOA."
        path="/tours"
      />
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">Turne & Eksperienca</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">From half-day adventures to complete country explorations</p>
          </motion.div>

          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            {tabs.map((t) => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === t.key ? "bg-forest text-cream" : "bg-card text-muted-foreground border border-border hover:bg-sand"}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex justify-center gap-4 mb-10 flex-wrap">
            <select value={zone} onChange={(e) => setZone(e.target.value)} className="rounded-xl bg-card px-4 py-2 text-sm border border-border">
              {zones.map((z) => <option key={z} value={z}>{z === "All" ? "📍 All Zones" : `📍 ${z}`}</option>)}
            </select>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="rounded-xl bg-card px-4 py-2 text-sm border border-border">
              {difficulties.map((d) => <option key={d} value={d}>{d === "All" ? "⚡ All Levels" : `⚡ ${d}`}</option>)}
            </select>
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground py-12">Duke ngarkuar turet…</p>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={`${activeTab}-${zone}-${difficulty}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
                {filtered.map((tour) => (
                  <Link to={`/tour/${tour.id}`} key={tour.id} className="bg-card rounded-2xl border border-border p-5 shadow-card hover:shadow-card-hover transition-all group block">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-3xl">{tour.emoji || "🧭"}</span>
                      {tour.difficulty && <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${difficultyClass(tour.difficulty)}`}>{tour.difficulty}</span>}
                    </div>
                    <TourCardBody tour={tour} action={
                      <span className="text-sm font-semibold text-forest bg-seafoam/30 px-4 py-1.5 rounded-full">Shiko →</span>
                    } />
                  </Link>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
          {!loading && filtered.length === 0 && <p className="text-center text-muted-foreground py-12">No tours match your filters.</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Tours;
