import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError(t("newsletter.email_error"));
      return;
    }
    setLoading(true);
    const { error: dbError } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: email.trim().toLowerCase(), is_active: true });
    setLoading(false);
    // Duplicate email = already subscribed, still a success for the user
    if (dbError && dbError.code !== "23505") {
      setError(dbError.message);
      return;
    }
    setSubmitted(true);
  };

  return (
    <section id="newsletter" className="py-20 bg-sand/60">
      <div className="container mx-auto px-4">
        <motion.div className="max-w-xl mx-auto text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">{t("sections.newsletter_title")}</h2>
          <p className="text-muted-foreground mb-8">{t("sections.newsletter_sub")}</p>

          {submitted ? (
            <motion.div className="bg-seafoam/20 rounded-2xl p-8 border border-seafoam/30" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <span className="text-4xl block mb-3">🌿</span>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-2">{t("newsletter.welcome")}</h3>
              <p className="text-sm text-muted-foreground">{t("newsletter.check_inbox")}</p>
            </motion.div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
                  className="flex-1 rounded-xl bg-background px-4 py-3 text-sm outline-none border border-border focus:ring-2 focus:ring-sage/50" />
                <button type="submit" disabled={loading}
                  className="rounded-xl bg-forest px-6 py-3 text-sm font-semibold text-cream hover:bg-pine transition-colors whitespace-nowrap disabled:opacity-60 flex items-center gap-2">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? t("newsletter.subscribing") : t("newsletter.subscribe")}
                </button>
              </form>
              {error && <p className="text-sm text-destructive mt-2">{error}</p>}
            </>
          )}

          <p className="text-xs text-muted-foreground mt-4">{t("newsletter.info")}</p>

          <div className="flex justify-center gap-4 mt-6">
            {["🔒 No Spam", "📬 1/week", "✅ GDPR"].map((b) => (
              <span key={b} className="text-xs bg-background rounded-full px-3 py-1.5 text-muted-foreground border border-border">{b}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
