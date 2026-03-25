<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CardDashboardResource extends JsonResource
{
    /**
     * @param  Request  $request  Dashboard resource
     */
    public function toArray(Request $request): array
    {
        $transactions = $this->sentTransactions
            ->concat($this->receivedTransactions)
            ->sortByDesc('created_at')
            ->values();

        return [
            'id' => $this->id,
            'balance' => $this->balance,
            'number' => $this->pan,
            'expire_date' => $this->expire_date,
            'status' => $this->status,
            'limit_amount' => $this->limit_amount,
            'type' => $this->type,
            'payment_network' => $this->payment_network,
            'cvv' => $this->cvv,
            'transactions' => CardTransactionResource::collection(
                $transactions->map(function ($transaction) {
                    $transaction->setAttribute(
                        'amount',
                        $transaction->from_card_id === $this->id
                            ? -$transaction->amount
                            : $transaction->amount
                    );

                    return $transaction;
                })
            ),
        ];
    }
}
