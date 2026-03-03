<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ServicePayment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'amount',
        'next_date',
        'is_payed',
        'card_id',
        'service_provider_id',
    ];
    protected function casts(): array
    {
        return [
            'next_date' => 'datetime',
            'is_payed' => 'boolean',
        ];
    }
    public function belongsToCard(): BelongsTo
    {
        return $this->belongsTo(Card::class);
    }

    public function hasOneServiceProvider(): HasOne
    {
        return $this->hasOne(ServiceProvider::class);
    }
}
