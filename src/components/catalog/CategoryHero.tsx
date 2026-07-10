import { Link } from "@tanstack/react-router";
import { Icon } from "../site-shell";

export function CategoryHero({
  bgImage,
  title,
  description,
  crumb,
}: {
  bgImage: string;
  title: string;
  description: string;
  crumb: string;
}) {
  return (
    <div className="relative bg-inverse-surface text-inverse-on-surface pt-4 pb-20">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
        aria-hidden
      />
      <div
        className="absolute inset-0 z-0 bg-gradient-to-r from-inverse-surface via-inverse-surface/90 to-inverse-surface/60 md:to-inverse-surface/30"
        aria-hidden
      />
      <div className="relative z-10 max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop pt-4">
        <nav
          aria-label="breadcrumb"
          className="flex text-inverse-on-surface/75 text-label-bold font-label-bold mb-8"
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
            <li>
              <Link to="/urunler" className="hover:text-inverse-on-surface transition-colors">
                Ürünler
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
          <p className="font-body-lg text-body-lg text-inverse-on-surface">{description}</p>
        </div>
      </div>
    </div>
  );
}
