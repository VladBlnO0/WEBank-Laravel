<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
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
}
