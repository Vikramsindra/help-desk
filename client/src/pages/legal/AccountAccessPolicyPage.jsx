import LegalPageLayout from './LegalPageLayout';

export default function AccountAccessPolicyPage() {
  return (
    <LegalPageLayout
      title="Account and Access Policy"
      lastUpdated="November 2026"
    >
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-ink">1. Purpose and Scope</h2>
        <p className="text-muted leading-relaxed">
          This Account and Access Policy defines the governance, authentication standards,
          and authorization rules governing all accounts created and maintained within the
          HelpDesk ticketing platform. This policy applies to all registered individuals,
          including end-user customers, support agents, system administrators, and super
          administrators.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-ink">2. User Account Creation and Registration</h2>
        <p className="text-muted leading-relaxed">
          Public registration through the platform creates an account assigned strictly to the
          <strong> user</strong> (customer) role. Customers must provide an authentic email
          address, full name, and a password satisfying the platform&apos;s cryptographic security
          standards.
        </p>
        <p className="text-muted leading-relaxed">
          Accounts with elevated privileges—specifically <strong>agent</strong> and
          <strong> admin</strong> roles—cannot be created through public registration. They must
          be explicitly provisioned by authenticated administrators or super administrators
          through the centralized staff management console.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-ink">3. Role Hierarchy and Access Boundaries</h2>
        <p className="text-muted leading-relaxed">
          HelpDesk enforces a strict, four-tier Role-Based Access Control (RBAC) model. Permissions
          are validated on every incoming request at the API middleware layer:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted">
          <li>
            <strong>Customer (user):</strong> Can create support tickets, view and manage their
            own tickets, add comments to their ticket threads, and update their profile details.
            Customers have no visibility into other customers&apos; tickets or administrative tools.
          </li>
          <li>
            <strong>Support Agent (agent):</strong> Can access the dedicated Agent Workspace,
            view tickets assigned directly to them, update ticket status and priority, and converse
            with customers through ticket comments. Agents cannot delete tickets or manage staff accounts.
          </li>
          <li>
            <strong>Administrator (admin):</strong> Can view all tickets across the platform,
            assign tickets to agents, modify ticket priorities and categories, delete inappropriate
            tickets, and provision agent-level staff accounts.
          </li>
          <li>
            <strong>Super Administrator (super_admin):</strong> Possesses platform-wide authority,
            including provisioning and managing administrator accounts, managing customer records,
            reassigning tickets, and managing platform configurations.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-ink">4. Credential Security and Password Standards</h2>
        <p className="text-muted leading-relaxed">
          All user passwords must satisfy minimum complexity rules upon registration or modification:
          minimum 8 characters, containing uppercase and lowercase characters, numbers, and special
          symbols. Passwords are cryptographically hashed using the memory-hard <strong>Argon2id</strong>
          algorithm before database persistence. Plaintext passwords are never logged, cached, or
          retrievable by administrators.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-ink">5. Authentication and Session Governance</h2>
        <p className="text-muted leading-relaxed">
          Session management utilizes a dual-token architecture:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted">
          <li>
            <strong>Access Tokens:</strong> Signed JSON Web Tokens (JWT) with a short 15-minute
            lifespan, maintained in volatile client application memory. Access tokens are transmitted
            in the HTTP Authorization header as Bearer tokens.
          </li>
          <li>
            <strong>Refresh Tokens:</strong> Stored securely in HTTP-only, SameSite cookies with a
            7-day expiration. Refresh tokens are hashed using SHA-256 before storage in the database,
            preventing reuse or token theft.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-ink">6. Account Suspension and Privilege Revocation</h2>
        <p className="text-muted leading-relaxed">
          Platform administrators reserve the authority to deactivate or reassign accounts found in
          violation of the Acceptable Use Policy. Upon deactivation or logout, stored refresh token
          hashes are purged, immediately terminating all active user sessions across all devices.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-ink">7. Contact and Support</h2>
        <p className="text-muted leading-relaxed">
          For inquiries regarding account permissions, credential recovery, or role modifications,
          please consult our <a href="/help" className="text-brand hover:underline">Help Center</a>
          or contact platform maintainers via our{' '}
          <a
            href="https://github.com/Vikramsindra/help-desk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:underline"
          >
            GitHub Repository
          </a>.
        </p>
      </section>
    </LegalPageLayout>
  );
}

