import LegalPageLayout from "./LegalPageLayout";

export default function DataProtectionPage() {
  return (
    <LegalPageLayout title="Data Protection" lastUpdated="November 2026">
      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          1. Password Security
        </h2>
        <p className="text-muted leading-relaxed">
          All user passwords on HelpDesk are hashed using{" "}
          <strong className="text-ink">Argon2</strong>, the winner of the
          Password Hashing Competition and the current industry standard for
          password storage. Argon2 is a memory-hard algorithm specifically
          designed to be slow and expensive for attackers using GPUs or
          specialised hardware, making brute-force and dictionary attacks
          computationally infeasible. The original password is discarded
          immediately after hashing; only the hash is stored. At no point is a
          plain-text password written to any log, database field, or network
          response.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          2. Authentication
        </h2>
        <p className="text-muted leading-relaxed mb-3">
          HelpDesk uses a dual-token JWT authentication strategy. Upon login,
          the server issues two tokens: a short-lived{" "}
          <strong className="text-ink">access token</strong> (15-minute expiry)
          held only in JavaScript memory, and a longer-lived{" "}
          <strong className="text-ink">refresh token</strong> (7-day expiry)
          delivered via an httpOnly, Secure, SameSite=Lax cookie.
        </p>
        <p className="text-muted leading-relaxed">
          On the server side, only a{" "}
          <strong className="text-ink">SHA-256 hash</strong> of the refresh
          token is stored in the database. This means that even if the database
          were exposed, an attacker could not reuse the stored hashes to forge
          authenticated sessions, because the hash alone cannot be used to
          generate a valid token.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          3. Role-Based Access Control
        </h2>
        <p className="text-muted leading-relaxed mb-3">
          HelpDesk enforces a four-tier role hierarchy:{" "}
          <strong className="text-ink">user</strong>
          (customer), <strong className="text-ink">agent</strong>,{" "}
          <strong className="text-ink">admin</strong>, and{" "}
          <strong className="text-ink">super_admin</strong>. Each role carries a
          precisely defined set of permissions, and those permissions are
          checked on every API request.
        </p>
        <p className="text-muted leading-relaxed">
          Customers can only read and manage their own tickets. Agents can only
          access tickets explicitly assigned to them. Admins can manage all
          tickets and agent accounts. Super admins have full platform access. No
          user can read, modify, or delete data belonging to another user at the
          same or higher role level, and no user can promote their own role.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          4. Protected API Endpoints
        </h2>
        <p className="text-muted leading-relaxed">
          Every sensitive route in the HelpDesk API requires a valid JWT Bearer
          token supplied in the HTTP Authorization header. Requests without a
          valid token are rejected with a 401 Unauthorized response. After token
          validation, role-checking middleware verifies that the authenticated
          user holds the required role for the requested operation. Insufficient
          role permissions produce a 403 Forbidden response. This two-layer
          check is applied consistently across all protected routes.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          5. Session Management
        </h2>
        <p className="text-muted leading-relaxed mb-3">
          When an access token expires, the client automatically requests a new
          one using the httpOnly refresh token cookie. The server validates the
          hash of the presented refresh token against the stored hash. If valid,
          a new access token is issued and the refresh token is rotated — the
          old hash is replaced with a new one, so each refresh token can only be
          used once.
        </p>
        <p className="text-muted leading-relaxed">
          When you log out, the server immediately removes your refresh token
          hash from the database and clears the refresh token cookie. This
          ensures that the session cannot be resumed even if someone captures
          the cookie value from your browser.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          6. Data Access Restrictions
        </h2>
        <p className="text-muted leading-relaxed">
          Ticket data is scoped by role at the query level, not just the
          response level. Customers query only their own tickets. Agents query
          only their assigned tickets. Admins and super_admins can query all
          tickets. This means that even if an authorisation bug were introduced
          at the middleware layer, the underlying database queries would still
          return only the data appropriate for the authenticated user's role.
        </p>
      </section>
    </LegalPageLayout>
  );
}
