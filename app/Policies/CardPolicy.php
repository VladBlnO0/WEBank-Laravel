<?php

namespace App\Policies;

use App\Models\Card;
use App\Models\User;
use Auth;
use Illuminate\Auth\Access\HandlesAuthorization;

class CardPolicy
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
