<?php

namespace App\Policies;

use App\Models\User;
use Card;
use Illuminate\Auth\Access\HandlesAuthorization;

class CardPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool {}

    public function view(User $user, Card $card): bool {}

    public function create(User $user): bool {}

    public function update(User $user, Card $card): bool {}

    public function delete(User $user, Card $card): bool {}

    public function restore(User $user, Card $card): bool {}

    public function forceDelete(User $user, Card $card): bool {}
}
