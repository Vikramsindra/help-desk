import {
  ClipboardList,
  LayoutDashboard,
  Plus,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { NavLink } from "react-router";
import { useAuth } from "../../hooks/useAuth";

const navigationByRole = {
  user: [
    { to: "/customer/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/customer/tickets", label: "My tickets", icon: ClipboardList },
    { to: "/customer/tickets/create", label: "New ticket", icon: Plus },
  ],
  agent: [
    { to: "/agent/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/agent/tickets", label: "Assigned tickets", icon: ClipboardList },
  ],
  admin: [
    { to: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/admin/tickets", label: "All tickets", icon: ClipboardList },
  ],
  super_admin: [
    { to: "/super-admin/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/admin/tickets", label: "All tickets", icon: ClipboardList },
    { to: "/super-admin/staff", label: "Staff", icon: UsersRound },
    { to: "/super-admin/staff/create", label: "Add staff", icon: ShieldCheck },
  ],
};

export default function Sidebar({ open = false, onNavigate }) {
  const { user } = useAuth();
  const links = navigationByRole[user?.role] || [];
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-forest px-3 py-5 text-white transition-transform duration-200 md:sticky md:top-[68px] md:z-0 md:h-[calc(100vh-68px)] md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      aria-label="Primary navigation"
    >
      <div className="mb-7 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
        Workspace
      </div>
      <nav className="space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition ${isActive ? "bg-white/14 text-white shadow-sm" : "text-white/70 hover:bg-white/8 hover:text-white"}`
            }
          >
            <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto rounded-md border border-white/10 bg-white/5 p-3">
        <p className="text-xs font-semibold text-white">Help desk</p>
        <p className="mt-1 text-[11px] leading-4 text-white/55">
          Ticket workspace
        </p>
      </div>
    </aside>
  );
}
