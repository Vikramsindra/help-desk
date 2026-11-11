import { ExternalLink, UserRoundPlus } from "lucide-react";
import { Link } from "react-router";
import EmptyState from "../common/EmptyState";
import PriorityBadge from "../common/PriorityBadge";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../lib/utils";

export default function TicketTable({
  tickets = [],
  detailPath = "/customer/tickets",
  showCustomer = false,
  showAssignedAgent = false,
  onAssign,
}) {
  if (!tickets.length)
    return (
      <EmptyState
        title="No tickets found"
        description="Try adjusting your filters or create a ticket."
      />
    );

  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-white">
      <table className="w-full min-w-[980px] border-collapse text-left">
        <thead className="bg-mist/70 text-[11px] uppercase tracking-[0.08em] text-muted">
          <tr>
            <th className="px-4 py-3 font-semibold">Ticket ID</th>
            {showCustomer && (
              <th className="px-4 py-3 font-semibold">Customer</th>
            )}
            {showAssignedAgent && (
              <th className="px-4 py-3 font-semibold">Assigned agent</th>
            )}
            <th className="px-4 py-3 font-semibold">Title</th>
            <th className="px-4 py-3 font-semibold">Category</th>
            <th className="px-4 py-3 font-semibold">Priority</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Created</th>
            <th className="px-4 py-3 font-semibold">Last updated</th>
            <th className="px-4 py-3 text-right font-semibold">
              {onAssign ? "Actions" : "View"}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {tickets.map((ticket) => (
            <tr key={ticket._id} className="hover:bg-mist/40">
              <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-muted">
                {ticket._id}
              </td>
              {showCustomer && (
                <td className="px-4 py-3.5">
                  <p className="text-sm font-medium text-ink">
                    {ticket.createdBy?.name || "Customer"}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {ticket.createdBy?.email || ""}
                  </p>
                </td>
              )}
              {showAssignedAgent && (
                <td className="px-4 py-3.5 text-sm text-muted">
                  {ticket.assignedTo?.name || "Unassigned"}
                </td>
              )}
              <td className="max-w-64 px-4 py-3.5">
                <p className="truncate text-sm font-semibold text-ink">
                  {ticket.title}
                </p>
                <p className="mt-1 max-w-64 truncate text-xs text-muted">
                  {ticket.description}
                </p>
              </td>
              <td className="px-4 py-3.5 text-sm text-muted">
                {ticket.category}
              </td>
              <td className="px-4 py-3.5">
                <PriorityBadge priority={ticket.priority} />
              </td>
              <td className="px-4 py-3.5">
                <StatusBadge status={ticket.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3.5 text-xs text-muted">
                {formatDate(ticket.createdAt)}
              </td>
              <td className="whitespace-nowrap px-4 py-3.5 text-xs text-muted">
                {formatDate(ticket.updatedAt)}
              </td>
              <td className="px-4 py-3.5 text-right">
                <Link
                  className="inline-grid size-8 place-items-center rounded text-brand hover:bg-mist focus-visible:outline-2 focus-visible:outline-brand"
                  to={`${detailPath}/${ticket._id}`}
                  aria-label={`View ticket ${ticket._id}`}
                  title="View ticket"
                >
                  <ExternalLink size={16} aria-hidden="true" />
                </Link>
                {onAssign && (
                  <button
                    className="ml-1 inline-grid size-8 place-items-center rounded text-brand hover:bg-mist focus-visible:outline-2 focus-visible:outline-brand"
                    type="button"
                    aria-label={`Assign ${ticket.title}`}
                    title="Assign ticket"
                    onClick={() => onAssign(ticket)}
                  >
                    <UserRoundPlus size={16} aria-hidden="true" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
