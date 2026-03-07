import { useRef } from "react";

const categories = [
  { emoji: "🌿", label: "Agroturizëm" },
  { emoji: "🏨", label: "Boutique Hotels" },
  { emoji: "🧭", label: "Guida Lokale" },
  { emoji: "☀️", label: "Day Tours" },
  { emoji: "📅", label: "Multi-Day" },
  { emoji: "🚗", label: "Car Rental" },
  { emoji: "📱", label: "eSIM" },
  { emoji: "🛡️", label: "Insurance" },
  { emoji: "🍷", label: "Wine & Food" },
  { emoji: "🏔️", label: "Adventure" },
];

const CategoryStrip = () => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section className="bg-forest py-5 overflow-hidden">
      <div
        ref={ref}
        className="flex gap-2 overflow-x-auto scrollbar-hide px-4 lg:justify-center"
        style={{ scrollbarWidth: "none" }}
      >
        {categories.map((c) => (
          <button
            key={c.label}
            className="flex items-center gap-2 whitespace-nowrap rounded-full bg-pine/60 px-5 py-2.5 text-sm font-medium text-cream/90 hover:bg-sage/60 transition-colors shrink-0"
          >
            <span className="text-lg">{c.emoji}</span>
            {c.label}
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoryStrip;
