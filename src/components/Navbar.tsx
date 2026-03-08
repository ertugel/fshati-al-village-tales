import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, User, LayoutDashboard, ShieldCheck, LogOut, CalendarDays, X, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Destinacione", href: "/destinations" },
  { label: "Turne", href: "/tours" },
  { label: "Guida", href: "/guides" },
  { label: "Shërbime", href: "/services" },
  { label: "Rreth Nesh", href: "/about" },
  { label: "Kontakt", href: "/contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, hasRole, signOut } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === "/home" || location.pathname === "/";
  const showTransparent = isHome && !scrolled;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          showTransparent
            ? "bg-transparent"
            : "bg-card/95 backdrop-blur-md shadow-[var(--shadow-nav)]"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between py-4 px-4 lg:px-8">
          <Link to="/home" className="flex items-center gap-2">
            <span className="text-2xl">🏔️</span>
            <span
              className={`font-heading text-2xl font-bold tracking-tight transition-colors ${
                showTransparent ? "text-cream" : "text-foreground"
              }`}
            >
              Fshati<span className="text-seafoam">.al</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-5">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className={`text-sm font-medium transition-colors hover:text-seafoam ${
                  location.pathname === l.href
                    ? "text-seafoam"
                    : showTransparent
                    ? "text-cream/80"
                    : "text-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/profile" className={`text-sm font-medium transition-colors hover:text-seafoam flex items-center gap-1 ${showTransparent ? "text-cream/80" : "text-foreground"}`}>
                  <User className="h-3.5 w-3.5" /> Profili
                </Link>
                <Link to="/my-bookings" className={`text-sm font-medium transition-colors hover:text-seafoam flex items-center gap-1 ${showTransparent ? "text-cream/80" : "text-foreground"}`}>
                  <CalendarDays className="h-3.5 w-3.5" /> Rezervimet
                </Link>
                {hasRole("owner") && (
                  <Link to="/dashboard" className={`text-sm font-medium transition-colors hover:text-seafoam flex items-center gap-1 ${showTransparent ? "text-cream/80" : "text-foreground"}`}>
                    <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
                  </Link>
                )}
                {hasRole("admin") && (
                  <Link to="/admin" className={`text-sm font-medium transition-colors hover:text-seafoam flex items-center gap-1 ${showTransparent ? "text-cream/80" : "text-foreground"}`}>
                    <ShieldCheck className="h-3.5 w-3.5" /> Admin
                  </Link>
                )}
                <button
                  onClick={signOut}
                  className={`text-sm font-medium transition-colors hover:text-seafoam flex items-center gap-1 ${showTransparent ? "text-cream/80" : "text-foreground"}`}
                >
                  <LogOut className="h-3.5 w-3.5" /> Dil
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="rounded-full bg-seafoam/90 px-5 py-2 text-sm font-semibold text-forest transition hover:bg-seafoam flex items-center gap-1.5"
              >
                <LogIn className="h-3.5 w-3.5" /> Hyr / Regjistrohu
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 relative z-[60]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? (
              <X className={`h-6 w-6 text-cream`} />
            ) : (
              <Menu className={`h-6 w-6 ${showTransparent ? "text-cream" : "text-foreground"}`} />
            )}
          </button>
        </div>
      </nav>

      {/* Full-screen mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[55] gradient-hero flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col items-center gap-6">
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    to={l.href}
                    className={`font-heading text-2xl font-bold transition-colors ${
                      location.pathname === l.href ? "text-seafoam" : "text-cream/80 hover:text-cream"
                    }`}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}

              <div className="w-16 h-px bg-cream/20 my-2" />

              {user ? (
                <>
                  <Link to="/profile" className="text-lg text-cream/80 hover:text-cream font-medium">👤 Profili</Link>
                  <Link to="/my-bookings" className="text-lg text-cream/80 hover:text-cream font-medium">📅 Rezervimet</Link>
                  {hasRole("owner") && <Link to="/dashboard" className="text-lg text-cream/80 hover:text-cream font-medium">🏠 Dashboard</Link>}
                  {hasRole("admin") && <Link to="/admin" className="text-lg text-cream/80 hover:text-cream font-medium">⚙️ Admin</Link>}
                  <button onClick={signOut} className="mt-2 rounded-full bg-destructive/20 px-8 py-3 text-cream font-semibold hover:bg-destructive/30 transition-colors">
                    Dil
                  </button>
                </>
              ) : (
                <Link to="/auth" className="mt-2 rounded-full bg-seafoam/90 px-8 py-3 text-forest font-semibold hover:bg-seafoam transition-colors">
                  Hyr / Regjistrohu
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
