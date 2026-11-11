import { useState } from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Sidebar from "../components/navigation/Sidebar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-paper">
      <Navbar onMenuClick={() => setSidebarOpen((open) => !open)} />
      <div className="mx-auto flex max-w-[1600px]">
        {sidebarOpen && (
          <button
            className="fixed inset-0 z-30 bg-ink/40 md:hidden"
            type="button"
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-9 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
