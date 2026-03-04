<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        'description',
    ];

    protected array $sortable = [
        'amount',
        'created_at',
    ];

    public function belongsToCard(): BelongsTo
    {
        return $this->belongsTo(Card::class);
    }
}
