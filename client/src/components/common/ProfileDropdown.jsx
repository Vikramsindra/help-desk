import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { getInitials } from "../../lib/utils";

export default function ProfileDropdown() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md p-1.5 hover:bg-mist focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
        <span
          className="grid size-9 place-items-center rounded-full bg-brand text-xs font-bold text-white"
          aria-hidden="true"
        >
          {getInitials(user.name)}
        </span>
        <span className="hidden min-w-0 text-left sm:block">
          <span className="block max-w-36 truncate text-sm font-semibold text-ink">
            {user.name}
          </span>
          <span className="block text-xs capitalize text-muted">
            {user.role.replaceAll("_", " ")}
          </span>
        </span>
        <ChevronDown size={15} className="text-muted" aria-hidden="true" />
      </summary>
      <div className="absolute right-0 top-full z-30 mt-2 w-52 rounded-md border border-line bg-white p-1.5 shadow-lg">
        <Link
          className="flex items-center gap-2 rounded px-2.5 py-2 text-sm text-ink hover:bg-mist"
          to="/profile"
        >
          <UserRound size={16} aria-hidden="true" /> Profile
        </Link>
        <button
          className="flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-sm text-rose-700 hover:bg-rose-50"
          type="button"
          onClick={handleLogout}
        >
          <LogOut size={16} aria-hidden="true" /> Sign out
        </button>
      </div>
    </details>
  );
}
