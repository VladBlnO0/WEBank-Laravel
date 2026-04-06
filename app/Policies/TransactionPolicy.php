<?php

namespace App\Policies;

use App\Models\Transaction;
use App\Models\User;
use Auth;
use Illuminate\Auth\Access\HandlesAuthorization;

class TransactionPolicy
{
    use HandlesAuthorization;

    public function before(User $user, $ability): ?bool
    {
        if (Auth::check()) {
            return true;
        }

        return null;
    }

    public function viewAny(User $user): bool
    {
        return true;

    }

    public function view(User $user, Transaction $transaction): bool
    {
        return true;

    }

    public function create(User $user): bool
    {
        return true;

    }

    public function store(User $user): bool
    {
        return true;

    }

    public function update(User $user, Transaction $transaction): bool
    {
        return true;

    }

    public function delete(User $user, Transaction $transaction): bool
    {
        return true;

    }

    public function restore(User $user, Transaction $transaction): bool
    {
        return true;

    }

    public function forceDelete(User $user, Transaction $transaction): bool
    {
        return true;

    }
}
