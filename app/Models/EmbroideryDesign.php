<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EmbroideryDesign extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'category',
        'image_url',
        'design_file_url',
        'additional_cost',
        'is_active',
        'sort_order',
        'compatible_positions',
        'compatible_colors',
    ];

    protected $casts = [
        'additional_cost' => 'decimal:2',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'compatible_positions' => 'array',
        'compatible_colors' => 'array',
    ];

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class, 'embroidery_design_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public static function getCategories()
    {
        return self::distinct()->pluck('category')->filter()->sort()->values();
    }
}