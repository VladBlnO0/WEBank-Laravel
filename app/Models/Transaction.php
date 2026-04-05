<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['from_card_id',
    'to_card_id',
    'type',
    'amount', ])]
class Transaction extends Model
{
    use HasFactory;

    protected array $sortable = [
        'amount',
        'created_at',
    ];

    public function belongsToCard(): BelongsTo
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

    public function scopeByCard(Builder $query, array|int $cardIds): Builder
    {
        $ids = \is_array($cardIds) ? $cardIds : [$cardIds];

        return $query->where(function (Builder $query) use ($ids) {
            $query->whereIn('from_card_id', $ids)
                ->orWhereIn('to_card_id', $ids);
        });
    }

    public function scopeForUser(Builder $query, User $user): Builder
    {
        $cardIds = $user->hasCards()->pluck('id')->all();

        return $cardIds
            ? $query->byCard($cardIds)
            : $query;
    }

    public function scopeCurrentMonthOutflow(Builder $query, array|int $cardIds): Builder
    {
        $ids = \is_array($cardIds) ? $cardIds : [$cardIds];

        return $query->currentMonth()->whereIn('from_card_id', $ids);
    }

    public function scopeCurrentMonthInflow(Builder $query, array|int $cardIds): Builder
    {
        $ids = \is_array($cardIds) ? $cardIds : [$cardIds];

        return $query->currentMonth()->whereIn('to_card_id', $ids);
    }

    public function scopeMonthTotalInflow(Builder $query, Card $card): Builder
    {
        return $query->where('to_card_id', $card->id)->currentMonth()->sum('amount');
    }

    public function scopeMonthTotalOutflow(Builder $query, Card $card): Builder
    {
        return $query->where('from_card_id', $card->id)->currentMonth()->sum('amount');
    }

    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query->when(
            $filters['amount'] ?? false,
            fn ($query, $value) => $query->where('amount', '>=', $value)

        )->when(
            $filters['created_at'] ?? false,
            fn ($query, $value) => $query->where('created_at', '<=', $value)

        )->when(
            $filters['type'] ?? false,
            fn ($query, $value) => ! in_array($value, $this->sortable)
                ? $query :
                $query->orderBy($value, $filters['order'] ?? 'desc')
        );
    }
}
