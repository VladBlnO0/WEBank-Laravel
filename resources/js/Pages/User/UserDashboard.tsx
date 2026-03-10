import SidebarMenu from '@/Components/Sidebar/SidebarMenu';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function UserDashboard({ userData = [] as Card[] }) {
  const [balance, setBalance] = useState<number>(() =>
    Number(userData?.[0]?.balance ?? 0),
  );
  const [cardNumber, setCardNumber] = useState<string>(
    () => userData?.[0]?.number ?? '',
  );
  useEffect(() => {
    setBalance(Number(userData?.[0]?.balance ?? 0));
    setCardNumber(userData?.[0]?.number ?? '');
  }, [userData]);

  const [showCardNumberTooltip, setShowCardNumberTooltip] = useState(false);
  const hoverTimeout = useRef<number | null>(null);

  const handleMouseEnter = () => {
    // @ts-ignore
    clearTimeout(hoverTimeout.current);
    setShowCardNumberTooltip(true);
  };

  const handleMouseLeave = () => {
    // @ts-ignore
    hoverTimeout.current = setTimeout(() => {
      setShowCardNumberTooltip(false);
    }, 1000);
  };

  // const formatCard = (value: string) => {
  //   return value
  //     .replace(/\D/g, '')
  //     .replace(/(.{4})/g, '$1 ')
  //     .trim();
  // };
  // const mainCard = userData[0] ?? { balance: 0, number: '' };

  return (
    <AuthenticatedLayout>
      <Head title="User Dashboard" />

      <div className="flex overflow-hidden rounded  shadow">
        <SidebarMenu />
        <ul>
          {userData.map((item) => (
            // The 'key' prop is important for performance and identifying elements
            <li key={item.id}>{item.number}</li>
          ))}
        </ul>
      </div>
    </AuthenticatedLayout>
  );
}
