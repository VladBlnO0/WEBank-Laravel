import Pagination from "@/components/pagination";
import { Head, Link } from "@inertiajs/react";
interface NotificationPayload {
  id: number;
  transaction_id: number;
  amount: string;
  from_card_id: number;
  to_card_id: number;
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
  links: any[];
  meta?: any;
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

  return (
    <>
      <Head title="Notifications" />

      {notificationItems.length === 0 ? (
        <p>No notifications found</p>
      ) : (
        <>
          {notificationItems.map((notification: NotificationItem) => (
            <section key={notification.id}>
              {notification.type ===
                "App\\Notifications\\TransactionNotification" && (
                <p>{notification.data.message}</p>
              )}

              {!notification.read_at && (
                <Link
                  href={route("notification.seen", {
                    notification: notification.id,
                  })}
                  as="button"
                  method="put"
                  className="btn-outline text-xs font-medium uppercase"
                >
                  Mark as read
                </Link>
              )}
            </section>
          ))}
          <section className="mt-8 mb-8 flex w-full justify-center">
            {notifications?.data.length}
          </section>
          <Pagination meta={notifications} className="fixed bottom-10 w-full" />
        </>
      )}
    </>
  );
}
NotificationIndex.layout = {
  breadcrumbs: [
    {
      title: "Notification",
    },
  ],
};
