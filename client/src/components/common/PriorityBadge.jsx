const priorityStyles = {
  low: "text-teal-800 bg-teal-50",
  medium: "text-orange-800 bg-orange-50",
  high: "text-rose-800 bg-rose-50",
};

export default function PriorityBadge({ priority = "medium" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-semibold capitalize ${priorityStyles[priority] || priorityStyles.medium}`}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {priority}
    </span>
  );
}
