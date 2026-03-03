<?php

namespace Database\Factories;

use App\Models\ServicePayments;
use App\Models\ServiceProvider;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class ServicePaymentsFactory extends Factory
{
    protected $model = ServicePayments::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'meter_reading' => $this->faker->randomNumber(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),

            'transaction_id' => Transaction::factory(),
            'service_provider_id' => ServiceProvider::factory(),
        ];
    }
}
