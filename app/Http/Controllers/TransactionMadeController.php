<?php

namespace App\Http\Controllers;

use App\Models\Transaction;

class TransactionMadeController extends Controller
{
    public function __invoke(Transaction $transaction)
    {
        $transaction->update(['made_at' => now()]);

        return redirect()->back()
            ->with(
                'success',
                "Transaction #{$transaction->id} made"
            );
    }
}
