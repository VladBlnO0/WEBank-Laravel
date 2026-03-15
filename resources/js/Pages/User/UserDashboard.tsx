import BankCard from '@/Components/BankCard';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card } from '@/types';
import { Head } from '@inertiajs/react';
export default function UserDashboard({ userData = [] as Card[] }) {
  // const [balance, setBalance] = useState<number>(() =>
  //   Number(userData?.[0]?.balance ?? 0),
  // );
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

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl leading-tight font-semibold text-gray-800">
          User Dashboard
        </h2>
      }
    >
      <Head title="User Dashboard" />
      <div className="pb-sm-4 w-1xs flex min-h-[90vh] shrink-0 flex-col gap-10 overflow-hidden rounded bg-gray-300 p-4 align-top shadow">
        <ul className="flex flex-col gap-4 p-4">
          {userData.map((item) => (
            <li key={item.id}>
              <BankCard cardNumber={item.number} />
            </li>
          ))}
        </ul>
        <div>
          <i className="bi bi-bank2" aria-label="bank"></i>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
