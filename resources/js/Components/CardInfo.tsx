import NavigationButton from "@/Components/NavigationButton";
import { CardData } from "@/types";
import { formatToLocal } from "@/utils/formatData";
import BankCard from "./BankCard";
export default function CardInfo({
  card,
  onNext,
  onPrev,
  isFirst,
  isLast,
}: {
  card: CardData;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const handleNext = () => {
    if (!isLast) onNext();
  };

  const handlePrev = () => {
    if (!isFirst) onPrev();
  };
  return (
    <>
      <div className="mx-auto items-center justify-center">
        <div className="p-md-4 relative right-0 left-0 flex w-full items-center justify-center gap-6 sm:rounded-lg sm:p-8">
          <NavigationButton onClick={handlePrev} disabled={isFirst}>
            <i className="bi bi-caret-left-fill"></i>
          </NavigationButton>
          <BankCard card={card} />
          <NavigationButton onClick={handleNext} disabled={isLast}>
            <i className="bi bi-caret-right-fill"></i>
          </NavigationButton>
        </div>
      </div>
      <div className="relative right-0 left-0 mx-auto mt-8 w-full max-w-100 items-center justify-center rounded-2xl bg-white shadow sm:rounded-lg sm:p-8 sm:px-6 lg:px-8">
        <div className="bg-gray-100 shadow sm:rounded-lg sm:p-8 sm:px-6 lg:px-8">
          <p className="text-lg">
            Balance: <strong>{formatToLocal(card.balance)}</strong>
          </p>
        </div>
        <div className="mt-2 flex items-center justify-between bg-gray-100 pt-4 shadow sm:rounded-lg sm:p-8 sm:px-6 lg:px-8">
          <p className="text-lg">
            Limit: <strong>{formatToLocal(card.limit_amount)}</strong>
          </p>
          <i className="bi bi-gear-fill text-xl text-gray-800"></i>
        </div>
      </div>
    </>
  );
}
