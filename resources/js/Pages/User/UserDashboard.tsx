import BankCard from '@/Components/BankCard';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { CardData } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
export default function UserDashboard({ userData }: { userData: CardData[] }) {
  const [cards, setCards] = useState<CardData[]>(() => userData ?? []);
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

  const formatData = (value: any) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Number(value || 0));

  function formatCardNumber(value: string) {
    return value
      .replace(/\D/g, '')
      .replace(/(.{4})/g, '$1 ')
      .trim();
  }

  const cardElements = userData.map((card) => (
    <li key={card.id}>
      <div>
        <BankCard card={card} />
        <div>
          <p className="text-xs text-gray-500">Balance</p>
          <p>{formatData(card.balance)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Limit</p>
          <p>{formatData(card.limit_amount)}</p>
        </div>
      </div>
    </li>
  ));

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl leading-tight font-semibold text-gray-800">
          User Dashboard
        </h2>
      }
    >
      <Head title="User Dashboard" />

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
          <p>userData: {JSON.stringify(userData)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-300">Balance</p>
          <p className="text-lg font-semibold">{formattedBalance}</p>
        </div>
      </div> */}
      <div className="space-y-6">
        {userData.length === 0 ? (
          <p>No cards found.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cardElements}
          </ul>
        )}
        <div></div>
      </div>
    </AuthenticatedLayout>
  );
}
