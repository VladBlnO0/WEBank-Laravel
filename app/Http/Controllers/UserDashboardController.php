<?php

namespace App\Http\Controllers;

use App\Http\Resources\CardDashboardResource;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserDashboardController extends Controller
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
        $cards = $user->hasCards()
            ->with([
                'sentTransactions:id,from_card_id,to_card_id,type,amount,created_at',
                'receivedTransactions:id,from_card_id,to_card_id,type,amount,created_at',
            ])
            ->get();

        return Inertia::render('user/user-dashboard', [
            'userData' => CardDashboardResource::collection($cards),
        ]);
    }
}
