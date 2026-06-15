<?php

namespace App\Providers;

use App\Policies\NotificationPolicy;
use Carbon\CarbonImmutable;
use Gate;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Stringable;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureEmbeddings();

        Gate::policy(DatabaseNotification::class, NotificationPolicy::class);
        Vite::prefetch(concurrency: 3);
    }

    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }

    protected function configureEmbeddings(): void
    {
        Stringable::macro('toEmbeddings', function (bool $cache = false): array {
            $text = mb_strtolower((string) $this);
            $dimensions = 1536;
            $embedding = array_fill(0, $dimensions, 0.0);
            $tokens = preg_split('/[^\pL\pN]+/u', $text, -1, PREG_SPLIT_NO_EMPTY) ?: [];

            foreach ($tokens as $token) {
                $index = abs(crc32($token)) % $dimensions;
                $embedding[$index] += 1;
            }

            $magnitude = sqrt(array_reduce(
                $embedding,
                static fn (float $carry, float $value): float => $carry + ($value * $value),
                0.0,
            )) ?: 1.0;

            return array_map(
                static fn (float $value): float => $value / $magnitude,
                $embedding,
            );
        });
    }
}
