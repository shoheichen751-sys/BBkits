<?php

namespace App\Policies;

use App\Models\Sale;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SalePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Sale $sale): bool
    {
        return $user->id === $sale->user_id || $user->isAdmin() || $user->isFinanceiro();
    }

    public function create(User $user): bool
    {
        return $user->isVendedora();
    }

    public function update(User $user, Sale $sale): bool
    {
        return $user->id === $sale->user_id && $sale->isPending();
    }

    public function delete(User $user, Sale $sale): bool
    {
        // Only admin users can delete sales, regardless of ownership or status
        return $user->isAdmin();
    }

    public function cancel(User $user, Sale $sale): bool
    {
        // Any authenticated user can request cancellation (admin password will be verified in controller)
        return true;
    }

    public function approve(User $user): bool
    {
        return $user->isFinanceiro() || $user->isAdmin();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Sale $sale): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Sale $sale): bool
    {
        return false;
    }
}
