import NavigationButton from "@/components/navigation-button";
import PaymentNetwork from "@/components/payment-network";
import TransactionsSection from "@/components/transactions-section";
import type { CardData, PaginatedData, Transaction } from "@/types";
import { formatToLocal } from "@/utils/formatData";
import { Head, useForm, usePage, useRemember } from "@inertiajs/react";
import {
  CircleArrowLeft,
  CircleArrowRight,
  CreditCard,
  DollarSign,
} from "lucide-react";
import React, { useEffect, type ChangeEvent } from "react";

interface TransferProps {
  filters: {
    by?: string;
    order?: string;
  };
  cards: CardData[];
  allTransactions?: PaginatedData<Transaction> | null;
}

export default function Transfer({
  filters,
  cards,
  allTransactions,
}: TransferProps) {
  const { flash } = usePage().props as {
    flash?: {
      status?: string;
      status_type?: "success" | "error";
    };
  };

  const [selectedCardId, setSelectedCardId] = useRemember<number | null>(
    cards[0]?.id ?? null,
    "transfer:selected-card-id",
  );
  const selectedCard =
    cards.find((card) => card.id === selectedCardId) ?? cards[0];
  const currentIndex = selectedCard
    ? cards.findIndex((card) => card.id === selectedCard.id)
    : -1;

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

  const { data, setData, post, processing, transform, reset, errors } = useForm(
    {
      from_card_id: selectedCard?.id ?? 0,
      to_card_pan: "",
      amount: "",
    },
  );
  transform((data) => ({
    ...data,
    to_card_pan: data.to_card_pan.replace(/\s+/g, ""),
  }));

  useEffect(() => {
    if (cards.length === 0) {
      return;
    }

    if (!selectedCard) {
      setSelectedCardId(cards[0].id);
    }
  }, [cards, selectedCard, setSelectedCardId]);

  useEffect(() => {
    if (selectedCard) {
      setData("from_card_id", selectedCard.id);
    }
  }, [selectedCard, setData]);

  const submit = (e: React.SubmitEvent) => {
    e.preventDefault();
    post(route("user.transfer.store"), {
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
    <main>
      <meta name="description" content="Transfer page" />
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
            {flash?.status && (
              <div
                className={`rounded-2xl border px-4 py-3 font-medium ${
                  flash.status_type === "error"
                    ? "border-rose-200 bg-rose-50 text-rose-700"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
                aria-label="Transfer status"
              >
                {flash.status}
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
                        <CircleArrowLeft className="size-10 transition hover:-translate-x-0.5" />
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
                        <CircleArrowRight className="size-10 transition hover:translate-x-0.5" />
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
                  <CreditCard className="text-slate-500" />
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
                {errors.to_card_pan && (
                  <p className="mt-2 text-sm text-rose-600">
                    {errors.to_card_pan}
                  </p>
                )}
              </div>

              <div className="w-150">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Amount
                </label>
                <div className="flex w-full items-center gap-2 rounded-2xl border border-slate-300 bg-white px-3 py-3 transition focus-within:border-slate-500">
                  <DollarSign className="text-slate-500" />
                  <input
                    name="amount"
                    type="number"
                    step="0.01"
                    inputMode="decimal"
                    className="w-full border-0 bg-transparent p-0 text-slate-800 placeholder:text-slate-400 focus:ring-0"
                    placeholder="0.00"
                    required
                    value={data.amount}
                    onChange={handleChangeAmount}
                  />
                </div>
                {errors.amount && (
                  <p className="mt-2 text-sm text-rose-600">{errors.amount}</p>
                )}
                <p className="mt-1 text-xs text-slate-500">
                  Maximum per transfer: {formatToLocal(100001)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 border-t border-slate-200 pt-4">
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
            filters={filters}
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
    </main>
  );
}
Transfer.layout = {
  breadcrumbs: [
    {
      title: "Transfer",
    },
  ],
};
