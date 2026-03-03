<?php

namespace Database\Factories;

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

            'pan' => $this->faker->numerify('##########'),
            'cvv' => $this->faker->numerify('###'),
            'pin_hash' => static::$pin_hash ??= Hash::make('pin'),
            'expire_date' => Carbon::now(),

            'type' => $this->faker->randomElement(\App\Enums\CardType::class),
            'status' => $this->faker->randomElement(\App\Enums\Status::class),

            'balance' => $this->faker->randomFloat(2, 0, 10000),
            'limit_amount' => $this->faker->randomFloat(2, 0, 10000),

            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
