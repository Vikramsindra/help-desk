export default function PageHeader({ title, description, action }) {
  return (
    <header className="mb-7 flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-brand">
          Support workspace
        </p>
        <h1 className="text-2xl font-semibold text-ink sm:text-[1.8rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm text-muted">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
