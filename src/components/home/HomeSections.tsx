import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { SectionHead } from "./CategoryExplorer";
import { z } from "zod";

/* =====================================================================
 * 03 — Kurumsal Değer (editorial, asymmetric)
 * ===================================================================== */
export function ValueProps() {
  const principles = [
    { k: "01", t: "Doğru Ürün Yönlendirmesi", d: "Projenizin ölçeğine, teknik gereksinimlerine ve bütçenize uygun ürünleri birlikte belirliyoruz." },
    { k: "02", t: "Kurumsal Tedarik", d: "Sipariş yönetimi, faturalama, sevkiyat ve garanti süreçlerini tek bir muhatap üzerinden yürütüyoruz." },
    { k: "03", t: "Geniş Ürün Bilgisi", d: "Elektrikli el aletlerinden bağlantı elemanlarına kadar geniş kategori derinliğine sahibiz." },
    { k: "04", t: "Satış Sonrası İletişim", d: "Sipariş sonrası da ulaşılabilir bir tedarik ortağı olarak yanınızda kalmayı sürdürüyoruz." },
  ];
  return (
    <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-24 md:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="hp-eyebrow flex items-center gap-3">
            <span className="inline-block w-8 h-px bg-primary" />
            <span>03 / Kurumsal</span>
          </div>
          <h2 className="hp-h2">Ürün tedariki değil, üretim güvenliği sağlıyoruz.</h2>
          <p className="text-body-md font-body-md text-on-surface-variant max-w-md">
            Sanayi, inşaat ve teknik servis ekiplerine profesyonel donanım tedariki sunuyoruz. Amacımız hızlı sevkiyat
            kadar; doğru ürün, doğru marka ve doğru teknik yönlendirmedir.
          </p>
          <Link
            to="/kurumsal"
            className="inline-flex items-center gap-2 self-start text-primary font-semibold text-label-bold uppercase tracking-widest hover:text-secondary-container transition-colors"
          >
            Hakkımızda
            <Icon name="arrow_forward" className="text-[16px]" />
          </Link>
          <div className="mt-4 aspect-[4/3] overflow-hidden bg-surface-container relative hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80"
              alt="Endüstriyel depo ve tedarik operasyonu"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              width={1200}
              height={900}
            />
          </div>
        </div>
        <ul className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-px" style={{ background: "var(--color-outline-variant)" }}>
          {principles.map((p) => (
            <li
              key={p.k}
              className="p-8 md:p-10 flex flex-col gap-3"
              style={{ background: "var(--color-surface-container-lowest)" }}
            >
              <span className="hp-mono text-[11px] uppercase tracking-widest text-secondary-container">{p.k}</span>
              <h3 className="text-[22px] leading-tight font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                {p.t}
              </h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant">{p.d}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* =====================================================================
 * 04 — Sektörel Uygulama (dark navy statement, interactive list)
 * ===================================================================== */
export function SectorGrid() {
  const sectors = [
    {
      k: "01",
      t: "Sanayi ve Üretim",
      d: "Üretim tesisleri için elektrikli el aletleri, bağlantı elemanları ve endüstriyel makine grupları.",
      groups: ["Elektrikli El Aletleri", "Bağlantı Elemanları", "Endüstriyel Makineler"],
      image:
        "https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=1600&q=80",
    },
    {
      k: "02",
      t: "İnşaat ve Şantiye",
      d: "Şantiye ekipmanları, kırıcı-delici sistemler ve saha güvenliği için kişisel koruyucu donanım.",
      groups: ["Kırıcı Delici", "İskele Ekipmanı", "Kişisel Koruyucu Donanım"],
      image:
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=80",
    },
    {
      k: "03",
      t: "Otomotiv ve Teknik Servis",
      d: "OEM üretim hattı, servis atölyeleri ve bakım ekipleri için hassas el aletleri ve ölçüm çözümleri.",
      groups: ["El Aletleri", "Ölçüm ve Kalibrasyon", "Sarf Malzemeleri"],
      image:
        "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1600&q=80",
    },
    {
      k: "04",
      t: "Mobilya ve Ahşap İşleme",
      d: "Ahşap işleme atölyeleri için testere, zımpara, yüzey işleme ekipmanları ve tamamlayıcı sarflar.",
      groups: ["Ahşap Makineleri", "Kesici Uçlar", "Zımpara ve Sarf"],
      image:
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80",
    },
  ];
  const [active, setActive] = useState(0);
  const cur = sectors[active];

  return (
    <section
      className="text-inverse-on-surface"
      style={{ background: "var(--color-inverse-surface)" }}
    >
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-24 md:py-32">
        <SectionHead
          index="04"
          title="Sektörel Uygulama"
          subtitle="Farklı disiplinlerdeki ekiplere; sahalarına, ölçeklerine ve tempolarına uygun donanım tedariki yürütüyoruz."
          inverse
        />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Sector index list */}
          <ul className="lg:col-span-4 flex flex-col border-t border-white/10" role="tablist" aria-label="Sektörler">
            {sectors.map((s, i) => {
              const isA = i === active;
              return (
                <li key={s.k}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isA}
                    onClick={() => setActive(i)}
                    className={`w-full text-left py-5 flex items-baseline gap-5 border-b border-white/10 transition-colors ${
                      isA ? "text-secondary" : "text-white/70 hover:text-white"
                    }`}
                  >
                    <span className="hp-mono text-[11px] uppercase tracking-widest text-white/50">{s.k}</span>
                    <span className="text-[19px] md:text-[21px] font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                      {s.t}
                    </span>
                    <span className="ml-auto">
                      <Icon name="arrow_forward" className={`text-[18px] transition-transform ${isA ? "translate-x-1" : ""}`} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Sector detail */}
          <div className="lg:col-span-8 flex flex-col gap-6" role="tabpanel">
            <div className="relative aspect-[16/9] overflow-hidden bg-white/5">
              <img
                key={cur.image}
                src={cur.image}
                alt={cur.t}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                width={1600}
                height={900}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" aria-hidden />
              <span className="absolute top-4 left-4 hp-mono text-[11px] uppercase tracking-widest px-2 py-1 bg-secondary text-on-secondary">
                {cur.k} / {cur.t}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <p className="text-body-md font-body-md text-white/80 max-w-xl">{cur.d}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {cur.groups.map((g) => (
                    <span
                      key={g}
                      className="hp-mono text-[11px] uppercase tracking-widest px-3 py-1 border border-white/25 text-white/85"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
              <div className="md:text-right md:pt-1">
                <Link
                  to="/urunler"
                  className={buttonStyles({ variant: "primary", className: "!bg-secondary !text-on-secondary hover:!bg-secondary-container" })}
                >
                  Ürün Gruplarını Keşfet
                  <Icon name="arrow_forward" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
 * 05 — Öne Çıkan Ürünler (editorial 1 large + rail)
 * ===================================================================== */
export function FeaturedProducts() {
  const items = PRODUCTS.slice(0, 5);
  const [hero, ...rail] = items;
  if (!hero) return null;
  return (
    <section
      className="py-24 md:py-32"
      style={{
        background: "var(--color-surface-container-lowest)",
        borderTop: "1px solid var(--color-outline-variant)",
        borderBottom: "1px solid var(--color-outline-variant)",
      }}
    >
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
        <SectionHead
          index="05"
          title="Öne Çıkan Ürünler"
          subtitle="Sık talep edilen profesyonel ürünlerden bir seçki. Ürünleriniz için özel teklif hazırlayabiliriz."
          action={{ label: "Tüm ürünler", to: "/urunler" }}
        />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Featured hero card */}
          <Link
            to="/urunler/elektrikli-el-aletleri/$sku"
            params={{ sku: hero.sku }}
            className="lg:col-span-7 group flex flex-col hp-card overflow-hidden"
          >
            <div className="relative aspect-[16/11] bg-surface-container overflow-hidden">
              <img
                src={hero.productImg}
                alt={hero.productAlt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain p-10 transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <span className="absolute top-4 left-4 hp-mono text-[11px] uppercase tracking-widest px-2 py-1 bg-inverse-surface text-inverse-on-surface">
                REF · {hero.sku}
              </span>
            </div>
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 border-t hp-hairline">
              <div className="md:col-span-8">
                <span className="hp-mono text-[11px] uppercase tracking-widest text-on-surface-variant">
                  {hero.brandAlt.replace(" logo", "")}
                </span>
                <h3
                  className="mt-2 text-[26px] md:text-[30px] leading-tight font-semibold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {hero.name}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                  {hero.specs.slice(0, 3).map((s) => (
                    <li
                      key={s.label}
                      className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface-variant"
                    >
                      <Icon name={s.icon} className="text-[16px] text-primary" aria-hidden />
                      <span>{s.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-4 md:text-right flex md:justify-end md:items-end">
                <span className="inline-flex items-center gap-2 text-primary font-semibold text-label-bold uppercase tracking-widest group-hover:text-secondary-container transition-colors">
                  Ürünü İncele
                  <Icon name="arrow_forward" className="text-[16px]" />
                </span>
              </div>
            </div>
          </Link>

          {/* Rail */}
          <ul className="lg:col-span-5 flex flex-col gap-4">
            {rail.map((p) => (
              <li key={p.sku}>
                <Link
                  to="/urunler/elektrikli-el-aletleri/$sku"
                  params={{ sku: p.sku }}
                  className="group flex items-center gap-5 p-4 hp-card"
                >
                  <div className="w-20 h-20 shrink-0 bg-surface-container overflow-hidden">
                    <img
                      src={p.productImg}
                      alt={p.productAlt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="hp-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                      {p.brandAlt.replace(" logo", "")} · {p.sku}
                    </span>
                    <h4 className="mt-1 text-[15px] leading-snug font-semibold text-on-background line-clamp-2">
                      {p.name}
                    </h4>
                  </div>
                  <Icon
                    name="arrow_forward"
                    className="text-[18px] text-on-surface-variant group-hover:text-primary transition-colors"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
 * 06 — Neden Pratik (numbered capability list, industrial)
 * ===================================================================== */
export function WhyChoose() {
  const items = [
    { k: "01", t: "Ürün Bilgisi", d: "Kategori derinliğine hakim satış ekibiyle uygun ürünü ilk turda öneriyoruz." },
    { k: "02", t: "Kurumsal Tedarik", d: "Cari kart, fatura, teslimat ve garanti süreçleri kurumsal standartlarda yürütülür." },
    { k: "03", t: "Sipariş Şeffaflığı", d: "Teklif, stok durumu ve teslim süresi konusunda net bilgi verir; süreç boyunca haber veririz." },
    { k: "04", t: "Kolay İletişim", d: "Telefon, e-posta veya WhatsApp — hangisi kolaysa. Muhatabınız değişmez." },
    { k: "05", t: "Yedek Parça Sürekliliği", d: "Satılan ürünlerin yedek parçası ve sarfları için sürekli tedarik desteği sağlarız." },
  ];
  return (
    <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-24 md:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        <div className="lg:col-span-5">
          <div className="hp-eyebrow flex items-center gap-3 mb-3">
            <span className="inline-block w-8 h-px bg-primary" />
            <span>06 / Neden Pratik</span>
          </div>
          <h2 className="hp-h2">Doğru ürün, doğru marka, doğru yönlendirme.</h2>
          <p className="mt-4 text-body-md font-body-md text-on-surface-variant max-w-md">
            Endüstriyel donanım tedariki fiyattan önce doğru öneri gerektirir. Farkımız burada başlıyor.
          </p>
          <div className="mt-8 aspect-[4/5] overflow-hidden bg-surface-container relative">
            <img
              src="https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=1200&q=80"
              alt="Endüstriyel atölyede profesyonel ekipman kullanımı"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              width={1200}
              height={1500}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" aria-hidden />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="hp-mono text-[11px] uppercase tracking-widest text-secondary">Saha</span>
              <p className="mt-1 text-[15px] leading-snug font-semibold">
                Tesis ekipleriyle birlikte doğru ürünü belirliyoruz.
              </p>
            </div>
          </div>
        </div>
        <ol className="lg:col-span-7 flex flex-col border-t hp-hairline">
          {items.map((it) => (
            <li
              key={it.k}
              className="group py-7 md:py-8 border-b hp-hairline grid grid-cols-[auto_1fr] gap-6 md:gap-10 items-start"
            >
              <span className="hp-mono text-[12px] uppercase tracking-widest text-primary pt-1">{it.k}</span>
              <div>
                <h3
                  className="text-[22px] md:text-[24px] leading-tight font-semibold group-hover:text-primary transition-colors"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {it.t}
                </h3>
                <p className="mt-2 text-body-md font-body-md text-on-surface-variant max-w-2xl">{it.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* =====================================================================
 * 07 — Hizmetler (DB, editorial cards)
 * ===================================================================== */
export function ServicesStrip() {
  const { data } = useHomeServices();
  if (!data || data.length === 0) return null;
  return (
    <section
      className="py-24 md:py-32"
      style={{
        background: "var(--color-surface-container-lowest)",
        borderTop: "1px solid var(--color-outline-variant)",
        borderBottom: "1px solid var(--color-outline-variant)",
      }}
    >
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
        <SectionHead
          index="07"
          title="Hizmetlerimiz"
          subtitle="Yalnızca ürün tedariki değil; kurulum, teknik destek ve süreç yönetimi de sunuyoruz."
          action={{ label: "Tüm hizmetler", to: "/hizmetler" }}
        />
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {data.map((svc, i) => (
            <Link
              key={svc.id}
              to="/hizmetler/$slug"
              params={{ slug: svc.slug }}
              className="hp-card p-8 flex flex-col gap-5 group"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center justify-center w-12 h-12 border border-primary text-primary">
                  <Icon name={svc.icon || "engineering"} className="text-[24px]" />
                </span>
                <span className="hp-mono text-[11px] uppercase tracking-widest text-on-surface-variant">
                  0{i + 1}
                </span>
              </div>
              <h3 className="text-[22px] font-semibold leading-snug" style={{ fontFamily: "var(--font-display)" }}>
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

/* =====================================================================
 * 08 — Marka Ekosistemi (clean grid, monochrome hover)
 * ===================================================================== */
export function BrandStrip() {
  const { data } = useHomeBrands();
  const logos: { key: string; src: string; alt: string; href?: string }[] =
    data && data.length > 0
      ? data.map((b) => ({ key: b.id, src: b.logo_url, alt: b.name, href: b.website_url || undefined }))
      : FEATURED_LOGOS.map((src, i) => ({ key: `f-${i}`, src, alt: `Marka ${i + 1}` }));

  return (
    <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-24 md:py-32">
      <SectionHead
        index="08"
        title="Çalıştığımız Markalar"
        subtitle="Birlikte çalıştığımız uluslararası ve yerli markalardan bir seçki."
        action={{ label: "Tüm markalar", to: "/markalar" }}
      />
      <div
        className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px"
        style={{ background: "var(--color-outline-variant)" }}
      >
        {logos.map((logo) => {
          const inner = (
            <div
              className="h-28 flex items-center justify-center p-6 transition-all"
              style={{ background: "var(--color-surface-container-lowest)" }}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                loading="lazy"
                decoding="async"
                width={160}
                height={40}
                className="max-h-10 max-w-full object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all"
              />
            </div>
          );
          return logo.href ? (
            <a key={logo.key} href={logo.href} target="_blank" rel="noreferrer" aria-label={logo.alt}>
              {inner}
            </a>
          ) : (
            <div key={logo.key} aria-label={logo.alt}>{inner}</div>
          );
        })}
      </div>
    </section>
  );
}

/* =====================================================================
 * 09 — Seçilmiş Referanslar (editorial magazine)
 * ===================================================================== */
export function SelectedReferences() {
  const { data } = useHomeReferences();
  if (!data || data.length === 0) return null;
  const [hero, ...rest] = data;
  return (
    <section
      className="py-24 md:py-32"
      style={{
        background: "var(--color-surface-container-lowest)",
        borderTop: "1px solid var(--color-outline-variant)",
        borderBottom: "1px solid var(--color-outline-variant)",
      }}
    >
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
        <SectionHead
          index="09"
          title="Seçilmiş Referanslar"
          subtitle="Birlikte çalıştığımız sanayi, inşaat ve teknik servis kuruluşları."
          action={{ label: "Tüm referanslar", to: "/referanslar" }}
        />
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {hero && (
            <article className="lg:col-span-7 hp-card overflow-hidden flex flex-col">
              {hero.cover_url && (
                <div className="aspect-[16/10] bg-surface-container relative overflow-hidden">
                  <img
                    src={hero.cover_url}
                    alt={hero.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 hp-mono text-[11px] uppercase tracking-widest px-2 py-1 bg-secondary text-on-secondary">
                    01 · Referans
                  </span>
                </div>
              )}
              <div className="p-6 md:p-8 flex flex-col gap-2">
                {hero.category && (
                  <span className="hp-mono text-[11px] uppercase tracking-widest text-on-surface-variant">
                    {hero.category}
                  </span>
                )}
                <h3 className="text-[26px] md:text-[30px] leading-tight font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                  {hero.title}
                </h3>
                {hero.client_name && (
                  <p className="text-body-md font-body-md text-on-surface-variant">{hero.client_name}</p>
                )}
              </div>
            </article>
          )}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {rest.slice(0, 2).map((r, i) => (
              <article key={r.id} className="hp-card overflow-hidden flex flex-col md:flex-row">
                {r.cover_url && (
                  <div className="md:w-2/5 aspect-[16/10] md:aspect-auto bg-surface-container">
                    <img src={r.cover_url} alt={r.title} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-5 md:p-6 flex flex-col gap-2 flex-1">
                  <span className="hp-mono text-[11px] uppercase tracking-widest text-primary">
                    0{i + 2} · {r.category || "Referans"}
                  </span>
                  <h3 className="text-[17px] leading-snug font-semibold" style={{ fontFamily: "var(--font-display)" }}>
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
      </div>
    </section>
  );
}

/* =====================================================================
 * 10 — Tedarik Süreci (horizontal timeline desktop, vertical mobile)
 * ===================================================================== */
export function ProcessTimeline() {
  const steps = [
    { k: "01", t: "İhtiyacınızı İletin", d: "Ürün listesi, marka tercihi veya teknik gereksinim — hangisi elinizdeyse iletin.", icon: "forward_to_inbox" },
    { k: "02", t: "Uygun Ürünü Belirleyelim", d: "Satış ekibimiz projenize uygun ürün ve alternatifleri birlikte değerlendirir.", icon: "insights" },
    { k: "03", t: "Teklifinizi Hazırlayalım", d: "Fiyat, teslim süresi ve garanti koşulları dahil karşılaştırılabilir teklif sunarız.", icon: "request_quote" },
    { k: "04", t: "Tedarik Sürecini Tamamlayalım", d: "Sevkiyat, faturalama ve satış sonrası iletişim tek muhatap üzerinden yürütülür.", icon: "local_shipping" },
  ];
  return (
    <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-24 md:py-32">
      <SectionHead
        index="10"
        title="Tedarik Süreci"
        subtitle="Talepten teslimata kadar takip edilebilir, öngörülebilir ve tek muhataplı bir süreç yürütüyoruz."
      />

      {/* Desktop horizontal */}
      <div className="hidden md:block mt-16 relative">
        <div className="absolute top-6 left-0 right-0 h-px bg-outline-variant" aria-hidden />
        <div className="absolute top-6 left-0 h-px bg-primary hp-timeline-line" aria-hidden />
        <ol className="grid grid-cols-4 gap-6">
          {steps.map((s) => (
            <li key={s.k} className="flex flex-col items-start">
              <span className="relative z-10 w-12 h-12 rounded-full grid place-items-center bg-surface-container-lowest border-2 border-primary text-primary">
                <Icon name={s.icon} className="text-[22px]" aria-hidden />
              </span>
              <span className="mt-6 hp-mono text-[11px] uppercase tracking-widest text-primary">{s.k}</span>
              <h3 className="mt-2 text-[19px] leading-tight font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                {s.t}
              </h3>
              <p className="mt-2 text-body-sm font-body-sm text-on-surface-variant max-w-xs">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Mobile vertical */}
      <ol className="md:hidden mt-10 relative">
        <div className="absolute left-6 top-2 bottom-2 w-px bg-outline-variant" aria-hidden />
        {steps.map((s) => (
          <li key={s.k} className="relative pl-16 pb-8 last:pb-0">
            <span className="absolute left-0 top-0 w-12 h-12 rounded-full grid place-items-center bg-surface-container-lowest border-2 border-primary text-primary">
              <Icon name={s.icon} className="text-[22px]" aria-hidden />
            </span>
            <span className="hp-mono text-[11px] uppercase tracking-widest text-primary">{s.k}</span>
            <h3 className="mt-1 text-[19px] leading-tight font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              {s.t}
            </h3>
            <p className="mt-2 text-body-sm font-body-sm text-on-surface-variant">{s.d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* =====================================================================
 * 11 — Bilgi Merkezi (magazine 1+2)
 * ===================================================================== */
export function InsightsPreview() {
  const { data } = useHomeBlog();
  if (!data || data.length === 0) return null;
  const [feat, ...rest] = data;
  return (
    <section
      className="py-24 md:py-32"
      style={{
        background: "var(--color-surface-container-lowest)",
        borderTop: "1px solid var(--color-outline-variant)",
        borderBottom: "1px solid var(--color-outline-variant)",
      }}
    >
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
        <SectionHead
          index="11"
          title="Bilgi Merkezi"
          subtitle="Ürün seçimi, uygulama önerileri ve sektörel içerikler."
          action={{ label: "Tüm yazıları gör", to: "/blog" }}
        />
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {feat && (
            <Link
              to="/blog/$slug"
              params={{ slug: feat.slug }}
              className="lg:col-span-7 group hp-card overflow-hidden flex flex-col"
            >
              {feat.cover_url && (
                <div className="aspect-[16/10] bg-surface-container overflow-hidden">
                  <img
                    src={feat.cover_url}
                    alt={feat.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              )}
              <div className="p-6 md:p-8 flex flex-col gap-3">
                {feat.published_at && (
                  <span className="hp-mono text-[11px] uppercase tracking-widest text-on-surface-variant">
                    {new Date(feat.published_at).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" })}
                  </span>
                )}
                <h3 className="text-[26px] md:text-[30px] leading-tight font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                  {feat.title}
                </h3>
                {feat.excerpt && (
                  <p className="text-body-md font-body-md text-on-surface-variant line-clamp-3">{feat.excerpt}</p>
                )}
              </div>
            </Link>
          )}
          <ul className="lg:col-span-5 flex flex-col gap-6">
            {rest.slice(0, 2).map((p) => (
              <li key={p.id}>
                <Link to="/blog/$slug" params={{ slug: p.slug }} className="hp-card overflow-hidden flex md:h-full">
                  {p.cover_url && (
                    <div className="w-2/5 shrink-0 bg-surface-container">
                      <img src={p.cover_url} alt={p.title} loading="lazy" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-5 flex flex-col gap-2 flex-1">
                    {p.published_at && (
                      <span className="hp-mono text-[11px] uppercase tracking-widest text-on-surface-variant">
                        {new Date(p.published_at).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" })}
                      </span>
                    )}
                    <h3 className="text-[17px] leading-snug font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                      {p.title}
                    </h3>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
 * 12 — Teklif ve İletişim (navy, includes simplified quote form)
 * ===================================================================== */
const quoteSchema = z.object({
  name: z.string().trim().min(2, "Ad Soyad en az 2 karakter olmalı").max(100),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email("Geçerli bir e-posta girin").max(160),
  phone: z.string().trim().min(7, "Geçerli bir telefon girin").max(30),
  category: z.string().trim().min(1, "Bir ürün grubu seçin").max(80),
  message: z.string().trim().max(1200).optional().or(z.literal("")),
  kvkk: z.literal(true, { errorMap: () => ({ message: "KVKK metnini onaylayın" }) }),
});

export function QuoteCTA() {
  const { data: s } = useHomeSettings();
  const phone = s?.phone;
  const wa = s?.whatsapp;

  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const categories = [
    "Elektrikli El Aletleri",
    "El Aletleri",
    "Bağlantı Elemanları",
    "Kişisel Koruyucu Donanım",
    "Endüstriyel Makineler",
    "Sarf Malzemeleri",
    "Diğer / Belirtiniz",
  ];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setErrMsg(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      company: String(fd.get("company") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      category: String(fd.get("category") || ""),
      message: String(fd.get("message") || ""),
      kvkk: fd.get("kvkk") === "on",
    };
    const parsed = quoteSchema.safeParse(payload);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as string;
        if (!errs[key]) errs[key] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setState("loading");
    const { error } = await supabase.from("quote_requests").insert({
      contact_name: parsed.data.name,
      company: parsed.data.company || null,
      email: parsed.data.email,
      phone: parsed.data.phone,
      message: parsed.data.message || null,
      items: [{ category: parsed.data.category }],
    });
    if (error) {
      setState("err");
      setErrMsg("Talebiniz gönderilemedi. Lütfen tekrar deneyin veya bize ulaşın.");
      return;
    }
    setState("ok");
    (e.target as HTMLFormElement).reset();
  }

  const inputCls =
    "w-full bg-white/5 border border-white/20 focus:border-secondary focus:outline-none px-4 py-3 text-[15px] text-white placeholder:text-white/40 transition-colors";

  return (
    <section
      id="teklif-al"
      className="text-inverse-on-surface"
      style={{ background: "var(--color-inverse-surface)" }}
    >
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-24 md:py-32 relative">
        <div className="absolute inset-0 hp-grid-bg opacity-[0.08] pointer-events-none" aria-hidden />
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="hp-eyebrow hp-eyebrow-inverse flex items-center gap-3 mb-4">
              <span className="inline-block w-8 h-px bg-secondary" />
              <span>12 / Teklif ve İletişim</span>
            </div>
            <h2 className="hp-h2 text-inverse-on-surface">Projeniz için teklif hazırlayalım.</h2>
            <p className="mt-4 max-w-md text-body-md font-body-md text-white/80">
              Ürün listenizi veya ihtiyacınızın kısa özetini paylaşın. Satış ekibimiz kısa süre içinde geri dönsün.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-4 py-4 border-b border-white/10 text-white hover:text-secondary transition-colors"
                >
                  <span className="w-10 h-10 grid place-items-center border border-white/25 text-secondary">
                    <Icon name="call" />
                  </span>
                  <span className="flex-1">
                    <span className="block hp-mono text-[10px] uppercase tracking-widest text-white/50">Telefon</span>
                    <span className="block text-[17px] font-semibold">{phone}</span>
                  </span>
                  <Icon name="arrow_forward" className="text-white/40" />
                </a>
              )}
              {wa && (
                <a
                  href={`https://wa.me/${wa.replace(/[^\d]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 py-4 border-b border-white/10 text-white hover:text-secondary transition-colors"
                >
                  <span className="w-10 h-10 grid place-items-center border border-white/25 text-secondary">
                    <Icon name="chat" />
                  </span>
                  <span className="flex-1">
                    <span className="block hp-mono text-[10px] uppercase tracking-widest text-white/50">WhatsApp</span>
                    <span className="block text-[17px] font-semibold">Hemen mesaj yazın</span>
                  </span>
                  <Icon name="arrow_forward" className="text-white/40" />
                </a>
              )}
              {s?.email && (
                <a
                  href={`mailto:${s.email}`}
                  className="flex items-center gap-4 py-4 border-b border-white/10 text-white hover:text-secondary transition-colors"
                >
                  <span className="w-10 h-10 grid place-items-center border border-white/25 text-secondary">
                    <Icon name="mail" />
                  </span>
                  <span className="flex-1">
                    <span className="block hp-mono text-[10px] uppercase tracking-widest text-white/50">E-posta</span>
                    <span className="block text-[17px] font-semibold">{s.email}</span>
                  </span>
                  <Icon name="arrow_forward" className="text-white/40" />
                </a>
              )}
            </div>
          </div>

          <div className="lg:col-span-7">
            {state === "ok" ? (
              <div className="bg-white/5 border border-secondary/50 p-8 md:p-10 text-center">
                <span className="inline-flex items-center justify-center w-14 h-14 border-2 border-secondary text-secondary mb-4">
                  <Icon name="check" className="text-[28px]" />
                </span>
                <h3 className="hp-h2 text-inverse-on-surface text-[24px] md:text-[28px]">Talebiniz alındı.</h3>
                <p className="mt-3 text-white/80">
                  Ekibimiz kısa süre içinde tarafınıza dönecek. Aciliyet durumunda bize telefonla ulaşabilirsiniz.
                </p>
                <button
                  type="button"
                  onClick={() => setState("idle")}
                  className="mt-6 inline-flex items-center gap-2 hp-mono text-[11px] uppercase tracking-widest text-secondary hover:text-white"
                >
                  Yeni bir talep gönder <Icon name="arrow_forward" className="text-[14px]" />
                </button>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                noValidate
                className="bg-white/5 border border-white/15 p-6 md:p-8 flex flex-col gap-4"
                aria-label="Hızlı teklif formu"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Ad Soyad *" name="name" required inputCls={inputCls} error={errors.name} autoComplete="name" />
                  <Field label="Firma Adı" name="company" inputCls={inputCls} error={errors.company} autoComplete="organization" />
                  <Field label="Telefon *" name="phone" type="tel" required inputCls={inputCls} error={errors.phone} autoComplete="tel" />
                  <Field label="E-posta *" name="email" type="email" required inputCls={inputCls} error={errors.email} autoComplete="email" />
                </div>
                <label className="flex flex-col gap-2">
                  <span className="hp-mono text-[11px] uppercase tracking-widest text-white/60">Ürün Grubu *</span>
                  <select name="category" required className={inputCls} defaultValue="" aria-invalid={!!errors.category}>
                    <option value="" disabled className="bg-inverse-surface">Seçiniz…</option>
                    {categories.map((c) => (
                      <option key={c} value={c} className="bg-inverse-surface">
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.category && <span className="text-secondary text-[12px]">{errors.category}</span>}
                </label>
                <label className="flex flex-col gap-2">
                  <span className="hp-mono text-[11px] uppercase tracking-widest text-white/60">Talebiniz</span>
                  <textarea
                    name="message"
                    rows={4}
                    maxLength={1200}
                    className={inputCls}
                    placeholder="Kısaca ihtiyacınızı yazın veya bir ürün listesi belirtin."
                  />
                </label>
                <label className="flex items-start gap-3 text-white/80 text-body-sm">
                  <input type="checkbox" name="kvkk" required className="mt-1 accent-[color:var(--color-secondary)]" />
                  <span>
                    Kişisel verilerimin{" "}
                    <Link to="/kvkk" className="underline text-secondary hover:text-white">
                      KVKK aydınlatma metni
                    </Link>{" "}
                    kapsamında işlenmesini kabul ediyorum.
                  </span>
                </label>
                {errors.kvkk && <span className="text-secondary text-[12px]">{errors.kvkk}</span>}
                {errMsg && <p className="text-secondary text-[13px]">{errMsg}</p>}
                <button
                  type="submit"
                  disabled={state === "loading"}
                  className={buttonStyles({
                    variant: "primary",
                    className: "w-full md:w-auto !bg-secondary !text-on-secondary hover:!bg-secondary-container disabled:opacity-70",
                  })}
                >
                  {state === "loading" ? "Gönderiliyor…" : "Teklif Talebi Gönder"}
                  <Icon name="arrow_forward" aria-hidden />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  inputCls,
  error,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  inputCls: string;
  error?: string;
  autoComplete?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="hp-mono text-[11px] uppercase tracking-widest text-white/60">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        maxLength={200}
        className={inputCls}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-err` : undefined}
      />
      {error && (
        <span id={`${name}-err`} className="text-secondary text-[12px]">
          {error}
        </span>
      )}
    </label>
  );
}

/* =====================================================================
 * 13 — Konum & İletişim Bilgileri
 * ===================================================================== */
export function ContactInfo() {
  const { data: s } = useHomeSettings();
  const address = s?.address;
  const phone = s?.phone;
  const email = s?.email;
  const hours = s?.working_hours || "Pzt – Cmt · 08:30 – 18:00";
  const mapQ = address ? encodeURIComponent(address) : "Pratik Endüstriyel";
  return (
    <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-24 md:py-32">
      <SectionHead
        index="13"
        title="Konum ve İletişim"
        subtitle="Merkez ofisimize ulaşın, yol tarifi alın veya bize doğrudan yazın."
      />
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 flex flex-col gap-6">
          {address && (
            <ContactRow icon="location_on" title="Adres" value={address} />
          )}
          {phone && (
            <ContactRow icon="call" title="Telefon" value={phone} href={`tel:${phone.replace(/\s+/g, "")}`} />
          )}
          {email && (
            <ContactRow icon="mail" title="E-posta" value={email} href={`mailto:${email}`} />
          )}
          <ContactRow icon="schedule" title="Çalışma Saatleri" value={hours} />
          {address && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapQ}`}
              target="_blank"
              rel="noreferrer"
              className={buttonStyles({ variant: "outline-dark", className: "self-start" })}
            >
              <Icon name="directions" aria-hidden />
              Yol Tarifi Al
            </a>
          )}
        </div>
        <div className="lg:col-span-7">
          <div className="aspect-[16/10] w-full overflow-hidden border hp-hairline">
            <iframe
              title="Harita — Pratik Endüstriyel konumu"
              src={`https://www.google.com/maps?q=${mapQ}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactRow({ icon, title, value, href }: { icon: string; title: string; value: string; href?: string }) {
  const content = (
    <div className="flex items-start gap-4 py-5 border-b hp-hairline">
      <span className="w-11 h-11 grid place-items-center border border-primary text-primary shrink-0">
        <Icon name={icon} className="text-[22px]" />
      </span>
      <div className="min-w-0">
        <span className="block hp-mono text-[10px] uppercase tracking-widest text-on-surface-variant">{title}</span>
        <span className="block mt-1 text-[16px] font-semibold text-on-background break-words">{value}</span>
      </div>
    </div>
  );
  return href ? (
    <a href={href} className="hover:text-primary transition-colors block">
      {content}
    </a>
  ) : (
    content
  );
}

/* =====================================================================
 * 14 — Compact expandable floating contact FAB (mobile-first, safe)
 * ===================================================================== */
export function MobileContactBar() {
  const { data: s } = useHomeSettings();
  const [open, setOpen] = useState(false);
  const phone = s?.phone;
  const wa = s?.whatsapp;

  return (
    <div
      className="lg:hidden fixed right-4 z-40 flex flex-col items-end gap-3"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)" }}
    >
      {open && (
        <div className="flex flex-col items-end gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Link
            to="/teklif"
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-2 pl-4 pr-3 h-11 bg-primary text-on-primary text-[13px] font-semibold shadow-lg"
          >
            Teklif Talep Et
            <Icon name="request_quote" className="text-[18px]" />
          </Link>
          {wa && (
            <a
              href={`https://wa.me/${wa.replace(/[^\d]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp ile yaz"
              className="inline-flex items-center gap-2 pl-4 pr-3 h-11 bg-white text-primary border border-outline-variant text-[13px] font-semibold shadow-lg"
            >
              WhatsApp
              <Icon name="chat" className="text-[18px]" />
            </a>
          )}
          {phone && (
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              aria-label="Telefonla ara"
              className="inline-flex items-center gap-2 pl-4 pr-3 h-11 bg-white text-primary border border-outline-variant text-[13px] font-semibold shadow-lg"
            >
              Telefon
              <Icon name="call" className="text-[18px]" />
            </a>
          )}
        </div>
      )}
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "İletişim menüsünü kapat" : "İletişim menüsünü aç"}
        onClick={() => setOpen((v) => !v)}
        className="w-14 h-14 rounded-full bg-secondary text-on-secondary shadow-xl grid place-items-center hover:bg-secondary-container transition-colors"
      >
        <Icon name={open ? "close" : "support_agent"} className="text-[26px]" />
      </button>
    </div>
  );
}

/* Utility strip export kept for backward compat (unused after shell merge) */
export function HomeUtilityStrip() {
  return null;
}
