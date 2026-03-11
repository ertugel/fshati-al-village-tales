import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <section id="newsletter" className="py-20 bg-sand/60">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">
            Mos Humb Asgjë
          </h2>
          <p className="text-muted-foreground mb-8">
            Get weekly inspiration on hidden Albanian gems, new guides, and exclusive deals.
          </p>

          {submitted ? (
            <motion.div
              className="bg-seafoam/20 rounded-2xl p-8 border border-seafoam/30"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <span className="text-4xl block mb-3">🌿</span>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-2">Welcome!</h3>
              <p className="text-sm text-muted-foreground">Check your inbox. You've joined 2,847 other travel enthusiasts.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 rounded-xl bg-background px-4 py-3 text-sm outline-none border border-border focus:ring-2 focus:ring-sage/50"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-forest px-6 py-3 text-sm font-semibold text-cream hover:bg-pine transition-colors whitespace-nowrap disabled:opacity-60 flex items-center gap-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
            </form>
          )}

          <p className="text-xs text-muted-foreground mt-4">
            2,847 subscribers • No spam • 1 email/week • GDPR compliant
          </p>

          <div className="flex justify-center gap-4 mt-6">
            {["🔒 No Spam", "📬 1/week", "✅ GDPR"].map((b) => (
              <span key={b} className="text-xs bg-background rounded-full px-3 py-1.5 text-muted-foreground border border-border">
                {b}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
