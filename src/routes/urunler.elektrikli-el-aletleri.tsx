import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CatalogToolbar } from "../components/catalog/CatalogToolbar";
import type { ActiveCatalogFilter, CatalogSort, CatalogView } from "../components/catalog/CatalogToolbar";
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
const PRODUCTS_PER_PAGE = 2;

const BRAND_LABELS: Record<(typeof PRODUCTS)[number]["brand"], string> = {
  bosch: "Bosch Professional",
  makita: "Makita",
  dewalt: "DeWalt",
  hilti: "Hilti",
};

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
      { rel: "preload", as: "image", href: HERO_BG, fetchPriority: "high" },
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
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedApplications, setSelectedApplications] = useState<string[]>(["Metal"]);
  const [brandSearch, setBrandSearch] = useState("");
  const [sort, setSort] = useState<CatalogSort>("recommended");
  const [view, setView] = useState<CatalogView>("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const toggleValue = (value: string, setter: (next: string[]) => void, current: string[]) => {
    setter(current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

  const filteredProducts = useMemo(() => {
    const matches = PRODUCTS.filter((product) => {
      const brandMatches = selectedBrands.length === 0 || selectedBrands.includes(BRAND_LABELS[product.brand]);
      const subcategoryMatches =
        selectedSubcategories.length === 0 || selectedSubcategories.some((category) => productMatchesSubcategory(product.name, category));
      const applicationMatches =
        selectedApplications.length === 0 || selectedApplications.some((application) => productMatchesApplication(product.name, application));
      return brandMatches && subcategoryMatches && applicationMatches;
    });

    return [...matches].sort((a, b) => {
      if (sort === "name-asc") return a.name.localeCompare(b.name, "tr");
      if (sort === "name-desc") return b.name.localeCompare(a.name, "tr");
      if (sort === "sku") return a.sku.localeCompare(b.sku, "tr");
      return PRODUCTS.indexOf(a) - PRODUCTS.indexOf(b);
    });
  }, [selectedApplications, selectedBrands, selectedSubcategories, sort]);

  const activeFilters: ActiveCatalogFilter[] = [
    ...selectedSubcategories.map((label) => ({ id: `subcategory:${label}`, label })),
    ...selectedBrands.map((label) => ({ id: `brand:${label}`, label: `Marka: ${label}` })),
    ...selectedApplications.map((label) => ({ id: `application:${label}`, label: `Uygulama: ${label}` })),
  ];

  const pageCount = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedApplications, selectedBrands, selectedSubcategories, sort, view]);

  const clearFilters = () => {
    setSelectedSubcategories([]);
    setSelectedBrands([]);
    setSelectedApplications([]);
    setBrandSearch("");
  };

  const removeFilter = (id: string) => {
    const [type, ...valueParts] = id.split(":");
    const value = valueParts.join(":");
    if (type === "subcategory") setSelectedSubcategories((items) => items.filter((item) => item !== value));
    if (type === "brand") setSelectedBrands((items) => items.filter((item) => item !== value));
    if (type === "application") setSelectedApplications((items) => items.filter((item) => item !== value));
  };

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
            <FilterSidebar
              selectedSubcategories={selectedSubcategories}
              selectedBrands={selectedBrands}
              selectedApplications={selectedApplications}
              brandSearch={brandSearch}
              onToggleSubcategory={(label) => toggleValue(label, setSelectedSubcategories, selectedSubcategories)}
              onToggleBrand={(label) => toggleValue(label, setSelectedBrands, selectedBrands)}
              onToggleApplication={(label) => toggleValue(label, setSelectedApplications, selectedApplications)}
              onBrandSearchChange={setBrandSearch}
              onClear={clearFilters}
            />
            <div id="catalog-results" className="flex-grow flex flex-col scroll-mt-28">
              <CatalogToolbar
                count={filteredProducts.length}
                sort={sort}
                view={view}
                activeFilters={activeFilters}
                onSortChange={setSort}
                onViewChange={setView}
                onRemoveFilter={removeFilter}
              />
              <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "grid grid-cols-1 gap-4"}>
                  {displayedProducts.map((p) => (
                  <ProductCard key={p.sku} p={p} view={view} />
                ))}
              </div>
              {filteredProducts.length === 0 && (
                <div className="border border-outline-variant bg-surface-container-lowest rounded p-8 text-center text-on-surface-variant">
                  Bu filtrelerle eşleşen ürün bulunamadı. Filtreleri temizleyerek tekrar deneyin.
                </div>
              )}
              <Pagination
                currentPage={currentPage}
                pageCount={pageCount}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  document.getElementById("catalog-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              />
            </div>
          </div>
        </div>

        <FeaturedBrands />
        <CategoryCta />
      </>
    </SiteShell>
  );
}

function productMatchesSubcategory(productName: string, category: string) {
  const name = productName.toLocaleLowerCase("tr");
  const normalizedCategory = category.toLocaleLowerCase("tr");
  if (normalizedCategory.includes("matkap")) return name.includes("matkap");
  if (normalizedCategory.includes("vidalama")) return name.includes("vidalama");
  if (normalizedCategory.includes("taşlama")) return name.includes("taşlama");
  if (normalizedCategory.includes("kırıcı")) return name.includes("kırıcı") || name.includes("delici");
  if (normalizedCategory.includes("testere")) return name.includes("testere");
  return true;
}

function productMatchesApplication(productName: string, application: string) {
  const name = productName.toLocaleLowerCase("tr");
  if (application === "Ahşap") return name.includes("matkap") || name.includes("vidalama");
  if (application === "Metal") return name.includes("taşlama") || name.includes("matkap") || name.includes("vidalama") || name.includes("delici");
  if (application === "Beton") return name.includes("kırıcı") || name.includes("delici") || name.includes("matkap");
  if (application === "Montaj") return name.includes("vidalama") || name.includes("matkap");
  return true;
}