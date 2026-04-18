import "@/../../resources/css/animation-fade-up.css";
import BankCardSection from "@/components/dashboard-card-section";
import TransactionsSection from "@/components/transactions-section";
import type { CardData, PaginatedData, Transaction } from "@/types";
import { formatToLocal } from "@/utils/formatData";
import { Head, usePage, useRemember } from "@inertiajs/react";
import { useEffect } from "react";

interface DashboardProps {
  filters: {
    by?: string;
    order?: string;
  };
  cards: CardData[];
  allTransactions?: PaginatedData<Transaction> | null;
  thisMonthOutflowTotal?: number;
  thisMonthInflowTotal?: number;
}

export default function Dashboard({
  filters,
  cards,
  allTransactions,
  thisMonthOutflowTotal,
  thisMonthInflowTotal,
}: DashboardProps) {
  const { flash } = usePage().props as { flash?: { status?: string } };

  const [selectedCardId, setSelectedCardId] = useRemember<number | null>(
    cards[0]?.id ?? null,
    "dashboard:selected-card-id",
  );

  const selectedCard: CardData | undefined =
    cards.find((card) => card.id === selectedCardId) ?? cards[0];

  const currentIndex = selectedCard
    ? cards.findIndex((card) => card.id === selectedCard.id)
    : -1;

  useEffect(() => {
    if (cards.length === 0) {
      return;
    }

    if (!selectedCard) {
      setSelectedCardId(cards[0].id);
    }
  }, [cards, selectedCard, setSelectedCardId]);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setSelectedCardId(cards[currentIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedCardId(cards[currentIndex - 1].id);
    }
  };

  const balance: number = selectedCard?.balance ?? 0;
  const income: number = thisMonthInflowTotal ?? 0;
  const spent: number = thisMonthOutflowTotal ?? 0;

  const isFirst: boolean = currentIndex <= 0;
  const isLast: boolean =
    cards.length === 0 || currentIndex === cards.length - 1;

  return (
    <>
      <Head title="User Dashboard" />

      {flash?.status && (
        <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-2 shadow-sm">
          {flash.status}
        </div>
      )}
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
        {selectedCard ? (
          <BankCardSection
            cards={cards}
            selectedCard={selectedCard}
            handleNext={handleNext}
            handlePrev={handlePrev}
            isFirst={isFirst}
            isLast={isLast}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
            No cards found.
          </div>
        )}
      </section>

      <section className="animate-fade-up mt-10 min-h-160 rounded-3xl border border-white/80 bg-white/75 p-4 shadow-sm backdrop-blur-sm transition duration-300 sm:p-6 sm:px-6 lg:px-8">
        <TransactionsSection
          filters={filters}
          allTransactions={allTransactions}
          cardIds={cards.map((card) => card.id)}
        />
      </section>
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
