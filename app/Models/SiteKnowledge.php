<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $content
 * @property array<array-key, mixed> $embedding
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @method static Builder<static>|SiteKnowledge newModelQuery()
 * @method static Builder<static>|SiteKnowledge newQuery()
 * @method static Builder<static>|SiteKnowledge query()
 * @method static Builder<static>|SiteKnowledge similarTo(string $message, float $minSimilarity = 0.4)
 * @method static Builder<static>|SiteKnowledge whereContent($value)
 * @method static Builder<static>|SiteKnowledge whereCreatedAt($value)
 * @method static Builder<static>|SiteKnowledge whereEmbedding($value)
 * @method static Builder<static>|SiteKnowledge whereId($value)
 * @method static Builder<static>|SiteKnowledge whereUpdatedAt($value)
 * @mixin \Eloquent
 */
#[Fillable(['content', 'embedding'])]
class SiteKnowledge extends Model
{
    protected function casts(): array
    {
        return [
            'embedding' => 'array',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (SiteKnowledge $siteKnowledge): void {
            if ($siteKnowledge->isDirty('content') || empty($siteKnowledge->embedding)) {
                $siteKnowledge->embedding = Str::of($siteKnowledge->content)->toEmbeddings();
            }
        });
    }

    public function scopeSimilarTo(Builder $query, string $message, float $minSimilarity = 0.4): Builder
    {
        return $query->whereVectorSimilarTo('embedding', $message, minSimilarity: $minSimilarity);
    }
}
