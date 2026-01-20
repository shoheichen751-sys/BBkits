<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'description',
        'price',
        'category',
        'image_url',
        'allows_embroidery',
        'available_sizes',
        'available_colors',
        'is_active',
        'stock_quantity',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'allows_embroidery' => 'boolean',
        'is_active' => 'boolean',
        'available_sizes' => 'array',
        'available_colors' => 'array',
        'stock_quantity' => 'integer',
    ];

    public function saleProducts()
    {
        return $this->hasMany(SaleProduct::class);
    }

    public function sales()
    {
        return $this->belongsToMany(Sale::class, 'sale_products')
                    ->withPivot([
                        'quantity', 
                        'size', 
                        'product_color', 
                        'unit_price',
                        'has_embroidery',
                        'embroidery_text',
                        'embroidery_font_id',
                        'embroidery_color_id',
                        'embroidery_position',
                        'embroidery_cost'
                    ])
                    ->withTimestamps();
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeAllowsEmbroidery($query)
    {
        return $query->where('allows_embroidery', true);
    }

    public function productCategory(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class, 'category_id');
    }

    public function sizes(): HasMany
    {
        return $this->hasMany(ProductSize::class)->orderBy('sort_order');
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function isInStock()
    {
        return $this->stock_quantity > 0;
    }

    public function hasSize($size)
    {
        return in_array($size, $this->available_sizes ?? []);
    }

    public function hasColor($color)
    {
        return in_array($color, $this->available_colors ?? []);
    }

    /**
     * Get the BOM (Bill of Materials) entries for this product.
     */
    public function bom(): HasMany
    {
        return $this->hasMany(ProductBOM::class);
    }

    /**
     * Get only active BOM entries.
     */
    public function activeBom(): HasMany
    {
        return $this->hasMany(ProductBOM::class)->where('is_active', true);
    }

    /**
     * Check if this product has a BOM defined.
     */
    public function hasBOM(): bool
    {
        return $this->bom()->count() > 0;
    }

    /**
     * Check if this product has a complete BOM (at least one entry).
     */
    public function hasCompleteBOM(): bool
    {
        return $this->activeBom()->count() > 0;
    }

    /**
     * Calculate all materials needed for a specific size/color combination.
     * Returns array of [material_id => ['material' => Material, 'quantity' => float, 'unit' => string]]
     */
    public function calculateMaterialsNeeded(?string $size = null, ?string $color = null, int $quantity = 1): array
    {
        $materials = [];

        foreach ($this->activeBom()->with(['material', 'variants'])->get() as $bomEntry) {
            $material = $bomEntry->getMaterialFor($color);
            $qty = $bomEntry->getQuantityFor($size, $color) * $quantity;

            $materialId = $material->id;

            if (isset($materials[$materialId])) {
                $materials[$materialId]['quantity'] += $qty;
            } else {
                $materials[$materialId] = [
                    'material' => $material,
                    'quantity' => $qty,
                    'unit' => $bomEntry->unit,
                ];
            }
        }

        return $materials;
    }
}