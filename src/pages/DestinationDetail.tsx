import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Star, Wifi, Car, Coffee, Mountain, Utensils, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import ReviewSection from "@/components/ReviewSection";
import SEOHead from "@/components/SEOHead";

const destinations: Record<string, {
  emoji: string; title: string; location: string; description: string; longDescription: string;
  price: number; priceLabel: string; rating: number; badge?: string; tags: string[];
  amenities: { icon: string; label: string }[]; gallery: string[];
}> = {
  "theth-alps": {
    emoji: "🏔️", title: "Theth Alps", location: "Shkodër, Northern Alps",
    description: "Pristine mountain village with the iconic Blue Eye waterfall and Lock-in Tower.",
    longDescription: "Theth is a remote village nestled in the Albanian Alps, offering breathtaking landscapes, traditional stone guesthouses, and some of the best hiking in the Balkans. The village is the starting point of the famous Theth-Valbona trail, one of Europe's most scenic hikes. Visit the Blue Eye (Syri i Kaltër), explore the Lock-in Tower (Kulla e Ngujimit), and immerse yourself in authentic Albanian mountain hospitality.",
    price: 45, priceLabel: "€45/night", rating: 4.9, badge: "Bestseller", tags: ["Hiking", "Nature", "Village"],
    amenities: [{ icon: "wifi", label: "Free WiFi" }, { icon: "food", label: "Breakfast Included" }, { icon: "mountain", label: "Mountain View" }, { icon: "parking", label: "Free Parking" }],
    gallery: ["🏔️", "🌊", "🏡", "🌲"],
  },
  "mrizi-zanave": {
    emoji: "🍽️", title: "Mrizi i Zanave", location: "Lezhë, Central Albania",
    description: "Farm-to-table dining experience in Albania's most acclaimed agritourism.",
    longDescription: "Mrizi i Zanave is Albania's most famous agritourism, led by chef Altin Prenga. Everything served is grown, raised, or foraged within a 25km radius. The multi-course meals feature organic produce, handmade cheeses, slow-cooked meats, and wines from local vineyards. It's not just a meal — it's a journey through Albanian culinary tradition.",
    price: 65, priceLabel: "€65/person", rating: 4.8, badge: "Organic", tags: ["Food", "Farm", "Premium"],
    amenities: [{ icon: "food", label: "Organic Menu" }, { icon: "parking", label: "Free Parking" }, { icon: "shield", label: "Guided Tour" }],
    gallery: ["🍽️", "🌾", "🧀", "🍷"],
  },
  "berat-unesco": {
    emoji: "🏛️", title: "Berat UNESCO", location: "Berat, Central Albania",
    description: "The City of a Thousand Windows — a living museum of Ottoman architecture.",
    longDescription: "Berat is one of Albania's two UNESCO World Heritage cities, known for its Ottoman-era houses climbing up the hillside with their distinctive large windows. Explore the 13th-century castle, visit Byzantine churches with original frescoes, and wander through the Mangalem and Gorica quarters. The city sits at the foot of Mount Tomorr along the Osum River.",
    price: 35, priceLabel: "€35/night", rating: 4.7, badge: "UNESCO", tags: ["History", "Architecture"],
    amenities: [{ icon: "wifi", label: "Free WiFi" }, { icon: "food", label: "Breakfast Included" }, { icon: "shield", label: "UNESCO Protected" }],
    gallery: ["🏛️", "🏘️", "⛪", "🌅"],
  },
  "albanian-riviera": {
    emoji: "🌊", title: "Albanian Riviera", location: "Vlorë — Sarandë Coast",
    description: "Crystal-clear Ionian waters with hidden beaches and coastal villages.",
    longDescription: "The Albanian Riviera stretches along the Ionian coast from Vlorë to Sarandë, featuring some of the Mediterranean's last unspoiled beaches. Discover hidden coves like Gjipe Beach, the vibrant village of Himara, and the stunning Llogara Pass with panoramic coastal views. Each beach has its own character — from party-friendly Dhermi to secluded Porto Palermo.",
    price: 55, priceLabel: "€55/night", rating: 4.8, tags: ["Beach", "Coast", "Summer"],
    amenities: [{ icon: "wifi", label: "Free WiFi" }, { icon: "parking", label: "Free Parking" }, { icon: "coffee", label: "Beach Bar" }],
    gallery: ["🌊", "🏖️", "⛵", "🌅"],
  },
  "kantina-arberi": {
    emoji: "🍷", title: "Kantina Arbëri", location: "Berat Wine Region",
    description: "Wine cellar visited by Pope Francis — taste award-winning Albanian wines.",
    longDescription: "Kantina Arbëri is one of Albania's premier wineries, famous for being visited by Pope Francis during his 2014 trip. The vineyard produces award-winning wines from indigenous grape varieties like Shesh i Bardhë and Shesh i Zi. The tasting experience includes a vineyard tour, cellar visit, and guided tasting paired with local cheeses and charcuterie.",
    price: 25, priceLabel: "€25/tasting", rating: 4.6, badge: "Bestseller", tags: ["Wine", "Culture"],
    amenities: [{ icon: "food", label: "Wine Tasting" }, { icon: "parking", label: "Free Parking" }, { icon: "shield", label: "Guided Tour" }],
    gallery: ["🍷", "🍇", "🧀", "🏡"],
  },
  "gjirokaster": {
    emoji: "🏰", title: "Gjirokastër", location: "South Albania",
    description: "The City of Stone — Ottoman-era architecture and a massive hilltop castle.",
    longDescription: "Gjirokastër is a UNESCO World Heritage city known as the 'City of Stone' for its distinctive stone-roofed houses. The massive hilltop castle offers panoramic views of the Drino Valley. Explore the Old Bazaar, visit the Skenduli House, and discover Cold War-era tunnels beneath the castle. Gjirokastër is also the birthplace of writer Ismail Kadare.",
    price: 30, priceLabel: "€30/night", rating: 4.7, badge: "UNESCO", tags: ["History", "Castle", "Culture"],
    amenities: [{ icon: "wifi", label: "Free WiFi" }, { icon: "food", label: "Breakfast Included" }, { icon: "shield", label: "UNESCO Protected" }],
    gallery: ["🏰", "🏘️", "📜", "🌄"],
  },
  "valbona-valley": {
    emoji: "⛰️", title: "Valbona Valley", location: "Kukës, Northern Alps",
    description: "Dramatic alpine valley perfect for the famous Valbona-Theth trail.",
    longDescription: "Valbona Valley National Park is a stunning alpine paradise in northeastern Albania. The valley is surrounded by dramatic peaks reaching over 2,500m and is the eastern terminus of the famous Valbona-Theth hiking trail. Stay in traditional guesthouses, enjoy farm-fresh meals, and explore trails through pristine beech and pine forests.",
    price: 40, priceLabel: "€40/night", rating: 4.8, tags: ["Hiking", "Alps", "Nature"],
    amenities: [{ icon: "mountain", label: "Mountain View" }, { icon: "food", label: "Home Cooking" }, { icon: "parking", label: "Free Parking" }],
    gallery: ["⛰️", "🌲", "🏡", "🦅"],
  },
  "permet": {
    emoji: "♨️", title: "Përmet", location: "Përmet, South Albania",
    description: "Thermal baths, organic food, and the gateway to Lengarica Canyon.",
    longDescription: "Përmet is known as the 'City of Roses' and is famous for its natural thermal baths, organic food, and stunning canyon landscapes. Visit the Bënja Thermal Baths with their stone bridge backdrop, hike through Lengarica Canyon, and enjoy locally-produced gliko (fruit preserves), raki, and wine. The region is also known for its excellent honey and dairy.",
    price: 35, priceLabel: "€35/night", rating: 4.6, tags: ["Wellness", "Nature", "Food"],
    amenities: [{ icon: "coffee", label: "Thermal Baths" }, { icon: "food", label: "Organic Food" }, { icon: "mountain", label: "Canyon Access" }],
    gallery: ["♨️", "🌹", "🏞️", "🍯"],
  },
  "ksamil": {
    emoji: "🏖️", title: "Ksamil Islands", location: "Sarandë, South Coast",
    description: "Turquoise waters and tiny islands — Albania's answer to the Maldives.",
    longDescription: "Ksamil is a coastal village near the Greek border, famous for its three small islands accessible by swimming or short boat ride. The crystal-clear turquoise waters rival the best Mediterranean beaches. Combine a beach day with a visit to nearby Butrint National Park, a UNESCO World Heritage archaeological site spanning Greek, Roman, Byzantine, and Ottoman periods.",
    price: 60, priceLabel: "€60/night", rating: 4.5, tags: ["Beach", "Islands", "Summer"],
    amenities: [{ icon: "wifi", label: "Free WiFi" }, { icon: "coffee", label: "Beach Bar" }, { icon: "parking", label: "Free Parking" }],
    gallery: ["🏖️", "🏝️", "🐚", "⛵"],
  },
};

const iconMap: Record<string, React.ReactNode> = {
  wifi: <Wifi className="h-4 w-4" />,
  food: <Utensils className="h-4 w-4" />,
  mountain: <Mountain className="h-4 w-4" />,
  parking: <Car className="h-4 w-4" />,
  coffee: <Coffee className="h-4 w-4" />,
  shield: <Shield className="h-4 w-4" />,
};

const DestinationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dest = id ? destinations[id] : null;
  const [booking, setBooking] = useState(false);

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

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${dest.title} — ${dest.location} | Fshati.al`}
        description={dest.longDescription.substring(0, 155)}
        path={`/destination/${id}`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "LodgingBusiness",
          "name": dest.title,
          "description": dest.description,
          "address": { "@type": "PostalAddress", "addressLocality": dest.location, "addressCountry": "AL" },
          "priceRange": `€${dest.price}`,
          "aggregateRating": { "@type": "AggregateRating", "ratingValue": dest.rating, "reviewCount": 12 }
        }}
      />
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <Link to="/destinations" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Kthehu te destinacionet
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Gallery */}
              <motion.div className="grid grid-cols-4 gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {dest.gallery.map((g, i) => (
                  <div key={i} className={`${i === 0 ? "col-span-2 row-span-2 h-64" : "h-28"} rounded-2xl gradient-forest-ocean flex items-center justify-center`}>
                    <span className={`${i === 0 ? "text-7xl" : "text-4xl"}`}>{g}</span>
                  </div>
                ))}
              </motion.div>

              {/* Info */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div className="flex items-center gap-3 mb-2">
                  {dest.badge && <span className={`text-xs font-semibold px-3 py-1 rounded-full ${dest.badge === "UNESCO" ? "bg-ocean text-cream" : dest.badge === "Organic" ? "bg-seafoam text-forest" : "bg-sage text-cream"}`}>{dest.badge}</span>}
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">{dest.rating}</span>
                  </div>
                </div>
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">{dest.title}</h1>
                <p className="flex items-center gap-1 text-muted-foreground mb-6"><MapPin className="h-4 w-4" /> {dest.location}</p>
                <p className="text-foreground/80 leading-relaxed">{dest.longDescription}</p>
              </motion.div>

              {/* Amenities */}
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Komoditetet</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {dest.amenities.map((a) => (
                    <div key={a.label} className="flex items-center gap-3 bg-card rounded-xl border border-border p-4">
                      <span className="text-sage">{iconMap[a.icon]}</span>
                      <span className="text-sm font-medium text-foreground">{a.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <ReviewSection itemId={dest.title} itemType="accommodation" itemName={dest.title} />
            </div>

            {/* Sidebar booking */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-card rounded-2xl border border-border p-6 shadow-card space-y-4">
                <div className="text-center">
                  <span className="text-5xl block mb-3">{dest.emoji}</span>
                  <p className="text-3xl font-heading font-bold text-forest">{dest.priceLabel}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {dest.tags.map((t) => (
                    <span key={t} className="text-xs bg-sand px-2 py-0.5 rounded-full text-muted-foreground">{t}</span>
                  ))}
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
          item={{ id: id!, type: "accommodation", name: dest.title, price: dest.price }}
        />
      )}
    </div>
  );
};

export default DestinationDetail;
