import BankCard from "@/Components/BankCard";
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
  const handleNext = () => {
    if (!isLast) onNext();
  };

  const handlePrev = () => {
    if (!isFirst) onPrev();
  };

  return (
    <div className="mx-auto w-full items-center justify-center">
      <div className="relative right-0 left-0 flex w-full items-center justify-center gap-2 sm:gap-4 lg:gap-6">
        <NavigationButton
          onClick={handlePrev}
          disabled={isFirst}
          className="group rounded-2xl border border-slate-300 bg-white/90 p-3 text-2xl shadow-sm hover:border-slate-400 hover:bg-white disabled:opacity-30 sm:text-4xl"
        >
          <i className="bi bi-caret-left-fill transition group-hover:-translate-x-0.5" />
        </NavigationButton>

        <div className="relative">
          <BankCard
            key={card.id}
            card={card}
            className="scale-90 sm:scale-100"
          />
          <div className="pointer-events-none absolute -bottom-3 left-1/2 h-4 w-4/5 -translate-x-1/2 rounded-full bg-slate-400/30 blur-md" />
        </div>

        <NavigationButton
          onClick={handleNext}
          disabled={isLast}
          className="group rounded-2xl border border-slate-300 bg-white/90 p-3 text-2xl shadow-sm hover:border-slate-400 hover:bg-white disabled:opacity-30 sm:text-4xl"
        >
          <i className="bi bi-caret-right-fill transition group-hover:translate-x-0.5" />
        </NavigationButton>
      </div>
    </div>
  );
}
