import FullCard from "@/Components/FullCard";
import Transactions from "@/Components/Transactions";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { type CardData, type Tran } from "@/types";
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

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl leading-tight font-semibold text-gray-800">
          User Dashboard
        </h2>
      }
    >
      <Head title="User Dashboard" />

      <div className="space-y-6">
        {cards.length === 0 ? (
          <p>No cards found</p>
        ) : (
          <>
            <FullCard
              card={cards[currentIndex]}
              onNext={handleNext}
              onPrev={handlePrev}
              isFirst={currentIndex === 0}
              isLast={currentIndex === cards.length - 1}
            />
          </>
        )}
      </div>

      <div className="mx-auto mt-10 sm:px-6 lg:px-8">
        <div className="custom-scrollbar flex max-h-160 flex-col gap-3 overflow-auto overflow-y-scroll">
          {cards.length === 0 ? (
            <p>No transactions found</p>
          ) : (
            <Transactions transactions={selectedTransactions} />
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
