import { lazy, Suspense, useEffect, useState } from "react";
import { ArrowRight, RotateCw, ShieldCheck, UsersRound } from "lucide-react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import EmptyState from "../common/EmptyState";
import LoadingSpinner from "../common/LoadingSpinner";
import PageHeader from "../common/PageHeader";
import TicketCard from "./TicketCard";
import { useTickets } from "../../hooks/useTickets";
import { ticketService } from "../../services/ticketService";

const StatsChart = lazy(() => import("./StatsChart"));

const summaryCards = [
  { key: "totalTickets", label: "Total tickets", accent: "text-ink" },
  {
    key: "ticketsByStatus.open",
    label: "Open tickets",
    accent: "text-amber-700",
  },
  {
    key: "ticketsByStatus.in progress",
    label: "In progress",
    accent: "text-sky-700",
  },
  {
    key: "ticketsByStatus.resolved",
    label: "Resolved",
    accent: "text-emerald-700",
  },
  { key: "totalUsers", label: "Customers", accent: "text-brand" },
  { key: "totalAgents", label: "Agents", accent: "text-sky-700" },
  {
    key: "totalAdministrators",
    label: "Administrators",
    accent: "text-orange-700",
  },
];

export default function StaffDashboardOverview({ superAdmin = false }) {
  const [statsState, setStatsState] = useState({
    data: null,
    error: null,
    loading: true,
  });
  const [requestKey, setRequestKey] = useState(0);
  const recent = useTickets("/tickets/admin", {
    page: 1,
    limit: 4,
    sortBy: "updatedAt",
    sortOrder: "desc",
  });

  useEffect(() => {
    let active = true;
    ticketService
      .dashboardStats()
      .then((response) => {
        if (active)
          setStatsState({ data: response.data, error: null, loading: false });
      })
      .catch((error) => {
        if (active) {
          setStatsState({ data: null, error, loading: false });
          toast.error(error.message || "Could not load system statistics");
        }
      });
    return () => {
      active = false;
    };
  }, [requestKey]);

  const statusData = statsState.data?.ticketsByStatus
    ? Object.entries(statsState.data.ticketsByStatus).map(([name, count]) => ({
        name,
        count,
      }))
    : [];
  const priorityData = statsState.data?.ticketsByPriority
    ? Object.entries(statsState.data.ticketsByPriority).map(
        ([name, count]) => ({ name, count }),
      )
    : [];
  const getMetricValue = (key) => {
    const [root, nested] = key.split(".");
    return nested ? statsState.data?.[root]?.[nested] : statsState.data?.[key];
  };

  return (
    <>
      <PageHeader
        title={superAdmin ? "System overview" : "Admin dashboard"}
        description={
          superAdmin
            ? "System-wide users, staff, and ticket activity."
            : "Ticket volume and service desk activity."
        }
        action={
          superAdmin ? (
            <div className="flex flex-wrap gap-2">
              <Link
                className="inline-flex h-10 items-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-semibold text-ink hover:bg-mist"
                to="/super-admin/customers"
              >
                <UsersRound size={15} /> Users
              </Link>
              <Link
                className="inline-flex h-10 items-center gap-2 rounded-md bg-brand px-3 text-sm font-semibold text-white hover:bg-brand-dark"
                to="/super-admin/staff"
              >
                <ShieldCheck size={15} /> Staff
              </Link>
            </div>
          ) : undefined
        }
      />

      {statsState.error && (
        <div
          className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
          role="alert"
        >
          <span>
            {statsState.error.message || "Could not load dashboard statistics."}
          </span>
          <button
            className="inline-flex items-center gap-1.5 font-semibold"
            type="button"
            onClick={() => setRequestKey((key) => key + 1)}
          >
            <RotateCw size={14} /> Retry
          </button>
        </div>
      )}

      <section aria-label="System statistics">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {summaryCards.map((card) => (
            <article
              key={card.key}
              className="rounded-lg border border-line bg-white px-4 py-4 shadow-sm sm:px-5"
            >
              <p className="text-xs font-medium text-muted">{card.label}</p>
              {statsState.loading ? (
                <div className="mt-3 h-8 w-14 animate-pulse rounded bg-mist" />
              ) : (
                <p
                  className={`mt-2 text-2xl font-semibold tabular-nums ${card.accent}`}
                >
                  {getMetricValue(card.key) ?? "-"}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <Suspense
          fallback={
            <div className="grid min-h-72 place-items-center rounded-lg border border-line bg-white">
              <LoadingSpinner label="Loading status chart" />
            </div>
          }
        >
          <StatsChart data={statusData} title="Tickets by status" />
        </Suspense>
        <Suspense
          fallback={
            <div className="grid min-h-72 place-items-center rounded-lg border border-line bg-white">
              <LoadingSpinner label="Loading priority chart" />
            </div>
          }
        >
          <StatsChart data={priorityData} title="Tickets by priority" />
        </Suspense>
      </div>

      <section className="mt-6 rounded-lg border border-line bg-white">
        <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-4 sm:px-5">
          <div>
            <h2 className="text-sm font-semibold text-ink">
              Recently updated tickets
            </h2>
            <p className="mt-1 text-xs text-muted">
              Latest activity across the support desk
            </p>
          </div>
          <Link
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-dark"
            to="/admin/tickets"
          >
            All tickets <ArrowRight size={14} />
          </Link>
        </header>
        {recent.loading ? (
          <LoadingSpinner label="Loading recent tickets" />
        ) : recent.error ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-rose-700" role="alert">
              {recent.error.message || "Could not load tickets."}
            </p>
            <button
              className="mt-3 text-sm font-semibold text-brand"
              type="button"
              onClick={recent.refresh}
            >
              Try again
            </button>
          </div>
        ) : recent.items.length ? (
          <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
            {recent.items.map((ticket) => (
              <TicketCard
                key={ticket._id}
                ticket={ticket}
                to={`/admin/tickets/${ticket._id}`}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No tickets yet"
            description="Tickets will appear here when customers submit requests."
          />
        )}
      </section>
    </>
  );
}
