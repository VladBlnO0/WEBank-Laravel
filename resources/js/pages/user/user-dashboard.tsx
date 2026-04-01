import FullCard from "@/components/full-card";
import Transactions from "@/components/transactions";
import { type CardData, type Tran } from "@/types";
import { formatToLocal } from "@/utils/formatData";
import { Head } from "@inertiajs/react";
import { useState } from "react";

export default function UserDashboard({
  userData,
}: {
  userData:
    | { data: (CardData & { transactions: Tran[] })[] }
    | (CardData & { transactions: Tran[] })[];
}) {
  const cards = Array.isArray(userData) ? userData : (userData?.data ?? []);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const selectedTransactions = cards[currentIndex]?.transactions ?? [];
  const selectedCard = cards[currentIndex];

  const balance = selectedCard?.balance ?? 0;
  const income = selectedTransactions
    .filter((tran) => tran.amount > 0)
    .reduce((sum, tran) => sum + tran.amount, 0);
  const spent = selectedTransactions
    .filter((tran) => tran.amount < 0)
    .reduce((sum, tran) => sum + Math.abs(tran.amount), 0);

  return (
    <>
      <Head title="User Dashboard" />

      <div
        className="space-y-7"
        style={{
          fontFamily:
            '"Space Grotesk", "IBM Plex Sans", "Avenir Next", "Segoe UI", sans-serif',
        }}
      >
        <section className="rounded-2xl border border-white/80 bg-white/70 p-6 shadow-sm sm:p-8">
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium tracking-[0.14em] text-slate-500 uppercase">
                Current balance
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                {formatToLocal(balance)}
              </p>
            </article>

            <article className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-xs font-medium tracking-[0.14em] text-emerald-700 uppercase">
                Incoming
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-emerald-900">
                {formatToLocal(income)}
              </p>
            </article>

            <article className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
              <p className="text-xs font-medium tracking-[0.14em] text-rose-700 uppercase">
                Outgoing
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-rose-900">
                {formatToLocal(spent)}
              </p>
            </article>
          </div>
        </section>

        <section className="rounded-3xl border border-white/80 bg-white/70 p-4 shadow-sm backdrop-blur-sm sm:p-6">
          {cards.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="text-lg font-medium text-slate-700">
                No cards found
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Add your first card to start tracking balance and transfers.
              </p>
            </div>
          ) : (
            <FullCard
              card={selectedCard}
              onNext={handleNext}
              onPrev={handlePrev}
              isFirst={currentIndex === 0}
              isLast={currentIndex === cards.length - 1}
            />
          )}
        </section>
      </div>

      <section className="mx-auto mt-8 rounded-3xl border border-white/80 bg-white/75 p-4 shadow-sm backdrop-blur-sm sm:p-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            Recent transactions
          </h2>
          <p className="text-xs font-medium tracking-[0.14em] text-slate-500 uppercase">
            {selectedTransactions.length} records
          </p>
        </div>

        <div className="custom-scrollbar mt-4 flex max-h-160 snap-y snap-proximity flex-col gap-3 overflow-y-scroll">
          {cards.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="text-lg font-medium text-slate-700">
                No transactions found
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Your latest movements will appear here once activity starts.
              </p>
            </div>
          ) : (
            <Transactions transactions={selectedTransactions} />
          )}
        </div>
      </section>
    </>
  );
}

UserDashboard.layout = {
  breadcrumbs: [
    {
      title: "User Dashboard",
    },
  ],
};
