import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteShell } from "../components/site-shell";
import { useHomeBrands } from "../hooks/use-home-data";
import { PageHero } from "../components/marketing/PageHero";

export const Route = createFileRoute("/markalar")({
  head: () => ({
    meta: [
      { title: "Yetkili Distribütör Markalar — Pratik" },
      { name: "description", content: "Bosch, Makita, DeWalt, Hilti, Milwaukee ve daha fazlası — Pratik güvencesiyle sunulan profesyonel endüstriyel donanım markaları." },
      { property: "og:title", content: "Yetkili Distribütör Markalar — Pratik" },
      { property: "og:description", content: "Dünyanın önde gelen endüstriyel donanım markalarının orijinal, garantili ürünleri Pratik'te." },
      { property: "og:url", content: "/markalar" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/markalar" }],
  }),
  component: MarkalarPage,
});

function MarkalarPage() {
  const { data: brands = [], isLoading } = useHomeBrands();
  const [selectedBrand, setSelectedBrand] = useState<any>(null);

  return (
    <SiteShell>
      <PageHero
        title="Yetkili Distribütörlüklerimiz"
        description="Dünya çapında güvenilir markaların yetkili distribütörü ve satış noktası olarak, projeleriniz için orijinal yedek parça ve garanti güvencesi sunuyoruz."
        breadcrumb={[{ label: "Ana Sayfa", to: "/" }, { label: "Markalar" }]}
      />

      <section className="py-20 bg-background">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-gutter animate-pulse">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-video bg-surface-container-low border border-outline-variant" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-gutter">
              {brands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => setSelectedBrand(brand)}
                  className="group relative bg-white border border-outline-variant p-8 flex items-center justify-center aspect-video hover:border-primary hover:shadow-lg transition-all"
                >
                  <img
                    src={brand.logo_url}
                    alt={brand.name}
                    className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300 pointer-events-none"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Brand Detail Modal */}
      {selectedBrand && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedBrand(null)}
          onKeyDown={(e) => e.key === "Escape" && setSelectedBrand(null)}
          tabIndex={-1}
        >
          <div 
            className="bg-white max-w-lg w-full rounded-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-10 text-center flex flex-col items-center">
              <button 
                onClick={() => setSelectedBrand(null)}
                className="absolute top-4 right-4 text-outline hover:text-on-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
              
              <div className="h-24 flex items-center justify-center mb-8">
                <img
                  src={selectedBrand.logo_url}
                  alt={selectedBrand.name}
                  className="max-h-full object-contain"
                />
              </div>
              
              <h2 className="hp-h2 mb-4">{selectedBrand.name}</h2>
              {selectedBrand.description && (
                <p className="text-on-surface-variant mb-8">
                  {selectedBrand.description}
                </p>
              )}
              {!selectedBrand.description && (
                <p className="text-on-surface-variant mb-8">
                  {selectedBrand.name} markasının tüm profesyonel ürün grupları için yetkili satış ve teknik destek noktası olarak hizmet vermekteyiz.
                </p>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button 
                  onClick={() => setSelectedBrand(null)}
                  className="pub-btn pub-btn-outline-dark flex-1"
                >
                  Kapat
                </button>
                {selectedBrand.website_url && (
                  <a 
                    href={selectedBrand.website_url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pub-btn pub-btn-primary flex-1"
                  >
                    Resmî Web Sitesi
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </SiteShell>
  );
}
