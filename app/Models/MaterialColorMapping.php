<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaterialColorMapping extends Model
{
    use HasFactory;

    protected $table = 'material_color_mappings';

    protected $fillable = [
        'product_color',
        'base_material_id',
        'target_material_id',
        'notes',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the base material (generic material in BOM).
     */
    public function baseMaterial(): BelongsTo
    {
        return $this->belongsTo(Material::class, 'base_material_id');
    }

    /**
     * Get the target material (specific colored material).
     */
    public function targetMaterial(): BelongsTo
    {
        return $this->belongsTo(Material::class, 'target_material_id');
    }

    /**
     * Find the mapped material for a given color and base material.
     *
     * @param string $productColor The product color (e.g., "Rosa")
     * @param int $baseMaterialId The base material ID from BOM
     * @return Material|null The target material or null if no mapping exists
     */
    public static function findMappedMaterial(string $productColor, int $baseMaterialId): ?Material
    {
        $mapping = static::where('product_color', $productColor)
            ->where('base_material_id', $baseMaterialId)
            ->where('is_active', true)
            ->first();

        return $mapping?->targetMaterial;
    }

    /**
     * Get the effective material for a BOM entry considering color mapping.
     *
     * @param int $baseMaterialId The base material ID from BOM
     * @param string|null $productColor The product color (optional)
     * @return Material The material to use (mapped or original)
     */
    public static function getEffectiveMaterial(int $baseMaterialId, ?string $productColor): Material
    {
        // If no color specified, return the base material
        if (empty($productColor)) {
            return Material::findOrFail($baseMaterialId);
        }

        // Try to find a color mapping
        $mappedMaterial = static::findMappedMaterial($productColor, $baseMaterialId);

        // Return mapped material if found, otherwise return base material
        return $mappedMaterial ?? Material::findOrFail($baseMaterialId);
    }

    /**
     * Get all unique product colors from existing mappings.
     */
    public static function getUniqueColors(): array
    {
        return static::distinct()->pluck('product_color')->toArray();
    }

    /**
     * Get all mappings for a specific color.
     */
    public static function getMappingsForColor(string $productColor)
    {
        return static::where('product_color', $productColor)
            ->where('is_active', true)
            ->with(['baseMaterial', 'targetMaterial'])
            ->get();
    }

    /**
     * Scope for active mappings only.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
