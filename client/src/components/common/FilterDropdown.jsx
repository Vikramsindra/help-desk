export default function FilterDropdown({
  label,
  value,
  options,
  onChange,
  className = "",
}) {
  return (
    <label
      className={`flex h-10 items-center gap-2 rounded-md border border-line bg-white px-3 text-xs font-medium text-muted focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15 ${className}`}
    >
      <span className="whitespace-nowrap">{label}</span>
      <select
        className="min-w-0 flex-1 cursor-pointer border-0 bg-transparent text-sm text-ink outline-none"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        aria-label={label}
      >
        {options.map((option) => {
          const item =
            typeof option === "string"
              ? { value: option, label: option }
              : option;
          return (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          );
        })}
      </select>
    </label>
  );
}
