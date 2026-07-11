import { Icon } from "../site-shell";

export type CatalogView = "grid" | "list";
export type CatalogSort = "recommended" | "name-asc" | "name-desc" | "sku";
export type ActiveCatalogFilter = { id: string; label: string };

const SORT_OPTIONS: { value: CatalogSort; label: string }[] = [
  { value: "recommended", label: "Önerilen" },
  { value: "name-asc", label: "A - Z (Ürün Adı)" },
  { value: "name-desc", label: "Z - A (Ürün Adı)" },
  { value: "sku", label: "Ürün Kodu" },
];

export function CatalogToolbar({
  count = 341,
  sort,
  view,
  activeFilters,
  onSortChange,
  onViewChange,
  onRemoveFilter,
}: {
  count?: number;
  sort: CatalogSort;
  view: CatalogView;
  activeFilters: ActiveCatalogFilter[];
  onSortChange: (sort: CatalogSort) => void;
  onViewChange: (view: CatalogView) => void;
  onRemoveFilter: (id: string) => void;
}) {
  return (
    <>
      <div className="bg-surface-container-lowest border border-outline-variant p-2 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="text-body-sm font-body-sm text-on-surface-variant">
          <span className="font-semibold text-on-background">{count}</span> ürün
          listeleniyor
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label
              className="text-label-bold font-label-bold text-on-surface-variant whitespace-nowrap"
              htmlFor="sort"
            >
              Sırala:
            </label>
            <select
              id="sort"
              className="bg-surface border border-outline-variant rounded text-body-sm font-body-sm py-1.5 pl-3 pr-8 focus:border-primary focus:ring-0 outline-none w-full sm:w-auto"
              value={sort}
              onChange={(e) => onSortChange(e.target.value as CatalogSort)}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="hidden sm:flex items-center bg-surface border border-outline-variant rounded overflow-hidden">
            <button
              type="button"
              className={`p-1.5 hover:bg-surface-variant transition-colors ${
                view === "grid" ? "bg-surface-container text-on-background" : "bg-surface text-on-surface-variant"
              }`}
              title="Grid Görünümü"
              aria-pressed={view === "grid"}
              onClick={() => onViewChange("grid")}
            >
              <Icon name="grid_view" className="text-[20px] fill" />
            </button>
            <button
              type="button"
              className={`p-1.5 hover:bg-surface-variant transition-colors ${
                view === "list" ? "bg-surface-container text-on-background" : "bg-surface text-on-surface-variant"
              }`}
              title="Liste Görünümü"
              aria-pressed={view === "list"}
              onClick={() => onViewChange("list")}
            >
              <Icon name="view_list" className="text-[20px]" />
            </button>
          </div>
        </div>
      </div>
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4" aria-label="Aktif filtreler">
          {activeFilters.map((filter) => (
            <span
              key={filter.id}
              className="inline-flex items-center gap-1 px-2 py-1 bg-surface border border-outline-variant rounded text-label-bold font-label-bold text-on-background"
            >
              {filter.label}
              <button
                type="button"
                className="text-on-surface-variant hover:text-primary transition-colors rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label={`${filter.label} filtresini kaldır`}
                onClick={() => onRemoveFilter(filter.id)}
              >
                <Icon name="close" className="text-[14px]" />
              </button>
            </span>
          ))}
        </div>
      )}
    </>
  );
}
