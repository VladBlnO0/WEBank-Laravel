import { type Tran } from '@/types';

export default function Transactions({
  transactions,
}: {
  transactions: Tran[];
}) {
  return (
    <>
      <ul className="flex flex-col gap-4 p-4">
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions.</p>
        ) : (
          transactions.map((tran) => (
            <li
              key={tran.id}
              className="d-flex justify-content-between align-items-center bg-light rounded border p-3"
            >
              <div className="w-100">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="fw-medium">
                    {tran.label}
                    <span
                      className={`badge text-uppercase ms-2 ${
                        tran.label === 'Надіслано'
                          ? 'bg-danger'
                          : tran.label === 'Отримано'
                            ? 'bg-success'
                            : 'bg-primary'
                      }`}
                    >
                      {tran.label}
                    </span>
                  </div>
                  <div className="text-muted small">
                    {new Date(tran.date).toLocaleDateString()}
                  </div>
                </div>

                {tran.description && (
                  <div className="text-muted small mb-1">
                    {tran.description}
                  </div>
                )}
                {tran.type && (
                  <div className="text-muted small mb-2">{tran.type}</div>
                )}

                <div
                  className={`fw-bold text-end ${tran.amount < 0 ? 'text-danger' : 'text-success'}`}
                >
                  {tran.amount > 0 ? '+' : '-'}$
                  {Math.abs(tran.amount).toFixed(2)}
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </>
  );
}
