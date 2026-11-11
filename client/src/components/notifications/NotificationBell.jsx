import { Bell, CheckCheck } from "lucide-react";
import { useNotifications } from "../../hooks/useNotifications";
import { formatDate } from "../../lib/utils";

export default function NotificationBell() {
  const { notifications, unreadCount, loading, markRead, markAllRead } =
    useNotifications();

  return (
    <details className="group relative">
      <summary
        className="relative grid size-10 cursor-pointer list-none place-items-center rounded-md text-muted hover:bg-mist hover:text-ink focus-visible:outline-2 focus-visible:outline-brand"
        aria-label={`${unreadCount} unread notifications`}
      >
        <Bell size={19} aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-coral px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </summary>
      <section
        className="absolute right-0 top-full z-30 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-line bg-white shadow-xl"
        aria-label="Notifications"
      >
        <header className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="text-sm font-semibold text-ink">Notifications</h2>
          <button
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-dark disabled:opacity-50"
            type="button"
            disabled={!unreadCount}
            onClick={markAllRead}
          >
            <CheckCheck size={14} /> Mark all read
          </button>
        </header>
        <div className="max-h-80 overflow-y-auto">
          {loading && (
            <p className="px-4 py-5 text-sm text-muted">
              Loading notifications…
            </p>
          )}
          {!loading && notifications.length === 0 && (
            <p className="px-4 py-5 text-sm text-muted">
              You’re all caught up.
            </p>
          )}
          {notifications.slice(0, 8).map((notification) => (
            <button
              key={notification._id}
              className={`block w-full border-b border-line px-4 py-3 text-left hover:bg-mist ${notification.isRead ? "" : "bg-mist/60"}`}
              type="button"
              onClick={() => !notification.isRead && markRead(notification._id)}
            >
              <span className="flex items-start gap-2">
                {!notification.isRead && (
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-coral" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block text-sm leading-5 text-ink">
                    {notification.message}
                  </span>
                  <span className="mt-1 block text-xs text-muted">
                    {formatDate(notification.createdAt)}
                  </span>
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>
    </details>
  );
}
