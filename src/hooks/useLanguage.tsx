import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type Lang = "sq" | "en";

const translations = {
  // Navigation
  "nav.home": { sq: "Kryefaqja", en: "Home" },
  "nav.destinations": { sq: "Destinacione", en: "Destinations" },
  "nav.tours": { sq: "Turne", en: "Tours" },
  "nav.guides": { sq: "Guida", en: "Guides" },
  "nav.services": { sq: "Shërbime", en: "Services" },
  "nav.about": { sq: "Rreth Nesh", en: "About Us" },
  "nav.contact": { sq: "Kontakt", en: "Contact" },
  "nav.partner": { sq: "Bëhu Partner", en: "Become Partner" },
  "nav.signin": { sq: "Hyr", en: "Sign In" },
  "nav.signup": { sq: "Regjistrohu", en: "Sign Up" },
  "nav.mybookings": { sq: "Rezervimet e mia", en: "My Bookings" },
  "nav.profile": { sq: "Profili im", en: "My Profile" },
  "nav.signout": { sq: "Dil nga llogaria", en: "Sign Out" },

  // Hero
  "hero.headline": { sq: "Ku çdo fshat tregon një histori", en: "Where every village tells a story" },
  "hero.sub": { sq: "Agroturizme, guida lokale dhe ture tematike", en: "Agritourism, local guides and thematic tours" },
  "hero.search_placeholder": { sq: "🏔️ Destinacioni...", en: "🏔️ Destination..." },
  "hero.search_type": { sq: "Lloji...", en: "Type..." },
  "hero.search_btn": { sq: "Kërko", en: "Search" },
  "hero.where_label": { sq: "Ku?", en: "Where to?" },
  "hero.when_label": { sq: "Kur?", en: "When" },
  "hero.category_label": { sq: "Lloji", en: "Category" },

  // Hero type options
  "hero.type.agritourism": { sq: "Agroturizëm", en: "Agritourism" },
  "hero.type.boutique": { sq: "Boutique Hotel", en: "Boutique Hotel" },
  "hero.type.wine": { sq: "Wine Tasting", en: "Wine Tasting" },
  "hero.type.daytour": { sq: "Day Tour", en: "Day Tour" },
  "hero.type.package": { sq: "Paketë", en: "Package" },

  // Stats
  "stats.destinations": { sq: "Destinacione", en: "Destinations" },
  "stats.guides": { sq: "Guida Lokale", en: "Local Guides" },
  "stats.packages": { sq: "Paketa Tematike", en: "Thematic Packages" },
  "stats.tourists": { sq: "Turistë/Vit", en: "Tourists/Year" },

  // Section titles
  "sections.destinations_title": { sq: "Destinacione të Zgjedhura", en: "Curated Destinations" },
  "sections.destinations_sub": { sq: "Destinacione të përzgjedhura që tregojnë përvojat më autentike të fshatrave shqiptare", en: "Handpicked destinations showcasing Albania's most authentic rural experiences" },
  "sections.tours_title": { sq: "Turne & Eksperienca", en: "Tours & Experiences" },
  "sections.tours_sub": { sq: "Nga aventura gjysmë-ditore deri në eksplorime të plota", en: "From half-day adventures to complete country explorations" },
  "sections.guides_title": { sq: "Guida Lokale", en: "Local Guides" },
  "sections.guides_sub": { sq: "Guida lokale të çertifikuar që sjellin historitë shqiptare në jetë", en: "Certified local guides who bring Albanian stories to life" },
  "sections.events_title": { sq: "Evente & Festivale", en: "Events & Festivals" },
  "sections.events_sub": { sq: "Zbulo eventet kulturore, festivalet dhe përvojat në Shqipëri", en: "Discover upcoming cultural events, festivals and experiences across Albania" },
  "sections.services_title": { sq: "Shërbime Udhëtimi", en: "Travel Services" },
  "sections.services_sub": { sq: "Gjithçka që ju nevojitet për një aventurë pa pengesa", en: "Everything you need for a seamless Albanian adventure" },
  "sections.packages_title": { sq: "Paketa Tematike", en: "Thematic Packages" },
  "sections.packages_sub": { sq: "Eksperienca all-inclusive — akomodim, guidë, transport & aktivitete", en: "All-inclusive curated experiences — accommodation, guide, transport & activities" },
  "sections.chat_title": { sq: "Komuniteti i Udhëtarëve", en: "Traveler Community" },
  "sections.chat_sub": { sq: "Lidhu me udhëtarë dhe guida lokale. Bëj pyetje, ndaj këshilla dhe planifico bashkë.", en: "Connect with fellow travelers and local guides. Ask questions, share tips, and plan together in real-time." },
  "sections.newsletter_title": { sq: "Mos Humb Asgjë", en: "Don't Miss Out" },
  "sections.newsletter_sub": { sq: "Merr frymëzim javore mbi thesaret e fshehura shqiptare, guida të reja dhe oferta ekskluzive.", en: "Get weekly inspiration on hidden Albanian gems, new guides, and exclusive deals." },
  "sections.reviews_title": { sq: "Çfarë thonë udhëtarët tanë", en: "What our travelers say" },

  // Category strip
  "cat.agritourism": { sq: "Agroturizëm", en: "Agritourism" },
  "cat.boutique": { sq: "Boutique Hotels", en: "Boutique Hotels" },
  "cat.guides": { sq: "Guida Lokale", en: "Local Guides" },
  "cat.daytours": { sq: "Day Tours", en: "Day Tours" },
  "cat.multiday": { sq: "Multi-Day", en: "Multi-Day" },
  "cat.carrental": { sq: "Car Rental", en: "Car Rental" },
  "cat.esim": { sq: "eSIM", en: "eSIM" },
  "cat.insurance": { sq: "Insurance", en: "Insurance" },
  "cat.wine": { sq: "Wine & Food", en: "Wine & Food" },
  "cat.adventure": { sq: "Adventure", en: "Adventure" },

  // Destination cards
  "dest.view": { sq: "Shiko →", en: "View →" },
  "dest.book": { sq: "Rezervo", en: "Request Booking" },
  "dest.view_all": { sq: "Shiko të gjitha destinacionet →", en: "View all destinations →" },
  "dest.no_tours": { sq: "Nuk ka turne në këtë kategori ende.", en: "No tours in this category yet." },
  "dest.error": { sq: "Gabim", en: "Error" },

  // Badge translations
  "badge.Organic": { sq: "Organike", en: "Organic" },
  "badge.Bregdet": { sq: "Bregdet", en: "Seaside" },
  "badge.Bestseller": { sq: "Bestseller", en: "Bestseller" },
  "badge.UNESCO": { sq: "UNESCO", en: "UNESCO" },
  "badge.Wine Estate": { sq: "Wine Estate", en: "Wine Estate" },

  // Tours
  "tours.book": { sq: "Rezervo Tur", en: "Book Tour" },
  "tours.view_all": { sq: "Shiko të gjitha turnet →", en: "View all tours →" },
  "tours.tab.day": { sq: "Ture Ditore", en: "Day Tours" },
  "tours.tab.3-4": { sq: "3-4 Ditë", en: "3-4 Days" },
  "tours.tab.5-7": { sq: "5-7 Ditë", en: "5-7 Days" },
  "tours.tab.10-11": { sq: "10-11 Ditë", en: "10-11 Days" },

  // Guides
  "guides.book": { sq: "Rezervo Guidën", en: "Book Guide" },
  "guides.view_all": { sq: "Shiko të gjithë guidat →", en: "View all guides →" },

  // Events
  "events.details": { sq: "Shiko Detajet", en: "View Details" },

  // Packages
  "packages.book": { sq: "Rezervo", en: "Book Now" },

  // Chat
  "chat.join": { sq: "Hyr në Chat", en: "Join Chat" },
  "chat.messages": { sq: "mesazhe", en: "messages" },
  "chat.placeholder": { sq: "Shkruaj mesazhin...", en: "Type a message..." },
  "chat.empty": { sq: "Asnjë mesazh ende. Bëhu i pari! 💬", en: "No messages yet. Be the first! 💬" },
  "chat.online": { sq: "online tani", en: "online now" },
  "chat.your_name": { sq: "Emri juaj", en: "Your name" },
  "chat.flag": { sq: "Flamuri", en: "Flag" },
  "chat.live": { sq: "Live Chat", en: "Live Chat" },

  // Newsletter
  "newsletter.subscribe": { sq: "Abonohu", en: "Subscribe" },
  "newsletter.subscribing": { sq: "Duke u abonuar...", en: "Subscribing..." },
  "newsletter.welcome": { sq: "Mirësevjen!", en: "Welcome!" },
  "newsletter.check_inbox": { sq: "Kontrolloni inbox-in. Ju u bashkuat me 2,847 entuziastë udhëtimi.", en: "Check your inbox. You've joined 2,847 other travel enthusiasts." },
  "newsletter.email_error": { sq: "Ju lutem vendosni një email të vlefshëm.", en: "Please enter a valid email address." },
  "newsletter.info": { sq: "2,847 abonentë • Pa spam • 1 email/javë • GDPR", en: "2,847 subscribers • No spam • 1 email/week • GDPR compliant" },

  // Booking modal
  "booking.title": { sq: "Kërkesë", en: "Request" },
  "booking.fullname": { sq: "Emri i plotë", en: "Full Name" },
  "booking.email": { sq: "Email", en: "Email" },
  "booking.phone": { sq: "Telefoni", en: "Phone" },
  "booking.checkin": { sq: "Data Check-in", en: "Check-in Date" },
  "booking.checkout": { sq: "Data Check-out", en: "Check-out Date" },
  "booking.date": { sq: "Data", en: "Date" },
  "booking.guests": { sq: "Numri i Personave", en: "Number of Guests" },
  "booking.guest": { sq: "person", en: "guest" },
  "booking.guests_plural": { sq: "persona", en: "guests" },
  "booking.special": { sq: "Kërkesa Speciale", en: "Special Requests" },
  "booking.optional": { sq: "opsionale", en: "optional" },
  "booking.special_placeholder": { sq: "Nevoja dietike, aksesibilitet, ose dëshira speciale...", en: "Any dietary needs, accessibility requirements, or special wishes..." },
  "booking.estimated": { sq: "Totali i Vlerësuar", en: "Estimated Total" },
  "booking.submit": { sq: "Dërgo Kërkesën", en: "Send Request" },
  "booking.success": { sq: "✅ Kërkesa u Dërgua! Do ju kontaktojmë brenda 24 orëve.", en: "✅ Request Sent! We'll confirm within 24 hours." },
  "booking.no_payment": { sq: "Nuk kërkohet pagësë tani. Do ju kontaktojmë.", en: "No payment required now. We'll contact you." },
  "booking.select_date": { sq: "Zgjidhni datën", en: "Select date" },
  "booking.error_date": { sq: "Ju lutem zgjidhni një datë", en: "Please select a date" },
  "booking.error_checkout": { sq: "Ju lutem zgjidhni datën e check-out", en: "Please select a check-out date" },

  // Footer
  "footer.discover": { sq: "Zbulo", en: "Discover" },
  "footer.destinations": { sq: "Destinacione", en: "Destinations" },
  "footer.daytours": { sq: "Ture Ditore", en: "Day Tours" },
  "footer.local_guides": { sq: "Guida Lokale", en: "Local Guides" },
  "footer.packages": { sq: "Paketa Tematike", en: "Thematic Packages" },
  "footer.services_title": { sq: "Shërbime", en: "Services" },
  "footer.about_title": { sq: "Rreth", en: "About" },
  "footer.our_story": { sq: "Historia Jonë", en: "Our Story" },
  "footer.contact_us": { sq: "Na Kontaktoni", en: "Contact Us" },
  "footer.description": { sq: "Marketplace-i i parë i turizmit rural në Shqipëri — duke lidhur udhëtarët me eksperienca autentike fshatarësh, guida lokale dhe aventura të kuratoruara që nga 2025.", en: "Albania's first rural tourism marketplace — connecting travelers with authentic village experiences, local guides, and curated adventures since 2025." },
} as const;

type TranslationKey = keyof typeof translations;

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "sq",
  setLang: () => {},
  t: (key) => key,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem("fshati_lang");
    return (saved === "en" || saved === "sq") ? saved : "sq";
  });

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem("fshati_lang", newLang);
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    const entry = translations[key];
    return entry ? entry[lang] : key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
