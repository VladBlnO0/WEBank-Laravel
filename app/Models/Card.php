<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $user_id
 * @property string $pan
 * @property string $cvv
 * @property string $pin_hash
 * @property \Illuminate\Support\Carbon $expire_date
 * @property string $type
 * @property string $payment_network
 * @property numeric $balance
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User|null $belongToUser
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Transaction> $receivedTransactions
 * @property-read int|null $received_transactions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Transaction> $sentTransactions
 * @property-read int|null $sent_transactions_count
 * @method static \Database\Factories\CardFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Card newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Card newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Card query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Card whereBalance($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Card whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Card whereCvv($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Card whereExpireDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Card whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Card wherePan($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Card wherePaymentNetwork($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Card wherePinHash($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Card whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Card whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Card whereUserId($value)
 * @mixin \Eloquent
 */
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
        'payment_network',
        'status',
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
