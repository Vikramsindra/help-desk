import { apiFetch } from "../lib/api";

let refreshPromise = null;

export const authService = {
  login: (email, password) =>
    apiFetch("/user/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (name, email, password) =>
    apiFetch("/user/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),
  refresh: () => {
    if (!refreshPromise) {
      refreshPromise = apiFetch("/user/refresh", { method: "POST" }).finally(
        () => {
          refreshPromise = null;
        },
      );
    }
    return refreshPromise;
  },
  me: () => apiFetch("/user/me"),
  logout: () => apiFetch("/user/logout", { method: "POST" }),
};
