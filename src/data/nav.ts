// Central site navigation + sitemap definitions.

export type NavLink = { label: string; to: string };

export const NAV_LINKS: readonly NavLink[] = [
  { label: "Ana Sayfa", to: "/" },
  { label: "Kurumsal", to: "/hakkimizda" },
  { label: "Ürün Kategorileri", to: "/urunler" },
  { label: "Kataloglarımız", to: "/kataloglar" },
  { label: "Markalar", to: "/markalar" },
  { label: "Bayiliklerimiz", to: "/bayiliklerimiz" },
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
  { path: "/bayiliklerimiz", changefreq: "monthly", priority: "0.7" },
  { path: "/markalar", changefreq: "monthly", priority: "0.7" },
  { path: "/teknik-destek", changefreq: "monthly", priority: "0.6" },
  { path: "/teklif", changefreq: "monthly", priority: "0.8" },
  { path: "/iletisim", changefreq: "yearly", priority: "0.6" },
  { path: "/kvkk", changefreq: "yearly", priority: "0.3" },
];