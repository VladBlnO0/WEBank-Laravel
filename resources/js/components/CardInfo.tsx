import React from 'react';

export default function CardInfo({ card }) {
    return (
        <div className="bg-white border rounded p-6 mb-8 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">
                {card.payment_network} {card.type}
            </h2>
            <p><strong>PAN:</strong> {card.pan}</p>
            <p><strong>Status:</strong> {card.status}</p>
        </div>
    );
}
