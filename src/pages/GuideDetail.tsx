import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Star, MessageCircle, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingWidget from "@/components/BookingWidget";
import ReviewSection from "@/components/ReviewSection";

const guidesData: Record<string, {
  avatar: string; name: string; specialization: string; languages: string;
  zones: string; price: number; priceLabel: string; rating: number;
  bio: string; tours: string[]; availability: string[];
}> = {
  "mikel-gashi": {
    avatar: "🧔", name: "Mikel Gashi", specialization: "Hiking & Alps", languages: "🇦🇱 Albanian, 🇬🇧 English, 🇩🇪 German",
    zones: "Theth, Valbona", price: 70, priceLabel: "€60-80/day", rating: 4.9,
    bio: "Born and raised in the Albanian Alps, Mikel has been guiding trekkers through Theth and Valbona for over 15 years. He knows every hidden trail, waterfall, and guesthouse in the region. His passion for the mountains is infectious, and his knowledge of local flora, fauna, and folklore makes every hike an unforgettable experience.",
    tours: ["Theth–Valbona Crossing", "Blue Eye Waterfall", "Peaks of the Balkans", "Lock-in Tower Trail"],
    availability: ["April", "May", "June", "July", "August", "September", "October"],
  },
  "erion-alla": {
    avatar: "👨‍🏫", name: "Erion Alla", specialization: "UNESCO Heritage", languages: "🇦🇱 Albanian, 🇬🇧 English, 🇮🇹 Italian",
    zones: "Berat, Gjirokastër", price: 80, priceLabel: "€70-90/day", rating: 4.8,
    bio: "Erion is a certified cultural heritage guide with a degree in history from the University of Tirana. He specializes in Berat and Gjirokastër's UNESCO sites, bringing centuries of Ottoman, Byzantine, and Albanian history to life with engaging storytelling.",
    tours: ["Berat Castle Walk", "Gjirokastër City of Stone", "UNESCO Cities 3-Day Tour", "Albania in 3 Days"],
    availability: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  },
  "flamur-xheka": {
    avatar: "🧑‍🍳", name: "Flamur Xheka", specialization: "Wine & Gastro", languages: "🇦🇱 Albanian, 🇬🇧 English, 🇫🇷 French",
    zones: "Berat, Elbasan", price: 95, priceLabel: "€80-110/day", rating: 4.7,
    bio: "Chef-turned-guide, Flamur combines his culinary expertise with deep knowledge of Albania's wine regions. He trained at several top Albanian restaurants before dedicating himself to food tourism. His tours are a feast for all senses.",
    tours: ["Wine & Gastro 5D", "Cooking Class", "Berat Winery Tour", "Farm-to-Table Experience"],
    availability: ["March", "April", "May", "June", "July", "August", "September", "October", "November"],
  },
  "mirela-tafa": {
    avatar: "👩‍💼", name: "Mirela Tafa", specialization: "Riviera & Coast", languages: "🇦🇱 Albanian, 🇬🇧 English, 🇮🇹 Italian",
    zones: "Vlorë, Sarandë", price: 70, priceLabel: "€60-80/day", rating: 4.8,
    bio: "Mirela grew up on the Albanian Riviera and knows every hidden beach, cove, and coastal village. She combines beach adventures with cultural visits to ancient sites like Butrint and the Ali Pasha Castle.",
    tours: ["Butrint + Ksamil", "Riviera Beach Hopping", "Llogara Pass Tour", "Porto Palermo"],
    availability: ["April", "May", "June", "July", "August", "September", "October"],
  },
  "vjollca-hoxha": {
    avatar: "🧘‍♀️", name: "Vjollca Hoxha", specialization: "Wellness & Yoga", languages: "🇦🇱 Albanian, 🇬🇧 English",
    zones: "Përmet, Tiranë", price: 70, priceLabel: "€60-80/day", rating: 4.6,
    bio: "Vjollca is a certified yoga instructor and wellness consultant who fell in love with Përmet's natural thermal baths. She designs wellness retreats that combine yoga, meditation, organic food, and Albania's healing natural landscapes.",
    tours: ["Wellness Retreat 5D", "Thermal Bath Day Trip", "Yoga & Canyon Hike", "Mindfulness Retreat"],
    availability: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  },
  "taulant-bregu": {
    avatar: "🚴", name: "Taulant Bregu", specialization: "MTB & Cycling", languages: "🇦🇱 Albanian, 🇬🇧 English, 🇩🇪 German",
    zones: "Multi-region", price: 85, priceLabel: "€70-100/day", rating: 4.7,
    bio: "Former competitive cyclist turned guide, Taulant has mapped hundreds of mountain biking trails across Albania. He provides premium bikes, safety gear, and creates routes for all skill levels from casual rides to extreme downhill.",
    tours: ["Alps MTB Adventure", "Riviera Coast Ride", "Tomorr Mountain Challenge", "Cross-Country Albania"],
    availability: ["March", "April", "May", "June", "July", "August", "September", "October", "November"],
  },
  "genta-marku": {
    avatar: "👩‍🎓", name: "Genta Marku", specialization: "History & Culture", languages: "🇦🇱 Albanian, 🇬🇧 English, 🇫🇷 French, 🇪🇸 Spanish",
    zones: "Tiranë, Korçë", price: 65, priceLabel: "€55-75/day", rating: 4.9,
    bio: "Genta holds a PhD in Albanian Studies and is one of the country's most knowledgeable cultural guides. She leads immersive tours through Tirana's transformation, Korçë's French-influenced culture, and Albania's complex communist-era history.",
    tours: ["Tirana Communist History Walk", "Korçë Cultural Weekend", "UNESCO Cities Tour", "BunkArt Experience"],
    availability: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  },
  "ardit-hoxha": {
    avatar: "🛶", name: "Ardit Hoxha", specialization: "Kayak & Water", languages: "🇦🇱 Albanian, 🇬🇧 English",
    zones: "Shkodër, Ohrid", price: 75, priceLabel: "€65-85/day", rating: 4.5,
    bio: "Ardit is a certified water sports instructor with a passion for Albania's rivers and lakes. From kayaking on Lake Shkodër to rafting through Osum Canyon, he ensures every water adventure is safe and thrilling.",
    tours: ["Rafting Osumi", "Lake Shkodër Kayak", "Shala River Boat Tour", "Lake Ohrid Paddle"],
    availability: ["April", "May", "June", "July", "August", "September", "October"],
  },
};

const GuideDetail = () => {
  const { id } = useParams<{ id: string }>();
  const guide = id ? guidesData[id] : null;

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <Link to="/guides" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Kthehu te guidat
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.div className="flex items-center gap-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="w-24 h-24 rounded-full bg-sage/20 flex items-center justify-center text-5xl">{guide.avatar}</div>
                <div>
                  <h1 className="font-heading text-3xl font-bold text-foreground">{guide.name}</h1>
                  <p className="text-sage font-medium">{guide.specialization}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">{guide.rating}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {guide.zones}</span>
                  </div>
                </div>
              </motion.div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Rreth guidës</h2>
                <p className="text-foreground/80 leading-relaxed">{guide.bio}</p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Gjuhët</h2>
                <p className="text-foreground/80">{guide.languages}</p>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Turnet e ofruara</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {guide.tours.map((t) => (
                    <div key={t} className="flex items-center gap-2 bg-card rounded-xl border border-border p-4">
                      <MessageCircle className="h-4 w-4 text-sage" />
                      <span className="text-sm font-medium text-foreground">{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Disponueshmëria</h2>
                <div className="flex flex-wrap gap-2">
                  {guide.availability.map((m) => (
                    <span key={m} className="text-xs bg-seafoam/20 text-forest px-3 py-1.5 rounded-full font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {m}
                    </span>
                  ))}
                </div>
              </div>

              <ReviewSection itemId={guide.name} itemType="accommodation" itemName={guide.name} />
            </div>

            <div className="lg:col-span-1">
              <BookingWidget
                item={{ id: id!, type: "guide", name: guide.name, price: guide.price, priceLabel: guide.priceLabel, emoji: guide.avatar }}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {booking && (
        <BookingModal open={booking} onClose={() => setBooking(false)} item={{ id: id!, type: "guide", name: guide.name, price: guide.price }} />
      )}
    </div>
  );
};

export default GuideDetail;
