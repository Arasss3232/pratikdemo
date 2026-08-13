import { createFileRoute, Outlet, useMatchRoute } from "@tanstack/react-router";
import { SiteShell } from "../components/site-shell";
import { PageHero } from "../components/marketing/PageHero";
import { CategoryCard } from "../components/marketing/CategoryCard";
import { useCategories } from "@/hooks/use-categories";
import { usePageContent } from "@/hooks/use-page-content";

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

function UrunlerLayout() {
  const matchRoute = useMatchRoute();
  const isIndex = matchRoute({ to: "/urunler" });
  const { categories, isLoading } = useCategories();
  const { sections } = usePageContent("/urunler");
  const hero = sections["hero"]?.content || {};
  
  if (!isIndex) return <Outlet />;

  return (
    <SiteShell>
      <>
        <PageHero
          title={hero.title?.value_text || "Ürün Kategorileri"}
          description={hero.description?.value_text || "20.000'i aşkın profesyonel endüstriyel ürünümüzü kategoriler halinde inceleyin. Aradığınız ürünü bulamıyorsanız satın alma ekibimiz size özel tedarik sağlar."}
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