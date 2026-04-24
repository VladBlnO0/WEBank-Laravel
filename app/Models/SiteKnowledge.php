<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

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
