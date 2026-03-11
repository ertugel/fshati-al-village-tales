import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import usePageMeta from "@/hooks/usePageMeta";

const infoCards = [
  { icon: Mail, label: "Email", value: "hello@fshati.al" },
  { icon: Phone, label: "WhatsApp", value: "+355 69 XXX XXXX" },
  { icon: MapPin, label: "Location", value: "Tiranë, Albania" },
];

const faqs = [
  { q: "How do I book a tour?", a: "Browse our tours page, pick a tour you love, select your date and group size, then click 'Book Now'. You'll receive a confirmation email with all the details." },
  { q: "Are guides certified?", a: "Yes — all guides on Fshati.al are vetted and certified. They have deep local knowledge, first-aid training, and speak multiple languages." },
  { q: "What is your cancellation policy?", a: "Free cancellation up to 48 hours before the experience. After that, a 50% fee applies. No-shows are non-refundable." },
  { q: "Do you offer group discounts?", a: "Absolutely! Groups of 6+ get 10% off, and groups of 12+ get 20% off. Contact us for custom group packages." },
  { q: "How do I list my property?", a: "Head to our 'Become a Partner' page and fill out the form. Our team will review your listing and get back to you within 48 hours." },
];

const Contact = () => {
  usePageMeta("Contact — Fshati.al");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Message sent! We'll reply within 24h");
      setLoading(false);
      (e.target as HTMLFormElement).reset();
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">Get In Touch</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">Have a question or need help planning your trip? We're here to help!</p>
          </motion.div>

          {/* Info cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
            {infoCards.map((c, i) => (
              <motion.div
                key={c.label}
                className="bg-card rounded-2xl border border-border p-6 text-center shadow-[var(--shadow-card)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <c.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{c.label}</p>
                <p className="font-medium text-foreground">{c.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Form + FAQ side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Form */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-8 shadow-[var(--shadow-card)] space-y-5">
                <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Send a Message</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Name</label>
                    <Input placeholder="Your name" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
                    <Input type="email" placeholder="email@example.com" required />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Subject</label>
                  <Input placeholder="How can we help?" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Message</label>
                  <Textarea placeholder="Write your message..." rows={5} required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  <Send className="h-4 w-4 mr-2" /> {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </motion.div>

            {/* FAQ */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="bg-card rounded-xl border border-border px-5">
                    <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
