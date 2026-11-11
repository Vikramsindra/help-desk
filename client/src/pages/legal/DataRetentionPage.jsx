import LegalPageLayout from "./LegalPageLayout";

export default function DataRetentionPage() {
  return (
    <LegalPageLayout title="Data Retention Policy" lastUpdated="November 2026">
      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          1. User Account Data
        </h2>
        <p className="text-muted leading-relaxed">
          Account data — including your name, email address, hashed password,
          and assigned role — is retained for as long as your account remains
          active on the platform. This data is necessary for you to log in and
          use HelpDesk, so it cannot be removed while your account exists. At
          this time, self-service account deletion is not available; see the
          Account Deletion section below for how to request removal.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">2. Ticket Data</h2>
        <p className="text-muted leading-relaxed mb-3">
          Ticket data is retained until it is explicitly deleted. Customers
          (users) can delete their own tickets at any time through their
          dashboard. Admins and super_admins also have the ability to delete any
          ticket on the platform. There is no automatic expiry or archival
          schedule for ticket data; tickets remain in the system until a
          deletion action is taken.
        </p>
        <p className="text-muted leading-relaxed">
          If a ticket is deleted, all data associated with that ticket —
          including the title, description, category, priority, status, and all
          comments — is permanently removed from the database. This action
          cannot be undone.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">3. Comment Data</h2>
        <p className="text-muted leading-relaxed">
          Comments are associated with tickets and do not exist independently.
          When a ticket is deleted, all comments on that ticket are removed
          along with it. There is no mechanism to delete individual comments in
          isolation in the current version of the platform. Comment data
          persists for as long as the parent ticket exists.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">4. Session Data</h2>
        <p className="text-muted leading-relaxed mb-3">
          HelpDesk stores a SHA-256 hash of your refresh token in the database
          to maintain your authenticated session. This hash is session data, not
          personal data in the conventional sense, but it is associated with
          your account.
        </p>
        <p className="text-muted leading-relaxed">
          Session hashes are removed in two scenarios: when you explicitly log
          out (in which case the server deletes the hash and clears the cookie),
          or when you log in from a new session (token rotation replaces the old
          hash with a new one). There is no accumulation of old session hashes;
          each active account holds at most one refresh token hash at a time.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          5. Data Removal Requests
        </h2>
        <p className="text-muted leading-relaxed">
          If you would like to request the removal of data associated with your
          account, or have any questions about what data is held, please contact
          us by opening an issue on the project's GitHub repository. We will
          handle requests on a best-effort basis. As this is an educational
          project without a formal operations team, response times may vary.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          6. Account Deletion
        </h2>
        <p className="text-muted leading-relaxed">
          Self-service account deletion is not currently available as a feature
          within the HelpDesk interface. If you wish to have your account and
          associated data removed from the platform, please submit a request via
          the GitHub repository. An admin will process the request manually.
          Upon deletion, your account data, including your name, email, and
          hashed password, will be permanently removed from the database along
          with any tickets and comments you created.
        </p>
      </section>
    </LegalPageLayout>
  );
}
