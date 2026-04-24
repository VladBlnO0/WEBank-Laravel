<?php

use App\Models\Card;
use App\Models\Transaction;
use App\Models\User;

test('transaction csv export is throttled for five minutes', function () {
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
        'amount' => 40,
    ]);

    $this->actingAs($user)
        ->get(route('user.transactions.export'))
        ->assertOk();

    $this->actingAs($user)
        ->get(route('user.transactions.export'))
        ->assertStatus(429);
});
