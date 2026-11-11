/**
 * Reusable layout wrapper for all legal/policy pages.
 *
 * Props:
 *   title       - Page heading (string)
 *   lastUpdated - Date string shown as subtitle (string)
 *   children    - Page body content
 */
export default function LegalPageLayout({ title, lastUpdated, children }) {
  return (
    <div className="min-h-screen bg-paper py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Page header */}
        <header className="mb-10 pb-6 border-b border-line">
          <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-2">
            {title}
          </h1>
          {lastUpdated && (
            <p className="text-sm text-muted">Last updated: {lastUpdated}</p>
          )}
        </header>

        {/* Page body — sections use <h2> headings */}
        <div className="prose-legal space-y-8 text-ink">{children}</div>
      </div>
    </div>
  );
}
