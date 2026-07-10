import type { ReactNode } from "react";
import { APPLICATIONS, BRANDS, SUBCATEGORIES } from "../../data/catalog";
import { Icon } from "../site-shell";

export function FilterSidebar() {
  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-surface-container-lowest border border-outline-variant p-4 lg:sticky lg:top-[140px]">
        <div className="flex items-center justify-between mb-4 border-b border-outline-variant pb-2">
          <h2 className="font-headline-md text-headline-md font-semibold text-on-background">
            Filtreler
          </h2>
          <button className="text-primary text-label-bold font-label-bold hover:underline">
            Temizle
          </button>
        </div>

        <FilterGroup title="Alt Kategoriler">
          <ul className="space-y-2">
            {SUBCATEGORIES.map((label) => (
              <li key={label}>
                <CheckboxRow label={label} />
              </li>
            ))}
          </ul>
        </FilterGroup>

        <FilterGroup title="Markalar">
          <div className="relative mb-3">
            <Icon
              name="search"
              className="absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]"
            />
            <input
              className="w-full pl-8 pr-2 py-1.5 bg-surface-container-low border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none text-body-sm font-body-sm h-8"
              placeholder="Marka ara..."
              type="text"
            />
          </div>
          <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {BRANDS.map((b) => (
              <li key={b}>
                <CheckboxRow label={b} />
              </li>
            ))}
          </ul>
        </FilterGroup>

        <div>
          <h3 className="font-label-bold text-label-bold font-semibold text-on-background mb-2">
            Uygulama Alanı
          </h3>
          <div className="flex flex-wrap gap-2">
            {APPLICATIONS.map((a) => {
              const active = a === "Metal";
              return (
                <button
                  key={a}
                  className={
                    active
                      ? "px-3 py-1 border border-primary bg-primary-container text-on-primary-container rounded text-body-sm font-body-sm transition-colors"
                      : "px-3 py-1 border border-outline-variant rounded text-body-sm font-body-sm hover:border-primary hover:text-primary transition-colors bg-surface"
                  }
                >
                  {a}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-8 border-b border-outline-variant pb-4">
      <h3 className="font-label-bold text-label-bold font-semibold text-on-background mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

function CheckboxRow({ label }: { label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input
        className="h-4 w-4 text-primary border-outline rounded focus:ring-primary focus:ring-offset-0 bg-surface"
        type="checkbox"
      />
      <span className="text-body-sm font-body-sm text-on-background group-hover:text-primary transition-colors">
        {label}
      </span>
    </label>
  );
}
