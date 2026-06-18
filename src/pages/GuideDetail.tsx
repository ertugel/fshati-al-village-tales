import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import ReviewSection from "@/components/ReviewSection";
import SEOHead from "@/components/SEOHead";

interface Guide {
  id: string;
  name: string;
  specialization: string | null;
  languages: string[] | null;
  zones: string[] | null;
  price_per_day: number | null;
  price_max: number | null;
  rating: number | null;
  avatar_emoji: string | null;
  bio: string | null;
}

const GuideDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const { data } = await supabase
        .from("guides")
        .select("id, name, specialization, languages, zones, price_per_day, price_max, rating, avatar_emoji, bio")
        .eq("id", id)
        .maybeSingle();
      setGuide(data as Guide | null);
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

  if (!guide) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar /><div className="pt-32 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground">Guide not found</h1>
          <Link to="/guides" className="text-sage hover:underline mt-4 inline-block">← Back to guides</Link>
        </div><Footer />
      </div>
    );
  }

  const priceLabel = guide.price_max && guide.price_max !== guide.price_per_day
    ? `€${guide.price_per_day}-${guide.price_max}/day`
    : `€${guide.price_per_day}/day`;
  const zonesText = (guide.zones ?? []).join(", ");
  const languagesText = (guide.languages ?? []).join(", ");

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${guide.name} — ${guide.specialization ?? "Guide"} | Fshati.al`}
        description={`Guidë lokale në ${zonesText}. Çmimi nga €${guide.price_per_day}/ditë. ${languagesText}`}
        path={`/guide/${id}`}
      />
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <Link to="/guides" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Kthehu te guidat
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.div className="flex items-center gap-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="w-24 h-24 rounded-full bg-sage/20 flex items-center justify-center text-5xl">{guide.avatar_emoji || "🧭"}</div>
                <div>
                  <h1 className="font-heading text-3xl font-bold text-foreground">{guide.name}</h1>
                  <p className="text-sage font-medium">{guide.specialization}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">{guide.rating ?? "—"}</span>
                    {zonesText && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {zonesText}</span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>

              {guide.bio && (
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Rreth guidës</h2>
                  <p className="text-foreground/80 leading-relaxed">{guide.bio}</p>
                </div>
              )}

              {languagesText && (
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Gjuhët</h2>
                  <p className="text-foreground/80">{languagesText}</p>
                </div>
              )}

              <ReviewSection itemId={guide.id} itemType="guide" itemName={guide.name} />
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-card rounded-2xl border border-border p-6 shadow-card space-y-4">
                <div className="text-center">
                  <span className="text-5xl block mb-3">{guide.avatar_emoji || "🧭"}</span>
                  <p className="text-3xl font-heading font-bold text-forest">{priceLabel}</p>
                </div>
                <button onClick={() => setBooking(true)} className="w-full rounded-xl bg-forest py-3 text-sm font-semibold text-cream hover:bg-pine transition-colors">
                  Rezervo Guidën
                </button>
                <p className="text-xs text-center text-muted-foreground">Flexible cancellation policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {booking && (
        <BookingModal open={booking} onClose={() => setBooking(false)} item={{ id: guide.id, type: "guide", name: guide.name, price: guide.price_per_day ?? 0 }} />
      )}
    </div>
  );
};

export default GuideDetail;
