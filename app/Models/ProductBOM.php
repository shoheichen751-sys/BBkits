<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductBOM extends Model
{
    use HasFactory;

    protected $table = 'product_boms';

    protected $fillable = [
        'product_id',
        'material_id',
        'quantity',
        'unit',
        'notes',
        'is_active',
    ];

    protected $casts = [
        'quantity' => 'decimal:3',
        'is_active' => 'boolean',
    ];

    /**
     * Get the product that this BOM entry belongs to.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the material required for this BOM entry.
     */
    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class);
    }

    /**
     * Get size/color variants for this BOM entry.
     */
    public function variants(): HasMany
    {
        return $this->hasMany(ProductBOMVariant::class, 'product_bom_id');
    }

    /**
     * Get the quantity for a specific size/color combination.
     * Returns variant quantity if exists, otherwise base quantity.
     */
    public function getQuantityFor(?string $size = null, ?string $color = null): float
    {
        $variant = $this->variants()
            ->where(function ($query) use ($size, $color) {
                if ($size) {
                    $query->where('size', $size);
                }
                if ($color) {
                    $query->where('color', $color);
                }
            })
            ->first();

        if ($variant && $variant->quantity_override !== null) {
            return (float) $variant->quantity_override;
        }

        return (float) $this->quantity;
    }

    /**
     * Get the material for a specific color.
     * Returns variant material if exists, otherwise base material.
     */
    public function getMaterialFor(?string $color = null): Material
    {
        if ($color) {
            $variant = $this->variants()
                ->where('color', $color)
                ->whereNotNull('material_id_override')
                ->first();

            if ($variant && $variant->materialOverride) {
                return $variant->materialOverride;
            }
        }

        return $this->material;
    }

    /**
     * Check if this BOM entry has any variants.
     */
    public function hasVariants(): bool
    {
        return $this->variants()->count() > 0;
    }

    /**
     * Scope to get only active BOM entries.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
