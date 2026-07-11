// Central site navigation + sitemap definitions.

export type NavLink = { label: string; to: string };

export const NAV_LINKS: readonly NavLink[] = [
  { label: "Ana Sayfa", to: "/" },
  { label: "Kurumsal", to: "/hakkimizda" },
  { label: "Ürünler", to: "/urunler" },
  { label: "Hizmetler", to: "/hizmetler" },
  { label: "Referanslar", to: "/referanslar" },
  { label: "Blog", to: "/blog" },
  { label: "Kariyer", to: "/kariyer" },
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
  { path: "/urunler/elektrikli-el-aletleri", changefreq: "weekly", priority: "0.9" },
  { path: "/hizmetler", changefreq: "monthly", priority: "0.7" },
  { path: "/referanslar", changefreq: "monthly", priority: "0.7" },
  { path: "/blog", changefreq: "weekly", priority: "0.7" },
  { path: "/kariyer", changefreq: "monthly", priority: "0.6" },
  { path: "/teklif", changefreq: "monthly", priority: "0.8" },
  { path: "/iletisim", changefreq: "yearly", priority: "0.6" },
  { path: "/kvkk", changefreq: "yearly", priority: "0.3" },
];