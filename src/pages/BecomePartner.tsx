import { useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, TrendingUp, Megaphone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const benefits = [
  { icon: BadgeCheck, title: "Free Listing", description: "No upfront costs. List your property and start receiving bookings at zero cost to you." },
  { icon: TrendingUp, title: "90% Revenue", description: "Keep 90% of every booking. We only take a small commission to cover platform costs." },
  { icon: Megaphone, title: "Marketing Support", description: "We promote your listing to thousands of travelers through social media, SEO, and partnerships." },
];

const propertyTypes = ["Guesthouse", "Agritourism", "Boutique Hotel", "Camping", "Villa", "Eco-Lodge", "Other"];

const BecomePartner = () => {
  const [loading, setLoading] = useState(false);
  const [propertyType, setPropertyType] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || "").trim(),
      business_name: String(data.get("business_name") || "").trim(),
      property_type: propertyType,
      location: String(data.get("location") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      message: String(data.get("message") || "").trim() || null,
    };

    if (!payload.name || !payload.business_name || !payload.property_type || !payload.location || !payload.phone) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("partner_applications").insert(payload);
    setLoading(false);

    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }

    toast.success("Application submitted! We'll contact you within 48 hours.");
    form.reset();
    setPropertyType("");
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Bëhu Partner — Lista Falas | Fshati.al"
        description="Lista biznesin tuaj turistik falas. Agroturizme, hotele, kantina, guida. 90% të ardhurave direkt tek ju. 12,000+ turistë/vit."
        path="/become-a-partner"
      />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-20">
        <div className="gradient-hero py-24 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <motion.h1
              className="font-heading text-4xl md:text-6xl font-bold text-cream max-w-3xl mx-auto leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Earn more from your property
            </motion.h1>
            <motion.p
              className="mt-6 text-cream/70 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Join 300+ accommodation owners across Albania who are growing their business with Fshati.al
            </motion.p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-14">Why Partner With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                className="bg-card rounded-2xl border border-border p-8 text-center shadow-[var(--shadow-card)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <b.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-20 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-10">Apply to Join</h2>
            <form onSubmit={handleSubmit} className="bg-background rounded-2xl border border-border p-8 shadow-[var(--shadow-card)] space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Your Name</label>
                  <Input name="name" placeholder="Full name" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Business Name</label>
                  <Input name="business_name" placeholder="Property / business name" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Property Type</label>
                  <Select value={propertyType} onValueChange={setPropertyType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Location</label>
                  <Input name="location" placeholder="City / village" required />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Phone</label>
                <Input name="phone" type="tel" placeholder="+355 6X XXX XXXX" required />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Message (optional)</label>
                <Textarea name="message" placeholder="Tell us about your property..." rows={4} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Message (optional)</label>
                <Textarea placeholder="Tell us about your property..." rows={4} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                <Send className="h-4 w-4 mr-2" /> {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BecomePartner;
