<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Card extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'account_id',
        'pan',
        'cvv',
        'pin_hash',
        'expire_date',
        'type',
        'status',
        'limit_amount',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'expire_date' => 'date',
        ];
    }

    public function belongToUser(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function sentTransactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'from_card_id');
    }

    /**
     * Get the transactions received by this card.
     */
    public function receivedTransactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'to_card_id');
    }
}
