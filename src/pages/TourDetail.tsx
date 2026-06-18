import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, MapPin, Star, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import ReviewSection from "@/components/ReviewSection";
import SEOHead from "@/components/SEOHead";

interface Tour {
  id: string;
  title: string;
  duration: string | null;
  price: number | null;
  difficulty: string | null;
  zone: string | null;
  description: string | null;
  includes: string[] | null;
  emoji: string | null;
}

const difficultyColor: Record<string, string> = {
  Easy: "bg-seafoam/30 text-forest",
  Medium: "bg-amber-100 text-amber-800",
  Hard: "bg-red-100 text-red-700",
};

const TourDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const { data } = await supabase
        .from("tours")
        .select("id, title, duration, price, difficulty, zone, description, includes, emoji")
        .eq("id", id)
        .maybeSingle();
      setTour(data as Tour | null);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center text-muted-foreground">Duke ngarkuar…</div>
        <Footer />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground">Tour not found</h1>
          <Link to="/tours" className="text-sage hover:underline mt-4 inline-block">← Back to tours</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const includes = tour.includes ?? [];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${tour.title} — ${tour.duration ?? ""} | Fshati.al`}
        description={(tour.description ?? tour.title).substring(0, 155)}
        path={`/tour/${id}`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "TouristTrip",
          "name": tour.title,
          "description": tour.description ?? "",
          "touristType": "Cultural tourists",
          "offers": { "@type": "Offer", "price": tour.price ?? 0, "priceCurrency": "EUR" }
        }}
      />
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <Link to="/tours" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Kthehu te turnet
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.div className="rounded-2xl gradient-forest-ocean p-12 flex items-center justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <span className="text-8xl">{tour.emoji || "🧭"}</span>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  {tour.difficulty && <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${difficultyColor[tour.difficulty] || "bg-muted text-foreground"}`}>{tour.difficulty}</span>}
                  <span className="flex items-center gap-1 text-sm text-muted-foreground"><Clock className="h-3.5 w-3.5" /> {tour.duration}</span>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {tour.zone}</span>
                </div>
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">{tour.title}</h1>
                <p className="text-foreground/80 leading-relaxed">{tour.description}</p>
              </motion.div>

              {includes.length > 0 && (
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Çfarë përfshihet</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {includes.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm text-foreground">
                        <Check className="h-4 w-4 text-sage flex-shrink-0" /> {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <ReviewSection itemId={tour.id} itemType="tour" itemName={tour.title} />
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-card rounded-2xl border border-border p-6 shadow-card space-y-4">
                <p className="text-3xl font-heading font-bold text-forest text-center">€{tour.price}</p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="flex items-center gap-2"><Clock className="h-4 w-4" /> {tour.duration}</p>
                  <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {tour.zone}</p>
                  {tour.difficulty && <p className="flex items-center gap-2"><Star className="h-4 w-4" /> {tour.difficulty} level</p>}
                </div>
                <button onClick={() => setBooking(true)} className="w-full rounded-xl bg-forest py-3 text-sm font-semibold text-cream hover:bg-pine transition-colors">
                  Rezervo Tani
                </button>
                <p className="text-xs text-center text-muted-foreground">Free cancellation up to 48h before</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {booking && (
        <BookingModal open={booking} onClose={() => setBooking(false)} item={{ id: tour.id, type: "tour", name: tour.title, price: tour.price ?? 0 }} />
      )}
    </div>
  );
};

export default TourDetail;
