import InputError from "@/Components/InputError";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import type { CardData, Tran } from "@/types";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import CardInfo from "@/Components/CardInfo";

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

    // TODO: Perform your transfer action here
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
        <main className="justify-content-center align-items-center flex grow p-4">
          <form
            className="card w-100 p-4 shadow"
            style={{ maxWidth: 700 }}
            onSubmit={handleSubmit}
          >
            <h4 className="mb-4">Transfer</h4>

            {error && <InputError message={error} className="mb-4" />}
            <div className="space-y-6">
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
            <div className="mb-3">
              <label className="form-label">Card number</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-credit-card"></i>
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  className="form-control"
                  placeholder="Enter card number"
                  maxLength="19"
                  required
                  value={card}
                  onChange={handleCardChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Сума</label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  className="form-control"
                  placeholder="Enter amount"
                  required
                  value={amount}
                  onChange={handleAmountChange}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Опис</label>
              <textarea
                className="flex h-20 w-100 flex-col gap-2 rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                placeholder="Для чого цей переказ?"
                rows="3"
                maxLength="40"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="flex w-100 justify-center">
              <button
                type="submit"
                className="btn btn-dark rounded-xl bg-green-500 text-xl text-white hover:bg-green-600"
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
