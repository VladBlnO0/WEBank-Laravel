import NavigationButton from "@/components/navigation-button";
import { CardData } from "@/types";
import { formatToLocal } from "@/utils/formatData";
import PaymentNetwork from "./payment-network";

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

          <section className="bg-white-50 flex h-35 w-80 items-start justify-between gap-4 rounded-2xl border border-white p-6 shadow-md shadow-gray-400 backdrop-blur-md">
            <div className="flex flex-row items-center gap-3">
              <span className="h-10 w-15 rounded-md bg-linear-to-br from-slate-950 via-slate-800 to-slate-600 shadow-2xl" />
              <div className="flex flex-col gap-2">
                <PaymentNetwork card={card} className="size-10" />
                <p className="text-xs tracking-[0.14em]">
                  {cardGroups.join(" ")}
                </p>
                <p className="font-bold">{formatToLocal(card.balance)}</p>
              </div>
            </div>
          </section>

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
