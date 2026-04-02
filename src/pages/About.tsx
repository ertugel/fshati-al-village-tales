import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, CalendarCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import SEOHead from "@/components/SEOHead";

const steps = [
  { icon: Search, title: "Search", description: "Browse 300+ authentic rural destinations, local guides, and curated tours across Albania." },
  { icon: CalendarCheck, title: "Book", description: "Reserve instantly with secure payments. Flexible cancellation on most experiences." },
  { icon: Sparkles, title: "Experience", description: "Immerse yourself in village life — homemade food, mountain trails, and warm hospitality." },
];

const stats = [
  { value: "300+", label: "Destinations" },
  { value: "50+", label: "Local Guides" },
  { value: "12K", label: "Happy Tourists" },
  { value: "4.9★", label: "Average Rating" },
];

const team = [
  { emoji: "👨‍💻", name: "Alban Kryeziu", title: "Founder & CEO", bio: "Born in the Albanian Alps, Alban is passionate about bringing sustainable tourism to rural communities." },
  { emoji: "🧑‍🌾", name: "Elona Shala", title: "Local Expert & COO", bio: "With 10+ years in hospitality, Elona ensures every experience on Fshati.al meets the highest standards." },
  { emoji: "👩‍💻", name: "Besnik Hoxha", title: "Tech Lead & CTO", bio: "Besnik builds the technology that connects travelers with Albania's hidden gems seamlessly." },
];

const About = () => {
  return (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="Rreth Nesh — Fshati.al | Albania Rural Tourism Platform"
      description="Fshati.al është platforma e parë shqiptare e turizmit rural. Misioni: të lidhë turistët me familjet e fshatrave shqiptare."
      path="/about"
    />
    <Navbar />

    {/* Hero */}
    <section className="relative pt-20">
      <div className="gradient-hero py-24 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            className="font-heading text-4xl md:text-6xl font-bold text-cream max-w-4xl mx-auto leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Albania's villages deserve to be discovered
          </motion.h1>
          <motion.p
            className="mt-6 text-cream/70 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            We connect travelers with authentic rural experiences — real homes, real stories, real Albanian hospitality.
          </motion.p>
        </div>
      </div>
    </section>

    {/* How it works */}
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-14">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <step.icon className="h-7 w-7 text-primary" />
              </div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Step {i + 1}</div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Impact stats */}
    <section className="py-16 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto text-center">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i }}
            >
              <div className="font-heading text-4xl md:text-5xl font-bold text-primary">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Team */}
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-14">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {team.map((t, i) => (
            <motion.div
              key={t.name}
              className="bg-card rounded-2xl border border-border p-8 text-center shadow-[var(--shadow-card)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center text-4xl mx-auto mb-4">
                {t.emoji}
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground">{t.name}</h3>
              <p className="text-xs font-medium text-accent-foreground/60 uppercase tracking-wide mb-3">{t.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="gradient-hero rounded-3xl py-16 px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-cream mb-4">Own an accommodation in rural Albania?</h2>
          <p className="text-cream/70 mb-8 max-w-xl mx-auto">List your property on Fshati.al and reach thousands of travelers looking for authentic experiences.</p>
          <Button asChild size="lg" className="rounded-full bg-seafoam text-forest font-semibold hover:bg-seafoam/90 px-8">
            <Link to="/become-a-partner">Join as Accommodation Owner</Link>
          </Button>
        </div>
      </div>
    </section>

    <BackToTop />
    <Footer />
  </div>
  );
};

export default About;
