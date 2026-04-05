<?php

use App\Enums\TransactionType;
use App\Models\Card;
use App\Models\Transaction;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('dashboard cards include aggregated monthly totals', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $senderCard = Card::factory()->create([
        'user_id' => $user->id,
        'balance' => 1000,
        'pan' => '1111222233334444',
    ]);

    $recipientCard = Card::factory()->create([
        'user_id' => $otherUser->id,
        'balance' => 500,
        'pan' => '5555666677778888',
    ]);

    Transaction::factory()->create([
        'from_card_id' => $senderCard->id,
        'to_card_id' => $recipientCard->id,
        'type' => TransactionType::TRANSFER->value,
        'amount' => 40,
        'created_at' => now()->subMinute(),
    ]);

    Transaction::factory()->create([
        'from_card_id' => $recipientCard->id,
        'to_card_id' => $senderCard->id,
        'type' => TransactionType::TRANSFER->value,
        'amount' => 25,
        'created_at' => now(),
    ]);

    $this->actingAs($user)
        ->get(route('dashboard.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard.index')
            ->where('selectedCardId', $senderCard->id)
            ->has('userData.data', 1, fn (Assert $card) => $card
                ->where('id', $senderCard->id)
                ->where('monthly_outflow', 40.0)
                ->where('monthly_inflow', 25.0)
                ->missing('transactions')
                ->etc()
            )
            ->has('transactions.data', 2)
            ->where('transactions.data.0.amount', 25.0)
            ->where('transactions.data.1.amount', -40.0)
            ->where('transactions.meta.total', 2)
        );
});

test('transaction endpoint returns signed paginated amounts', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $ownedCard = Card::factory()->create([
        'user_id' => $user->id,
        'pan' => '1111222233334444',
    ]);

    $counterpartyCard = Card::factory()->create([
        'user_id' => $otherUser->id,
        'pan' => '5555666677778888',
    ]);

    Transaction::factory()->create([
        'from_card_id' => $ownedCard->id,
        'to_card_id' => $counterpartyCard->id,
        'type' => TransactionType::TRANSFER->value,
        'amount' => 40,
        'created_at' => now()->subMinute(),
    ]);

    Transaction::factory()->create([
        'from_card_id' => $counterpartyCard->id,
        'to_card_id' => $ownedCard->id,
        'type' => TransactionType::TRANSFER->value,
        'amount' => 25,
        'created_at' => now(),
    ]);

    $this->actingAs($user)
        ->getJson(route('cards.transactions', $ownedCard))
        ->assertOk()
        ->assertJsonPath('data.0.amount', 25.0)
        ->assertJsonPath('data.1.amount', -40.0)
        ->assertJsonPath('meta.total', 2)
        ->assertJsonPath('meta.per_page', 5);
});
