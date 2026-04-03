<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $now = now();

        $cards = $user->hasCards()
            ->with(['sentTransactions', 'receivedTransactions']);

        $cardIds = $user->hasCards()->pluck('id')->toArray();

        $allTransactions = Transaction::query()
            ->where(function ($query) use ($cardIds) {
                $query->whereIn('from_card_id', $cardIds)
                    ->orWhereIn('to_card_id', $cardIds);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $thisMonthOutflowTotal = Transaction::query()
            ->where('from_card_id', $cardIds)
            ->currentMonth()
            ->sum('amount');

        $thisMonthInflowTotal = Transaction::query()
            ->where('to_card_id', $cardIds)
            ->currentMonth()
            ->sum('amount');

        return Inertia::render('user/user-dashboard', [
            'cards' => $cards,
            'allTransactions' => $allTransactions,
            'thisMonthOutflowTotal' => $thisMonthOutflowTotal,
            'thisMonthInflowTotal' => $thisMonthInflowTotal,
        ]);
    }
}
