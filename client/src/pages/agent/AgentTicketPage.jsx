import { useEffect, useState } from "react";
import { ArrowLeft, LoaderCircle, Save, Send } from "lucide-react";
import { Link, useParams } from "react-router";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import FilterDropdown from "../../components/common/FilterDropdown";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import PageHeader from "../../components/common/PageHeader";
import PriorityBadge from "../../components/common/PriorityBadge";
import StatusBadge from "../../components/common/StatusBadge";
import { TICKET_PRIORITIES, TICKET_STATUSES } from "../../lib/constants";
import { formatDate } from "../../lib/utils";
import { commentService } from "../../services/commentService";
import { ticketService } from "../../services/ticketService";
import { useTicketRoom } from "../../hooks/useSocket";

const statusOptions = TICKET_STATUSES.map((status) => ({
  value: status,
  label: status.replace(/\b\w/g, (letter) => letter.toUpperCase()),
}));

const priorityOptions = TICKET_PRIORITIES.map((priority) => ({
  value: priority,
  label: priority.charAt(0).toUpperCase() + priority.slice(1),
}));

export default function AgentTicketPage() {
  const { ticketId } = useParams();
  const [ticketState, setTicketState] = useState({
    ticketId: null,
    ticket: null,
    error: null,
  });
  const [commentState, setCommentState] = useState({
    ticketId: null,
    items: [],
    error: null,
  });
  const [reloadKey, setReloadKey] = useState(0);
  const [status, setStatus] = useState("open");
  const [priority, setPriority] = useState("medium");
  const [savingTicket, setSavingTicket] = useState(false);
  const [message, setMessage] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    let active = true;
    ticketService
      .get(ticketId)
      .then((response) => {
        if (!active) return;
        setTicketState({ ticketId, ticket: response.data, error: null });
        setStatus(response.data.status);
        setPriority(response.data.priority);
      })
      .catch((error) => {
        if (active) setTicketState({ ticketId, ticket: null, error });
      });

    commentService
      .list(ticketId)
      .then((response) => {
        if (active) {
          setCommentState({
            ticketId,
            items: response.data?.items || [],
            error: null,
          });
        }
      })
      .catch((error) => {
        if (active) setCommentState({ ticketId, items: [], error });
      });

    return () => {
      active = false;
    };
  }, [ticketId, reloadKey]);

  const ticket = ticketState.ticketId === ticketId ? ticketState.ticket : null;
  const ticketError =
    ticketState.ticketId === ticketId ? ticketState.error : null;
  const comments = commentState.ticketId === ticketId ? commentState.items : [];
  const commentsError =
    commentState.ticketId === ticketId ? commentState.error : null;
  const loadingTicket = ticketState.ticketId !== ticketId;
  const loadingComments = commentState.ticketId !== ticketId;
  const ticketChanged =
    ticket && (status !== ticket.status || priority !== ticket.priority);

  useTicketRoom(ticketId, {
    onTicket: (nextTicket) => {
      if (String(nextTicket._id) !== String(ticketId)) return;
      setTicketState({ ticketId, ticket: nextTicket, error: null });
      setStatus(nextTicket.status);
      setPriority(nextTicket.priority);
    },
    onComment: (comment) => {
      setCommentState((current) => {
        if (
          current.ticketId !== ticketId ||
          current.items.some((item) => item._id === comment._id)
        )
          return current;
        return { ...current, items: [...current.items, comment] };
      });
    },
  });

  const handleSaveTicket = async () => {
    const updates = {};
    if (status !== ticket.status) updates.status = status;
    if (priority !== ticket.priority) updates.priority = priority;
    if (!Object.keys(updates).length) return;

    setSavingTicket(true);
    try {
      const response = await ticketService.update(ticketId, updates);
      setTicketState({ ticketId, ticket: response.data, error: null });
      setStatus(response.data.status);
      setPriority(response.data.priority);
      toast.success("Ticket updated.");
    } catch (error) {
      toast.error(error.message || "Could not update this ticket.");
    } finally {
      setSavingTicket(false);
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      setCommentError("Write a message before submitting.");
      return;
    }
    if (trimmedMessage.length > 5000) {
      setCommentError("Comments must be 5,000 characters or fewer.");
      return;
    }

    setSubmittingComment(true);
    setCommentError("");
    try {
      const response = await commentService.create(
        ticketId,
        trimmedMessage,
        isInternal,
      );
      setCommentState((current) => {
        if (
          current.ticketId !== ticketId ||
          current.items.some((item) => item._id === response.data._id)
        )
          return current;
        return { ...current, items: [...current.items, response.data] };
      });
      setMessage("");
      setIsInternal(false);
      toast.success(
        isInternal ? "Internal note added." : "Public reply added.",
      );
    } catch (error) {
      setCommentError(error.message || "Could not add your comment.");
      toast.error(error.message || "Could not add your comment.");
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loadingTicket) return <LoadingSpinner label="Loading assigned ticket" />;

  if (ticketError || !ticket) {
    return (
      <>
        <PageHeader
          title="Assigned ticket"
          description="Ticket details could not be loaded."
        />
        <div className="rounded-lg border border-line bg-white p-6 text-center">
          <p className="text-sm text-rose-700" role="alert">
            {ticketError?.message ||
              "Ticket not found or not assigned to your account."}
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <button
              className="text-sm font-semibold text-brand"
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
            >
              Try again
            </button>
            <Link
              className="text-sm font-semibold text-muted hover:text-ink"
              to="/agent/tickets"
            >
              Assigned tickets
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Assigned ticket"
        description={`Ticket ${ticket._id}`}
        action={
          <Link
            className="inline-flex h-9 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-muted hover:bg-mist hover:text-ink"
            to="/agent/tickets"
          >
            <ArrowLeft size={15} /> Assigned tickets
          </Link>
        }
      />

      <article className="rounded-lg border border-line bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-mono text-xs text-muted">{ticket._id}</p>
            <h2 className="mt-2 break-words text-xl font-semibold text-ink">
              {ticket.title}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
        </div>
        <p className="mt-5 whitespace-pre-wrap break-words text-sm leading-6 text-ink">
          {ticket.description}
        </p>
        <dl className="mt-6 grid gap-4 border-t border-line pt-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs font-medium text-muted">Customer</dt>
            <dd className="mt-1 text-sm font-semibold text-ink">
              {ticket.createdBy?.name || "Customer"}
            </dd>
            <dd className="text-xs text-muted">{ticket.createdBy?.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted">Category</dt>
            <dd className="mt-1 text-sm font-semibold text-ink">
              {ticket.category}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted">Created</dt>
            <dd className="mt-1 text-sm text-ink">
              {formatDate(ticket.createdAt)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted">Last updated</dt>
            <dd className="mt-1 text-sm text-ink">
              {formatDate(ticket.updatedAt)}
            </dd>
          </div>
        </dl>
        <div className="mt-6 grid gap-4 border-t border-line pt-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <FilterDropdown
            label="Status"
            value={status}
            options={statusOptions}
            onChange={setStatus}
          />
          <FilterDropdown
            label="Priority"
            value={priority}
            options={priorityOptions}
            onChange={setPriority}
          />
          <Button
            onClick={handleSaveTicket}
            disabled={!ticketChanged || savingTicket}
          >
            {savingTicket ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}
            {savingTicket ? "Saving" : "Save changes"}
          </Button>
        </div>
      </article>

      <section className="mt-6 rounded-lg border border-line bg-white">
        <header className="border-b border-line px-4 py-4 sm:px-6">
          <h2 className="text-base font-semibold text-ink">Conversation</h2>
          <p className="mt-1 text-xs text-muted">
            Public replies and staff-only internal notes
          </p>
        </header>
        {commentsError ? (
          <div className="p-6 text-center">
            <p className="text-sm text-rose-700" role="alert">
              {commentsError.message || "Could not load comments."}
            </p>
            <button
              className="mt-3 text-sm font-semibold text-brand"
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
            >
              Try again
            </button>
          </div>
        ) : loadingComments ? (
          <LoadingSpinner label="Loading conversation" />
        ) : comments.length ? (
          <ol className="space-y-3 p-4 sm:p-6">
            {comments.map((comment) => (
              <li
                key={comment._id}
                className={`rounded-md border p-4 ${comment.isInternal ? "border-amber-200 bg-amber-50" : "border-line bg-white"}`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-ink">
                      {comment.author?.name || "Support"}
                    </p>
                    {comment.isInternal && (
                      <span className="rounded bg-amber-200/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-900">
                        Internal note
                      </span>
                    )}
                  </div>
                  <time
                    className="text-xs text-muted"
                    dateTime={comment.createdAt}
                  >
                    {formatDate(comment.createdAt)}
                  </time>
                </div>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-ink">
                  {comment.message}
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <div className="p-2">
            <EmptyState
              title="No conversation yet"
              description="Add a public reply or an internal note."
            />
          </div>
        )}

        <form
          className="border-t border-line p-4 sm:p-6"
          onSubmit={handleCommentSubmit}
        >
          <label
            className="mb-2 block text-sm font-semibold text-ink"
            htmlFor="agent-comment"
          >
            Add a comment
          </label>
          <textarea
            className={`min-h-28 w-full resize-y rounded-md border bg-white px-3 py-2.5 text-sm leading-6 text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 ${commentError ? "border-rose-400" : "border-line"}`}
            id="agent-comment"
            maxLength={5000}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              setCommentError("");
            }}
            aria-invalid={Boolean(commentError)}
            aria-describedby={commentError ? "agent-comment-error" : undefined}
          />
          {commentError && (
            <p
              className="mt-1.5 text-xs font-medium text-rose-700"
              id="agent-comment-error"
              role="alert"
            >
              {commentError}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <label className="inline-flex min-h-9 items-center gap-2 text-sm text-ink">
              <input
                className="size-4 accent-brand"
                type="checkbox"
                checked={isInternal}
                onChange={(event) => setIsInternal(event.target.checked)}
              />
              Internal note (staff only)
            </label>
            <Button type="submit" disabled={submittingComment}>
              {submittingComment ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <Send size={15} />
              )}
              {submittingComment
                ? "Sending"
                : isInternal
                  ? "Add internal note"
                  : "Send public reply"}
            </Button>
          </div>
        </form>
      </section>
    </>
  );
}
