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
import usePageMeta from "@/hooks/usePageMeta";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Index = () => {
  usePageMeta(
    "Fshati.al — Discover Authentic Rural Albania",
    "Albania's first rural tourism marketplace. Agritourism, local guides and thematic tours."
  );

  const { settings } = useSiteSettings();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
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
