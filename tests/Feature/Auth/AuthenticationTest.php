<?php

use App\Models\User;
use App\Notifications\LoginCodeNotification;
use Illuminate\Support\Facades\Notification;

test('login screen can be rendered', function () {
    $response = $this->get('/login');

    $response->assertStatus(200);
});

test('users are sent a login code after entering valid credentials', function () {
    $user = User::factory()->create();

    Notification::fake();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertRedirect(route('login.challenge', absolute: false));
    $this->assertGuest();

    Notification::assertSentTo($user, LoginCodeNotification::class, function (LoginCodeNotification $notification) {
        return preg_match('/^\d{6}$/', $notification->code) === 1;
    });
});

test('users can authenticate with the emailed login code', function () {
    $user = User::factory()->create();

    Notification::fake();

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ])->assertRedirect(route('login.challenge', absolute: false));

    $loginCode = null;

    Notification::assertSentTo($user, LoginCodeNotification::class, function (LoginCodeNotification $notification) use (&$loginCode): bool {
        $loginCode = $notification->code;

        return true;
    });

    $this->post('/login/challenge', [
        'code' => $loginCode,
    ])->assertRedirect(route('user.dashboard.index', absolute: false));

    $this->assertAuthenticatedAs($user);
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('users can logout', function () {
    /** @var User $user */
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/logout');

    $this->assertGuest();
    $response->assertRedirect('/');
});
