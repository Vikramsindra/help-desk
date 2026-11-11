import { Link } from "react-router";

export default function RouteNotice({ title, message, actionLabel, actionTo }) {
  return (
    <section className="mx-auto w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-sm sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">
        Helpdesk
      </p>
      <h1 className="mt-3 text-2xl font-semibold text-ink">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-muted">{message}</p>
      {actionTo && (
        <Link
          className="mt-6 inline-flex h-10 items-center rounded-md bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-dark"
          to={actionTo}
        >
          {actionLabel}
        </Link>
      )}
    </section>
  );
}
