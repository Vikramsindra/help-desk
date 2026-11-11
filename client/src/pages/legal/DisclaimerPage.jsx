import LegalPageLayout from "./LegalPageLayout";

export default function DisclaimerPage() {
  return (
    <LegalPageLayout title="Disclaimer" lastUpdated="November 2026">
      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          1. Project Nature
        </h2>
        <p className="text-muted leading-relaxed">
          HelpDesk is a full-stack software development project created for
          educational and portfolio purposes by{" "}
          <strong className="text-ink">Vikram Sindra</strong>. It demonstrates
          the implementation of a role-based support ticket management system
          using React, Node.js, Express, and MongoDB. While it is built to
          production-like standards and incorporates real security practices, it
          is not a commercially operated service and should not be treated as
          one.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">2. No Warranty</h2>
        <p className="text-muted leading-relaxed">
          HelpDesk is provided "as is", without warranty of any kind, express or
          implied. This includes, but is not limited to, implied warranties of
          merchantability, fitness for a particular purpose, or
          non-infringement. There is no guarantee of continuous availability,
          uptime, or data permanence. The platform may be taken offline, reset,
          or modified at any time without notice. Users should not rely on
          HelpDesk for storing important or irreplaceable information.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          3. No Legal Compliance Claims
        </h2>
        <p className="text-muted leading-relaxed">
          HelpDesk does not claim compliance with any data protection regulation
          or security standard, including but not limited to the General Data
          Protection Regulation (GDPR), ISO 27001, SOC 2 Type I or Type II,
          HIPAA, PCI-DSS, or any other regional or industry regulatory
          framework. The security and privacy practices described on this
          platform represent the developer's implementation choices and are
          provided for transparency, not as a declaration of legal or regulatory
          compliance.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          4. No Encryption at Rest
        </h2>
        <p className="text-muted leading-relaxed">
          Data stored in the MongoDB database is not encrypted at the field or
          collection level. While passwords are hashed and refresh tokens are
          stored only as hashes, other data such as ticket content, comments,
          and user profile information is stored in plain form within the
          database. HelpDesk does not claim to provide encryption at rest and
          users should take this into account when deciding what information to
          submit through the platform.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          5. No Professional Support
        </h2>
        <p className="text-muted leading-relaxed">
          HelpDesk is a development project maintained by a single developer.
          There is no service level agreement (SLA), no guaranteed response time
          for support requests, and no dedicated support team. Issues can be
          reported via the GitHub repository, and they will be addressed on a
          best-effort basis as time and priorities allow. This platform is not
          suitable for use cases that require guaranteed support or uptime
          commitments.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          6. Accuracy of Information
        </h2>
        <p className="text-muted leading-relaxed">
          The information provided across this platform's legal and policy pages
          — including descriptions of authentication mechanisms, data storage
          practices, role-based access controls, and cookie usage — describes
          the actual implemented functionality of the HelpDesk application as of
          the last updated date shown on each page. We make reasonable efforts
          to keep these descriptions accurate and up to date as the codebase
          evolves.
        </p>
      </section>
    </LegalPageLayout>
  );
}
