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

const CATEGORIES: readonly Category[] = [
  {
    index: "01",
    title: "Elektrikli El Aletleri",
    slug: "elektrikli-el-aletleri",
    to: "/urunler/elektrikli-el-aletleri",
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
    to: "/urunler/el-aletleri",
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
    to: "/urunler/baglanti-elemanlari",
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
    to: "/urunler/kkd",
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
    to: "/urunler/endustriyel-makineler",
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
    to: "/urunler/sarf-malzemeleri",
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
    <section className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20 md:py-24">
      <SectionHead index="02" title="Ürün Grupları" action={{ label: "Tüm kategoriler", to: "/urunler" }} />

      {/* Desktop: split layout */}
      <div className="hidden md:grid grid-cols-12 gap-8 mt-10">
        <ul
          role="tablist"
          aria-label="Ürün grupları"
          data-category-tablist
          className="col-span-5 lg:col-span-4 flex flex-col border-t hp-hairline"
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
                  className={`w-full text-left py-5 flex items-baseline gap-5 border-b hp-hairline transition-colors ${
                    isActive ? "text-primary" : "text-on-background hover:text-primary"
                  }`}
                >
                  <span className="hp-mono text-[11px] uppercase tracking-widest text-on-surface-variant">
                    {c.index}
                  </span>
                  <span className="text-[20px] leading-tight font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                    {c.title}
                  </span>
                  <span className="ml-auto">
                    <Icon
                      name="arrow_forward"
                      className={`text-[18px] transition-transform ${isActive ? "translate-x-1 text-secondary" : ""}`}
                    />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div
          role="tabpanel"
          className="col-span-7 lg:col-span-8 hp-card p-6 lg:p-8 flex flex-col gap-6"
        >
          <div className="aspect-[16/9] overflow-hidden bg-surface-container relative">
            <img
              key={cat.image}
              src={cat.image}
              alt={cat.title}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <span className="absolute top-4 left-4 hp-mono text-[11px] uppercase tracking-widest px-2 py-1 bg-inverse-surface text-inverse-on-surface">
              {cat.index} / {cat.count}
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="hp-h2">{cat.title}</h3>
            <p className="text-body-md font-body-md text-on-surface-variant max-w-xl">{cat.desc}</p>
            <div className="flex flex-wrap gap-2">
              {cat.sub.map((s) => (
                <span
                  key={s}
                  className="hp-mono text-[11px] uppercase tracking-widest px-3 py-1 border hp-hairline text-on-surface-variant"
                >
                  {s}
                </span>
              ))}
            </div>
            <Link
              to={cat.to}
              className="mt-2 inline-flex items-center gap-2 text-primary font-semibold text-label-bold uppercase tracking-widest hover:text-secondary-container transition-colors"
            >
              Kategoriye Git
              <Icon name="arrow_forward" className="text-[16px]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile: swipe rail */}
      <div className="md:hidden mt-8 -mx-margin-mobile px-margin-mobile flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4">
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            to={c.to}
            className="snap-start shrink-0 w-[78vw] hp-card p-4 flex flex-col gap-3"
          >
            <div className="aspect-[16/10] bg-surface-container overflow-hidden">
              <img src={c.image} alt={c.title} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <span className="hp-mono text-[11px] uppercase tracking-widest text-on-surface-variant">
              {c.index} · {c.count}
            </span>
            <h3 className="text-[18px] font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              {c.title}
            </h3>
            <p className="text-body-sm font-body-sm text-on-surface-variant line-clamp-3">{c.desc}</p>
          </Link>
        ))}
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