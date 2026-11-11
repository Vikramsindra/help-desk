import { ArrowRight, LifeBuoy } from "lucide-react";
import { Link } from "react-router";

export default function LandingPage() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
      <section className="max-w-2xl">
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-brand">
          <span className="size-2 rounded-full bg-coral" /> Customer support
          workspace
        </p>
        <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl">
          Support requests, kept in motion.
        </h1>
        <p className="mt-5 max-w-lg text-base leading-7 text-muted">
          A shared place to submit a request, follow its progress, and keep the
          conversation clear.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            className="inline-flex h-11 items-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-dark"
            to="/login"
          >
            Sign in <ArrowRight size={16} />
          </Link>
          <Link
            className="inline-flex h-11 items-center rounded-md border border-line bg-white px-4 text-sm font-semibold text-ink transition hover:bg-mist"
            to="/register"
          >
            Create account
          </Link>
        </div>
      </section>
      <aside className="relative hidden min-h-[340px] overflow-hidden rounded-lg border border-line bg-white p-8 shadow-sm lg:flex lg:items-end">
        <div className="absolute right-8 top-8 grid size-16 place-items-center rounded-lg bg-mist text-forest">
          <LifeBuoy size={34} strokeWidth={1.5} />
        </div>
        <div className="relative max-w-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">
            Helpdesk
          </p>
          <p className="mt-2 text-2xl font-semibold leading-tight text-ink">
            Every request has a place to land.
          </p>
          <div className="mt-6 h-1 w-16 rounded-full bg-coral" />
        </div>
        <div
          className="absolute -right-10 -top-10 size-56 rounded-full border-[32px] border-mint/50"
          aria-hidden="true"
        />
      </aside>
    </main>
  );
}
