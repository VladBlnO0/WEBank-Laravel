import { Link } from "@inertiajs/react";

export default function Pagination({
  meta, // This is your allTransactions object from Laravel
  className,
}: {
  meta?: any;
  className?: string;
}) {
  // If there are no links, or only the "Previous" and "Next" links exist, hide pagination
  if (!meta || !meta.links || meta.links.length <= 3) {
    return null;
  }

  return (
    <div
      className={`mt-4 flex flex-wrap items-center justify-center gap-2 ${className ?? ""}`}
    >
      {meta.links.map((link: any, index: number) => {
        // Laravel returns null for the URL if it's the "Previous" button on page 1, etc.
        if (link.url === null) {
          return (
            <div
              key={index}
              className="rounded border px-3 py-1 text-sm text-slate-400 opacity-50"
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          );
        }

        // Otherwise, render an Inertia Link!
        return (
          <Link
            key={index}
            href={link.url}
            preserveScroll
            preserveState
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              link.active
                ? "bg-gray-900 text-white hover:bg-slate-700"
                : "text-slate-700 hover:bg-gray-200"
            }`}
            dangerouslySetInnerHTML={{ __html: link.label }}
          />
        );
      })}
    </div>
  );
}
