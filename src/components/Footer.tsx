const columns = [
  {
    title: "Discover",
    links: ["Destinations", "Day Tours", "Multi-Day Tours", "Local Guides", "Thematic Packages"],
  },
  {
    title: "Services",
    links: ["Car Rental", "eSIM & Internet", "Travel Insurance", "Airport Transfer", "Custom Itinerary"],
  },
  {
    title: "About",
    links: ["Our Story", "Blog", "Careers", "Press", "Contact Us"],
  },
];

const Footer = () => (
  <footer className="bg-forest text-cream">
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🏔️</span>
            <span className="font-heading text-2xl font-bold">
              Fshati<span className="text-seafoam">.al</span>
            </span>
          </div>
          <p className="text-sm text-cream/60 leading-relaxed">
            Albania's first rural tourism marketplace — connecting travelers with authentic village experiences, local guides, and curated adventures since 2025.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-heading text-lg font-bold mb-4">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-cream/60 hover:text-seafoam transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    <div className="border-t border-cream/10">
      <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-cream/40">© 2025 Fshati.al — All rights reserved</p>
        <div className="flex gap-4">
          {["🏆 Startup Albania 2025", "🤝 ATOA Partner", "✅ GDPR"].map((badge) => (
            <span key={badge} className="text-xs text-cream/40">{badge}</span>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
