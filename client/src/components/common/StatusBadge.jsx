const statusStyles = {
  open: "bg-amber-50 text-amber-800 ring-amber-200",
  "in progress": "bg-sky-50 text-sky-800 ring-sky-200",
  resolved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  closed: "bg-stone-100 text-stone-700 ring-stone-200",
};

export default function StatusBadge({ status = "open" }) {
  const label = status.replace(/\b\w/g, (letter) => letter.toUpperCase());
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[status] || statusStyles.closed}`}
    >
      {label}
    </span>
  );
}
