import LegalPageLayout from "./LegalPageLayout";

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="November 2026">
      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          1. Acceptance of Terms
        </h2>
        <p className="text-muted leading-relaxed">
          By registering for an account or using any part of the HelpDesk
          platform, you agree to be bound by these Terms of Service. If you do
          not agree with any part of these terms, please do not use the
          platform. As HelpDesk is an educational and portfolio project, these
          terms are provided in good faith to describe expected behaviour rather
          than to constitute a legally enforceable commercial contract.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          2. Use of the Platform
        </h2>
        <p className="text-muted leading-relaxed mb-3">
          HelpDesk is a support ticket management system. Customers (users) may
          create, view, and manage their own support tickets, and may delete
          their tickets at any time. Agents may view tickets assigned to them
          and post responses to assist customers. Admins may manage all tickets
          and all staff accounts within the platform. Super admins have full
          platform administration capabilities, including managing all user
          accounts.
        </p>
        <p className="text-muted leading-relaxed">
          All use of the platform must remain within these defined roles and
          purposes. Using the platform for any other purpose is not permitted.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          3. Account Responsibilities
        </h2>
        <p className="text-muted leading-relaxed mb-3">
          You are responsible for keeping your account credentials confidential.
          You must not share your password with anyone else or allow others to
          access the platform using your account. Each user is permitted to hold
          only one account. Registering multiple accounts is prohibited.
        </p>
        <p className="text-muted leading-relaxed">
          You must provide accurate information when creating your account.
          Providing false information — particularly impersonating another
          person or organisation — is a violation of these terms and may result
          in immediate account suspension.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          4. Prohibited Activities
        </h2>
        <p className="text-muted leading-relaxed mb-3">
          The following activities are strictly prohibited on HelpDesk:
          attempting to access another user's account or data without
          authorisation; abusing the ticket system by submitting spam,
          duplicate, or intentionally misleading tickets; posting harmful,
          abusive, or offensive content in any ticket or comment; and attempting
          to bypass, circumvent, or probe the platform's authentication or
          authorisation mechanisms.
        </p>
        <p className="text-muted leading-relaxed">
          Any attempt to access data belonging to other users, exploit API
          endpoints beyond their intended purpose, or interfere with the normal
          operation of the platform will be treated as a serious violation and
          may result in immediate account termination.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          5. Platform Availability
        </h2>
        <p className="text-muted leading-relaxed">
          HelpDesk is provided on a best-effort basis. As an educational and
          portfolio project, there is no guarantee of continuous availability,
          uptime, or data permanence. The platform may be taken offline for
          maintenance, updates, or any other reason without prior notice. We
          recommend that you do not use this platform for any mission-critical
          or production support workflows.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          6. Account Suspension
        </h2>
        <p className="text-muted leading-relaxed">
          Admins and super_admins have the ability to manage user accounts,
          including suspending or removing accounts that violate these terms. If
          your account is suspended, you will lose access to the platform and to
          any tickets or data associated with your account. We reserve the right
          to terminate any account for any violation of these terms without
          prior notice.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          7. Limitation of Liability
        </h2>
        <p className="text-muted leading-relaxed">
          HelpDesk is an educational and portfolio software development project.
          It is provided "as is" without any warranty, express or implied,
          including warranties of fitness for a particular purpose or
          uninterrupted service. The developer shall not be liable for any loss
          of data, business interruption, or any other damages arising from your
          use of or inability to use the platform.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">8. Developer</h2>
        <p className="text-muted leading-relaxed">
          HelpDesk is developed and maintained by{" "}
          <strong className="text-ink">Vikram Sindra</strong>. The source code
          and further information about the project are available on GitHub at{" "}
          <a
            href="https://github.com/Vikramsindra/help-desk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand underline hover:opacity-80 transition-opacity"
          >
            github.com/Vikramsindra/help-desk
          </a>
          .
        </p>
      </section>
    </LegalPageLayout>
  );
}
