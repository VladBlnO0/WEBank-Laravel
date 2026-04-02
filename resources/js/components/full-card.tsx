import BankCard from "@/components/bank-card";
import NavigationButton from "@/components/navigation-button";
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
  const handleNext = () => {
    if (!isLast) onNext();
  };

  const handlePrev = () => {
    if (!isFirst) onPrev();
  };

  return (
    <div className="relative z-50 mx-auto flex w-full items-center justify-center gap-2 sm:gap-4 lg:gap-6">
      <NavigationButton
        onClick={handlePrev}
        disabled={isFirst}
        className="group rounded-2xl border border-slate-300 bg-white/90 p-3 text-2xl shadow-sm hover:border-slate-400 hover:bg-white disabled:opacity-30 sm:text-4xl"
      >
        <i className="bi bi-caret-left-fill transition hover:-translate-x-0.5" />
      </NavigationButton>

      <div className="relative">
        <BankCard key={card.id} card={card} />
      </div>

      <NavigationButton
        onClick={handleNext}
        disabled={isLast}
        className="group rounded-2xl border border-slate-300 bg-white/90 p-3 text-2xl shadow-sm hover:border-slate-400 hover:bg-white disabled:opacity-30 sm:text-4xl"
      >
        <i className="bi bi-caret-right-fill transition hover:translate-x-0.5" />
      </NavigationButton>
    </div>
  );
}
