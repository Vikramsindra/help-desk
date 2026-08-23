# Help Desk API

## Roles

| Action             | user        | agent                       | admin            | super_admin      |
| ------------------ | ----------- | --------------------------- | ---------------- | ---------------- |
| Register publicly  | user only   | -                           | -                | -                |
| Create agent/admin | -           | -                           | -                | yes              |
| View tickets       | Own         | Assigned                    | All              | All              |
| Update tickets     | Own content | Assigned operational fields | Permitted fields | Permitted fields |
| Change status      | no          | Assigned                    | yes              | yes              |
| Assign tickets     | no          | no                          | yes              | yes              |
| Comment            | Own         | Assigned                    | All              | All              |
| Delete tickets     | Own         | no                          | All              | All              |

## Configuration

Copy `.env.example` to `.env` and set `MONGO_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and `FRONTEND_ORIGINS`. `COOKIE_SAME_SITE` defaults to `lax`; use `none` only when HTTPS and cross-site cookies are required.

## Bootstrap

Set `SUPER_ADMIN_NAME`, `SUPER_ADMIN_EMAIL`, and `SUPER_ADMIN_PASSWORD`, then run:

```sh
npm run seed:superadmin
```

The seed is idempotent and never prints the password. Public registration never accepts a role. Passwords and refresh tokens are not returned; refresh tokens are rotated and only SHA-256 hashes are stored. Logout revokes the stored hash and clears the HttpOnly cookie.

## API examples

```sh
curl -X POST http://localhost:8080/api/user/register -H "Content-Type: application/json" -d '{"name":"Ada User","email":"ada@example.com","password":"Password@123"}'
curl -X POST http://localhost:8080/api/admin/users -H "Authorization: Bearer SUPER_ADMIN_ACCESS_TOKEN" -H "Content-Type: application/json" -d '{"name":"Support Agent","email":"agent@example.com","password":"StrongPassword@123","role":"agent"}'
curl -X PATCH http://localhost:8080/api/tickets/TICKET_ID/assign -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" -H "Content-Type: application/json" -d '{"assignedTo":"AGENT_ID"}'
curl -i -X POST http://localhost:8080/api/user/logout
```

Endpoints include `POST /api/tickets`, `GET /api/tickets/assigned-to-me`, `GET /api/tickets/admin`, `PATCH /api/tickets/:id`, and comments at `/api/tickets/:ticketId/comments`.

## Development and tests

```sh
npm install
npm test
npm start
```

The application connects to MongoDB before listening. `GET /api/health` remains available. Integration tests should use an isolated MongoDB instance; this checkout currently has no MongoDB test dependency or existing test suite.
