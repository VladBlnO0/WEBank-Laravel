import NavigationButton from "@/Components/NavigationButton";
import { CardData } from "@/types";
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
  const digitsGroups = card.number.match(/.{0,4}/g) || [];
  const masked = digitsGroups[0] + "•".repeat(8) + digitsGroups[3];
  const cardGroups = masked.match(/.{1,4}/g) || [];

  const handleNext = () => {
    if (!isLast) onNext();
  };

  const handlePrev = () => {
    if (!isFirst) onPrev();
  };

  return (
    <>
      <div className="mx-auto items-center justify-center">
        <div className="relative right-0 left-0 mx-auto flex w-full items-center justify-center sm:rounded-lg sm:p-8 sm:px-6 lg:px-8">
          <NavigationButton
            onClick={handlePrev}
            disabled={isFirst}
            className="text-2xl"
          >
            <i className="bi bi-caret-left-fill"></i>
          </NavigationButton>
          <p>{cardGroups.join(" ")}</p>
          <NavigationButton
            onClick={handleNext}
            disabled={isLast}
            className="text-2xl"
          >
            <i className="bi bi-caret-right-fill"></i>
          </NavigationButton>
        </div>
      </div>
    </>
  );
}
