<?php

namespace App\Http\Controllers;

use App\Http\Resources\CardDashboardResource;
use App\Http\Resources\CardTransactionResource;
use App\Models\Card;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CardController extends Controller
{
    public function index(Request $request)
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
            ->withSum([
                'sentTransactions as monthly_outflow' => fn ($query) => $query->whereMonth('created_at', $now->month)->whereYear('created_at', $now->year),
            ], 'amount')
            ->withSum([
                'receivedTransactions as monthly_inflow' => fn ($query) => $query->whereMonth('created_at', $now->month)->whereYear('created_at', $now->year),
            ], 'amount')
            ->get();

        $requestedCardId = $request->integer('card');
        $selectedCard = $cards->firstWhere('id', $requestedCardId) ?? $cards->first();

        $transactions = null;

        if ($selectedCard) {
            $transactions = Transaction::query()
                ->where(function ($query) use ($selectedCard) {
                    $query->where('from_card_id', $selectedCard->id)
                        ->orWhere('to_card_id', $selectedCard->id);
                })
                ->select(['id', 'from_card_id', 'to_card_id', 'type', 'amount', 'created_at'])
                ->latest('created_at')
                ->paginate(5)
                ->withQueryString();

            $transactions->getCollection()->transform(function (Transaction $transaction) use ($selectedCard) {
                $transaction->setAttribute(
                    'amount',
                    $transaction->from_card_id === $selectedCard->id
                        ? -$transaction->amount
                        : $transaction->amount
                );

                return $transaction;
            });
        }

        return Inertia::render('user/dashboard', [
            'userData' => CardDashboardResource::collection($cards),
            'selectedCardId' => $selectedCard?->id,
            'transactions' => $transactions ? CardTransactionResource::collection($transactions) : null,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return Card::create($request->all());
    }

    /**
     * Display the specified resource.
     */
    public function show(Card $card)
    {
        return $card;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Card $card) {}

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Card $card)
    {
        $card->update($request->all());

        return $card;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Card $card)
    {
        //
    }
}
