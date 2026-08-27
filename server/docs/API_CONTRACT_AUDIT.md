# API Contract Audit

> **Audit Date:** 2026-08-27  
> **Purpose:** Documents every controller response before and after the `ApiResponse`/`ApiError` standardization.

---

## Audit Summary

| Controller | Functions Audited | Success Fixed | Error Fixed | Status |
|---|:---:|:---:|:---:|:---:|
| `Ticket.Controller.js` | 8 | 8 | 8 | ✅ Done |
| `User.Controller.js` | 5 | 4 (+1 exception) | 5 | ✅ Done |
| `Comment.Controller.js` | 3 | 3 | 3 | ✅ Done |
| `auth.Middleware.js` | 1 | N/A | 4 | ✅ Done |
| `role.Middleware.js` | 1 | N/A | 2 | ✅ Done |
| `error.Middleware.js` | 2 | N/A | Rewritten | ✅ Done |

---

## Ticket.Controller.js

### `createTicket` — POST /api/tickets

**Before:**
```js
// Success
return res.status(201).json({ message: "Ticket created successfully", ticket });
// Error (validation)
res.status(400).json({ message: error.details[0].message });
// Error (catch)
return res.status(500).json({ message: "Internal server error" });
```

**After:**
```js
// Success
return res.status(201).json(new ApiResponse(ticket, "Ticket created successfully"));
// Error (validation)
return next(new ApiError(400, "VALIDATION_ERROR", error.details[0].message, error.details));
// Error (catch)
next(error);  // → global handler → INTERNAL_ERROR
```

**Breaking changes:** None — shape is additive (added `success`, renamed `ticket` → `data`).

---

### `getAllTicketsController` — GET /api/tickets/admin

**Before:**
```json
{
  "tickets": [...],
  "pagination": { "page": 1, "limit": 20, "totalTickets": 57, "totalPages": 3 }
}
```

**After:**
```json
{
  "success": true,
  "message": "Tickets fetched successfully",
  "data": {
    "items": [...],
    "pagination": {
      "page": 1, "limit": 20, "totalItems": 57, "totalPages": 3,
      "hasNextPage": true, "hasPreviousPage": false
    }
  }
}
```

**Breaking changes:**
- `tickets` → `data.items`
- `pagination.totalTickets` → `data.pagination.totalItems`
- Added `data.pagination.hasNextPage`, `data.pagination.hasPreviousPage`
- Added `success`, `message` at root

---

### `getMyTicketsController` — GET /api/tickets/my-ticket

**Before:**
```json
{ "tickets": [...] }
```

**After:**
```json
{ "success": true, "message": "My tickets fetched successfully", "data": { "items": [...] } }
```

**Breaking changes:** `tickets` → `data.items`.

---

### `getAssignedTicketsController` — GET /api/tickets/assigned-to-me

**Before:**
```json
{ "tickets": [...] }
```

**After:**
```json
{ "success": true, "message": "Assigned tickets fetched successfully", "data": { "items": [...] } }
```

**Breaking changes:** `tickets` → `data.items`.

---

### `getTicketDetailController` — GET /api/tickets/:id

**Before (critical bug):**
```js
return res.status(200).json(ticket);  // bare Mongoose document at root!
```

**After:**
```json
{
  "success": true,
  "message": "Ticket fetched successfully",
  "data": { "_id": "...", "title": "...", ... }
}
```

**Breaking changes:**  
- Entire shape change — ticket fields were at the root, now inside `data`.
- Error keys also changed: `error: "..."` → `{ success: false, error: { code, message } }`.

---

### `deleteTicketController` — DELETE /api/tickets/:id

**Before:**
```json
{ "message": "Ticket deleted successfully", "ticketId": "..." }
```

**After:**
```json
{ "success": true, "message": "Ticket deleted successfully", "data": { "ticketId": "..." } }
```

**Breaking changes:** `ticketId` moved from root into `data`.

---

### `updateTicketController` — PATCH /api/tickets/:id

**Before:**
```json
{ "message": "Ticket updated successfully", "ticket": { ... } }
```

**After:**
```json
{ "success": true, "message": "Ticket updated successfully", "data": { "_id": "...", ... } }
```

**Breaking changes:** `ticket` → `data`.

---

### `assignTicketController` — PATCH /api/tickets/:ticketId/assign

**Before:**
```js
return res.status(200).json({ ticket: updatedTicket });
```

**After:**
```json
{ "success": true, "message": "Ticket assigned successfully", "data": { "_id": "...", ... } }
```

**Breaking changes:** `ticket` → `data`. Also split `!ticket || !agent` check into two separate 404 errors with distinct codes.

---

## User.Controller.js

### `registerController` — POST /api/user/register

**Before:**
```js
res.status(201).json({ accessToken, user: sanitizeUser(newUser) });
```

**After:**
```json
{ "success": true, "message": "Registration successful", "data": { "accessToken": "...", "user": { ... } } }
```

**Breaking changes:** `accessToken` and `user` moved inside `data`.

---

### `loginController` — POST /api/user/login

**Before:**
```js
res.status(200).json({ accessToken, user: sanitizeUser(user) });
// Error used "error" key:
res.status(404).json({ error: "Invalid credentials" });
```

**After:**
```json
{ "success": true, "message": "Login successful", "data": { "accessToken": "...", "user": { ... } } }
```

**Breaking changes:**
- `accessToken` and `user` moved inside `data`.
- Error envelope changed from `{ error: "..." }` to `{ success: false, error: { code, message } }`.
- 404 user-not-found now returns **401** (security best practice, prevents user enumeration).

---

### `refreshController` — POST /api/user/refresh

**Before:**
```js
return res.status(200).json({ accessToken });
```

**After:**
```json
{ "success": true, "message": "Token refreshed successfully", "data": { "accessToken": "..." } }
```

**Breaking changes:** `accessToken` moved inside `data`. Improved JWT error codes.

---

### `createStaffController` — POST /api/admin/users

**Before:**
```js
return res.status(201).json({ user: sanitizeUser(user) });
```

**After:**
```json
{ "success": true, "message": "Staff user created successfully", "data": { "id": "...", "name": "...", "email": "...", "role": "..." } }
```

**Breaking changes:** `user` → `data`.

---

### `logoutController` — POST /api/user/logout

**Status:** No change. Returns `204 No Content` — documented exception to `ApiResponse`.

---

## Comment.Controller.js

### `createCommentController` — POST /api/tickets/:ticketId/comments

**Before:**
```json
{ "message": "Comment created successfully", "comment": { ... } }
```

**After:**
```json
{ "success": true, "message": "Comment created successfully", "data": { "_id": "...", ... } }
```

**Breaking changes:** `comment` → `data`.

---

### `getTicketCommentsController` — GET /api/tickets/:ticketId/comments

**Before:**
```json
{ "comments": [...] }
```

**After:**
```json
{ "success": true, "message": "Comments fetched successfully", "data": { "items": [...] } }
```

**Breaking changes:** `comments` → `data.items`.

---

### `deleteCommentController` — DELETE /api/tickets/:ticketId/comments/:commentId

**Before:**
```json
{ "message": "Comment deleted successfully", "commentId": "..." }
```

**After:**
```json
{ "success": true, "message": "Comment deleted successfully", "data": { "commentId": "..." } }
```

**Breaking changes:** `commentId` moved inside `data`.

---

## Middleware Audit

### `auth.Middleware.js`

| Before | After |
|---|---|
| `res.status(401).json({ message: "Access token required" })` | `next(new ApiError(401, "TOKEN_MISSING", ...))` |
| `res.status(401).json({ message: "Invalid authorization format" })` | `next(new ApiError(401, "TOKEN_INVALID_FORMAT", ...))` |
| `res.status(401).json({ message: "Access token expired" })` | `next(new ApiError(401, "TOKEN_EXPIRED", ...))` |
| `res.status(401).json({ message: "Invalid access token" })` | `next(new ApiError(401, "TOKEN_INVALID", ...))` |
| `res.status(500).json({ message: "Internal server error" })` | `next(error)` → global handler |

### `role.Middleware.js`

| Before | After |
|---|---|
| `res.status(401).json({ message: "Authentication required" })` | `next(new ApiError(401, "AUTH_REQUIRED", ...))` |
| `res.status(403).json({ message: "Access denied" })` | `next(new ApiError(403, "ACCESS_DENIED", ...))` |

### `error.Middleware.js`

| Before | After |
|---|---|
| `res.json({ message: "..." })` for all errors | `res.json({ success: false, error: { code, message, details? } })` |
| No distinction between operational and unexpected errors | `isOperational` flag gates safe vs generic message |
| No `code` field | Machine-readable `code` always present |
| `notFoundMiddleware` responded directly | Now calls `next(ApiError)` for consistent envelope |

---

## Grep Verification Checklist

Run these commands to confirm no legacy patterns remain:

```bash
# Should return NO results:
grep -rn 'res\.json.*success.*true' src/controller/
grep -rn 'res\.json.*ticket[^s]' src/controller/
grep -rn 'res\.json.*comments' src/controller/
grep -rn 'res\.json.*"error"' src/controller/
grep -rn 'res\.status(500)' src/controller/
grep -rn 'res\.status(500)' src/middlewares/
```
