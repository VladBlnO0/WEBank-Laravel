<?php

namespace App\Http\Controllers;

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
        $cards = $user->hasCards;

        $userData = $cards->map(function ($card) {
            return [
                'id' => $card->id,
                'balance' => $card->balance,
                'number' => $card->pan,
                'expire_date' => $card->expire_date,
                'status' => $card->status,
                'limit_amount' => $card->limit_amount,
            ];
        })->values()->all();

        return Inertia::render('User/UserTransfer', [
            'userData' => $userData,
        ]);
    }

    public function show()
    {
        return inertia('User/UserTransfer');
    }
}
