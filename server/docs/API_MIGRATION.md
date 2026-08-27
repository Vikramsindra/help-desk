# API Migration Guide

> **Migration Date:** 2026-08-27  
> **Scope:** All endpoints standardized to `ApiResponse`/`ApiError` envelopes.

---

## Why This Migration?

Previously, each controller built its own response JSON by hand, resulting in:

- Inconsistent root keys (`ticket`, `tickets`, `comment`, `comments`, `user`, bare objects)
- Mixed error keys (`error` in some places, `message` in others)
- Bare documents returned without a success envelope (`res.json(ticket)`)
- No machine-readable error codes — frontend had to match error messages by string
- Stack traces could leak in unexpected error paths

This migration introduces two shared classes (`ApiResponse`, `ApiError`) and a single global error middleware to enforce a consistent contract for all current and future endpoints.

---

## Breaking Changes Summary

> [!CAUTION]
> All frontend or client code consuming this API must be updated for these changes.

| Endpoint | What Changed | Frontend Impact |
|---|---|---|
| All success responses | Added `success: true` + `message` at root | Must read from `data` not root |
| All error responses | New `{ success:false, error:{ code, message } }` shape | Must use `error.code` not `error` or `message` at root |
| `GET /api/tickets/admin` | `tickets` → `data.items` | Update list rendering |
| `GET /api/tickets/admin` | `pagination.totalTickets` → `data.pagination.totalItems` | Update pagination display |
| `GET /api/tickets/admin` | Added `hasNextPage`, `hasPreviousPage` | Optional — enables next/prev buttons |
| `GET /api/tickets/my-ticket` | `tickets` → `data.items` | Update list rendering |
| `GET /api/tickets/assigned-to-me` | `tickets` → `data.items` | Update list rendering |
| `GET /api/tickets/:id` | Bare ticket object → `data` envelope | Read `res.data` not `res` |
| `PATCH /api/tickets/:id` | `ticket` → `data` | Read `res.data` not `res.ticket` |
| `PATCH /api/tickets/:ticketId/assign` | `ticket` → `data` | Read `res.data` not `res.ticket` |
| `DELETE /api/tickets/:id` | `ticketId` → `data.ticketId` | Read `res.data.ticketId` |
| `POST /api/user/register` | `accessToken`, `user` → `data.accessToken`, `data.user` | Read from `data` |
| `POST /api/user/login` | `accessToken`, `user` → `data.accessToken`, `data.user` | Read from `data` |
| `POST /api/user/refresh` | `accessToken` → `data.accessToken` | Read from `data` |
| `POST /api/admin/users` | `user` → `data` | Read from `data` |
| `POST /api/tickets/:id/comments` | `comment` → `data` | Read from `data` |
| `GET /api/tickets/:id/comments` | `comments` → `data.items` | Update list rendering |
| `DELETE /api/tickets/:id/comments/:id` | `commentId` → `data.commentId` | Read `data.commentId` |

---

## Migration Patterns

### Before — reading a single resource

```js
// OLD
const ticket = await fetch(`/api/tickets/${id}`, { headers }).then(r => r.json());
// ticket was the raw document: ticket.title, ticket.status, ...
```

```js
// NEW
const res = await fetch(`/api/tickets/${id}`, { headers }).then(r => r.json());
const ticket = res.data;   // <-- always read from .data
// ticket.title, ticket.status, ...
```

---

### Before — reading a list

```js
// OLD
const { tickets, pagination } = await fetch(`/api/tickets/admin`).then(r => r.json());
const total = pagination.totalTickets;
```

```js
// NEW
const res = await fetch(`/api/tickets/admin`).then(r => r.json());
const tickets = res.data.items;          // <-- data.items
const pagination = res.data.pagination;  // <-- data.pagination
const total = pagination.totalItems;     // <-- totalItems (not totalTickets)
const hasNext = pagination.hasNextPage;  // <-- new field
```

---

### Before — reading auth tokens

```js
// OLD
const { accessToken, user } = await fetch(`/api/user/login`, { method: "POST", ... }).then(r => r.json());
```

```js
// NEW
const res = await fetch(`/api/user/login`, { method: "POST", ... }).then(r => r.json());
const { accessToken, user } = res.data;  // <-- nested in data
```

---

### Before — handling errors

```js
// OLD — inconsistent, sometimes "error", sometimes "message"
if (!res.ok) {
  const { error, message } = await res.json();
  showError(error || message);
}
```

```js
// NEW — always error.code + error.message
if (!res.ok) {
  const { error } = await res.json();
  console.log(error.code);     // "TICKET_NOT_FOUND"
  console.log(error.message);  // "Ticket not found or access denied"
  console.log(error.details);  // only for VALIDATION_ERROR

  // Example: show user-friendly message based on code
  if (error.code === "TOKEN_EXPIRED") redirectToLogin();
  if (error.code === "VALIDATION_ERROR") showFormErrors(error.details);
}
```

---

## Removed Behaviors

| Old Behavior | Replacement | Notes |
|---|---|---|
| `{ error: "..." }` at root for 4xx errors | `{ success: false, error: { code, message } }` | All controllers |
| `{ message: "..." }` at root for 4xx errors | `{ success: false, error: { code, message } }` | Middlewares + controllers |
| `{ message: "Internal server error" }` for 500 | `{ success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } }` | Consistent 500 shape |
| Bare ticket document at response root (`res.json(ticket)`) | `res.json(new ApiResponse(ticket, "..."))` | `getTicketDetailController` |
| `totalTickets` in pagination | `totalItems` | `getAllTicketsController` |
| `tickets` key in list responses | `data.items` | All list controllers |
| `comments` key in list responses | `data.items` | Comment controller |
| `ticket` key in update/assign responses | `data` | Ticket controller |
| `comment` key in create response | `data` | Comment controller |

---

## Deprecated Fields

These fields no longer exist in any response. Remove them from frontend code:

- `res.tickets` → `res.data.items`
- `res.ticket` → `res.data`
- `res.comments` → `res.data.items`
- `res.comment` → `res.data`
- `res.user` (top-level in auth responses) → `res.data.user`
- `res.accessToken` (top-level) → `res.data.accessToken`
- `res.pagination.totalTickets` → `res.data.pagination.totalItems`
- `res.error` (string) → `res.error.code` + `res.error.message`

---

## No-Change Endpoints

These endpoints are **not affected** by the migration:

| Endpoint | Reason |
|---|---|
| `POST /api/user/logout` | 204 No Content — no body before or after |
| `GET /api/health` | Documented exception — minimal health-check shape retained |

---

## Affected Frontend Files

The client directory is currently empty. When the frontend is implemented, the following files will need updating based on which endpoints they call:

| Concern | Files to update |
|---|---|
| Auth (login, register, refresh) | Auth store, login page, auth interceptor |
| Ticket lists | Ticket list page, admin dashboard |
| Ticket detail | Ticket detail page |
| Ticket mutations | Create/edit/delete ticket forms |
| Comment list | Ticket detail page (comment section) |
| Error handling | Global API error interceptor / toast handler |

---

## Compatibility Concerns

1. **No backwards compatibility is provided** — the old response shapes are gone.
2. **The `logoutController` (204)** is unchanged — no migration needed.
3. **JWT error codes** are now machine-readable — frontend can react to specific codes (`TOKEN_EXPIRED`, `INVALID_CREDENTIALS`) rather than matching message strings.
4. **Validation `details`** are now forwarded — frontend can highlight specific form fields using `error.details[].path`.
