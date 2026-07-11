import { Link } from "@tanstack/react-router";
import { Icon } from "../site-shell";

export type BreadcrumbItem = {
  label: string;
  /** Omit for the current page (rendered as static text). */
  to?: string;
};

/**
 * Semantic breadcrumb rendered on dark hero backgrounds.
 * The last item is treated as the current page.
 */
export function Breadcrumb({
  items,
  className = "",
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  return (
    <nav
      aria-label="breadcrumb"
      className={`flex text-inverse-on-surface/75 text-label-bold font-label-bold mb-8 ${className}`}
    >
      <ol className="inline-flex items-center gap-2 flex-wrap">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li
              key={`${item.label}-${i}`}
              className="inline-flex items-center gap-2"
              {...(isLast ? { "aria-current": "page" as const } : {})}
            >
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="hover:text-inverse-on-surface transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-inverse-on-surface font-semibold">
                  {item.label}
                </span>
              )}
              {!isLast && (
                <Icon name="chevron_right" className="text-[16px]" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}