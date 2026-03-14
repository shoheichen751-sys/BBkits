<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PricingFormula extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'product_category_id',
        'formula_config',
        'target_margin_percent',
        'minimum_price',
        'is_default',
        'is_active',
        'priority',
    ];

    protected $casts = [
        'formula_config' => 'array',
        'target_margin_percent' => 'decimal:2',
        'minimum_price' => 'decimal:2',
        'is_default' => 'boolean',
        'is_active' => 'boolean',
        'priority' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($formula) {
            if (empty($formula->slug)) {
                $formula->slug = Str::slug($formula->name);
            }
        });

        static::saving(function ($formula) {
            // Ensure only one default formula per category
            if ($formula->is_default) {
                static::where('id', '!=', $formula->id ?? 0)
                    ->where('product_category_id', $formula->product_category_id)
                    ->update(['is_default' => false]);
            }
        });
    }

    // Relationships
    public function productCategory()
    {
        return $this->belongsTo(ProductCategory::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeForCategory($query, $categoryId)
    {
        return $query->where(function ($q) use ($categoryId) {
            $q->where('product_category_id', $categoryId)
              ->orWhereNull('product_category_id');
        });
    }

    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    // Business Methods
    public function calculate(float $materialCost, array $variables = []): float
    {
        $config = $this->formula_config;
        $price = $materialCost;

        // Apply markup multiplier
        if (isset($config['markup'])) {
            $price *= (float) $config['markup'];
        }

        // Add overhead cost
        if (isset($config['overhead'])) {
            $price += (float) $config['overhead'];
        }

        // Add embroidery cost if applicable
        if (isset($config['embroidery_multiplier']) && isset($variables['embroidery_cost'])) {
            $price += $variables['embroidery_cost'] * (float) $config['embroidery_multiplier'];
        }

        // Apply category multiplier
        if (isset($config['category_multipliers']) && isset($variables['category'])) {
            $categoryMultiplier = $config['category_multipliers'][$variables['category']] ?? 1.0;
            $price *= (float) $categoryMultiplier;
        }

        // Apply quantity discount
        if (isset($config['quantity_discounts']) && isset($variables['quantity'])) {
            foreach ($config['quantity_discounts'] as $threshold => $discount) {
                if ($variables['quantity'] >= (int) $threshold) {
                    $price *= (1 - (float) $discount / 100);
                }
            }
        }

        // Ensure minimum price
        if ($this->minimum_price && $price < $this->minimum_price) {
            $price = $this->minimum_price;
        }

        return round($price, 2);
    }

    public function calculateWithTargetMargin(float $materialCost): float
    {
        if (!$this->target_margin_percent) {
            return $this->calculate($materialCost);
        }

        // Price = Cost / (1 - Margin%)
        $price = $materialCost / (1 - ($this->target_margin_percent / 100));

        return max($price, $this->minimum_price ?? 0);
    }

    public function applyToProduct(Product $product): float
    {
        $costService = app(\App\Services\ProductCostService::class);
        $costData = $costService->calculateProductCost($product);
        $materialCost = $costData['material_cost'];

        $variables = [
            'category' => $product->productCategory?->slug ?? 'standard',
            'embroidery_cost' => $product->allows_embroidery ? ($this->formula_config['default_embroidery_cost'] ?? 0) : 0,
        ];

        $calculatedPrice = $this->calculate($materialCost, $variables);

        $product->update([
            'calculated_price' => $calculatedPrice,
            'pricing_formula_id' => $this->id,
            'price_calculated_at' => now(),
        ]);

        return $calculatedPrice;
    }

    // Static Methods
    public static function getDefaultFormula(?int $categoryId = null): ?self
    {
        return static::active()
            ->forCategory($categoryId)
            ->default()
            ->orderBy('priority', 'desc')
            ->first();
    }

    public static function getFormulaFor(Product $product): ?self
    {
        // First check if product has a specific formula
        if ($product->pricing_formula_id) {
            return $product->pricingFormula;
        }

        // Then look for category-specific default
        return static::getDefaultFormula($product->category_id);
    }
}
