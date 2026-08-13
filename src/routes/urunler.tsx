import { createFileRoute, Outlet, useMatchRoute } from "@tanstack/react-router";
import { SiteShell } from "../components/site-shell";
import { PageHero } from "../components/marketing/PageHero";
import { CategoryCard } from "../components/marketing/CategoryCard";
import { useCategories } from "@/hooks/use-categories";


export const Route = createFileRoute("/urunler")({
  head: () => ({
    meta: [
      { title: "Ürün Kategorileri — Pratik" },
      {
        name: "description",
        content:
          "Elektrikli el aletleri, bağlantı elemanları, KKD, sarf malzemeleri ve daha fazlası. Tüm endüstriyel ürün kategorilerimizi keşfedin.",
      },
      { property: "og:title", content: "Ürün Kategorileri — Pratik" },
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
            { "@type": "ListItem", position: 2, name: "Ürün Kategorileri", item: "/urunler" },
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
    to: "/teklif" as const,
    category: "Elektrikli El Aletleri",
  },
  {
    icon: "settings",
    title: "Bağlantı Elemanları",
    desc: "Cıvata, somun, pul ve özel bağlantı çözümleri.",
    to: "/teklif" as const,
    category: "Bağlantı Elemanları",
  },
  {
    icon: "shield",
    title: "Kişisel Koruyucu Donanım",
    desc: "Baret, gözlük, eldiven, ayakkabı ve iş güvenliği ürünleri.",
    to: "/teklif" as const,
    category: "Kişisel Koruyucu Donanım",
  },
  {
    icon: "precision_manufacturing",
    title: "Endüstriyel Makineler",
    desc: "Kompresör, jeneratör ve atölye ekipmanları.",
    to: "/teklif" as const,
    category: "Endüstriyel Makineler",
  },
  {
    icon: "build",
    title: "El Aletleri",
    desc: "Anahtar takımları, tornavidalar, pense ve el aletleri.",
    to: "/teklif" as const,
    category: "El Aletleri",
  },
  {
    icon: "inventory_2",
    title: "Sarf Malzemeleri",
    desc: "Kesme, taşlama diskleri, uçlar ve tüketim malzemeleri.",
    to: "/teklif" as const,
    category: "Sarf Malzemeleri",
  },
];

function UrunlerLayout() {
  const matchRoute = useMatchRoute();
  const isIndex = matchRoute({ to: "/urunler" });
  const { categories, isLoading } = useCategories();
  
  if (!isIndex) return <Outlet />;

  
  return (
    <SiteShell>
      <>
        <PageHero
          title="Ürün Kategorileri"
          description="20.000'i aşkın profesyonel endüstriyel ürünümüzü kategoriler halinde inceleyin. Aradığınız ürünü bulamıyorsanız satın alma ekibimiz size özel tedarik sağlar."
          breadcrumb={[{ label: "Ana Sayfa", to: "/" }, { label: "Ürün Kategorileri" }]}
        />
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {isLoading ? (
              <div className="col-span-full py-20 text-center text-on-surface-variant/50">Kategoriler yükleniyor...</div>
            ) : (
              categories?.map((c: any) => (
                <CategoryCard 
                  key={c.id} 

                  title={c.title}
                  desc={c.description || "Profesyonel endüstriyel çözümler."}
                  icon={c.icon || "hardware"}
                  to="/teklif"
                  search={{ 
                    categoryId: c.id
                  }} 
                />
              ))
            )}
          </div>

        </div>
      </>
    </SiteShell>
  );
}