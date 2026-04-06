<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\Transaction;
use App\Models\User;
use App\Notifications\TransactionNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserTransferController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', Card::class);

        /**
         * @var User|null $user
         */
        $user = Auth::user();

        $cards = $user->cards()->get();

        $allTransactions = Transaction::query()
            ->forUser($user)
            ->latest('created_at')
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('user/transfer', [
            'cards' => $cards,
            'allTransactions' => $allTransactions,
        ]);
    }

    public function store(Request $request, Transaction $transaction)
    {
        Gate::authorize('store', $transaction);

        /**
         * @var User|null $user
         */
        $user = Auth::user();

        $validated = $request->validate([
            'from_card_id' => [
                'required',
                'integer',
                Rule::exists('cards', 'id')->where('user_id', $user->id),
            ],
            'to_card_pan' => ['required', 'string', 'size:16', 'exists:cards,pan'],
            'amount' => ['required', 'numeric', 'min:1', 'max:20000000'],
        ]
        );

        $toCard = Card::query()->where('pan', $validated['to_card_pan'])->first();
        if (! $toCard) {
            return back()->with('error', 'Bad card');
        }

        if ($toCard->id === $validated['from_card_id']) {
            return back()->with('error', 'You cannot transfer money to the same card');
        }

        $transaction = Transaction::create([
            'amount' => $validated['amount'],
            'from_card_id' => $validated['from_card_id'],
            'to_card_id' => $toCard->id,
        ]);

        $transaction->fromCard->owner?->notify(
            new TransactionNotification($transaction)
        );
        $transaction->toCard->owner?->notify(
            new TransactionNotification($transaction)
        );

        $transaction->toCard->owner->notify(
            new TransactionNotification($transaction)
        );

        return redirect()->back()->with(
            'success',
            'Transfer was made!'
        );
    }
}
