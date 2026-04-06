import type { CardData} from "@/types";
import BankCard from "@/components/bank-card";
import NavigationButton from "@/components/navigation-button";
export default function BankCardSection({
  cards,
  selectedCard,
  handleNext,
  handlePrev,
  isFirst,
  isLast,
}: {
  cards: CardData[];
  selectedCard: CardData;
  handleNext: () => void;
  handlePrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <>
      {cards.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="text-lg font-medium text-slate-700">No cards found</p>
        </div>
      ) : (
        <div className="relative z-20 mx-auto flex w-full items-center justify-center gap-2 sm:gap-4 lg:gap-6">
          {cards.length > 1 && (
            <NavigationButton
              onClick={handlePrev}
              disabled={isFirst}
              className="group rounded-2xl border border-slate-300 bg-white/90 p-3 text-2xl shadow-sm hover:border-slate-400 hover:bg-white disabled:opacity-30 sm:text-4xl"
              aria-label="Previous Card"
            >
              <i className="bi bi-caret-left-fill transition hover:-translate-x-0.5" />
            </NavigationButton>
          )}

          <div className="relative z-30">
            <BankCard key={selectedCard.id} card={selectedCard} />
          </div>

          {cards.length > 1 && (
            <NavigationButton
              onClick={handleNext}
              disabled={isLast}
              className="group rounded-2xl border border-slate-300 bg-white/90 p-3 text-2xl shadow-sm hover:border-slate-400 hover:bg-white disabled:opacity-30 sm:text-4xl"
              aria-label="Next Card"
            >
              <i className="bi bi-caret-right-fill transition hover:translate-x-0.5" />
            </NavigationButton>
          )}
        </div>
      )}
    </>
  );
}
