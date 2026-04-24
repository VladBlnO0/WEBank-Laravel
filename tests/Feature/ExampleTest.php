<?php

test('home redirects to the dashboard', function () {
    $response = $this->get('/');

    $response->assertRedirect(route('user.dashboard.index'));
});
