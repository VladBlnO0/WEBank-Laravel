import type { CardData, Transaction } from "@/types";

export default function Transactions({
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
