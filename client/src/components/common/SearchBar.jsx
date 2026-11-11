import { Search, X } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search",
  className = "",
}) {
  return (
    <label
      className={`flex h-10 min-w-0 items-center gap-2 rounded-md border border-line bg-white px-3 text-muted focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15 ${className}`}
    >
      <Search size={16} aria-hidden="true" />
      <span className="sr-only">{placeholder}</span>
      <input
        className="min-w-0 flex-1 border-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted/80"
        type="search"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button
          className="grid size-6 place-items-center rounded text-muted hover:bg-mist hover:text-ink"
          type="button"
          aria-label="Clear search"
          onClick={() => onChange?.("")}
        >
          <X size={14} />
        </button>
      )}
    </label>
  );
}
