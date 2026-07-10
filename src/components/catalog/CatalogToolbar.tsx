import { Icon } from "../site-shell";

export function CatalogToolbar({ count = 341 }: { count?: number }) {
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
              defaultValue="Önerilen"
            >
              <option>Önerilen</option>
              <option>A - Z (Ürün Adı)</option>
              <option>Z - A (Ürün Adı)</option>
              <option>Ürün Kodu</option>
            </select>
          </div>
          <div className="hidden sm:flex items-center bg-surface border border-outline-variant rounded overflow-hidden">
            <button
              className="p-1.5 bg-surface-container text-on-background hover:bg-surface-variant transition-colors"
              title="Grid Görünümü"
            >
              <Icon name="grid_view" className="text-[20px] fill" />
            </button>
            <button
              className="p-1.5 bg-surface text-on-surface-variant hover:bg-surface-variant transition-colors"
              title="Liste Görünümü"
            >
              <Icon name="view_list" className="text-[20px]" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface border border-outline-variant rounded text-label-bold font-label-bold text-on-background">
          Uygulama: Metal
          <button
            className="text-on-surface-variant hover:text-primary transition-colors"
            aria-label="Filtreyi kaldır"
          >
            <Icon name="close" className="text-[14px]" />
          </button>
        </span>
      </div>
    </>
  );
}
