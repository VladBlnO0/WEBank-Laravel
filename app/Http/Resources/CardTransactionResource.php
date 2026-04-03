<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CardTransactionResource extends JsonResource
{
    /**
     * @param  Request  $request  Transaction resource
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'date' => $this->created_at->toDateString(),
            'amount' => $this->amount,
        ];
    }
}
