import { createFileRoute } from "@tanstack/react-router";
import { CatalogToolbar } from "../components/catalog/CatalogToolbar";
import { CategoryCta } from "../components/catalog/CategoryCta";
import { CategoryHero } from "../components/catalog/CategoryHero";
import { FeaturedBrands } from "../components/catalog/FeaturedBrands";
import { FilterSidebar } from "../components/catalog/FilterSidebar";
import { Pagination } from "../components/catalog/Pagination";
import { ProductCard } from "../components/catalog/ProductCard";
import { SiteShell } from "../components/site-shell";
import { HERO_BG, PRODUCTS } from "../data/catalog";

const CATEGORY_TITLE = "Elektrikli El Aletleri";
const CATEGORY_DESC =
  "Zorlu endüstriyel koşullara dayanıklı, yüksek performanslı ve uzun ömürlü profesyonel elektrikli el aletleri. Matkaplardan taşlama makinelerine kadar geniş ürün yelpazesiyle projelerinize güç katın.";

export const Route = createFileRoute("/urunler/elektrikli-el-aletleri")({
  head: () => ({
    meta: [
      { title: "Elektrikli El Aletleri — Bosch, Makita, DeWalt, Hilti | Pratik" },
      {
        name: "description",
        content:
          "Profesyonel elektrikli el aletleri: darbeli matkap, avuç taşlama, kırıcı delici ve vidalama makineleri. Bosch, Makita, DeWalt, Hilti orijinal ürün garantisiyle.",
      },
      {
        property: "og:title",
        content: "Elektrikli El Aletleri — Bosch, Makita, DeWalt, Hilti",
      },
      {
        property: "og:description",
        content:
          "Sanayi ve şantiye için profesyonel elektrikli el aletleri. Orijinal, garantili, hızlı tedarik.",
      },
      { property: "og:url", content: "/urunler/elektrikli-el-aletleri" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: HERO_BG },
      { name: "twitter:image", content: HERO_BG },
    ],
    links: [
      { rel: "canonical", href: "/urunler/elektrikli-el-aletleri" },
      { rel: "preload", as: "image", href: HERO_BG, fetchpriority: "high" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "/" },
            { "@type": "ListItem", position: 2, name: "Ürünler", item: "/urunler" },
            {
              "@type": "ListItem",
              position: 3,
              name: CATEGORY_TITLE,
              item: "/urunler/elektrikli-el-aletleri",
            },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: CATEGORY_TITLE,
          itemListElement: PRODUCTS.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Product",
              name: p.name,
              sku: p.sku,
              image: p.productImg,
              brand: { "@type": "Brand", name: p.brand },
              offers: {
                "@type": "Offer",
                availability:
                  p.stock === "in"
                    ? "https://schema.org/InStock"
                    : "https://schema.org/LimitedAvailability",
              },
            },
          })),
        }),
      },
    ],
  }),
  component: ElectricToolsPage,
});

function ElectricToolsPage() {
  return (
    <SiteShell>
      <>
        <CategoryHero
          bgImage={HERO_BG}
          title={CATEGORY_TITLE}
          description={CATEGORY_DESC}
          crumb={CATEGORY_TITLE}
        />

        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20">
          <div className="flex flex-col lg:flex-row gap-gutter">
            <FilterSidebar />
            <div className="flex-grow flex flex-col">
              <CatalogToolbar />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PRODUCTS.map((p) => (
                  <ProductCard key={p.sku} p={p} />
                ))}
              </div>
              <Pagination />
            </div>
          </div>
        </div>

        <FeaturedBrands />
        <CategoryCta />
      </>
    </SiteShell>
  );
}