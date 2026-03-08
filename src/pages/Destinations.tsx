import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const destinations = [
  { id: "theth-alps", emoji: "🏔️", title: "Theth Alps", location: "Shkodër, Northern Alps", description: "Pristine mountain village with the iconic Blue Eye waterfall and Lock-in Tower.", price: "€45/night", rating: 4.9, badge: "Bestseller", tags: ["Hiking", "Nature", "Village"] },
  { id: "mrizi-zanave", emoji: "🍽️", title: "Mrizi i Zanave", location: "Lezhë, Central Albania", description: "Farm-to-table dining experience in Albania's most acclaimed agritourism.", price: "€65/person", rating: 4.8, badge: "Organic", tags: ["Food", "Farm", "Premium"] },
  { id: "berat-unesco", emoji: "🏛️", title: "Berat UNESCO", location: "Berat, Central Albania", description: "The City of a Thousand Windows — a living museum of Ottoman architecture.", price: "€35/night", rating: 4.7, badge: "UNESCO", tags: ["History", "Architecture"] },
  { id: "albanian-riviera", emoji: "🌊", title: "Albanian Riviera", location: "Vlorë — Sarandë Coast", description: "Crystal-clear Ionian waters with hidden beaches and coastal villages.", price: "€55/night", rating: 4.8, tags: ["Beach", "Coast", "Summer"] },
  { id: "kantina-arberi", emoji: "🍷", title: "Kantina Arbëri", location: "Berat Wine Region", description: "Wine cellar visited by Pope Francis — taste award-winning Albanian wines.", price: "€25/tasting", rating: 4.6, badge: "Bestseller", tags: ["Wine", "Culture"] },
  { id: "gjirokaster", emoji: "🏰", title: "Gjirokastër", location: "South Albania", description: "The City of Stone — Ottoman-era architecture and a massive hilltop castle.", price: "€30/night", rating: 4.7, badge: "UNESCO", tags: ["History", "Castle", "Culture"] },
  { id: "valbona-valley", emoji: "⛰️", title: "Valbona Valley", location: "Kukës, Northern Alps", description: "Dramatic alpine valley perfect for the famous Valbona-Theth trail.", price: "€40/night", rating: 4.8, tags: ["Hiking", "Alps", "Nature"] },
  { id: "permet", emoji: "♨️", title: "Përmet", location: "Përmet, South Albania", description: "Thermal baths, organic food, and the gateway to Lengarica Canyon.", price: "€35/night", rating: 4.6, tags: ["Wellness", "Nature", "Food"] },
  { id: "ksamil", emoji: "🏖️", title: "Ksamil Islands", location: "Sarandë, South Coast", description: "Turquoise waters and tiny islands — Albania's answer to the Maldives.", price: "€60/night", rating: 4.5, tags: ["Beach", "Islands", "Summer"] },
];

const allTags = [...new Set(destinations.flatMap((d) => d.tags))];

const badgeColors: Record<string, string> = {
  UNESCO: "bg-ocean text-cream",
  Bestseller: "bg-sage text-cream",
  Organic: "bg-seafoam text-forest",
};

const Destinations = () => {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filtered = destinations.filter((d) => {
    const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase()) || d.location.toLowerCase().includes(search.toLowerCase());
    const matchesTag = !selectedTag || d.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">Destinacione</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">Discover Albania's most authentic rural experiences</p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-10 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="🔍 Search destinations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-xl bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border focus:ring-2 focus:ring-sage/50"
            />
          </div>
          <div className="flex justify-center gap-2 mb-10 flex-wrap">
            <button onClick={() => setSelectedTag(null)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!selectedTag ? "bg-forest text-cream" : "bg-card text-muted-foreground border border-border hover:bg-sand"}`}>
              All
            </button>
            {allTags.map((tag) => (
              <button key={tag} onClick={() => setSelectedTag(tag)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedTag === tag ? "bg-forest text-cream" : "bg-card text-muted-foreground border border-border hover:bg-sand"}`}>
                {tag}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((d, i) => (
              <motion.div key={d.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
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
                      <span className="text-lg font-bold text-sage">{d.price}</span>
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
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">No destinations found matching your search.</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Destinations;
