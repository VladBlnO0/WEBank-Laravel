<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\StreamedResponse;

class UserTransactionExportController extends Controller
{
    public function __invoke(Request $request): StreamedResponse
    {
        Gate::authorize('viewAny', Card::class);

        /**
         * @var User $user
         */
        $user = Auth::user();

        $filters = $request->validate([
            'by' => ['nullable', 'in:created_at,amount'],
            'order' => ['nullable', 'in:asc,desc'],
        ]);

        $filters = [
            'by' => $filters['by'] ?? 'created_at',
            'order' => $filters['order'] ?? 'desc',
        ];

        $cardIds = $user->cards()->pluck('id')->all();

        $transactions = Transaction::query()
            ->forUser($user)
            ->filter($filters, $cardIds)
            ->with(['fromCard:id,pan', 'toCard:id,pan'])
            ->get(['id', 'from_card_id', 'to_card_id', 'amount', 'created_at']);

        $filename = sprintf('transactions-%s.csv', now()->format('Y-m-d-His'));

        return response()->streamDownload(function () use ($transactions, $cardIds): void {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, ['id', 'date', 'direction', 'amount', 'from_card_pan', 'to_card_pan']);

            foreach ($transactions as $transaction) {
                $isOutgoing = in_array($transaction->from_card_id, $cardIds, true);
                $direction = $isOutgoing ? 'outgoing' : 'incoming';
                $signedAmount = $isOutgoing
                    ? -1 * abs((float) $transaction->amount)
                    : abs((float) $transaction->amount);

                fputcsv($handle, [
                    $transaction->id,
                    $transaction->created_at?->toDateTimeString(),
                    $direction,
                    number_format($signedAmount, 2, '.', ''),
                    $transaction->fromCard?->pan,
                    $transaction->toCard?->pan,
                ]);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}
