<?php

namespace App\Http\Controllers;

use App\Enums\TransactionType;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Http\Resources\CardTransactionResource;
use App\Models\Card;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Card $card)
    {
        if ($card->user_id !== Auth::id()) {
            abort(403);
        }

        $transactions = Transaction::where(function ($query) use ($card) {
            $query->where('from_card_id', $card->id)
                ->orWhere('to_card_id', $card->id);
        })
            ->select(['id', 'from_card_id', 'to_card_id', 'type', 'amount', 'created_at'])
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

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTransactionRequest $request)
    {
        $validated = $request->validated();
        $recipientPan = preg_replace('/\D/', '', (string) $validated['card']);
        $amount = (float) $validated['amount'];

        DB::transaction(function () use ($request, $validated, $recipientPan, $amount) {
            $senderCard = $request->user()
                ->hasCards()
                ->whereKey($validated['from_card_id'])
                ->lockForUpdate()
                ->first();

            if (! $senderCard) {
                throw ValidationException::withMessages([
                    'from_card_id' => 'Selected sender card is invalid.',
                ]);
            }

            $recipientCard = Card::query()
                ->where('pan', $recipientPan)
                ->lockForUpdate()
                ->first();

            if (! $recipientCard) {
                throw ValidationException::withMessages([
                    'card' => 'Recipient card was not found.',
                ]);
            }

            if ($senderCard->id === $recipientCard->id) {
                throw ValidationException::withMessages([
                    'card' => 'Cannot transfer to the same card.',
                ]);
            }

            if ((float) $senderCard->balance < $amount) {
                throw ValidationException::withMessages([
                    'amount' => 'Insufficient funds.',
                ]);
            }

            $senderCard->decrement('balance', $amount);
            $recipientCard->increment('balance', $amount);
            // Change to save(new Transaction())
            Transaction::create([
                'from_card_id' => $senderCard->id,
                'to_card_id' => $recipientCard->id,
                'type' => TransactionType::TRANSFER->value,
                'amount' => $amount,
            ]);
        });
        // return redirect()->back()->with('success', 'Image was deleted!');

        return back()->with('success', 'Transfer completed successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transaction $transaction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTransactionRequest $request, Transaction $transaction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        //
    }
}
