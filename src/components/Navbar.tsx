import { useState, useEffect } from "react";

const navLinks = [
  { label: "Destinacione", href: "#destinations" },
  { label: "Turne", href: "#tours" },
  { label: "Guida", href: "#guides" },
  { label: "Paketa", href: "#packages" },
  { label: "Shërbime", href: "#services" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-card/95 backdrop-blur-md shadow-[var(--shadow-nav)]"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-4 lg:px-8">
        <a href="#" className="flex items-center gap-2">
          <span className="text-2xl">🏔️</span>
          <span
            className={`font-heading text-2xl font-bold tracking-tight transition-colors ${
              scrolled ? "text-foreground" : "text-cream"
            }`}
          >
            Fshati<span className="text-seafoam">.al</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors hover:text-seafoam ${
                scrolled ? "text-foreground" : "text-cream/80"
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#newsletter"
            className="rounded-full bg-seafoam/90 px-5 py-2 text-sm font-semibold text-forest transition hover:bg-seafoam"
          >
            Rezervo Tani
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <div className="space-y-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`block h-0.5 w-6 transition-all ${
                  scrolled ? "bg-foreground" : "bg-cream"
                }`}
              />
            ))}
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card/95 backdrop-blur-md border-t border-border px-4 pb-4">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-sm font-medium text-foreground hover:text-sage border-b border-border/50"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#newsletter"
            className="mt-3 block rounded-full bg-seafoam/90 px-5 py-2.5 text-center text-sm font-semibold text-forest"
          >
            Rezervo Tani
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
