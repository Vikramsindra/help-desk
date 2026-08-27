# API Contract

> **Version:** 1.0.0  
> **Base URL:** `/api`  
> **Last updated:** 2026-08-27

---

## Table of Contents

1. [Global Conventions](#global-conventions)
2. [Authentication](#authentication)
3. [Success Response Format](#success-response-format)
4. [Error Response Format](#error-response-format)
5. [Pagination Contract](#pagination-contract)
6. [Enum Values](#enum-values)
7. [Endpoint Table](#endpoint-table)
8. [Role-Permission Matrix](#role-permission-matrix)
9. [Request & Response Examples](#request--response-examples)
10. [Documented Exceptions](#documented-exceptions)

---

## Global Conventions

| Convention | Value |
|---|---|
| Content-Type | `application/json` |
| Character encoding | UTF-8 |
| Date format | ISO 8601 (`2026-08-27T10:00:00.000Z`) |
| ID format | MongoDB ObjectId (24-char hex string) |
| Empty list | `{ "items": [], "pagination": { ... } }` |
| Boolean strings | Not used — always proper `true`/`false` |

### HTTP Status Codes Used

| Code | Meaning |
|---|---|
| 200 | Success (GET, PATCH, DELETE) |
| 201 | Created (POST mutations) |
| 204 | No Content (logout — no body) |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized — missing or invalid token |
| 403 | Forbidden — authenticated but insufficient role |
| 404 | Not Found |
| 409 | Conflict — duplicate resource |
| 500 | Internal Server Error |

---

## Authentication

The API uses **JWT Bearer tokens** with an **HTTP-only refresh token cookie** for token rotation.

### Access Token

- Header: `Authorization: Bearer <accessToken>`
- Algorithm: HS256
- Expiry: **15 minutes**
- Secret: `JWT_ACCESS_SECRET` env var

### Refresh Token

- Stored as an **HTTP-only cookie** (`refreshToken`)
- Path: `/api/user`
- Expiry: **7 days**
- Rotated on every `/api/user/refresh` call
- Hash stored in DB (`sha256`) — single-use enforcement

### Authentication Flow

```
1. POST /api/user/register  OR  POST /api/user/login
   → Response: { data: { accessToken, user } }
   → Cookie: refreshToken (httpOnly)

2. Use accessToken in Authorization header for protected routes

3. When accessToken expires → POST /api/user/refresh
   → Cookie is read server-side
   → Response: { data: { accessToken } }  +  new refreshToken cookie

4. POST /api/user/logout → 204, cookie cleared
```

---

## Success Response Format

Every successful response (except documented exceptions) uses the **`ApiResponse`** envelope:

```json
{
  "success": true,
  "message": "Human-readable description",
  "data": <payload>
}
```

### Single Resource

```json
{
  "success": true,
  "message": "Ticket fetched successfully",
  "data": {
    "_id": "64abc123...",
    "title": "Login button broken",
    "status": "open",
    "priority": "high",
    "createdBy": { "_id": "...", "name": "Alice", "email": "alice@example.com" },
    "assignedTo": null,
    "createdAt": "2026-08-27T10:00:00.000Z",
    "updatedAt": "2026-08-27T10:00:00.000Z"
  }
}
```

### List Resource (Paginated)

```json
{
  "success": true,
  "message": "Tickets fetched successfully",
  "data": {
    "items": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 57,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

### List Resource (Non-Paginated)

```json
{
  "success": true,
  "message": "My tickets fetched successfully",
  "data": {
    "items": [ ... ]
  }
}
```

### Mutation Result

```json
{
  "success": true,
  "message": "Ticket deleted successfully",
  "data": {
    "ticketId": "64abc123..."
  }
}
```

---

## Error Response Format

All errors use the **`ApiError`** envelope produced by the global error middleware:

```json
{
  "success": false,
  "error": {
    "code": "MACHINE_READABLE_CODE",
    "message": "Human-readable description",
    "details": [ ... ]
  }
}
```

- `details` is **optional** — present only for validation errors.
- Stack traces are **never** included in any environment.

### Error Codes Reference

| Code | Status | Description |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Joi schema validation failed |
| `TICKET_ID_REQUIRED` | 400 | Ticket ID missing from params |
| `INVALID_TICKET_ID` | 400 | Ticket ID is not a valid ObjectId |
| `INVALID_ID` | 400 | One or more IDs are invalid |
| `ID_REQUIRED` | 400 | Required ID param missing |
| `COMMENT_TICKET_MISMATCH` | 400 | Comment belongs to a different ticket |
| `TOKEN_MISSING` | 401 | Authorization header absent |
| `TOKEN_INVALID_FORMAT` | 401 | Authorization header not `Bearer <token>` |
| `TOKEN_EXPIRED` | 401 | Access token has expired |
| `TOKEN_INVALID` | 401 | Access token signature is invalid |
| `INVALID_CREDENTIALS` | 401 | Email/password mismatch |
| `REFRESH_TOKEN_MISSING` | 401 | Refresh token cookie absent |
| `REFRESH_TOKEN_EXPIRED` | 401 | Refresh token has expired |
| `REFRESH_TOKEN_INVALID` | 401 | Refresh token invalid or not in DB |
| `AUTH_REQUIRED` | 401 | Request reached role check without auth |
| `USER_NOT_FOUND` | 401 | User from refresh token not found |
| `ACCESS_DENIED` | 403 | Role not permitted for this route |
| `AGENT_DELETE_FORBIDDEN` | 403 | Agents cannot delete tickets |
| `DELETE_FORBIDDEN` | 403 | Can only delete own comments |
| `TICKET_NOT_FOUND` | 404 | Ticket not found or no access |
| `AGENT_NOT_FOUND` | 404 | Assignee not found or not an agent |
| `COMMENT_NOT_FOUND` | 404 | Comment not found |
| `ROUTE_NOT_FOUND` | 404 | No matching route |
| `USER_ALREADY_EXISTS` | 409 | Email already registered |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## Pagination Contract

Paginated list endpoints accept:

| Query Param | Type | Default | Description |
|---|---|---|---|
| `page` | integer | `1` | 1-indexed page number |
| `limit` | integer | `20` | Items per page |
| `status` | string | — | Filter by ticket status |
| `priority` | string | — | Filter by ticket priority |

Pagination object in every list response:

```json
{
  "page": 1,
  "limit": 20,
  "totalItems": 57,
  "totalPages": 3,
  "hasNextPage": true,
  "hasPreviousPage": false
}
```

---

## Enum Values

### Ticket Status
`open` | `in progress` | `resolved` | `closed`

### Ticket Priority
`low` | `medium` | `high`

### User Role
`user` | `agent` | `admin` | `super_admin`

---

## Endpoint Table

| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/api/health` | No | Any | Health check |
| `POST` | `/api/user/register` | No | — | Register a new user |
| `POST` | `/api/user/login` | No | — | Login |
| `POST` | `/api/user/refresh` | Cookie | — | Rotate tokens |
| `POST` | `/api/user/logout` | Cookie | — | Logout (204) |
| `POST` | `/api/admin/users` | Bearer | `super_admin` | Create staff (agent/admin) |
| `POST` | `/api/tickets` | Bearer | any auth | Create ticket |
| `GET` | `/api/tickets/admin` | Bearer | `admin`, `super_admin` | List all tickets (paginated) |
| `GET` | `/api/tickets/my-ticket` | Bearer | `user` | List own tickets |
| `GET` | `/api/tickets/assigned-to-me` | Bearer | `agent` | List assigned tickets |
| `GET` | `/api/tickets/:id` | Bearer | owner/agent/admin | Get ticket detail |
| `PATCH` | `/api/tickets/:id` | Bearer | owner/agent/admin | Update ticket |
| `DELETE` | `/api/tickets/:id` | Bearer | owner/admin | Delete ticket |
| `PATCH` | `/api/tickets/:ticketId/assign` | Bearer | `admin`, `super_admin` | Assign ticket to agent |
| `GET` | `/api/tickets/:ticketId/comments` | Bearer | owner/agent/admin | List comments |
| `POST` | `/api/tickets/:ticketId/comments` | Bearer | owner/agent/admin | Add comment |
| `DELETE` | `/api/tickets/:ticketId/comments/:commentId` | Bearer | author/admin | Delete comment |

---

## Role-Permission Matrix

| Action | `user` | `agent` | `admin` | `super_admin` |
|---|:---:|:---:|:---:|:---:|
| Register / Login / Refresh / Logout | ✅ | ✅ | ✅ | ✅ |
| Create ticket | ✅ | ✅ | ✅ | ✅ |
| View own tickets | ✅ | — | — | — |
| View assigned tickets | — | ✅ | — | — |
| View all tickets (admin list) | — | — | ✅ | ✅ |
| View ticket detail (own) | ✅ | — | — | — |
| View ticket detail (assigned) | — | ✅ | — | — |
| View any ticket detail | — | — | ✅ | ✅ |
| Update ticket (title/desc/category) | ✅ (own) | — | ✅ | ✅ |
| Update ticket (priority/status) | — | ✅ (assigned) | ✅ | ✅ |
| Delete ticket | ✅ (own) | ❌ | ✅ | ✅ |
| Assign ticket | — | — | ✅ | ✅ |
| Add comment | ✅ (own ticket) | ✅ (assigned) | ✅ | ✅ |
| View comments | ✅ (own ticket) | ✅ (assigned) | ✅ | ✅ |
| Delete comment | ✅ (own comment) | ✅ (own comment) | ✅ | ✅ |
| Create staff (agent/admin) | — | — | — | ✅ |

---

## Request & Response Examples

### Register

**Request**
```http
POST /api/user/register
Content-Type: application/json

{
  "name": "Alice Smith",
  "email": "alice@example.com",
  "password": "Secure@Pass1"
}
```

**Response — 201**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": "64abc123...",
      "name": "Alice Smith",
      "email": "alice@example.com",
      "role": "user"
    }
  }
}
```

### Login

**Request**
```http
POST /api/user/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "Secure@Pass1"
}
```

**Response — 200**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": "64abc123...",
      "name": "Alice Smith",
      "email": "alice@example.com",
      "role": "user"
    }
  }
}
```

### Create Ticket

**Request**
```http
POST /api/tickets
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "Login button broken on mobile",
  "description": "The login button does not respond on iOS Safari.",
  "category": "Bug",
  "priority": "high"
}
```

**Response — 201**
```json
{
  "success": true,
  "message": "Ticket created successfully",
  "data": {
    "_id": "64abc123...",
    "title": "Login button broken on mobile",
    "description": "The login button does not respond on iOS Safari.",
    "category": "Bug",
    "priority": "high",
    "status": "open",
    "createdBy": "64user123...",
    "assignedTo": null,
    "createdAt": "2026-08-27T10:00:00.000Z",
    "updatedAt": "2026-08-27T10:00:00.000Z"
  }
}
```

### List Tickets (Admin — Paginated)

**Request**
```http
GET /api/tickets/admin?page=2&limit=10&status=open
Authorization: Bearer <adminAccessToken>
```

**Response — 200**
```json
{
  "success": true,
  "message": "Tickets fetched successfully",
  "data": {
    "items": [
      {
        "_id": "64abc123...",
        "title": "Login button broken on mobile",
        "status": "open",
        "priority": "high",
        "createdBy": { "_id": "...", "name": "Alice", "email": "alice@example.com" },
        "assignedTo": { "_id": "...", "name": "Bob Agent", "email": "bob@example.com" },
        "createdAt": "2026-08-27T10:00:00.000Z",
        "updatedAt": "2026-08-27T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 2,
      "limit": 10,
      "totalItems": 57,
      "totalPages": 6,
      "hasNextPage": true,
      "hasPreviousPage": true
    }
  }
}
```

### Error Example — Validation

**Response — 400**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "\"title\" is required",
    "details": [
      {
        "message": "\"title\" is required",
        "path": ["title"],
        "type": "any.required"
      }
    ]
  }
}
```

### Error Example — Not Found

**Response — 404**
```json
{
  "success": false,
  "error": {
    "code": "TICKET_NOT_FOUND",
    "message": "Ticket not found or access denied"
  }
}
```

---

## Documented Exceptions

| Endpoint | Why no `ApiResponse` |
|---|---|
| `POST /api/user/logout` | **HTTP 204 No Content** — a body must not be sent. |
| `GET /api/health` | Minimal health-check shape `{ status, message }` — intentionally simple for uptime monitors. |
