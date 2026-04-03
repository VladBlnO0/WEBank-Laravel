import React from 'react';

export default function TransactionList({ title, transactions, type }) {
    // A quick helper to style amounts based on if they are sent or received
    const amountColor = type === 'sent' ? 'text-red-600' : 'text-green-600';
    const amountPrefix = type === 'sent' ? '-' : '+';

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">{title}</h3>
            {transactions.length === 0 ? (
                <p className="text-gray-500">No transactions found.</p>
            ) : (
                <ul className="space-y-3">
                    {transactions.map(tx => (
                        <li key={tx.id} className="p-3 border rounded bg-gray-50 flex justify-between">
                            <span>
                                {type === 'sent' ? `To Card ID: ${tx.to_card_id}` : `From Card ID: ${tx.from_card_id}`}
                            </span>
                            <span className={`font-bold ${amountColor}`}>
                                {amountPrefix}${tx.amount}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
