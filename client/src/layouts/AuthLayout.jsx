import { LifeBuoy } from "lucide-react";
import { Link, Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <main className="grid min-h-screen bg-paper lg:grid-cols-[minmax(18rem,0.8fr)_1.2fr]">
      <section className="hidden flex-col justify-between bg-forest p-10 text-white lg:flex">
        <Link
          className="inline-flex items-center gap-2 text-lg font-semibold"
          to="/"
        >
          <LifeBuoy size={23} aria-hidden="true" /> Helpdesk
        </Link>
        <div className="max-w-sm pb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mint">
            Support workspace
          </p>
          <p className="mt-4 text-3xl font-semibold leading-tight">
            Good support starts with a clear conversation.
          </p>
        </div>
        <p className="text-xs text-white/50">© Helpdesk</p>
      </section>
      <section className="flex min-h-screen flex-col items-center justify-center px-5 py-10">
        <Link
          className="mb-8 inline-flex items-center gap-2 font-semibold text-ink lg:hidden"
          to="/"
        >
          <LifeBuoy size={20} /> Helpdesk
        </Link>
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </section>
    </main>
  );
}
