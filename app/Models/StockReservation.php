<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockReservation extends Model
{
    use HasFactory;

    protected $table = 'stock_reservations';

    protected $fillable = [
        'sale_id',
        'sale_product_id',
        'material_id',
        'quantity_reserved',
        'unit',
        'status',
        'reserved_at',
        'deducted_at',
        'released_at',
        'created_by',
        'deducted_by',
        'released_by',
        'notes',
    ];

    protected $casts = [
        'quantity_reserved' => 'decimal:3',
        'reserved_at' => 'datetime',
        'deducted_at' => 'datetime',
        'released_at' => 'datetime',
    ];

    const STATUS_RESERVED = 'reserved';
    const STATUS_DEDUCTED = 'deducted';
    const STATUS_RELEASED = 'released';

    /**
     * Get the sale/order.
     */
    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }

    /**
     * Get the sale product (order item).
     */
    public function saleProduct(): BelongsTo
    {
        return $this->belongsTo(SaleProduct::class);
    }

    /**
     * Get the material being reserved.
     */
    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class);
    }

    /**
     * Get the user who created the reservation.
     */
    public function createdByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who deducted the materials.
     */
    public function deductedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'deducted_by');
    }

    /**
     * Get the user who released the reservation.
     */
    public function releasedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'released_by');
    }

    /**
     * Scope for reserved (active) reservations.
     */
    public function scopeReserved($query)
    {
        return $query->where('status', self::STATUS_RESERVED);
    }

    /**
     * Scope for deducted reservations.
     */
    public function scopeDeducted($query)
    {
        return $query->where('status', self::STATUS_DEDUCTED);
    }

    /**
     * Scope for released (cancelled) reservations.
     */
    public function scopeReleased($query)
    {
        return $query->where('status', self::STATUS_RELEASED);
    }

    /**
     * Scope for a specific material.
     */
    public function scopeForMaterial($query, int $materialId)
    {
        return $query->where('material_id', $materialId);
    }

    /**
     * Scope for a specific sale.
     */
    public function scopeForSale($query, int $saleId)
    {
        return $query->where('sale_id', $saleId);
    }

    /**
     * Get total reserved quantity for a material.
     */
    public static function getTotalReservedForMaterial(int $materialId): float
    {
        return static::reserved()
            ->forMaterial($materialId)
            ->sum('quantity_reserved');
    }

    /**
     * Get available stock for a material (current stock - reserved).
     */
    public static function getAvailableStock(Material $material): float
    {
        $reserved = static::getTotalReservedForMaterial($material->id);
        return max(0, $material->current_stock - $reserved);
    }

    /**
     * Check if enough stock is available for a reservation.
     */
    public static function hasEnoughStock(int $materialId, float $quantity): bool
    {
        $material = Material::find($materialId);
        if (!$material) {
            return false;
        }

        $available = static::getAvailableStock($material);
        return $available >= $quantity;
    }

    /**
     * Mark reservation as deducted.
     */
    public function markAsDeducted(?int $userId = null): bool
    {
        return $this->update([
            'status' => self::STATUS_DEDUCTED,
            'deducted_at' => now(),
            'deducted_by' => $userId ?? auth()->id(),
        ]);
    }

    /**
     * Mark reservation as released (order cancelled).
     */
    public function markAsReleased(?int $userId = null, ?string $reason = null): bool
    {
        return $this->update([
            'status' => self::STATUS_RELEASED,
            'released_at' => now(),
            'released_by' => $userId ?? auth()->id(),
            'notes' => $reason ?? $this->notes,
        ]);
    }

    /**
     * Check if this reservation is active (reserved).
     */
    public function isReserved(): bool
    {
        return $this->status === self::STATUS_RESERVED;
    }

    /**
     * Check if this reservation has been deducted.
     */
    public function isDeducted(): bool
    {
        return $this->status === self::STATUS_DEDUCTED;
    }

    /**
     * Check if this reservation has been released.
     */
    public function isReleased(): bool
    {
        return $this->status === self::STATUS_RELEASED;
    }
}
