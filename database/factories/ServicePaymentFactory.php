<?php

namespace Database\Factories;

use App\Models\ServicePayment;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class ServicePaymentFactory extends Factory
{
    protected $model = ServicePayment::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'amount' => $this->faker->randomFloat(2, 10, 5000),
            'next_date' => Carbon::now()->endOfMonth(),
            'is_payed' => $this->faker->boolean(50),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
