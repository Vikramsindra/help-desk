import { lazy, Suspense, useEffect, useState } from "react";
import { ArrowRight, RotateCw } from "lucide-react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import EmptyState from "../../components/common/EmptyState";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import PageHeader from "../../components/common/PageHeader";
import TicketCard from "../../components/dashboard/TicketCard";
import { ticketService } from "../../services/ticketService";
import { useTickets } from "../../hooks/useTickets";

const StatsChart = lazy(() => import("../../components/dashboard/StatsChart"));

const statisticCards = [
  { key: "assignedTickets", label: "Assigned tickets", accent: "text-ink" },
  { key: "pendingTickets", label: "Pending", accent: "text-amber-700" },
  { key: "inProgressTickets", label: "In progress", accent: "text-sky-700" },
  { key: "resolvedTickets", label: "Resolved", accent: "text-emerald-700" },
];

export default function AgentDashboardPage() {
  const [statsState, setStatsState] = useState({
    data: null,
    error: null,
    loading: true,
  });
  const [statsRequest, setStatsRequest] = useState(0);
  const recent = useTickets("/tickets/assigned-to-me", {
    page: 1,
    limit: 5,
    sortBy: "assignedAt",
    sortOrder: "desc",
  });

  useEffect(() => {
    let active = true;
    ticketService
      .dashboardStats()
      .then((response) => {
        if (active) {
          setStatsState({ data: response.data, error: null, loading: false });
        }
      })
      .catch((error) => {
        if (active) {
          setStatsState({ data: null, error, loading: false });
          toast.error(error.message || "Could not load dashboard statistics");
        }
      });

    return () => {
      active = false;
    };
  }, [statsRequest]);

  const chartData = statsState.data
    ? [
        { name: "Pending", count: statsState.data.pendingTickets },
        { name: "In progress", count: statsState.data.inProgressTickets },
        { name: "Resolved", count: statsState.data.resolvedTickets },
      ]
    : [];

  return (
    <>
      <PageHeader
        title="Agent dashboard"
        description="Your assigned queue and the work that needs attention."
        action={
          <Link
            className="inline-flex h-10 items-center gap-2 rounded-md border border-line bg-white px-3.5 text-sm font-semibold text-ink hover:bg-mist"
            to="/agent/tickets"
          >
            Assigned tickets <ArrowRight size={15} />
          </Link>
        }
      />

      {statsState.error && (
        <div
          className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
          role="alert"
        >
          <span>
            {statsState.error.message || "Could not load your statistics."}
          </span>
          <button
            className="inline-flex items-center gap-1.5 font-semibold"
            type="button"
            onClick={() => setStatsRequest((key) => key + 1)}
          >
            <RotateCw size={14} /> Retry
          </button>
        </div>
      )}

      <section aria-label="Assigned ticket statistics">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {statisticCards.map((card) => (
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
                  {statsState.data?.[card.key] ?? "-"}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Suspense
          fallback={
            <div className="grid min-h-72 place-items-center rounded-lg border border-line bg-white">
              <LoadingSpinner label="Loading chart" />
            </div>
          }
        >
          <StatsChart data={chartData} title="Assigned work by status" />
        </Suspense>
        <section className="min-w-0 rounded-lg border border-line bg-white">
          <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-4 sm:px-5">
            <div>
              <h2 className="text-sm font-semibold text-ink">
                Recently assigned
              </h2>
              <p className="mt-1 text-xs text-muted">
                Tickets most recently assigned to you
              </p>
            </div>
            <Link
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-dark"
              to="/agent/tickets"
            >
              View queue <ArrowRight size={14} />
            </Link>
          </header>
          {recent.loading ? (
            <LoadingSpinner label="Loading assigned tickets" />
          ) : recent.error ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-rose-700" role="alert">
                {recent.error.message ||
                  "Could not load your assigned tickets."}
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
                  to={`/agent/tickets/${ticket._id}`}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Queue is clear"
              description="Tickets assigned to you will appear here."
            />
          )}
        </section>
      </div>
    </>
  );
}
