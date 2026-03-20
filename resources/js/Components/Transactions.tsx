import { type Tran } from "@/types";

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
              className="width-full mt-2 bg-gray-100 pt-4 shadow sm:rounded-lg sm:p-8 sm:px-6 lg:px-8"
            >
              <div className="flex w-full rounded-lg border-2 border-gray-300 p-2">
                <div className="flex flex-col gap-2">
                  <p
                    className={`uppercase ${
                      tran.type === "payment"
                        ? "text-red-600"
                        : tran.type === "transfer"
                          ? "text-orange-600"
                          : "text-green-600"
                    }`}
                  >
                    {tran.type}
                  </p>
                  <div className="text-gray-500">
                    {new Date(tran.date).toLocaleDateString()}
                  </div>
                  {tran.description && (
                    <div className="mb-1">{tran.description}</div>
                  )}
                </div>
                <div className="ml-auto flex items-center">
                  <div
                    className={`text-xl font-bold ${tran.amount < 0 ? "text-red-700" : "text-green-700"}`}
                  >
                    {tran.amount > 0 ? "+" : "-"}$
                    {Math.abs(tran.amount).toFixed(2)}
                  </div>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </>
  );
}
