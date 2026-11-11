import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onPageChange }) {
  const currentPage = Math.max(1, page || 1);
  const pages = Math.max(1, totalPages || 1);
  return (
    <nav
      className="flex items-center justify-between gap-3 border-t border-line px-4 py-3"
      aria-label="Pagination"
    >
      <span className="text-xs text-muted">
        Page {currentPage} of {pages}
      </span>
      <div className="flex gap-2">
        <button
          className="grid size-9 place-items-center rounded-md border border-line bg-white text-ink transition hover:bg-mist disabled:cursor-not-allowed disabled:opacity-40"
          type="button"
          aria-label="Previous page"
          disabled={currentPage <= 1}
          onClick={() => onPageChange?.(currentPage - 1)}
        >
          <ChevronLeft size={17} />
        </button>
        <button
          className="grid size-9 place-items-center rounded-md border border-line bg-white text-ink transition hover:bg-mist disabled:cursor-not-allowed disabled:opacity-40"
          type="button"
          aria-label="Next page"
          disabled={currentPage >= pages}
          onClick={() => onPageChange?.(currentPage + 1)}
        >
          <ChevronRight size={17} />
        </button>
      </div>
    </nav>
  );
}
