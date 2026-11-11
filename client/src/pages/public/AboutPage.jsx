import {
  GitBranch,
  User,
  Target,
  Layers,
  Info,
  Code2,
  Database,
  Lock,
  Zap,
} from "lucide-react";
import { Link } from "react-router";

const techStack = [
  {
    category: "Frontend",
    icon: Code2,
    items: ["React 19", "Vite", "Tailwind CSS v4", "React Router v7"],
  },
  { category: "Backend", icon: Layers, items: ["Node.js", "Express.js"] },
  { category: "Database", icon: Database, items: ["MongoDB", "Mongoose"] },
  {
    category: "Auth & Security",
    icon: Lock,
    items: ["JWT Authentication", "Argon2"],
  },
  { category: "Real-Time", icon: Zap, items: ["Socket.io"] },
];

export default function AboutPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-paper">
      {/* Page header */}
      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-brand">
            <span className="size-2 rounded-full bg-brand" />
            About
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            About HelpDesk
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
            A full-stack Help Desk Ticketing System built to streamline support
            request management and issue resolution for teams of all sizes.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-10 px-4 py-12 sm:px-6">
        {/* About the Project */}
        <section
          id="project"
          className="scroll-mt-20 rounded-lg border border-line bg-white p-6 sm:p-8"
        >
          <div className="flex items-start gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-mist text-forest">
              <Info size={20} />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-ink">
                About the Project
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                HelpDesk is a comprehensive, full-stack ticketing platform
                designed to bridge the gap between customers needing support and
                the agents and administrators responsible for resolving issues.
                It provides a unified workspace where every support request is
                tracked, prioritised, and resolved efficiently.
              </p>
              <p className="mt-3 text-sm leading-7 text-muted">
                The platform supports multiple user roles — customers, agents,
                admins, and super admins — each with tailored dashboards and
                capabilities. From creating a ticket to receiving a real-time
                notification when it is resolved, HelpDesk covers the complete
                support lifecycle.
              </p>
              <a
                href="https://github.com/Vikramsindra/help-desk.git"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-md border border-line bg-white px-4 py-2 text-sm font-medium text-ink transition hover:bg-mist"
              >
                <GitBranch size={16} />
                View on GitHub
              </a>
            </div>
          </div>
        </section>

        {/* Developer Info */}
        <section
          id="developer"
          className="scroll-mt-20 rounded-lg border border-line bg-white p-6 sm:p-8"
        >
          <div className="flex items-start gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-mist text-forest">
              <User size={20} />
            </span>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-ink">Developer</h2>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                <div>
                  <p className="text-2xl font-semibold text-ink">
                    Vikram Sindra
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Full-Stack Developer
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 sm:ml-auto">
                  <a
                    href="https://github.com/Vikramsindra"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-forest px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    <GitBranch size={15} />
                    GitHub Profile
                  </a>
                  <a
                    href="https://github.com/Vikramsindra/help-desk.git"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-4 py-2 text-sm font-medium text-ink transition hover:bg-mist"
                  >
                    <GitBranch size={15} />
                    Repository
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="rounded-lg border border-line bg-white p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-mist text-forest">
              <Target size={20} />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-ink">Our Mission</h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                HelpDesk exists to improve support request management and issue
                resolution. We believe that every support interaction should be
                transparent, traceable, and resolved in a timely manner.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                {[
                  "Make it easy for customers to submit and track support requests",
                  "Give agents the right tools to resolve issues efficiently",
                  "Provide admins with full visibility and control over the support pipeline",
                  "Ensure secure, role-based access to sensitive information",
                  "Deliver real-time updates so nobody is left in the dark",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="rounded-lg border border-line bg-white p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-mist text-forest">
              <Layers size={20} />
            </span>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-ink">
                Technology Stack
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {techStack.map(({ category, icon: Icon, items }) => (
                  <div
                    key={category}
                    className="rounded-md border border-line bg-paper p-4"
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={15} className="text-brand" />
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                        {category}
                      </p>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {items.map((tech) => (
                        <li key={tech} className="text-sm font-medium text-ink">
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Project Information */}
        <section className="rounded-lg border border-line bg-white p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-ink">
            Project Information
          </h2>
          <dl className="mt-4 divide-y divide-line text-sm">
            {[
              { label: "Project Name", value: "HelpDesk" },
              { label: "Type", value: "Full-Stack Web Application" },
              { label: "Developer", value: "Vikram Sindra" },
              {
                label: "Repository",
                value: "github.com/Vikramsindra/help-desk",
                href: "https://github.com/Vikramsindra/help-desk.git",
              },
              { label: "License", value: "MIT" },
            ].map(({ label, value, href }) => (
              <div
                key={label}
                className="flex items-baseline justify-between gap-4 py-3"
              >
                <dt className="font-medium text-muted">{label}</dt>
                <dd className="text-right text-ink">
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand hover:underline"
                    >
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* CTA */}
        <div className="flex flex-wrap gap-3">
          <Link
            to="/features"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            Explore Features
          </Link>
          <Link
            to="/documentation"
            className="inline-flex h-10 items-center rounded-md border border-line bg-white px-4 text-sm font-semibold text-ink transition hover:bg-mist"
          >
            Read Docs
          </Link>
        </div>
      </div>
    </main>
  );
}
