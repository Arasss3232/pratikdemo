import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Icon } from "../site-shell";

type Category = {
  index: string;
  title: string;
  slug: string;
  to: string;
  desc: string;
  count: string;
  image: string;
  sub: string[];
};

import { CATEGORIES_DATA } from "@/data/catalog";

const CATEGORIES: readonly Category[] = [
  {
    index: "01",
    title: "Elektrikli El Aletleri",
    slug: "elektrikli-el-aletleri",
    to: "/teklif",
    desc: "Bosch Professional, Makita, DeWalt ve Hilti çözümleriyle matkap, taşlama, vidalama ve kırıcı delici sınıfının profesyonel makineleri.",
    count: "340+ ürün",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBkYboXopVvcxWg-DRjx8QKXsPsV-SvF39Nx2M64xck0BTyy9IP2pQfMIWu7o6ZB7dWFnVewW31xrHHu5x5dcbPDMh65Bf84inqdw-kSZW7lOwwKW6oGZXQvuPA1Kq1jDQxUAmgoqUCbxb8g38N9WUfjru8h-kV-7FyiiKzHgb0jDpuPp-9fNTY5jYWrH619cD7-urKnAMcV930fhjZJfgWus1kNCvVmhqiTiPilZ-UG8ov2xTu2jZw=w800",
    sub: ["Matkap", "Taşlama", "Vidalama"],
  },
  {
    index: "02",
    title: "El Aletleri",
    slug: "el-aletleri",
    to: "/teklif",
    desc: "Anahtar takımları, tornavidalar, pense grupları, ölçüm aletleri; atölye ve saha kullanımına uygun profesyonel el aletleri.",
    count: "520+ ürün",
    image:
      "https://images.unsplash.com/photo-1581147036324-c47a03a81d48?auto=format&fit=crop&w=800&q=80",
    sub: ["Anahtar Takımları", "Tornavida", "Pense"],
  },
  {
    index: "03",
    title: "Bağlantı Elemanları",
    slug: "baglanti-elemanlari",
    to: "/teklif",
    desc: "Cıvata, somun, pul, dübel ve özel bağlantı çözümleri; DIN/ISO standartlarında geniş stok ve özel imalat.",
    count: "1.200+ ürün",
    image:
      "https://images.unsplash.com/photo-1609205807107-e8ec2120f9de?auto=format&fit=crop&w=800&q=80",
    sub: ["Cıvata", "Somun", "Dübel"],
  },
  {
    index: "04",
    title: "Kişisel Koruyucu Donanım",
    slug: "kkd",
    to: "/teklif",
    desc: "CE sertifikalı iş güvenliği ekipmanları; baret, gözlük, kulak koruyucu, eldiven ve iş ayakkabıları.",
    count: "180+ ürün",
    image:
      "https://images.unsplash.com/photo-1618568949779-05df34c1b02e?auto=format&fit=crop&w=800&q=80",
    sub: ["Baret", "Eldiven", "İş Ayakkabısı"],
  },
  {
    index: "05",
    title: "Endüstriyel Makineler",
    slug: "endustriyel-makineler",
    to: "/teklif",
    desc: "Kompresör, jeneratör, kaynak makinesi ve atölye ekipmanları; sanayi tesisi standartlarına uygun ekipmanlar.",
    count: "95+ ürün",
    image:
      "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80",
    sub: ["Kompresör", "Jeneratör", "Kaynak"],
  },
  {
    index: "06",
    title: "Sarf Malzemeleri",
    slug: "sarf-malzemeleri",
    to: "/teklif",
    desc: "Kesme diskleri, taşlama diskleri, matkap uçları ve yüksek dönüşümlü sarf ürünleri.",
    count: "760+ ürün",
    image:
      "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=800&q=80",
    sub: ["Kesme Diski", "Matkap Ucu", "Testere"],
  },
];

export function CategoryExplorer() {
  const [active, setActive] = useState(0);
  const cat = CATEGORIES[active];

  // Keyboard: arrow keys move through list
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t?.closest?.("[data-category-tablist]")) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => (i + 1) % CATEGORIES.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => (i - 1 + CATEGORIES.length) % CATEGORIES.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section
      className="relative text-white overflow-hidden"
      style={{ backgroundColor: "var(--public-navy-950)" }}
      aria-label="Ürün grupları"
    >
      <div className="absolute inset-0 pub-blueprint opacity-60 pointer-events-none" aria-hidden />
      <div className="relative max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20 md:py-28">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="pub-marker mb-4">02 / Ürün Grupları</span>
            <h2 className="pub-h2 text-white mt-4 max-w-2xl">
              Tek tedarikçiden, altı ana grup.
            </h2>
            <p className="mt-4 max-w-xl text-white/70 text-[15px] md:text-[17px] leading-relaxed">
              Sanayi, şantiye ve teknik servis operasyonlarınızın ihtiyaç duyduğu profesyonel
              donanımı, kategori uzmanı ekibimizle tek noktadan sunuyoruz.
            </p>
          </div>
          <Link
            to="/urunler"
            className="pub-btn pub-btn-outline-light pub-btn-sm self-start md:self-end"
          >
            Tüm Kategoriler
            <Icon name="arrow_forward" className="text-[16px]" />
          </Link>
        </div>

        {/* Desktop: split layout */}
        <div className="hidden md:grid grid-cols-12 gap-10">
          <ul
            role="tablist"
            aria-label="Ürün grupları"
            data-category-tablist
            className="col-span-5 lg:col-span-5 flex flex-col"
            style={{ borderTop: "1px solid var(--public-navy-border)" }}
          >
            {CATEGORIES.map((c, i) => {
              const isActive = i === active;
              return (
                <li key={c.slug}>
                  <button
                    role="tab"
                    aria-selected={isActive}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActive(i)}
                    className="w-full text-left py-6 flex items-baseline gap-6 transition-colors relative group"
                    style={{
                      borderBottom: "1px solid var(--public-navy-border)",
                      color: isActive ? "var(--public-yellow-500)" : "#FFFFFF",
                    }}
                  >
                    {isActive && (
                      <span
                        className="absolute left-0 top-0 bottom-0 w-[3px]"
                        style={{ backgroundColor: "var(--public-yellow-500)" }}
                        aria-hidden
                      />
                    )}
                    <span
                      className="pub-mono w-8 tabular-nums pl-4"
                      style={{ color: isActive ? "var(--public-yellow-500)" : "rgba(255,255,255,0.5)" }}
                    >
                      {c.index}
                    </span>
                    <span
                      className="text-[22px] lg:text-[28px] leading-tight font-semibold flex-1"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: 0 }}
                    >
                      {c.title}
                    </span>
                    <span className="pr-4">
                      <Icon
                        name="arrow_forward"
                        className={`text-[20px] transition-transform ${isActive ? "translate-x-1" : "opacity-40 group-hover:opacity-100"}`}
                      />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div
            role="tabpanel"
            className="col-span-7 lg:col-span-7 flex flex-col"
          >
            <div
              className="relative aspect-[16/10] overflow-hidden pub-ticks"
              style={{ border: "1px solid var(--public-navy-border)", backgroundColor: "var(--public-navy-800)" }}
            >
              <span className="pub-tick-bl" aria-hidden />
              <span className="pub-tick-br" aria-hidden />
              <img
                key={cat.image}
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover opacity-95"
                loading="lazy"
                decoding="async"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(6,20,38,0.15) 0%, rgba(6,20,38,0.55) 100%)",
                }}
                aria-hidden
              />
              <span
                className="absolute top-4 left-4 pub-mono px-3 py-1.5"
                style={{
                  backgroundColor: "var(--public-yellow-500)",
                  color: "var(--public-navy-950)",
                }}
              >
                {cat.index} · {cat.count}
              </span>
            </div>

            <div
              className="mt-6 p-6 lg:p-8"
              style={{
                backgroundColor: "var(--public-navy-800)",
                border: "1px solid var(--public-navy-border)",
              }}
            >
              <h3
                className="text-white"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(28px, 3vw, 40px)",
                  fontWeight: 700,
                  lineHeight: 1.05,
                }}
              >
                {cat.title}
              </h3>
              <p className="mt-3 text-white/75 text-[15px] leading-relaxed max-w-xl">
                {cat.desc}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {cat.sub.map((s) => (
                  <span
                    key={s}
                    className="pub-mono px-3 py-1.5"
                    style={{
                      color: "var(--public-yellow-500)",
                      border: "1px solid var(--public-navy-border)",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
              <Link
                to={cat.to}
                search={{ categoryId: CATEGORIES_DATA.find(c => c.slug === cat.slug)?.id }}
                className="pub-btn pub-btn-primary pub-btn-sm mt-6"
              >
                Kategoriyi İncele
                <Icon name="arrow_forward" className="text-[16px]" />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile: horizontal chip nav + selected panel */}
        <div className="md:hidden">
          <div className="-mx-margin-mobile px-margin-mobile flex gap-2 overflow-x-auto pb-4 no-scrollbar">
            {CATEGORIES.map((c, i) => {
              const isActive = i === active;
              return (
                <button
                  key={c.slug}
                  onClick={() => setActive(i)}
                  className="pub-mono shrink-0 px-4 py-2.5 transition-colors"
                  style={{
                    backgroundColor: isActive ? "var(--public-yellow-500)" : "transparent",
                    color: isActive ? "var(--public-navy-950)" : "#FFFFFF",
                    border: `1px solid ${isActive ? "var(--public-yellow-500)" : "var(--public-navy-border)"}`,
                  }}
                  aria-pressed={isActive}
                >
                  {c.index} · {c.title}
                </button>
              );
            })}
          </div>

          <div
            className="mt-4"
            style={{
              backgroundColor: "var(--public-navy-800)",
              border: "1px solid var(--public-navy-border)",
            }}
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                key={cat.image}
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <span
                className="absolute top-3 left-3 pub-mono px-2.5 py-1"
                style={{ backgroundColor: "var(--public-yellow-500)", color: "var(--public-navy-950)" }}
              >
                {cat.index} · {cat.count}
              </span>
            </div>
            <div className="p-5">
              <h3
                className="text-white"
                style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700, lineHeight: 1.05 }}
              >
                {cat.title}
              </h3>
              <p className="mt-3 text-white/75 text-[14px] leading-relaxed">{cat.desc}</p>
              <Link to={cat.to} search={{ categoryId: CATEGORIES_DATA.find(c => c.slug === cat.slug)?.id }} className="pub-btn pub-btn-primary pub-btn-sm mt-5 w-full">
                Kategoriyi İncele
                <Icon name="arrow_forward" className="text-[16px]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectionHead({
  index,
  title,
  subtitle,
  action,
  inverse,
}: {
  index: string;
  title: string;
  subtitle?: string;
  action?: { label: string; to: string };
  inverse?: boolean;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        <div className={`hp-eyebrow ${inverse ? "hp-eyebrow-inverse" : ""} flex items-center gap-3 mb-3`}>
          <span className={`inline-block w-8 h-px ${inverse ? "bg-secondary" : "bg-primary"}`} />
          <span>
            {index} / {title}
          </span>
        </div>
        <h2 className={`hp-h2 ${inverse ? "text-inverse-on-surface" : ""}`}>{title}</h2>
        {subtitle && (
          <p className={`mt-3 max-w-2xl text-body-md font-body-md ${inverse ? "text-inverse-on-surface/80" : "text-on-surface-variant"}`}>
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <Link
          to={action.to}
          className={`inline-flex items-center gap-2 font-semibold text-label-bold uppercase tracking-widest transition-colors ${
            inverse ? "text-secondary hover:text-inverse-on-surface" : "text-primary hover:text-secondary-container"
          }`}
        >
          {action.label}
          <Icon name="arrow_forward" className="text-[16px]" />
        </Link>
      )}
    </div>
  );
}