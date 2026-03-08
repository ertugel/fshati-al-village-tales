import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, MapPin, Star, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingWidget from "@/components/BookingWidget";
import ReviewSection from "@/components/ReviewSection";

const toursData: Record<string, {
  emoji: string; title: string; duration: string; price: number; priceLabel: string;
  description: string; longDescription: string; difficulty: string; zone: string;
  includes: string[]; itinerary: string[]; guideName: string; guideSpecialization: string;
}> = {
  "osum-canyon": {
    emoji: "🏞️", title: "Osum Canyon", duration: "1 day", price: 60, priceLabel: "€60/person",
    description: "Hike through Albania's Grand Canyon with turquoise river pools.",
    longDescription: "The Osum Canyon is often called the 'Grand Canyon of Albania'. This full-day adventure takes you through one of the most spectacular natural formations in the Balkans, with canyon walls reaching up to 80 meters high and crystal-clear turquoise pools perfect for swimming.",
    difficulty: "Medium", zone: "Berat",
    includes: ["Transport from Berat", "Certified guide", "Lunch pack", "Safety equipment"],
    itinerary: ["08:00 — Pickup from Berat hotel", "09:00 — Arrive at canyon trailhead", "09:30 — Begin canyon hike", "12:00 — Lunch break at waterfall pool", "14:00 — Swimming and exploration", "16:00 — Return hike", "17:30 — Transfer back to Berat"],
    guideName: "Mikel Gashi", guideSpecialization: "Hiking & Alps",
  },
  "rafting-osumi": {
    emoji: "🚣", title: "Rafting Osumi", duration: "1 day", price: 65, priceLabel: "€65/person",
    description: "White-water rafting through stunning canyon walls.",
    longDescription: "Experience the thrill of white-water rafting through the Osumi Canyon. Navigate class II-III rapids while surrounded by towering canyon walls and pristine natural beauty. This adventure combines adrenaline with stunning scenery for an unforgettable day.",
    difficulty: "Hard", zone: "Çorovodë",
    includes: ["All rafting equipment", "Certified instructor", "Wetsuit", "Lunch", "Transport"],
    itinerary: ["07:30 — Pickup", "09:00 — Safety briefing & equipment", "10:00 — Begin rafting", "12:30 — Canyon lunch stop", "14:00 — Continue rafting", "16:00 — Finish & celebration", "17:30 — Return transfer"],
    guideName: "Ardit Hoxha", guideSpecialization: "Kayak & Water",
  },
  "berat-city-walk": {
    emoji: "🏛️", title: "Berat City Walk", duration: "Half day", price: 15, priceLabel: "€15/person",
    description: "Guided UNESCO walking tour.", longDescription: "Walk through the ancient streets of Berat with a knowledgeable local guide. Explore the Mangalem quarter, visit the Castle, and discover Byzantine churches with original frescoes. Learn about 2,400 years of continuous habitation in this remarkable city.",
    difficulty: "Easy", zone: "Berat",
    includes: ["Licensed guide", "Castle entrance fee", "Church visits"],
    itinerary: ["09:00 — Meet at Mangalem Bridge", "09:30 — Mangalem Quarter walk", "10:30 — Castle ascent & tour", "11:30 — Church of St. Mary of Blachernae", "12:30 — Tour ends at Old Bazaar"],
    guideName: "Erion Alla", guideSpecialization: "UNESCO Heritage",
  },
  "lake-koman-ferry": {
    emoji: "⛴️", title: "Lake Koman Ferry", duration: "1 day", price: 85, priceLabel: "€85/person",
    description: "Scenic ferry through fjord-like landscapes.", longDescription: "Lake Koman ferry is often described as one of the most beautiful ferry rides in the world. Glide through narrow fjord-like passages surrounded by dramatic mountain peaks rising directly from emerald waters. This is Albania's answer to Norwegian fjords.",
    difficulty: "Easy", zone: "Shkodër",
    includes: ["Ferry ticket", "Transport from Shkodër", "Lunch", "Guide"],
    itinerary: ["06:00 — Pickup from Shkodër", "07:30 — Board ferry at Koman", "08:00 — Ferry departs", "11:00 — Arrive Fierza", "12:00 — Lunch in Bajza", "14:00 — Return journey", "18:00 — Back in Shkodër"],
    guideName: "Mikel Gashi", guideSpecialization: "Hiking & Alps",
  },
  "butrint-ksamil": {
    emoji: "🏖️", title: "Butrint + Ksamil", duration: "1 day", price: 45, priceLabel: "€45/person",
    description: "Ancient ruins and pristine island beaches.", longDescription: "Combine 2,500 years of history with crystal-clear beach waters in this full-day tour. Explore the UNESCO World Heritage site of Butrint, then relax on the stunning beaches of Ksamil with its tiny islands and turquoise waters.",
    difficulty: "Easy", zone: "Sarandë",
    includes: ["Transport", "Butrint entrance fee", "Guide", "Beach time"],
    itinerary: ["09:00 — Pickup from Sarandë", "09:30 — Butrint archaeological site tour", "12:00 — Transfer to Ksamil", "12:30 — Lunch at beachside restaurant", "13:30 — Free beach time & island swim", "17:00 — Return to Sarandë"],
    guideName: "Mirela Tafa", guideSpecialization: "Riviera & Coast",
  },
  "cooking-class": {
    emoji: "🍳", title: "Cooking Class", duration: "Half day", price: 35, priceLabel: "€35/person",
    description: "Learn Albanian culinary classics.", longDescription: "Join a local family kitchen and learn the secrets of Albanian cuisine. Prepare traditional dishes like byrek, tavë kosi, and qofte while hearing stories about Albanian food culture. Enjoy your creations with local wine.",
    difficulty: "Easy", zone: "Tiranë",
    includes: ["All ingredients", "Apron", "Recipe booklet", "Wine tasting", "Full meal"],
    itinerary: ["10:00 — Welcome & Albanian food intro", "10:30 — Market visit for ingredients", "11:30 — Cooking begins", "13:00 — Sit-down meal with wine pairing", "14:30 — Recipe booklet & farewell"],
    guideName: "Flamur Xheka", guideSpecialization: "Wine & Gastro",
  },
  "albania-3-days": {
    emoji: "🏔️", title: "Albania in 3 Days", duration: "3 days", price: 550, priceLabel: "€550/person",
    description: "Best highlights in one trip.", longDescription: "See the best of Albania in 3 action-packed days. Visit the UNESCO cities of Berat and Gjirokastër, swim at the Blue Eye natural spring, and experience the stunning Albanian Riviera coastline.",
    difficulty: "Medium", zone: "Multi-region",
    includes: ["3-star hotel accommodation", "All transport", "Certified guide", "Breakfast daily", "Entrance fees"],
    itinerary: ["Day 1: Tiranë → Berat — Castle, Mangalem, wine tasting", "Day 2: Berat → Gjirokastër — Blue Eye, City of Stone", "Day 3: Gjirokastër → Riviera → Tiranë — Llogara Pass, beach stop"],
    guideName: "Erion Alla", guideSpecialization: "UNESCO Heritage",
  },
  "unesco-cities": {
    emoji: "🏛️", title: "UNESCO Cities", duration: "3 days", price: 380, priceLabel: "€380/person",
    description: "Two UNESCO heritage cities.", longDescription: "Deep dive into Albania's two UNESCO World Heritage cities — Berat and Gjirokastër. Explore Ottoman-era architecture, medieval castles, Byzantine churches, and learn the fascinating history spanning millennia.",
    difficulty: "Easy", zone: "South",
    includes: ["Boutique hotel stays", "All transport", "Licensed guide", "Breakfast", "Entrance fees"],
    itinerary: ["Day 1: Tiranë → Berat — Full city exploration", "Day 2: Berat → Gjirokastër — Scenic drive, arrival exploration", "Day 3: Gjirokastër full day → Return to Tiranë"],
    guideName: "Genta Marku", guideSpecialization: "History & Culture",
  },
  "alps-trek-4d": {
    emoji: "⛰️", title: "Alps Trek 4D", duration: "4 days", price: 480, priceLabel: "€480/person",
    description: "Theth–Valbona crossing.", longDescription: "The most iconic trek in Albania — the Theth to Valbona crossing through the Albanian Alps. This 4-day adventure takes you through pristine mountain landscapes, traditional villages, and over the Valbona Pass at 1,795m.",
    difficulty: "Hard", zone: "Northern Alps",
    includes: ["Guesthouse accommodation", "All meals", "Mountain guide", "Transport", "Koman ferry"],
    itinerary: ["Day 1: Shkodër → Theth — Settle in, short hike to Blue Eye", "Day 2: Theth explorations — Grunas Waterfall, Lock-in Tower", "Day 3: Theth → Valbona Pass → Valbona — Epic crossing day", "Day 4: Valbona → Koman Ferry → Shkodër"],
    guideName: "Mikel Gashi", guideSpecialization: "Hiking & Alps",
  },
  "wellness-retreat-5d": {
    emoji: "🧘", title: "Wellness Retreat 5D", duration: "5 days", price: 900, priceLabel: "€900/person",
    description: "Thermal baths, yoga, organic cuisine.", longDescription: "Recharge body and soul in Albania's wellness heartland. This 5-day retreat combines natural thermal baths, daily yoga, organic farm-to-table cuisine, and stunning canyon hikes in the Përmet region.",
    difficulty: "Easy", zone: "Përmet",
    includes: ["Boutique eco-lodge", "All organic meals", "Daily yoga", "Thermal bath access", "Canyon hike guide", "Transport"],
    itinerary: ["Day 1: Arrival & thermal bath welcome", "Day 2: Morning yoga, canyon hike, afternoon spa", "Day 3: Organic cooking class, wine tasting", "Day 4: Lengarica Canyon trek, evening meditation", "Day 5: Final yoga session, departure"],
    guideName: "Vjollca Hoxha", guideSpecialization: "Wellness & Yoga",
  },
  "wine-gastro-5d": {
    emoji: "🍷", title: "Wine & Gastro 5D", duration: "5 days", price: 750, priceLabel: "€750/person",
    description: "Albania's best wineries and farm stays.", longDescription: "A 5-day culinary journey through Albania's wine regions and best agritourism experiences. Visit award-winning wineries, learn traditional recipes, and taste the incredible diversity of Albanian cuisine.",
    difficulty: "Easy", zone: "Multi-region",
    includes: ["Boutique accommodation", "All meals & tastings", "Transport", "Winery visits", "Cooking class", "Guide"],
    itinerary: ["Day 1: Tiranë — Welcome dinner at top restaurant", "Day 2: Durrës coast → Mrizi i Zanave agritourism", "Day 3: Berat wineries — Çobo, Kantina Arbëri", "Day 4: Elbasan → Korçë wine region", "Day 5: Korçë old bazaar, farewell lunch"],
    guideName: "Flamur Xheka", guideSpecialization: "Wine & Gastro",
  },
  "north-south-11d": {
    emoji: "🗺️", title: "North to South 11D", duration: "11 days", price: 1480, priceLabel: "€1,480/person",
    description: "Complete Albania experience.", longDescription: "The ultimate Albanian adventure — 11 days covering everything from the Albanian Alps to the Ionian Riviera, UNESCO cities to hidden villages, canyon rafting to beach relaxation. This is the most comprehensive tour of Albania available.",
    difficulty: "Medium", zone: "Full country",
    includes: ["All accommodation", "All meals", "Private transport", "Licensed guide", "All entrance fees", "Activities"],
    itinerary: ["Day 1-2: Shkodër & Lake Koman", "Day 3-4: Theth–Valbona crossing", "Day 5: Tiranë cultural day", "Day 6-7: Berat & Gjirokastër UNESCO cities", "Day 8: Blue Eye & Riviera coast", "Day 9-10: Sarandë, Butrint, Ksamil", "Day 11: Llogara Pass & departure"],
    guideName: "Erion Alla", guideSpecialization: "UNESCO Heritage",
  },
};

const difficultyColor: Record<string, string> = {
  Easy: "bg-seafoam/30 text-forest",
  Medium: "bg-amber-100 text-amber-800",
  Hard: "bg-red-100 text-red-700",
};

const TourDetail = () => {
  const { id } = useParams<{ id: string }>();
  const tour = id ? toursData[id] : null;
  const [booking, setBooking] = useState(false);

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <Link to="/tours" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Kthehu te turnet
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Hero */}
              <motion.div className="rounded-2xl gradient-forest-ocean p-12 flex items-center justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <span className="text-8xl">{tour.emoji}</span>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${difficultyColor[tour.difficulty]}`}>{tour.difficulty}</span>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground"><Clock className="h-3.5 w-3.5" /> {tour.duration}</span>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {tour.zone}</span>
                </div>
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">{tour.title}</h1>
                <p className="text-foreground/80 leading-relaxed">{tour.longDescription}</p>
              </motion.div>

              {/* Includes */}
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Çfarë përfshihet</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {tour.includes.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="h-4 w-4 text-sage flex-shrink-0" /> {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Itinerary */}
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Itinerari</h2>
                <div className="space-y-3">
                  {tour.itinerary.map((step, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-sage/20 text-sage flex items-center justify-center flex-shrink-0 text-sm font-bold">{i + 1}</div>
                      <p className="text-sm text-foreground/80 pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guide info */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Guida juaj</h2>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-sage/20 flex items-center justify-center text-2xl">🧑‍🏫</div>
                  <div>
                    <p className="font-heading text-lg font-bold text-foreground">{tour.guideName}</p>
                    <p className="text-sm text-sage">{tour.guideSpecialization}</p>
                  </div>
                </div>
              </div>

              <ReviewSection itemId={tour.title} itemType="tour" itemName={tour.title} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-card rounded-2xl border border-border p-6 shadow-card space-y-4">
                <p className="text-3xl font-heading font-bold text-forest text-center">{tour.priceLabel}</p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="flex items-center gap-2"><Clock className="h-4 w-4" /> {tour.duration}</p>
                  <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {tour.zone}</p>
                  <p className="flex items-center gap-2"><Star className="h-4 w-4" /> {tour.difficulty} level</p>
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
        <BookingModal open={booking} onClose={() => setBooking(false)} item={{ id: id!, type: "tour", name: tour.title, price: tour.price }} />
      )}
    </div>
  );
};

export default TourDetail;
