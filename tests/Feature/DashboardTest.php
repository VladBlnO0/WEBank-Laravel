<?php

use App\Models\User;

test('dashboard page can be rendered', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('user.dashboard.index'));

    $response->assertOk();
});
