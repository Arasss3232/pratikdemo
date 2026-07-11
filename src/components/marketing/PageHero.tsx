import type { ReactNode } from "react";
import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb";

/**
 * Dark hero used on category and content pages.
 * With `bgImage` renders a photo backdrop + gradient overlay;
 * without it renders a flat dark surface.
 */
export function PageHero({
  title,
  description,
  breadcrumb,
  bgImage,
  actions,
}: {
  title: string;
  description?: string;
  breadcrumb: BreadcrumbItem[];
  bgImage?: string;
  actions?: ReactNode;
}) {
  return (
    <section className="relative bg-inverse-surface text-inverse-on-surface pt-4 pb-16 md:pb-20">
      {bgImage && (
        <>
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
            aria-hidden
          />
          <div
            className="absolute inset-0 z-0 bg-primary/90 md:bg-gradient-to-r md:from-primary md:via-primary/85 md:to-primary/30"
            aria-hidden
          />
        </>
      )}
      <div className="relative z-10 max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop pt-4">
        <Breadcrumb items={breadcrumb} />
        <div className="max-w-3xl">
          <h1 className="font-headline-xl text-headline-xl text-inverse-on-surface mb-4">
            {title}
          </h1>
          {description && (
            <p className="font-body-lg text-body-lg text-inverse-on-surface/90">{description}</p>
          )}
          {actions && <div className="mt-6 flex flex-col sm:flex-row gap-3">{actions}</div>}
        </div>
      </div>
    </section>
  );
}