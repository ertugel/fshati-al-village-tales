import { motion } from "framer-motion";
import { ExternalLink, Star, Shield } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const services = [
  {
    emoji: "🚗",
    titleKey: "Car Rental",
    descKey: "car_desc",
    disclaimer: "disclaimer",
    partners: [
      { name: "RentalCars.com", url: "https://www.rentalcars.com/?affiliateCode=fshati", cta: "cta_car", recommended: true },
      { name: "Europcar", url: "https://www.europcar.com/", cta: "cta_car", recommended: false },
      { name: "SIXT", url: "https://www.sixt.com/", cta: "cta_car", recommended: false },
    ],
    tips: ["tip_car_1", "tip_car_2", "tip_car_3", "tip_car_4"],
  },
  {
    emoji: "📱",
    titleKey: "eSIM & Internet",
    descKey: "esim_desc",
    disclaimer: "disclaimer",
    partners: [
      { name: "Holafly", url: "https://esim.holafly.com/", cta: "cta_esim", recommended: true },
      { name: "Airalo", url: "https://www.airalo.com/?lang=en", cta: "cta_esim", recommended: false },
      { name: "Saily / NordVPN", url: "https://saily.com/", cta: "cta_esim", recommended: false },
    ],
    tips: ["tip_esim_1", "tip_esim_2", "tip_esim_3", "tip_esim_4"],
  },
  {
    emoji: "🛡️",
    titleKey: "Travel Insurance",
    descKey: "insurance_desc",
    disclaimer: "disclaimer",
    partners: [
      { name: "SafetyWing", url: "https://safetywing.com/nomad-insurance/?referenceId=fshati", cta: "cta_insurance", recommended: true, price: "€2/ditë" },
      { name: "World Nomads", url: "https://www.worldnomads.com/", cta: "cta_insurance", recommended: false },
      { name: "Heymondo", url: "https://www.heymondo.com/", cta: "cta_insurance", recommended: false },
    ],
    tips: ["tip_ins_1", "tip_ins_2", "tip_ins_3", "tip_ins_4"],
  },
  {
    emoji: "🚐",
    titleKey: "Airport Transfers",
    descKey: "transfer_desc",
    disclaimer: "disclaimer",
    partners: [
      { name: "Welcome Pickups", url: "https://www.welcomepickups.com/", cta: "cta_transfer", recommended: true },
      { name: "GoAlbania", url: "#", cta: "cta_transfer", recommended: false },
    ],
    tips: ["tip_transfer_1", "tip_transfer_2", "tip_transfer_3", "tip_transfer_4"],
  },
];

const translations: Record<string, Record<string, string>> = {
  sq: {
    page_title: "Shërbime Udhëtimi",
    page_sub: "Gjithçka që ju duhet për një aventurë të përsosur në Shqipëri",
    recommended: "Partneri ynë i preferuar",
    disclaimer: "Fshati.al merr komision të vogël nga këto shërbime — pa kosto shtesë për ju.",
    tips_title: "Këshilla",
    car_desc: "SUV 4×4 për Alpet, ekonomike për qytetin. Krahaso çmimet dhe rezervo mjetin e duhur.",
    esim_desc: "Qëndro i lidhur që në ditën e parë. Aktivo eSIM-in para fluturimit — pa ndërrim karte fizike.",
    insurance_desc: "Mbulesë thelbësore për aktivitete aventure: hiking, rafting, sporte malore. Mund të aktivizohet edhe pas nisjes.",
    transfer_desc: "Rezervo transferta të besueshme nga Aeroporti i Tiranës drejt çdo destinacioni në Shqipëri.",
    cta_car: "Kërko Makinë",
    cta_esim: "Bli eSIM",
    cta_insurance: "Bli Sigurim",
    cta_transfer: "Rezervo Transfer",
    tip_car_1: "4x4 rekomandohet për rrugët e Alpeve Veriore",
    tip_car_2: "Rezervo 2+ javë para për verën",
    tip_car_3: "Patenta ndërkombëtare e nevojshme",
    tip_car_4: "Pikat e karburantit janë të rralla në zonat rurale",
    tip_esim_1: "Kontrollo përputhshmërinë e telefonit me eSIM",
    tip_esim_2: "Holafly ofron plane me data të pakufizuara",
    tip_esim_3: "Bli para fluturimit për aktivizim të menjëhershëm",
    tip_esim_4: "Mbulesa e mirë në qytete, e kufizuar në Alpe",
    tip_ins_1: "Sigurohu që sportet e aventurës janë të mbuluara",
    tip_ins_2: "SafetyWing lejon blerjen pas nisjes",
    tip_ins_3: "Evakuimi mjekësor rekomandohet për Alpet",
    tip_ins_4: "Kontrollo politikën COVID para blerjes",
    tip_transfer_1: "Rezervo 24 orë+ para",
    tip_transfer_2: "Çmimet fikse — pa taksimetër",
    tip_transfer_3: "Monitorimi i fluturimeve i përfshirë",
    tip_transfer_4: "Ulëse fëmijësh në dispozicion sipas kërkesës",
  },
  en: {
    page_title: "Travel Services",
    page_sub: "Everything you need for a seamless Albanian adventure",
    recommended: "Our preferred partner",
    disclaimer: "Fshati.al earns a small commission from these services — at no extra cost to you.",
    tips_title: "Tips",
    car_desc: "SUV 4×4 for the Alps, economy for the city. Compare prices and book the perfect vehicle.",
    esim_desc: "Stay connected from day one. Activate your eSIM before landing — no physical SIM swap needed.",
    insurance_desc: "Essential coverage for adventure activities: hiking, rafting, mountain sports. Can be activated after departure.",
    transfer_desc: "Pre-book reliable transfers from Tirana International Airport to any destination in Albania.",
    cta_car: "Search Cars",
    cta_esim: "Buy eSIM",
    cta_insurance: "Buy Insurance",
    cta_transfer: "Book Transfer",
    tip_car_1: "4x4 recommended for Northern Alps roads",
    tip_car_2: "Book 2+ weeks in advance for summer",
    tip_car_3: "International license required",
    tip_car_4: "Fuel stations sparse in rural areas",
    tip_esim_1: "Check phone eSIM compatibility first",
    tip_esim_2: "Holafly offers unlimited data plans",
    tip_esim_3: "Buy before your flight for instant activation",
    tip_esim_4: "Coverage good in cities, limited in remote Alps",
    tip_ins_1: "Ensure adventure sports are covered",
    tip_ins_2: "SafetyWing allows post-departure purchase",
    tip_ins_3: "Medical evacuation coverage recommended for Alps",
    tip_ins_4: "Check COVID policy before purchasing",
    tip_transfer_1: "Book 24h+ in advance",
    tip_transfer_2: "Prices fixed — no meter worries",
    tip_transfer_3: "Flight monitoring included",
    tip_transfer_4: "Child seats available on request",
  },
};

const Services = () => {
  const { lang } = useLanguage();
  const t = (key: string) => translations[lang]?.[key] || translations.sq[key] || key;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">{t("page_title")}</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">{t("page_sub")}</p>
          </motion.div>

          <div className="space-y-10">
            {services.map((s, i) => (
              <motion.div
                key={s.titleKey}
                className="bg-card rounded-2xl border border-border overflow-hidden shadow-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-5xl">{s.emoji}</span>
                    <div>
                      <h2 className="font-heading text-2xl font-bold text-foreground">{s.titleKey}</h2>
                      <p className="text-muted-foreground">{t(s.descKey)}</p>
                    </div>
                  </div>

                  {/* Partner cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {s.partners.map((p) => (
                      <div
                        key={p.name}
                        className={`relative rounded-xl border p-5 flex flex-col justify-between transition-all hover:shadow-md ${
                          p.recommended
                            ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                            : "border-border bg-card"
                        }`}
                      >
                        {p.recommended && (
                          <Badge className="absolute -top-2.5 left-4 bg-primary text-primary-foreground text-[11px] gap-1">
                            <Star className="h-3 w-3 fill-current" />
                            {t("recommended")}
                          </Badge>
                        )}
                        <div className="mb-4 mt-1">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground">
                              {p.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-heading font-semibold text-foreground">{p.name}</h4>
                              {(p as any).price && (
                                <span className="text-xs text-muted-foreground">{(p as any).price}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          className="w-full gap-2"
                          variant={p.recommended ? "default" : "outline"}
                          onClick={() => window.open(p.url, "_blank", "noopener,noreferrer")}
                        >
                          {t(p.cta)}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Tips */}
                  <div className="mb-4">
                    <h3 className="font-heading text-sm font-bold text-foreground mb-2 uppercase tracking-wide">{t("tips_title")}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                      {s.tips.map((tipKey) => (
                        <p key={tipKey} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-0.5">✓</span> {t(tipKey)}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="flex items-center gap-2 pt-4 border-t border-border">
                    <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
                    <p className="text-xs text-muted-foreground italic">{t(s.disclaimer)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Services;
