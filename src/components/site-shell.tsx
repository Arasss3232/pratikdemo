import { Link } from "@tanstack/react-router";
import { memo, useEffect, useState, type ReactNode } from "react";
import { NAV_LINKS } from "../data/nav";
import { PageHero } from "./marketing/PageHero";
import { buttonStyles } from "../lib/button-styles";

const LOGO_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBJVJBnu0BLWG7iyyazFpPt8YOm9fdpRNuJ8XdtGUj0Q_PDfAxCwRPq_5cxeOP-ojfJTaxziV1qQ_xbLr9bQiocUT6afPXyAYd9vkb6OVXCPGB2uCqnbBnuad6WQGuJ2rTqoWLPrkWECkB7jgp8zXDdApWW8Lxe8X78wrIlLydLrOQPFJ5ODCdsP1wTtSD9fiNs23wJ_b--Wpdj1FckmPJ3a-n1N0Zvg4Y-bn90rbAV6zG6OZVTb3KpTtW4-JaHz3pAeg";
const FOOTER_LOGO_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCbDq0vERbuBQdplgYRumJoOnWe12cbW670-pZusxuQqXz1j9tHKlNvmmHcVVfe8TxuQkBrM_JttsIA93nURyWU1tcjTXK46gR995CqStTHtI05nSFCf_S96HD-i23PLyvtlZ0oTmUM9cVVtpto7QuQYvG2qIqO6rsfC0cQ7aepU3OHS2mE7OmRPv1kRhFxEyT18aU1d5i9mJNoQdxRJ1QQR21qBi2jv1ZyDHqEztehLIuHqW3X2viIRAUMJcLszA6kBw";

function IconBase({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}
export const Icon = memo(IconBase);

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`bg-primary border-b-2 border-secondary sticky top-0 z-50 w-full transition-shadow duration-300 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="flex flex-col w-full max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-4 gap-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="font-headline-md text-headline-md font-black text-on-primary flex-shrink-0 flex items-center gap-2"
          >
            <img alt="Pratik Logo" className="h-12 object-contain" src={LOGO_URL} width={140} height={48} decoding="async" />
          </Link>
          <nav className="hidden lg:flex items-center gap-gutter">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-on-primary opacity-80 hover:text-secondary-fixed-dim transition-colors duration-200 px-2 py-1 rounded font-label-bold text-label-bold whitespace-nowrap"
                activeOptions={{ exact: true }}
                activeProps={{
                  className:
                    "text-on-primary font-bold border-b-2 border-on-primary pb-1 opacity-100 px-2 py-1 rounded font-label-bold text-label-bold whitespace-nowrap",
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex relative">
              <Icon
                name="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                aria-hidden="true"
              />
              <label htmlFor="site-search" className="sr-only">
                Ürün ara
              </label>
              <input
                id="site-search"
                className="pl-10 pr-4 py-2 bg-surface-container-lowest text-on-surface border border-outline-variant rounded focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all w-64 text-body-sm font-body-sm"
                placeholder="Ara..."
                type="search"
              />
            </div>
            <div className="flex items-center gap-2 text-on-primary">
              <button
                type="button"
                className="min-h-11 min-w-11 inline-flex items-center justify-center rounded hover:bg-primary-container/40 hover:text-secondary-fixed-dim transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                aria-label="Hesabım"
              >
                <Icon name="account_circle" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="min-h-11 min-w-11 inline-flex items-center justify-center rounded hover:bg-primary-container/40 hover:text-secondary-fixed-dim transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                aria-label="Sepet"
              >
                <Icon name="shopping_cart" aria-hidden="true" />
              </button>
            </div>
            <Link
              to="/teklif"
              className={buttonStyles({ variant: "primary", size: "sm", className: "hidden sm:inline-flex whitespace-nowrap" })}
            >
              Teklif Al
            </Link>
            <button
              type="button"
              className="lg:hidden text-on-primary min-h-11 min-w-11 inline-flex items-center justify-center rounded hover:bg-primary-container/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary transition-colors"
              aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <Icon name={menuOpen ? "close" : "menu"} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div
          id="mobile-nav"
          className="lg:hidden border-t border-secondary/40 bg-primary"
        >
          <nav className="max-w-max-width mx-auto px-margin-mobile py-4 flex flex-col gap-1">
            <div className="relative mb-2">
              <Icon
                name="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                aria-hidden="true"
              />
              <label htmlFor="mobile-search" className="sr-only">
                Ürün ara
              </label>
              <input
                id="mobile-search"
                className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest text-on-surface border border-outline-variant rounded focus:border-secondary focus:ring-1 focus:ring-secondary outline-none text-body-sm font-body-sm"
                placeholder="Ara..."
                type="search"
              />
            </div>
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className="text-on-primary opacity-90 hover:bg-primary-container/40 px-3 py-3 rounded font-label-bold text-label-bold"
                activeOptions={{ exact: true }}
                activeProps={{
                  className:
                    "text-on-primary font-bold bg-primary-container/40 px-3 py-3 rounded font-label-bold text-label-bold",
                }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/teklif"
              onClick={() => setMenuOpen(false)}
              className={buttonStyles({ variant: "primary", size: "sm", className: "sm:hidden mt-2 w-full" })}
            >
              Teklif Al
            </Link>
          </nav>
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