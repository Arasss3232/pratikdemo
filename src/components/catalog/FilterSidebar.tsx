import type { ReactNode } from "react";
import { APPLICATIONS, BRANDS, SUBCATEGORIES } from "../../data/catalog";
import { Icon } from "../site-shell";

type FilterSidebarProps = {
  selectedSubcategories: string[];
  selectedBrands: string[];
  selectedApplications: string[];
  brandSearch: string;
  onToggleSubcategory: (label: string) => void;
  onToggleBrand: (label: string) => void;
  onToggleApplication: (label: string) => void;
  onBrandSearchChange: (value: string) => void;
  onClear: () => void;
};

export function FilterSidebar({
  selectedSubcategories,
  selectedBrands,
  selectedApplications,
  brandSearch,
  onToggleSubcategory,
  onToggleBrand,
  onToggleApplication,
  onBrandSearchChange,
  onClear,
}: FilterSidebarProps) {
  const visibleBrands = BRANDS.filter((brand) =>
    brand.toLocaleLowerCase("tr").includes(brandSearch.toLocaleLowerCase("tr")),
  );
  const hasFilters =
    selectedSubcategories.length > 0 || selectedBrands.length > 0 || selectedApplications.length > 0 || brandSearch.length > 0;

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <details className="filter-panel group bg-surface-container-lowest border border-outline-variant rounded-lg lg:sticky lg:top-[140px]" open>
        <summary className="flex items-center justify-between gap-3 p-4 cursor-pointer list-none lg:cursor-default select-none border-b border-outline-variant [&::-webkit-details-marker]:hidden">
          <h2 className="font-headline-md text-headline-md font-semibold text-on-background inline-flex items-center gap-2">
            <Icon name="grid_view" className="text-[20px] text-primary lg:hidden" aria-hidden="true" />
            Filtreler
          </h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-primary text-label-bold font-label-bold hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded disabled:text-on-surface-variant disabled:no-underline disabled:cursor-not-allowed"
              disabled={!hasFilters}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClear();
              }}
            >
              Temizle
            </button>
            <Icon
              name="chevron_right"
              className="text-[20px] text-on-surface-variant transition-transform group-open:rotate-90 lg:hidden"
              aria-hidden="true"
            />
          </div>
        </summary>
        <div className="p-4">

        <FilterGroup title="Alt Kategoriler">
          <ul className="space-y-2">
            {SUBCATEGORIES.map((label) => (
              <li key={label}>
                <CheckboxRow
                  checked={selectedSubcategories.includes(label)}
                  label={label}
                  onChange={() => onToggleSubcategory(label)}
                />
              </li>
            ))}
          </ul>
        </FilterGroup>

        <FilterGroup title="Markalar">
          <div className="relative mb-3">
            <Icon
              name="search"
              className="absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]"
              aria-hidden="true"
            />
            <label htmlFor="brand-search" className="sr-only">
              Marka ara
            </label>
            <input
              id="brand-search"
              className="w-full pl-8 pr-2 py-1.5 bg-surface-container-low border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none text-body-sm font-body-sm h-8"
              placeholder="Marka ara..."
              type="search"
              value={brandSearch}
              onChange={(e) => onBrandSearchChange(e.target.value)}
            />
          </div>
          <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {visibleBrands.map((b) => (
              <li key={b}>
                <CheckboxRow checked={selectedBrands.includes(b)} label={b} onChange={() => onToggleBrand(b)} />
              </li>
            ))}
            {visibleBrands.length === 0 && (
              <li className="text-body-sm font-body-sm text-on-surface-variant">Marka bulunamadı.</li>
            )}
          </ul>
        </FilterGroup>

        <div>
          <h3 className="font-label-bold text-label-bold font-semibold text-on-background mb-2">
            Uygulama Alanı
          </h3>
          <div className="flex flex-wrap gap-2">
            {APPLICATIONS.map((a) => {
              const active = selectedApplications.includes(a);
              return (
                <button
                  key={a}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onToggleApplication(a)}
                  className={
                    active
                      ? "min-h-9 px-3 py-1 border border-primary bg-primary-container text-on-primary-container rounded text-body-sm font-body-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      : "min-h-9 px-3 py-1 border border-outline-variant rounded text-body-sm font-body-sm hover:border-primary hover:text-primary transition-colors bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  }
                >
                  {a}
                </button>
              );
            })}
          </div>
        </div>
        </div>
      </details>
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

function CheckboxRow({ checked, label, onChange }: { checked: boolean; label: string; onChange: () => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input
        className="h-4 w-4 text-primary border-outline rounded focus:ring-primary focus:ring-offset-0 bg-surface"
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <span className="text-body-sm font-body-sm text-on-background group-hover:text-primary transition-colors">
        {label}
      </span>
    </label>
  );
}
