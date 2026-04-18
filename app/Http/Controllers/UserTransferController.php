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
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class UserTransferController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Card::class);

        /**
         * @var User|null $user
         */
        $user = Auth::user();

        $cards = $user->cards()->get();

        $cardIds = $cards->pluck('id')->toArray();
        $filters = $request->only(['by', 'order']);

        $allTransactions = Transaction::query()
            ->forUser($user)
            ->filter($filters, $cardIds)
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('user/transfer', [
            'filters' => $filters,
            'cards' => $cards,
            'allTransactions' => $allTransactions,
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
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
            return back()
                ->with('status', 'Recipient card was not found.')
                ->with('status_type', 'error');
        }

        if ($toCard->id === $validated['from_card_id']) {
            return back()
                ->with('status', 'You cannot transfer money to the same card.')
                ->with('status_type', 'error');
        }

        $transaction = Transaction::create([
            'amount' => $validated['amount'],
            'from_card_id' => $validated['from_card_id'],
            'to_card_id' => $toCard->id,
        ]);

        $transaction->toCard->owner?->notify(
            new TransactionNotification($transaction)
        );

        return redirect()->back()->with(
            'status',
            'Transfer was made!'
        )->with('status_type', 'success');
    }
}
