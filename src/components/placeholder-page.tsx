import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Icon, SiteShell } from "./site-shell";

/**
 * Standalone "under construction" page used by every placeholder route.
 * Route files stay tiny (~10 lines) and share the same shell + look.
 */
export function PlaceholderPage({
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
    <SiteShell>
      <>
        <div className="bg-inverse-surface text-inverse-on-surface pt-4 pb-16">
          <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop pt-4">
            <nav
              aria-label="breadcrumb"
              className="flex text-on-surface-variant text-label-bold font-label-bold mb-8"
            >
              <ol className="inline-flex items-center gap-2">
                <li className="inline-flex items-center">
                  <Link to="/" className="hover:text-inverse-on-surface transition-colors">
                    Ana Sayfa
                  </Link>
                </li>
                <li>
                  <Icon name="chevron_right" className="text-[16px]" />
                </li>
                <li aria-current="page">
                  <span className="text-inverse-on-surface font-semibold">{crumb}</span>
                </li>
              </ol>
            </nav>
            <div className="max-w-3xl">
              <h1 className="font-headline-xl text-headline-xl text-inverse-on-surface mb-4">
                {title}
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">{description}</p>
            </div>
          </div>
        </div>
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20">
          {children ?? <PlaceholderBody />}
        </div>
      </>
    </SiteShell>
  );
}

function PlaceholderBody() {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-8 md:p-12 text-center">
      <Icon name="engineering" className="text-[48px] text-primary mb-4" />
      <h2 className="font-headline-lg text-headline-lg text-on-background mb-2">
        Bu sayfa hazırlanıyor
      </h2>
      <p className="font-body-md text-body-md text-on-surface-variant mb-6 max-w-xl mx-auto">
        İçerik kısa süre içinde yayınlanacaktır. Bu arada ürün kataloğumuzu inceleyebilir veya
        bizimle iletişime geçebilirsiniz.
      </p>
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <Link
          to="/"
          className="bg-secondary text-on-secondary px-6 py-2 rounded font-label-bold text-label-bold hover:brightness-90 transition-all inline-flex items-center justify-center gap-2"
        >
          <Icon name="arrow_back" className="text-[16px]" />
          Ürünlere Dön
        </Link>
        <Link
          to="/iletisim"
          className="border-2 border-primary text-primary px-6 py-2 rounded font-label-bold text-label-bold hover:bg-surface-variant transition-all inline-flex items-center justify-center gap-2"
        >
          <Icon name="mail" className="text-[16px]" />
          İletişime Geç
        </Link>
      </div>
    </div>
  );
}