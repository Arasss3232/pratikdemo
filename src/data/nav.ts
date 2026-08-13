// Central site navigation + sitemap definitions.

export type NavLink = { label: string; to: string };

export const NAV_LINKS: readonly NavLink[] = [
  { label: "Kurumsal", to: "/hakkimizda" },
  { label: "Ürünler", to: "/urunler" },
  { label: "Bayiliklerimiz", to: "/bayiliklerimiz" },
  { label: "Kataloglar", to: "/kataloglar" },
  { label: "İletişim", to: "/iletisim" },
];

export type SitemapEntry = {
  path: string;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: string;
};

export const SITEMAP_ENTRIES: readonly SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/hakkimizda", changefreq: "monthly", priority: "0.8" },
  { path: "/urunler", changefreq: "weekly", priority: "0.9" },
  { path: "/kataloglar", changefreq: "weekly", priority: "0.8" },
  { path: "/bayiliklerimiz", changefreq: "monthly", priority: "0.8" },
  
  { path: "/teklif", changefreq: "monthly", priority: "1.0" },
  { path: "/iletisim", changefreq: "yearly", priority: "0.6" },
  { path: "/kvkk", changefreq: "yearly", priority: "0.3" },
];