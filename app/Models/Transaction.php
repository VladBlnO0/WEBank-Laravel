<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use function is_array;
use function is_int;

/**
 * @property int $id
 * @property int $from_card_id
 * @property int $to_card_id
 * @property numeric $amount
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Card|null $card
 * @property-read Card $fromCard
 * @property-read string|null $from_card_last4
 * @property-read Card $toCard
 * @property-read string|null $to_card_last4
 *
 * @method static Builder<Transaction>|Transaction byCard(?mixed $cards)
 * @method static Builder<static>|Transaction currentMonth()
 * @method static Builder<static>|Transaction currentMonthInflow(\Illuminate\Database\Eloquent\Collection|array|int $cards)
 * @method static Builder<static>|Transaction currentMonthOutflow(\Illuminate\Database\Eloquent\Collection|array|int $cards)
 * @method static \Database\Factories\TransactionFactory factory($count = null, $state = [])
 * @method static Builder<static>|Transaction filter(array $filters, array $userCardIds = [])
 * @method static Builder<static>|Transaction forUser(\App\Models\User $user)
 * @method static Builder<static>|Transaction newModelQuery()
 * @method static Builder<static>|Transaction newQuery()
 * @method static Builder<static>|Transaction query()
 * @method static Builder<static>|Transaction whereAmount($value)
 * @method static Builder<static>|Transaction whereCreatedAt($value)
 * @method static Builder<static>|Transaction whereFromCardId($value)
 * @method static Builder<static>|Transaction whereId($value)
 * @method static Builder<static>|Transaction whereToCardId($value)
 * @method static Builder<static>|Transaction whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
#[Fillable([
    'from_card_id',
    'to_card_id',
    'amount',
    'made_at',
])]
class Transaction extends Model
{
    use HasFactory;

    protected array $sortable = [
        'amount',
        'created_at',
    ];

    public function card(): BelongsTo
    {
        return $this->belongsTo(Card::class);
    }

    public function fromCard(): BelongsTo
    {
        return $this->belongsTo(Card::class, 'from_card_id');
    }

    public function toCard(): BelongsTo
    {
        return $this->belongsTo(Card::class, 'to_card_id');
    }

    protected function fromCardLast4(): Attribute
    {
        return Attribute::get(function (): string {
            return substr($this->fromCard->pan, -4);
        });
    }

    protected function toCardLast4(): Attribute
    {
        return Attribute::get(function (): string {
            return substr($this->toCard->pan, -4);
        });
    }

    /**
     * @param  Builder<Transaction>  $query
     */
    public function scopeCurrentMonth(Builder $query): Builder
    {
        return $query->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year);
    }

    /**
     * @param  Builder<Transaction>  $query
     */
    public function scopeForUser(Builder $query, User $user): Builder
    {
        $cardIds = $user->cards()->pluck('id')->all();

        return $cardIds
          ? $query->byCard($cardIds)
          : $query;
    }

    private function extractCardIds(mixed $cards): array
    {
        if ($cards instanceof Collection) {
            return $cards->modelKeys();
        }

        if ($cards instanceof \Illuminate\Support\Collection) {
            return $cards->toArray();
        }

        return is_array($cards) ? $cards : [$cards];
    }

    /**
     * @param  Builder<Transaction>  $query
     */
    public function scopeByCard(Builder $query, mixed $cards): Builder
    {
        $values = $this->extractCardIds($cards);

        return $query->where(function (Builder $q) use ($values) {
            $q->whereIn('from_card_id', $values)
                ->orWhereIn('to_card_id', $values);
        });
    }

    /**
     * @param  Builder<Transaction>  $query
     */
    public function scopeCurrentMonthOutflow(Builder $query, Collection|array|int $cards): Builder
    {
        $values = is_int($cards) ? [$cards] : $cards;

        return $query->currentMonth()->whereIn('from_card_id', $this->extractCardIds($values));
    }

    /**
     * @param  Builder<Transaction>  $query
     */
    public function scopeCurrentMonthInflow(Builder $query, Collection|array|int $cards): Builder
    {
        $values = is_int($cards) ? [$cards] : $cards;

        return $query->currentMonth()->whereIn('to_card_id', $this->extractCardIds($values));
    }

    public static function getMonthTotalInflow(mixed $cards): float|int
    {
        return self::query()->currentMonthInflow($cards)->sum('amount');
    }

    public static function getMonthTotalOutflow(mixed $cards): float|int
    {
        return self::query()->currentMonthOutflow($cards)->sum('amount');
    }

    public function scopeFilter(Builder $query, array $filters, array $userCardIds = []): Builder
    {
        $by = $filters['by'] ?? 'created_at';
        $order = ($filters['order'] ?? 'desc') === 'asc' ? 'asc' : 'desc';

        if (! in_array($by, $this->sortable)) {
            $by = 'created_at';
        }

        if ($by === 'amount' && count($userCardIds) > 0) {
            $idsString = implode(',', $userCardIds);

            return $query->orderByRaw(
                "(CASE WHEN from_card_id IN ($idsString) THEN -amount ELSE amount END) $order"
            );
        }

        return $query->orderBy($by, $order);
    }

    protected static function booted(): void
    {
        static::created(function (Transaction $transaction) {
            if ($transaction->from_card_id) {
                $transaction->fromCard()->decrement('balance', $transaction->amount);
            }

            if ($transaction->to_card_id) {
                $transaction->toCard()->increment('balance', $transaction->amount);
            }

        });
    }
}
