<?php

namespace App\Http\Controllers;

use App\Http\Resources\CardDashboardResource;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserTransferController extends Controller
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
        $now = now();

        $cards = $user->hasCards()
            ->withSum([
                'sentTransactions as monthly_outflow' => fn ($query) => $query->whereMonth('created_at', $now->month)->whereYear('created_at', $now->year),
            ], 'amount')
            ->withSum([
                'receivedTransactions as monthly_inflow' => fn ($query) => $query->whereMonth('created_at', $now->month)->whereYear('created_at', $now->year),
            ], 'amount')
            ->get();

        return Inertia::render('user/user-transfer', [
            'userData' => CardDashboardResource::collection($cards),
        ]);
    }
}
