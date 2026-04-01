<?php

namespace App\Http\Controllers;

use App\Http\Resources\CardDashboardResource;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserTransferController extends Controller
{
    public function index()
    {
        /**
         * @var User|null $user
         */
        $user = Auth::user();

        /**
         * @var object $cards
         */
        $cards = $user->hasCards()->get();

        return Inertia::render('user/user-transfer', [
            'userData' => CardDashboardResource::collection($cards),
        ]);
    }
}
