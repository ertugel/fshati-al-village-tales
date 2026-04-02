import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const tabs = [
  { key: "all", label: "Të gjitha" },
  { key: "day", label: "Day Tours" },
  { key: "3-4", label: "3-4 Ditë" },
  { key: "5-7", label: "5-7 Ditë" },
  { key: "10-11", label: "10-11 Ditë" },
];

const zones = ["All", "Berat", "Çorovodë", "Shkodër", "Sarandë", "Tiranë", "Multi-region", "South", "Northern Alps", "Përmet", "Full country"];
const difficulties = ["All", "Easy", "Medium", "Hard"];

interface Tour {
  id: string; emoji: string; title: string; duration: string; durationCategory: string;
  price: string; description: string; difficulty: "Easy" | "Medium" | "Hard"; zone: string;
}

const allTours: Tour[] = [
  { id: "osum-canyon", emoji: "🏞️", title: "Osum Canyon", duration: "1 day", durationCategory: "day", price: "€60", description: "Hike through Albania's Grand Canyon with turquoise river pools.", difficulty: "Medium", zone: "Berat" },
  { id: "rafting-osumi", emoji: "🚣", title: "Rafting Osumi", duration: "1 day", durationCategory: "day", price: "€65", description: "White-water rafting through stunning canyon walls.", difficulty: "Hard", zone: "Çorovodë" },
  { id: "berat-city-walk", emoji: "🏛️", title: "Berat City Walk", duration: "Half day", durationCategory: "day", price: "€15", description: "Guided UNESCO walking tour through the City of a Thousand Windows.", difficulty: "Easy", zone: "Berat" },
  { id: "lake-koman-ferry", emoji: "⛴️", title: "Lake Koman Ferry", duration: "1 day", durationCategory: "day", price: "€85", description: "Scenic ferry through fjord-like landscapes of northern Albania.", difficulty: "Easy", zone: "Shkodër" },
  { id: "butrint-ksamil", emoji: "🏖️", title: "Butrint + Ksamil", duration: "1 day", durationCategory: "day", price: "€45", description: "Ancient ruins and pristine island beaches in one trip.", difficulty: "Easy", zone: "Sarandë" },
  { id: "cooking-class", emoji: "🍳", title: "Cooking Class", duration: "Half day", durationCategory: "day", price: "€35", description: "Learn to make byrek, tavë kosi and other Albanian classics.", difficulty: "Easy", zone: "Tiranë" },
  { id: "albania-3-days", emoji: "🏔️", title: "Albania in 3 Days", duration: "3 days", durationCategory: "3-4", price: "€550", description: "Best highlights: Berat, Gjirokastër, Blue Eye in one trip.", difficulty: "Medium", zone: "Multi-region" },
  { id: "unesco-cities", emoji: "🏛️", title: "UNESCO Cities", duration: "3 days", durationCategory: "3-4", price: "€380", description: "Berat and Gjirokastër — two UNESCO heritage cities.", difficulty: "Easy", zone: "South" },
  { id: "alps-trek-4d", emoji: "⛰️", title: "Alps Trek 4D", duration: "4 days", durationCategory: "3-4", price: "€480", description: "Theth–Valbona crossing with local mountain guides.", difficulty: "Hard", zone: "Northern Alps" },
  { id: "wellness-retreat-5d", emoji: "🧘", title: "Wellness Retreat 5D", duration: "5 days", durationCategory: "5-7", price: "€900", description: "Thermal baths, yoga, organic cuisine in Përmet.", difficulty: "Easy", zone: "Përmet" },
  { id: "wine-gastro-5d", emoji: "🍷", title: "Wine & Gastro 5D", duration: "5 days", durationCategory: "5-7", price: "€750", description: "Albania's best wineries, olive groves, and farm stays.", difficulty: "Easy", zone: "Multi-region" },
  { id: "north-south-11d", emoji: "🗺️", title: "North to South 11D", duration: "11 days", durationCategory: "10-11", price: "€1,480", description: "Complete Albania — Alps to Riviera, cities to villages.", difficulty: "Medium", zone: "Full country" },
];

const difficultyColor: Record<string, string> = {
  Easy: "bg-seafoam/30 text-forest",
  Medium: "bg-amber-100 text-amber-800",
  Hard: "bg-red-100 text-red-700",
};

const Tours = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [zone, setZone] = useState("All");
  const [difficulty, setDifficulty] = useState("All");

  const filtered = allTours.filter((t) => {
    if (activeTab !== "all" && t.durationCategory !== activeTab) return false;
    if (zone !== "All" && t.zone !== zone) return false;
    if (difficulty !== "All" && t.difficulty !== difficulty) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">Turne & Eksperienca</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">From half-day adventures to complete country explorations</p>
          </motion.div>

          {/* Duration tabs */}
          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            {tabs.map((t) => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === t.key ? "bg-forest text-cream" : "bg-card text-muted-foreground border border-border hover:bg-sand"}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex justify-center gap-4 mb-10 flex-wrap">
            <select value={zone} onChange={(e) => setZone(e.target.value)} className="rounded-xl bg-card px-4 py-2 text-sm border border-border">
              {zones.map((z) => <option key={z} value={z}>{z === "All" ? "📍 All Zones" : `📍 ${z}`}</option>)}
            </select>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="rounded-xl bg-card px-4 py-2 text-sm border border-border">
              {difficulties.map((d) => <option key={d} value={d}>{d === "All" ? "⚡ All Levels" : `⚡ ${d}`}</option>)}
            </select>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={`${activeTab}-${zone}-${difficulty}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
              {filtered.map((tour) => (
                <Link to={`/tour/${tour.id}`} key={tour.id} className="bg-card rounded-2xl border border-border p-5 shadow-card hover:shadow-card-hover transition-all group block">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{tour.emoji}</span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${difficultyColor[tour.difficulty]}`}>{tour.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span>⏱ {tour.duration}</span><span>•</span><span>📍 {tour.zone}</span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-1">{tour.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{tour.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-sage">{tour.price}</span>
                    <span className="text-sm font-semibold text-forest bg-seafoam/30 px-4 py-1.5 rounded-full">Shiko →</span>
                  </div>
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">No tours match your filters.</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Tours;
