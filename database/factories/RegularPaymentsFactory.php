<?php

namespace Database\Factories;

use App\Models\Account;
use App\Models\RegularPayments;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class RegularPaymentsFactory extends Factory
{
    protected $model = RegularPayments::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'amount' => $this->faker->word(),
            'cron_schedule' => Carbon::now(),
            'next_execution_date' => $this->faker->word(),
            'is_active' => $this->faker->boolean(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),

            'account_id' => Account::factory(),
        ];
    }
}
