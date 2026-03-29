import CardInfo from "@/Components/CardInfo";
import InputError from "@/Components/InputError";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import type { CardData, Tran } from "@/types";
import { Head } from "@inertiajs/react";
import { useState } from "react";

export default function UserTransfer({
  userData,
}: {
  userData:
    | { data: (CardData & { transactions: Tran[] })[] }
    | (CardData & { transactions: Tran[] })[];
}) {
  const cards = Array.isArray(userData) ? userData : (userData?.data ?? []);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [card, setCard] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const formatCard = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };
  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = formatCard(rawValue);
    setCard(formatted);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") {
      setAmount("");
      return;
    }

    const match = raw.match(/^\d*\.?\d{0,2}$/);
    if (match && Number(raw) <= 100001) {
      setAmount(raw);
    }
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const userBalance = parseFloat(cards[currentIndex].balance);
    const senderCard = cards[currentIndex]?.number;

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
    <AuthenticatedLayout
      header={
        <h2 className="text-xl leading-tight font-semibold text-gray-800">
          Transfer
        </h2>
      }
    >
      <Head title="Dashboard" />

      <div className="flex overflow-hidden rounded bg-white p-2 shadow">
        <main className="flex grow items-center justify-center p-4">
          <form
            className="card w-150 p-4 shadow"
            style={{ maxWidth: 700 }}
            onSubmit={handleSubmit}
          >
            <div className="flex items-center justify-center text-2xl font-semibold text-gray-800 shadow sm:rounded-lg sm:p-4 sm:px-2 lg:px-4">
              <h4>Transfer</h4>
            </div>
            <div className="mb-3">
              <label>From</label>
              <div className="flex w-full flex-row items-center gap-2 rounded border border-gray-300 bg-white px-3 py-2 focus-within:border-blue-500 focus-within:outline-none">
                {error && <InputError message={error} className="mb-4" />}
                {cards.length === 0 ? (
                  <p>No cards found</p>
                ) : (
                  <>
                    <CardInfo
                      card={cards[currentIndex]}
                      onNext={handleNext}
                      onPrev={handlePrev}
                      isFirst={currentIndex === 0}
                      isLast={currentIndex === cards.length - 1}
                    />
                  </>
                )}
              </div>
            </div>
            <div className="mb-3">
              <label>Card number</label>
              <div className="flex w-full flex-row items-center gap-2 rounded border border-gray-300 bg-white px-3 py-2 focus-within:border-blue-500 focus-within:outline-none">
                <i className="bi bi-credit-card"></i>
                <input
                  type="tel"
                  inputMode="numeric"
                  className="w-full border-0 bg-transparent p-0 focus:ring-0"
                  placeholder="Enter card number"
                  maxLength="19"
                  required
                  value={card}
                  onChange={handleCardChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label>Amount</label>
              <div className="flex w-full flex-row items-center gap-2 rounded border border-gray-300 bg-white px-3 py-2 focus-within:border-blue-500 focus-within:outline-none">
                <i className="bi bi-currency-dollar"></i>
                <input
                  type="text"
                  inputMode="decimal"
                  className="w-full border-0 bg-transparent p-0 focus:ring-0"
                  placeholder="Enter amount"
                  required
                  value={amount}
                  onChange={handleAmountChange}
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="btn btn-dark mt-4 w-50 rounded-xl bg-green-500 text-xl text-white hover:bg-green-600"
              >
                <p className="my-1 mr-2 ml-2">Send</p>
              </button>
            </div>
          </form>
        </main>
      </div>
    </AuthenticatedLayout>
  );
}
