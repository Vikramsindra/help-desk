import LegalPageLayout from "./LegalPageLayout";

export default function SecurityPolicyPage() {
  return (
    <LegalPageLayout title="Security Policy" lastUpdated="November 2026">
      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          1. Authentication Security
        </h2>
        <p className="text-muted leading-relaxed">
          HelpDesk uses JSON Web Token (JWT) Bearer tokens for all API
          authentication. Access tokens have a 15-minute expiry, limiting the
          window of exposure if a token is ever leaked. Session continuity is
          maintained through a 7-day refresh token that is automatically rotated
          on each use — meaning each refresh token is single-use and immediately
          replaced with a new one. All passwords are hashed with{" "}
          <strong className="text-ink">Argon2</strong>, the recommended
          password-hashing algorithm and winner of the Password Hashing
          Competition, chosen for its resistance to GPU-accelerated brute-force
          attacks.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          2. Access Control
        </h2>
        <p className="text-muted leading-relaxed">
          Every API endpoint in HelpDesk is protected by a four-tier role
          system: user (customer), agent, admin, and super_admin. Role-checking
          middleware is applied to all sensitive routes and runs after token
          validation. Requests that do not carry a sufficient role are rejected
          with a 403 Forbidden response before any data retrieval or
          modification occurs. This defence-in-depth approach ensures that a
          compromised token from a low-privilege account cannot be used to
          access higher-privilege data.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          3. Session Security
        </h2>
        <p className="text-muted leading-relaxed mb-3">
          Refresh tokens are delivered to the client via an{" "}
          <strong className="text-ink">httpOnly cookie</strong>, which means
          browser-side JavaScript cannot read them. This protects the refresh
          token from Cross-Site Scripting (XSS) attacks, which are among the
          most common web vulnerabilities. The cookie is also flagged as Secure
          in production environments, so it is only transmitted over HTTPS
          connections.
        </p>
        <p className="text-muted leading-relaxed">
          On the server, the raw refresh token is never stored. Only its SHA-256
          hash is persisted in the database. This means that a database breach
          alone would not give an attacker the ability to forge valid
          authenticated sessions.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">4. API Security</h2>
        <p className="text-muted leading-relaxed mb-3">
          The HelpDesk API includes middleware to protect against NoSQL
          injection attacks, which are a common threat in MongoDB-backed
          applications. All incoming request data is validated using{" "}
          <strong className="text-ink">Joi</strong>, a schema-based validation
          library that rejects malformed or unexpected input before it reaches
          the business logic layer.
        </p>
        <p className="text-muted leading-relaxed">
          Cross-Origin Resource Sharing (CORS) is configured to allow requests
          only from known, permitted origins. This prevents malicious
          third-party websites from making authenticated API requests on behalf
          of a logged-in user (Cross-Site Request Forgery).
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          5. Reporting Vulnerabilities
        </h2>
        <p className="text-muted leading-relaxed">
          If you discover a security vulnerability in HelpDesk, please report it
          responsibly by opening an issue on the GitHub repository at{" "}
          <a
            href="https://github.com/Vikramsindra/help-desk/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand underline hover:opacity-80 transition-opacity"
          >
            github.com/Vikramsindra/help-desk/issues
          </a>
          . Please describe the vulnerability clearly, including steps to
          reproduce it if possible. We appreciate responsible disclosure and
          will address confirmed vulnerabilities on a best-effort basis.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          6. What We Do Not Claim
        </h2>
        <p className="text-muted leading-relaxed">
          HelpDesk is an educational and portfolio project. We do not claim
          encryption of data at rest within MongoDB. We do not hold or claim any
          formal compliance certifications, including but not limited to GDPR,
          ISO 27001, SOC 2, or HIPAA. The security measures documented here
          represent genuine implementation choices made during development, but
          they do not constitute a production-grade security programme. We
          encourage users not to store sensitive personal or confidential
          business data on this platform.
        </p>
      </section>
    </LegalPageLayout>
  );
}
