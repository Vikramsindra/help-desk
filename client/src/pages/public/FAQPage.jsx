import { useState } from "react";
import { ChevronDown, HelpCircle, GitBranch } from "lucide-react";
import { Link } from "react-router";

const faqs = [
  {
    question: "What is HelpDesk?",
    answer:
      "HelpDesk is a full-stack Help Desk Ticketing System that allows customers to submit support requests, track their progress, and communicate with support agents. Agents can manage and resolve tickets, while admins and super admins have full oversight of the entire platform. It is built with React, Node.js, Express, and MongoDB.",
  },
  {
    question: "How do I create a support ticket?",
    answer:
      'Log in to your customer account and click the "Create Ticket" button on your dashboard or navigate to the Tickets section. Fill in the title, description, and priority level, then submit. You will be able to track its status and receive notifications as it progresses.',
  },
  {
    question: "What user roles are available?",
    answer:
      "HelpDesk has four roles: (1) user / customer — can create and track their own tickets; (2) agent — can view assigned tickets, update statuses, and add comments; (3) admin — can manage staff, assign tickets, and oversee all tickets; (4) super_admin — has full platform access including creating admin accounts and managing all users.",
  },
  {
    question: "How are tickets assigned to agents?",
    answer:
      "Administrators and super admins are responsible for ticket assignment. When a customer submits a ticket, an admin reviews it and assigns it to the most appropriate agent based on availability and expertise. Agents are notified in real time when a ticket is assigned to them.",
  },
  {
    question: "Can I track the status of my ticket?",
    answer:
      "Yes. Customers can view the current status of all their tickets at any time from the Customer Portal. Tickets move through four states: Open, In Progress, Resolved, and Closed. You will also receive real-time notifications whenever your ticket is updated.",
  },
  {
    question: "How is my data protected?",
    answer:
      "HelpDesk uses multiple layers of security: passwords are hashed with Argon2 (a winner of the Password Hashing Competition), sessions are managed with signed JWT tokens, every API endpoint requires authentication and correct role authorisation, and role-based access control ensures users only see data they are permitted to access.",
  },
  {
    question: "Who can see my tickets?",
    answer:
      "Only the ticket creator (you), the agent assigned to your ticket, and administrators/super admins can view your ticket and its conversation. No other customer or unassigned agent has access to your support requests.",
  },
  {
    question: "How do I report a bug in the platform?",
    answer:
      "If you find a bug or issue with HelpDesk itself, please open an issue on the GitHub repository. Include a clear description of the problem, steps to reproduce it, and any relevant screenshots or error messages.",
  },
];

function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border-b border-line last:border-b-0">
      <button
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 py-5 text-left transition hover:text-brand"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-semibold text-ink">{question}</span>
        <ChevronDown
          size={18}
          className={`mt-0.5 shrink-0 text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-sm leading-7 text-muted">{answer}</p>
        {question.includes("bug") && (
          <a
            href="https://github.com/Vikramsindra/help-desk/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
          >
            <GitBranch size={14} />
            github.com/Vikramsindra/help-desk/issues
          </a>
        )}
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-paper">
      {/* Page header */}
      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-brand">
            <span className="size-2 rounded-full bg-brand" />
            FAQ
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Frequently asked questions
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
            Quick answers to the most common questions about HelpDesk. Can't
            find what you're looking for?{" "}
            <Link to="/help" className="text-brand hover:underline">
              Visit the Help Center
            </Link>
            .
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="rounded-lg border border-line bg-white px-6 sm:px-8">
          {faqs.map((faq, i) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-8 rounded-lg border border-line bg-white p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-mist text-forest">
              <HelpCircle size={20} />
            </span>
            <div>
              <h2 className="text-base font-semibold text-ink">
                Still have questions?
              </h2>
              <p className="mt-1.5 text-sm text-muted">
                Browse the full documentation or submit a support ticket and a
                team member will follow up.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to="/documentation"
                  className="inline-flex h-9 items-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-dark"
                >
                  Read documentation
                </Link>
                <Link
                  to="/customer/tickets/create"
                  className="inline-flex h-9 items-center rounded-md border border-line bg-white px-4 text-sm font-medium text-ink transition hover:bg-mist"
                >
                  Submit a ticket
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
