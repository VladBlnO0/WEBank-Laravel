<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class UserDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Card::class);

        $user = Auth::user();

        $cards = $user->hasCards()
            ->withCount(['sentTransactions', 'receivedTransactions'])
            ->get();

        $cardIds = $cards->pluck('id')->all();

        $allTransactions = Transaction::query()
            ->forUser($user)
            ->latest('created_at')
            ->paginate(10)
            ->withQueryString();

        $thisMonthOutflowTotal = Transaction::query()
            ->currentMonthOutflow($cardIds)
            ->sum('amount');

        $thisMonthInflowTotal = Transaction::query()
            ->currentMonthInflow($cardIds)
            ->sum('amount');

        return Inertia::render('user/dashboard', [
            'cards' => $cards,
            'allTransactions' => $allTransactions,
            'thisMonthOutflowTotal' => $thisMonthOutflowTotal,
            'thisMonthInflowTotal' => $thisMonthInflowTotal,
        ]);
    }
}
