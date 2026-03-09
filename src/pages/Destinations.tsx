import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const destinations = [
  { id: "theth-alps", emoji: "🏔️", title: "Theth Alps", location: "Shkodër", description: "Pristine mountain village with the iconic Blue Eye waterfall and Lock-in Tower.", price: 45, rating: 4.9, badge: "Bestseller", tags: ["Hiking", "Nature", "Village"], type: "agritourism", difficulty: "hard" },
  { id: "mrizi-zanave", emoji: "🍽️", title: "Mrizi i Zanave", location: "Theth", description: "Farm-to-table dining experience in Albania's most acclaimed agritourism.", price: 65, rating: 4.8, badge: "Organic", tags: ["Food", "Farm", "Premium"], type: "agritourism", difficulty: "easy" },
  { id: "berat-unesco", emoji: "🏛️", title: "Berat UNESCO", location: "Berat", description: "The City of a Thousand Windows — a living museum of Ottoman architecture.", price: 35, rating: 4.7, badge: "UNESCO", tags: ["History", "Architecture"], type: "day-tour", difficulty: "easy" },
  { id: "albanian-riviera", emoji: "🌊", title: "Albanian Riviera", location: "Riviera", description: "Crystal-clear Ionian waters with hidden beaches and coastal villages.", price: 55, rating: 4.8, tags: ["Beach", "Coast", "Summer"], type: "package", difficulty: "easy" },
  { id: "kantina-arberi", emoji: "🍷", title: "Kantina Arbëri", location: "Berat", description: "Wine cellar visited by Pope Francis — taste award-winning Albanian wines.", price: 25, rating: 4.6, badge: "Bestseller", tags: ["Wine", "Culture"], type: "wine-tasting", difficulty: "easy" },
  { id: "gjirokaster", emoji: "🏰", title: "Gjirokastër", location: "Gjirokastër", description: "The City of Stone — Ottoman-era architecture and a massive hilltop castle.", price: 30, rating: 4.7, badge: "UNESCO", tags: ["History", "Castle", "Culture"], type: "day-tour", difficulty: "medium" },
  { id: "valbona-valley", emoji: "⛰️", title: "Valbona Valley", location: "Shkodër", description: "Dramatic alpine valley perfect for the famous Valbona-Theth trail.", price: 40, rating: 4.8, tags: ["Hiking", "Alps", "Nature"], type: "agritourism", difficulty: "hard" },
  { id: "permet", emoji: "♨️", title: "Përmet", location: "Gjirokastër", description: "Thermal baths, organic food, and the gateway to Lengarica Canyon.", price: 35, rating: 4.6, tags: ["Wellness", "Nature", "Food"], type: "package", difficulty: "easy" },
  { id: "ksamil", emoji: "🏖️", title: "Ksamil Islands", location: "Sarandë", description: "Turquoise waters and tiny islands — Albania's answer to the Maldives.", price: 60, rating: 4.5, tags: ["Beach", "Islands", "Summer"], type: "boutique-hotel", difficulty: "easy" },
  { id: "sarande-coast", emoji: "🌅", title: "Sarandë Coast", location: "Sarandë", description: "Vibrant coastal city with stunning sunsets and easy access to Butrint.", price: 50, rating: 4.6, tags: ["Beach", "Coast"], type: "boutique-hotel", difficulty: "easy" },
  { id: "vlore-bay", emoji: "⛵", title: "Vlorë Bay", location: "Vlorë", description: "Where the Adriatic meets the Ionian — historic port city with great beaches.", price: 45, rating: 4.5, tags: ["Beach", "History"], type: "day-tour", difficulty: "easy" },
  { id: "theth-trail", emoji: "🥾", title: "Theth Trail", location: "Theth", description: "The legendary Valbona-Theth hiking trail through the Accursed Mountains.", price: 80, rating: 4.9, tags: ["Hiking", "Adventure"], type: "day-tour", difficulty: "hard" },
];

const locations = ["All", "Theth", "Berat", "Sarandë", "Shkodër", "Vlorë", "Gjirokastër", "Riviera"];
const types = [
  { value: "", label: "All" },
  { value: "agritourism", label: "Agritourism" },
  { value: "boutique-hotel", label: "Boutique Hotel" },
  { value: "wine-tasting", label: "Wine Tasting" },
  { value: "day-tour", label: "Day Tour" },
  { value: "package", label: "Package" },
];
const difficulties = ["All", "Easy", "Medium", "Hard"];
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
  const [filterLocation, setFilterLocation] = useState("All");
  const [filterType, setFilterType] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [filterRating, setFilterRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Read URL params on mount
  useEffect(() => {
    const loc = searchParams.get("location");
    const type = searchParams.get("type");
    if (loc) {
      const match = locations.find((l) => l.toLowerCase() === loc.toLowerCase());
      if (match) setFilterLocation(match);
    }
    if (type) setFilterType(type);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let results = destinations.filter((d) => {
      if (filterLocation !== "All" && d.location !== filterLocation) return false;
      if (filterType && d.type !== filterType) return false;
      if (d.price < priceRange[0] || d.price > priceRange[1]) return false;
      if (filterDifficulty !== "All" && d.difficulty !== filterDifficulty.toLowerCase()) return false;
      if (filterRating > 0 && d.rating < filterRating) return false;
      return true;
    });

    switch (sortBy) {
      case "price-asc": results.sort((a, b) => a.price - b.price); break;
      case "price-desc": results.sort((a, b) => b.price - a.price); break;
      case "rating": results.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }

    return results;
  }, [filterLocation, filterType, priceRange, filterDifficulty, filterRating, sortBy]);

  const resetFilters = () => {
    setFilterLocation("All");
    setFilterType("");
    setPriceRange([0, 500]);
    setFilterDifficulty("All");
    setFilterRating(0);
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Location */}
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

      {/* Type */}
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

      {/* Price Range */}
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

      {/* Difficulty */}
      <div>
        <h3 className="font-heading text-sm font-bold text-foreground mb-3">Difficulty</h3>
        <div className="flex flex-wrap gap-2">
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => setFilterDifficulty(d)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filterDifficulty === d ? "bg-forest text-cream" : "bg-card text-muted-foreground border border-border hover:bg-muted/50"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
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

      {/* Reset */}
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
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">Destinacione</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">Discover Albania's most authentic rural experiences</p>
          </motion.div>

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-28 bg-card rounded-2xl border border-border p-5 shadow-card">
                <h2 className="font-heading text-lg font-bold text-foreground mb-5">Filters</h2>
                <FilterSidebar />
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Top bar: count + sort + mobile filter toggle */}
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

              {/* Results grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((d, i) => (
                  <motion.div key={d.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                    <Link to={`/destination/${d.id}`} className="group block rounded-2xl overflow-hidden border border-border bg-card shadow-card hover:shadow-card-hover transition-all">
                      <div className="relative h-48 gradient-forest-ocean flex items-center justify-center">
                        <span className="text-5xl group-hover:scale-110 transition-transform">{d.emoji}</span>
                        {d.badge && (
                          <span className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full ${badgeColors[d.badge] || "bg-muted text-foreground"}`}>{d.badge}</span>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <span key={i} className={i < Math.floor(d.rating) ? "text-amber-400" : "text-border"}>★</span>
                            ))}
                            <span className="text-xs text-muted-foreground ml-1">{d.rating}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{d.location}</span>
                        </div>
                        <h3 className="font-heading text-xl font-bold text-foreground mb-1">{d.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{d.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-sage">€{d.price}</span>
                          <span className="text-sm font-semibold text-forest bg-seafoam/30 px-4 py-1.5 rounded-full">Shiko →</span>
                        </div>
                        <div className="flex gap-1.5 mt-2">
                          {d.tags.map((t) => (
                            <span key={t} className="text-xs bg-sand px-2 py-0.5 rounded-full text-muted-foreground">{t}</span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {filtered.length === 0 && (
                <p className="text-center text-muted-foreground py-12">No destinations found matching your filters.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
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
