import { useRef } from "react";
import { motion } from "framer-motion";

const packages = [
  {
    emoji: "🏔️",
    title: "Albanian Alps 4D",
    price: "€180/person",
    color: "from-forest to-pine",
    includes: ["2 nights guesthouse", "Mountain guide", "Transport", "Meals"],
  },
  {
    emoji: "🍷",
    title: "Wine & Gastronomy 3D",
    price: "€220/person",
    color: "from-ocean to-sky",
    includes: ["Boutique hotel", "Wine guide", "3 wineries", "Cooking class"],
  },
  {
    emoji: "🏛️",
    title: "UNESCO & History 5D",
    price: "€280/person",
    color: "from-sage to-forest",
    includes: ["Hotel stays", "History guide", "Transport", "Entry tickets"],
  },
  {
    emoji: "🌊",
    title: "Riviera Escape 4D",
    price: "€200/person",
    color: "from-sky to-ocean",
    includes: ["Beachfront stay", "Boat tour", "Snorkeling", "Meals"],
  },
  {
    emoji: "🧘",
    title: "Wellness Retreat 5D",
    price: "€320/person",
    color: "from-pine to-sage",
    includes: ["Spa hotel", "Yoga sessions", "Thermal baths", "Organic meals"],
  },
  {
    emoji: "🚵",
    title: "Extreme Adventure 4D",
    price: "€200/person",
    color: "from-forest to-ocean",
    includes: ["Camp/guesthouse", "Guide", "Equipment", "Transport"],
  },
  {
    emoji: "🎭",
    title: "Culture & Traditions 3D",
    price: "€150/person",
    color: "from-sage to-sky",
    includes: ["Local homestay", "Cultural guide", "Workshops", "Meals"],
  },
];

const ThematicPackages = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="packages" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">
            Paketa Tematike
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            All-inclusive curated experiences — accommodation, guide, transport & activities
          </p>
        </motion.div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {packages.map((pkg) => (
            <motion.div
              key={pkg.title}
              className="min-w-[280px] max-w-[300px] snap-center rounded-2xl overflow-hidden border border-border bg-card shadow-card hover:shadow-card-hover transition-all shrink-0"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className={`bg-gradient-to-br ${pkg.color} p-6 text-center`}>
                <span className="text-4xl block mb-2">{pkg.emoji}</span>
                <h3 className="font-heading text-xl font-bold text-cream">{pkg.title}</h3>
              </div>
              <div className="p-5">
                <ul className="space-y-2 mb-5">
                  {pkg.includes.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="text-seafoam">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-forest">{pkg.price}</span>
                  <button className="rounded-full bg-forest px-4 py-2 text-sm font-semibold text-cream hover:bg-pine transition-colors">
                    Rezervo
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThematicPackages;
