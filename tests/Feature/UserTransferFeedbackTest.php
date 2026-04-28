<?php

use App\Models\Card;
use App\Models\Transaction;
use App\Models\User;
use App\Notifications\TransactionNotification;
use Illuminate\Support\Facades\Notification;

test('transfer validation failure returns errors without status flash', function () {
    $user = User::factory()->create();

    $fromCard = Card::factory()->create([
        'user_id' => $user->id,
        'pan' => '1111222233334444',
    ]);

    $this->actingAs($user)
        ->post(route('user.transfer.store'), [
            'from_card_id' => $fromCard->id,
            'to_card_pan' => '',
            'amount' => '10',
        ])
        ->assertSessionHasErrors(['to_card_pan'])
        ->assertSessionMissing('status');
});

test('transfer to same card flashes status as error type', function () {
    $user = User::factory()->create();

    $fromCard = Card::factory()->create([
        'user_id' => $user->id,
        'pan' => '1111222233334444',
    ]);

    $this->actingAs($user)
        ->post(route('user.transfer.store'), [
            'from_card_id' => $fromCard->id,
            'to_card_pan' => $fromCard->pan,
            'amount' => '10',
        ])
        ->assertSessionHas('status', 'You cannot transfer money to the same card.')
        ->assertSessionHas('status_type', 'error')
        ->assertSessionMissing('error');
});

test('successful transfer creates a transaction and notifies both users', function () {
    Notification::fake();

    $sender = User::factory()->create();
    $recipient = User::factory()->create();

    $fromCard = Card::factory()->create([
        'user_id' => $sender->id,
        'balance' => 1000,
        'pan' => '1111222233334444',
    ]);

    $toCard = Card::factory()->create([
        'user_id' => $recipient->id,
        'balance' => 500,
        'pan' => '5555666677778888',
    ]);

    $this->actingAs($sender)
        ->from(route('user.transfer.index'))
        ->post(route('user.transfer.store'), [
            'from_card_id' => $fromCard->id,
            'to_card_pan' => $toCard->pan,
            'amount' => '125.25',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('user.transfer.index'))
        ->assertSessionHas('status', 'Transfer was made!')
        ->assertSessionHas('status_type', 'success');

    expect(Transaction::query()->count())->toBe(1)
        ->and((float) $fromCard->fresh()->balance)->toBe(874.75)
        ->and((float) $toCard->fresh()->balance)->toBe(625.25);

    Notification::assertSentTo($sender, TransactionNotification::class);
    Notification::assertSentTo($recipient, TransactionNotification::class);
});
