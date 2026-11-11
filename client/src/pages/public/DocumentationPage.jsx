import {
  BookOpen,
  UserCircle,
  Headphones,
  ShieldCheck,
  Code2,
  Layers,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router";

const sections = [
  {
    id: "getting-started",
    icon: BookOpen,
    title: "Getting Started",
    steps: [
      {
        heading: "1. Register an account",
        body: 'Navigate to /register and create a new account. You will be assigned the "customer" role by default, giving you access to the Customer Portal.',
      },
      {
        heading: "2. Log in",
        body: "Go to /login and sign in with your credentials. HelpDesk uses JWT-based session management — your session is kept secure and automatically renewed.",
      },
      {
        heading: "3. Create your first ticket",
        body: 'From your Customer Dashboard, click "Create Ticket". Provide a clear title, a detailed description, and select the appropriate priority level. Submit and your ticket is live.',
      },
      {
        heading: "4. Track & communicate",
        body: "Monitor your ticket's status from the portal. Add comments to provide more context. You'll receive real-time notifications whenever the status changes or an agent replies.",
      },
    ],
  },
];

const userGuide = [
  "Log in and navigate to your Customer Dashboard.",
  'Use "Create Ticket" to submit a new support request.',
  "Set a priority and describe your issue clearly.",
  "Watch for real-time notifications as your ticket is assigned and worked on.",
  "Respond to agent comments directly on the ticket thread.",
  "Once resolved, review the resolution and close the ticket.",
];

const agentGuide = [
  "Log in — your Agent Workspace shows tickets assigned to you.",
  "Open a ticket to read the full description and customer comments.",
  "Update the ticket status (In Progress, Resolved) as you work.",
  "Add comments to communicate with the customer or leave internal notes.",
  "Resolve and close tickets once the issue is fully addressed.",
];

const adminGuide = [
  "Access the Admin Dashboard for a full view of all tickets.",
  "Assign incoming open tickets to available agents.",
  "Monitor ticket volume, priorities, and resolution rates.",
  "Manage staff accounts — create agent accounts and control access.",
  "Super admins can additionally create admin accounts and manage all users.",
];

const apiRoutes = [
  { method: "POST", path: "/api/user/register", desc: "Register a new user account" },
  { method: "POST", path: "/api/user/login", desc: "Authenticate and receive a JWT" },
  { method: "GET", path: "/api/user/profile", desc: "Get current user profile (auth required)" },
  { method: "GET", path: "/api/tickets", desc: "List tickets (scoped by role)" },
  { method: "POST", path: "/api/tickets", desc: "Create a new ticket (customer)" },
  { method: "GET", path: "/api/tickets/:id", desc: "Get a single ticket with comments" },
  { method: "PATCH", path: "/api/tickets/:id", desc: "Update ticket status or assignment" },
  { method: "POST", path: "/api/tickets/:id/comments", desc: "Add a comment to a ticket" },
  { method: "GET", path: "/api/admin/staff", desc: "List all staff members (admin+)" },
  { method: "POST", path: "/api/admin/staff", desc: "Create a new agent/admin account (admin+)" },
];

const methodColor = {
  GET: "bg-blue-50 text-blue-700",
  POST: "bg-green-50 text-green-700",
  PATCH: "bg-amber-50 text-amber-700",
  DELETE: "bg-red-50 text-red-700",
};

export default function DocumentationPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-paper">
      {/* Page header */}
      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-brand">
            <span className="size-2 rounded-full bg-brand" />
            Documentation
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            HelpDesk Documentation
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
            Everything you need to know about using, administering, and
            building on HelpDesk.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">

        {/* Quick nav */}
        <nav className="mb-8 flex flex-wrap gap-2" aria-label="Documentation sections">
          {[
            { label: "Getting Started", href: "#getting-started" },
            { label: "User Guide", href: "#user-guide" },
            { label: "Agent Guide", href: "#agent-guide" },
            { label: "Admin Guide", href: "#admin-guide" },
            { label: "API", href: "#api" },
            { label: "Architecture", href: "#architecture" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-medium text-muted transition hover:border-brand/40 hover:text-brand"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Getting Started */}
        <section id="getting-started" className="scroll-mt-20">
          <div className="rounded-lg border border-line bg-white p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-mist text-forest">
                <BookOpen size={18} />
              </span>
              <h2 className="text-lg font-semibold text-ink">Getting Started</h2>
            </div>
            <div className="mt-6 space-y-5">
              {sections[0].steps.map(({ heading, body }) => (
                <div key={heading} className="flex gap-4">
                  <ChevronRight size={16} className="mt-1 shrink-0 text-brand" />
                  <div>
                    <p className="text-sm font-semibold text-ink">{heading}</p>
                    <p className="mt-1 text-sm leading-6 text-muted">{body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-dark"
              >
                Create account <ArrowRight size={14} />
              </Link>
              <Link
                to="/login"
                className="inline-flex h-9 items-center rounded-md border border-line bg-white px-4 text-sm font-medium text-ink transition hover:bg-mist"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>

        {/* User Guide */}
        <section id="user-guide" className="mt-6 scroll-mt-20">
          <div id="customer-guide" className="scroll-mt-20 rounded-lg border border-line bg-white p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-mist text-forest">
                <UserCircle size={18} />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-ink">User Guide</h2>
                <p className="text-xs text-muted">For customers / end users</p>
              </div>
            </div>
            <ol className="mt-5 space-y-3">
              {userGuide.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-mist text-xs font-semibold text-forest">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Agent Guide */}
        <section id="agent-guide" className="mt-6 scroll-mt-20">
          <div className="rounded-lg border border-line bg-white p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-mist text-forest">
                <Headphones size={18} />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-ink">Agent Guide</h2>
                <p className="text-xs text-muted">For support agents</p>
              </div>
            </div>
            <ol className="mt-5 space-y-3">
              {agentGuide.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-mist text-xs font-semibold text-forest">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Admin Guide */}
        <section id="admin-guide" className="mt-6 scroll-mt-20">
          <div className="rounded-lg border border-line bg-white p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-mist text-forest">
                <ShieldCheck size={18} />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-ink">Admin Guide</h2>
                <p className="text-xs text-muted">For admins and super admins</p>
              </div>
            </div>
            <ol className="mt-5 space-y-3">
              {adminGuide.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-mist text-xs font-semibold text-forest">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* API Documentation */}
        <section id="api" className="mt-6 scroll-mt-20">
          <div id="api-documentation" className="scroll-mt-20 rounded-lg border border-line bg-white p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-mist text-forest">
                <Code2 size={18} />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-ink">API Documentation</h2>
                <p className="text-xs text-muted">Express REST API — base URL: /api</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">
              The backend exposes a RESTful API under three main route groups:{" "}
              <code className="rounded bg-mist px-1.5 py-0.5 font-mono text-xs text-forest">/api/user</code>{" "}
              for authentication and profiles,{" "}
              <code className="rounded bg-mist px-1.5 py-0.5 font-mono text-xs text-forest">/api/tickets</code>{" "}
              for ticket operations, and{" "}
              <code className="rounded bg-mist px-1.5 py-0.5 font-mono text-xs text-forest">/api/admin</code>{" "}
              for administrative functions. All protected routes require a valid JWT in the
              Authorization header.
            </p>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-xs font-semibold uppercase tracking-wide text-muted">
                    <th className="pb-2 pr-4">Method</th>
                    <th className="pb-2 pr-4">Endpoint</th>
                    <th className="pb-2">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {apiRoutes.map(({ method, path, desc }) => (
                    <tr key={path}>
                      <td className="py-2.5 pr-4">
                        <span className={`rounded px-2 py-0.5 text-xs font-bold ${methodColor[method] ?? "bg-mist text-muted"}`}>
                          {method}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4">
                        <code className="font-mono text-xs text-forest">{path}</code>
                      </td>
                      <td className="py-2.5 text-muted">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section id="architecture" className="mt-6 scroll-mt-20">
          <div className="rounded-lg border border-line bg-white p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-mist text-forest">
                <Layers size={18} />
              </span>
              <h2 className="text-lg font-semibold text-ink">Architecture Overview</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">
              HelpDesk is a monorepo containing two main directories:
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                {
                  label: "client/",
                  desc: "React 19 frontend with Vite, Tailwind CSS v4, and React Router v7. Handles all UI, routing, and real-time Socket.io events.",
                },
                {
                  label: "server/",
                  desc: "Node.js + Express.js REST API backend. Handles authentication, business logic, and real-time events via Socket.io.",
                },
                {
                  label: "MongoDB (Atlas / local)",
                  desc: "Document database for all data — users, tickets, comments. Accessed via Mongoose ORM with structured schemas.",
                },
                {
                  label: "JWT + Argon2",
                  desc: "Stateless authentication with signed JWT tokens. Passwords stored as Argon2 hashes — never in plain text.",
                },
              ].map(({ label, desc }) => (
                <div key={label} className="rounded-md border border-line bg-paper p-4">
                  <p className="font-mono text-xs font-semibold text-forest">{label}</p>
                  <p className="mt-1.5 text-sm text-muted">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/features"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            See all features
          </Link>
          <Link
            to="/faq"
            className="inline-flex h-10 items-center rounded-md border border-line bg-white px-4 text-sm font-semibold text-ink transition hover:bg-mist"
          >
            Browse FAQ
          </Link>
        </div>
      </div>
    </main>
  );
}
