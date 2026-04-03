<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property mixed $cvv
 * @property mixed $id
 * @property mixed $balance
 * @property mixed $status
 * @property mixed $type
 * @property mixed $payment_network
 * @property mixed $expire_date
 * @property mixed $pan
 * @property mixed $monthly_inflow
 * @property mixed $monthly_outflow
 */
class CardDashboardResource extends JsonResource
{
    /**
     * @param  Request  $request  Dashboard resource
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'balance' => $this->balance,
            'number' => $this->pan,
            'expire_date' => $this->expire_date,
            'status' => $this->status,
            'type' => $this->type,
            'payment_network' => $this->payment_network,
            'cvv' => $this->cvv,
            'monthly_inflow' => (float) ($this->monthly_inflow ?? 0),
            'monthly_outflow' => (float) ($this->monthly_outflow ?? 0),
        ];
    }
}
