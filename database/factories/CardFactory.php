<?php

namespace Database\Factories;

use App\Models\Card;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class CardFactory extends Factory
{
    protected $model = Card::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'pan' => $this->faker->word(),
            'cvv' => $this->faker->randomNumber(),
            'pin_hash' => $this->faker->word(),
            'expire_date' => Carbon::now(),
            'type' => $this->faker->word(),
            'limit_amount' => $this->faker->randomFloat(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
