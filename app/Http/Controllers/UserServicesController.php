<?php

namespace App\Http\Controllers;

use App\Models\ServicePayment;
use App\Models\ServiceProvider;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserServicesController extends Controller
{
    public function index()
    {
        /**
         * @var User|null $user
         */
        $user = Auth::user();

        $allPayments = ServicePayment::where('user_id', $user->id)->get();

        /**
         * @var array $providers
         */
        $providers = ServiceProvider::all();

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

        return Inertia::render('User/UserServices', [
            'userData' => $userData,

            'services' => $providers,
        ]);
    }

    public function show()
    {
        return inertia('User/UserServices');
    }
}
