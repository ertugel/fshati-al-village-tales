import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const team = [
  { emoji: "👨‍💻", name: "Alban Kryeziu", role: "Founder & CEO" },
  { emoji: "👩‍🎨", name: "Elona Shala", role: "Head of Design" },
  { emoji: "🧑‍🌾", name: "Besnik Hoxha", role: "Community Manager" },
  { emoji: "👩‍💼", name: "Drita Marku", role: "Partnerships" },
];

const values = [
  { emoji: "🌱", title: "Sustainability", description: "We promote responsible tourism that preserves Albania's natural beauty and supports local communities." },
  { emoji: "🤝", title: "Authenticity", description: "Every experience on our platform is genuine — real homes, real stories, real Albanian hospitality." },
  { emoji: "💡", title: "Innovation", description: "We use technology to make rural tourism accessible while keeping the human touch at the center." },
  { emoji: "❤️", title: "Community", description: "We empower rural communities by bringing tourism revenue directly to villages and families." },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-6xl block mb-4">🏔️</span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">Rreth Fshati.al</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Albania's first rural tourism marketplace — connecting travelers with authentic village experiences, local guides, and curated adventures since 2025.
          </p>
        </motion.div>

        {/* Story */}
        <motion.div className="max-w-3xl mx-auto mb-20 space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="font-heading text-3xl font-bold text-foreground">Historia Jonë</h2>
          <p className="text-foreground/80 leading-relaxed">
            Fshati.al was born from a simple observation: Albania has incredible rural destinations, warm hospitality, and unique cultural experiences — but no unified platform to connect these treasures with travelers from around the world.
          </p>
          <p className="text-foreground/80 leading-relaxed">
            We started in the Albanian Alps, working directly with guesthouse owners in Theth and Valbona. We saw how tourism could transform livelihoods while preserving traditions. Today, we connect over 300 destinations, 50+ local guides, and curated thematic tours across the entire country.
          </p>
          <p className="text-foreground/80 leading-relaxed">
            Our mission is to make Albanian rural tourism accessible, sustainable, and unforgettable — while ensuring that tourism revenue flows directly to the communities that make these experiences possible.
          </p>
        </motion.div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-10">Vlerat Tona</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div key={v.title} className="bg-card rounded-2xl border border-border p-6 text-center shadow-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                <span className="text-4xl block mb-3">{v.emoji}</span>
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-10">Ekipi</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {team.map((t, i) => (
              <motion.div key={t.name} className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}>
                <div className="w-20 h-20 rounded-full bg-sage/20 flex items-center justify-center text-4xl mx-auto mb-3">{t.emoji}</div>
                <h3 className="font-heading text-base font-bold text-foreground">{t.name}</h3>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default About;
