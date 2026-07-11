import { Link } from "@tanstack/react-router";
import { memo, useEffect, useRef, useState, type ReactNode } from "react";
import { NAV_LINKS } from "../data/nav";
import { PageHero } from "./marketing/PageHero";
import { buttonStyles } from "../lib/button-styles";
import { useAuth } from "@/hooks/use-auth";
import { useSiteSettings } from "@/hooks/use-site-settings";

const LOGO_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBJVJBnu0BLWG7iyyazFpPt8YOm9fdpRNuJ8XdtGUj0Q_PDfAxCwRPq_5cxeOP-ojfJTaxziV1qQ_xbLr9bQiocUT6afPXyAYd9vkb6OVXCPGB2uCqnbBnuad6WQGuJ2rTqoWLPrkWECkB7jgp8zXDdApWW8Lxe8X78wrIlLydLrOQPFJ5ODCdsP1wTtSD9fiNs23wJ_b--Wpdj1FckmPJ3a-n1N0Zvg4Y-bn90rbAV6zG6OZVTb3KpTtW4-JaHz3pAeg";
const FOOTER_LOGO_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCbDq0vERbuBQdplgYRumJoOnWe12cbW670-pZusxuQqXz1j9tHKlNvmmHcVVfe8TxuQkBrM_JttsIA93nURyWU1tcjTXK46gR995CqStTHtI05nSFCf_S96HD-i23PLyvtlZ0oTmUM9cVVtpto7QuQYvG2qIqO6rsfC0cQ7aepU3OHS2mE7OmRPv1kRhFxEyT18aU1d5i9mJNoQdxRJ1QQR21qBi2jv1ZyDHqEztehLIuHqW3X2viIRAUMJcLszA6kBw";

function IconBase({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}
export const Icon = memo(IconBase);

// Product taxonomy shown in mega-menu and mobile drawer.
const PRODUCT_GROUPS = [
  { code: "01", to: "/urunler/elektrikli-el-aletleri", title: "Elektrikli El Aletleri", desc: "Matkap, taşlama, vidalama, kırıcı." },
  { code: "02", to: "/urunler/el-aletleri", title: "El Aletleri", desc: "Anahtar takımları, tornavida, pense." },
  { code: "03", to: "/urunler/baglanti-elemanlari", title: "Bağlantı Elemanları", desc: "Cıvata, somun, pul, özel bağlantı." },
  { code: "04", to: "/urunler/kkd", title: "Kişisel Koruyucu Donanım", desc: "İş güvenliği ekipmanları." },
  { code: "05", to: "/urunler/endustriyel-makineler", title: "Endüstriyel Makineler", desc: "Kompresör, jeneratör, atölye." },
  { code: "06", to: "/urunler/sarf-malzemeleri", title: "Sarf Malzemeleri", desc: "Kesme, taşlama diski, sarf." },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const megaTimeout = useRef<number | null>(null);
  const { isAdmin } = useAuth();
  const settings = useSiteSettings();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);
  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMegaOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [megaOpen]);

  const openMega = () => {
    if (megaTimeout.current) window.clearTimeout(megaTimeout.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    if (megaTimeout.current) window.clearTimeout(megaTimeout.current);
    megaTimeout.current = window.setTimeout(() => setMegaOpen(false), 120);
  };

  const phone = settings.phone;
  const whatsapp = settings.whatsapp;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-[0_1px_0_rgba(21,32,51,0.06),0_8px_24px_-16px_rgba(8,24,44,0.18)]"
          : "bg-background/80 backdrop-blur-sm"
      }`}
    >
      {/* Utility strip — desktop only, compact */}
      <div className="hidden md:block border-b border-outline-variant/60">
        <div className="max-w-max-width mx-auto px-margin-desktop py-2 flex items-center justify-between text-[12px] font-mono uppercase tracking-[0.12em] text-on-surface-variant">
          <div className="flex items-center gap-6">
            {settings.working_hours && (
              <span className="inline-flex items-center gap-2">
                <Icon name="schedule" className="text-[14px] text-primary" aria-hidden="true" />
                {settings.working_hours}
              </span>
            )}
            {settings.address && (
              <span className="inline-flex items-center gap-2">
                <Icon name="location_on" className="text-[14px] text-primary" aria-hidden="true" />
                {settings.address}
              </span>
            )}
          </div>
          <div className="flex items-center gap-5">
            {phone && (
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 hover:text-primary transition-colors">
                <Icon name="call" className="text-[14px] text-primary" aria-hidden="true" />
                {phone}
              </a>
            )}
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Icon name="chat" className="text-[14px] text-primary" aria-hidden="true" />
                WhatsApp
              </a>
            )}
            <Link to="/teklif" className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 font-semibold">
              Teklif Talep Et
              <Icon name="arrow_forward" className="text-[14px]" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main header row */}
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6 h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" aria-label="Pratik ana sayfa">
            <img
              alt="Pratik"
              src={LOGO_URL}
              width={132}
              height={44}
              className="h-9 md:h-11 w-auto object-contain"
              decoding="async"
            />
          </Link>

          {/* Center nav — desktop */}
          <nav className="hidden lg:flex items-center justify-center gap-1" aria-label="Ana menü">
            {NAV_LINKS.filter((l) => l.to !== "/").map((l) =>
              l.to === "/urunler" ? (
                <div
                  key={l.to}
                  className="relative"
                  onMouseEnter={openMega}
                  onMouseLeave={closeMega}
                >
                  <Link
                    to={l.to}
                    onFocus={openMega}
                    onBlur={closeMega}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-[14px] font-semibold text-on-background hover:text-primary transition-colors"
                    activeProps={{ className: "inline-flex items-center gap-1.5 px-3 py-2 text-[14px] font-semibold text-primary" }}
                    aria-expanded={megaOpen}
                    aria-haspopup="true"
                  >
                    {l.label}
                    <Icon
                      name="expand_more"
                      className={`text-[16px] transition-transform ${megaOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              ) : (
                <Link
                  key={l.to}
                  to={l.to}
                  className="px-3 py-2 text-[14px] font-semibold text-on-background hover:text-primary transition-colors relative"
                  activeOptions={{ exact: true }}
                  activeProps={{
                    className:
                      "px-3 py-2 text-[14px] font-semibold text-primary relative after:content-[''] after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-0.5 after:bg-secondary",
                  }}
                >
                  {l.label}
                </Link>
              ),
            )}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1 md:gap-2 justify-end">
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden md:inline-flex min-h-11 min-w-11 items-center justify-center rounded text-on-background hover:bg-surface-container hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label="Yönetim paneli"
                title="Yönetim"
              >
                <Icon name="admin_panel_settings" aria-hidden="true" />
              </Link>
            )}
            <Link
              to="/giris"
              className="hidden md:inline-flex min-h-11 min-w-11 items-center justify-center rounded text-on-background hover:bg-surface-container hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label="Bayi girişi"
            >
              <Icon name="account_circle" aria-hidden="true" />
            </Link>
            <Link
              to="/teklif-sepeti"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded text-on-background hover:bg-surface-container hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label="Teklif sepeti"
            >
              <Icon name="shopping_cart" aria-hidden="true" />
            </Link>
            <Link
              to="/teklif"
              className="hidden sm:inline-flex items-center gap-2 bg-secondary text-on-secondary hover:bg-secondary-container transition-colors px-4 py-2.5 text-[13px] font-semibold uppercase tracking-[0.08em] rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Teklif Al
              <Icon name="arrow_forward" className="text-[16px]" aria-hidden="true" />
            </Link>
            <button
              type="button"
              className="lg:hidden text-on-background min-h-11 min-w-11 inline-flex items-center justify-center rounded hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
              aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <Icon name={menuOpen ? "close" : "menu"} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mega menu — desktop */}
        {megaOpen && (
          <div
            className="hidden lg:block absolute left-0 right-0 top-full bg-background border-t border-outline-variant shadow-[0_24px_48px_-24px_rgba(8,24,44,0.25)]"
            onMouseEnter={openMega}
            onMouseLeave={closeMega}
            role="menu"
          >
            <div className="max-w-max-width mx-auto px-margin-desktop py-10 grid grid-cols-[240px_1fr] gap-12">
              <div>
                <div className="hp-mono text-[11px] uppercase tracking-[0.18em] text-on-surface-variant mb-3">
                  02 / Ürün Grupları
                </div>
                <h3 className="font-display text-[28px] leading-tight font-semibold text-on-background mb-4">
                  Tedarik zincirinizin her katmanı için.
                </h3>
                <p className="text-[14px] text-on-surface-variant leading-relaxed mb-5">
                  Yetkili distribütör kanalları ve doğrudan üretici tedariğiyle tek noktadan sipariş.
                </p>
                <Link
                  to="/urunler"
                  onClick={() => setMegaOpen(false)}
                  className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-primary hover:text-primary/80"
                >
                  Tüm ürün gruplarını gör
                  <Icon name="arrow_forward" className="text-[16px]" aria-hidden="true" />
                </Link>
              </div>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-1" role="none">
                {PRODUCT_GROUPS.map((g) => (
                  <li key={g.to} role="none">
                    <Link
                      to={g.to}
                      role="menuitem"
                      onClick={() => setMegaOpen(false)}
                      className="group flex items-start gap-4 py-3 px-3 -mx-3 rounded-sm hover:bg-surface-container transition-colors"
                    >
                      <span className="hp-mono text-[11px] text-on-surface-variant pt-1.5 tabular-nums">{g.code}</span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[15px] font-semibold text-on-background group-hover:text-primary transition-colors">
                          {g.title}
                        </span>
                        <span className="block text-[13px] text-on-surface-variant mt-0.5">{g.desc}</span>
                      </span>
                      <Icon
                        name="north_east"
                        className="text-[16px] text-outline group-hover:text-secondary transition-colors mt-1.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          id="mobile-nav"
          className="lg:hidden fixed top-16 right-0 bottom-0 left-0 z-40 bg-background overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Site menüsü"
        >
          <div className="px-margin-mobile py-6 flex flex-col gap-1">
            {NAV_LINKS.filter((l) => l.to !== "/urunler").map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between py-3.5 px-2 text-[16px] font-semibold text-on-background border-b border-outline-variant hover:text-primary transition-colors"
                activeOptions={{ exact: true }}
                activeProps={{
                  className: "flex items-center justify-between py-3.5 px-2 text-[16px] font-semibold text-primary border-b border-outline-variant",
                }}
              >
                {l.label}
                <Icon name="chevron_right" className="text-[20px] text-outline" aria-hidden="true" />
              </Link>
            ))}

            {/* Products expandable */}
            <div className="border-b border-outline-variant">
              <button
                type="button"
                onClick={() => setMobileProductsOpen((v) => !v)}
                className="w-full flex items-center justify-between py-3.5 px-2 text-[16px] font-semibold text-on-background hover:text-primary transition-colors"
                aria-expanded={mobileProductsOpen}
              >
                Ürünler
                <Icon
                  name="expand_more"
                  className={`text-[20px] text-outline transition-transform ${mobileProductsOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              {mobileProductsOpen && (
                <ul className="pb-3 pl-2">
                  <li>
                    <Link
                      to="/urunler"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 py-2.5 text-[14px] font-semibold text-primary"
                    >
                      Tüm ürün grupları
                      <Icon name="arrow_forward" className="text-[16px]" aria-hidden="true" />
                    </Link>
                  </li>
                  {PRODUCT_GROUPS.map((g) => (
                    <li key={g.to}>
                      <Link
                        to={g.to}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-baseline gap-3 py-2.5 text-[14px] text-on-background hover:text-primary transition-colors"
                      >
                        <span className="hp-mono text-[11px] text-on-surface-variant tabular-nums w-6">{g.code}</span>
                        <span>{g.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Contact actions */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex flex-col items-start gap-1 border border-outline-variant rounded-sm p-4 hover:border-primary transition-colors"
                >
                  <Icon name="call" className="text-[20px] text-primary" aria-hidden="true" />
                  <span className="hp-mono text-[10px] uppercase tracking-[0.14em] text-on-surface-variant">Telefon</span>
                  <span className="text-[13px] font-semibold text-on-background">{phone}</span>
                </a>
              )}
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-start gap-1 border border-outline-variant rounded-sm p-4 hover:border-primary transition-colors"
                >
                  <Icon name="chat" className="text-[20px] text-primary" aria-hidden="true" />
                  <span className="hp-mono text-[10px] uppercase tracking-[0.14em] text-on-surface-variant">WhatsApp</span>
                  <span className="text-[13px] font-semibold text-on-background">Yaz</span>
                </a>
              )}
            </div>

            <Link
              to="/teklif"
              onClick={() => setMenuOpen(false)}
              className="mt-4 inline-flex items-center justify-center gap-2 bg-secondary text-on-secondary hover:bg-secondary-container transition-colors px-4 py-3.5 text-[14px] font-semibold uppercase tracking-[0.08em] rounded-sm"
            >
              Teklif Talep Et
              <Icon name="arrow_forward" className="text-[16px]" aria-hidden="true" />
            </Link>

            <div className="mt-4 flex items-center gap-3">
              <Link
                to="/giris"
                onClick={() => setMenuOpen(false)}
                className="flex-1 inline-flex items-center justify-center gap-2 border border-outline-variant text-on-background px-4 py-3 text-[13px] font-semibold rounded-sm hover:border-primary hover:text-primary transition-colors"
              >
                <Icon name="account_circle" className="text-[18px]" aria-hidden="true" />
                Bayi Girişi
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2 border border-outline-variant text-on-background px-4 py-3 text-[13px] font-semibold rounded-sm hover:border-primary hover:text-primary transition-colors"
                  aria-label="Yönetim paneli"
                >
                  <Icon name="admin_panel_settings" className="text-[18px]" aria-hidden="true" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-tertiary border-t-4 border-secondary w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="col-span-1 md:col-span-4 mb-8">
          <Link
            to="/"
            className="text-headline-md font-headline-md text-on-tertiary flex items-center gap-2"
          >
            <img alt="Pratik Logo" className="h-12 object-contain" src={FOOTER_LOGO_URL} width={140} height={48} loading="lazy" decoding="async" />
          </Link>
        </div>
        <div className="col-span-1 flex flex-col gap-4">
          <Link
            to="/"
            className="font-body-sm text-body-sm text-on-tertiary opacity-70 hover:opacity-100 transition-opacity block"
          >
            Ürün Grupları
          </Link>
          <Link
            to="/teknik-destek"
            className="font-body-sm text-body-sm text-on-tertiary opacity-70 hover:opacity-100 transition-opacity block"
          >
            Teknik Destek
          </Link>
        </div>
        <div className="col-span-1 flex flex-col gap-4">
          <Link
            to="/sektorel"
            className="font-body-sm text-body-sm text-on-tertiary opacity-70 hover:opacity-100 transition-opacity block"
          >
            Sektörel Çözümler
          </Link>
          <Link
            to="/kurumsal"
            className="font-body-sm text-body-sm text-on-tertiary opacity-70 hover:opacity-100 transition-opacity block"
          >
            Kurumsal Bilgiler
          </Link>
        </div>
        <div className="col-span-1 flex flex-col gap-4">
          <Link
            to="/kvkk"
            className="font-body-sm text-body-sm text-on-tertiary opacity-70 hover:opacity-100 transition-opacity block"
          >
            KVKK ve Gizlilik
          </Link>
          <Link
            to="/iletisim"
            className="font-body-sm text-body-sm text-on-tertiary opacity-70 hover:opacity-100 transition-opacity block"
          >
            Bize Ulaşın
          </Link>
        </div>
        <div className="col-span-1 md:col-span-4 mt-8 pt-8 border-t border-outline/30 text-center">
          <p className="font-body-sm text-body-sm text-on-tertiary opacity-70">
            © 2024 Pratik Professional Industrial Hardware Solutions. Tüm Hakları Saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-surface font-body-md text-on-background antialiased selection:bg-primary selection:text-white flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PagePlaceholder({
  title,
  crumb,
  description,
  children,
}: {
  title: string;
  crumb: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <>
      <PageHero
        title={title}
        description={description}
        breadcrumb={[{ label: "Ana Sayfa", to: "/" }, { label: crumb }]}
      />
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20">
        {children ?? (
          <div className="bg-surface-container-lowest border border-outline-variant p-8 md:p-12 text-center">
            <Icon name="engineering" className="text-[48px] text-primary mb-4" />
            <h2 className="font-headline-lg text-headline-lg text-on-background mb-2">
              Bu sayfa hazırlanıyor
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6 max-w-xl mx-auto">
              İçerik kısa süre içinde yayınlanacaktır. Bu arada ürün kataloğumuzu inceleyebilir
              veya bizimle iletişime geçebilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link to="/" className={buttonStyles({ variant: "primary", size: "sm" })}>
                <Icon name="arrow_back" className="text-[16px]" />
                Ürünlere Dön
              </Link>
              <Link
                to="/iletisim"
                className={buttonStyles({ variant: "outline-dark", size: "sm" })}
              >
                <Icon name="mail" className="text-[16px]" />
                İletişime Geç
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}