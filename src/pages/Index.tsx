import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryStrip from "@/components/CategoryStrip";
import DestinationsGrid from "@/components/DestinationsGrid";
import ToursSection from "@/components/ToursSection";
import EventsSection from "@/components/EventsSection";
import GuidesGrid from "@/components/GuidesGrid";
import AffiliateServices from "@/components/AffiliateServices";
import ThematicPackages from "@/components/ThematicPackages";
import CommunityChat from "@/components/CommunityChat";
import AIAssistant from "@/components/AIAssistant";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import SEOHead from "@/components/SEOHead";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Index = () => {
  const { settings } = useSiteSettings();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Fshati.al",
    "description": "Albania's first rural tourism marketplace",
    "url": "https://fshati-al-village-tales.lovable.app",
    "telephone": "+355683693272",
    "email": "hello@fshati.al",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Tiranë",
      "addressCountry": "AL"
    },
    "sameAs": [],
    "priceRange": "€€",
    "openingHours": "Mo-Fr 09:00-18:00"
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Fshati.al — Turizëm Rural Shqipëri | Albania Rural Tourism"
        description="Zbulo 300+ agroturizme, guida lokale dhe ture tematike në Shqipëri. Nga Alpet e Thethit deri te Riviera Jonike. Rezervo sot."
        keywords="turizem rural shqiperi, agrotourizm albania, theth tours, berat hotel, albania rural tourism, visit albania"
        path="/"
        jsonLd={jsonLd}
      />
      <HeroSection />
      <CategoryStrip />
      <DestinationsGrid />
      <ToursSection />
      {settings.show_events !== "false" && <EventsSection />}
      {settings.show_guides !== "false" && <GuidesGrid />}
      <AffiliateServices />
      <ThematicPackages />
      <CommunityChat />
      <Newsletter />
      <Footer />
      <AIAssistant />
      <BackToTop />
    </div>
  );
};

export default Index;
