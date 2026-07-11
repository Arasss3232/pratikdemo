import { Link } from "@tanstack/react-router";
import { memo, useEffect, useRef, useState, type ReactNode } from "react";
import { NAV_LINKS } from "../data/nav";
import { PageHero } from "./marketing/PageHero";
import { buttonStyles } from "../lib/button-styles";
import { useAuth } from "@/hooks/use-auth";
import { useSiteSettings } from "@/hooks/use-site-settings";

function BrandWordmark({
  logoUrl,
  companyName,
  size = "md",
}: {
  logoUrl?: string | null;
  companyName?: string | null;
  size?: "md" | "lg";
}) {
  if (logoUrl) {
    return (
      <img
        alt={companyName || "Pratik"}
        src={logoUrl}
        className={size === "lg" ? "h-12 w-auto object-contain" : "h-9 md:h-10 w-auto object-contain"}
        decoding="async"
      />
    );
  }
  const name = (companyName || "Pratik").trim();
  const parts = name.split(/\s+/);
  const head = parts[0] ?? name;
  const tail = parts.slice(1).join(" ");
  const headSize = size === "lg" ? "text-[30px]" : "text-[22px] md:text-[26px]";
  return (
    <span
      className={`inline-flex items-baseline gap-2 leading-none text-white ${headSize}`}
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        letterSpacing: "0.02em",
        textTransform: "uppercase",
      }}
    >
      <span
        aria-hidden
        className="inline-block"
        style={{
          width: "8px",
          height: size === "lg" ? "28px" : "22px",
          backgroundColor: "var(--public-yellow-500)",
        }}
      />
      <span>{head}</span>
      {tail && (
        <span style={{ color: "var(--public-yellow-500)", fontWeight: 600 }}>{tail}</span>
      )}
    </span>
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
    const onScroll = () => setScrolled(window.scrollY > 12);
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
    <>
    <header
      className="sticky top-0 z-50 w-full transition-all duration-300 text-white"
      style={{
        backgroundColor: scrolled ? "var(--public-navy-950)" : "var(--public-navy-900)",
        boxShadow: scrolled ? "0 1px 0 rgba(245,196,0,0.35), 0 12px 28px -20px rgba(0,0,0,0.6)" : "none",
        borderBottom: scrolled ? "0" : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Utility strip — desktop only */}
      <div
        className="hidden md:block"
        style={{ backgroundColor: "var(--public-navy-950)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-max-width mx-auto px-margin-desktop py-2 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.16em] text-white/60">
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
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
        <div
          className="grid grid-cols-[auto_1fr_auto] items-center gap-6 transition-all duration-300"
          style={{ height: scrolled ? "64px" : "84px" }}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" aria-label={`${settings.company_name || "Pratik"} ana sayfa`}>
            <BrandWordmark logoUrl={settings.logo_url} companyName={settings.company_name} />
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
                className="hidden md:inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--public-yellow-500)]"
                aria-label="Yönetim paneli"
                title="Yönetim"
              >
                <Icon name="admin_panel_settings" aria-hidden="true" />
              </Link>
            )}
            <Link
              to="/giris"
              className="hidden md:inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--public-yellow-500)]"
              aria-label="Bayi girişi"
            >
              <Icon name="account_circle" aria-hidden="true" />
            </Link>
            <Link
              to="/teklif-sepeti"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--public-yellow-500)]"
              aria-label="Teklif sepeti"
            >
              <Icon name="shopping_cart" aria-hidden="true" />
            </Link>
            <Link
              to="/teklif"
              className="pub-btn pub-btn-primary pub-btn-sm hidden sm:inline-flex ml-2"
            >
              Teklif Talep Et
              <Icon name="arrow_forward" className="text-[16px]" aria-hidden="true" />
            </Link>
            <button
              type="button"
              className="lg:hidden text-white min-h-11 min-w-11 inline-flex items-center justify-center rounded-sm hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--public-yellow-500)] transition-colors"
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

      {/* Mobile drawer — rendered outside <header> so backdrop-blur ancestor doesn't break fixed positioning */}
      {menuOpen && (
        <div
          id="mobile-nav"
          className="lg:hidden fixed top-16 right-0 bottom-0 left-0 z-40 overflow-y-auto text-white"
          style={{ backgroundColor: "var(--public-navy-950)" }}
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
                className="flex items-center justify-between py-4 px-2 text-[16px] font-semibold text-white/90 border-b border-white/10 hover:text-[var(--public-yellow-500)] transition-colors"
                activeOptions={{ exact: true }}
                activeProps={{
                  className: "flex items-center justify-between py-4 px-2 text-[16px] font-semibold text-[var(--public-yellow-500)] border-b border-white/10",
                }}
              >
                {l.label}
                <Icon name="chevron_right" className="text-[20px] text-white/40" aria-hidden="true" />
              </Link>
            ))}

            {/* Products expandable */}
            <div className="border-b border-white/10">
              <button
                type="button"
                onClick={() => setMobileProductsOpen((v) => !v)}
                className="w-full flex items-center justify-between py-4 px-2 text-[16px] font-semibold text-white/90 hover:text-[var(--public-yellow-500)] transition-colors"
                aria-expanded={mobileProductsOpen}
              >
                Ürünler
                <Icon
                  name="expand_more"
                  className={`text-[20px] text-white/40 transition-transform ${mobileProductsOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              {mobileProductsOpen && (
                <ul className="pb-3 pl-2">
                  <li>
                    <Link
                      to="/urunler"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 py-2.5 text-[14px] font-semibold"
                      style={{ color: "var(--public-yellow-500)" }}
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
                        className="flex items-baseline gap-3 py-2.5 text-[14px] text-white/80 hover:text-[var(--public-yellow-500)] transition-colors"
                      >
                        <span className="pub-mono tabular-nums w-6" style={{ color: "var(--public-yellow-500)" }}>{g.code}</span>
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
                  className="flex flex-col items-start gap-1 border border-white/15 rounded-sm p-4 hover:border-[var(--public-yellow-500)] transition-colors"
                >
                  <Icon name="call" className="text-[20px]" style={{ color: "var(--public-yellow-500)" }} aria-hidden="true" />
                  <span className="pub-mono text-white/60">Telefon</span>
                  <span className="text-[13px] font-semibold text-white">{phone}</span>
                </a>
              )}
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-start gap-1 border border-white/15 rounded-sm p-4 hover:border-[var(--public-yellow-500)] transition-colors"
                >
                  <Icon name="chat" className="text-[20px]" style={{ color: "var(--public-yellow-500)" }} aria-hidden="true" />
                  <span className="pub-mono text-white/60">WhatsApp</span>
                  <span className="text-[13px] font-semibold text-white">Yaz</span>
                </a>
              )}
            </div>

            <Link
              to="/teklif"
              onClick={() => setMenuOpen(false)}
              className="pub-btn pub-btn-primary mt-4 w-full"
            >
              Teklif Talep Et
              <Icon name="arrow_forward" className="text-[16px]" aria-hidden="true" />
            </Link>

            <div className="mt-4 flex items-center gap-3">
              <Link
                to="/giris"
                onClick={() => setMenuOpen(false)}
                className="pub-btn pub-btn-outline-light pub-btn-sm flex-1"
              >
                <Icon name="account_circle" className="text-[18px]" aria-hidden="true" />
                Bayi Girişi
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="pub-btn pub-btn-outline-light pub-btn-sm"
                  aria-label="Yönetim paneli"
                >
                  <Icon name="admin_panel_settings" className="text-[18px]" aria-hidden="true" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function SiteFooter() {
  const settings = useSiteSettings();
  const currentYear = new Date().getFullYear();
  const address = settings.address;
  const phone = settings.phone;
  const email = settings.email;
  const hours = settings.working_hours || "Pzt – Cmt · 08:30 – 18:00";

  const productCols = PRODUCT_GROUPS;
  const corporateLinks = [
    { to: "/kurumsal", label: "Hakkımızda" },
    { to: "/hizmetler", label: "Hizmetlerimiz" },
    { to: "/referanslar", label: "Referanslar" },
    { to: "/markalar", label: "Markalar" },
    { to: "/blog", label: "Bilgi Merkezi" },
    { to: "/kariyer", label: "Kariyer" },
  ] as const;
  const legalLinks = [
    { to: "/kvkk", label: "KVKK ve Gizlilik" },
    { to: "/kvkk", label: "Çerez Politikası" },
    { to: "/iletisim", label: "İletişim" },
  ] as const;

  return (
    <footer
      className="text-inverse-on-surface"
      style={{ background: "var(--public-navy-950)", borderTop: "3px solid var(--public-yellow-500)" }}
    >
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Brand & summary */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <Link to="/" className="inline-flex items-center gap-2" aria-label="Pratik ana sayfa">
              <img
                alt="Pratik logosu"
                className="h-12 object-contain"
                src={FOOTER_LOGO_URL}
                width={140}
                height={48}
                loading="lazy"
                decoding="async"
              />
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
            <h3 className="hp-mono text-[11px] uppercase tracking-widest text-secondary mb-5">Ürün Grupları</h3>
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
              <h3 className="hp-mono text-[11px] uppercase tracking-widest text-secondary mb-5">Kurumsal</h3>
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
              <h3 className="hp-mono text-[11px] uppercase tracking-widest text-secondary mb-5">Yasal</h3>
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
          <p className="hp-mono text-[11px] uppercase tracking-widest text-white/50">Endüstriyel Donanım · Kurumsal Tedarik</p>
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