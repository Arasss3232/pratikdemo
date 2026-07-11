import { createFileRoute, Link } from "@tanstack/react-router";
import { BRAND_LOGOS, PRODUCTS, productSrcSet } from "../data/catalog";
import { buttonStyles } from "../lib/button-styles";
import { Icon, PagePlaceholder, SiteShell } from "../components/site-shell";

export const Route = createFileRoute("/urunler/elektrikli-el-aletleri/$sku")({
  head: () => ({
    meta: [
      { title: "Ürün Detayı — Pratik Endüstriyel" },
      { name: "description", content: "Elektrikli el aleti ürün detayları, teknik özellikler ve teklif talebi." },
      { property: "og:title", content: "Ürün Detayı — Pratik Endüstriyel" },
      { property: "og:description", content: "Profesyonel elektrikli el aletleri için ürün detayları ve teklif talebi." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { sku } = Route.useParams();
  const product = PRODUCTS.find((item) => item.sku === sku);

  if (!product) {
    return (
      <SiteShell>
        <PagePlaceholder
          title="Ürün bulunamadı"
          crumb="Ürün Detayı"
          description="Aradığınız ürün şu anda katalogda bulunamadı. Elektrikli el aletleri listesine dönerek diğer ürünleri inceleyebilirsiniz."
        />
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="bg-primary text-on-primary py-10">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
          <Link to="/urunler/elektrikli-el-aletleri" className="inline-flex items-center gap-2 text-on-primary/80 hover:text-secondary-fixed-dim mb-4">
            <Icon name="arrow_back" className="text-[18px]" />
            Elektrikli El Aletleri
          </Link>
          <h1 className="font-headline-lg text-headline-lg font-black max-w-3xl">{product.name}</h1>
          <p className="font-body-md text-body-md text-on-primary/80 mt-2">SKU: {product.sku}</p>
        </div>
      </section>

      <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,480px)_1fr] gap-gutter items-start">
          <div className="bg-surface-container-lowest border border-outline-variant rounded p-6">
            <div className="bg-surface-container-low min-h-[320px] flex items-center justify-center p-6">
              <img
                alt={product.productAlt}
                className="max-h-[300px] object-contain mix-blend-multiply"
                src={product.productImg}
                srcSet={productSrcSet(product.productImg)}
                sizes="(max-width: 1024px) 100vw, 480px"
                width={480}
                height={320}
                decoding="async"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-surface-container-lowest border border-outline-variant rounded p-6">
              <div className="flex items-center gap-3 mb-4">
                <img alt={product.brandAlt} src={BRAND_LOGOS[product.brand]} className="h-6 object-contain" width={96} height={24} />
                <span className="text-label-bold font-label-bold text-primary">
                  {product.stock === "in" ? "Stokta" : "Sınırlı Stok"}
                </span>
              </div>
              <h2 className="font-headline-md text-headline-md font-bold text-on-background mb-4">Teknik Özellikler</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.specs.map((spec) => (
                  <li key={spec.label} className="flex items-center gap-2 text-on-surface-variant bg-surface-container-low p-3 rounded">
                    <Icon name={spec.icon} className="text-[18px] text-primary" />
                    {spec.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/teklif-sepeti" className={buttonStyles({ variant: "primary", className: "w-full sm:w-auto" })}>
                <Icon name="request_quote" className="text-[18px]" />
                Teklif Sepetine Ekle
              </Link>
              <Link to="/iletisim" className={buttonStyles({ variant: "outline-dark", className: "w-full sm:w-auto" })}>
                <Icon name="support_agent" className="text-[18px]" />
                Teknik Destek Al
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}