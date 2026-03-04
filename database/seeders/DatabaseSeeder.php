<?php

namespace Database\Seeders;

use App\Models\Card;
use App\Models\ServicePayment;
use App\Models\ServiceProvider;
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
        User::factory()->create([
           'email' => '1@1',
       ]);
        $providers = ServiceProvider::factory(10)->create();

        $users->each(function ($user) use ($providers) {
            Card::factory(rand(1, 2))->create([
                'user_id' => $user->id,
            ]);
        });

        $users->each(function ($user) use ($providers) {
            $cards = $user->hasCards;

            $cards->each(function ($card) use ($providers) {
                Transaction::factory(rand(2, 4))->create([
                    'from_card_id' => $card->id,
                    'to_card_id' => Card::where('id', '!=', $card->id)->inRandomOrder()->first()?->id,
                ]);

                ServicePayment::factory(rand(2, 4))->create([
                    'card_id' => $card->id,
                    'service_provider_id' => $providers->random()->id,
                ]);
            });
        });
    }
}
