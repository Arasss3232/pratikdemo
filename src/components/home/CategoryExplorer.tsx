import { useEffect, useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Icon } from "../site-shell";
import { useCategories, type Category } from "@/hooks/use-categories";

function CategoryExplorerContent({ categories, active, setActive }: { categories: any[], active: number, setActive: (updater: (prev: number) => number) => void }) {
  useEffect(() => {
    if (categories.length === 0) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t?.closest?.("[data-category-tablist]")) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((prev: number) => (prev + 1) % categories.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((prev: number) => (prev - 1 + categories.length) % categories.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [categories.length, setActive]);

  const cat = categories[active];
  if (!cat) return null;

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

        <div className="hidden md:grid grid-cols-12 gap-10">
          <ul
            role="tablist"
            aria-label="Ürün grupları"
            data-category-tablist
            className="col-span-5 lg:col-span-5 flex flex-col"
            style={{ borderTop: "1px solid var(--public-navy-border)" }}
          >
            {categories.map((c: any, i: number) => {
              const isActive = i === active;
              return (
                <li key={c.id}>
                  <button
                    role="tab"
                    aria-selected={isActive}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActive(() => i)}
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
                {cat.sub?.map((s: any) => (
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
                to="/teklif"
                search={{ categoryId: cat.id }}
                className="pub-btn pub-btn-primary pub-btn-sm mt-6"
              >
                Kategoriyi İncele
                <Icon name="arrow_forward" className="text-[16px]" />
              </Link>
            </div>
          </div>
        </div>

        <div className="md:hidden">
          <div className="-mx-margin-mobile px-margin-mobile flex gap-2 overflow-x-auto pb-4 no-scrollbar">
            {categories.map((c: any, i: number) => {
              const isActive = i === active;
              return (
                <button
                  key={c.id}
                  onClick={() => setActive(() => i)}
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
              <Link to="/teklif" search={{ categoryId: cat.id }} className="pub-btn pub-btn-primary pub-btn-sm mt-5 w-full">
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

export function CategoryExplorer() {
  const { categories: dbCategories, isLoading } = useCategories();
  const [active, setActive] = useState(0);

  const categories = useMemo(() => {
    if (!dbCategories || dbCategories.length === 0) return [];
    return dbCategories.map((c: Category, i: number) => ({
      index: String(i + 1).padStart(2, "0"),
      title: c.title,
      slug: c.slug,
      to: "/teklif",
      desc: c.description || "Profesyonel endüstriyel çözümler.",
      count: "Geniş ürün yelpazesi",
      image: c.image_url || "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80",
      sub: [],
      id: c.id
    }));
  }, [dbCategories]);

  if (isLoading || categories.length === 0) {
    return (
      <section className="relative text-white overflow-hidden min-h-[400px] flex items-center justify-center" style={{ backgroundColor: "var(--public-navy-950)" }}>
        <div className="absolute inset-0 pub-blueprint opacity-60 pointer-events-none" aria-hidden />
        {isLoading ? <div className="py-20 text-center text-white/50">Yükleniyor...</div> : null}
      </section>
    );
  }

  return <CategoryExplorerContent categories={categories} active={active} setActive={setActive} />;
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
