import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { LogIn, User, LayoutDashboard, ShieldCheck, LogOut, CalendarDays, X, Menu, UserCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AuthModal from "./AuthModal";
import LanguageToggle from "./LanguageToggle";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModal, setAuthModal] = useState<"signin" | "signup" | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, profile, hasRole, signOut, loading } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { label: t("nav.destinations"), href: "/destinations" },
    { label: t("nav.tours"), href: "/tours" },
    { label: t("nav.guides"), href: "/guides" },
    { label: t("nav.services"), href: "/services" },
    { label: t("nav.about"), href: "/about" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isHome = location.pathname === "/" || location.pathname === "/home";
  const showTransparent = isHome && !scrolled;

  const handleSignOut = async () => {
    await signOut();
    setDropdownOpen(false);
    navigate("/");
  };

  const userInitials = profile?.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || "U";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          showTransparent ? "bg-transparent" : "bg-card/95 backdrop-blur-md shadow-[var(--shadow-nav)]"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between py-4 px-4 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🏔️</span>
            <span className={`font-heading text-2xl font-bold tracking-tight transition-colors ${showTransparent ? "text-cream" : "text-foreground"}`}>
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
                  location.pathname === l.href ? "text-seafoam" : showTransparent ? "text-cream/80" : "text-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}

            <LanguageToggle transparent={showTransparent} />

            {!loading && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-seafoam ${showTransparent ? "text-cream/80" : "text-foreground"}`}
                >
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover border-2 border-seafoam/50" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-sage/30 flex items-center justify-center text-xs font-bold text-forest">
                      {userInitials}
                    </div>
                  )}
                  <span className="hidden xl:inline">{profile?.full_name || "Account"}</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      className="absolute right-0 top-full mt-2 w-56 bg-card rounded-xl border border-border shadow-card-hover py-2 z-50"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="px-4 py-2 border-b border-border mb-1">
                        <p className="text-sm font-medium text-foreground truncate">{profile?.full_name || "User"}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>

                      <Link to="/my-bookings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" /> {t("nav.mybookings")}
                      </Link>
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors">
                        <UserCircle className="h-4 w-4 text-muted-foreground" /> {t("nav.profile")}
                      </Link>

                      {hasRole("owner") && (
                        <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors">
                          <LayoutDashboard className="h-4 w-4 text-muted-foreground" /> Dashboard
                        </Link>
                      )}
                      {hasRole("admin") && (
                        <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors">
                          <ShieldCheck className="h-4 w-4 text-muted-foreground" /> Admin Panel
                        </Link>
                      )}

                      <div className="border-t border-border mt-1 pt-1">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
                        >
                          <LogOut className="h-4 w-4" /> {t("nav.signout")}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : !loading ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAuthModal("signin")}
                  className={`text-sm font-medium transition-colors hover:text-seafoam ${showTransparent ? "text-cream/80" : "text-foreground"}`}
                >
                  {t("nav.signin")}
                </button>
                <button
                  onClick={() => setAuthModal("signup")}
                  className="rounded-full bg-seafoam/90 px-5 py-2 text-sm font-semibold text-forest transition hover:bg-seafoam flex items-center gap-1.5"
                >
                  <LogIn className="h-3.5 w-3.5" /> {t("nav.signup")}
                </button>
              </div>
            ) : null}
          </div>

          {/* Mobile toggle */}
          <button className="lg:hidden p-2 relative z-[60]" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? (
              <X className="h-6 w-6 text-cream" />
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
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-cream/10 text-cream hover:bg-cream/20 hover:text-seafoam transition-colors z-[60]"
              aria-label={t("nav.close") || "Close menu"}
            >
              <X className="h-7 w-7" />
            </button>
            <nav className="flex flex-col items-center gap-6">
              {navLinks.map((l, i) => (
                <motion.div key={l.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                  <Link to={l.href} className={`font-heading text-2xl font-bold transition-colors ${location.pathname === l.href ? "text-seafoam" : "text-cream/80 hover:text-cream"}`}>
                    {l.label}
                  </Link>
                </motion.div>
              ))}

              <div className="w-16 h-px bg-cream/20 my-2" />

              <LanguageToggle transparent={true} />

              {user ? (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-seafoam/30 flex items-center justify-center text-sm font-bold text-cream">
                      {userInitials}
                    </div>
                    <div className="text-left">
                      <p className="text-cream font-medium text-sm">{profile?.full_name || "User"}</p>
                      <p className="text-cream/50 text-xs">{user.email}</p>
                    </div>
                  </div>
                  <Link to="/my-bookings" className="text-lg text-cream/80 hover:text-cream font-medium">📅 {t("nav.mybookings")}</Link>
                  <Link to="/profile" className="text-lg text-cream/80 hover:text-cream font-medium">👤 {t("nav.profile")}</Link>
                  {hasRole("owner") && <Link to="/dashboard" className="text-lg text-cream/80 hover:text-cream font-medium">🏠 Dashboard</Link>}
                  {hasRole("admin") && <Link to="/admin" className="text-lg text-cream/80 hover:text-cream font-medium">⚙️ Admin</Link>}
                  <button onClick={handleSignOut} className="mt-2 rounded-full bg-destructive/20 px-8 py-3 text-cream font-semibold hover:bg-destructive/30 transition-colors">
                    {t("nav.signout")}
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <button
                    onClick={() => { setMobileOpen(false); setAuthModal("signin"); }}
                    className="text-lg text-cream/80 hover:text-cream font-medium"
                  >
                    {t("nav.signin")}
                  </button>
                  <button
                    onClick={() => { setMobileOpen(false); setAuthModal("signup"); }}
                    className="rounded-full bg-seafoam/90 px-8 py-3 text-forest font-semibold hover:bg-seafoam transition-colors"
                  >
                    {t("nav.signup")}
                  </button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal
        open={authModal !== null}
        onClose={() => setAuthModal(null)}
        initialView={authModal || "signin"}
      />
    </>
  );
};

export default Navbar;
