import { useDeferredValue, useEffect, useState } from "react";
import { LoaderCircle, UserRoundPlus } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import FilterDropdown from "../../components/common/FilterDropdown";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Modal from "../../components/common/Modal";
import PageHeader from "../../components/common/PageHeader";
import Pagination from "../../components/common/Pagination";
import SearchBar from "../../components/common/SearchBar";
import TicketTable from "../../components/tickets/TicketTable";
import { TICKET_PRIORITIES, TICKET_STATUSES } from "../../lib/constants";
import { useTickets } from "../../hooks/useTickets";
import { adminService } from "../../services/adminService";
import { ticketService } from "../../services/ticketService";

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
  { value: "updatedAt:desc", label: "Updated: newest" },
  { value: "updatedAt:asc", label: "Updated: oldest" },
  { value: "createdAt:desc", label: "Created: newest" },
  { value: "createdAt:asc", label: "Created: oldest" },
];

export default function AllTicketsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("updatedAt:desc");
  const [page, setPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [agentId, setAgentId] = useState("");
  const [agentState, setAgentState] = useState({
    ticketId: null,
    items: [],
    error: null,
  });
  const [assigning, setAssigning] = useState(false);
  const deferredSearch = useDeferredValue(search);
  const [sortBy, sortOrder] = sort.split(":");
  const tickets = useTickets("/tickets/admin", {
    page,
    limit: 10,
    status,
    priority,
    category: category.trim(),
    search: deferredSearch.trim(),
    sortBy,
    sortOrder,
  });

  useEffect(() => {
    if (!selectedTicket) return undefined;
    let active = true;
    adminService
      .listAgents({ page: 1, limit: 100, search: "" })
      .then((response) => {
        if (active) {
          setAgentState({
            ticketId: selectedTicket._id,
            items: response.data?.items || [],
            error: null,
          });
        }
      })
      .catch((error) => {
        if (active) {
          setAgentState({
            ticketId: selectedTicket._id,
            items: [],
            error: error.message || "Could not load active agents.",
          });
        }
      });

    return () => {
      active = false;
    };
  }, [selectedTicket]);

  const agentsLoading = Boolean(
    selectedTicket && agentState.ticketId !== selectedTicket._id,
  );
  const agentsError =
    agentState.ticketId === selectedTicket?._id ? agentState.error : null;
  const agents =
    agentState.ticketId === selectedTicket?._id ? agentState.items : [];

  const updateFilter = (update) => {
    update();
    setPage(1);
  };

  const openAssign = (ticket) => {
    setSelectedTicket(ticket);
    setAgentId(ticket.assignedTo?._id || "");
  };

  const handleAssign = async (event) => {
    event.preventDefault();
    if (!selectedTicket || !agentId) return;
    setAssigning(true);
    try {
      await ticketService.assign(selectedTicket._id, agentId);
      toast.success("Ticket assigned.");
      setSelectedTicket(null);
      tickets.refresh();
    } catch (error) {
      toast.error(error.message || "Could not assign ticket.");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <>
      <PageHeader
        title="All tickets"
        description="Search, prioritize, and assign requests across the support desk."
      />
      <section className="rounded-lg border border-line bg-white">
        <div className="grid gap-3 border-b border-line p-4 sm:grid-cols-2 lg:grid-cols-[minmax(14rem,1fr)_auto_auto_minmax(9rem,0.7fr)_auto]">
          <SearchBar
            value={search}
            onChange={(value) => updateFilter(() => setSearch(value))}
            placeholder="Search title or description"
          />
          <FilterDropdown
            label="Status"
            value={status}
            options={statusOptions}
            onChange={(value) => updateFilter(() => setStatus(value))}
          />
          <FilterDropdown
            label="Priority"
            value={priority}
            options={priorityOptions}
            onChange={(value) => updateFilter(() => setPriority(value))}
          />
          <label className="flex h-10 min-w-0 items-center gap-2 rounded-md border border-line bg-white px-3 text-xs font-medium text-muted focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <span>Category</span>
            <input
              className="min-w-0 flex-1 border-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted/70"
              type="search"
              value={category}
              onChange={(event) =>
                updateFilter(() => setCategory(event.target.value))
              }
              placeholder="Any"
              aria-label="Filter by category"
            />
          </label>
          <FilterDropdown
            label="Sort"
            value={sort}
            options={sortOptions}
            onChange={(value) => updateFilter(() => setSort(value))}
          />
        </div>

        {tickets.error ? (
          <div className="p-8 text-center">
            <p className="text-sm text-rose-700" role="alert">
              {tickets.error.message || "Could not load tickets."}
            </p>
            <button
              className="mt-3 text-sm font-semibold text-brand"
              type="button"
              onClick={tickets.refresh}
            >
              Try again
            </button>
          </div>
        ) : tickets.loading ? (
          <LoadingSpinner label="Loading all tickets" />
        ) : (
          <>
            <TicketTable
              tickets={tickets.items}
              detailPath="/admin/tickets"
              showCustomer
              showAssignedAgent
              onAssign={openAssign}
            />
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

      <Modal
        open={Boolean(selectedTicket)}
        onClose={() => !assigning && setSelectedTicket(null)}
        title="Assign ticket"
        description={selectedTicket?.title}
        size="max-w-md"
      >
        {agentsError ? (
          <p className="text-sm text-rose-700" role="alert">
            {agentsError}
          </p>
        ) : agentsLoading ? (
          <LoadingSpinner label="Loading active agents" />
        ) : agents.length ? (
          <form onSubmit={handleAssign}>
            <FilterDropdown
              label="Agent"
              value={agentId}
              options={[
                { value: "", label: "Choose an agent" },
                ...agents.map((agent) => ({
                  value: agent.id,
                  label: `${agent.name} · ${agent.email}`,
                })),
              ]}
              onChange={setAgentId}
              className="w-full"
            />
            <div className="mt-5 flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setSelectedTicket(null)}
                disabled={assigning}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!agentId || assigning}>
                {assigning ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <UserRoundPlus size={16} />
                )}
                {assigning ? "Assigning" : "Assign"}
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-sm text-muted">No active agents are available.</p>
        )}
      </Modal>
    </>
  );
}
