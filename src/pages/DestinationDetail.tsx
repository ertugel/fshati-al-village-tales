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

interface Destination {
  id: string;
  name: string;
  type: string | null;
  zone: string | null;
  price: number | null;
  price_unit: string | null;
  description: string | null;
  emoji: string | null;
  badge: string | null;
  rating: number | null;
  review_count: number | null;
  image_url: string | null;
}

const DestinationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [dest, setDest] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const { data } = await supabase
        .from("destinations")
        .select("id, name, type, zone, price, price_unit, description, emoji, badge, rating, review_count, image_url")
        .eq("id", id)
        .maybeSingle();
      setDest(data as Destination | null);
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

  if (!dest) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground">Destination not found</h1>
          <Link to="/destinations" className="text-sage hover:underline mt-4 inline-block">← Back to destinations</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const priceLabel = `€${dest.price}${dest.price_unit ? `/${dest.price_unit}` : ""}`;
  const gallery = [dest.emoji || "🏞️", "🌊", "🏡", "🌲"];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${dest.name} — ${dest.zone ?? "Shqipëri"} | Fshati.al`}
        description={(dest.description ?? dest.name).substring(0, 155)}
        path={`/destination/${id}`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "LodgingBusiness",
          "name": dest.name,
          "description": dest.description ?? "",
          "address": { "@type": "PostalAddress", "addressLocality": dest.zone ?? "", "addressCountry": "AL" },
          "priceRange": `€${dest.price}`,
          "aggregateRating": { "@type": "AggregateRating", "ratingValue": dest.rating ?? 0, "reviewCount": dest.review_count ?? 0 }
        }}
      />
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <Link to="/destinations" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Kthehu te destinacionet
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.div className="grid grid-cols-4 gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {dest.image_url ? (
                  <div className="col-span-4 h-80 rounded-2xl overflow-hidden">
                    <img src={dest.image_url} alt={dest.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  gallery.map((g, i) => (
                    <div key={i} className={`${i === 0 ? "col-span-2 row-span-2 h-64" : "h-28"} rounded-2xl gradient-forest-ocean flex items-center justify-center`}>
                      <span className={`${i === 0 ? "text-7xl" : "text-4xl"}`}>{g}</span>
                    </div>
                  ))
                )}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div className="flex items-center gap-3 mb-2">
                  {dest.badge && <span className={`text-xs font-semibold px-3 py-1 rounded-full ${dest.badge === "UNESCO" ? "bg-ocean text-cream" : dest.badge === "Organic" ? "bg-seafoam text-forest" : "bg-sage text-cream"}`}>{dest.badge}</span>}
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">{dest.rating ?? "—"}</span>
                    {dest.review_count ? <span className="text-sm text-muted-foreground">({dest.review_count})</span> : null}
                  </div>
                </div>
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">{dest.name}</h1>
                <p className="flex items-center gap-1 text-muted-foreground mb-6"><MapPin className="h-4 w-4" /> {dest.zone}</p>
                <p className="text-foreground/80 leading-relaxed">{dest.description}</p>
              </motion.div>

              <ReviewSection itemId={dest.id} itemType="accommodation" itemName={dest.name} />
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-card rounded-2xl border border-border p-6 shadow-card space-y-4">
                <div className="text-center">
                  <span className="text-5xl block mb-3">{dest.emoji || "🏞️"}</span>
                  <p className="text-3xl font-heading font-bold text-forest">{priceLabel}</p>
                </div>
                <button
                  onClick={() => setBooking(true)}
                  className="w-full rounded-xl bg-forest py-3 text-sm font-semibold text-cream hover:bg-pine transition-colors"
                >
                  Rezervo Tani
                </button>
                <p className="text-xs text-center text-muted-foreground">No payment required until confirmation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {booking && (
        <BookingModal
          open={booking}
          onClose={() => setBooking(false)}
          item={{ id: dest.id, type: "accommodation", name: dest.name, price: dest.price ?? 0 }}
        />
      )}
    </div>
  );
};

export default DestinationDetail;
