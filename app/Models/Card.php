<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;

#[Fillable(['account_id',
    'pan',
    'cvv',
    'expire_date',
    'type',
    'payment_network',
    'status', ])]
class Card extends Model
{
    use HasFactory;

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function sentTransactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'from_card_id');
    }

    public function receivedTransactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'to_card_id');
    }

    public function getTransactions(): Collection
    {
        return $this->sentTransactions
            ->merge($this->receivedTransactions)
            ->sortByDesc('created_at')
            ->values();
    }
}
