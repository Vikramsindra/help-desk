import LegalPageLayout from "./LegalPageLayout";

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout title="Cookie Policy" lastUpdated="November 2026">
      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          1. What Are Cookies
        </h2>
        <p className="text-muted leading-relaxed">
          Cookies are small text files that a website stores on your device when
          you visit it. They are commonly used to remember user preferences,
          maintain authentication sessions, and collect analytics data. Not all
          websites use cookies for all of these purposes, and HelpDesk's use of
          cookies is intentionally minimal.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          2. Cookies We Use
        </h2>
        <p className="text-muted leading-relaxed mb-3">
          HelpDesk uses exactly one cookie:{" "}
          <code className="bg-mist px-1.5 py-0.5 rounded text-sm font-mono text-ink">
            refreshToken
          </code>
          . This cookie is used exclusively for authentication session
          management. Its properties are:
        </p>
        <ul className="space-y-2 text-muted leading-relaxed list-none pl-0">
          <li className="flex gap-2">
            <span className="text-brand font-semibold shrink-0">Name:</span>{" "}
            <span>refreshToken</span>
          </li>
          <li className="flex gap-2">
            <span className="text-brand font-semibold shrink-0">Purpose:</span>{" "}
            <span>
              Maintains your authenticated session so you do not need to log in
              on every page visit.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-brand font-semibold shrink-0">httpOnly:</span>{" "}
            <span>
              Yes — the cookie cannot be read by any JavaScript code running in
              the browser, protecting it from XSS attacks.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-brand font-semibold shrink-0">Secure:</span>{" "}
            <span>
              Yes in production — the cookie is only sent over HTTPS
              connections.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-brand font-semibold shrink-0">SameSite:</span>{" "}
            <span>
              Lax — provides CSRF protection while allowing normal navigation.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-brand font-semibold shrink-0">Path:</span>{" "}
            <span>
              /api/user — the cookie is only sent on requests to this specific
              API path.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-brand font-semibold shrink-0">Expiry:</span>{" "}
            <span>7 days from the time it is issued.</span>
          </li>
        </ul>
        <p className="text-muted leading-relaxed mt-4">
          We do <strong className="text-ink">not</strong> use tracking cookies,
          advertising cookies, or analytics cookies of any kind. HelpDesk does
          not integrate any third-party cookie providers such as Google
          Analytics, Facebook Pixel, or similar services.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">3. Access Token</h2>
        <p className="text-muted leading-relaxed">
          In addition to the refresh token cookie, HelpDesk uses a short-lived
          JWT access token for authenticating API requests. This access token is{" "}
          <strong className="text-ink">not a cookie</strong> — it is held in
          JavaScript memory (a module-level variable) only for the duration of
          your browser session. It is never written to localStorage,
          sessionStorage, or any other persistent browser storage. Access tokens
          expire every 15 minutes and are automatically refreshed using the
          httpOnly refresh token cookie.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink mb-3">
          4. Managing Cookies
        </h2>
        <p className="text-muted leading-relaxed mb-3">
          You can view, manage, and delete cookies through your browser's
          settings. All major browsers provide cookie management tools under
          their privacy or developer settings menus. Clearing all site cookies
          will remove the refresh token cookie and log you out of HelpDesk. You
          will need to log in again to continue using the platform.
        </p>
        <p className="text-muted leading-relaxed">
          Because HelpDesk uses only the single authentication cookie described
          above, disabling or deleting it will disable persistent sessions. You
          will still be able to log in and use the platform, but your session
          will not be maintained across page reloads.
        </p>
      </section>
    </LegalPageLayout>
  );
}
