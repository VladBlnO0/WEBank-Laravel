<?php

namespace App\Http\Controllers;

use App\Http\Resources\CardDashboardResource;
use App\Http\Resources\CardTransactionResource;
use App\Models\Card;
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
        $now = now();

        /**
         * @var object $cards
         */
        $cards = $user->hasCards()
            ->with([
                'sentTransactions' => fn ($query) => $query->whereMonth('created_at', $now->month)->whereYear('created_at', $now->year),
                'receivedTransactions' => fn ($query) => $query->whereMonth('created_at', $now->month)->whereYear('created_at', $now->year),
            ])
            ->get();

        return Inertia::render('user/user-dashboard', [
            'userData' => CardDashboardResource::collection($cards),
        ]);
    }

    public function transactions(Card $card)
    {
        if ($card->user_id !== Auth::id()) {
            abort(403);
        }

        $transactions = Transaction::where(function ($query) use ($card) {
            $query->where('from_card_id', $card->id)
                ->orWhere('to_card_id', $card->id);
        })
            ->latest('created_at')
            ->paginate(5)
            ->withQueryString();

        $transactions->getCollection()->transform(function (Transaction $transaction) use ($card) {
            $transaction->setAttribute(
                'amount',
                $transaction->from_card_id === $card->id
                    ? -$transaction->amount
                    : $transaction->amount
            );

            return $transaction;
        });

        return CardTransactionResource::collection($transactions);
    }
}
