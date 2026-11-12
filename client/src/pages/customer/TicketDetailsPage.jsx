import { useEffect, useState } from "react";
import { ArrowLeft, LoaderCircle, Send, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import ConfirmationDialog from "../../components/common/ConfirmationDialog";
import EmptyState from "../../components/common/EmptyState";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import PageHeader from "../../components/common/PageHeader";
import PriorityBadge from "../../components/common/PriorityBadge";
import StatusBadge from "../../components/common/StatusBadge";
import { formatDate } from "../../lib/utils";
import { commentService } from "../../services/commentService";
import { ticketService } from "../../services/ticketService";
import { useTicketRoom } from "../../hooks/useSocket";

export default function TicketDetailsPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
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
  const [message, setMessage] = useState("");
  const [commentError, setCommentError] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    ticketService
      .get(ticketId)
      .then((response) => {
        if (active) {
          setTicketState({ ticketId, ticket: response.data, error: null });
        }
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
            items: (response.data?.items || []).filter(
              (comment) => !comment.isInternal,
            ),
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

  useTicketRoom(ticketId, {
    onTicket: (nextTicket) => {
      if (String(nextTicket._id) !== String(ticketId)) return;
      setTicketState({ ticketId, ticket: nextTicket, error: null });
    },
    onComment: (comment) => {
      if (comment.isInternal) return;
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
      const response = await commentService.create(ticketId, trimmedMessage);
      setCommentState((current) => {
        if (
          current.ticketId !== ticketId ||
          current.items.some((item) => item._id === response.data._id)
        )
          return current;
        return { ...current, items: [...current.items, response.data] };
      });
      setMessage("");
      toast.success("Comment added.");
    } catch (error) {
      setCommentError(error.message || "Could not add your comment.");
      toast.error(error.message || "Could not add your comment.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await ticketService.remove(ticketId);
      toast.success("Ticket deleted.");
      navigate("/customer/tickets", { replace: true });
    } catch (error) {
      toast.error(error.message || "Could not delete this ticket.");
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  if (loadingTicket) return <LoadingSpinner label="Loading ticket" />;

  if (ticketError || !ticket) {
    return (
      <>
        <PageHeader
          title="Ticket details"
          description="The request could not be loaded."
        />
        <div className="rounded-lg border border-line bg-white p-6 text-center">
          <p className="text-sm text-rose-700" role="alert">
            {ticketError?.message || "Ticket not found."}
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
              to="/customer/tickets"
            >
              My tickets
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Ticket details"
        description={`Ticket ${ticket._id}`}
        action={
          <div className="flex items-center gap-2">
            {ticket.status === "open" && (
              <Button variant="danger" onClick={() => setConfirmDelete(true)}>
                <Trash2 size={15} /> Delete ticket
              </Button>
            )}
            <Link
              className="inline-flex h-9 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-muted hover:bg-mist hover:text-ink"
              to="/customer/tickets"
            >
              <ArrowLeft size={15} /> My tickets
            </Link>
          </div>
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
            <dt className="text-xs font-medium text-muted">Category</dt>
            <dd className="mt-1 text-sm font-semibold text-ink">
              {ticket.category}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted">Assigned agent</dt>
            <dd className="mt-1 text-sm font-semibold text-ink">
              {ticket.assignedTo?.name || "Not assigned"}
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
      </article>

      <section className="mt-6 rounded-lg border border-line bg-white">
        <header className="border-b border-line px-4 py-4 sm:px-6">
          <h2 className="text-base font-semibold text-ink">Conversation</h2>
          <p className="mt-1 text-xs text-muted">
            Public replies from you and the support team
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
          <ol className="divide-y divide-line px-4 sm:px-6">
            {comments.map((comment) => (
              <li key={comment._id} className="py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold text-ink">
                    {comment.author?.name || "Support"}
                  </p>
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
          <EmptyState
            title="No replies yet"
            description="Your messages and public staff replies will appear here."
          />
        )}

        <form
          className="border-t border-line p-4 sm:p-6"
          onSubmit={handleCommentSubmit}
        >
          <label
            className="mb-2 block text-sm font-semibold text-ink"
            htmlFor="ticket-comment"
          >
            Add a comment
          </label>
          <textarea
            className={`min-h-28 w-full resize-y rounded-md border bg-white px-3 py-2.5 text-sm leading-6 text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 ${commentError ? "border-rose-400" : "border-line"}`}
            id="ticket-comment"
            maxLength={5000}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              setCommentError("");
            }}
            aria-invalid={Boolean(commentError)}
            aria-describedby={commentError ? "ticket-comment-error" : undefined}
          />
          {commentError && (
            <p
              className="mt-1.5 text-xs font-medium text-rose-700"
              id="ticket-comment-error"
              role="alert"
            >
              {commentError}
            </p>
          )}
          <div className="mt-3 flex justify-end">
            <Button type="submit" disabled={submittingComment}>
              {submittingComment ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <Send size={15} />
              )}
              {submittingComment ? "Sending" : "Send comment"}
            </Button>
          </div>
        </form>
      </section>

      <ConfirmationDialog
        open={confirmDelete}
        onClose={() => !deleting && setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete this ticket?"
        description="Only open tickets can be deleted. This action cannot be undone."
        confirmLabel="Delete ticket"
        busy={deleting}
      />
    </>
  );
}
