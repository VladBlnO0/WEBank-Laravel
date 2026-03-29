<?php

namespace Database\Seeders;

use App\Models\Card;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = User::factory(10)->create();

        $users->each(function ($user) {
            Card::factory(rand(1, 2))->create([
                'user_id' => $user->id,
            ]);
        });

        $users->each(function ($user) {
            $cards = $user->hasCards;

            $cards->each(function ($card) {
                Transaction::factory(rand(2, 4))->create([
                    'from_card_id' => $card->id,
                    'to_card_id' => Card::where(column: 'id', operator: '!=', value: $card->id, boolean: null)->inRandomOrder(seed: null)->first()?->id,
                ]);
            });
        });
    }
}
