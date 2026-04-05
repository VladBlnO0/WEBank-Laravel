<?php

namespace App\Policies;

use App\Models\Card;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserTransferControllerPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return true;

    }

    public function view(User $user, Card $card): bool
    {
        return true;

    }

    public function create(User $user): bool
    {
        return true;

    }

    public function update(User $user, Card $card): bool
    {
        return true;

    }

    public function delete(User $user, Card $card): bool
    {
        return true;

    }

    public function restore(User $user, Card $card): bool
    {
        return true;

    }

    public function forceDelete(User $user, Card $card): bool
    {
        return true;

    }
}
