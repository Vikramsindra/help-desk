import { useDeferredValue, useState } from "react";
import { Link } from "react-router";
import { Plus } from "lucide-react";
import FilterDropdown from "../../components/common/FilterDropdown";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import PageHeader from "../../components/common/PageHeader";
import Pagination from "../../components/common/Pagination";
import SearchBar from "../../components/common/SearchBar";
import TicketTable from "../../components/tickets/TicketTable";
import { TICKET_PRIORITIES, TICKET_STATUSES } from "../../lib/constants";
import { useTickets } from "../../hooks/useTickets";

const statusOptions = [
  { value: "", label: "All statuses" },
  ...TICKET_STATUSES.map((status) => ({
    value: status,
    label: status.replace(/\b\w/g, (letter) => letter.toUpperCase()),
  })),
];

const priorityOptions = [
  { value: "", label: "All priorities" },
  ...TICKET_PRIORITIES.map((priority) => ({
    value: priority,
    label: priority.charAt(0).toUpperCase() + priority.slice(1),
  })),
];

const sortOptions = [
  { value: "createdAt:desc", label: "Created: newest" },
  { value: "createdAt:asc", label: "Created: oldest" },
  { value: "updatedAt:desc", label: "Updated: newest" },
  { value: "updatedAt:asc", label: "Updated: oldest" },
];

export default function MyTicketsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("createdAt:desc");
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(search);
  const [sortBy, sortOrder] = sort.split(":");
  const tickets = useTickets("/tickets/my-ticket", {
    page,
    limit: 10,
    status,
    priority,
    category: category.trim(),
    search: deferredSearch.trim(),
    sortBy,
    sortOrder,
  });

  const resetPage = (update) => {
    update();
    setPage(1);
  };

  return (
    <>
      <PageHeader
        title="My tickets"
        description="Search and track every support request you have submitted."
        action={
          <Link
            className="inline-flex h-10 items-center gap-2 rounded-md bg-brand px-3.5 text-sm font-semibold text-white hover:bg-brand-dark"
            to="/customer/tickets/create"
          >
            <Plus size={16} aria-hidden="true" /> New ticket
          </Link>
        }
      />

      <section className="rounded-lg border border-line bg-white">
        <div className="grid gap-3 border-b border-line p-4 sm:grid-cols-2 lg:grid-cols-[minmax(14rem,1fr)_auto_auto_minmax(9rem,0.7fr)_auto]">
          <SearchBar
            value={search}
            onChange={(value) => resetPage(() => setSearch(value))}
            placeholder="Search title or description"
          />
          <FilterDropdown
            label="Status"
            value={status}
            options={statusOptions}
            onChange={(value) => resetPage(() => setStatus(value))}
          />
          <FilterDropdown
            label="Priority"
            value={priority}
            options={priorityOptions}
            onChange={(value) => resetPage(() => setPriority(value))}
          />
          <label className="flex h-10 min-w-0 items-center gap-2 rounded-md border border-line bg-white px-3 text-xs font-medium text-muted focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <span>Category</span>
            <input
              className="min-w-0 flex-1 border-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted/70"
              type="search"
              value={category}
              onChange={(event) =>
                resetPage(() => setCategory(event.target.value))
              }
              placeholder="Any"
              aria-label="Filter by category"
            />
          </label>
          <FilterDropdown
            label="Sort"
            value={sort}
            options={sortOptions}
            onChange={setSort}
          />
        </div>

        {tickets.error ? (
          <div className="p-8 text-center">
            <p className="text-sm text-rose-700" role="alert">
              {tickets.error.message || "Could not load your tickets."}
            </p>
            <button
              className="mt-3 text-sm font-semibold text-brand hover:text-brand-dark"
              type="button"
              onClick={tickets.refresh}
            >
              Try again
            </button>
          </div>
        ) : tickets.loading ? (
          <LoadingSpinner label="Loading your tickets" />
        ) : (
          <>
            <TicketTable tickets={tickets.items} />
            {tickets.pagination?.totalItems > 0 && (
              <Pagination
                page={tickets.pagination.page}
                totalPages={tickets.pagination.totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </section>
    </>
  );
}
