import { apiFetch } from "../lib/api";

export const commentService = {
  list: (ticketId) => apiFetch(`/tickets/${ticketId}/comments`),
  create: (ticketId, message, isInternal = false) =>
    apiFetch(`/tickets/${ticketId}/comments`, {
      method: "POST",
      body: JSON.stringify({ message, isInternal }),
    }),
  remove: (ticketId, commentId) =>
    apiFetch(`/tickets/${ticketId}/comments/${commentId}`, {
      method: "DELETE",
    }),
};
