import { LifeBuoy, Menu } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import NotificationBell from "./notifications/NotificationBell";
import ProfileDropdown from "./common/ProfileDropdown";

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  const location = useLocation();
  const section =
    location.pathname.split("/").filter(Boolean)[0] || "workspace";

  return (
    <header className="sticky top-0 z-20 h-[68px] border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            className="grid size-10 place-items-center rounded-md text-ink hover:bg-mist md:hidden"
            type="button"
            aria-label="Open navigation"
            onClick={onMenuClick}
          >
            <Menu size={20} />
          </button>
          <Link
            className="inline-flex shrink-0 items-center gap-2 font-bold tracking-tight text-ink"
            to="/"
          >
            <span className="grid size-9 place-items-center rounded-md bg-forest text-white">
              <LifeBuoy size={19} />
            </span>
            <span className="hidden sm:inline">Helpdesk</span>
          </Link>
          <span className="hidden h-7 w-px bg-line sm:block" />
          <p className="hidden truncate text-sm font-medium capitalize text-muted sm:block">
            {section.replaceAll("-", " ")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {user && <NotificationBell />}
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
