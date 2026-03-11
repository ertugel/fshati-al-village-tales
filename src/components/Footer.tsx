import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const columns = [
  {
    title: "Discover",
    links: [
      { label: "Destinations", href: "/destinations" },
      { label: "Day Tours", href: "/tours" },
      { label: "Local Guides", href: "/guides" },
      { label: "Thematic Packages", href: "/home#packages" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Car Rental", href: "/services" },
      { label: "eSIM & Internet", href: "/services" },
      { label: "Travel Insurance", href: "/services" },
      { label: "Airport Transfer", href: "/services" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];

const Footer = () => {
  const navigate = useNavigate();
  const [clicks, setClicks] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleCopyrightClick = () => {
    const next = clicks + 1;
    if (next >= 3) {
      setClicks(0);
      clearTimeout(timerRef.current);
      navigate("/admin");
      return;
    }
    setClicks(next);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setClicks(0), 1500);
  };

  return (
    <footer className="bg-forest text-cream">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/home" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🏔️</span>
              <span className="font-heading text-2xl font-bold">
                Fshati<span className="text-seafoam">.al</span>
              </span>
            </Link>
            <p className="text-sm text-cream/60 leading-relaxed">
              Albania's first rural tourism marketplace — connecting travelers with authentic village experiences, local guides, and curated adventures since 2025.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-heading text-lg font-bold mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-sm text-cream/60 hover:text-seafoam transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="text-xs text-cream/40 cursor-default select-none"
            onClick={handleCopyrightClick}
          >
            © 2025 Fshati.al · Startup Albania 2025
          </p>
          <div className="flex gap-4">
            {["🤝 ATOA Partner", "✅ GDPR"].map((badge) => (
              <span key={badge} className="text-xs text-cream/40">{badge}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
