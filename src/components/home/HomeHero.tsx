import { Link } from "@tanstack/react-router";
import { Icon } from "../site-shell";
import { useHomeSettings } from "@/hooks/use-home-data";
import { PRODUCTS } from "@/data/catalog";

const DEFAULT_TITLE = "İşinize güç katan\nprofesyonel hırdavat çözümleri.";
const DEFAULT_DESC =
  "Elektrikli el aletlerinden bağlantı elemanlarına, iş güvenliğinden endüstriyel makinelere; sanayi tesisleri ve şantiyeler için yetkili distribütör güvencesiyle tek noktadan tedarik.";

export function HomeHero() {
  const { data: s } = useHomeSettings();
  const title = (s?.hero_title || DEFAULT_TITLE).trim();
  const description = (s?.hero_description || DEFAULT_DESC).trim();
  const primaryText = s?.hero_cta_primary_text || "Ürün Gruplarını İncele";
  const primaryUrl = s?.hero_cta_primary_url || "/urunler";
  const secondaryText = s?.hero_cta_secondary_text || "Teklif Talep Et";
  const secondaryUrl = s?.hero_cta_secondary_url || "/teklif";

  const heroProduct = PRODUCTS[0];
  const heroImg = s?.hero_image_url || heroProduct.productImg;

  return (
    <section
      className="relative overflow-hidden text-white"
      style={{ backgroundColor: "var(--public-navy-900)" }}
      aria-label="Ana tanıtım"
    >
      {/* Layered navy backgrounds */}
      <div className="absolute inset-0 pub-blueprint-lg opacity-70 pointer-events-none" aria-hidden />
      <div className="absolute inset-0 pub-glow-yellow pointer-events-none" aria-hidden />
      <div
        className="absolute -left-40 top-1/3 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgba(23,63,107,0.55), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop pt-16 md:pt-24 pb-20 md:pb-28 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left copy */}
        <div className="lg:col-span-7">
          <span className="pub-marker mb-8">01 / Endüstriyel Tedarik</span>

          <h1 className="pub-display text-white mt-6 mb-8 whitespace-pre-line">
            {title.split("\n").map((line, i) => (
              <span key={i} className="block">
                {i === title.split("\n").length - 1 && title.includes("\n") ? (
                  <>
                    {line.replace(/(\S+)$/, "")}
                    <span style={{ color: "var(--public-yellow-500)" }}>
                      {(line.match(/\S+$/) || [""])[0]}
                    </span>
                  </>
                ) : (
                  line
                )}
              </span>
            ))}
          </h1>

          <p
            className="max-w-xl mb-10 text-white/75"
            style={{ fontSize: "clamp(17px, 1.6vw, 20px)", lineHeight: 1.55 }}
          >
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to={primaryUrl} className="pub-btn pub-btn-primary">
              {primaryText}
              <Icon name="arrow_forward" aria-hidden="true" />
            </Link>
            <Link to={secondaryUrl} className="pub-btn pub-btn-outline-light">
              <Icon name="request_quote" aria-hidden="true" />
              {secondaryText}
            </Link>
          </div>

          {/* Capability strip */}
          <ul
            className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-6 border-t pt-8"
            style={{ borderColor: "var(--public-navy-border)" }}
          >
            {[
              { k: "Ürün Grupları", v: "6 ana kategori" },
              { k: "Kurumsal Tedarik", v: "Sözleşmeli müşteri" },
              { k: "Teknik Yönlendirme", v: "Uzman ekip" },
              { k: "Hızlı İletişim", v: "Aynı gün geri dönüş" },
            ].map((m) => (
              <li key={m.k}>
                <span
                  className="pub-mono block mb-2"
                  style={{ color: "var(--public-yellow-500)" }}
                >
                  {m.k}
                </span>
                <span className="text-white/85 text-[14px] font-medium">{m.v}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right composition */}
        <div className="lg:col-span-5">
          <div className="relative max-w-md ml-auto">
            {/* Backdrop panel */}
            <div
              className="absolute -inset-6 hidden md:block pub-blueprint"
              style={{
                backgroundColor: "var(--public-navy-800)",
                border: "1px solid var(--public-navy-border)",
              }}
              aria-hidden
            />

            {/* Main product card */}
            <div
              className="pub-ticks relative aspect-[4/5] w-full"
              style={{
                backgroundColor: "#F7F7F4",
                border: "1px solid var(--public-navy-border)",
                boxShadow: "var(--public-shadow-md)",
              }}
            >
              <span className="pub-tick-bl" aria-hidden />
              <span className="pub-tick-br" aria-hidden />

              <div
                className="absolute top-4 left-4 pub-mono"
                style={{ color: "var(--public-navy-900)" }}
              >
                REF · {heroProduct.sku}
              </div>
              <div
                className="absolute top-4 right-4 pub-mono"
                style={{ color: "var(--public-navy-900)" }}
              >
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

              <div
                className="absolute inset-x-0 bottom-0 px-4 py-3 grid grid-cols-3 gap-2 pub-mono"
                style={{
                  backgroundColor: "var(--public-navy-900)",
                  color: "#FFFFFF",
                  borderTop: "2px solid var(--public-yellow-500)",
                }}
              >
                <span>850 W</span>
                <span className="text-center">3000 dev/dk</span>
                <span
                  className="text-right"
                  style={{ color: "var(--public-yellow-500)" }}
                >
                  Bosch Pro.
                </span>
              </div>
            </div>

            {/* Secondary close-up chip */}
            <div
              className="hidden md:flex absolute -bottom-8 -left-8 w-40 h-40 items-center justify-center pub-ticks"
              style={{
                backgroundColor: "var(--public-navy-950)",
                border: "1px solid var(--public-navy-border)",
                boxShadow: "var(--public-shadow-md)",
              }}
            >
              <span className="pub-tick-bl" aria-hidden />
              <span className="pub-tick-br" aria-hidden />
              <div className="text-center px-3">
                <div
                  className="pub-mono mb-1"
                  style={{ color: "var(--public-yellow-500)" }}
                >
                  Kalibre
                </div>
                <div
                  className="font-display text-[42px] leading-none text-white"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                >
                  ±0.02
                </div>
                <div className="pub-mono text-white/60 mt-1">mm hassasiyet</div>
              </div>
            </div>

            {/* Caption line */}
            <div className="mt-8 md:mt-10 flex items-center gap-3 pub-mono text-white/60">
              <span
                className="inline-block w-8 h-px"
                style={{ backgroundColor: "var(--public-yellow-500)" }}
              />
              <span>Endüstriyel Hassasiyet · Kalibrasyon Doğruluğu</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom yellow measurement line — bridges into next section */}
      <div
        className="relative h-1"
        style={{ backgroundColor: "var(--public-yellow-500)" }}
        aria-hidden
      />
    </section>
  );
}