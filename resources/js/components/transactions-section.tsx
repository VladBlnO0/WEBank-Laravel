import Pagination from "@/components/pagination";
import type { CardData, PaginatedData, Transaction } from "@/types";
import { router, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

const CLICK_DEBOUNCE_MS = 1200;
const EXPORT_COOLDOWN_MS = 5 * 60 * 1000;
const EXPORT_COOLDOWN_STORAGE_KEY = "transactions_csv_last_download_at";

function getInitialCooldownRemainingMs(): number {
  if (typeof window === "undefined") {
    return 0;
  }

  const now = Date.now();
  const storedValue = window.localStorage.getItem(EXPORT_COOLDOWN_STORAGE_KEY);
  const lastDownloadAt = Number(storedValue ?? "0");

  if (!Number.isFinite(lastDownloadAt) || lastDownloadAt <= 0) {
    return 0;
  }

  return Math.max(0, EXPORT_COOLDOWN_MS - (now - lastDownloadAt));
}

export default function TransactionsSection({
  filters,
  allTransactions,
  cardIds,
}: {
  filters: {
    by?: string;
    order?: string;
  };
  allTransactions?: PaginatedData<Transaction> | null;
  cardIds: number[];
}) {
  const transactions = allTransactions?.data ?? [];
  const exportHref = route("user.transactions.export", {
    by: filters.by ?? "created_at",
    order: filters.order ?? "desc",
  });
  const [isWaitingForNextClick, setIsWaitingForNextClick] = useState(false);
  const [cooldownRemainingMs, setCooldownRemainingMs] = useState(
    getInitialCooldownRemainingMs,
  );

  useEffect(() => {
    if (cooldownRemainingMs <= 0) {
      return;
    }

    const interval = window.setInterval(() => {
      setCooldownRemainingMs((current) => Math.max(0, current - 1000));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [cooldownRemainingMs]);

  const formatCooldown = (remainingMs: number): string => {
    const totalSeconds = Math.ceil(remainingMs / 1000);
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");

    return `${minutes}:${seconds}`;
  };

  const handleDownload = (): void => {
    if (isWaitingForNextClick || cooldownRemainingMs > 0) {
      return;
    }

    setIsWaitingForNextClick(true);

    window.setTimeout(() => {
      setIsWaitingForNextClick(false);
    }, CLICK_DEBOUNCE_MS);

    const now = Date.now();

    window.localStorage.setItem(EXPORT_COOLDOWN_STORAGE_KEY, String(now));
    setCooldownRemainingMs(EXPORT_COOLDOWN_MS);
    window.location.assign(exportHref);
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">
          Recent transactions
        </h2>
        <div className="flex items-center gap-3">
          <p className="text-xs font-medium tracking-[0.14em] text-slate-500 uppercase">
            {allTransactions?.total ?? 0} records
          </p>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isWaitingForNextClick || cooldownRemainingMs > 0}
            className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cooldownRemainingMs > 0
              ? `Try again in ${formatCooldown(cooldownRemainingMs)}`
              : "Download CSV"}
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {allTransactions === null ? (
          <div className="p-8 text-center text-slate-600">
            Loading transactions...
          </div>
        ) : transactions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <p className="text-lg font-medium text-slate-700">
              No transactions found
            </p>
          </div>
        ) : (
          <>
            <div className="flex min-h-170 flex-col gap-3">
              <FiltersTransactions filters={filters} />

              <Transactions transactions={transactions} cardIds={cardIds} />

              <Pagination meta={allTransactions} className="mt-6 w-full" />
            </div>
          </>
        )}
      </div>
    </>
  );
}
function Transactions({
  transactions,
  selectedCard,
  cardIds,
}: {
  transactions?: Transaction[];
  selectedCard?: CardData;
  cardIds?: number[];
}) {
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const transactionItems = transactions ?? [];
  const ownedCardIds = cardIds ?? (selectedCard ? [selectedCard.id] : []);

  return (
    <ul className="flex flex-col gap-3 p-1 sm:p-2">
      {transactionItems.length === 0 ? (
        <p className="p-4 text-sm text-slate-500">No transactions.</p>
      ) : (
        transactionItems.map((tran) => {
          const typeClass =
            tran.type === "payment"
              ? "bg-rose-100 text-rose-700"
              : tran.type === "transfer"
                ? "bg-amber-100 text-amber-700"
                : "bg-emerald-100 text-emerald-700";

          const isOutgoing = tran.from_card_id
            ? ownedCardIds.includes(tran.from_card_id)
            : false;

          return (
            <li
              key={tran.id}
              className="w-full items-center rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm transition hover:shadow-lg sm:p-5"
            >
              <div className="flex">
                <div className="mt-3 min-w-0 space-y-2">
                  <p
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide uppercase ${typeClass}`}
                  >
                    Transfer
                  </p>
                  <p className="text-sm text-slate-700">
                    From card **** {tran.from_card?.pan.slice(-4) ?? "----"} to
                    card **** {tran.to_card?.pan.slice(-4) ?? "----"}
                  </p>
                  <p className="text-sm text-slate-500">
                    {new Date(tran.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })}
                  </p>
                </div>

                <div className="ml-auto flex items-center">
                  <p
                    className={`text-xl font-semibold tracking-tight ${isOutgoing ? "text-rose-700" : "text-emerald-700"}`}
                  >
                    {isOutgoing ? "-" : "+"}
                    {currencyFormatter.format(Math.abs(tran.amount))}
                  </p>
                </div>
              </div>
            </li>
          );
        })
      )}
    </ul>
  );
}

function FiltersTransactions({
  filters,
}: {
  filters: {
    by?: string;
    order?: string;
  };
}) {
  const filterForm = useForm({
    by: filters.by ?? "created_at",
    order: filters.order ?? "desc",
  });

  const filter = () => {
    filterForm.get(route("user.dashboard.index"), {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const resetFilters = () => {
    filterForm.setData({ by: "created_at", order: "desc" });
    router.get(
      route("user.dashboard.index"),
      { by: "created_at", order: "desc" },
      { preserveState: true, preserveScroll: true },
    );
  };
  return (
    <div className="flex flex-wrap items-end gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
      <div className="flex min-w-42 flex-col gap-2">
        <label htmlFor="by" className="text-sm font-semibold text-slate-700">
          Filter by
        </label>
        <select
          id="by"
          value={filterForm.data.by}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            filterForm.setData("by", e.target.value)
          }
          className="bg-white px-4 py-3 text-sm text-slate-800 focus:ring-black"
        >
          <option value="created_at">Date</option>
          <option value="amount">Amount</option>
        </select>
      </div>

      <div className="flex min-w-42 flex-col gap-2">
        <label htmlFor="order" className="text-sm font-semibold text-slate-700">
          Order by
        </label>
        <select
          id="order"
          value={filterForm.data.order}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            filterForm.setData("order", e.target.value)
          }
          className="bg-white px-4 py-3 text-sm text-slate-800 focus:ring-black"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={filter}
          className="rounded-xl bg-slate-700 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Filter
        </button>

        <button
          type="button"
          onClick={resetFilters}
          className="rounded-xl bg-slate-200 px-4 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-300"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
