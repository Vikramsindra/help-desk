import { Inbox } from "lucide-react";

export default function EmptyState({
  title = "Nothing here yet",
  description = "There are no items to show.",
  action,
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
      <span className="mb-4 grid size-12 place-items-center rounded-full bg-mist text-brand">
        <Inbox size={22} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
