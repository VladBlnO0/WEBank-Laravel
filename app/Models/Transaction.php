<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['from_card_id',
    'to_card_id',
    'amount', ])]
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

    public function scopeCurrentMonth(Builder $query): Builder
    {
        return $query->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year);
    }

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

        return \is_array($cards) ? $cards : [$cards];
    }

    public function scopeByCard(Builder $query, mixed $cards): Builder
    {
        $values = $this->extractCardIds($cards);

        return $query->where(function (Builder $q) use ($values) {
            $q->whereIn('from_card_id', $values)
                ->orWhereIn('to_card_id', $values);
        });
    }

    public function scopeCurrentMonthOutflow(Builder $query, Collection|array|int $cards): Builder
    {
        $values = \is_int($cards) ? [$cards] : $cards;

        return $query->currentMonth()->whereIn('from_card_id', $this->extractCardIds($values));
    }

    public function scopeCurrentMonthInflow(Builder $query, Collection|array|int $cards): Builder
    {
        $values = \is_int($cards) ? [$cards] : $cards;

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

    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query->when(
            $filters['amount'] ?? false,
            fn ($query, $value) => $query->where('amount', '>=', $value)

        )->when(
            $filters['created_at'] ?? false,
            fn ($query, $value) => $query->where('created_at', '<=', $value)

        );
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
