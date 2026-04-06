import Pagination from "@/components/pagination";
import type { CardData, PaginatedData, Transaction } from "@/types";
import { router, useForm } from "@inertiajs/react";

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

  return (
    <>
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">
          Recent transactions
        </h2>
        <p className="text-xs font-medium tracking-[0.14em] text-slate-500 uppercase">
          {allTransactions?.total ?? 0} records
        </p>
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

              <Pagination
                meta={allTransactions}
                className="fixed bottom-10 w-full"
              />
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

          const isOutgoing = ownedCardIds.includes(tran?.from_card_id)
            ? true
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
    <div className="flex flex-wrap items-center gap-3">
      <p>Filter by</p>
      <select
        value={filterForm.data.by}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          filterForm.setData("by", e.target.value)
        }
        className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
      >
        <option value="created_at">Date</option>
        <option value="amount">Amount</option>
      </select>

      <p>Order by</p>
      <select
        value={filterForm.data.order}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          filterForm.setData("order", e.target.value)
        }
        className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
      >
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </select>

      <button
        type="button"
        onClick={filter}
        className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700"
      >
        Filter
      </button>

      <button
        type="button"
        onClick={resetFilters}
        className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700"
      >
        Reset
      </button>
    </div>
  );
}
