import LegalPageLayout from "./LegalPageLayout";

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="November 2026">
      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          1. Information We Collect
        </h2>
        <p className="text-muted leading-relaxed mb-3">
          When you create an account on HelpDesk we collect your name, email
          address, a securely hashed version of your password, and your assigned
          role within the platform (customer, agent, admin, or super_admin). We
          never store your password in plain text.
        </p>
        <p className="text-muted leading-relaxed mb-3">
          When you create or interact with support tickets we collect the ticket
          title, description, category, priority level, and current status. When
          you post comments on tickets we collect the comment message, the
          author identity, and the timestamp of submission.
        </p>
        <p className="text-muted leading-relaxed">
          For authentication purposes we use JSON Web Tokens (JWTs). Short-lived
          access tokens (15-minute expiry) are held in JavaScript memory only —
          they are never written to localStorage or sessionStorage. Refresh
          tokens (7-day expiry) are stored in an httpOnly cookie so that
          browser-side JavaScript cannot read them. On the server, only a
          SHA-256 hash of each refresh token is persisted in the database; the
          raw token is never stored.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          2. Why We Collect It
        </h2>
        <p className="text-muted leading-relaxed mb-3">
          Account information is collected solely to manage your identity on the
          platform, enforce role-based permissions, and allow you to log in
          securely. Ticket and comment data is collected because it is the core
          content of the platform — without it, the help-desk function cannot
          operate.
        </p>
        <p className="text-muted leading-relaxed">
          Authentication data (tokens and their hashes) is collected to maintain
          a secure session without requiring you to log in on every page visit,
          while still limiting the window of exposure if a token is compromised.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          3. How Information Is Stored
        </h2>
        <p className="text-muted leading-relaxed mb-3">
          All application data is stored in a MongoDB database. Passwords are
          hashed using the Argon2 algorithm before storage, which is an
          industry-standard, memory-hard hashing function specifically designed
          to resist brute-force and GPU-accelerated attacks. The original
          password is immediately discarded after hashing and is never
          accessible again.
        </p>
        <p className="text-muted leading-relaxed">
          Refresh tokens are stored only as SHA-256 hashes in the database. Even
          if the database were compromised, an attacker could not use these
          hashes directly to forge an authenticated session.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          4. Who Can Access Information
        </h2>
        <p className="text-muted leading-relaxed mb-3">
          Access to data within HelpDesk is strictly controlled by role.
          Customers can only see their own tickets and comments. Agents can view
          and respond to tickets that have been assigned to them. Admins and
          super_admins have full visibility across all tickets, users, and
          platform activity.
        </p>
        <p className="text-muted leading-relaxed">
          These access restrictions are enforced at the API level through
          role-checking middleware on every protected endpoint. No role can
          escalate its own privileges, and no customer can view another
          customer's ticket data.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          5. Data Requests
        </h2>
        <p className="text-muted leading-relaxed">
          If you would like to request information about the data held on your
          account, or would like to raise any privacy concern, please open an
          issue on the project's GitHub repository. As this is an educational
          and portfolio project, response times are on a best-effort basis.
        </p>
      </section>
    </LegalPageLayout>
  );
}
