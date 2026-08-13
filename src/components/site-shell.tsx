import { Link } from "@tanstack/react-router";
import { memo, useEffect, useRef, useState, type ReactNode } from "react";
import { NAV_LINKS } from "../data/nav";
import { PageHero } from "./marketing/PageHero";
import { buttonStyles } from "../lib/button-styles";
import { useAuth } from "@/hooks/use-auth";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useNavigation } from "@/hooks/use-navigation";
import pratikLogo from "@/assets/pratik-logo.asset.json";


function BrandWordmark({
  logoUrl,
  companyName,
  size = "md",
}: {
  logoUrl?: string | null;
  companyName?: string | null;
  size?: "md" | "lg";
}) {
  const src = logoUrl || pratikLogo.url;
  const height = size === "lg" ? "h-11 md:h-12" : "h-9 md:h-10";
  return (
    <img
      alt={companyName || "Pratik"}
      src={src}
      className={`${height} w-auto object-contain block rounded-md`}
      decoding="async"
    />
  );
}

function IconBase({
  name,
  className = "",
  style,
}: {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span className={`material-symbols-outlined ${className}`} style={style}>
      {name}
    </span>
  );
}
export const Icon = memo(IconBase);

// Product taxonomy shown in mega-menu and mobile drawer.
const PRODUCT_GROUPS = [
  { code: "01", to: "/urunler", title: "Elektrikli El Aletleri", desc: "Matkap, taşlama, vidalama, kırıcı." },
  { code: "02", to: "/urunler", title: "El Aletleri", desc: "Anahtar takımları, tornavida, pense." },
  { code: "03", to: "/urunler", title: "Bağlantı Elemanları", desc: "Cıvata, somun, pul, özel bağlantı." },
  { code: "04", to: "/urunler", title: "Kişisel Koruyucu Donanım", desc: "İş güvenliği ekipmanları." },
  { code: "05", to: "/urunler", title: "Endüstriyel Makineler", desc: "Kompresör, jeneratör, atölye." },
  { code: "06", to: "/urunler", title: "Sarf Malzemeleri", desc: "Kesme, taşlama diski, sarf." },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const megaTimeout = useRef<number | null>(null);
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const { isAdmin } = useAuth();
  const { settings: rawSettings } = useSiteSettings();
  const settings = rawSettings || {} as any;
  const { items: dynamicNav } = useNavigation();
  const navLinks = dynamicNav.length > 0 ? dynamicNav.map(i => ({ label: i.label, to: i.route })) : NAV_LINKS;


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (e.key !== "Tab" || !drawerRef.current) return;
      const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    // move focus into the drawer
    const t = window.setTimeout(() => {
      const firstLink = drawerRef.current?.querySelector<HTMLElement>('a[href], button:not([disabled])');
      firstLink?.focus();
    }, 40);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      // restore focus to trigger
      menuBtnRef.current?.focus();
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

  const waHref = whatsapp ? `https://wa.me/${whatsapp.replace(/[^\d]/g, "")}` : undefined;
  const telHref = phone ? `tel:${phone.replace(/\s/g, "")}` : undefined;

  return (
    <>
    <header
      className="sticky top-0 z-50 w-full transition-all duration-300 text-white"
      style={{
        backgroundColor: scrolled ? "var(--public-navy-950)" : "var(--public-navy-900)",
        boxShadow: scrolled ? "0 1px 0 rgba(245,196,0,0.35), 0 12px 28px -20px rgba(0,0,0,0.6)" : "none",
        borderBottom: scrolled ? "0" : "1px solid rgba(255,255,255,0.06)",
        paddingTop: "env(safe-area-inset-top)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
        fontFamily: 'var(--font-body, "Manrope", "Segoe UI", Arial, sans-serif)',
      }}
    >
      {/* Mobile compact utility strip */}
      <div
        className="md:hidden"
        style={{
          backgroundColor: "var(--public-navy-950)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="px-4 py-1.5 flex items-center justify-between text-[11px] text-white/70">
          {telHref ? (
            <a href={telHref} className="inline-flex items-center gap-1.5 min-h-[28px] font-medium hover:text-white transition-colors truncate">
              <Icon name="call" className="text-[13px]" style={{ color: "var(--public-yellow-500)" }} aria-hidden="true" />
              <span className="truncate">{phone}</span>
            </a>
          ) : (
            <div className="min-h-[28px]" />
          )}

          <div className="flex items-center gap-3 shrink-0">
            {waHref && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp ile yaz"
                className="inline-flex items-center gap-1 min-h-[28px] font-medium hover:text-white transition-colors"
              >
                <Icon name="chat" className="text-[13px]" style={{ color: "var(--public-yellow-500)" }} aria-hidden="true" />
                WhatsApp
              </a>
            )}
            <Link
              to="/teklif"
              className="inline-flex items-center gap-1 min-h-[28px] font-semibold"
              style={{ color: "var(--public-yellow-500)" }}
            >
              Teklif Al
              <Icon name="arrow_forward" className="text-[13px]" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* Utility strip — desktop only */}
      <div
        className="hidden md:block"
        style={{ backgroundColor: "var(--public-navy-950)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-max-width mx-auto px-margin-desktop py-2 flex items-center justify-between text-[12.5px] font-medium tracking-normal text-white/75">
          <div className="flex items-center gap-6">
            {settings.working_hours && (
              <span className="inline-flex items-center gap-2">
                <Icon name="schedule" className="text-[14px]" style={{ color: "var(--public-yellow-500)" }} aria-hidden="true" />
                {settings.working_hours}
              </span>
            )}
            {settings.address && (
              <span className="inline-flex items-center gap-2">
                <Icon name="location_on" className="text-[14px]" style={{ color: "var(--public-yellow-500)" }} aria-hidden="true" />
                {settings.address}
              </span>
            )}
          </div>
          <div className="flex items-center gap-5">
            {phone && (
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 hover:text-white transition-colors">
                <Icon name="call" className="text-[14px]" style={{ color: "var(--public-yellow-500)" }} aria-hidden="true" />
                {phone}
              </a>
            )}
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-white transition-colors"
              >
                <Icon name="chat" className="text-[14px]" style={{ color: "var(--public-yellow-500)" }} aria-hidden="true" />
                WhatsApp
              </a>
            )}
            <Link to="/teklif" className="inline-flex items-center gap-1.5 font-semibold hover:opacity-90" style={{ color: "var(--public-yellow-500)" }}>
              Teklif Talep Et
              <Icon name="arrow_forward" className="text-[14px]" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main header row */}
      <div className="max-w-max-width mx-auto px-4 md:px-margin-desktop">
        <div
          className="grid grid-cols-[minmax(0,auto)_1fr_auto] items-center gap-3 md:gap-6 transition-[height] duration-300"
          style={{ height: scrolled ? "58px" : "64px" }}
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center min-w-0 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--public-yellow-500)] rounded-sm"
            aria-label={`${settings.company_name || "Pratik"} ana sayfa`}
          >
            <BrandWordmark
              logoUrl={settings.mobile_logo_url || settings.logo_url}
              companyName={settings.company_name}
              size={scrolled ? "md" : "lg"}
            />
          </Link>

          {/* Center nav — desktop */}
          <nav className="hidden lg:flex items-center justify-center gap-1" aria-label="Ana menü">
            {navLinks.filter((l) => l.to !== "/").map((l) =>
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
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-[14px] font-semibold text-white/85 hover:text-white transition-colors relative"
                    activeProps={{
                      className:
                        "inline-flex items-center gap-1.5 px-4 py-2 text-[14px] font-semibold text-white relative after:content-[''] after:absolute after:left-4 after:right-4 after:-bottom-1 after:h-[2px] after:bg-[var(--public-yellow-500)]",
                    }}
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
                  className="px-4 py-2 text-[14px] font-semibold text-white/85 hover:text-white transition-colors relative"
                  activeOptions={{ exact: true }}
                  activeProps={{
                    className:
                      "px-4 py-2 text-[14px] font-semibold text-white relative after:content-[''] after:absolute after:left-4 after:right-4 after:-bottom-1 after:h-[2px] after:bg-[var(--public-yellow-500)]",
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
                search={{
                  tab: "dashboard",
                  seoTab: "dashboard",
                }}
                className="hidden md:inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--public-yellow-500)]"
                aria-label="Yönetim paneli"
                title="Yönetim"
              >
                <Icon name="admin_panel_settings" aria-hidden="true" />
              </Link>
            )}
            <span className="hidden lg:inline-flex ml-2">
            <Link
              to="/teklif"
              search={{ categoryId: undefined, category: "Genel" }}
              className="pub-btn pub-btn-primary pub-btn-sm"
            >
              Teklif Talep Et
              <Icon name="arrow_forward" className="text-[16px]" aria-hidden="true" />
            </Link>
            </span>
            <button
              ref={menuBtnRef}
              type="button"
              className="lg:hidden text-white min-h-11 min-w-11 inline-flex items-center justify-center rounded-sm border border-white/15 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--public-yellow-500)] transition-colors ml-1"
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
            className="hidden lg:block absolute left-0 right-0 top-full text-white shadow-[0_28px_48px_-16px_rgba(0,0,0,0.55)]"
            style={{
              backgroundColor: "var(--public-navy-950)",
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
            onMouseEnter={openMega}
            onMouseLeave={closeMega}
            role="menu"
          >
            <div className="max-w-max-width mx-auto px-margin-desktop py-10 grid grid-cols-[240px_1fr] gap-12">
              <div>
                <span className="pub-marker mb-4">02 / Ürün Grupları</span>
                <h3 className="pub-h3 mt-4 mb-4 text-white">
                  Tedarik zincirinizin her katmanı için.
                </h3>
                <p className="text-[14px] text-white/70 leading-relaxed mb-5">
                  Yetkili distribütör kanalları ve doğrudan üretici tedariğiyle tek noktadan sipariş.
                </p>
                <Link
                  to="/urunler"
                  onClick={() => setMegaOpen(false)}
                  className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] hover:opacity-80"
                  style={{ color: "var(--public-yellow-500)" }}
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
                      className="group flex items-start gap-4 py-3 px-3 -mx-3 rounded-sm hover:bg-white/5 transition-colors"
                    >
                      <span className="pub-mono pt-2 tabular-nums" style={{ color: "var(--public-yellow-500)" }}>{g.code}</span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[15px] font-semibold text-white group-hover:text-[var(--public-yellow-500)] transition-colors">
                          {g.title}
                        </span>
                        <span className="block text-[13px] text-white/60 mt-0.5">{g.desc}</span>
                      </span>
                      <Icon
                        name="north_east"
                        className="text-[16px] text-white/40 group-hover:text-[var(--public-yellow-500)] transition-colors mt-1.5"
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
    </header>

      {/* Mobile drawer — full-height, safe-area aware, focus-trapped */}
      {menuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/60 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-150"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            id="mobile-nav"
            ref={drawerRef}
            className="lg:hidden fixed inset-y-0 right-0 z-50 w-full sm:max-w-sm text-white flex flex-col motion-safe:animate-in motion-safe:slide-in-from-right motion-safe:duration-200"
            style={{
              backgroundColor: "var(--public-navy-950)",
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: "env(safe-area-inset-bottom)",
              paddingRight: "env(safe-area-inset-right)",
              fontFamily: 'var(--font-body, "Manrope", "Segoe UI", Arial, sans-serif)',
              boxShadow: "-24px 0 48px -12px rgba(0,0,0,0.6)",
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Site menüsü"
          >
            {/* Drawer header */}
            <div
              className="flex items-center justify-between px-5 h-16 shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Link to="/" onClick={() => setMenuOpen(false)} aria-label={`${settings.company_name || "Pratik"} ana sayfa`}>
                <BrandWordmark
                  logoUrl={settings.mobile_logo_url || settings.logo_url}
                  companyName={settings.company_name}
                  size="md"
                />
              </Link>
              <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-sm border border-white/15 text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--public-yellow-500)]"
                  aria-label="Menüyü kapat"
                >
                  <Icon name="close" aria-hidden="true" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <nav className="px-3 py-4" aria-label="Mobil menü">
                <ul className="flex flex-col">
                  {navLinks.filter((l) => l.to !== "/urunler").map((l) => (
                    <li key={l.to}>
                      <Link
                        to={l.to}
                        onClick={() => setMenuOpen(false)}
                        className="group flex items-center justify-between min-h-[52px] px-3 text-[17px] font-semibold text-white/90 hover:text-[var(--public-yellow-500)] transition-colors relative"
                        activeOptions={{ exact: true }}
                        activeProps={{
                          className:
                            "group flex items-center justify-between min-h-[52px] px-3 text-[17px] font-semibold text-[var(--public-yellow-500)] transition-colors relative before:content-[''] before:absolute before:left-0 before:top-3 before:bottom-3 before:w-[3px] before:bg-[var(--public-yellow-500)]",
                        }}
                      >
                        <span>{l.label}</span>
                        <Icon name="chevron_right" className="text-[20px] text-white/40 group-hover:text-[var(--public-yellow-500)]" aria-hidden="true" />
                      </Link>
                      <div className="h-px bg-white/8" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
                    </li>
                  ))}

                  {/* Products accordion */}
                  <li>
                    <button
                      type="button"
                      onClick={() => setMobileProductsOpen((v) => !v)}
                      className="w-full flex items-center justify-between min-h-[52px] px-3 text-[17px] font-semibold text-white/90 hover:text-[var(--public-yellow-500)] transition-colors"
                      aria-expanded={mobileProductsOpen}
                      aria-controls="mobile-products"
                    >
                      Ürün Grupları
                      <Icon
                        name="expand_more"
                        className={`text-[22px] text-white/50 transition-transform ${mobileProductsOpen ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      />
                    </button>
                    {mobileProductsOpen && (
                      <ul id="mobile-products" className="pb-2">
                        <li>
                          <Link
                            to="/urunler"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center gap-2 min-h-[44px] px-6 text-[14px] font-semibold"
                            style={{ color: "var(--public-yellow-500)" }}
                          >
                            Tüm Ürün Grupları
                            <Icon name="arrow_forward" className="text-[16px]" aria-hidden="true" />
                          </Link>
                        </li>
                        {PRODUCT_GROUPS.map((g) => (
                          <li key={g.to}>
                            <Link
                              to={g.to}
                              onClick={() => setMenuOpen(false)}
                              className="flex items-baseline gap-3 min-h-[44px] px-6 text-[15px] text-white/80 hover:text-[var(--public-yellow-500)] transition-colors"
                            >
                              <span
                                className="font-mono text-[11px] tabular-nums w-6 shrink-0"
                                style={{ color: "var(--public-yellow-500)" }}
                              >
                                {g.code}
                              </span>
                              <span className="min-w-0">{g.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />
                  </li>
                </ul>
              </nav>

              {/* Contact actions */}
              <div className="px-5 pt-4">
                <span className="text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "var(--public-yellow-500)" }}>
                  İletişim
                </span>
                <div className="mt-3 grid grid-cols-1 gap-2">
                  {telHref && (
                    <a
                      href={telHref}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 min-h-[52px] px-4 border border-white/12 rounded-sm hover:border-[var(--public-yellow-500)] transition-colors"
                    >
                      <Icon name="call" className="text-[20px]" style={{ color: "var(--public-yellow-500)" }} aria-hidden="true" />
                      <span className="flex flex-col">
                        <span className="text-[11px] uppercase tracking-wider text-white/50">Telefon</span>
                        <span className="text-[15px] font-semibold text-white truncate">{phone}</span>
                      </span>
                    </a>
                  )}
                  {waHref && (
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 min-h-[52px] px-4 border border-white/12 rounded-sm hover:border-[var(--public-yellow-500)] transition-colors"
                    >
                      <Icon name="chat" className="text-[20px]" style={{ color: "var(--public-yellow-500)" }} aria-hidden="true" />
                      <span className="flex flex-col">
                        <span className="text-[11px] uppercase tracking-wider text-white/50">WhatsApp</span>
                        <span className="text-[15px] font-semibold text-white truncate">{whatsapp}</span>
                      </span>
                    </a>
                  )}
                  {settings.email && (
                    <a
                      href={`mailto:${settings.email}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 min-h-[52px] px-4 border border-white/12 rounded-sm hover:border-[var(--public-yellow-500)] transition-colors"
                    >
                      <Icon name="mail" className="text-[20px]" style={{ color: "var(--public-yellow-500)" }} aria-hidden="true" />
                      <span className="flex flex-col min-w-0">
                        <span className="text-[11px] uppercase tracking-wider text-white/50">E-posta</span>
                        <span className="text-[15px] font-semibold text-white truncate">{settings.email}</span>
                      </span>
                    </a>
                  )}
                  {(settings.working_hours || settings.address) && (
                    <div className="mt-2 space-y-1.5 text-[13px] text-white/60">
                      {settings.working_hours && (
                        <p className="flex items-start gap-2">
                          <Icon name="schedule" className="text-[16px] mt-0.5" style={{ color: "var(--public-yellow-500)" }} aria-hidden="true" />
                          <span>{settings.working_hours}</span>
                        </p>
                      )}
                      {settings.address && (
                        <p className="flex items-start gap-2">
                          <Icon name="location_on" className="text-[16px] mt-0.5" style={{ color: "var(--public-yellow-500)" }} aria-hidden="true" />
                          <span>{settings.address}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="h-6" />
            </div>

            {/* Sticky bottom CTA */}
            <div
              className="shrink-0 px-4 pt-3 pb-4"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.08)",
                backgroundColor: "var(--public-navy-900)",
                paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)",
              }}
            >
              <Link
                to="/teklif"
                search={{ category: "Genel" }}
                onClick={() => setMenuOpen(false)}
                className="pub-btn pub-btn-primary w-full min-h-12"
              >
                Teklif Talep Et
                <Icon name="arrow_forward" className="text-[16px]" aria-hidden="true" />
              </Link>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link
                  to="/giris"
                  onClick={() => setMenuOpen(false)}
                  className="pub-btn pub-btn-outline-light pub-btn-sm w-full min-h-11"
                >
                  <Icon name="account_circle" className="text-[18px]" aria-hidden="true" />
                  Bayi Girişi
                </Link>
                {isAdmin ? (
                  <Link
                          to="/admin"
                          search={{
                            tab: "dashboard",
                            seoTab: "dashboard",
                          }}
                    onClick={() => setMenuOpen(false)}
                    className="pub-btn pub-btn-outline-light pub-btn-sm w-full min-h-11"
                  >
                    <Icon name="admin_panel_settings" className="text-[18px]" aria-hidden="true" />
                    Yönetim
                  </Link>
                ) : (
                  <Link
                    to="/iletisim"
                    onClick={() => setMenuOpen(false)}
                    className="pub-btn pub-btn-outline-light pub-btn-sm w-full min-h-11"
                  >
                    <Icon name="mail" className="text-[18px]" aria-hidden="true" />
                    İletişim
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export function SiteFooter() {
  const { settings: rawSettings } = useSiteSettings();
  const settings = rawSettings || {} as any;
  const currentYear = new Date().getFullYear();
  const address = settings.address;
  const phone = settings.phone;
  const email = settings.email;
  const hours = settings.working_hours || "Pzt – Cmt · 08:30 – 18:00";

  const productCols = PRODUCT_GROUPS;
  const corporateLinks = [
    { to: "/kurumsal", label: "Hakkımızda" },
    { to: "/kataloglar", label: "Kataloglarımız" },
    { to: "/bayiliklerimiz", label: "Bayiliklerimiz" },
    { to: "/iletisim", label: "İletişim" },
  ] as const;
  const legalLinks = [
    { to: "/kvkk", label: "KVKK ve Gizlilik" },
    { to: "/kvkk", label: "Çerez Politikası" },
    { to: "/iletisim", label: "İletişim" },
  ] as const;

  const { items: dynamicNav } = useNavigation();
  const navLinks = dynamicNav.length > 0 ? dynamicNav.map(i => ({ label: i.label, to: i.route })) : NAV_LINKS;

  return (

    <footer
      className="text-inverse-on-surface"
      style={{ background: "var(--public-navy-950)", borderTop: "3px solid var(--public-yellow-500)" }}
    >
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Brand & summary */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <Link to="/" className="inline-flex items-center gap-2" aria-label={`${settings.company_name || "Pratik"} ana sayfa`}>
              <BrandWordmark logoUrl={settings.logo_url} companyName={settings.company_name} size="lg" />
            </Link>
            <p className="text-body-sm font-body-sm text-white/70 max-w-sm">
              Sanayi, inşaat ve teknik servis ekiplerine profesyonel donanım tedariki. Doğru ürün, kurumsal süreç ve
              satış sonrası iletişim.
            </p>
            <div className="mt-2 flex flex-col gap-2 text-body-sm text-white/80">
              {address && (
                <span className="flex items-start gap-2">
                  <Icon name="location_on" className="text-[16px] text-secondary mt-0.5" aria-hidden />
                  <span>{address}</span>
                </span>
              )}
              {phone && (
                <a href={`tel:${phone.replace(/\s+/g, "")}`} className="flex items-center gap-2 hover:text-secondary transition-colors">
                  <Icon name="call" className="text-[16px] text-secondary" aria-hidden />
                  <span>{phone}</span>
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-secondary transition-colors break-all">
                  <Icon name="mail" className="text-[16px] text-secondary" aria-hidden />
                  <span>{email}</span>
                </a>
              )}
              <span className="flex items-center gap-2 text-white/60">
                <Icon name="schedule" className="text-[16px] text-secondary" aria-hidden />
                <span>{hours}</span>
              </span>
            </div>
          </div>

          {/* Product groups */}
          <div className="lg:col-span-4">
            <h3 className="section-label text-secondary mb-5">Ürün Grupları</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {productCols.map((g) => (
                <li key={g.to}>
                  <Link
                    to={g.to}
                    className="group flex items-baseline gap-3 text-white/80 hover:text-secondary transition-colors"
                  >
                    <span className="hp-mono text-[10px] text-white/40 group-hover:text-secondary">{g.code}</span>
                    <span className="text-[14px]">{g.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Corporate + Legal */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div>
              <h3 className="section-label text-secondary mb-5">Kurumsal</h3>
              <ul className="flex flex-col gap-3">
                {corporateLinks.map((l) => (
                  <li key={l.to + l.label}>
                    <Link to={l.to} className="text-[14px] text-white/80 hover:text-secondary transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="section-label text-secondary mb-5">Yasal</h3>
              <ul className="flex flex-col gap-3">
                {legalLinks.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-[14px] text-white/80 hover:text-secondary transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                to="/teklif"
                search={{ category: "Genel" }}
                className={buttonStyles({
                  variant: "primary",
                  size: "sm",
                  className: "mt-6 !bg-secondary !text-on-secondary hover:!bg-secondary-container",
                })}
              >
                Teklif Al
                <Icon name="arrow_forward" aria-hidden />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-body-sm text-white/60">
          <p>© {currentYear} Pratik Endüstriyel. Tüm hakları saklıdır.</p>
          <p className="section-label text-white/50">Endüstriyel Donanım · Kurumsal Tedarik</p>
        </div>

        {settings.agency_attribution_visible && (
          <div className="mt-8 pt-4 border-t border-white/5 flex justify-center">
            <a
              href={settings.agency_attribution_url || "https://www.bilgintek.com"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Bilgintek Yazılım ve Reklam Ajansı web sitesini yeni sekmede aç"
              className="text-[11px] tracking-wide text-white/40 hover:text-[var(--public-yellow-500)] transition-all duration-200 py-2 px-4 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--public-yellow-500)] focus-visible:outline-offset-4 rounded"
            >
              {settings.agency_attribution_text || "Bilgintek Yazılım & Reklam Ajansı | Website Paketleri ile hazırlanmıştır."}
            </a>
          </div>
        )}
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