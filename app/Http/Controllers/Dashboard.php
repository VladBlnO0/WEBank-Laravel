<?php

namespace App\Http\Controllers;

class Dashboard extends Controller
{
    public function index()
    {
        return inertia(
            'User/UserDashboard',
            [
                'userData' => [],
                'transactions' => [],
            ]
        );
    }

    public function show()
    {
        return inertia('User/UserDashboard');
    }
}
