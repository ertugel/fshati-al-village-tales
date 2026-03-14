import { useRef } from "react";
import { useLanguage } from "@/hooks/useLanguage";

const CategoryStrip = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const categories = [
    { emoji: "🌿", label: t("cat.agritourism") },
    { emoji: "🏨", label: t("cat.boutique") },
    { emoji: "🧭", label: t("cat.guides") },
    { emoji: "☀️", label: t("cat.daytours") },
    { emoji: "📅", label: t("cat.multiday") },
    { emoji: "🚗", label: t("cat.carrental") },
    { emoji: "📱", label: t("cat.esim") },
    { emoji: "🛡️", label: t("cat.insurance") },
    { emoji: "🍷", label: t("cat.wine") },
    { emoji: "🏔️", label: t("cat.adventure") },
  ];

  return (
    <section className="bg-forest py-5 overflow-hidden">
      <div ref={ref} className="flex gap-2 overflow-x-auto scrollbar-hide px-4 lg:justify-center" style={{ scrollbarWidth: "none" }}>
        {categories.map((c) => (
          <button key={c.label} className="flex items-center gap-2 whitespace-nowrap rounded-full bg-pine/60 px-5 py-2.5 text-sm font-medium text-cream/90 hover:bg-sage/60 transition-colors shrink-0">
            <span className="text-lg">{c.emoji}</span>{c.label}
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoryStrip;
