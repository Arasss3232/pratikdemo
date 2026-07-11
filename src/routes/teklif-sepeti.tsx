import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteShell, PagePlaceholder, Icon } from "../components/site-shell";
import { buttonStyles } from "../lib/button-styles";
import {
  clearQuoteCart,
  getQuoteCartItems,
  removeQuoteCartItem,
  updateQuoteCartQuantity,
  type QuoteCartItem,
} from "../lib/quote-cart";

export const Route = createFileRoute("/teklif-sepeti")({
  head: () => ({
    meta: [
      { title: "Teklif Sepeti — Pratik Endüstriyel" },
      { name: "description", content: "Seçtiğiniz ürünler için toplu teklif talebi oluşturun. Sepetinizdeki ürünler tek formla satın alma ekibimize iletilir." },
      { property: "og:title", content: "Teklif Sepeti — Pratik Endüstriyel" },
      { property: "og:description", content: "Seçtiğiniz ürünler için tek adımda toplu teklif talebi." },
      { property: "og:url", content: "/teklif-sepeti" },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/teklif-sepeti" }],
  }),
  component: TeklifSepetiPage,
});

function TeklifSepetiPage() {
  const [items, setItems] = useState<QuoteCartItem[]>([]);

  useEffect(() => {
    setItems(getQuoteCartItems());
    const onChanged = () => setItems(getQuoteCartItems());
    window.addEventListener("quote-cart:changed", onChanged);
    window.addEventListener("storage", onChanged);
    return () => {
      window.removeEventListener("quote-cart:changed", onChanged);
      window.removeEventListener("storage", onChanged);
    };
  }, []);

  const totalQuantity = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const sync = () => setItems(getQuoteCartItems());

  return (
    <SiteShell>
      <PagePlaceholder
        title="Teklif Sepetiniz"
        crumb="Teklif Sepeti"
        description="Seçtiğiniz ürünleri kontrol edin, adetleri düzenleyin ve tek form üzerinden satın alma ekibimize gönderin."
      >
        {items.length === 0 ? (
          <div className="bg-surface-container-lowest border border-outline-variant p-8 md:p-12 text-center">
            <Icon name="shopping_cart" className="text-[48px] text-primary mb-4" />
            <h2 className="font-headline-lg text-headline-lg text-on-background mb-2">Sepetiniz boş</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6 max-w-xl mx-auto">
              Ürün kartlarındaki “Teklif Al” butonuna tıklayarak ürünleri buraya ekleyebilirsiniz.
            </p>
            <Link to="/urunler/elektrikli-el-aletleri" className={buttonStyles({ variant: "primary" })}>
              <Icon name="arrow_back" className="text-[18px]" />
              Ürünlere Dön
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-gutter items-start">
            <section className="space-y-3" aria-label="Teklif sepetindeki ürünler">
              {items.map((item) => (
                <article key={item.sku} className="bg-surface-container-lowest border border-outline-variant rounded p-4 flex flex-col sm:flex-row gap-4">
                  <div className="h-32 sm:w-40 bg-surface-container-low flex items-center justify-center p-3 flex-shrink-0">
                    <img alt={item.productAlt} src={item.productImg} className="max-h-full object-contain mix-blend-multiply" width={160} height={128} loading="lazy" decoding="async" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="text-body-sm font-body-sm text-on-surface-variant mb-1">SKU: {item.sku}</div>
                    <h2 className="font-headline-md text-headline-md font-bold text-on-background mb-2">{item.name}</h2>
                    <ul className="text-body-sm font-body-sm text-on-surface-variant space-y-1 mb-4">
                      {item.specs.slice(0, 2).map((spec) => (
                        <li key={spec.label} className="flex items-center gap-2">
                          <Icon name={spec.icon} className="text-[14px] text-outline" />
                          {spec.label}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <label className="inline-flex items-center gap-2 text-label-bold font-label-bold text-on-background">
                        Adet
                        <input
                          type="number"
                          min={1}
                          max={99}
                          value={item.quantity}
                          onChange={(e) => {
                            updateQuoteCartQuantity(item.sku, Number(e.target.value));
                            sync();
                          }}
                          className="w-20 h-10 rounded border border-outline-variant bg-surface px-3 text-body-sm font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        />
                      </label>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-primary text-label-bold font-label-bold hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded"
                        onClick={() => {
                          removeQuoteCartItem(item.sku);
                          sync();
                        }}
                      >
                        <Icon name="close" className="text-[16px]" />
                        Kaldır
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="bg-surface-container-lowest border border-outline-variant rounded p-6 lg:sticky lg:top-[120px]">
              <h2 className="font-headline-md text-headline-md font-bold text-on-background mb-4">Teklif Özeti</h2>
              <div className="flex items-center justify-between text-body-md font-body-md border-b border-outline-variant pb-4 mb-4">
                <span className="text-on-surface-variant">Ürün çeşidi</span>
                <span className="font-bold text-on-background">{items.length}</span>
              </div>
              <div className="flex items-center justify-between text-body-md font-body-md border-b border-outline-variant pb-4 mb-6">
                <span className="text-on-surface-variant">Toplam adet</span>
                <span className="font-bold text-on-background">{totalQuantity}</span>
              </div>
              <div className="flex flex-col gap-2">
                <Link to="/teklif" className={buttonStyles({ variant: "primary", className: "w-full" })}>
                  Teklif Formuna Geç
                  <Icon name="arrow_forward" className="text-[18px]" />
                </Link>
                <button
                  type="button"
                  className={buttonStyles({ variant: "outline-dark", className: "w-full" })}
                  onClick={() => {
                    clearQuoteCart();
                    sync();
                  }}
                >
                  <Icon name="close" className="text-[18px]" />
                  Sepeti Temizle
                </button>
              </div>
            </aside>
          </div>
        )}
      </PagePlaceholder>
    </SiteShell>
  );
}