<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmbroideryPosition extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name',
        'description',
        'additional_cost',
        'is_active',
        'sort_order',
        'preview_image',
        'compatible_products',
    ];

    protected $casts = [
        'additional_cost' => 'decimal:2',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'compatible_products' => 'array',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    public function isCompatibleWith($productId)
    {
        if (empty($this->compatible_products)) {
            return true;
        }
        
        return in_array($productId, $this->compatible_products);
    }
}