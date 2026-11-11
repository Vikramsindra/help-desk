import {
  Ticket,
  UserCheck,
  AlertTriangle,
  RefreshCcw,
  LayoutDashboard,
  Bell,
  MessageSquare,
  ShieldCheck,
  Lock,
  Users,
  Star,
  ClipboardList,
} from "lucide-react";
import { Link } from "react-router";

const features = [
  {
    icon: Ticket,
    title: "Ticket Management",
    description:
      "Create, view, update, and close support tickets with a full audit trail. Every request has a dedicated thread keeping all communication in one place.",
  },
  {
    icon: UserCheck,
    title: "Ticket Assignment",
    description:
      "Admins and super admins can assign tickets to specific agents, ensuring every request reaches the right person without delay.",
  },
  {
    icon: AlertTriangle,
    title: "Priority Management",
    description:
      "Set ticket priorities — low, medium, high, or critical — so agents can triage their queue and resolve the most urgent issues first.",
  },
  {
    icon: RefreshCcw,
    title: "Status Tracking",
    description:
      "Track tickets through their full lifecycle: Open → In Progress → Resolved → Closed. Customers see real-time status updates at every stage.",
  },
  {
    icon: ClipboardList,
    title: "Customer Portal",
    description:
      "A dedicated portal where customers can submit new tickets, view their history, check status updates, and read responses from agents.",
  },
  {
    icon: LayoutDashboard,
    title: "Agent Workspace",
    description:
      "A focused workspace for support agents: assigned ticket queue, status controls, comment threads, and all the context needed to resolve issues fast.",
  },
  {
    icon: Star,
    title: "Admin Dashboard",
    description:
      "Administrators get full visibility: ticket oversight, agent assignment, staff management, and platform-wide analytics in a single dashboard.",
  },
  {
    icon: Users,
    title: "Super Admin",
    description:
      "Super admins manage the entire platform — including creating admin accounts, managing all staff, and overseeing every ticket across the system.",
  },
  {
    icon: Bell,
    title: "Real-Time Notifications",
    description:
      "Powered by Socket.io, users receive instant notifications when tickets are updated, assigned, commented on, or resolved — no refreshing required.",
  },
  {
    icon: MessageSquare,
    title: "Comments & Collaboration",
    description:
      "Every ticket supports threaded comments. Customers and agents can communicate directly on the ticket, keeping all context in one place.",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access Control",
    description:
      "Four distinct roles — user/customer, agent, admin, and super_admin — each with precisely scoped permissions. No one sees more than they should.",
  },
  {
    icon: Lock,
    title: "Secure Authentication",
    description:
      "Passwords hashed with Argon2, sessions managed via JWT, and all API endpoints protected. Security is built in, not bolted on.",
  },
];

const solutions = [
  {
    id: "customer-support",
    title: "Customer Support Management",
    description:
      "Deliver consistent, high-touch support across all customer inquiries. Customers submit requests through a self-service portal, receive real-time status updates, and communicate directly with assigned support personnel without leaving their workspace.",
  },
  {
    id: "it-helpdesk",
    title: "IT Help Desk Management",
    description:
      "Centralize internal IT requests, hardware provisioning, bug reports, and software access needs. IT teams can categorize tickets, enforce triage priority, and coordinate rapid resolution with full activity audit trails.",
  },
  {
    id: "ticket-tracking",
    title: "Ticket Tracking and Resolution",
    description:
      "Maintain clear visibility over the lifecycle of every issue. From initial creation (Open) through triage (In Progress), verification (Resolved), and completion (Closed), both requesters and resolvers track progress with zero guesswork.",
  },
  {
    id: "team-collaboration",
    title: "Internal Team Collaboration",
    description:
      "Eliminate communication silos between support agents, technical specialists, and platform administrators. Threaded ticket comments and instant Socket.io notifications ensure everyone stays aligned on critical resolutions.",
  },
  {
    id: "support-team-management",
    title: "Support Team Management",
    description:
      "Equip team leads and administrators with centralized workload management. Assign tickets based on agent availability, reassign reassessments, monitor active queues, and provision staff roles with strict access controls.",
  },
  {
    id: "issue-management",
    title: "Issue and Incident Management",
    description:
      "Classify urgent service interruptions, track bug reports with priority tagging, and coordinate remediation workflows so high-severity incidents are addressed before they impact downstream operations.",
  },
  {
    id: "service-requests",
    title: "Service Request Management",
    description:
      "Streamline routine service requests with structured forms, predefined categories, and automated agent assignment, accelerating turnaround times for common repetitive tasks.",
  },
];

const statusBadges = [
  { label: "Open", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { label: "In Progress", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { label: "Resolved", color: "bg-green-50 text-green-700 border-green-200" },
  { label: "Closed", color: "bg-slate-100 text-slate-600 border-slate-200" },
];

const roles = ["user / customer", "agent", "admin", "super_admin"];

export default function FeaturesPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-paper">
      {/* Page header */}
      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-brand">
            <span className="size-2 rounded-full bg-brand" />
            Features
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Everything you need to run support
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
            HelpDesk brings together ticket management, real-time collaboration,
            role-based access control, and secure authentication in a single
            cohesive platform.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">

        {/* Feature grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-lg border border-line bg-white p-5 transition hover:border-brand/40 hover:shadow-sm"
            >
              <span className="grid size-9 place-items-center rounded-md bg-mist text-forest">
                <Icon size={18} />
              </span>
              <h3 className="mt-3 text-sm font-semibold text-ink">{title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-muted">{description}</p>
            </div>
          ))}
        </div>

        {/* Solutions Section */}
        <section id="solutions" className="mt-12 scroll-mt-20">
          <div className="border-b border-line pb-4 mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.13em] text-brand">
              Enterprise Solutions
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">
              Tailored solutions for modern support workflows
            </h2>
            <p className="mt-1 text-sm text-muted">
              Explore how HelpDesk adapts to support teams, IT operations, and internal service management.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {solutions.map((item) => (
              <div
                key={item.id}
                id={item.id}
                className="scroll-mt-24 rounded-lg border border-line bg-white p-6 transition hover:border-brand/40 hover:shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-brand" />
                  <h3 className="text-base font-semibold text-ink">{item.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Ticket Status */}
        <section className="mt-10 rounded-lg border border-line bg-white p-6 sm:p-8">
          <h2 className="text-base font-semibold text-ink">Ticket Status Lifecycle</h2>
          <p className="mt-1 text-sm text-muted">
            Every ticket moves through a clear, trackable pipeline from creation to closure.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {statusBadges.map(({ label, color }, i) => (
              <div key={label} className="flex items-center gap-2">
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${color}`}>
                  {label}
                </span>
                {i < statusBadges.length - 1 && (
                  <span className="text-muted">→</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Roles */}
        <section className="mt-4 rounded-lg border border-line bg-white p-6 sm:p-8">
          <h2 className="text-base font-semibold text-ink">User Roles</h2>
          <p className="mt-1 text-sm text-muted">
            Four roles with scoped permissions — every user sees only what they need.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {roles.map((role) => (
              <div key={role} className="rounded-md border border-line bg-paper px-4 py-3">
                <p className="font-mono text-sm font-semibold text-forest">{role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/register"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            Get started free
          </Link>
          <Link
            to="/documentation"
            className="inline-flex h-10 items-center rounded-md border border-line bg-white px-4 text-sm font-semibold text-ink transition hover:bg-mist"
          >
            Read the docs
          </Link>
        </div>
      </div>
    </main>
  );
}
