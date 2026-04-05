import InputError from "@/components/input-error";
import NavigationButton from "@/components/navigation-button";
import Pagination from "@/components/pagination";
import PaymentNetwork from "@/components/payment-network";
import Transactions from "@/components/transactions";
import type { CardData, PageProps, Tran } from "@/types";
import { formatToLocal } from "@/utils/formatData";
import { Head, useForm, usePage } from "@inertiajs/react";
import React, { type ChangeEvent, useState } from "react";

export default function Transfer({
  userData,
  selectedCard,
  transactions,
}: {
  userData: { data: CardData[] } | CardData[];
  selectedCard: CardData;
  transactions?: { data: Tran[]; meta?: any; links?: any } | null;
}) {
  const cards = Array.isArray(userData) ? userData : (userData?.data ?? []);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data, setData, post, processing, errors } = useForm({
    from_card_id: selectedCard.id,
    to_card: "",
    amount: "",
  });
  const { flash } =
    usePage<PageProps<{ flash?: { success?: string } }>>().props;

  const [error, setError] = useState("");

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!selectedCard) {
      setError("No sender card available.");
      return;
    }

    const userBalance = selectedCard.balance;
    const senderCard = selectedCard.number;

    const amountDB = parseFloat(data.amount);
    const cardNumberForDB = data.to_card.replace(/\s/g, "");
    const cardNumberDB = senderCard?.replace(/\D/g, "") ?? "";

    if (!cardNumberForDB || cardNumberForDB.length !== 16) {
      setError("Card number must contain 16 digits.");
      return;
    }

    if (cardNumberDB === cardNumberForDB) {
      setError("Cannot send money to your own card.");
      return;
    }

    if (isNaN(amountDB) || amountDB <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (amountDB > userBalance) {
      setError("Insufficient funds in your account.");
      return;
    }

    post(route("transactions.store"), {
      preserveScroll: true,
    });
  };

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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "to_card") {
      const formatted = value
        .replace(/\D/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
      setData((prev) => ({ ...prev, to_card: formatted }));
      return;
    }

    if (name === "amount") {
      if (value === "") {
        setData((prev) => ({ ...prev, amount: "" }));
        return;
      }
      const isValid = /^\d*\.?\d{0,2}$/.test(value);
      const parsed = parseFloat(value);
      const max = 100001;
      if (isValid && (isNaN(parsed) || parsed <= max)) {
        setData((prev) => ({ ...prev, amount: value }));
      }
      return;
    }

    setData((prev) => ({ ...prev, [name]: value }));
  };
  const digitsGroups = selectedCard.number.match(/.{0,4}/g) || [];
  const paginatedTransactions: Tran[] = transactions?.data ?? [];

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
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
                <InputError message={error} className="m-0" />
              </div>
            )}

            {errors.to_card && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
                <InputError message={errors.to_card} className="m-0" />
              </div>
            )}

            {errors.amount && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
                <InputError message={errors.amount} className="m-0" />
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
                    name="to_card"
                    type="tel"
                    inputMode="numeric"
                    className="w-full border-0 bg-transparent p-0 text-slate-800 placeholder:text-slate-400 focus:ring-0"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                    value={data.to_card}
                    onChange={handleChange}
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
                    onChange={handleChange}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Maximum per transfer: {formatToLocal(100001)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 border-t border-slate-200 pt-4">
              {flash?.success && (
                <div className="alert-success">{flash.success}</div>
              )}
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
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              Recent transactions
            </h2>
            <p className="text-xs font-medium tracking-[0.14em] text-slate-500 uppercase">
              {transactions?.meta.total ?? 0} records
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {cards.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <p className="text-lg font-medium text-slate-700">
                  No transactions found
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Your latest movements will appear here once activity starts.
                </p>
              </div>
            ) : transactions === null ? (
              <div className="p-8 text-center text-slate-600">
                Loading transactions...
              </div>
            ) : (
              <>
                <div className="flex min-h-170 flex-col gap-3">
                  <Transactions transactions={paginatedTransactions} />

                  <Pagination
                    meta={transactions?.meta}
                    className="fixed bottom-10 w-full"
                  />
                </div>
              </>
            )}
          </div>
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
UserTransfer.layout = {
  breadcrumbs: [
    {
      title: "User Transfer",
    },
  ],
};
