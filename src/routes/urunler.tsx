import { createFileRoute, Outlet, useMatchRoute } from "@tanstack/react-router";
import { SiteShell } from "../components/site-shell";
import { PageHero } from "../components/marketing/PageHero";
import { CategoryCard } from "../components/marketing/CategoryCard";

export const Route = createFileRoute("/urunler")({
  head: () => ({
    meta: [
      { title: "Endüstriyel Ürün Kategorileri — Pratik" },
      {
        name: "description",
        content:
          "Elektrikli el aletleri, bağlantı elemanları, KKD, sarf malzemeleri ve daha fazlası. Tüm endüstriyel ürün kategorilerimizi keşfedin.",
      },
      { property: "og:title", content: "Endüstriyel Ürün Kategorileri — Pratik" },
      {
        property: "og:description",
        content:
          "20.000+ profesyonel ürün, tek tedarikçiden. Tüm endüstriyel ürün kategorilerimizi keşfedin.",
      },
      { property: "og:url", content: "/urunler" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/urunler" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "/" },
            { "@type": "ListItem", position: 2, name: "Ürünler", item: "/urunler" },
          ],
        }),
      },
    ],
  }),
  component: UrunlerLayout,
});

const CATEGORIES = [
  {
    icon: "hardware",
    title: "Elektrikli El Aletleri",
    desc: "Matkap, taşlama, vidalama, kırıcı delici ve kesim makineleri.",
    count: 341,
    to: "/urunler/elektrikli-el-aletleri" as const,
  },
  {
    icon: "settings",
    title: "Bağlantı Elemanları",
    desc: "Cıvata, somun, pul ve özel bağlantı çözümleri.",
    count: 1240,
    to: "/urunler" as const,
  },
  {
    icon: "shield",
    title: "Kişisel Koruyucu Donanım",
    desc: "Baret, gözlük, eldiven, ayakkabı ve iş güvenliği ürünleri.",
    count: 512,
    to: "/urunler" as const,
  },
  {
    icon: "precision_manufacturing",
    title: "Endüstriyel Makineler",
    desc: "Kompresör, jeneratör ve atölye ekipmanları.",
    count: 178,
    to: "/urunler" as const,
  },
  {
    icon: "build",
    title: "El Aletleri",
    desc: "Anahtar takımları, tornavidalar, pense ve el aletleri.",
    count: 623,
    to: "/urunler" as const,
  },
  {
    icon: "inventory_2",
    title: "Sarf Malzemeleri",
    desc: "Kesme, taşlama diskleri, uçlar ve tüketim malzemeleri.",
    count: 1892,
    to: "/urunler" as const,
  },
];

function UrunlerLayout() {
  const matchRoute = useMatchRoute();
  const isIndex = matchRoute({ to: "/urunler" });
  if (!isIndex) return <Outlet />;
  return (
    <SiteShell>
      <>
        <PageHero
          title="Tüm Ürün Kategorileri"
          description="20.000'i aşkın profesyonel endüstriyel ürünümüzü kategoriler halinde inceleyin. Aradığınız ürünü bulamıyorsanız satın alma ekibimiz size özel tedarik sağlar."
          breadcrumb={[{ label: "Ana Sayfa", to: "/" }, { label: "Ürünler" }]}
        />
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {CATEGORIES.map((c) => (
              <CategoryCard key={c.title} {...c} />
            ))}
          </div>
        </div>
      </>
    </SiteShell>
  );
}