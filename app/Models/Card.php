<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;

/**
 * @property int $id
 * @property int $user_id
 * @property string $pan
 * @property string $cvv
 * @property string $expire_date
 * @property string $type
 * @property string $payment_network
 * @property numeric $balance
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\User $owner
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
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Card whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Card whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Card whereUserId($value)
 * @mixin \Eloquent
 */
#[Fillable(['account_id',
    'pan',
    'cvv',
    'expire_date',
    'type',
    'payment_network', ])]
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
