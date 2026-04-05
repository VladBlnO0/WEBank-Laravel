import BankCard from "@/components/bank-card";
import NavigationButton from "@/components/navigation-button";
import Pagination from "@/components/pagination";
import Transactions from "@/components/transactions";
import { formatToLocal } from "@/utils/formatData";
import { Head } from "@inertiajs/react";
import { useMemo, useState } from "react";

type RawCard = {
  id: number;
  pan?: string;
  balance: number;
  expire_date?: number | string;
  status?: string;
  payment_network: string;
  type?: string;
  limit_amount?: number;
  cvv?: string;
  monthly_inflow?: number;
  monthly_outflow?: number;
  monthly_inflow_sum_amount?: number;
  monthly_outflow_sum_amount?: number;
  sent_transactions_count?: number;
  received_transactions_count?: number;
};
type CardData = {
  id: number;
  number: string;
  balance: number;
  expire_date?: number;
  status?: string;
  payment_network: string;
  type?: string;
  limit_amount?: number;
  cvv?: string;
  monthly_inflow: number;
  monthly_outflow: number;
};
type RawTransaction = {
  id: number;
  from_card_id?: number;
  to_card_id?: number;
  type?: string;
  created_at?: string;
  description?: string;
  amount: number;
};
type Tran = {
  id: number;
  from_card_id?: number;
  to_card_id?: number;
  label: string;
  type: string;
  date: string;
  description?: string;
  amount: number;
};
type TransactionsList = {
  data?: RawTransaction[];
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
};

export default function Dashboard({
  cards,
  allTransactions,
  thisMonthOutflowTotal,
  thisMonthInflowTotal,
}: {
  cards: RawCard[];
  allTransactions?: TransactionsList;
  thisMonthOutflowTotal?: number;
  thisMonthInflowTotal?: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const normalizedCards = useMemo<CardData[]>(
    () =>
      cards.map((card) => ({
        id: card.id,
        number: card.pan ?? "",
        balance: card.balance ?? 0,
        expire_date:
          typeof card.expire_date === "string"
            ? new Date(card.expire_date).getTime()
            : card.expire_date,
        status: card.status,
        payment_network: card.payment_network,
        type: card.type,
        limit_amount: card.limit_amount,
        cvv: card.cvv,
        monthly_inflow:
          card.monthly_inflow ??
          card.monthly_inflow_sum_amount ??
          card.received_transactions_count ??
          0,
        monthly_outflow:
          card.monthly_outflow ??
          card.monthly_outflow_sum_amount ??
          card.sent_transactions_count ??
          0,
      })),
    [cards],
  );

  const selectedCard = useMemo(
    () => normalizedCards[currentIndex],
    [normalizedCards, currentIndex],
  );

  const handleNext = () => {
    if (currentIndex < normalizedCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const balance = selectedCard?.balance ?? 0;
  const income = thisMonthInflowTotal ?? selectedCard?.monthly_inflow ?? 0;
  const spent = thisMonthOutflowTotal ?? selectedCard?.monthly_outflow ?? 0;

  const isFirst: boolean = currentIndex === 0;
  const isLast: boolean = currentIndex === normalizedCards.length - 1;
  const paginatedTransactions: Tran[] = useMemo(
    () =>
      (allTransactions?.data ?? []).map((transaction) => ({
        id: transaction.id,
        from_card_id: transaction.from_card_id,
        to_card_id: transaction.to_card_id,
        label: transaction.type ?? "transaction",
        type: transaction.type ?? "transaction",
        date: transaction.created_at ?? new Date().toISOString(),
        description: transaction.description,
        amount: Number(transaction.amount ?? 0),
      })),
    [allTransactions],
  );
  return (
    <>
      <Head title="User Dashboard" />

      <section
        className="mb-5 space-y-7"
        style={{
          fontFamily:
            '"Space Grotesk", "IBM Plex Sans", "Avenir Next", "Segoe UI", sans-serif',
        }}
      >
        <section className="animate-fade-up mx-auto w-full max-w-7xl rounded-2xl border border-white/80 bg-white/70 p-6 shadow-sm transition duration-300 sm:p-8">
          <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
            Account snapshot
          </p>

          <div className="mx-auto mt-3 grid w-full max-w-7xl gap-3 p-5 sm:grid-cols-3 sm:p-8">
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:shadow-lg">
              <p className="text-xs font-medium tracking-[0.14em] text-slate-500 uppercase">
                Current balance
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                {formatToLocal(balance)}
              </p>
            </article>
            <article className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 hover:shadow-lg">
              <p className="text-xs font-medium tracking-[0.14em] text-emerald-700 uppercase">
                Monthly inflow
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-emerald-900">
                {formatToLocal(income)}
              </p>
            </article>
            <article className="rounded-2xl border border-rose-100 bg-rose-50 p-4 hover:shadow-lg">
              <p className="text-xs font-medium tracking-[0.14em] text-rose-700 uppercase">
                Monthly outflow
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-rose-900">
                {formatToLocal(spent)}
              </p>
            </article>
          </div>
        </section>
      </section>

      <section className="animate-fade-up relative z-10 mx-auto max-w-7xl rounded-3xl border border-white/80 bg-white/70 p-4 shadow-sm backdrop-blur-sm transition duration-300 sm:p-6 sm:px-6">
        {normalizedCards.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <p className="text-lg font-medium text-slate-700">No cards found</p>
          </div>
        ) : (
          <div className="relative z-20 mx-auto flex w-full items-center justify-center gap-2 sm:gap-4 lg:gap-6">
            {normalizedCards.length > 1 && (
              <NavigationButton
                onClick={handlePrev}
                disabled={isFirst}
                className="group rounded-2xl border border-slate-300 bg-white/90 p-3 text-2xl shadow-sm hover:border-slate-400 hover:bg-white disabled:opacity-30 sm:text-4xl"
              >
                <i className="bi bi-caret-left-fill transition hover:-translate-x-0.5" />
              </NavigationButton>
            )}

            <div className="relative z-30">
              <BankCard key={selectedCard.id} card={selectedCard} />
            </div>

            {normalizedCards.length > 1 && (
              <NavigationButton
                onClick={handleNext}
                disabled={isLast}
                className="group rounded-2xl border border-slate-300 bg-white/90 p-3 text-2xl shadow-sm hover:border-slate-400 hover:bg-white disabled:opacity-30 sm:text-4xl"
              >
                <i className="bi bi-caret-right-fill transition hover:translate-x-0.5" />
              </NavigationButton>
            )}
          </div>
        )}
      </section>

      <section className="animate-fade-up mt-10 min-h-160 rounded-3xl border border-white/80 bg-white/75 p-4 shadow-sm backdrop-blur-sm transition duration-300 sm:p-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            Recent transactions
          </h2>
          <p className="text-xs font-medium tracking-[0.14em] text-slate-500 uppercase">
            {paginatedTransactions.length} records
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {normalizedCards.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="text-lg font-medium text-slate-700">
                No transactions found
              </p>
            </div>
          ) : allTransactions === null ? (
            <div className="p-8 text-center text-slate-600">
              Loading transactions...
            </div>
          ) : (
            <>
              <div className="flex min-h-170 flex-col gap-3">
                <Transactions transactions={paginatedTransactions} />

                <Pagination
                  meta={allTransactions}
                  className="fixed bottom-10 w-full"
                />
              </div>
            </>
          )}
        </div>
      </section>
      <style>{`
        .animate-fade-up {
          opacity: 0;
          transform: translateY(18px);
          animation: fadeUp 700ms cubic-bezier(0.2, 0.7, 0.25, 1) forwards;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}

Dashboard.layout = {
  breadcrumbs: [
    {
      title: "Dashboard",
    },
  ],
};
