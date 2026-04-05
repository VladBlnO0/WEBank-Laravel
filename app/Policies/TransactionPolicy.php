<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Transaction;

class TransactionPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool {}

    public function view(User $user, Transaction $transaction): bool {}

    public function create(User $user): bool {}

    public function update(User $user, Transaction $transaction): bool {}

    public function delete(User $user, Transaction $transaction): bool {}

    public function restore(User $user, Transaction $transaction): bool {}

    public function forceDelete(User $user, Transaction $transaction): bool {}
}
