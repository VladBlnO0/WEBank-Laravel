<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property mixed $cvv
 * @property mixed $sentTransactions
 * @property mixed $receivedTransactions
 * @property mixed $id
 * @property mixed $balance
 * @property mixed $status
 * @property mixed $type
 * @property mixed $payment_network
 * @property mixed $expire_date
 * @property mixed $pan
 */
class CardDashboardResource extends JsonResource
{
    /**
     * @param  Request  $request  Dashboard resource
     */
    public function toArray(Request $request): array
    {
        $monthlyOutflow = $this->sentTransactions->sum('amount');
        $monthlyInflow = $this->receivedTransactions->sum('amount');

        return [
            'id' => $this->id,
            'balance' => $this->balance,
            'number' => $this->pan,
            'expire_date' => $this->expire_date,
            'status' => $this->status,
            'type' => $this->type,
            'payment_network' => $this->payment_network,
            'cvv' => $this->cvv,
            'monthly_inflow' => $monthlyInflow,
            'monthly_outflow' => $monthlyOutflow,
            'transactions' => [], // Transactions will be loaded asynchronously
        ];
    }
}
