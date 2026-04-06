<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Response;

class NotificationController extends Controller
{
    private const int PAGE_SIZE = 5;

    public function index(Request $request): Response
    {
        return inertia(
            'notification/index',
            [
                'notifications' => $request->user()
                    ->notifications()->paginate(self::PAGE_SIZE),
            ]
        );
    }
}
