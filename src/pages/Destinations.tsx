import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

interface Destination {
  id: string;
  name: string;
  type: string | null;
  zone: string | null;
  price: number | null;
  price_unit: string | null;
  description: string | null;
  emoji: string | null;
  badge: string | null;
  rating: number | null;
  review_count: number | null;
  image_url: string | null;
}

const typeLabels: Record<string, string> = {
  agro: "Agritourism",
  hotel: "Boutique Hotel",
  wine: "Wine Estate",
  beach: "Beach",
};

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "rating", label: "Rating" },
];

const badgeColors: Record<string, string> = {
  UNESCO: "bg-ocean text-cream",
  Bestseller: "bg-sage text-cream",
  Organic: "bg-seafoam text-forest",
};

const Destinations = () => {
  const [searchParams] = useSearchParams();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLocation, setFilterLocation] = useState("All");
  const [filterType, setFilterType] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [filterRating, setFilterRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("destinations")
        .select("id, name, type, zone, price, price_unit, description, emoji, badge, rating, review_count, image_url")
        .eq("status", "active")
        .order("created_at", { ascending: false });
      if (!error && data) setDestinations(data as Destination[]);
      setLoading(false);
    };
    load();
  }, []);

  const locations = useMemo(() => {
    const zones = Array.from(new Set(destinations.map((d) => d.zone).filter(Boolean))) as string[];
    return ["All", ...zones.sort()];
  }, [destinations]);

  const types = useMemo(() => {
    const t = Array.from(new Set(destinations.map((d) => d.type).filter(Boolean))) as string[];
    return [{ value: "", label: "All" }, ...t.map((v) => ({ value: v, label: typeLabels[v] || v }))];
  }, [destinations]);

  useEffect(() => {
    const loc = searchParams.get("location");
    const type = searchParams.get("type");
    if (loc) {
      const match = locations.find((l) => l.toLowerCase() === loc.toLowerCase());
      if (match) setFilterLocation(match);
    }
    if (type) setFilterType(type);
  }, [searchParams, locations]);

  const filtered = useMemo(() => {
    let results = destinations.filter((d) => {
      if (filterLocation !== "All" && d.zone !== filterLocation) return false;
      if (filterType && d.type !== filterType) return false;
      const price = d.price ?? 0;
      if (price < priceRange[0] || price > priceRange[1]) return false;
      if (filterRating > 0 && (d.rating ?? 0) < filterRating) return false;
      return true;
    });

    switch (sortBy) {
      case "price-asc": results = [...results].sort((a, b) => (a.price ?? 0) - (b.price ?? 0)); break;
      case "price-desc": results = [...results].sort((a, b) => (b.price ?? 0) - (a.price ?? 0)); break;
      case "rating": results = [...results].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
      default: break;
    }

    return results;
  }, [destinations, filterLocation, filterType, priceRange, filterRating, sortBy]);

  const resetFilters = () => {
    setFilterLocation("All");
    setFilterType("");
    setPriceRange([0, 500]);
    setFilterRating(0);
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-sm font-bold text-foreground mb-3">Location</h3>
        <div className="space-y-1.5">
          {locations.map((loc) => (
            <button
              key={loc}
              onClick={() => setFilterLocation(loc)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                filterLocation === loc ? "bg-forest text-cream font-medium" : "text-muted-foreground hover:bg-muted/50"
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-heading text-sm font-bold text-foreground mb-3">Type</h3>
        <div className="space-y-1.5">
          {types.map((t) => (
            <button
              key={t.value}
              onClick={() => setFilterType(t.value)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                filterType === t.value ? "bg-forest text-cream font-medium" : "text-muted-foreground hover:bg-muted/50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-heading text-sm font-bold text-foreground mb-3">Price Range</h3>
        <div className="px-1">
          <input
            type="range"
            min={0}
            max={500}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full accent-forest"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>€{priceRange[0]}</span>
            <span>€{priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-heading text-sm font-bold text-foreground mb-3">Rating</h3>
        <div className="space-y-1.5">
          {[
            { value: 0, label: "All" },
            { value: 4, label: "4+ stars" },
            { value: 4.5, label: "4.5+ stars" },
          ].map((r) => (
            <button
              key={r.value}
              onClick={() => setFilterRating(r.value)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                filterRating === r.value ? "bg-forest text-cream font-medium" : "text-muted-foreground hover:bg-muted/50"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={resetFilters}
        className="w-full py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Destinacione — Agroturizme & Hotele | Fshati.al"
        description="Destinacione rurali në Shqipëri. Agroturizme, hotele boutique, kantina verërash. UNESCO Berat, Alpet e Thethit, Riviera Jonike."
        path="/destinations"
      />
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">Destinacione</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">Discover Albania's most authentic rural experiences</p>
          </motion.div>

          <div className="flex gap-8">
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-28 bg-card rounded-2xl border border-border p-5 shadow-card">
                <h2 className="font-heading text-lg font-bold text-foreground mb-5">Filters</h2>
                <FilterSidebar />
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{filtered.length}</span> destinations found
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <SlidersHorizontal className="h-4 w-4" /> Filters
                  </button>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-xl bg-card px-4 py-2 text-sm text-foreground border border-border focus:ring-2 focus:ring-sage/50 outline-none"
                  >
                    {sortOptions.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {loading ? (
                <p className="text-center text-muted-foreground py-12">Duke ngarkuar destinacionet…</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.map((d, i) => (
                    <motion.div key={d.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                      <Link to={`/destination/${d.id}`} className="group block rounded-2xl overflow-hidden border border-border bg-card shadow-card hover:shadow-card-hover transition-all">
                        <div className="relative h-48 gradient-forest-ocean flex items-center justify-center overflow-hidden">
                          {d.image_url ? (
                            <img src={d.image_url} alt={d.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          ) : (
                            <span className="text-5xl group-hover:scale-110 transition-transform">{d.emoji || "🏞️"}</span>
                          )}
                          {d.badge && (
                            <span className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full ${badgeColors[d.badge] || "bg-muted text-foreground"}`}>{d.badge}</span>
                          )}
                        </div>
                        <div className="p-5">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }, (_, idx) => (
                                <span key={idx} className={idx < Math.floor(d.rating ?? 0) ? "text-amber-400" : "text-border"}>★</span>
                              ))}
                              <span className="text-xs text-muted-foreground ml-1">{d.rating ?? "—"}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{d.zone}</span>
                          </div>
                          <h3 className="font-heading text-xl font-bold text-foreground mb-1">{d.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{d.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-sage">€{d.price}{d.price_unit ? `/${d.price_unit}` : ""}</span>
                            <span className="text-sm font-semibold text-forest bg-seafoam/30 px-4 py-1.5 rounded-full">Shiko →</span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}

              {!loading && filtered.length === 0 && (
                <p className="text-center text-muted-foreground py-12">No destinations found matching your filters.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/30" onClick={() => setMobileFiltersOpen(false)} />
          <motion.div
            className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-card p-6 overflow-y-auto shadow-card-hover"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-lg font-bold text-foreground">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <FilterSidebar />
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Destinations;
