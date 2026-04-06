<?php

namespace Database\Factories;

use App\Enums\CardType;
use App\Models\Card;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

class CardFactory extends Factory
{
    protected $model = Card::class;

    protected static ?string $pin_hash;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),

            'pan' => $this->faker->numerify('################'),
            'cvv' => $this->faker->numerify('###'),
            'expire_date' => Carbon::now(),

            'type' => $this->faker->randomElement(['debit', 'credit']),
            'payment_network' => $this->faker->randomElement(['visa', 'mastercard']),

            'balance' => $this->faker->randomFloat(2, 0, 500000),
        ];
    }
}
