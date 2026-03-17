import CardInfo from '@/Components/CardInfo';
import Transactions from '@/Components/Transactions';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { type CardData, type Tran } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function UserDashboard({
  userData,
}: {
  userData: (CardData & { transactions: Tran[] })[];
}) {
  const [cards, setCards] = useState(() => userData ?? []);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < userData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // const handleNext = () =>
  //   setCurrentIndex((i) => Math.min(i + 1, cards.length - 1));
  // const handlePrev = () => setCurrentIndex((i) => Math.max(i - 1, 0));

  // const [cardNumber, setCardNumber] = useState<string>(
  //   () => userData?.[0]?.number ?? '',
  // );
  // useEffect(() => {
  //   setBalance(Number(userData?.[0]?.balance ?? 0));
  //   setCardNumber(userData?.[0]?.number ?? '');
  // }, [userData]);

  // const [showCardNumberTooltip, setShowCardNumberTooltip] = useState(false);
  // const hoverTimeout = useRef<number | null>(null);

  // const handleMouseEnter = () => {

  //   clearTimeout(hoverTimeout.current);
  //   setShowCardNumberTooltip(true);
  // };

  // const handleMouseLeave = () => {

  //   hoverTimeout.current = setTimeout(() => {
  //     setShowCardNumberTooltip(false);
  //   }, 1000);
  // };

  // const formatCard = (value: string) => {
  //   return value
  //     .replace(/\D/g, '')
  //     .replace(/(.{4})/g, '$1 ')
  //     .trim();
  // };
  // const mainCard = userData[0] ?? { balance: 0, number: '' };

  const currentCard = userData[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === userData.length - 1;

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

      <div className="card mx-auto mt-10 sm:px-6 lg:px-8">
        <div className="flex max-h-150 flex-col gap-3 overflow-auto">
          {cards.length === 0 ? (
            <p>No transactions found</p>
          ) : (
            <Transactions transactions={selectedTransactions} />
          )}
        </div>
      </div>

      {/* <div className="pb-sm-4 w-1xs flex min-h-[90vh] shrink-0 flex-col gap-10 overflow-hidden rounded bg-gray-300 p-4 align-top shadow">
        <div></div>
        <ul className="flex flex-col gap-4 p-4">
          {userData.card.map((item) => (
            <li key={item.id}>
              <BankCard
                card={{
                  ...item,
                }}
              />
            </li>
          ))}
        </ul>
        <div>
          <p className="text-xs text-gray-300">Balance</p>
          <p className="text-lg font-semibold">{formattedBalance}</p>
        </div>
      </div> */}
    </AuthenticatedLayout>
  );
}
