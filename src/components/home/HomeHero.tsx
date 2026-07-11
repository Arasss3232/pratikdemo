import { Link } from "@tanstack/react-router";
import { Icon } from "../site-shell";
import { buttonStyles } from "../../lib/button-styles";
import { useHomeSettings } from "@/hooks/use-home-data";
import { PRODUCTS } from "@/data/catalog";

const DEFAULT_TITLE = "Sanayinin ölçülü gücü.";
const DEFAULT_DESC =
  "20.000+ profesyonel donanım, yetkili distribütör güvencesi ve mühendislik desteğiyle tek tedarikçiden — sanayi, şantiye ve teknik servis için.";

export function HomeHero() {
  const { data: s } = useHomeSettings();
  const title = (s?.hero_title || DEFAULT_TITLE).trim();
  const description = (s?.hero_description || DEFAULT_DESC).trim();
  const primaryText = s?.hero_cta_primary_text || "Ürün Gruplarını İncele";
  const primaryUrl = s?.hero_cta_primary_url || "/urunler";
  const secondaryText = s?.hero_cta_secondary_text || "Teklif Al";
  const secondaryUrl = s?.hero_cta_secondary_url || "/teklif";

  const heroProduct = PRODUCTS[0];
  const heroImg = s?.hero_image_url || heroProduct.productImg;

  return (
    <section className="relative overflow-hidden" style={{ background: "var(--color-surface)" }}>
      <div className="absolute inset-0 hp-grid-bg opacity-40 pointer-events-none" aria-hidden />
      <div className="relative max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop pt-14 md:pt-20 pb-16 md:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left copy */}
        <div className="lg:col-span-7">
          <div className="hp-eyebrow mb-6 flex items-center gap-3">
            <span className="inline-block w-8 h-px bg-primary" />
            <span>01 / Endüstriyel Tedarik</span>
          </div>
          <h1 className="hp-display mb-6">
            {title}
          </h1>
          <p className="max-w-xl text-body-lg font-body-lg text-on-surface-variant mb-8">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to={primaryUrl} className={buttonStyles({ variant: "primary" })}>
              {primaryText}
              <Icon name="arrow_forward" aria-hidden="true" />
            </Link>
            <Link to={secondaryUrl} className={buttonStyles({ variant: "outline-dark" })}>
              <Icon name="request_quote" aria-hidden="true" />
              {secondaryText}
            </Link>
          </div>

          {/* Trust row */}
          <dl className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t hp-hairline pt-8">
            {[
              { k: "15+", v: "Yıllık deneyim" },
              { k: "40+", v: "Yetkili marka" },
              { k: "20.000+", v: "Ürün çeşidi" },
              { k: "24 sa", v: "Sevkiyat süresi" },
            ].map((m) => (
              <div key={m.v}>
                <dt className="hp-mono text-[11px] uppercase tracking-widest text-on-surface-variant mb-1">
                  {m.v}
                </dt>
                <dd className="font-display text-[28px] leading-none font-semibold text-primary" style={{ fontFamily: "var(--font-display)" }}>
                  {m.k}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right composition */}
        <div className="lg:col-span-5">
          <div
            className="relative aspect-[4/5] w-full max-w-md ml-auto"
            style={{ background: "var(--color-surface-bright)", border: "1px solid var(--color-outline-variant)" }}
          >
            {/* Corner tick marks */}
            <CornerTicks />
            {/* Index label */}
            <div className="absolute top-4 left-4 hp-mono text-[11px] uppercase tracking-widest text-on-surface-variant">
              REF · {heroProduct.sku}
            </div>
            <div className="absolute top-4 right-4 hp-mono text-[11px] uppercase tracking-widest text-primary">
              ⌀ 13 mm
            </div>
            <img
              src={heroImg}
              alt={heroProduct.productAlt}
              className="absolute inset-0 w-full h-full object-contain p-10"
              fetchPriority="high"
              decoding="async"
              width={480}
              height={600}
            />
            {/* Bottom spec strip */}
            <div
              className="absolute inset-x-0 bottom-0 border-t hp-hairline px-4 py-3 grid grid-cols-3 gap-2 hp-mono text-[11px] uppercase tracking-widest text-on-surface-variant"
              style={{ background: "var(--color-surface-bright)" }}
            >
              <span>850 W</span>
              <span className="text-center">3000 dev/dk</span>
              <span className="text-right text-primary">Bosch Pro.</span>
            </div>
          </div>
          {/* Caption line */}
          <div className="mt-4 max-w-md ml-auto flex items-center gap-3 hp-mono text-[11px] uppercase tracking-widest text-on-surface-variant">
            <span className="inline-block w-8 h-px bg-outline-variant" />
            <span>Endüstriyel Hassasiyet · Kalibrasyon Doğruluğu</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function CornerTicks() {
  const c = "absolute w-4 h-4 border-primary";
  return (
    <>
      <span className={`${c} top-0 left-0 border-t border-l`} aria-hidden />
      <span className={`${c} top-0 right-0 border-t border-r`} aria-hidden />
      <span className={`${c} bottom-0 left-0 border-b border-l`} aria-hidden />
      <span className={`${c} bottom-0 right-0 border-b border-r`} aria-hidden />
    </>
  );
}