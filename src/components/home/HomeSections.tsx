import { Link } from "@tanstack/react-router";
import { Icon } from "../site-shell";
import { buttonStyles } from "../../lib/button-styles";
import { PRODUCTS, FEATURED_LOGOS } from "@/data/catalog";
import {
  useHomeBlog,
  useHomeBrands,
  useHomeReferences,
  useHomeServices,
  useHomeSettings,
} from "@/hooks/use-home-data";
import { SectionHead } from "./CategoryExplorer";

// ---------- Utility strip (navy top bar) ----------
export function HomeUtilityStrip() {
  const { data: s } = useHomeSettings();
  const phone = s?.phone;
  const wa = s?.whatsapp;
  const hours = s?.working_hours || "Pzt–Cmt · 08:30 – 18:00";
  if (!phone && !wa && !hours) return null;
  return (
    <div className="w-full text-inverse-on-surface hp-mono text-[11px] uppercase tracking-widest" style={{ background: "var(--color-inverse-surface)" }}>
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <span className="hidden sm:inline-flex items-center gap-2 text-inverse-on-surface/70">
            <Icon name="schedule" className="text-[14px]" aria-hidden />
            <span className="truncate">{hours}</span>
          </span>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          {phone && (
            <a href={`tel:${phone.replace(/\s+/g, "")}`} className="inline-flex items-center gap-2 hover:text-secondary transition-colors">
              <Icon name="call" className="text-[14px]" aria-hidden />
              <span>{phone}</span>
            </a>
          )}
          {wa && (
            <a
              href={`https://wa.me/${wa.replace(/[^\d]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-secondary hover:text-inverse-on-surface transition-colors"
            >
              <Icon name="chat" className="text-[14px]" aria-hidden />
              <span>WhatsApp</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Value props ----------
export function ValueProps() {
  const items = [
    {
      icon: "verified",
      title: "Yetkili Distribütör",
      body: "40'ı aşkın global markanın orijinal ürünlerinde yetkili tedarikçi sıfatıyla hizmet veriyoruz.",
    },
    {
      icon: "engineering",
      title: "Mühendislik Desteği",
      body: "Ürün seçiminden uygulamaya, kalibrasyondan yedek parçaya kadar teknik ekibimiz yanınızda.",
    },
    {
      icon: "local_shipping",
      title: "Türkiye Geneli Sevkiyat",
      body: "Geniş stok, aynı gün sevkiyat ve entegre lojistik ağıyla siparişleriniz 24 saat içinde yola çıkar.",
    },
  ];
  return (
    <section className="py-20 md:py-24" style={{ background: "var(--color-surface-container-lowest)", borderTop: "1px solid var(--color-outline-variant)", borderBottom: "1px solid var(--color-outline-variant)" }}>
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
        <SectionHead
          index="03"
          title="Neden Pratik"
          subtitle="Endüstriyel projelerinizin hızından, ölçeğinden ve teknik gereksinimlerinden ödün vermeden çalışan bir tedarik ortağı."
        />
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 border-t hp-hairline pt-10">
          {items.map((it, idx) => (
            <article key={it.title} className="flex flex-col gap-4">
              <span className="hp-mono text-[11px] uppercase tracking-widest text-on-surface-variant">
                0{idx + 1}
              </span>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-11 h-11 border border-primary text-primary">
                  <Icon name={it.icon} className="text-[22px]" />
                </span>
                <h3 className="text-[22px] font-semibold leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                  {it.title}
                </h3>
              </div>
              <p className="text-body-md font-body-md text-on-surface-variant max-w-sm">{it.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Sectors ----------
export function SectorGrid() {
  const sectors = [
    { icon: "factory", title: "Sanayi", desc: "Üretim tesisleri ve ağır sanayi ekipmanları." },
    { icon: "construction", title: "İnşaat", desc: "Şantiye, altyapı ve yapı montaj çözümleri." },
    { icon: "directions_car", title: "Otomotiv", desc: "OEM üretim, servis ve tamir uygulamaları." },
    { icon: "chair", title: "Mobilya", desc: "Ahşap işleme, montaj ve seri üretim." },
    { icon: "handyman", title: "Teknik Servis", desc: "Bakım, onarım ve kalibrasyon ekipmanları." },
    { icon: "precision_manufacturing", title: "Atölye Kullanımı", desc: "Küçük ölçekli üretim ve profesyonel atölye." },
  ];
  return (
    <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20 md:py-24">
      <SectionHead
        index="04"
        title="Sektörel Uygulama"
        subtitle="Farklı disiplinlerdeki ekiplerin donanım ihtiyaçlarını ölçeğine uygun tedarik zincirleri ve teknik yaklaşımla karşılıyoruz."
      />
      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-px" style={{ background: "var(--color-outline-variant)" }}>
        {sectors.map((s) => (
          <div
            key={s.title}
            className="p-6 md:p-8 flex flex-col gap-3 transition-colors group"
            style={{ background: "var(--color-surface-container-lowest)" }}
          >
            <Icon name={s.icon} className="text-[28px] text-primary" aria-hidden />
            <h3 className="text-[18px] font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              {s.title}
            </h3>
            <p className="text-body-sm font-body-sm text-on-surface-variant">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- Featured products ----------
export function FeaturedProducts() {
  return (
    <section className="py-20 md:py-24" style={{ background: "var(--color-surface-container-lowest)", borderTop: "1px solid var(--color-outline-variant)", borderBottom: "1px solid var(--color-outline-variant)" }}>
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
        <SectionHead
          index="05"
          title="Öne Çıkan Ürünler"
          subtitle="Sık talep edilen ve stoktan hızlı sevk edilebilen profesyonel makineler."
          action={{ label: "Tüm ürünler", to: "/urunler" }}
        />
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {PRODUCTS.slice(0, 4).map((p) => (
            <Link
              key={p.sku}
              to="/urunler/elektrikli-el-aletleri/$sku"
              params={{ sku: p.sku }}
              className="hp-card p-5 flex flex-col gap-4 group"
            >
              <div className="aspect-square bg-surface-container relative overflow-hidden">
                <img
                  src={p.productImg}
                  alt={p.productAlt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain p-4 transition-transform group-hover:scale-105"
                />
                <span className="absolute top-2 left-2 hp-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                  {p.sku}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="hp-mono text-[11px] uppercase tracking-widest text-on-surface-variant">
                  {p.brandAlt.replace(" logo", "")}
                </span>
                <h3 className="text-[16px] leading-snug font-semibold text-on-background line-clamp-2 min-h-[3rem]">
                  {p.name}
                </h3>
                <ul className="flex flex-col gap-1 mt-1">
                  {p.specs.slice(0, 2).map((s) => (
                    <li key={s.label} className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface-variant">
                      <Icon name={s.icon} className="text-[14px] text-primary" aria-hidden />
                      <span>{s.label}</span>
                    </li>
                  ))}
                </ul>
                <span className="mt-3 inline-flex items-center gap-1 text-primary text-label-bold font-semibold uppercase tracking-widest group-hover:text-secondary-container transition-colors">
                  Detay
                  <Icon name="arrow_forward" className="text-[14px]" aria-hidden />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Process timeline ----------
export function ProcessTimeline() {
  const steps = [
    { title: "Talep", body: "İhtiyaç listenizi, projenizin ölçeğini ve teknik gereksinimleri bize iletin." },
    { title: "Teklif", body: "Satın alma uzmanlarımız 24 saat içinde detaylı, karşılaştırılabilir teklif hazırlar." },
    { title: "Sevkiyat", body: "Onay sonrası ürünler stoktan ayrılır ve Türkiye genelinde hızlı lojistikle yola çıkar." },
    { title: "Destek", body: "Kullanım, bakım ve garanti süreçlerinde teknik ekibimiz sürecin sonuna kadar yanınızda." },
  ];
  return (
    <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20 md:py-24">
      <SectionHead
        index="06"
        title="Tedarik Süreci"
        subtitle="Talepten teslimata kadar takip edilebilir, öngörülebilir ve ölçülebilir bir süreç yürütüyoruz."
      />
      <ol className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
        {steps.map((s, i) => (
          <li key={s.title} className="flex flex-col gap-3 pt-6 border-t-2 border-primary">
            <span className="hp-mono text-[11px] uppercase tracking-widest text-primary">
              0{i + 1}
            </span>
            <h3 className="text-[20px] font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              {s.title}
            </h3>
            <p className="text-body-sm font-body-sm text-on-surface-variant">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

// ---------- Services (from DB) ----------
export function ServicesStrip() {
  const { data } = useHomeServices();
  if (!data || data.length === 0) return null;
  return (
    <section className="py-20 md:py-24" style={{ background: "var(--color-surface-container-lowest)", borderTop: "1px solid var(--color-outline-variant)", borderBottom: "1px solid var(--color-outline-variant)" }}>
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
        <SectionHead
          index="07"
          title="Hizmetlerimiz"
          subtitle="Yalnızca ürün tedariki değil; kurulum, teknik destek ve süreç yönetimi de sunuyoruz."
          action={{ label: "Tüm hizmetler", to: "/hizmetler" }}
        />
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {data.map((svc) => (
            <Link
              key={svc.id}
              to="/hizmetler/$slug"
              params={{ slug: svc.slug }}
              className="hp-card p-6 flex flex-col gap-4 group"
            >
              <span className="inline-flex items-center justify-center w-11 h-11 border border-primary text-primary">
                <Icon name={svc.icon || "engineering"} className="text-[22px]" aria-hidden />
              </span>
              <h3 className="text-[20px] font-semibold leading-snug" style={{ fontFamily: "var(--font-display)" }}>
                {svc.title}
              </h3>
              {svc.excerpt && (
                <p className="text-body-sm font-body-sm text-on-surface-variant line-clamp-3">{svc.excerpt}</p>
              )}
              <span className="mt-auto inline-flex items-center gap-1 text-primary text-label-bold font-semibold uppercase tracking-widest group-hover:text-secondary-container transition-colors">
                Detay
                <Icon name="arrow_forward" className="text-[14px]" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Brand strip ----------
export function BrandStrip() {
  const { data } = useHomeBrands();
  const logos: { key: string; src: string; alt: string; href?: string }[] =
    data && data.length > 0
      ? data.map((b) => ({ key: b.id, src: b.logo_url, alt: b.name, href: b.website_url || undefined }))
      : FEATURED_LOGOS.map((src, i) => ({ key: `f-${i}`, src, alt: `Marka ${i + 1}` }));

  return (
    <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20 md:py-24">
      <SectionHead
        index="08"
        title="Marka Ekosistemi"
        subtitle="Yetkili tedarikçisi ve iş ortağı olduğumuz seçilmiş uluslararası markalar."
        action={{ label: "Tüm markalar", to: "/markalar" }}
      />
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px" style={{ background: "var(--color-outline-variant)" }}>
        {logos.map((logo) => {
          const inner = (
            <div
              className="h-24 flex items-center justify-center p-6 transition-all"
              style={{ background: "var(--color-surface-container-lowest)" }}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                loading="lazy"
                decoding="async"
                className="max-h-10 max-w-full object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all"
              />
            </div>
          );
          return logo.href ? (
            <a key={logo.key} href={logo.href} target="_blank" rel="noreferrer" aria-label={logo.alt}>
              {inner}
            </a>
          ) : (
            <div key={logo.key}>{inner}</div>
          );
        })}
      </div>
    </section>
  );
}

// ---------- References ----------
export function SelectedReferences() {
  const { data } = useHomeReferences();
  if (!data || data.length === 0) return null;
  return (
    <section className="py-20 md:py-24" style={{ background: "var(--color-surface-container-lowest)", borderTop: "1px solid var(--color-outline-variant)", borderBottom: "1px solid var(--color-outline-variant)" }}>
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
        <SectionHead
          index="09"
          title="Seçilmiş Referanslar"
          subtitle="Birlikte çalıştığımız sanayi, inşaat ve teknik servis kuruluşları."
          action={{ label: "Tüm referanslar", to: "/referanslar" }}
        />
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {data.map((r, i) => (
            <article key={r.id} className="hp-card overflow-hidden flex flex-col">
              {r.cover_url && (
                <div className="aspect-[4/3] bg-surface-container relative">
                  <img src={r.cover_url} alt={r.title} loading="lazy" className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 hp-mono text-[11px] uppercase tracking-widest px-2 py-1 bg-inverse-surface text-inverse-on-surface">
                    0{i + 1}
                  </span>
                </div>
              )}
              <div className="p-5 flex flex-col gap-2">
                {r.category && (
                  <span className="hp-mono text-[11px] uppercase tracking-widest text-on-surface-variant">
                    {r.category}
                  </span>
                )}
                <h3 className="text-[18px] font-semibold leading-snug" style={{ fontFamily: "var(--font-display)" }}>
                  {r.title}
                </h3>
                {r.client_name && (
                  <p className="text-body-sm font-body-sm text-on-surface-variant">{r.client_name}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Insights / Blog ----------
export function InsightsPreview() {
  const { data } = useHomeBlog();
  if (!data || data.length === 0) return null;
  return (
    <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20 md:py-24">
      <SectionHead
        index="10"
        title="Bilgi Merkezi"
        subtitle="Ürün seçimi, uygulama önerileri ve sektörel içerikler."
        action={{ label: "Tüm yazılar", to: "/blog" }}
      />
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {data.map((p) => (
          <Link key={p.id} to="/blog/$slug" params={{ slug: p.slug }} className="hp-card overflow-hidden flex flex-col group">
            {p.cover_url && (
              <div className="aspect-[16/9] bg-surface-container overflow-hidden">
                <img
                  src={p.cover_url}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-5 flex flex-col gap-3">
              {p.published_at && (
                <span className="hp-mono text-[11px] uppercase tracking-widest text-on-surface-variant">
                  {new Date(p.published_at).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" })}
                </span>
              )}
              <h3 className="text-[18px] font-semibold leading-snug" style={{ fontFamily: "var(--font-display)" }}>
                {p.title}
              </h3>
              {p.excerpt && (
                <p className="text-body-sm font-body-sm text-on-surface-variant line-clamp-3">{p.excerpt}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ---------- Quote CTA ----------
export function QuoteCTA() {
  const { data: s } = useHomeSettings();
  const phone = s?.phone;
  return (
    <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop pt-4 pb-24">
      <div
        className="relative overflow-hidden text-inverse-on-surface p-10 md:p-16"
        style={{ background: "var(--color-inverse-surface)" }}
      >
        <div className="absolute inset-0 hp-grid-bg opacity-10 pointer-events-none" aria-hidden />
        <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8">
            <div className="hp-eyebrow hp-eyebrow-inverse flex items-center gap-3 mb-4">
              <span className="inline-block w-8 h-px bg-secondary" />
              <span>11 / Teklif</span>
            </div>
            <h2 className="hp-h2 text-inverse-on-surface mb-3">
              Projenize özel teklifinizi 24 saat içinde hazırlıyoruz.
            </h2>
            <p className="max-w-xl text-body-md font-body-md text-inverse-on-surface/80">
              Ürün listenizi paylaşın; satın alma uzmanlarımız uygun fiyatlandırma, teslim süresi ve teknik alternatifleri
              tek dosyada sunsun.
            </p>
          </div>
          <div className="md:col-span-4 flex flex-col gap-3 md:items-end">
            <Link to="/teklif" className={buttonStyles({ variant: "primary", className: "w-full md:w-auto" })}>
              Teklif Talebi Oluştur
              <Icon name="arrow_forward" aria-hidden />
            </Link>
            {phone && (
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className={buttonStyles({ variant: "outline-light", className: "w-full md:w-auto" })}
              >
                <Icon name="call" aria-hidden />
                {phone}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Mobile floating contact bar ----------
export function MobileContactBar() {
  const { data: s } = useHomeSettings();
  const phone = s?.phone;
  const wa = s?.whatsapp;
  return (
    <div
      className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t hp-hairline px-4 pt-3"
      style={{ background: "var(--color-surface-container-lowest)", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
    >
      <div className="flex items-center gap-2">
        <Link
          to="/teklif"
          className={buttonStyles({ variant: "primary", size: "sm", className: "flex-1" })}
        >
          Teklif Al
        </Link>
        {wa && (
          <a
            href={`https://wa.me/${wa.replace(/[^\d]/g, "")}`}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp ile iletişime geç"
            className="inline-flex items-center justify-center w-11 h-11 border border-primary text-primary"
          >
            <Icon name="chat" />
          </a>
        )}
        {phone && (
          <a
            href={`tel:${phone.replace(/\s+/g, "")}`}
            aria-label="Telefonla ara"
            className="inline-flex items-center justify-center w-11 h-11 bg-primary text-on-primary"
          >
            <Icon name="call" />
          </a>
        )}
      </div>
    </div>
  );
}