import { Icon } from "../site-shell";

export function Pagination() {
  return (
    <div className="mt-8 border-t border-outline-variant pt-4 flex justify-center">
      <nav aria-label="Sayfalama" className="flex items-center gap-1">
        <button
          className="p-2 border border-outline-variant rounded text-on-surface-variant hover:bg-surface-variant hover:text-on-background transition-colors disabled:opacity-50"
          disabled
          aria-label="Önceki sayfa"
        >
          <Icon name="chevron_left" className="text-[20px]" />
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center border border-primary bg-primary text-on-primary rounded font-label-bold text-label-bold"
          aria-current="page"
        >
          1
        </button>
        {[2, 3].map((n) => (
          <button
            key={n}
            className="w-8 h-8 flex items-center justify-center border border-outline-variant bg-surface-container-lowest text-on-background hover:bg-surface-variant rounded font-label-bold text-label-bold transition-colors"
          >
            {n}
          </button>
        ))}
        <span className="px-2 text-on-surface-variant">...</span>
        <button className="w-8 h-8 flex items-center justify-center border border-outline-variant bg-surface-container-lowest text-on-background hover:bg-surface-variant rounded font-label-bold text-label-bold transition-colors">
          12
        </button>
        <button
          className="p-2 border border-outline-variant rounded text-on-surface-variant hover:bg-surface-variant hover:text-on-background transition-colors"
          aria-label="Sonraki sayfa"
        >
          <Icon name="chevron_right" className="text-[20px]" />
        </button>
      </nav>
    </div>
  );
}