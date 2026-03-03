<?php

namespace Database\Factories;

use App\Models\Account;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/** @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Account> */
class AccountFactory extends Factory
{
    protected $model = Account::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'updated_at' => Carbon::now(),
            'created_at' => Carbon::now(),
            'balance' => $this->faker->randomFloat(),
            'iban' => $this->faker->iban(),

            'user_id' => User::factory(),
        ];
    }
}
