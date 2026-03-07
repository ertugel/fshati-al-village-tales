import { motion } from "framer-motion";

interface Destination {
  emoji: string;
  title: string;
  location: string;
  description: string;
  price: string;
  rating: number;
  badge?: string;
  tags: string[];
  featured?: boolean;
}

const destinations: Destination[] = [
  {
    emoji: "🏔️",
    title: "Theth Alps",
    location: "Shkodër, Northern Alps",
    description: "Pristine mountain village with the iconic Blue Eye waterfall and Lock-in Tower.",
    price: "€45/night",
    rating: 4.9,
    badge: "Bestseller",
    tags: ["Hiking", "Nature", "Village"],
    featured: true,
  },
  {
    emoji: "🍽️",
    title: "Mrizi i Zanave",
    location: "Lezhë, Central Albania",
    description: "Farm-to-table dining experience in Albania's most acclaimed agritourism.",
    price: "€65/person",
    rating: 4.8,
    badge: "Organic",
    tags: ["Food", "Farm", "Premium"],
  },
  {
    emoji: "🏛️",
    title: "Berat UNESCO",
    location: "Berat, Central Albania",
    description: "The City of a Thousand Windows — a living museum of Ottoman architecture.",
    price: "€35/night",
    rating: 4.7,
    badge: "UNESCO",
    tags: ["History", "Architecture"],
  },
  {
    emoji: "🌊",
    title: "Albanian Riviera",
    location: "Vlorë — Sarandë Coast",
    description: "Crystal-clear Ionian waters with hidden beaches and coastal villages.",
    price: "€55/night",
    rating: 4.8,
    tags: ["Beach", "Coast", "Summer"],
  },
  {
    emoji: "🍷",
    title: "Kantina Arbëri",
    location: "Berat Wine Region",
    description: "Wine cellar visited by Pope Francis — taste award-winning Albanian wines.",
    price: "€25/tasting",
    rating: 4.6,
    badge: "Bestseller",
    tags: ["Wine", "Culture"],
  },
];

const badgeColors: Record<string, string> = {
  UNESCO: "bg-ocean text-cream",
  Bestseller: "bg-sage text-cream",
  Organic: "bg-seafoam text-forest",
};

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.floor(rating) ? "text-amber-400" : "text-border"}>
        ★
      </span>
    ))}
    <span className="text-xs text-muted-foreground ml-1">{rating}</span>
  </div>
);

const DestinationsGrid = () => (
  <section id="destinations" className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">
          Destinacione të Zgjedhura
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Handpicked destinations showcasing Albania's most authentic rural experiences
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((d, i) => (
          <motion.div
            key={d.title}
            className={`group rounded-2xl overflow-hidden border border-border bg-card shadow-card hover:shadow-card-hover transition-all duration-300 ${
              d.featured ? "md:col-span-2 md:row-span-1" : ""
            }`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            {/* Image area */}
            <div
              className={`relative ${
                d.featured ? "h-64" : "h-48"
              } gradient-forest-ocean flex items-center justify-center`}
            >
              <span className={`${d.featured ? "text-7xl" : "text-5xl"} group-hover:scale-110 transition-transform`}>
                {d.emoji}
              </span>
              {d.badge && (
                <span
                  className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full ${
                    badgeColors[d.badge] || "bg-muted text-foreground"
                  }`}
                >
                  {d.badge}
                </span>
              )}
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <Stars rating={d.rating} />
                <span className="text-xs text-muted-foreground">{d.location}</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-1">{d.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{d.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-sage">{d.price}</span>
                <div className="flex gap-1.5">
                  {d.tags.map((t) => (
                    <span key={t} className="text-xs bg-sand px-2 py-0.5 rounded-full text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default DestinationsGrid;
