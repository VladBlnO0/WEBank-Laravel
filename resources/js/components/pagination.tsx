import { router } from "@inertiajs/react";

type Meta = {
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
};

export default function Pagination({
  meta,
  className,
}: {
  meta?: Meta | null;
  className?: string;
}) {
  const current = meta?.current_page ?? 1;
  const last = meta?.last_page ?? 1;

  if (!meta || last <= 1) {
    return null;
  }

  const start = Math.max(1, current - 2);
  const end = Math.min(last, Math.max(start + 4, current + 2));
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const goto = (page: number) => {
    if (page < 1 || page > last || page === current) return;
    router.get(
      window.location.pathname,
      { page },
      { preserveState: true, preserveScroll: true },
    );
  };

  return (
    <div
      className={`mt-4 flex items-center justify-center gap-4 ${className ?? ""}`}
    >
      <button
        onClick={() => goto(current - 1)}
        disabled={current <= 1}
        className="rounded border px-3 py-1 text-sm disabled:opacity-40"
      >
        Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => goto(p)}
          aria-current={p === current}
          className={`rounded-lg border px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50 ${p === current ? "bg-gray-900 text-white hover:bg-slate-700" : "hover:bg-gray-200"} `}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => goto(current + 1)}
        disabled={current >= last}
        className="rounded border px-3 py-1 text-sm disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
