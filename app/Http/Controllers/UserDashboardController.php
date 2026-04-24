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

        $cards = $user->cards()->get();

        $cardIds = $cards->pluck('id')->toArray();
        $filters = $request->only(['by', 'order']);

        $allTransactions = Transaction::query()
            ->with(['fromCard:id,pan', 'toCard:id,pan'])
            ->forUser($user)
            ->filter($filters, $cardIds)
            ->paginate(5)
            ->withQueryString();

        $thisMonthOutflowTotal = Transaction::getMonthTotalOutflow($cards);
        $thisMonthInflowTotal = Transaction::getMonthTotalInflow($cards);

        return Inertia::render('user/dashboard', [
            'filters' => $filters,
            'cards' => $cards,
            'allTransactions' => $allTransactions,
            'thisMonthOutflowTotal' => $thisMonthOutflowTotal,
            'thisMonthInflowTotal' => $thisMonthInflowTotal,
        ])->with('status', 'data good');
    }
}
