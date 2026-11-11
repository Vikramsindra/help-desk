import { LifeBuoy } from "lucide-react";
import { Link, Outlet } from "react-router";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line bg-white/85">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            className="inline-flex items-center gap-2 font-semibold text-ink"
            to="/"
          >
            <span className="grid size-8 place-items-center rounded-md bg-forest text-white">
              <LifeBuoy size={18} />
            </span>
            Helpdesk
          </Link>
          <nav
            className="flex items-center gap-2"
            aria-label="Public navigation"
          >
            <Link
              className="rounded-md px-3 py-2 text-sm font-medium text-muted hover:bg-mist hover:text-ink"
              to="/login"
            >
              Sign in
            </Link>
            <Link
              className="rounded-md bg-brand px-3.5 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
              to="/register"
            >
              Create account
            </Link>
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
