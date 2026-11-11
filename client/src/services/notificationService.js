import { apiFetch } from "../lib/api";

export const notificationService = {
  list: (page = 1, limit = 20) =>
    apiFetch(`/notifications?page=${page}&limit=${limit}`),
  markRead: (notificationId) =>
    apiFetch(`/notifications/${notificationId}/read`, { method: "PATCH" }),
  markAllRead: () => apiFetch("/notifications/read-all", { method: "PATCH" }),
};
