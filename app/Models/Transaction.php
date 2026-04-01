<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $from_card_id
 * @property int $to_card_id
 * @property string $type
 * @property numeric $amount
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Card|null $belongsToCard
 * @property-read Card $fromCard
 * @property-read Card $toCard
 *
 * @method static \Database\Factories\TransactionFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereFromCardId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereToCardId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Transaction whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
class Transaction extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'account_id',
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
