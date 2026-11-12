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

## Docker

Build the backend image from this directory. The image uses Node.js 22, installs the locked production dependencies, and listens on port `8080`. It does not contain `.env`; provide runtime configuration through an environment file or `docker run -e` options. `MONGO_URI` is required for startup. Set `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` for authenticated routes, and set `FRONTEND_ORIGINS` to the browser application's origin.

In PowerShell, after creating and filling in the private `.env` file:

```powershell
docker build -f .\dockerfile -t help-desk-backend:local .
docker run --detach --name help-desk-backend -p 8080:8080 --env-file .\.env --env NODE_ENV=production help-desk-backend:local
Invoke-RestMethod http://localhost:8080/api/health
docker exec help-desk-backend node -e "fetch('http://127.0.0.1:8080/api/health').then((r) => { console.log(r.status); process.exit(r.ok ? 0 : 1); }).catch(() => process.exit(1))"
docker inspect --format='{{.State.Health.Status}}' help-desk-backend
```

The health endpoint responds after the server successfully connects to MongoDB. Socket.IO uses the same published port.

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

Endpoints include `GET /api/user/me`, ticket CRUD and assignment, role-specific statistics at `GET /api/tickets/dashboard/stats`, comments at `/api/tickets/:ticketId/comments`, staff management at `/api/admin/users`, and user-scoped notifications at `/api/notifications`. See [docs/API_CONTRACT.md](docs/API_CONTRACT.md) for request, response, filter, and permission details.

## Development and tests

```sh
npm install
npm test
npm start
```

The application connects to MongoDB before listening. `GET /api/health` remains available. The Jest integration suite uses `mongodb-memory-server`; its MongoDB binary must be downloadable or already cached. Run `npm test` from this directory. The API uses Helmet, a 32 KB JSON/urlencoded body limit, credentialed origin allow-listing, login/register/refresh rate limiting, and rejects Mongo-style operator keys in request input.
