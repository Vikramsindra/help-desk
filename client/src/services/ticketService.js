import { apiFetch } from "../lib/api";
import { toQueryString } from "../lib/utils";

export const ticketService = {
  list: (path, params = {}) => {
    const query = toQueryString(params);
    return apiFetch(`${path}${query ? `?${query}` : ""}`);
  },
  get: (ticketId) => apiFetch(`/tickets/${ticketId}`),
  create: (ticket) =>
    apiFetch("/tickets", { method: "POST", body: JSON.stringify(ticket) }),
  update: (ticketId, updates) =>
    apiFetch(`/tickets/${ticketId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    }),
  remove: (ticketId) => apiFetch(`/tickets/${ticketId}`, { method: "DELETE" }),
  assign: (ticketId, assignedTo) =>
    apiFetch(`/tickets/${ticketId}/assign`, {
      method: "PATCH",
      body: JSON.stringify({ assignedTo }),
    }),
  dashboardStats: () => apiFetch("/tickets/dashboard/stats"),
};
