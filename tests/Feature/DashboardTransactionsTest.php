<?php

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
        'amount' => 40,
        'created_at' => now()->subMinute(),
    ]);

    Transaction::factory()->create([
        'from_card_id' => $recipientCard->id,
        'to_card_id' => $senderCard->id,
        'amount' => 25,
        'created_at' => now(),
    ]);

    $this->actingAs($user)
        ->get(route('user.dashboard.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('user/dashboard')
            ->has('cards', 1)
            ->has('allTransactions.data', 2)
            ->where('allTransactions.data.0.amount', '25.00')
            ->where('allTransactions.data.0.from_card.pan', '5555666677778888')
            ->where('allTransactions.data.0.to_card.pan', '1111222233334444')
            ->where('allTransactions.data.1.amount', '40.00')
            ->where('allTransactions.data.1.from_card.pan', '1111222233334444')
            ->where('allTransactions.data.1.to_card.pan', '5555666677778888')
            ->where('thisMonthOutflowTotal', 40)
            ->where('thisMonthInflowTotal', 25)
            ->etc()
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
        'amount' => 40,
        'created_at' => now()->subMinute(),
    ]);

    Transaction::factory()->create([
        'from_card_id' => $counterpartyCard->id,
        'to_card_id' => $ownedCard->id,
        'amount' => 25,
        'created_at' => now(),
    ]);

    $this->actingAs($user)
        ->get(route('user.dashboard.index', [
            'by' => 'amount',
            'order' => 'asc',
        ]))
        ->assertInertia(fn (Assert $page) => $page
            ->component('user/dashboard')
            ->where('allTransactions.data.0.amount', '40.00')
            ->where('allTransactions.data.0.from_card.pan', '1111222233334444')
            ->where('allTransactions.data.0.to_card.pan', '5555666677778888')
            ->where('allTransactions.data.1.amount', '25.00')
            ->where('allTransactions.data.1.from_card.pan', '5555666677778888')
            ->where('allTransactions.data.1.to_card.pan', '1111222233334444')
            ->etc()
        );
});

test('transactions can be exported as csv with signed amounts', function () {
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
        'created_at' => now()->subMinute(),
    ]);

    Transaction::factory()->create([
        'from_card_id' => $counterpartyCard->id,
        'to_card_id' => $ownedCard->id,
        'amount' => 25,
        'created_at' => now(),
    ]);

    $response = $this->actingAs($user)
        ->get(route('user.transactions.export', [
            'by' => 'amount',
            'order' => 'desc',
        ]));

    $response->assertOk();
    $response->assertHeader('content-type', 'text/csv; charset=UTF-8');
    $response->assertDownload();

    $content = $response->streamedContent();

    expect($content)->toContain('direction')
        ->and($content)->toContain('-40.00')
        ->and($content)->toContain('25.00');
});
