<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
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
         * @var object
         */
        $cards = $user->hasCards;

        $userCardIds = $cards->pluck('id');
        // $transactions = Transaction::whereIn('from_card_id', $userCardIds)
        //     ->orWhereIn('to_card_id', $userCardIds)
        //     ->latest()
        //     ->get()
        //     ->map(function ($transaction) use ($userCardIds) {
        //         $isSent = $userCardIds->contains($transaction->from_card_id);

        //         return [
        //             'id' => $transaction->id,
        //             'label' => $transaction->description ?? 'Transaction',
        //             'type' => $isSent ? 'Надіслано' : 'Отримано',
        //             'date' => $transaction->created_at->toDateString(),
        //             'description' => $transaction->description,
        //             'amount' => $isSent ? -$transaction->amount : $transaction->amount,
        //         ];
        //     });

        $userData = $cards->map(fn ($card) => [
            'id' => $card->id,
            'balance' => $card->balance,
            'number' => $card->pan,
        ])->values()->all();

        return Inertia::render('User/UserDashboard', [
            'userData' => $userData,
            // 'transactions' => $transactions,
        ]);
    }
}
