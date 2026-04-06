import NavigationButton from "@/components/navigation-button";
import Pagination from "@/components/pagination";
import PaymentNetwork from "@/components/payment-network";
import Transactions from "@/components/transactions";
import type { CardData, PaginatedData, Transaction } from "@/types";
import { formatToLocal } from "@/utils/formatData";
import { Head, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState, type ChangeEvent } from "react";

interface TransferProps {
  cards: CardData[];
  allTransactions?: PaginatedData<Transaction> | null;
}
function TransactionsSection({
  allTransactions,
  cardIds,
}: {
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
              <Transactions transactions={transactions} cardIds={cardIds} />

              <Pagination
                meta={{
                  current_page: allTransactions?.current_page,
                  last_page: allTransactions?.last_page,
                  per_page: allTransactions?.per_page,
                  total: allTransactions?.total,
                }}
                className="fixed bottom-10 w-full"
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
export default function Transfer({ cards, allTransactions }: TransferProps) {
  const { flash, errors } = usePage().props as any;

  const [currentIndex, setCurrentIndex] = useState(0);
  const selectedCard = cards[currentIndex];

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

  const { data, setData, post, processing, transform, reset } = useForm({
    from_card_id: selectedCard.id,
    to_card_pan: "",
    amount: "",
  });
  transform((data) => ({
    ...data,
    to_card_pan: data.to_card_pan.replace(/\s+/g, ""),
  }));

  useEffect(() => {
    if (selectedCard) {
      setData("from_card_id", selectedCard.id);
    }
  }, [selectedCard, setData]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("transfer.store"), {
      preserveScroll: true,
      onSuccess: () => reset("to_card_pan", "amount"),
    });
  };

  const handleChangePan = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = value
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
    setData("to_card_pan", formatted);
  };
  const handleChangeAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "") {
      setData("amount", "");
      return;
    }

    const isValid = /^\d*\.?\d{0,2}$/.test(value);
    const parsed = parseFloat(value);
    const max = 100001;

    if (isValid && (isNaN(parsed) || parsed <= max)) {
      setData("amount", value);
    }
  };
  const digitsGroups = selectedCard?.pan.match(/.{0,4}/g) || [];

  const masked = digitsGroups[0] + "•".repeat(8) + digitsGroups[3];
  const cardGroups = masked.match(/.{1,4}/g) || [];
  const isFirst: boolean = currentIndex === 0;
  const isLast: boolean = currentIndex === cards.length - 1;
  return (
    <>
      <Head title="Transfer" />
      <div
        className="space-y-7"
        style={{
          fontFamily:
            '"Space Grotesk", "IBM Plex Sans", "Avenir Next", "Segoe UI", sans-serif',
        }}
      >
        <section className="animate-fade-up rounded-3xl border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition duration-300 sm:p-7">
          <form className="space-y-5" onSubmit={submit}>
            {flash?.success && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-medium text-emerald-700">
                {flash.success}
              </div>
            )}
            {(flash?.error || Object.keys(errors).length > 0) && (
              <div className="rounded-md bg-rose-50 p-3 text-rose-800">
                {flash?.error && <div>{flash.error}</div>}
                {Object.entries(errors).map(([field, messages]) => (
                  <div key={field}>
                    <strong>{field}:</strong> {Array.isArray(messages) ? messages.join(', ') : messages}
                  </div>
                ))}
              </div>
            )}
            <div>
              {cards.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                  No cards found.
                </div>
              ) : (
                <div className="mx-auto items-center justify-center">
                  <div className="relative right-0 left-0 mx-auto flex w-full items-center justify-center sm:rounded-lg sm:p-8 sm:px-6 lg:px-8">
                    {cards.length > 1 && (
                      <NavigationButton
                        onClick={handlePrev}
                        disabled={isFirst}
                        className="text-2xl"
                      >
                        <i className="bi bi-caret-left-fill"></i>
                      </NavigationButton>
                    )}

                    <section className="bg-white-50 flex h-35 w-80 items-start justify-between gap-4 rounded-2xl border border-white p-6 shadow-md shadow-gray-400 backdrop-blur-md">
                      <div className="flex flex-row items-center gap-3">
                        <span className="h-10 w-15 rounded-md bg-linear-to-br from-slate-950 via-slate-800 to-slate-600 shadow-2xl" />
                        <div className="flex flex-col gap-2">
                          <PaymentNetwork
                            card={selectedCard}
                            className="size-10"
                          />
                          <p className="text-xs tracking-[0.14em]">
                            {cardGroups.join(" ")}
                          </p>
                          <p className="font-bold">
                            {formatToLocal(selectedCard.balance)}
                          </p>
                        </div>
                      </div>
                    </section>
                    {cards.length > 1 && (
                      <NavigationButton
                        onClick={handleNext}
                        disabled={isLast}
                        className="text-2xl"
                      >
                        <i className="bi bi-caret-right-fill"></i>
                      </NavigationButton>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-5">
              <div className="w-150">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Recipient card number
                </label>
                <div className="flex w-full items-center gap-2 rounded-2xl border border-slate-300 bg-white px-3 py-3 transition focus-within:border-slate-500">
                  <i className="bi bi-credit-card text-slate-500"></i>
                  <input
                    name="to_card_pan"
                    type="tel"
                    inputMode="numeric"
                    className="w-full border-0 bg-transparent p-0 text-slate-800 placeholder:text-slate-400 focus:ring-0"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                    value={data.to_card_pan}
                    onChange={handleChangePan}
                  />
                </div>
              </div>

              <div className="w-150">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Amount
                </label>
                <div className="flex w-full items-center gap-2 rounded-2xl border border-slate-300 bg-white px-3 py-3 transition focus-within:border-slate-500">
                  <i className="bi bi-currency-dollar text-slate-500"></i>
                  <input
                    name="amount"
                    type="text"
                    inputMode="decimal"
                    className="w-full border-0 bg-transparent p-0 text-slate-800 placeholder:text-slate-400 focus:ring-0"
                    placeholder="0.00"
                    required
                    value={data.amount}
                    onChange={handleChangeAmount}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Maximum per transfer: {formatToLocal(100001)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 border-t border-slate-200 pt-4">
              {/* {flash?.success && (
                <div className="alert-success">{flash.success}</div>
              )} */}
              <button
                type="submit"
                disabled={processing || cards.length === 0}
                className="rounded-xl bg-emerald-600 px-8 py-3 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-500"
              >
                Send transfer
              </button>
            </div>
          </form>
        </section>
        <section className="animate-fade-up mt-10 min-h-160 rounded-3xl border border-white/80 bg-white/75 p-4 shadow-sm backdrop-blur-sm transition duration-300 sm:p-6 sm:px-6 lg:px-8">
          <TransactionsSection
            allTransactions={allTransactions}
            cardIds={cards.map((card) => card.id)}
          />
        </section>
      </div>
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
Transfer.layout = {
  breadcrumbs: [
    {
      title: "Transfer",
    },
  ],
};
