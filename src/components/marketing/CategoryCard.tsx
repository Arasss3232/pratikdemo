import { Link } from "@tanstack/react-router";
import { Icon } from "../site-shell";

/**
 * Category tile used on home + /urunler index.
 * Shows a product count when provided.
 */
export function CategoryCard({
  icon,
  title,
  desc,
  to,
  count,
  search,
}: {
  icon: string;
  title: string;
  desc: string;
  to: any;
  count?: number;
  search?: any;
}) {
  return (
    <Link
      to={to}
      search={search}
      className="group bg-surface-container-lowest border border-outline-variant rounded-lg p-6 hover:border-primary hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all flex flex-col gap-3"
    >
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 bg-primary-container text-on-primary-container flex items-center justify-center rounded">
          <Icon name={icon} className="text-[24px]" aria-hidden="true" />
        </div>
        {typeof count === "number" && (
          <span className="text-body-sm font-body-sm text-on-surface-variant">{count} ürün</span>
        )}
      </div>
      <h3 className="font-headline-md text-headline-md font-bold text-on-background group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="font-body-sm text-body-sm text-on-surface-variant">{desc}</p>
      <div className="mt-auto pt-2 text-primary font-label-bold text-label-bold inline-flex items-center gap-1">
        Teklif Al
        <Icon name="arrow_forward" className="text-[16px]" aria-hidden="true" />
      </div>
    </Link>
  );
}