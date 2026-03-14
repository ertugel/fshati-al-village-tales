import { useLanguage } from "@/hooks/useLanguage";

const LanguageToggle = ({ transparent = false }: { transparent?: boolean }) => {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === "sq" ? "en" : "sq")}
      className={`flex items-center gap-1.5 text-sm font-medium rounded-full px-3 py-1.5 transition-colors ${
        transparent
          ? "text-cream/80 hover:text-cream bg-cream/10 hover:bg-cream/20"
          : "text-foreground hover:text-foreground bg-muted/50 hover:bg-muted"
      }`}
      aria-label="Toggle language"
    >
      {lang === "sq" ? (
        <>🇦🇱 SQ <span className="opacity-40">|</span> <span className="opacity-50">🇬🇧 EN</span></>
      ) : (
        <><span className="opacity-50">🇦🇱 SQ</span> <span className="opacity-40">|</span> 🇬🇧 EN</>
      )}
    </button>
  );
};

export default LanguageToggle;
