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
         * @var object $cards
         */
        $cards = $user->hasCards;

        $userCardIds = $cards->pluck('id');

        $allTransactions = Transaction::whereIn('from_card_id', $userCardIds)
            ->orWhereIn('to_card_id', $userCardIds)
            ->latest()
            ->get();

        $userData = $cards->map(function ($card) use ($allTransactions) {
            $cardTransactions = $allTransactions->filter(function ($transaction) use ($card) {
                return $transaction->from_card_id === $card->id || $transaction->to_card_id === $card->id;
            });

            return [
                'id' => $card->id,
                'balance' => $card->balance,
                'number' => $card->pan,
                'expire_date' => $card->expire_date,
                'status' => $card->status,
                'limit_amount' => $card->limit_amount,
                'type' => $card->type,
                'payment_network' => $card->payment_network,
                'cvv' => $card->cvv,
                'transactions' => $cardTransactions->map(function ($transaction) use ($card) {
                    $isSent = $transaction->from_card_id === $card->id;

                    return [
                        'id' => $transaction->id,
                        'label' => $transaction->description ?? 'Transaction',
                        'type' => $transaction->type,
                        'date' => $transaction->created_at->toDateString(),
                        'description' => $transaction->description,
                        'amount' => $isSent ? -$transaction->amount : $transaction->amount,
                    ];
                })->values()->all(),
            ];
        })->values()->all();

        return Inertia::render('User/UserDashboard', [
            'userData' => $userData,
        ]);
    }

    public function show()
    {
        return inertia('User/UserDashboard');
    }
}
