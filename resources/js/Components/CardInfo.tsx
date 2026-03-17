import NavigationButton from '@/Components/NavigationButton';
import { CardData } from '@/types';
import { formatToLocal } from '@/utils/formatData';
import BankCard from './BankCard';
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
      <div className="relative right-0 left-0 z-50 mx-auto mt-8 w-full max-w-100 items-center justify-center rounded-2xl bg-white p-2 px-4 shadow sm:rounded-lg sm:p-8 sm:px-6 lg:px-8">
        <div className="bg-gray-200 p-2 px-4 shadow sm:rounded-lg sm:p-8 sm:px-6 lg:px-8">
          <p className="text-gray-500">Balance:</p>
          <p className="text-lg font-bold">{formatToLocal(card.balance)}</p>
        </div>
        <div className="mt-2 bg-gray-200 p-2 px-4 pt-4 shadow sm:rounded-lg sm:p-8 sm:px-6 lg:px-8">
          <p className="text-gray-500">Limit:</p>
          <p className="text-lg font-bold">
            {formatToLocal(card.limit_amount)}
          </p>
        </div>
      </div>
    </>
  );
}
