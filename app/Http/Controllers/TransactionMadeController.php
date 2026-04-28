<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Gate;

class TransactionMadeController extends Controller
{
    public function __invoke(Transaction $transaction)
    {
        Gate::authorize('update', $transaction);

        $transaction->update(['made_at' => now()]);

        return redirect()->back()
            ->with(
                'status',
                "Transaction #$transaction->id made"
            );
    }
}
