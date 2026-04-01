<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

class Transaction extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'from_card_id',
        'to_card_id',
        'type',
        'amount',
    ];

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
