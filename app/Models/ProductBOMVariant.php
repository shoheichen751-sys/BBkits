<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductBOMVariant extends Model
{
    use HasFactory;

    protected $table = 'product_bom_variants';

    protected $fillable = [
        'product_bom_id',
        'size',
        'color',
        'quantity_override',
        'material_id_override',
    ];

    protected $casts = [
        'quantity_override' => 'decimal:3',
    ];

    /**
     * Get the parent BOM entry.
     */
    public function productBom(): BelongsTo
    {
        return $this->belongsTo(ProductBOM::class, 'product_bom_id');
    }

    /**
     * Alias for productBom relationship.
     */
    public function bom(): BelongsTo
    {
        return $this->productBom();
    }

    /**
     * Get the override material (if specified).
     */
    public function materialOverride(): BelongsTo
    {
        return $this->belongsTo(Material::class, 'material_id_override');
    }

    /**
     * Get the effective quantity (override or parent's base).
     */
    public function getEffectiveQuantity(): float
    {
        if ($this->quantity_override !== null) {
            return (float) $this->quantity_override;
        }

        return (float) $this->productBom->quantity;
    }

    /**
     * Get the effective material (override or parent's base).
     */
    public function getEffectiveMaterial(): Material
    {
        if ($this->material_id_override && $this->materialOverride) {
            return $this->materialOverride;
        }

        return $this->productBom->material;
    }

    /**
     * Check if this variant has a quantity override.
     */
    public function hasQuantityOverride(): bool
    {
        return $this->quantity_override !== null;
    }

    /**
     * Check if this variant has a material override.
     */
    public function hasMaterialOverride(): bool
    {
        return $this->material_id_override !== null;
    }
}
