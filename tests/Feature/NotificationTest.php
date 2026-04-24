<?php

use App\Models\User;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

test('notification index shows the authenticated users notifications', function () {
    $user = User::factory()->create();

    $notification = $user->notifications()->create([
        'id' => (string) Str::uuid(),
        'type' => 'App\\Notifications\\TransactionNotification',
        'data' => [
            'transaction_id' => 99,
            'amount' => '25.00',
            'from_card_id' => 11,
            'to_card_id' => 22,
            'from_card_last4' => '1111',
            'to_card_last4' => '2222',
            'message' => 'You received $25.00 on card **** 2222 from card **** 1111.',
        ],
    ]);

    $this->actingAs($user)
        ->get(route('notification.index'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('notification/index')
                ->has('notifications.data', 1)
                ->where('notifications.data.0.id', $notification->id)
                ->where('notifications.data.0.data.message', 'You received $25.00 on card **** 2222 from card **** 1111.')
                ->where('notifications.data.0.data.from_card_last4', '1111')
                ->where('notifications.data.0.data.to_card_last4', '2222')
                ->etc()
        );
});

test('notification can be marked as read', function () {
    $user = User::factory()->create();

    $notification = $user->notifications()->create([
        'id' => (string) Str::uuid(),
        'type' => 'App\\Notifications\\TransactionNotification',
        'data' => [
            'transaction_id' => 100,
            'amount' => '25.00',
            'from_card_id' => 11,
            'to_card_id' => 22,
            'from_card_last4' => '1111',
            'to_card_last4' => '2222',
            'message' => 'You sent $25.00 from card **** 1111 to card **** 2222.',
        ],
    ]);

    $this->actingAs($user)
        ->from(route('notification.index'))
        ->put(route('notification.seen', $notification))
        ->assertRedirect(route('notification.index'))
        ->assertSessionHas('status', 'Notification marked as read');

    $this->assertNull(DatabaseNotification::query()->find($notification->id));
});
