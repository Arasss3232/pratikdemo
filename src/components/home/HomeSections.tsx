import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Icon } from "../site-shell";
import { SectionMarker } from "../marketing/SectionMarker";
import { FEATURED_LOGOS } from "@/data/catalog";
import { useCategories } from "@/hooks/use-categories";
import {
  useHomeBrands,
  useHomeReferences,
  useHomeSettings,
} from "@/hooks/use-home-data";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

/* =====================================================================
 * Shared building blocks — "Industrial Authority"
 * ===================================================================== */

const NAVY_950 = "var(--public-navy-950)";
const NAVY_900 = "var(--public-navy-900)";
const NAVY_800 = "var(--public-navy-800)";
const NAVY_700 = "var(--public-navy-700)";
const NAVY_BORDER = "var(--public-navy-border)";
const YELLOW = "var(--public-yellow-500)";

function PubHead({
  index,
  eyebrow,
  title,
  subtitle,
  action,
  tone = "dark",
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  action?: { label: string; to: string };
  tone?: "dark" | "light";
}) {
  const inv = tone === "dark";
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
      <div className="max-w-2xl">
        <SectionMarker
          number={index}
          label={eyebrow}
          tone={inv ? "dark" : "light"}
          className="mb-4"
        />
        <h2
          className=""
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: "-0.005em",
            fontSize: "clamp(36px, 4.6vw, 64px)",
            color: inv ? "#fff" : NAVY_950,
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className="mt-4 text-[15px] md:text-[17px] leading-relaxed"
            style={{ color: inv ? "rgba(255,255,255,0.75)" : "#455A73" }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <Link
          to={action.to}
          className={`pub-btn pub-btn-sm ${inv ? "pub-btn-outline-light" : "pub-btn-outline-dark"} self-start md:self-end`}
        >
          {action.label}
          <Icon name="arrow_forward" className="text-[16px]" />
        </Link>
      )}
    </div>
  );
}

/* Backward-compat re-export used by CategoryExplorer/other files */
export function SectionHead(props: {
  index: string;
  title: string;
  subtitle?: string;
  action?: { label: string; to: string };
  inverse?: boolean;
}) {
  return (
    <PubHead
      index={props.index}
      eyebrow={props.title}
      title={props.title}
      subtitle={props.subtitle}
      action={props.action}
      tone={props.inverse ? "dark" : "light"}
    />
  );
}

/* =====================================================================
 * 03 — Company Capability (navy frame + warm-light content panel)
 * ===================================================================== */
export function ValueProps({ sections = {} as any }: { sections?: any }) {
  const cmsCapabilities = sections.value_props?.content.capabilities?.value_json;
  const defaultCapabilities = [
    { k: "01", t: "Uzman Yönlendirme", d: "İhtiyacınıza en uygun ürün grubunu belirlemek için teknik destek sunuyoruz." },
    { k: "02", t: "Kurumsal Süreç", d: "Tekliften teslimata tüm aşamalar şeffaf ve kurumsal standartlarda yürütülür." },
    { k: "03", t: "Geniş Tedarik Ağı", d: "Dünya markalarının yetkili kanalları üzerinden güvenilir ürün temini sağlıyoruz." },
    { k: "04", t: "Kesintisiz Destek", d: "Satış öncesi ve sonrası süreçte uzman ekibimize her an ulaşabilirsiniz." },
  ];
  const capabilities = Array.isArray(cmsCapabilities) ? cmsCapabilities : defaultCapabilities;

  return (
    <section className="relative pub-navy overflow-hidden" style={{ backgroundColor: NAVY_900 }}>
      <div className="absolute inset-0 pub-blueprint opacity-70 pointer-events-none" aria-hidden />
      <div className="relative max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20 md:py-28">
        <PubHead
          index="03"
          eyebrow={sections.value_props?.content.eyebrow?.value_text || "Kurumsal Yetkinlik"}
          title={
            sections.value_props?.content.title?.value_text ? (
              <span>{sections.value_props.content.title.value_text}</span>
            ) : (
              <>
                Ürün tedariki değil, <span style={{ color: YELLOW }}>üretim güvenliği</span>.
              </>
            )
          }
          subtitle={sections.value_props?.content.subtitle?.value_text || "Sanayi tesislerine, şantiyelere ve üretim hatlarına yönelik profesyonel donanım tedariki. İhtiyacınız olan ürün grubunu seçin, uzman ekibimiz size özel teklifi hazırlasın."}
        />


        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div
            className="lg:col-span-7 relative pub-ticks overflow-hidden"
            style={{ border: `1px solid ${NAVY_BORDER}` }}
          >
            <span className="pub-tick-bl" aria-hidden />
            <span className="pub-tick-br" aria-hidden />
            <div className="aspect-[16/10]">
              <img
                src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1600&q=80"
                alt="Endüstriyel depo ve tedarik operasyonu"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                width={1600}
                height={1000}
              />
            </div>
            <div
              className="absolute bottom-0 left-0 right-0 flex items-center gap-4 px-6 py-4"
              style={{ backgroundColor: "rgba(6,20,38,0.85)", borderTop: `2px solid ${YELLOW}` }}
            >
              <span className="pub-mono" style={{ color: YELLOW }}>OPS · 12</span>
              <span className="text-white/85 text-[13px]">Kurumsal çözüm ortağınız — talebinizi iletin, teklifinizi hazırlayalım</span>
            </div>
          </div>

          <div className="lg:col-span-5 relative" style={{ backgroundColor: "#F2F5F8", color: NAVY_950 }}>
            <div className="p-8 md:p-10 flex flex-col gap-6 h-full">
              <span className="pub-marker pub-marker-dark">
                {sections.value_props?.content.hakkimizda_marker?.value_text || "02 / Hakkımızda"}
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(26px, 2.6vw, 34px)",
                  lineHeight: 1.05,
                  fontWeight: 700,
                }}
              >
                {sections.value_props?.content.hakkimizda_title?.value_text || "Pratik Endüstriyel, sahayı bilen bir tedarik ortağıdır."}
              </h3>
              <p className="text-[14.5px] leading-relaxed" style={{ color: "#455A73" }}>
                {sections.value_props?.content.hakkimizda_desc?.value_text || "Her projede aynı kişi, aynı süreç, aynı sorumluluk. Uzun soluklu tedarikçi ilişkileri kurmak için çalışıyoruz."}
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-px" style={{ backgroundColor: "#DBE2EB" }}>
                {capabilities.map((c) => (
                  <li key={c.k} className="p-4" style={{ backgroundColor: "#F2F5F8" }}>
                    <span className="pub-mono" style={{ color: NAVY_900 }}>{c.k}</span>
                    <p
                      className="mt-1 text-[15px] font-semibold"
                      style={{ fontFamily: "var(--font-display)", color: NAVY_950 }}
                    >
                      {c.t}
                    </p>
                    <p className="mt-1 text-[12.5px] leading-snug" style={{ color: "#455A73" }}>
                      {c.d}
                    </p>
                  </li>
                ))}
              </ul>
              <Link to={sections.value_props?.content.hakkimizda_btn_url?.link_url || "/kurumsal"} className="pub-btn pub-btn-outline-dark pub-btn-sm self-start">
                {sections.value_props?.content.hakkimizda_btn_label?.value_text || "Hakkımızda"}
                <Icon name="arrow_forward" className="text-[16px]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
 * 04 — Application Sectors (corporate navy interactive)
 * ===================================================================== */
export function SectorGrid() {
  const sectors = [
    {
      k: "01",
      t: "Sanayi ve Üretim",
      d: "Üretim tesisleri için elektrikli el aletleri, bağlantı elemanları ve endüstriyel makine grupları.",
      groups: [
        { label: "Elektrikli El Aletleri", slug: "elektrikli-el-aletleri" },
        { label: "Bağlantı Elemanları", slug: "baglanti-elemanlari" },
        { label: "Endüstriyel Makineler", slug: "endustriyel-makineler" },
      ],
      image: "https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=1600&q=80",
    },
    {
      k: "02",
      t: "İnşaat ve Şantiye",
      d: "Şantiye ekipmanları, kırıcı-delici sistemler ve saha güvenliği için kişisel koruyucu donanım.",
      groups: [
        { label: "Elektrikli El Aletleri", slug: "elektrikli-el-aletleri" },
        { label: "Kişisel Koruyucu Donanım", slug: "kkd" },
        { label: "Sarf Malzemeleri", slug: "sarf-malzemeleri" },
      ],
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1600&q=80",
    },
    {
      k: "03",
      t: "Otomotiv ve Teknik Servis",
      d: "OEM üretim hattı, servis atölyeleri ve bakım ekipleri için hassas el aletleri ve ölçüm çözümleri.",
      groups: [
        { label: "El Aletleri", slug: "el-aletleri" },
        { label: "Sarf Malzemeleri", slug: "sarf-malzemeleri" },
        { label: "Endüstriyel Makineler", slug: "endustriyel-makineler" },
      ],
      image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1600&q=80",
    },
    {
      k: "04",
      t: "Mobilya ve Ahşap İşleme",
      d: "Ahşap işleme atölyeleri için testere, zımpara, yüzey işleme ekipmanları ve tamamlayıcı sarflar.",
      groups: [
        { label: "Elektrikli El Aletleri", slug: "elektrikli-el-aletleri" },
        { label: "El Aletleri", slug: "el-aletleri" },
        { label: "Sarf Malzemeleri", slug: "sarf-malzemeleri" },
      ],
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80",
    },
  ];
  const { categories = [], isLoading: categoriesLoading } = useCategories();
  const [active, setActive] = useState(0);
  const cur = sectors[active];

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: NAVY_800, color: "#fff" }}>
      <div className="absolute inset-0 pub-blueprint opacity-40 pointer-events-none" aria-hidden />
      <div className="relative max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20 md:py-28">
        <PubHead
          index="04"
          eyebrow="Uygulama Sektörleri"
          title={
            <>
              Sahaya göre <span style={{ color: YELLOW }}>tedarik</span>.
            </>
          }
          subtitle="Farklı disiplinlerdeki ekiplere; sahalarına, ölçeklerine ve tempolarına uygun donanım tedariki yürütüyoruz."
        />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <ul
            className="lg:col-span-5 flex flex-col"
            style={{ borderTop: `1px solid ${NAVY_BORDER}` }}
            role="tablist"
            aria-label="Sektörler"
          >
            {sectors.map((s, i) => {
              const isA = i === active;
              return (
                <li key={s.k}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isA}
                    onClick={() => setActive(i)}
                    className="w-full text-left py-6 flex items-baseline gap-5 transition-colors relative"
                    style={{
                      borderBottom: `1px solid ${NAVY_BORDER}`,
                      color: isA ? YELLOW : "#fff",
                    }}
                  >
                    {isA && (
                      <span
                        aria-hidden
                        className="absolute left-0 top-0 bottom-0"
                        style={{ width: 3, backgroundColor: YELLOW }}
                      />
                    )}
                    <span className="pub-mono pl-4 tabular-nums" style={{ color: isA ? YELLOW : "rgba(255,255,255,0.5)" }}>
                      {s.k}
                    </span>
                    <span
                      className="flex-1 text-[20px] md:text-[24px] leading-tight"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
                    >
                      {s.t}
                    </span>
                    <Icon
                      name="arrow_forward"
                      className={`text-[18px] pr-4 transition-transform ${isA ? "translate-x-1" : "opacity-40"}`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="lg:col-span-7 flex flex-col gap-6" role="tabpanel">
            <div
              className="relative aspect-[16/10] overflow-hidden pub-ticks"
              style={{ border: `1px solid ${NAVY_BORDER}`, backgroundColor: NAVY_700 }}
            >
              <span className="pub-tick-bl" aria-hidden />
              <span className="pub-tick-br" aria-hidden />
              <img
                key={cur.image}
                src={cur.image}
                alt={cur.t}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(180deg, rgba(6,20,38,0.15), rgba(6,20,38,0.55))" }}
                aria-hidden
              />
              <span
                className="absolute top-4 left-4 pub-mono px-3 py-1.5"
                style={{ backgroundColor: YELLOW, color: NAVY_950 }}
              >
                {cur.k} · {cur.t}
              </span>
            </div>

            <div className="p-6 md:p-7" style={{ backgroundColor: NAVY_900, border: `1px solid ${NAVY_BORDER}` }}>
              <p className="text-white/80 text-[15px] leading-relaxed">{cur.d}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {cur.groups.map((g) => {
                  const targetCat = categories?.find((cd: any) => cd.slug === g.slug);
                  return (
                    <Link
                      key={g.label}
                      to="/teklif"
                      search={{ categoryId: targetCat?.id }}
                      className="pub-mono px-3 py-1.5 transition-colors"
                      style={{ 
                        color: YELLOW, 
                        border: `1px solid ${NAVY_BORDER}`,
                        opacity: targetCat ? 1 : 0.5,
                        pointerEvents: targetCat ? 'auto' : 'none'
                      }}
                    >
                      {g.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
 * 05 — Featured Products (graphite/navy, editorial hero + rail)
 * ===================================================================== */
export function FeaturedProducts() {
  return null;
}

/* =====================================================================
 * 06 — Why Choose Us (warm-light with strong navy framing)
 * ===================================================================== */
export function WhyChoose({ sections = {} as any }: { sections?: any }) {
  const cmsItems = sections.why_choose?.content.reasons?.value_json;
  const defaultItems = [
    { k: "01", t: "Ürün Bilgisi", d: "Kategori derinliğine hakim satış ekibiyle uygun ürünü ilk turda öneriyoruz." },
    { k: "02", t: "Kurumsal Tedarik", d: "Cari kart, fatura, teslimat ve garanti süreçleri kurumsal standartlarda yürütülür." },
    { k: "03", t: "Teklif Şeffaflığı", d: "Teklif, stok durumu ve teslim süresi konusunda net bilgi verir; süreç boyunca haber veririz." },
    { k: "04", t: "Kolay İletişim", d: "Telefon, e-posta veya WhatsApp — hangisi kolaysa. Muhatabınız değişmez." },
    { k: "05", t: "Yedek Parça Sürekliliği", d: "Satılan ürünlerin yedek parçası ve sarfları için sürekli tedarik desteği." },
  ];
  const items = Array.isArray(cmsItems) ? cmsItems : defaultItems;
  return (
    <section className="relative" style={{ backgroundColor: NAVY_950, padding: "48px 0" }}>
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
        <div
          className="relative pub-ticks"
          style={{
            backgroundColor: "#F2F5F8",
            color: NAVY_950,
            border: `1px solid ${NAVY_BORDER}`,
          }}
        >
          <span className="pub-tick-bl" aria-hidden />
          <span className="pub-tick-br" aria-hidden />
          <div className="p-8 md:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            <div className="lg:col-span-5">
              <span className="pub-marker pub-marker-dark">
                {sections.why_choose?.content.eyebrow?.value_text || "06 / Neden Pratik"}
              </span>
              <h2
                className="mt-4"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(34px, 4vw, 56px)",
                  fontWeight: 700,
                  lineHeight: 1.02,
                  color: NAVY_950,
                }}
              >
                {sections.why_choose?.content.title?.value_text || (
                  <>
                    Doğru ürün, doğru marka, <br />
                    doğru yönlendirme.
                  </>
                )}
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed" style={{ color: "#455A73" }}>
                {sections.why_choose?.content.subtitle?.value_text || "Endüstriyel donanım tedariki fiyattan önce doğru öneri gerektirir. Farkımız burada başlıyor."}
              </p>
              <div
                className="mt-8 aspect-[4/5] overflow-hidden pub-ticks relative"
                style={{ border: `1px solid ${NAVY_900}` }}
              >
                <span className="pub-tick-bl" aria-hidden />
                <span className="pub-tick-br" aria-hidden />
                <img
                  src="https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=1200&q=80"
                  alt="Endüstriyel atölyede profesyonel ekipman"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  width={1200}
                  height={1500}
                />
                <div
                  className="absolute bottom-0 left-0 right-0 px-5 py-4"
                  style={{ backgroundColor: "rgba(6,20,38,0.85)", borderTop: `2px solid ${YELLOW}` }}
                >
                  <span className="pub-mono" style={{ color: YELLOW }}>SAHA</span>
                  <p className="mt-1 text-[13.5px] text-white/90">
                    Tesis ekipleriyle birlikte doğru ürünü belirliyoruz.
                  </p>
                </div>
              </div>
            </div>

            <ol className="lg:col-span-7 flex flex-col" style={{ borderTop: `1px solid ${NAVY_BORDER}` }}>
              {items.map((it) => (
                <li
                  key={it.k}
                  className="py-6 md:py-8 grid grid-cols-[auto_1fr] gap-6 md:gap-10 items-start group"
                  style={{ borderBottom: `1px solid ${NAVY_BORDER}` }}
                >
                  <span
                    className="pub-mono pt-1"
                    style={{ color: NAVY_900, fontSize: 13, letterSpacing: "0.16em" }}
                  >
                    {it.k}
                  </span>
                  <div>
                    <h3
                      className="text-[22px] md:text-[26px] leading-tight transition-colors group-hover:text-[color:var(--public-navy-700)]"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: NAVY_950 }}
                    >
                      {it.t}
                    </h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed" style={{ color: "#455A73" }}>
                      {it.d}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}


/* =====================================================================
 * 08 — Brands (deep navy logo grid)
 * ===================================================================== */
export function BrandStrip() {
  const { data } = useHomeBrands();
  const FALLBACK_BRANDS: { name: string; domain: string; url: string }[] = [
    { name: "Bosch Professional", domain: "bosch-professional.com", url: "https://www.bosch-professional.com" },
    { name: "Makita", domain: "makita.com", url: "https://www.makita.com" },
    { name: "DeWalt", domain: "dewalt.com", url: "https://www.dewalt.com" },
    { name: "Hilti", domain: "hilti.com", url: "https://www.hilti.com" },
    { name: "Milwaukee", domain: "milwaukeetool.com", url: "https://www.milwaukeetool.com" },
    { name: "Stanley", domain: "stanleytools.com", url: "https://www.stanleytools.com" },
    { name: "Karcher", domain: "kaercher.com", url: "https://www.kaercher.com" },
    { name: "3M", domain: "3m.com", url: "https://www.3m.com" },
    { name: "Honeywell", domain: "honeywell.com", url: "https://www.honeywell.com" },
    { name: "Uvex", domain: "uvex-safety.com", url: "https://www.uvex-safety.com" },
    { name: "Fischer", domain: "fischer.de", url: "https://www.fischer.de" },
    { name: "Wurth", domain: "wurth.com", url: "https://www.wurth.com" },
  ];
  const logoDevKey = import.meta.env.VITE_LOVABLE_CONNECTOR_LOGO_DEV_API_KEY as string | undefined;
  const logos: { key: string; src: string; alt: string; href?: string }[] =
    data && data.length > 0
      ? data.map((b) => ({ key: b.id, src: b.logo_url, alt: b.name, href: b.website_url || undefined }))
      : FALLBACK_BRANDS.map((b) => ({
          key: b.domain,
          src: logoDevKey
            ? `https://img.logo.dev/${b.domain}?token=${logoDevKey}&size=200&format=png`
            : `https://logo.clearbit.com/${b.domain}?size=200`,
          alt: b.name,
          href: b.url,
        }));

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: NAVY_950, color: "#fff" }}>
      <div className="absolute inset-0 pub-blueprint opacity-50 pointer-events-none" aria-hidden />
      <div className="relative max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20 md:py-28">
        <PubHead
          index="07"
          eyebrow="Bayiliklerimiz"
          title={
            <>
              Yetkili <span style={{ color: YELLOW }}>Bayiliklerimiz</span>.
            </>
          }
          subtitle="Uluslararası ve yerel üretici markaların yetkili bayisi olarak orijinal ürün tedariki sağlıyoruz."
          action={{ label: "Tüm Bayilikler", to: "/bayiliklerimiz" }}
        />
        <div
          className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px"
          style={{ backgroundColor: NAVY_BORDER }}
        >
          {logos.map((logo) => {
            const inner = (
              <div
                className="h-28 flex items-center justify-center p-5 transition-transform hover:scale-[1.03]"
                style={{ backgroundColor: "#ffffff" }}
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  title={logo.alt}
                  loading="lazy"
                  decoding="async"
                  width={160}
                  height={60}
                  className="max-h-12 max-w-full object-contain"
                />
              </div>
            );
            return logo.href ? (
              <a key={logo.key} href={logo.href} target="_blank" rel="noreferrer" aria-label={logo.alt} title={logo.alt}>
                {inner}
              </a>
            ) : (
              <div key={logo.key} aria-label={logo.alt}>
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
 * 09 — Corporate Evidence / Selected References (corporate navy)
 * ===================================================================== */
export function SelectedReferences() {
  const { data } = useHomeReferences();
  const stats = [
    { n: "6", l: "Ana Ürün Grubu" },
    { n: "40+", l: "Marka" },
    { n: "3.000+", l: "SKU" },
    { n: "TR", l: "Tedarik Coğrafyası" },
  ];
  const items = data || [];
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: NAVY_800, color: "#fff" }}>
      <div className="absolute inset-0 pub-blueprint opacity-40 pointer-events-none" aria-hidden />
      <div className="relative max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20 md:py-28">
        <PubHead
          index="08"
          eyebrow="Güçlü İş Birlikleri"
          title={
            <>
              Dünya markalarının <span style={{ color: YELLOW }}>yetkili</span> bayiliği.
            </>
          }
          subtitle="Sanayi ve inşaat sektörünün dev markalarıyla olan yetkili bayilik iş birliklerimiz sayesinde en güncel ürünleri doğrudan stoktan sunuyoruz."
          action={items.length > 0 ? { label: "Tüm Bayiliklerimiz", to: "/bayiliklerimiz" } : undefined}
        />

        <div
          className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-px"
          style={{ backgroundColor: NAVY_BORDER, border: `1px solid ${NAVY_BORDER}` }}
        >
          {stats.map((s) => (
            <div key={s.l} className="p-6 md:p-8" style={{ backgroundColor: NAVY_900 }}>
              <span
                className="block"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(38px, 5vw, 60px)",
                  fontWeight: 700,
                  color: YELLOW,
                  lineHeight: 1,
                }}
              >
                {s.n}
              </span>
              <span className="pub-mono mt-3 block text-white/70">{s.l}</span>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {items.map((r, i) => (
            <Link
              key={r.id}
              to="/bayiliklerimiz"
              className="group relative flex flex-col bg-white pub-ticks transition-all hover:shadow-xl hover:-translate-y-1"
              style={{ border: `1px solid var(--public-border)`, backgroundColor: "#FFF" }}
            >
              <span className="pub-tick-bl" aria-hidden />
              <span className="pub-tick-br" aria-hidden />
              <div 
                className="aspect-[4/3] p-8 flex items-center justify-center overflow-hidden border-b"
                style={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }}
              >
                <img
                  src={r.cover_url || ""}
                  alt={r.title}
                  className="max-w-[80%] max-h-[80%] object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <span className="pub-mono text-[10px]" style={{ color: "#6B7280" }}>
                  {r.category || "Bayilik"}
                </span>
                <h3 className="mt-2 text-[20px] font-bold text-[#061426] group-hover:text-[#0070B0]">
                  {r.title}
                </h3>
                <p className="mt-2 text-[13px] text-[#4B5563] line-clamp-2 leading-relaxed">
                  {r.client_name}
                </p>
              </div>
            </Link>
          ))}

          {items.length === 0 && (
            <>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-8 bg-white/5 pub-ticks border border-white/10 flex flex-col items-center justify-center text-center aspect-[4/3]">
                  <Icon name="verified" className="text-[40px] text-white/10 mb-4" />
                  <p className="text-white/30 text-sm">Veriler yükleniyor...</p>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
 * 10 — Supply Process (main navy, technical timeline)
 * ===================================================================== */
export function ProcessTimeline() {
  const steps = [
    { k: "01", t: "İhtiyacınızı Belirleyelim", d: "Ürün listesi, marka tercihi veya teknik gereksinim — elinizdekini iletin.", icon: "forward_to_inbox" },
    { k: "02", t: "Uygun Ürünü Seçelim", d: "Satış ekibimiz projenize uygun ürün ve alternatifleri birlikte değerlendirir.", icon: "insights" },
    { k: "03", t: "Teklifinizi Hazırlayalım", d: "Fiyat, teslim süresi ve garanti koşulları dahil karşılaştırılabilir teklif.", icon: "request_quote" },
    { k: "04", t: "Tedariki Tamamlayalım", d: "Sevkiyat, faturalama ve satış sonrası iletişim tek muhatap üzerinden.", icon: "local_shipping" },
  ];
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: NAVY_900, color: "#fff" }}>
      <div className="absolute inset-0 pub-blueprint opacity-50 pointer-events-none" aria-hidden />
      <div className="relative max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20 md:py-28">
        <PubHead
          index="09"
          eyebrow="Tedarik Süreci"
          title={
            <>
              Talepten teslimata <span style={{ color: YELLOW }}>tek muhatap</span>.
            </>
          }
          subtitle="Öngörülebilir, takip edilebilir ve tek muhataplı bir süreç yürütüyoruz."
        />

        {/* Desktop horizontal */}
        <div className="hidden md:block mt-16 relative">
          <div className="absolute top-6 left-0 right-0 h-px" style={{ backgroundColor: NAVY_BORDER }} aria-hidden />
          <div className="absolute top-6 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, ${YELLOW}, transparent)` }} aria-hidden />
          <ol className="grid grid-cols-4 gap-6">
            {steps.map((s) => (
              <li key={s.k} className="flex flex-col items-start">
                <span
                  className="relative z-10 w-12 h-12 grid place-items-center"
                  style={{ backgroundColor: NAVY_950, border: `2px solid ${YELLOW}`, color: YELLOW }}
                >
                  <Icon name={s.icon} className="text-[22px]" aria-hidden />
                </span>
                <span className="mt-6 pub-mono" style={{ color: YELLOW }}>{s.k}</span>
                <h3
                  className="mt-2 text-[20px] leading-tight text-white"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
                >
                  {s.t}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-white/70 max-w-xs">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Mobile vertical */}
        <ol className="md:hidden mt-10 relative">
          <div className="absolute left-6 top-2 bottom-2 w-px" style={{ backgroundColor: NAVY_BORDER }} aria-hidden />
          {steps.map((s) => (
            <li key={s.k} className="relative pl-16 pb-8 last:pb-0">
              <span
                className="absolute left-0 top-0 w-12 h-12 grid place-items-center"
                style={{ backgroundColor: NAVY_950, border: `2px solid ${YELLOW}`, color: YELLOW }}
              >
                <Icon name={s.icon} className="text-[22px]" aria-hidden />
              </span>
              <span className="pub-mono" style={{ color: YELLOW }}>{s.k}</span>
              <h3
                className="mt-1 text-[19px] leading-tight text-white"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                {s.t}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-white/70">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}


/* =====================================================================
 * 12 — Quotation & Contact (deepest navy conversion section)
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
    "w-full bg-white text-[color:var(--public-navy-950)] border border-[color:var(--public-navy-border)] focus:border-[color:var(--public-yellow-500)] focus:outline-none px-4 py-3 text-[15px] placeholder:text-[#8692A3] transition-colors";

  return (
    <section
      id="teklif-al"
      className="relative overflow-hidden"
      style={{ backgroundColor: NAVY_950, color: "#fff" }}
    >
      <div className="absolute inset-0 pub-blueprint-lg opacity-40 pointer-events-none" aria-hidden />
      <div className="absolute inset-0 pub-glow-yellow pointer-events-none" aria-hidden />
      <div className="relative max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5">
            <span className="pub-marker">10 / Teklif ve İletişim</span>
            <h2
              className="mt-4"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(38px, 5vw, 72px)",
                fontWeight: 700,
                lineHeight: 1.02,
                color: "#fff",
              }}
            >
              Projeniz için <span style={{ color: YELLOW }}>teklif</span> hazırlayalım.
            </h2>
            <p className="mt-4 max-w-md text-[15px] md:text-[16px] leading-relaxed text-white/75">
              Ürün listenizi veya ihtiyacınızın kısa özetini paylaşın. Satış ekibimiz kısa süre içinde geri dönsün.
            </p>
            <div className="mt-8 flex flex-col">
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s+/g, "").replace(/\+/, "")}`}
                  className="flex items-center gap-4 py-4 text-white hover:text-[color:var(--public-yellow-500)] transition-colors"
                  style={{ borderTop: `1px solid ${NAVY_BORDER}` }}
                >
                  <span className="w-11 h-11 grid place-items-center" style={{ border: `1px solid ${NAVY_BORDER}`, color: YELLOW }}>
                    <Icon name="call" />
                  </span>
                  <span className="flex-1">
                    <span className="block pub-mono text-white/50">Telefon</span>
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
                  className="flex items-center gap-4 py-4 text-white hover:text-[color:var(--public-yellow-500)] transition-colors"
                  style={{ borderTop: `1px solid ${NAVY_BORDER}` }}
                >
                  <span className="w-11 h-11 grid place-items-center" style={{ border: `1px solid ${NAVY_BORDER}`, color: YELLOW }}>
                    <Icon name="chat" />
                  </span>
                  <span className="flex-1">
                    <span className="block pub-mono text-white/50">WhatsApp</span>
                    <span className="block text-[17px] font-semibold">Hemen mesaj yazın</span>
                  </span>
                  <Icon name="arrow_forward" className="text-white/40" />
                </a>
              )}
              {s?.email && (
                <a
                  href={`mailto:${s.email}`}
                  className="flex items-center gap-4 py-4 text-white hover:text-[color:var(--public-yellow-500)] transition-colors"
                  style={{ borderTop: `1px solid ${NAVY_BORDER}`, borderBottom: `1px solid ${NAVY_BORDER}` }}
                >
                  <span className="w-11 h-11 grid place-items-center" style={{ border: `1px solid ${NAVY_BORDER}`, color: YELLOW }}>
                    <Icon name="mail" />
                  </span>
                  <span className="flex-1">
                    <span className="block pub-mono text-white/50">E-posta</span>
                    <span className="block text-[17px] font-semibold break-all">{s.email}</span>
                  </span>
                  <Icon name="arrow_forward" className="text-white/40" />
                </a>
              )}
            </div>
          </div>

          <div className="lg:col-span-7">
            {state === "ok" ? (
              <div
                className="p-8 md:p-12 text-center pub-ticks"
                style={{ backgroundColor: NAVY_900, border: `1px solid ${YELLOW}` }}
              >
                <span className="pub-tick-bl" aria-hidden />
                <span className="pub-tick-br" aria-hidden />
                <span
                  className="inline-flex items-center justify-center w-14 h-14 mb-4"
                  style={{ border: `2px solid ${YELLOW}`, color: YELLOW }}
                >
                  <Icon name="check" className="text-[28px]" />
                </span>
                <h3
                  className="text-white"
                  style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700 }}
                >
                  Talebiniz alındı.
                </h3>
                <p className="mt-3 text-white/75">
                  Ekibimiz kısa süre içinde tarafınıza dönecek. Aciliyet durumunda telefonla ulaşabilirsiniz.
                </p>
                <button
                  type="button"
                  onClick={() => setState("idle")}
                  className="mt-6 pub-mono transition-colors"
                  style={{ color: YELLOW }}
                >
                  Yeni bir talep gönder →
                </button>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                noValidate
                className="pub-ticks p-6 md:p-8 flex flex-col gap-4"
                style={{ backgroundColor: NAVY_900, border: `1px solid ${NAVY_BORDER}` }}
                aria-label="Hızlı teklif formu"
              >
                <span className="pub-tick-bl" aria-hidden />
                <span className="pub-tick-br" aria-hidden />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Ad Soyad *" name="name" required inputCls={inputCls} error={errors.name} autoComplete="name" />
                  <Field label="Firma Adı" name="company" inputCls={inputCls} error={errors.company} autoComplete="organization" />
                  <Field label="Telefon *" name="phone" type="tel" required inputCls={inputCls} error={errors.phone} autoComplete="tel" />
                  <Field label="E-posta *" name="email" type="email" required inputCls={inputCls} error={errors.email} autoComplete="email" />
                </div>
                <label className="flex flex-col gap-2">
                  <span className="pub-mono text-white/70">Ürün Grubu *</span>
                  <select name="category" required className={inputCls} defaultValue="" aria-invalid={!!errors.category}>
                    <option value="" disabled>Seçiniz…</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {errors.category && <span className="text-[color:var(--public-yellow-500)] text-[12px]">{errors.category}</span>}
                </label>
                <label className="flex flex-col gap-2">
                  <span className="pub-mono text-white/70">Talebiniz</span>
                  <textarea
                    name="message"
                    rows={4}
                    maxLength={1200}
                    className={inputCls}
                    placeholder="Kısaca ihtiyacınızı yazın veya bir ürün listesi belirtin."
                  />
                </label>
                <label className="flex items-start gap-3 text-white/80 text-[13.5px]">
                  <input type="checkbox" name="kvkk" required className="mt-1" style={{ accentColor: "var(--public-yellow-500)" }} />
                  <span>
                    Kişisel verilerimin{" "}
                    <Link to="/kvkk" className="underline hover:text-white" style={{ color: YELLOW }}>
                      KVKK aydınlatma metni
                    </Link>{" "}
                    kapsamında işlenmesini kabul ediyorum.
                  </span>
                </label>
                {errors.kvkk && <span className="text-[color:var(--public-yellow-500)] text-[12px]">{errors.kvkk}</span>}
                {errMsg && <p className="text-[color:var(--public-yellow-500)] text-[13px]">{errMsg}</p>}
                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="pub-btn pub-btn-primary self-start disabled:opacity-70"
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
      <span className="pub-mono text-white/70">{label}</span>
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
        <span id={`${name}-err`} className="text-[color:var(--public-yellow-500)] text-[12px]">
          {error}
        </span>
      )}
    </label>
  );
}

/* =====================================================================
 * 13 — Location (navy outer + warm-light info block)
 * ===================================================================== */
export function ContactInfo() {
  const { data: s } = useHomeSettings();
  const address = s?.address;
  const phone = s?.phone;
  const email = s?.email;
  const hours = s?.working_hours || "Pzt – Cmt · 08:30 – 18:00";
  const mapQ = address ? encodeURIComponent(address) : "Pratik Endüstriyel";
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: NAVY_900, color: "#fff" }}>
      <div className="absolute inset-0 pub-blueprint opacity-40 pointer-events-none" aria-hidden />
      <div className="relative max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20 md:py-28">
        <PubHead
          index="11"
          eyebrow="Konum ve İletişim"
          title={
            <>
              Merkez ofisimize <span style={{ color: YELLOW }}>ulaşın</span>.
            </>
          }
          subtitle="Yol tarifi alın, bize doğrudan yazın veya çalışma saatleri içinde arayın."
        />
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div
            className="lg:col-span-5 p-8 md:p-10 pub-ticks flex flex-col"
            style={{ backgroundColor: "#F2F5F8", color: NAVY_950, border: `1px solid ${NAVY_BORDER}` }}
          >
            <span className="pub-tick-bl" aria-hidden />
            <span className="pub-tick-br" aria-hidden />
            {address && <ContactRow icon="location_on" title="Adres" value={address} />}
            {phone && <ContactRow icon="call" title="Telefon" value={phone} href={`tel:${phone.replace(/\s+/g, "")}`} />}
            {email && <ContactRow icon="mail" title="E-posta" value={email} href={`mailto:${email}`} />}
            <ContactRow icon="schedule" title="Çalışma Saatleri" value={hours} />
            {address && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQ}`}
                target="_blank"
                rel="noreferrer"
                className="pub-btn pub-btn-outline-dark pub-btn-sm self-start mt-6"
              >
                <Icon name="directions" aria-hidden />
                Yol Tarifi Al
              </a>
            )}
          </div>
          <div className="lg:col-span-7">
            <div
              className="aspect-[16/10] w-full overflow-hidden pub-ticks"
              style={{ border: `1px solid ${NAVY_BORDER}`, backgroundColor: NAVY_800 }}
            >
              <span className="pub-tick-bl" aria-hidden />
              <span className="pub-tick-br" aria-hidden />
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
      </div>
    </section>
  );
}

function ContactRow({ icon, title, value, href }: { icon: string; title: string; value: string; href?: string }) {
  const content = (
    <div className="flex items-start gap-4 py-4" style={{ borderBottom: `1px solid ${NAVY_BORDER}` }}>
      <span
        className="w-11 h-11 grid place-items-center shrink-0"
        style={{ border: `1px solid ${NAVY_900}`, color: NAVY_900 }}
      >
        <Icon name={icon} className="text-[22px]" />
      </span>
      <div className="min-w-0">
        <span className="block pub-mono" style={{ color: NAVY_900 }}>{title}</span>
        <span className="block mt-1 text-[15.5px] font-semibold break-words" style={{ color: NAVY_950 }}>
          {value}
        </span>
      </div>
    </div>
  );
  return href ? (
    <a href={href} className="block transition-colors hover:text-[color:var(--public-navy-700)]">
      {content}
    </a>
  ) : (
    content
  );
}

/* =====================================================================
 * Mobile floating contact FAB
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
            search={{ categoryId: undefined, category: "Genel" }}
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-2 pl-4 pr-3 h-11 text-[13px] font-semibold shadow-lg"
            style={{ backgroundColor: YELLOW, color: NAVY_950 }}
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
              className="inline-flex items-center gap-2 pl-4 pr-3 h-11 text-[13px] font-semibold shadow-lg"
              style={{ backgroundColor: NAVY_900, color: "#fff", border: `1px solid ${NAVY_BORDER}` }}
            >
              WhatsApp
              <Icon name="chat" className="text-[18px]" />
            </a>
          )}
          {phone && (
            <a
              href={`tel:${phone.replace(/\s+/g, "").replace(/\+/, "")}`}
              aria-label="Telefonla ara"
              className="inline-flex items-center gap-2 pl-4 pr-3 h-11 text-[13px] font-semibold shadow-lg"
              style={{ backgroundColor: NAVY_900, color: "#fff", border: `1px solid ${NAVY_BORDER}` }}
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
        className="w-14 h-14 rounded-full shadow-xl grid place-items-center transition-colors"
        style={{ backgroundColor: YELLOW, color: NAVY_950 }}
      >
        <Icon name={open ? "close" : "support_agent"} className="text-[26px]" />
      </button>
    </div>
  );
}

/* Backward-compat export (unused after shell merge) */
export function HomeUtilityStrip() {
  return null;
}