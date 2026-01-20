<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    use HasFactory;

    protected $fillable = [
        'external_id',
        'reference',
        'name',
        'description',
        'unit',
        'purchase_price',
        'supplier_id',
        'secondary_supplier_id',
        'category_id',
        'image_path',
        'unit_conversions',
        'lead_time_days',
        'current_stock',
        'minimum_stock',
        'purchase_multiple',
        'weight_per_unit',
        'is_active',
    ];

    protected $casts = [
        'purchase_price' => 'decimal:2',
        'current_stock' => 'decimal:3',
        'minimum_stock' => 'decimal:3',
        'weight_per_unit' => 'decimal:3',
        'is_active' => 'boolean',
        'lead_time_days' => 'integer',
        'purchase_multiple' => 'integer',
        'unit_conversions' => 'array',
    ];

    // Relationships
    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id');
    }

    public function secondarySupplier()
    {
        return $this->belongsTo(Supplier::class, 'secondary_supplier_id');
    }

    public function category()
    {
        return $this->belongsTo(MaterialCategory::class, 'category_id');
    }

    public function inventoryTransactions()
    {
        return $this->hasMany(InventoryTransaction::class);
    }

    public function stockReservations()
    {
        return $this->hasMany(StockReservation::class);
    }

    public function activeReservations()
    {
        return $this->hasMany(StockReservation::class)->where('status', 'reserved');
    }

    /**
     * Get total reserved quantity for this material.
     */
    public function getReservedStockAttribute(): float
    {
        return (float) $this->activeReservations()->sum('quantity_reserved');
    }

    /**
     * Get available stock (current stock - reserved).
     */
    public function getAvailableStockAttribute(): float
    {
        return max(0, (float) $this->current_stock - $this->reserved_stock);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeLowStock($query)
    {
        return $query->whereColumn('current_stock', '<=', 'minimum_stock');
    }

    // Accessors & Mutators
    public function getIsLowStockAttribute()
    {
        return $this->current_stock <= $this->minimum_stock;
    }

    public function getStockStatusAttribute()
    {
        if ($this->current_stock <= 0) {
            return 'out_of_stock';
        } elseif ($this->current_stock <= $this->minimum_stock) {
            return 'low_stock';
        }
        return 'in_stock';
    }

    public function getFormattedPriceAttribute()
    {
        return 'R$ ' . number_format($this->purchase_price, 2, ',', '.');
    }

    public function getStockDisplayAttribute()
    {
        return number_format($this->current_stock, 3, ',', '.') . ' ' . $this->unit;
    }

    // Business Methods
    public function adjustStock($quantity, $type = 'adjustment', $reference = null, $notes = null)
    {
        $oldStock = $this->current_stock;
        $this->current_stock += $quantity;
        $this->save();

        // Create transaction record
        $this->inventoryTransactions()->create([
            'type' => $type,
            'quantity' => $quantity,
            'reference' => $reference,
            'notes' => $notes,
            'user_id' => auth()->id() ?? 1,
        ]);

        return $this;
    }

    public function consumeStock($quantity, $reference = null)
    {
        return $this->adjustStock(-$quantity, 'consumption', $reference);
    }

    public function addStock($quantity, $unitCost = null, $reference = null)
    {
        $transaction = $this->adjustStock($quantity, 'purchase', $reference);

        if ($unitCost) {
            $this->inventoryTransactions()->latest()->first()->update([
                'unit_cost' => $unitCost
            ]);
        }

        return $transaction;
    }
}