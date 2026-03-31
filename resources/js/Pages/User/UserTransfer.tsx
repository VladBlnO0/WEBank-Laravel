import CardInfo from "@/Components/CardInfo";
import InputError from "@/Components/InputError";
import type { CardData, Tran } from "@/types";
import { Head } from "@inertiajs/react";
import { type ChangeEvent, type FormEvent, useState } from "react";

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

  const [card, setCard] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const formatCard = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };
  const handleCardChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = formatCard(rawValue);
    setCard(formatted);
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") {
      setAmount("");
      return;
    }

    const match = raw.match(/^\d*\.?\d{0,2}$/);
    const parsed = parseFloat(raw);
    if (match && (isNaN(parsed) || parsed <= 100001)) {
      setAmount(raw);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!selectedCard) {
      setError("No sender card available.");
      return;
    }

    const userBalance = selectedCard.balance;
    const senderCard = selectedCard.number;

    const amountDB = parseFloat(amount);

    const cardNumberForDB = card.replace(/\s/g, "");
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

    console.log("Transfer successful", {
      cardNumberForDB,
      amountDB,
      description,
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
        <section className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-sm backdrop-blur-sm sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                Move funds instantly
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                Card to card transfer
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Send money securely with real-time validation and clear limits.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-right">
              <p className="text-xs tracking-[0.14em] text-emerald-700 uppercase">
                Available balance
              </p>
              <p className="mt-1 text-xl font-semibold text-emerald-900">
                {currencyFormatter.format(selectedCard?.balance ?? 0)}
              </p>
            </div>
          </div>
        </section>

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

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Recipient card number
                </label>
                <div className="flex w-full items-center gap-2 rounded-2xl border border-slate-300 bg-white px-3 py-3 transition focus-within:border-slate-500">
                  <i className="bi bi-credit-card text-slate-500"></i>
                  <input
                    type="tel"
                    inputMode="numeric"
                    className="w-full border-0 bg-transparent p-0 text-slate-800 placeholder:text-slate-400 focus:ring-0"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                    value={card}
                    onChange={handleCardChange}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Amount
                </label>
                <div className="flex w-full items-center gap-2 rounded-2xl border border-slate-300 bg-white px-3 py-3 transition focus-within:border-slate-500">
                  <i className="bi bi-currency-dollar text-slate-500"></i>
                  <input
                    type="text"
                    inputMode="decimal"
                    className="w-full border-0 bg-transparent p-0 text-slate-800 placeholder:text-slate-400 focus:ring-0"
                    placeholder="0.00"
                    required
                    value={amount}
                    onChange={handleAmountChange}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Maximum per transfer: {currencyFormatter.format(100001)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
              <p className="text-xs tracking-wide text-slate-500 uppercase">
                Processing is encrypted and monitored
              </p>
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
