import LegalPageLayout from "./LegalPageLayout";

export default function AcceptableUsePage() {
  return (
    <LegalPageLayout title="Acceptable Use Policy" lastUpdated="November 2026">
      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          1. Permitted Use
        </h2>
        <p className="text-muted leading-relaxed mb-3">
          HelpDesk is a support ticket management platform. Permitted use varies
          by role. Customers are permitted to submit support tickets, track the
          status of their tickets, post comments to provide additional
          information, and delete their own tickets. Agents are permitted to
          view, respond to, and update the status of tickets assigned to them.
          Admins and super_admins are permitted to manage the platform,
          including all tickets, staff accounts, and user accounts, within the
          bounds defined by their role.
        </p>
        <p className="text-muted leading-relaxed">
          Use of the platform for any purpose not described above — including
          but not limited to data scraping, automated testing against production
          infrastructure, or use as a general communication channel — falls
          outside permitted use.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          2. Prohibited Activities
        </h2>
        <p className="text-muted leading-relaxed mb-3">
          The following activities are expressly prohibited when using HelpDesk:
        </p>
        <p className="text-muted leading-relaxed mb-3">
          <strong className="text-ink">Unauthorised access:</strong> Attempting
          to access another user's account, tickets, or personal information by
          any means, including exploiting bugs, guessing credentials, session
          hijacking, or any other technique.
        </p>
        <p className="text-muted leading-relaxed mb-3">
          <strong className="text-ink">
            Submitting false or abusive content:
          </strong>{" "}
          Creating tickets or comments that contain false, misleading, abusive,
          threatening, or offensive content of any kind.
        </p>
        <p className="text-muted leading-relaxed mb-3">
          <strong className="text-ink">
            Bypassing authentication or authorisation:
          </strong>
          Attempting to circumvent the JWT authentication system, exploit
          role-checking middleware, manipulate API requests to escalate
          privileges, or access any endpoint outside the scope of your assigned
          role.
        </p>
        <p className="text-muted leading-relaxed mb-3">
          <strong className="text-ink">Automated scraping or API abuse:</strong>{" "}
          Using bots, scripts, or automated tools to scrape data from the
          platform or to send requests at a volume beyond normal interactive
          use.
        </p>
        <p className="text-muted leading-relaxed">
          <strong className="text-ink">Off-purpose use:</strong> Using the
          ticket system to conduct any activity unrelated to legitimate support
          requests, including spam, advertising, or communication unrelated to
          the help-desk function of the platform.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          3. Ticket Content Guidelines
        </h2>
        <p className="text-muted leading-relaxed mb-3">
          Tickets submitted on HelpDesk should describe a genuine support need.
          The title and description should accurately represent the issue being
          reported, with enough detail to allow an agent to understand and
          respond to the request. Selecting an appropriate category and priority
          level helps ensure your ticket reaches the right person promptly.
        </p>
        <p className="text-muted leading-relaxed">
          Communication within tickets — both in the initial submission and in
          subsequent comments — should remain respectful and professional.
          Agents and admins working on your tickets are real people, and abusive
          or threatening language will not be tolerated.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          4. Consequences of Violations
        </h2>
        <p className="text-muted leading-relaxed">
          Any user found to be in violation of this Acceptable Use Policy may
          have their account suspended or permanently removed from the platform
          without prior notice. Admins and super_admins have the technical
          ability to take these actions. Severe violations — particularly those
          involving attempts to access other users' data or to compromise the
          platform's security — may be reported to relevant authorities.
        </p>
      </section>
    </LegalPageLayout>
  );
}
