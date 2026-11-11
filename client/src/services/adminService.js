import { apiFetch } from "../lib/api";
import { toQueryString } from "../lib/utils";

export const adminService = {
  listAgents: (params = {}) => {
    const query = toQueryString(params);
    return apiFetch(`/admin/agents${query ? `?${query}` : ""}`);
  },
  listCustomers: (params = {}) => {
    const query = toQueryString(params);
    return apiFetch(`/admin/customers${query ? `?${query}` : ""}`);
  },
  getCustomer: (customerId) => apiFetch(`/admin/customers/${customerId}`),
  updateCustomer: (customerId, updates) =>
    apiFetch(`/admin/customers/${customerId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    }),
  listStaff: (params = {}) => {
    const query = toQueryString(params);
    return apiFetch(`/admin/users${query ? `?${query}` : ""}`);
  },
  getStaff: (staffId) => apiFetch(`/admin/users/${staffId}`),
  createStaff: (staff) =>
    apiFetch("/admin/users", {
      method: "POST",
      body: JSON.stringify(staff),
    }),
  updateStaff: (staffId, updates) =>
    apiFetch(`/admin/users/${staffId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    }),
};
