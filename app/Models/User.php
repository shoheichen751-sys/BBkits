<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'approved',
        'approved_at',
        'approved_by',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'approved' => 'boolean',
            'approved_at' => 'datetime',
        ];
    }

    public function isVendedora(): bool
    {
        return $this->role === 'vendedora';
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isFinanceiro(): bool
    {
        return $this->role === 'financeiro';
    }

    public function isFinanceAdmin(): bool
    {
        return $this->role === 'finance_admin';
    }

    public function isProductionAdmin(): bool
    {
        return $this->role === 'production_admin';
    }

    public function isManager(): bool
    {
        return $this->role === 'manager';
    }

    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    public function canApprovePayments(): bool
    {
        return $this->isAdmin() || $this->isFinanceiro() || $this->isFinanceAdmin();
    }

    public function canManageProduction(): bool
    {
        return $this->isAdmin() || $this->isProductionAdmin();
    }

    public function canViewOrders(): bool
    {
        return $this->isAdmin() || $this->isManager() || $this->isFinanceiro() || $this->isProductionAdmin();
    }

    public function canPrintOrders(): bool
    {
        return $this->isAdmin() || $this->isManager();
    }

    public function canSendToProduction(): bool
    {
        return $this->isAdmin() || $this->isManager() || $this->isProductionAdmin();
    }

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }

    public function commissions(): HasMany
    {
        return $this->hasMany(Commission::class);
    }

    public function fines(): HasMany
    {
        return $this->hasMany(Fine::class);
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function isApproved(): bool
    {
        return $this->approved || $this->isAdmin() || $this->isFinanceiro() || $this->isFinanceAdmin() || $this->isProductionAdmin() || $this->isManager();
    }

    public function getMonthlyCommissionTotal(int $month, int $year): float
    {
        // Calculate commission dynamically using the same logic as admin reports
        $commissionService = app(\App\Services\CommissionService::class);
        
        // Get commission base for the month - only fully paid sales
        $commissionBase = $this->sales()
            ->where('status', 'aprovado')
            ->whereYear('payment_date', $year)
            ->whereMonth('payment_date', $month)
            ->with('payments')
            ->get()
            ->filter(function ($sale) {
                // Only include sales that are fully paid
                return $sale->hasPartialPayments() ? $sale->isFullyPaid() : true;
            })
            ->sum(function ($sale) {
                // Use payment-based commission calculation if has partial payments
                if ($sale->hasPartialPayments()) {
                    return $sale->getCommissionBaseAmountForPayments();
                }
                return ($sale->received_amount ?: 0) - ($sale->shipping_amount ?: 0);
            });
        
        // Calculate commission rate and amount
        $rate = $commissionService->calculateCommissionRate($commissionBase);
        return $commissionBase * ($rate / 100);
    }

    public function getMonthlySalesTotal(int $month, int $year): float
    {
        $sales = $this->sales()
            ->whereYear('payment_date', $year)
            ->whereMonth('payment_date', $month)
            ->where('status', 'aprovado')
            ->get();
            
        $total = 0;
        foreach ($sales as $sale) {
            // If sale has payment records, use approved payments total
            if ($sale->hasPartialPayments()) {
                $total += $sale->getTotalPaidAmount();
            } else {
                // Fallback to received_amount for backward compatibility
                $total += $sale->received_amount;
            }
        }
        
        return $total;
    }

    public function isSeller(): bool
    {
        return $this->role === 'vendedora';
    }
}
