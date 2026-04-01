import CardInfo from "@/Components/CardInfo";
import InputError from "@/Components/InputError";
import type { CardData, Tran } from "@/types";
import { formatToLocal } from "@/utils/formatData";
import { Head, useForm } from "@inertiajs/react";
import { type ChangeEvent, useState } from "react";

export default function UserTransfer({
  userData,
}: {
  userData:
    | { data: (CardData & { transactions: Tran[] })[] }
    | (CardData & { transactions: Tran[] })[];
}) {
  const cards = Array.isArray(userData) ? userData : (userData?.data ?? []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const selectedCard = cards[currentIndex];

  const { data, setData, post, processing, errors, reset } = useForm({
    card: "",
    amount: "",
  });

  const [error, setError] = useState("");

  const formatCard = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

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
    const cardNumberForDB = data.card.replace(/\s/g, "");
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

    post(route("register"), {});
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

    if (name === "card") {
      const formatted = value
        .replace(/\D/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
      setData((prev) => ({ ...prev, card: formatted }));
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

  return (
    <>
      <Head title="Transfer" />

      <div
        className="space-y-7"
        style={{
          background:
            "radial-gradient(circle at 85% -10%, #d5f3ea 0%, transparent 30%), radial-gradient(circle at 10% 10%, #fbe3c8 0%, transparent 30%)",
          fontFamily:
            '"Space Grotesk", "IBM Plex Sans", "Avenir Next", "Segoe UI", sans-serif',
        }}
      >
        <section className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur-sm sm:p-7">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
                <InputError message={error} className="m-0" />
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                From card
              </label>
              <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
                {cards.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                    No cards found.
                  </div>
                ) : (
                  <CardInfo
                    card={cards[currentIndex]}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    isFirst={currentIndex === 0}
                    isLast={currentIndex === cards.length - 1}
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col items-center gap-5">
              <div className="w-150">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Recipient card number
                </label>
                <div className="flex w-full items-center gap-2 rounded-2xl border border-slate-300 bg-white px-3 py-3 transition focus-within:border-slate-500">
                  <i className="bi bi-credit-card text-slate-500"></i>
                  <input
                    name="card"
                    type="tel"
                    inputMode="numeric"
                    className="w-full border-0 bg-transparent p-0 text-slate-800 placeholder:text-slate-400 focus:ring-0"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                    value={data.card}
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
              <button
                type="submit"
                className="rounded-xl bg-emerald-600 px-8 py-3 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-500"
              >
                Send transfer
              </button>
            </div>
          </form>
        </section>
      </div>
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
