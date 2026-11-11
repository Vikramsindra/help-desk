export const ROLES = {
  CUSTOMER: "user",
  AGENT: "agent",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
};

export const TICKET_STATUSES = ["open", "in progress", "resolved", "closed"];

export const TICKET_PRIORITIES = ["low", "medium", "high"];

export const HOME_BY_ROLE = {
  user: "/customer/dashboard",
  agent: "/agent/dashboard",
  admin: "/admin/dashboard",
  super_admin: "/super-admin/dashboard",
};
