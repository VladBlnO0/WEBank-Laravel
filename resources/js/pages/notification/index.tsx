import Pagination from "@/components/pagination";
import { Head, Link } from "@inertiajs/react";

interface NotificationPayload {
  id: number;
  transaction_id: number;
  amount: string;
  from_card_id: number;
  to_card_id: number;
  from_card_last4?: string;
  to_card_last4?: string;
  message: string | null;
}

interface NotificationItem {
  id: number;
  type: string;
  notifiable_type: string;
  notifiable_id: number;
  data: NotificationPayload;
  read_at?: string | null;
  created_at: string;
  updated_at: string;
}

type PaginatedData<T> = {
  data: T[];
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  meta?: Record<string, unknown>;
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
};

interface NotificationIndexProps {
  notifications?: PaginatedData<NotificationItem> | null;
}

export default function NotificationIndex({
  notifications,
}: NotificationIndexProps) {
  const notificationItems = notifications?.data ?? [];

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleString(undefined, {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main>
      <meta name="description" content="Notifications page" />
      <Head title="Notifications" />

      <section
        className="mx-auto mb-10 flex min-h-170 flex-col gap-3 space-y-6"
        style={{
          fontFamily:
            '"Space Grotesk", "IBM Plex Sans", "Avenir Next", "Segoe UI", sans-serif',
        }}
      >
        {notificationItems.length === 0 ? (
          <section className="animate-fade-up rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-10 text-center shadow-sm">
            <p className="text-xl font-semibold text-slate-800">
              No notifications yet
            </p>
            <p className="mt-2 text-sm text-slate-500">
              When new activity happens, it will appear here.
            </p>
          </section>
        ) : (
          <>
            <div className="space-y-4">
              {notificationItems.map((notification: NotificationItem) => (
                <section
                  key={notification.id}
                  className={
                    "animate-fade-up rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur-sm transition hover:shadow-md sm:p-6"
                  }
                >
                  <div className="flex flex-row items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-semibold tracking-wide text-slate-700 uppercase">
                          Transaction
                        </span>
                      </div>

                      {notification.type ===
                        "App\\Notifications\\TransactionNotification" && (
                        <div className="space-y-2">
                          <p className="text-base font-medium text-slate-900">
                            {notification.data.message}
                          </p>
                        </div>
                      )}

                      <p className="text-sm text-slate-500">
                        {formatDate(notification.created_at)}
                      </p>
                    </div>

                    <Link
                      href={route("notification.seen", {
                        notification: notification.id,
                      })}
                      as="button"
                      method="put"
                      className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold tracking-wide text-white uppercase transition hover:bg-slate-700"
                    >
                      Mark as read
                    </Link>
                  </div>
                </section>
              ))}
            </div>
          </>
        )}
        {notificationItems.length < 2 ? (
          <></>
        ) : (
          <Pagination meta={notifications} />
        )}
      </section>
    </main>
  );
}
NotificationIndex.layout = {
  breadcrumbs: [
    {
      title: "Notification",
    },
  ],
};
