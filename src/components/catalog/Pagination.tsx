import { Icon } from "../site-shell";

export function Pagination({
  currentPage,
  pageCount,
  onPageChange,
}: {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <div className="mt-8 border-t border-outline-variant pt-4 flex justify-center">
      <nav aria-label="Sayfalama" className="flex items-center gap-1">
        <button
          className="p-2 border border-outline-variant rounded text-on-surface-variant hover:bg-surface-variant hover:text-on-background transition-colors disabled:opacity-50"
          disabled={currentPage === 1}
          aria-label="Önceki sayfa"
          onClick={() => onPageChange(currentPage - 1)}
        >
          <Icon name="chevron_left" className="text-[20px]" />
        </button>
        {pages.map((n) => (
          <button
            key={n}
            className={
              n === currentPage
                ? "w-8 h-8 flex items-center justify-center border border-primary bg-primary text-on-primary rounded font-label-bold text-label-bold"
                : "w-8 h-8 flex items-center justify-center border border-outline-variant bg-surface-container-lowest text-on-background hover:bg-surface-variant rounded font-label-bold text-label-bold transition-colors"
            }
            aria-current={n === currentPage ? "page" : undefined}
            onClick={() => onPageChange(n)}
          >
            {n}
          </button>
        ))}
        <button
          className="p-2 border border-outline-variant rounded text-on-surface-variant hover:bg-surface-variant hover:text-on-background transition-colors"
          disabled={currentPage === pageCount}
          aria-label="Sonraki sayfa"
          onClick={() => onPageChange(currentPage + 1)}
        >
          <Icon name="chevron_right" className="text-[20px]" />
        </button>
      </nav>
    </div>
  );
}