import SidebarMenu from '@/Components/Sidebar/SidebarMenu';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useRef, useState } from 'react';
type Props = {
  userData: Array<{ balance: number; number: string }>;
  transactions: Array<{
    id: number;
    label: string;
    type: string;
    date: string;
    description?: string;
    status?: string;
    amount: number;
  }>;
};
export default function UserDashboard({ userData, transactions }: Props) {
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

  // const mainCard = userData[0];

  const formatCard = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(.{4})/g, '$1 ')
      .trim();
  };

  return (
    <AuthenticatedLayout>
      <Head title="User Dashboard" />

      <div className="flex overflow-hidden rounded p-2 shadow">
        <SidebarMenu />
        <main className="grow p-4">
          {
            <div
              className="card position-relative mx-auto mb-4 p-4"
              style={{ maxWidth: '320px' }}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  {/* {mainCard && ( */}
                  {true && (
                    <>
                      <div className="text-muted">Головна картка</div>
                      <div className="fs-3 fw-bold">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(123)}
                        {/*/ .format(Number(mainCard.balance))} */}
                      </div>
                      <div
                        className="small position-relative text-muted"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        1111 1111 1111{' '}
                        {/* **** **** **** {mainCard.number.slice(-4)} */}
                      </div>
                    </>
                  )}
                </div>
                <i className="bi bi-credit-card fs-5 text-muted"></i>
              </div>
            </div>
          }
          {
            <div className="card p-4">
              <h2 className="fs-5 fw-semibold mb-3">Транзакції</h2>
              <div
                className="vstack gap-3 overflow-auto"
                style={{
                  maxHeight: '400px',
                  paddingRight: '6px',
                }}
              >
                {/* {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="d-flex justify-content-between align-items-center bg-light rounded border p-3"
                    >
                      <div className="w-100">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div className="fw-medium">
                            {tx.label}
                            <span
                              className={`badge text-uppercase ms-2 ${
                                tx.type === 'Надіслано'
                                  ? 'bg-danger'
                                  : tx.type === 'Отримано'
                                    ? 'bg-success'
                                    : 'bg-primary'
                              }`}
                            >
                              {tx.type}
                            </span>
                          </div>
                          <div className="small text-muted">
                            {new Date(tx.date).toLocaleDateString()}
                          </div>
                        </div>

                        {tx.description && (
                          <div className="small text-muted mb-1">
                            {tx.description}
                          </div>
                        )}

                        {tx.status && (
                          <div className="small text-muted mb-2">
                            {tx.status}
                          </div>
                        )}

                        <div
                          className={`fw-bold text-end ${
                            tx.amount < 0 ? 'text-danger' : 'text-success'
                          }`}
                        >
                          {tx.amount > 0 ? '+' : '-'}$
                          {Math.abs(tx.amount).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))} */}
              </div>
            </div>
          }
        </main>
      </div>

      <footer className="footer">© 2025 Bank. Всі права захищені.</footer>
    </AuthenticatedLayout>
  );
}
