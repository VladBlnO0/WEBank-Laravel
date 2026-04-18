import { Link } from "@inertiajs/react";
import clsx from "clsx";
export default function Pagination({
  meta,
  className = "",
}: {
  meta?: {
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
  };
  className?: string;
}) {
  // For avoiding dangerouslySetInnerHTML
  const cleanLabel = (label: string) => {
    return label
      .replace("&laquo; Previous", "Previous")
      .replace("Next &raquo;", "Next");
  };
  return (
    <nav
      aria-label="Pagination"
      className={clsx(
        `mt-4 flex flex-wrap items-center justify-center gap-2`,
        className,
      )}
    >
      {meta?.links.map((link) => {
        if (link.url === null) {
          return (
            <div
              key={`${link.label}-${link.url}`}
              className="rounded-lg border px-4 py-2 text-sm font-medium text-slate-400 opacity-50 transition-colors"
            >
              <span>{cleanLabel(link.label)}</span>
            </div>
          );
        } else {
          return (
            <Link
              key={`${link.label}-${link.url}`}
              href={link.url}
              preserveScroll
              preserveState
              className={clsx(
                `rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  link.active
                    ? "bg-gray-900 text-white hover:bg-slate-700"
                    : "text-slate-700 hover:bg-gray-200"
                }`,
              )}
            >
              <span>{cleanLabel(link.label)}</span>
            </Link>
          );
        }
      })}
    </nav>
  );
}
