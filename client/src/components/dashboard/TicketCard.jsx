import { ArrowUpRight, Clock3 } from "lucide-react";
import { Link } from "react-router";
import PriorityBadge from "../common/PriorityBadge";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../lib/utils";

export default function TicketCard({ ticket, to }) {
  const href = to || `/customer/tickets/${ticket._id}`;
  return (
    <article className="rounded-lg border border-line bg-white p-4 shadow-sm transition hover:border-brand/40 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <Link
          className="line-clamp-2 text-sm font-semibold text-ink hover:text-brand"
          to={href}
        >
          {ticket.title}
        </Link>
        <ArrowUpRight
          size={16}
          className="shrink-0 text-muted"
          aria-hidden="true"
        />
      </div>
      <p className="mt-2 line-clamp-2 text-sm leading-5 text-muted">
        {ticket.description}
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <StatusBadge status={ticket.status} />
        <PriorityBadge priority={ticket.priority} />
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs text-muted">
        <span>{ticket.category}</span>
        <span className="inline-flex items-center gap-1">
          <Clock3 size={13} aria-hidden="true" />
          {formatDate(ticket.updatedAt || ticket.createdAt)}
        </span>
      </div>
    </article>
  );
}
