// Central site navigation + sitemap definitions.

export type NavLink = { label: string; to: string };

export const NAV_LINKS: readonly NavLink[] = [
  { label: "Ana Sayfa", to: "/" },
  { label: "Ürünler", to: "/urunler" },
  { label: "Markalar", to: "/markalar" },
  { label: "Kataloglar", to: "/kataloglar" },
  { label: "Hizmetler", to: "/hizmetler" },
  { label: "Sektörel", to: "/sektorel" },
  { label: "Kurumsal", to: "/kurumsal" },
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
  { path: "/urunler", changefreq: "weekly", priority: "0.9" },
  { path: "/urunler/elektrikli-el-aletleri", changefreq: "weekly", priority: "0.9" },
  { path: "/markalar", changefreq: "monthly", priority: "0.7" },
  { path: "/kataloglar", changefreq: "monthly", priority: "0.6" },
  { path: "/hizmetler", changefreq: "monthly", priority: "0.7" },
  { path: "/sektorel", changefreq: "monthly", priority: "0.7" },
  { path: "/kurumsal", changefreq: "yearly", priority: "0.5" },
  { path: "/teklif", changefreq: "monthly", priority: "0.8" },
  { path: "/iletisim", changefreq: "yearly", priority: "0.6" },
  { path: "/teknik-destek", changefreq: "monthly", priority: "0.6" },
  { path: "/kvkk", changefreq: "yearly", priority: "0.3" },
];