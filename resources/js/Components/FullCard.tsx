import NavigationButton from "@/Components/NavigationButton";
import { CardData } from "@/types";
import BankCard from "./BankCard";
export default function FullCard({
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
        <div className="relative right-0 left-0 flex w-full items-center justify-center gap-6 sm:rounded-lg sm:p-8">
          <NavigationButton onClick={handlePrev} disabled={isFirst} className="text-6xl">
            <i className="bi bi-caret-left-fill"></i>
          </NavigationButton>
          <BankCard key={card.id} card={card} />
          <NavigationButton onClick={handleNext} disabled={isLast} className="text-6xl">
            <i className="bi bi-caret-right-fill"></i>
          </NavigationButton>
        </div>
      </div>
    </>
  );
}
