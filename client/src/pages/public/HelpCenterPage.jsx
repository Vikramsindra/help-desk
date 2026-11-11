import {
  BookOpen,
  HelpCircle,
  PlusCircle,
  Wrench,
  UserCog,
  ArrowRight,
  GitBranch,
} from "lucide-react";
import { Link } from "react-router";

const sections = [
  {
    icon: BookOpen,
    title: "Documentation",
    description:
      "Step-by-step guides for every part of the platform — from getting started to advanced admin workflows.",
    link: { label: "Browse docs", to: "/documentation" },
  },
  {
    icon: HelpCircle,
    title: "Frequently Asked Questions",
    description:
      "Quick answers to the most common questions about accounts, tickets, roles, and security.",
    link: { label: "View FAQ", to: "/faq" },
  },
  {
    icon: Wrench,
    title: "Troubleshooting Guide",
    description:
      "Can't log in? Ticket not updating? Walk through our troubleshooting steps to resolve the most common issues.",
    link: { label: "Troubleshoot", to: "/faq#troubleshooting" },
  },
  {
    icon: UserCog,
    title: "Account Assistance",
    description:
      "Need help with your account, password, or role? Find guidance on managing your profile and access.",
    link: { label: "Account help", to: "/faq#account" },
  },
];

const quickLinks = [
  { label: "Getting Started Guide", to: "/documentation#getting-started" },
  { label: "How to Create a Ticket", to: "/faq" },
  { label: "Understanding User Roles", to: "/faq" },
  { label: "Platform Features", to: "/features" },
  { label: "About HelpDesk", to: "/about" },
];

export default function HelpCenterPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-paper">
      {/* Page header */}
      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-brand">
            <span className="size-2 rounded-full bg-brand" />
            Help Center
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            How can we help?
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
            Find answers, guides, and support resources. If you can't find what
            you're looking for, submit a ticket and our team will get back to
            you.
          </p>
          {/* Primary CTA */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/customer/tickets/create"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              <PlusCircle size={16} />
              Submit a ticket
            </Link>
            <Link
              to="/register"
              className="inline-flex h-10 items-center rounded-md border border-line bg-white px-4 text-sm font-semibold text-ink transition hover:bg-mist"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {/* Help sections */}
        <div className="grid gap-4 sm:grid-cols-2">
          {sections.map(({ icon: Icon, title, description, link }) => (
            <Link
              key={title}
              to={link.to}
              className="group flex flex-col rounded-lg border border-line bg-white p-6 transition hover:border-brand/40 hover:shadow-sm"
            >
              <span className="grid size-10 place-items-center rounded-lg bg-mist text-forest">
                <Icon size={20} />
              </span>
              <h2 className="mt-4 text-base font-semibold text-ink">{title}</h2>
              <p className="mt-1.5 flex-1 text-sm leading-6 text-muted">
                {description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand transition group-hover:gap-2">
                {link.label} <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>

        {/* Submit a ticket note */}
        <section className="mt-8 rounded-lg border border-line bg-white p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-mist text-forest">
              <PlusCircle size={20} />
            </span>
            <div>
              <h2 className="text-base font-semibold text-ink">
                Submit a Support Ticket
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                If you're a registered customer, you can submit a support ticket
                directly from your dashboard. New to HelpDesk? Create a free
                account to get started.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to="/customer/tickets/create"
                  className="inline-flex h-9 items-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-dark"
                >
                  <PlusCircle size={14} />
                  New ticket (logged in)
                </Link>
                <Link
                  to="/register"
                  className="inline-flex h-9 items-center rounded-md border border-line bg-white px-4 text-sm font-medium text-ink transition hover:bg-mist"
                >
                  Create account first
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick links */}
        <section className="mt-8 rounded-lg border border-line bg-white p-6 sm:p-8">
          <h2 className="text-base font-semibold text-ink">Quick Links</h2>
          <ul className="mt-4 divide-y divide-line">
            {quickLinks.map(({ label, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="flex items-center justify-between py-3 text-sm text-ink transition hover:text-brand"
                >
                  {label}
                  <ArrowRight size={14} className="text-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* GitHub bugs */}
        <section className="mt-4 rounded-lg border border-line bg-white p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-mist text-forest">
              <GitBranch size={20} />
            </span>
            <div>
              <h2 className="text-base font-semibold text-ink">Report a Bug</h2>
              <p className="mt-1 text-sm text-muted">
                Found something broken? Open an issue on GitHub so it can be
                tracked and fixed.
              </p>
              <a
                href="https://github.com/Vikramsindra/help-desk/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"
              >
                Open a GitHub issue <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
