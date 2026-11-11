# Helpdesk Support Platform

A full-stack help desk application for submitting and managing support tickets. Customers, agents, admins, and super-admins have role-based access to ticket workflows and staff management.

## Features

- Customer registration, ticket creation, and ticket history
- Agent queues for assigned tickets and status updates
- Admin ticket oversight, assignment, and staff management
- Super-admin staff administration
- Ticket comments, notifications, dashboards, search, filters, and pagination
- JWT access tokens with rotating, HTTP-only refresh cookies
- Public help, FAQ, documentation, and policy pages

## Stack

- Frontend: React, Vite, React Router, Tailwind CSS
- Backend: Node.js, Express, Mongoose, MongoDB, Socket.IO
- Tests: Jest, Supertest, and `mongodb-memory-server`

## Requirements

- Node.js 20.19+ (or 22.12+)
- npm
- MongoDB, either local or a configured MongoDB Atlas database

## Configure the Backend

In PowerShell:

```powershell
Set-Location server
npm install
Copy-Item .env.example .env
```

Edit `server/.env` and set `MONGO_URI`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET`. Keep this file private and never commit it. The default API port is `8080`; `FRONTEND_ORIGINS` should include the frontend origin, normally `http://localhost:5173`.

Start the API:

```powershell
npm run dev
```

Use `npm start` for a non-watch server process. Do not start both commands at once because both bind the configured port. Verify the API at [http://localhost:8080/api/health](http://localhost:8080/api/health).

## Configure the Frontend

In a second terminal:

```powershell
Set-Location client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Vite proxies `/api` and `/socket.io` to `http://localhost:8080` by default. To use another backend address, set `VITE_API_PROXY_TARGET` in a client environment file.

## Demo Data and Credentials

The demo seed creates one account for each role and five sample tickets owned by the demo customer. It is idempotent and only creates missing records. It does not change existing passwords. It refuses to run unless explicitly enabled.

Review `MONGO_URI` first so you know which database will be modified. The command uses the configured URI; run it only against a development or staging database.

```powershell
Set-Location server
$env:SEED_DEMO_DATA = "true"
npm run seed:demo
Remove-Item Env:\SEED_DEMO_DATA
```

Demo account emails:

| Role              | Email                         | Password                                      |
| ----------------- | ----------------------------- | --------------------------------------------- |
| Customer (`user`) | `demo.customer@example.com`   | Randomly generated; printed only when created |
| Agent             | `demo.agent@example.com`      | Randomly generated; printed only when created |
| Admin             | `demo.admin@example.com`      | Randomly generated; printed only when created |
| Super admin       | `demo.superadmin@example.com` | Randomly generated; printed only when created |

Store the generated passwords securely when the seed first creates the accounts. A later seed run will reuse the accounts without revealing or resetting their passwords. These are working credentials for the configured database, so do not put their passwords in this public repository.

The auth integration tests use `login@test.com` with password `Password@123`. That account exists only in the test database and is not a login for the development database.

To create a separate super-admin from environment variables, set `SUPER_ADMIN_NAME`, `SUPER_ADMIN_EMAIL`, and `SUPER_ADMIN_PASSWORD`, then run `npm run seed:superadmin` from `server`.

## Tests and Build

Run the backend integration tests:

```powershell
Set-Location server
npm test
```

Run frontend checks:

```powershell
Set-Location client
npm run lint
npm run build
```

The integration test suite uses an in-memory MongoDB instance. Its MongoDB binary must be available locally or downloadable by `mongodb-memory-server`.

## API Documentation

See [server/docs/API_CONTRACT.md](server/docs/API_CONTRACT.md) for endpoint contracts, response shapes, filters, and permissions. The backend overview is in [server/README.md](server/README.md).
