import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Mesazhi u dërgua me sukses! Do t'ju kontaktojmë së shpejti.");
      setLoading(false);
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">Na Kontaktoni</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">Have a question or need help planning your trip? We're here to help!</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact info */}
            <motion.div className="space-y-8" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Informacione Kontakti</h2>
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-sage/20 flex items-center justify-center"><Mail className="h-5 w-5 text-sage" /></div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground">info@fshati.al</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-sage/20 flex items-center justify-center"><Phone className="h-5 w-5 text-sage" /></div>
                    <div>
                      <p className="text-sm text-muted-foreground">Telefon</p>
                      <p className="font-medium text-foreground">+355 69 123 4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-sage/20 flex items-center justify-center"><MapPin className="h-5 w-5 text-sage" /></div>
                    <div>
                      <p className="text-sm text-muted-foreground">Adresa</p>
                      <p className="font-medium text-foreground">Rruga e Barrikadave, Tiranë, Albania</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="font-heading text-lg font-bold text-foreground mb-3">Orari i punës</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">E Hënë – E Premte</span><span className="font-medium">09:00 – 18:00</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">E Shtunë</span><span className="font-medium">10:00 – 15:00</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">E Diel</span><span className="font-medium text-destructive">Mbyllur</span></div>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-8 shadow-card space-y-5">
                <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Dërgo Mesazh</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Emri</label>
                    <Input placeholder="Emri juaj" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
                    <Input type="email" placeholder="email@example.com" required />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Subjekti</label>
                  <Input placeholder="Si mund t'ju ndihmojmë?" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Mesazhi</label>
                  <Textarea placeholder="Shkruani mesazhin tuaj..." rows={5} required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  <Send className="h-4 w-4 mr-2" /> {loading ? "Duke dërguar..." : "Dërgo Mesazhin"}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
